// 文件名称: home.js
//
// 创 建 人: liubiao
// 创建日期: 2016/07/15 10:08
// 描    述: home.js
define([
    'common/base/base_view',
    'text!module/home/templates/home.html',
    'marionette',
    'module/home/model/homeModel'
],function(BaseView, tpl, mn, homeModel) {
    return BaseView.extend({
        id : "home",

        template : _.template(tpl),

        _mouseLock : false,
        _isShow : false,
        forever : true,
        bannerSwiper: null,             //广告滑屏组件,

        bannerData: null,               //广告数据
        bookTypeData: null,             //图书分类数据
        newspaperTypeData: null,        //报纸分类数据
        journalsTypeData: null,         //刊物分类数据
        recommendBookData: null,        //推荐数据数据
        recommendNewspaperData: null,   //推荐报纸数据
        recommendJournalsData: null,    //推荐刊物数据

        ONEDAY: 86400000,               //一天的毫秒数
        timeStamp: null,                //数据的时间戳
        // key : selector
        ui : {

            banner: "#banner",
            bannerIndex: "#banner-index",
            //bannerImg: ".bannerImg",

            book: "#book",                          //书籍
            newspaper: "#newspaper",                //报纸
            journals: "#journals",                  //刊物

            bookType: "#book-type",                 //书籍分类
            newspaperType: "#newspaper-type",       //报纸分类
            journalsType: "#journals-type",         //刊物分类

            typeName: ".type",                      //分类按钮

            recommend: "#recommend"
        },
        //事件添加
        events : {
            "tap @ui.banner": "onBannerHandler",        //点击广告banner
            "tap @ui.book": "onSelfTypeHandler",        //点击书籍事件
            "tap @ui.newspaper": "onSelfTypeHandler",   //点击报纸事件
            "tap @ui.journals": "onSelfTypeHandler",    //点击刊物事件
            "tap @ui.typeName": "onTypeNameHandler",    //点击类别按钮
            "tap @ui.recommend": "onRecommendHandler"
        },

        /**初始化**/
        initialize : function(){
            //var self = this;
            //self.initData();
            //获取Mac地址
//            var contact = new Contact();
//            contact.getMacAddress(function(success){
//                utils.mac = success;
////                alert("getMacAddress success");
////                alert(success);
//            }, function(error){
////                alert("getMacAddress error");
////                alert(error);
//            });
            //
            ////获取IP地址
            //contact.getIpAddress(function(success){
            //    alert("getIpAddress success");
            //    alert(success);
            //}, function(error){
            //    alert("getIpAddress error");
            //    alert(error);
            //});
            //
            ////获取设备ID
            //contact.getDeviceId (function(success){
            //    alert("getDeviceId  success");
            //    alert(success);
            //}, function(error){
            //    alert("getDeviceId  error");
            //    alert(error);
            //});
        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
            //$("#qr-code").qrcode("www.baidu.com");

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;

            //获取图书详细页dom
            self.bookDetailMessageFloatLayout = $("#book-detail-message-float-layout");

            //给图书详细页添加事件处理
            self.bookDetailMessageFloatLayout && self.bookDetailMessageFloatLayout.on("tap", function(event){
                event.preventDefault();
                event.stopPropagation();
                utils.eventClick();
                self.bookDetailMessageFloatLayout.hide();
            });

        },

        /**
         * 初始化数据
         */
        initData: function(){
            var self = this;

            // 获取当前时间
            self.timeStamp = new Date().getTime();

            //初始化数据
            homeModel.getHomeData(function(homeData){
                //console.log(homeData,"xxxxxxx");
                if(homeData && homeData.meta && homeData.meta.success && homeData.data){
                    var data = homeData.data;
                    self.bannerData = data.Advertisement;                                //广告数据
                    self.bookTypeData = data.ContentCategory.Book;                  //图书分类数据
                    self.newspaperTypeData = data.ContentCategory.Newspaper;        //报纸分类数据
                    self.journalsTypeData = data.ContentCategory.Publication;       //刊物分类数据
                    self.recommendBookData = data.ContentHot.Book;                  //推荐数据数据
                    self.recommendNewspaperData = data.ContentHot.Newspaper;        //推荐报纸数据
                    self.recommendJournalsData = data.ContentHot.Publication;       //推荐刊物数据

                    utils.bookTypeData = self.bookTypeData;
                    utils.newspaperTypeData = self.newspaperTypeData;
                    utils.journalsTypeData = self.journalsTypeData;
                    utils.bookUrl = data.bookUrl;

                    self.initHome();
                }else{
                    console.log(error,"失败");
                    self.initHome();
                }

            },function(error){
                console.log(error,"失败");
                self.initHome();
            });
        },

        /**
         * 初始化首页
         */
        initHome: function(){
            var self = this;

            //初始化广告banner
            self.initBanner();

            //初始化分类
            self.initType();

            //初始化推荐
            self.initRecommend();
        },

        /**
         * 初始化广告banner
         */
        initBanner: function(){
            var self = this;
            if(!self.bannerData){ return;}

            var bannerHtml = "";
            var bannerIndexPoindHtml = "";
            for(var i=0; i<self.bannerData.length; i++){
                bannerHtml += '<div data-url="'+ self.bannerData[i].url+'" style="height:100%; width:100%; background: url('+self.bannerData[i].pic+') no-repeat center; background-size: cover;" class="bannerImg"></div>';
                if(!i){
                    bannerIndexPoindHtml += '<div id="banner-index-'+ i +'" class="banner-index-point banner-index-point-selected"></div>';
                }else{
                    bannerIndexPoindHtml += '<div id="banner-index-'+ i +'" class="banner-index-point"></div>';
                }
            }
            self.ui.banner.html(bannerHtml);
            //console.log(self.bannerData.length);
            var bannerIndexWidth = self.bannerData.length * 66 - 42;
            self.ui.bannerIndex.css({"width": bannerIndexWidth+"px", "margin-left": "calc(50% - "+(bannerIndexWidth/2)+"px)"});
            self.ui.bannerIndex.html(bannerIndexPoindHtml);

            if(self.bannerData.length) {
                self.bannerSwiper = new pageSwitch(self.ui.banner.get(0), {
                    duration: 1000,           //int 页面过渡时间
                    direction: 0,            //int 页面切换方向，0横向，1纵向
                    start: 0,                //int 默认显示页面
                    loop: true,             //bool 是否循环切换
                    ease: 'ease',            //string|function 过渡曲线动画，详见下方说明
                    transition: 'scrollX',    //string|function转场方式，详见下方说明
                    freeze: false,           //bool 是否冻结页面（冻结后不可响应用户操作，可以通过 `.freeze(false)` 方法来解冻）
                    mouse: true,             //bool 是否启用鼠标拖拽
                    mousewheel: false,       //bool 是否启用鼠标滚轮切换
                    autoplay: true,
                    interval: 2000
                });
                self.bannerSwiper.play();

                //绑定滑动开始时的事件
                self.bannerSwiper.on("before", function(){
                    var selected = $.find(".banner-index-point-selected")[0];
                    if(selected){
                        selected.setAttribute("class", "banner-index-point");
                        //self.currentPageIndex = selected.innerHTML;
                    }
                });
                self.bannerSwiper.on("after", function() {
                    //下一个将要被选中的页码
                    var nextPageIndex = self.bannerSwiper.current;

                    var selected = $.find("#banner-index-" + nextPageIndex)[0];
                    if(selected){
                        selected.setAttribute("class", "banner-index-point banner-index-point-selected");
                        //selected.innerHTML = nextPageIndex;
                    }
                });
            }
        },
        /**
         * 初始化分类
         */
        initType: function(){
            var self = this;

            // 初始化书籍类别
            var type = '<div class="type-icon"></div>';
            if(self.bookTypeData) {
                for (var i = 0; i < self.bookTypeData.length; i++) {
                    type += '<div class="type-name" data-label="' + self.bookTypeData[i].label + '" data-type="' + self.bookTypeData[i].type + '">' + self.bookTypeData[i].name + '</div>';
                }
            }
            self.ui.bookType.html(type);

            // 初始化报纸类别
            type = '<div class="type-icon"></div>';
            if(self.newspaperTypeData) {
                for (var i = 0; i < self.newspaperTypeData.length; i++) {
                    type += '<div class="type-name" data-label="' + self.newspaperTypeData[i].label + '" data-type="' + self.newspaperTypeData[i].type + '">' + self.newspaperTypeData[i].name + '</div>';
                }
            }
            self.ui.newspaperType.html(type);

            // 初始化刊物类别
            type = '<div class="type-icon"></div>';
            if(self.journalsTypeData) {
                for (var i = 0; i < self.journalsTypeData.length; i++) {
                    type += '<div class="type-name" data-label="' + self.journalsTypeData[i].label + '" data-type="' + self.journalsTypeData[i].type + '">' + self.journalsTypeData[i].name + '</div>';
                }
            }
            self.ui.journalsType.html(type);

            self.ui.bookType.hide();
            self.ui.newspaperType.hide();
            self.ui.journalsType.hide();
        },

        /**
         * 初始化推荐
         */
        initRecommend: function(){
            var self = this;

            //初始化推荐图书
            var recommendBookContent = $("#recommend-book").find(".recommend-content");
            var recommendBookFooter = $("#recommend-book").find(".recommend-footer");
            var recommendContentHtml = "";
            var recommendFooterHtml = "";
            if(self.recommendBookData){
                for(var i=0; i<self.recommendBookData.length && i<3; i++){
                    recommendContentHtml += '<div class="recommend-0'+ (i+1) +'" data-author="'+ self.recommendBookData[i].author + '" data-name="'+ self.recommendBookData[i].name
                        +'" data-cover="'+ self.recommendBookData[i].cover +'" data-brief="'+ self.recommendBookData[i].brief +'" data-publisher="'+ self.recommendBookData[i].publisher
                        +'" data-publishtime="'+ self.recommendBookData[i].publishTime +'" style="background-image: url('+ self.recommendBookData[i].cover
                        +')" data-pagesnum="'+ self.recommendBookData[i].pagesNum +'" data-url="'+ self.recommendBookData[i].url +'" data-id="'+self.recommendBookData[i].id+'"></div>';
                    recommendFooterHtml += '<div class="recommend-0'+(i+1)+'-describe"><div class="book-name">'+ self.recommendBookData[i].name +'</div> <div class="book-author">'+ self.recommendBookData[i].author +'</div> </div>';
                }
            }
            recommendBookContent.html(recommendContentHtml);
            recommendBookFooter.html(recommendFooterHtml);

            //初始化推荐报纸
            var recommendNewspaperContent = $("#recommend-newspaper").find(".recommend-content");
            var recommendNewspaperFooter = $("#recommend-newspaper").find(".recommend-footer");
            var recommendContentHtml = "";
            var recommendFooterHtml = "";
            if(self.recommendNewspaperData){
                for(var i=0; i<self.recommendNewspaperData.length && i<3; i++){
                    recommendContentHtml += '<div class="recommend-0'+ (i+1) +'" data-author="'+ self.recommendNewspaperData[i].author + '" data-name="'+ self.recommendNewspaperData[i].name
                        +'" data-cover="'+ self.recommendNewspaperData[i].cover +'" data-brief="'+ self.recommendNewspaperData[i].brief +'" data-publisher="'+ self.recommendNewspaperData[i].publisher
                        +'" data-publishtime="'+ self.recommendNewspaperData[i].publishTime +'" style="background-image: url('+ self.recommendNewspaperData[i].cover
                        +')" data-pagesnum="'+ self.recommendNewspaperData[i].pagesNum +'" data-url="'+ self.recommendNewspaperData[i].url +'" data-id="'+self.recommendNewspaperData[i].id+'"></div>';
                    recommendFooterHtml += '<div class="recommend-0'+(i+1)+'-describe"><div class="book-name">'+ self.recommendNewspaperData[i].name +'</div> <div class="book-author">'+ self.recommendNewspaperData[i].author +'</div> </div>';
                }
            }
            recommendNewspaperContent.html(recommendContentHtml);
            recommendNewspaperFooter.html(recommendFooterHtml);

            //初始化推荐刊物
            var recommendJournalsContent = $("#recommend-journals").find(".recommend-content");
            var recommendJournalsFooter = $("#recommend-journals").find(".recommend-footer");
            var recommendContentHtml = "";
            var recommendFooterHtml = "";
            if(self.recommendJournalsData){
                for(var i=0; i<self.recommendJournalsData.length && i<3; i++){
                    recommendContentHtml += '<div class="recommend-0'+ (i+1) +'" data-author="'+ self.recommendJournalsData[i].author + '" data-name="'+ self.recommendJournalsData[i].name
                        +'" data-cover="'+ self.recommendJournalsData[i].cover +'" data-brief="'+ self.recommendJournalsData[i].brief +'" data-publisher="'+ self.recommendJournalsData[i].publisher
                        +'" data-publishtime="'+ self.recommendJournalsData[i].publishTime +'" style="background-image: url('+ self.recommendJournalsData[i].cover
                        +')" data-pagesnum="'+ self.recommendJournalsData[i].pagesNum +'" data-url="'+ self.recommendJournalsData[i].url +'" data-id="'+self.recommendJournalsData[i].id+'"></div>';
                    recommendFooterHtml += '<div class="recommend-0'+(i+1)+'-describe"><div class="book-name">'+ self.recommendJournalsData[i].name +'</div> <div class="book-author">'+ self.recommendJournalsData[i].author +'</div> </div>';
                }
            }
            recommendJournalsContent.html(recommendContentHtml);
            recommendJournalsFooter.html(recommendFooterHtml);
        },

        show: function() {
            var self = this;

            var nowTimeStamp = new Date().getTime();
            if(utils.mac){
                //如果上次获取时间不超过1天就直接使用缓存数据
                if(self.timeStamp && (nowTimeStamp  - self.timeStamp < self.ONEDAY)){
                    //console.log("使用缓存数据");
                    self.initHome();
                }else{
                    //console.log("使用服务器的最新数据");
                    self.initData();
                }
            }else{
                //获取Mac地址
                var contact = new Contact();
                contact.getMacAddress(function(success){
                    utils.mac = success;
                    //如果上次获取时间不超过1天就直接使用缓存数据
                    if(self.timeStamp && (nowTimeStamp  - self.timeStamp < self.ONEDAY)){
                        //console.log("使用缓存数据");
                        self.initHome();
                    }else{
                        //console.log("使用服务器的最新数据");
                        self.initData();
                    }
                    //alert("getMacAddress success");
                    //alert(success);
                }, function(error){

                    alert("获取mac地址失败,导致请求不到数据");

                    if(self.timeStamp && (nowTimeStamp  - self.timeStamp < self.ONEDAY)){
                        //console.log("使用缓存数据");
                        self.initHome();
                    }else{
                        //console.log("使用服务器的最新数据");
                        self.initData();
                    }

                    //alert("getMacAddress error");
                    //alert(error);
                });
            }

            $("#qr-code").html("");
            $("#qr-code").qrcode({width:100,height:100,correctLevel:0,text:"https://www.baidu.com"});
        },
        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            //console.log(window.screen.width);
        },

        /**
         * 广告banner的点击函数
         */
        onBannerHandler: function(event){
            //utils.abc("kjlkjkjkj");
            event.preventDefault();
            utils.eventClick();
            var target = event.target;
            var url = target.getAttribute("data-url");
            //console.log(url);
            if(url.indexOf("http") >= 0){
                //window.open(self.activeObject.details);
                window.open(url, '_blank', 'location=yes');
            }else{
                url = "http://" + url;
                //app.navigate(url,{replace:true,trigger:true ,isBack:false});
                window.open(url, '_blank', 'location=yes');
            }
            //console.log(event.target);
        },

        /**
         * 书籍、报纸、刊物的点击函数
         */
        onSelfTypeHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            utils.eventClick();
            //通过事件源的id匹配到对应的分类的id
            var targetType = "#" + $(event.target).attr("id") + "-type";

            //将相应分类的dom做显示与隐藏的转换
            $(targetType).slideToggle();
        },

        /**
         * 点击分类按钮函数
         */
        onTypeNameHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var target = event.target;
            if(target.getAttribute("class").indexOf("type-name") >= 0){
                //var url = target.getAttribute("data-type");
                utils.eventClick();

                var url = "home/content/" + target.getAttribute("data-type") + "/" + target.getAttribute("data-label") + "/" + target.innerHTML;
                target.setAttribute("class","type-name type-selected");
                app.navigate(url,{
                    replace: false,
                    trigger: true,
                    isBack: false
                });
            }
        },

        //渲染图书详情页
        renderBookDetail: function(bookData){
            var bookDetail = $("#book-detail-message");
            var bookCoverImg = bookData.getAttribute("data-cover");

            $(bookDetail).find("#book-img").css("background-image", 'url('+bookCoverImg+')');

            $(bookDetail).find("#book-name-message").html(bookData.getAttribute("data-name"));

            $(bookDetail).find("#book-author-message").html(bookData.getAttribute("data-author"));

            $(bookDetail).find("#book-publication-date").html("出版时间："+bookData.getAttribute("data-publishtime"));

            $(bookDetail).find("#book-publishing-house").html("出版社："+bookData.getAttribute("data-publisher"));

            $(bookDetail).find("#book-page-length").html("页数："+bookData.getAttribute("data-pagesnum"));

            $(bookDetail).find("#book-content-validity").html(bookData.getAttribute("data-brief"));

            $("#book-qr-code-img").html("");
            //console.log(utils.bookUrl+bookData.getAttribute("data-id"));
            var url = utils.bookUrl+bookData.getAttribute("data-id");
            $("#book-qr-code-img").qrcode({width:206,height:206,correctLevel:0,text: url});
        },

        onRecommendHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            var target = event.target;
            if(target.getAttribute("class") == "recommend-01" || target.getAttribute("class") == "recommend-02"
                || target.getAttribute("class") == "recommend-03"){
                //console.log(self.bookDetailMessageFloatLayout);
                //self.bookDetailMessageFloatLayout[0].style.display = "block";
                //console.log(target);
                //var bookDetail = $("#book-detail-message");
                //$(bookDetail).find()
                utils.eventClick();
                utils.eventClickShow(target.getAttribute("data-id"));

                this.renderBookDetail(target);
                this.bookDetailMessageFloatLayout.show();
            }
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            //console.log("home close");
            this.bannerSwiper &&  this.bannerSwiper.destroy();
        },

        //当页面销毁时触发
        onDestroy : function(){
            //console.log("home onDestroy");
            this.bannerSwiper &&  this.bannerSwiper.destroy();
        }

    });
});