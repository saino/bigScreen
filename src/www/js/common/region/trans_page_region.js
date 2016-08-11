// 文件名称: animate_region
//
// 创 建 人: chenshy
// 创建日期: 2015/7/22 18:29
// 描    述: 负责页间转场动画
define([
    'marionette',
    'common/base/ViewManager'
],function(Marionette,viewManager){

   var defaultAnimation = "cover";
   return Marionette.Region.extend({
       show: function (viewClass, options) {
           var self = this;
//            try{
                //console.log("come");
                if (!self._ensureElement()) {
                    return;
                }
                //console.log(this.isTransing);
                if(window.isTransing){
                    //this.isTransing = false;
                    return;
                }

                var view = viewManager.getViewInstance(viewClass,options);

                //console.log(view);

                window.isTransing = true;

                self._isReverse = false;

                self._ensureViewIsIntact(view);

                //如果是不同的view或者强制显示下一个view,才显示下一个view
                var _shouldShowView = view !== self.currentView;

                self.showingView = view;

                if (_shouldShowView) {

                    //view.once('destroy', this.empty, this);
                    //console.log(view.isRendered);
                    if(!view.isRendered){
                        view.render();
                        view.isRendered = true;


                    }

                    if(!view.el.parentNode) {
                        self.openView(view);
                    }

                    view._parent = self;

                    //动画
                    view.$el.addClass("initLeft_100");
                    if(view.show){
                        view.show();
                    }
                    _.delay(function(){
                        self.changePage(self.currentView,view);
                    },0);

                    return self;
                }else{
                    window.isTransing = false;
                }
//            }catch(e){
//                debug.log("trans_page_region 72" + e);
//            }
           return self;
       },

       //var reverse = Backbone.history.isBackHistory();

       /**
        * 关闭视图
        * @param view
        */
       closeView : function(view){

       },

       /**
        * 打开视图
        * @param view
        */
       openView : function(view){
           this.el.appendChild(view.el);
           //this.attachHtml(view);
       },

       changePage : function(fromPage,toPage){
           var self = this;
//           try{
               self._pageCount = 0;
               self._a_ended = 0;
               if(fromPage){
                   self._pageCount++;
                   self.animationEndOn(fromPage);
               }
               if(toPage){
                   self._pageCount++;
                   self.animationEndOn(toPage);
               }
               //reverse = reverse||this.isRverseBool(toPage,this.prePage);
               self.transition(fromPage,toPage);
//           }catch(e){
//                debug.log("changePage 112" + e);
//           }
       },

       transition : function(fromPage,toPage){
           var self = this;
//           try{
               var reverse = self._isReverse = Backbone.history.isBackHistory();

               //console.log("reverse",reverse);
               var reverseClass = reverse ? " reverse" : "";

               var $el;

               var name;

               if(reverse){
                   name = fromPage ? fromPage.getOption("page-animation") : "";
               }else{
                   name = toPage ? toPage.getOption("page-animation") : "";
               }

               var animation = Backbone.history.getAnimation();

               if(animation){
                   name = animation;
               }

               if(!name){
                   name = defaultAnimation;
               }

//           console.log("rever",reverse);

               //console.log(fromPage,toPage,reverse);

               var zIndex = 10;
               if(fromPage){
                   zIndex = Number(fromPage.$el.css("zIndex"));
               }

               if(fromPage){
                   $el = fromPage.$el;
                   //fromPage.el.style.zIndex = 10;
                   //
                   //fromPage.el.style.backgroundColor = "#000";
                   //console.log("idddd:",fromPage.el.id);
                   //$el.addClass(name + " out" + reverseClass);//.css("z-index",reverse ? (zIndex + 1) : (zIndex - 1))
                   $el.css("z-index",reverse ? "10" : "9").addClass(name + " out" + reverseClass);
               }

               if(toPage){
                   $el = toPage.$el;
                   //setTimeout(function(){
                   //$el.addClass(name + " in" + reverseClass);
                   $el.css("z-index",reverse ? "9" : "10").addClass(name + " in" + reverseClass);
                   $el.removeClass("hide");
                   $el.addClass("show");
                   //},0);
               }
//           }catch(e){
//               debug.log("changePage 173" + e);
//           }
       },
       /*
        * 动画完成之后
        * page : 指定的触发页面
        */
       animationEndOn : function(page){
           var self = this;
           //page.$el.off("webkitAnimationEnd");
           //var ended = false;
//           console.log("on");
//           try{
               page.$el.one("webkitAnimationEnd",function(e){
                   //console.log("end");
                   self._pageCount--;
                   var $el = $(this);
                   var ino = $el.attr("class");
                   $el.addClass("hide");
                   if(ino.indexOf(" in") > 0 ){
                       $el.removeClass();
                       $el.addClass("ui_view_transitioning ui_page");
                   } else {
                       $el.removeClass(function(index,oldclass){
                           return oldclass.replace(/hide/," ");
                       });
                       $el.addClass("ui_view_transitioning ui_page hide");
                   }

                   //page.$el.off("webkitAnimationEnd");
//               console.log("pageCount:",self._pageCount);
                   if(self._pageCount <= 0){
                       //self.animationEnd();
                   }

                   if(self._a_ended == 0){
                       self.animationEnd();

                   }

                   self._a_ended++;
               });
//           }catch(e){
//               debug.log("animationEndOn 216" + e);
//           }
       },

       __empty : function(){
//           console.log(this.currentView);
           this.empty();
//           console.log(this.currentView);

       },

       animationEnd : function(){
           var self = this;
//           try{
               window.isTransing = false;
               if(self.currentView){
                   delete self.currentView._parent;
                   if(self.currentView.close){
                       self.currentView.close();
                       //
                   }
                   var forever = self.currentView.getOption("forever");
                   if(forever === false){
                       //console.log("fasle");
                       viewManager.destroyView(self.currentView);
                   }else if(forever === true){

                   }else{
//                   this.currentView.$el.detach();
                   }
                   // console.log("end");
                   //
                   //if (_shouldDestroyView) {
                   //    this.__empty();
                   //
                   //}

                   self.currentView = null;
                   delete self.currentView;
               }

               self.currentView = self.showingView;
               if(self.showingView && self.showingView.pageIn){
                   self.showingView.pageIn();
               }

               self.showingView = null;
               delete self.showingView;
//           }catch(e){
//                debug.log("animationEnd 268" + e)
//           }
       }
   });
});