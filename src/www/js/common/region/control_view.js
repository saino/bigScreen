// 文件名称: transitoin_view
//
// 创 建 人: chenshy
// 创建日期: 2015/7/24 16:05
// 描    述: 操作view的控制器，负责显示view,关闭view,销毁view
define([
    'marionette',
    'common/base/ViewUtils'
],function(mn,viewUtils){
    var fn = function(parentView){
        this.parentView = parentView;
        this.type = "ControlView";
    };

    fn.prototype = {
        show : function(view){
            if(view._isShown){
                return;
            }

            view._isShown = true;

            if(!view.isRendered){
                view.render();
                view.isRendered = true;
            }

//            if(view._controlRegion){
//                if(view._controlRegion.parentView){
//                    view._controlRegion.parentView.removeControlView(view);
//                }
//                view._controlRegion = this;
//            }
//
//            this.parentView.addControlView(view);

            if(view.el.parentNode){
                view.el.parentNode.removeChild(view.el);
            }

            this.parentView.el.appendChild(view.el);

            var $el = view.$el;

            if(view.show){
                view.show();
            }

            if(view["page-animation"]){
                var className = view["page-animation"];
                _.delay(function(){
                    $el.addClass(className);
                },0);
                $el.off("webkitAnimationEnd");
                $el.on("webkitAnimationEnd",function(){
                    if(view.pageIn){
                        view.pageIn();
                    }

                    $el.removeClass(className);
                    $el.off("webkitAnimationEnd");
                });
            }else{
                if(view.pageIn){
                    view.pageIn();
                }
            }
        },
        hide : function(view){
            view._isShown = false;
            if(view.close){
                view.close();
            }
        },
        empty : function(view){
            viewUtils.empty(view);
        },

        destroy : function(){
            this.parentView = null;
            delete this.parentView;
        }
    };

    return fn;
});