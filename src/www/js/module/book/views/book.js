// 文件名称: book.js
//
// 创 建 人: liubiao
// 创建日期: 2016/07/18 10:05
// 描    述: book.js
define([
    'common/base/base_view',
    'text!module/book/templates/book.html',
    'marionette',
    'module/book/model/typeModelData'
],function(BaseView, tpl, mn, typeModel) {
    return BaseView.extend({
        id : "books",

        template : _.template(tpl),

        _mouseLock : false,
        _isShow : false,
        forever: true,
        typeLength: 27,
        currentPageIndex: 1,    //当前被选中的页码
        currentPageIndexId: 0,  //当前被选中的页码ID代号
        typeSwiper: null,
        typeNameBtnLength: 11,

        type: null,             //1:书籍  2:报纸   3:刊物
        categoryLabel: null,    //分类查询字段
        categoryKey: "ALL",      //分类首字母查找
        categoryName: null,     //分类名称
        typeData: null,         //分类数据
        typeListData: null,     //分类列表数据
        pageNum: 1,             //初始查询第一页
        PAGELIMIT: 45,         //每页查询多少条
        listCount: 0,           //一共有多少条数据
        currentListCount: 0,    //当前已经获取了多少条数据
        pageLength: 0,          //页的长度

        clickBookClassDetailLock: false,        //点击图书分类按钮锁
        clickBookSearchDetailLock: false,       //点击首字母查找锁

        //currentSelectedPage: 0,
        // key : selector
        ui : {
            back: "#back",
            bookClass: "#book-class",                   //图书分类
            bookSearch: "#book-search",                 //首字母查找
            typeIndex: "#type-index",                   //页码
            bookFloatLayout: "#book-float-layout",      //浮层
            bookClassDetail: "#book-class-detail",      //图书分类内容
            bookSearchDetail: "#book-search-detail",    //首字母查找内容
            typeContent: "#type-content"                //图书容器
        },
        //事件添加
        events : {
            "tap @ui.back": "onBackHandler",                            //点击返回
            "tap @ui.bookClass": "onBookClassHandler",                  //点击图书分类按钮
            "tap @ui.bookSearch": "onBookSearchHandler",                //点击首字母查找按钮

            "tap @ui.bookFloatLayout": "onBookFloatLayoutHandler",      //点击图书浮层
            "tap @ui.bookClassDetail": "onBookClassDetailHandler",      //点击图书分类内容
            "tap @ui.bookSearchDetail": "onBookSearchDetailHandler",    //点击首字母查找内容

            "tap @ui.typeContent": "onTypeContentHandler"               //点击图书容器
        },

        /**初始化**/
        initialize : function(){
            //console.log(  utils.bookTypeData ,
            //utils.newspaperTypeData ,
            //utils.journalsTypeData
            //);
            //var self = this;
            //self.type = self.getOption("type");
            //self.categoryLabel = self.getOption("categorylabel");
            //self.categoryName = self.getOption("categoryname");



        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            self.bookDetailMessageFloatLayout = $("#book-detail-message-float-layout");
            self.bookDetailMessageFloatLayout.on("tap", function(event){
                event.preventDefault();
                event.stopPropagation();
                self.bookDetailMessageFloatLayout.hide();
            });
        },
        /**
         * 初始化分类按钮、分类按钮内容、首字母查找
         */
        initType: function(){
            var self = this;
            self.type = self.getOption("type");
            self.categoryLabel = self.getOption("categorylabel");
            self.categoryName = self.getOption("categoryname");
            if(self.type == 1){
                self.typeData = utils.bookTypeData;
            }
            if(self.type == 2){
                self.typeData = utils.newspaperTypeData;
            }
            if(self.type == 3){
                self.typeData = utils.journalsTypeData;
            }

            //初始化图书分类按钮的内容
            var typeNameBtnHtml = '<div class="book-class-icon"></div>';

            if(self.typeData) {
                for (var i = 0; i < self.typeData.length; i++) {
                    typeNameBtnHtml += '<div class="type-name-btn" data-label="' + self.typeData[i].label + '" data-type="' + self.typeData[i].type + '">' + self.typeData[i].name + '</div>';
                }
            }
            self.ui.bookClassDetail.html(typeNameBtnHtml);

            //初始化图书分类按钮显示内容
            self.ui.bookClass.html(self.categoryName);

            //初始化首字母查找列表
            $.find(".letter-selected")[0].setAttribute("class", "book-search-letter");
            $.find("#letter-all")[0].setAttribute("class", "book-search-letter letter-selected");

            //初始化返回按钮
            this.ui.back[0].setAttribute("class", "btn");
        },

        /**
         * 初始化分类列表，滑动组件
         */
        initTypeList: function(options){
            var self = this;


            self.currentPageIndex = 1;    //当前被选中的页码
            self.currentPageIndexId = 0;  //当前被选中的页码ID代号

            //console.log(options);
            typeModel.getTypeData(options, function(typeModeldata){
                self.clickBookClassDetailLock = false;
                self.clickBookSearchDetailLock = false;
                if(typeModeldata && typeModeldata.meta && typeModeldata.meta.success && typeModeldata.data) {
                    var data = typeModeldata.data;
                    self.listCount = data.count;                            //数据的总数
                    self.typeListData = data.contents;                      //此页查询到的数据
                    self.currentListCount = self.typeListData.length;       //目前查询数据的条数

                    //console.log(self.typeListData,"xxxxxxxxx");
                    //console.log(self.listCount, self.typeListData, self.currentListCount);
                    var html = "";
                    var tmpContentHtml = "";
                    var tmpFooterHtml = "";
                    self.pageLength = 1;
                    for(var i=0; i<self.typeListData.length; i++){
                        if(i%9 == 0){
                            html += '<div class="type-page">';
                        }
                        if(i%3 == 0){
                            html += '<div class="type-bookshelf">';
                        }

                        tmpContentHtml += '<div class="type-img-'+ (i%3) +'" data-author="'+ self.typeListData[i].author + '" data-name="'+ self.typeListData[i].name
                            +'" data-cover="'+ self.typeListData[i].cover +'" data-brief="'+ self.typeListData[i].brief +'" data-publisher="'+ self.typeListData[i].publisher
                            +'" data-publishtime="'+ self.typeListData[i].publishTime +'" style="background-image: url('+ self.typeListData[i].cover
                            +')" data-pagesnum="'+ self.typeListData[i].pagesNum +'" data-url="'+ self.typeListData[i].url +'" data-id="'+self.typeListData[i].id+'"></div>';

                        tmpFooterHtml += '<div class="type-img-describe-'+ (i%3) + '"><div class="type-img-name">'+ self.typeListData[i].name +'</div> <div class="book-author">'+ self.typeListData[i].author +'</div> </div>';

                        if(i%3 == 2 || (i+1 == self.currentListCount)){
                            html += '<div class="type-img-content">' + tmpContentHtml + '</div>';
                            html += '<div class="type-footer">' + tmpFooterHtml + '</div>';
                            html += '</div>';
                            tmpContentHtml = "";
                            tmpFooterHtml = "";
                        }
                        if(i%9 == 8 || (i+1 == self.currentListCount)){
                            html += '</div>';
                        }
                    }

                    if(self.typeListData.length == 0){
                        html = '<div class="type-page"></div>';
                    }

                    // 将字符串写入滑动容器里
                    self.ui.typeContent.html(html);

                    self.typeSwiper = new pageSwitch(self.ui.typeContent.get(0),{
                        duration:1000,           //int 页面过渡时间
                        direction:0,            //int 页面切换方向，0横向，1纵向
                        start:0,                //int 默认显示页面
                        loop:false,             //bool 是否循环切换
                        ease:'ease',            //string|function 过渡曲线动画，详见下方说明
                        transition:'scrollX',    //string|function转场方式，详见下方说明
                        freeze:false,           //bool 是否冻结页面（冻结后不可响应用户操作，可以通过 `.freeze(false)` 方法来解冻）
                        mouse:true,             //bool 是否启用鼠标拖拽
                        mousewheel:false,       //bool 是否启用鼠标滚轮切换
                        autoplay : false
                    });

                    //初始化图书分类按钮显示内容
                    //self.ui.bookClass.html(this.getOption("bookType"));

                    //绑定滑动开始时的事件
                    self.typeSwiper.on("before", function(){
                        var selected = $.find(".page-selected")[0];
                        if(selected){
                            selected.setAttribute("class", "page-number");
                            self.currentPageIndex = selected.innerHTML;
                        }
                    });

                    //绑定滑动结束后的事件
                    self.typeSwiper.on("after", function(){
                        //下一个将要被选中的页码
                        var nextPageIndex = self.typeSwiper.current + 1;

                        //下一个将要被选中的页码ID代号
                        var nextpageIndexId = self.currentPageIndexId + nextPageIndex - self.currentPageIndex;
                        nextpageIndexId = nextpageIndexId > (self.pageLength-1) ? (self.pageLength-1) : nextpageIndexId;
                        nextpageIndexId = nextpageIndexId < 0 ? 0 : nextpageIndexId;

                        // 重置当前被选中的页码ID代号
                        self.currentPageIndexId = nextpageIndexId;

                        //下一个将要被选中的页码ID代号
                        var selected = $.find("#page-number-" + self.currentPageIndexId)[0];
                        if(selected){
                            selected.setAttribute("class", "page-number page-selected");
                            selected.innerHTML = nextPageIndex;
                        }

                        if((nextPageIndex*9 + 18 > self.currentListCount) && (self.currentListCount < self.listCount)){
                            //console.log("应该追加新数据了");
                            self.pageNum++;
                            var options = {
                                "type" : self.type,
                                "label" : self.categoryLabel,
                                "key" : self.categoryKey,
                                "pagenum" : self.pageNum,
                                "pagelimit" : self.PAGELIMIT,
                                "mac": "lskdjflajsf"
                            };
                            console.log(options);
                            typeModel.getTypeData(options, function(typeModeldata) {

                                if (typeModeldata && typeModeldata.meta && typeModeldata.meta.success && typeModeldata.data){

                                    var data = typeModeldata.data;
                                    self.listCount = data.count;                            //数据的总数
                                    self.typeListData = data.contents;                      //此页查询到的数据
                                    var  preListCount = self.currentListCount;
                                    self.currentListCount += self.typeListData.length;       //目前查询数据的条数

                                    if(self.typeListData.length == 0){
                                        //console.log("没有新数据");
                                        return;
                                    }


                                    var html = "";
                                    var tmpContentHtml = "";
                                    var tmpFooterHtml = "";
                                    for(var i=preListCount; i<self.currentListCount; i++){
                                        if(i%9 == 0){
                                            html += '<div class="type-page">';
                                        }
                                        if(i%3 == 0){
                                            html += '<div class="type-bookshelf">';
                                        }

                                        tmpContentHtml += '<div class="type-img-'+ (i%3) +'" data-author="'+ self.typeListData[i-preListCount].author + '" data-name="'+ self.typeListData[i-preListCount].name
                                            +'" data-cover="'+ self.typeListData[i-preListCount].cover +'" data-brief="'+ self.typeListData[i-preListCount].brief +'" data-publisher="'+ self.typeListData[i-preListCount].publisher
                                            +'" data-publishtime="'+ self.typeListData[i-preListCount].publishTime +'" style="background-image: url('+ self.typeListData[i-preListCount].cover
                                            +')" data-pagesnum="'+ self.typeListData[i-preListCount].pagesNum +'" data-url="'+ self.typeListData[i-preListCount].url +'" data-id="'+ self.typeListData[i-preListCount].id +'"></div>';

                                        tmpFooterHtml += '<div class="type-img-describe-'+ (i%3) + '"><div class="type-img-name">'+ self.typeListData[i-preListCount].name +'</div> <div class="book-author">'+ self.typeListData[i-preListCount].author +'</div> </div>';

                                        if(i%3 == 2 || (i+1 == self.currentListCount)){
                                            html += '<div class="type-img-content">' + tmpContentHtml + '</div>';
                                            html += '<div class="type-footer">' + tmpFooterHtml + '</div>';
                                            html += '</div>';
                                            tmpContentHtml = "";
                                            tmpFooterHtml = "";
                                        }
                                        if(i%9 == 8 || (i+1 == self.currentListCount)){
                                            html += '</div>';
                                        }
                                    }

                                    var htmlDom = $(html);

                                    //将新请求到的数据加到滑动组件的尾部

                                    for(var j=0; j<htmlDom.length; j++){
                                        self.typeSwiper.append(htmlDom[j]);
                                    }

                                }else{

                                }
                            });
                        }
                    });

                    self.pageLength = Math.ceil(self.listCount/9);
                    self.pageLength = self.pageLength > 11 ? 11 : self.pageLength;     //最多只有11个页码
                    self.ui.typeIndex.css({"width": "calc( 72px + 66px * "+ self.pageLength +" )"});
                    self.ui.typeIndex.css({"width": "-webkit-calc( 72px + 66px * "+ self.pageLength +" )"});

                    // 拼接出页码
                    var pageNumberHtml = "";
                    for(var i=0; i<self.pageLength; i++){
                        if(!i){
                            pageNumberHtml += '<div id="page-number-' + i + '" class="page-number page-selected">'+ (i+1) +'</div>';
                        }else{
                            pageNumberHtml += '<div id="page-number-' + i + '" class="page-number">'+ (i+1) +'</div>';
                        }
                    }
                    //将页码html字符串写入页码容器
                    self.ui.typeIndex.html(pageNumberHtml);

                }
                else{
                    //console.log("error");
                }
            });

        },

        init: function(){
            var self = this;

            self.clickBookClassDetailLock = false;          //初始化点击图书分类按钮锁
            self.clickBookSearchDetailLock = false;         //初始化点击首字母查找按钮锁

            //初始化扫码阅读更多图书
            $("#book-type-qr-code").html("");

            $("#book-type-qr-code").qrcode({width:100,height:100,correctLevel:0,text:"https://www.baidu.com"});

            self.initType();

            self.pageNum = 1;
            self.type = self.getOption("type");
            self.categoryLabel = self.getOption("categorylabel");
            self.categoryKey = "ALL";
            var options = {
                "type" : self.type,
                "label" : self.categoryLabel,
                "key":self.categoryKey,
                "pagenum": self.pageNum,
                "pagelimit" : self.PAGELIMIT,
                "mac": "lskdjflajsf"
            };
            self.initTypeList(options);
        },

        show: function(){
            var self = this;

            self.init();

        },
        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){

        },

        /**
         * 点击返回按钮
         * @param event
         */
        onBackHandler: function(event){
            event.stopPropagation();
            event.preventDefault();
            event.target.setAttribute("class", "btn title-btn-selected");
            utils.eventClick();
            app.goBack();
        },
        /**
         * 点击浮层函数
         * @param event
         */
        onBookFloatLayoutHandler: function(event){
            var self = this;
            event.stopPropagation();
            event.preventDefault();
            utils.eventClick();

            if(self.ui.bookClassDetail.css("display") == "block"){
                self.ui.bookClass.attr("class", "btn");
                self.ui.bookClassDetail.slideUp(function(){
                    self.ui.bookFloatLayout.hide()
                });
            }
            if(self.ui.bookSearchDetail.css("display") == "block"){
                self.ui.bookSearch.attr("class", "btn");
                self.ui.bookSearchDetail.slideUp(function(){
                    self.ui.bookFloatLayout.hide()
                });
            }
        },

        /**
         * 点击图书分类按钮
         * @param event
         */
        onBookClassHandler: function(event){
            var self = this;
            event.stopPropagation();
            event.preventDefault();
            self.ui.bookClass.attr("class", "btn title-btn-selected");
            self.ui.bookFloatLayout.show();
            self.ui.bookClassDetail.slideToggle();
            //var typeBtn = "";
            utils.eventClick();
            var typBtn = self.ui.bookClassDetail.children();
            for(var i=1; i<typBtn.length; i++){
                if(typBtn[i].innerHTML == self.ui.bookClass[0].innerHTML){
                    typBtn[i].setAttribute("class", "type-name-btn type-name-btn-selected");
                } else{
                    typBtn[i].setAttribute("class", "type-name-btn");
                }
            }
        },

        /**
         * 点击首字母查找按钮
         * @param event
         */
        onBookSearchHandler: function(event){
            var self = this;
            event.stopPropagation();
            event.preventDefault();
            utils.eventClick();
            self.ui.bookSearch.attr("class", "btn title-btn-selected");
            self.ui.bookFloatLayout.show();
            self.ui.bookSearchDetail.slideToggle();
        },

        /**
         * 点击图书分类按钮的内容
         * @param event
         */
        onBookClassDetailHandler: function(event){
            var self = this;
            event.stopPropagation();
            event.preventDefault();
            var target = event.target;
            if(target.getAttribute("class") == "type-name-btn"){
                if(self.clickBookClassDetailLock || self.clickBookSearchDetailLock){
                    //console.log("分类锁或者按钮锁被锁定，请等待数据查询结束后再点击");
                    return;
                }
                utils.eventClick();
                self.clickBookClassDetailLock = true;

                $.find(".type-name-btn-selected")[0].setAttribute("class", "type-name-btn");
                target.setAttribute("class", "type-name-btn type-name-btn-selected");
                self.ui.bookClass.html(target.innerHTML);

                //初始化首字母查找列表
                $.find(".letter-selected")[0].setAttribute("class", "book-search-letter");
                $.find("#letter-all")[0].setAttribute("class", "book-search-letter letter-selected");

                self.categoryLabel = target.getAttribute("data-label");

                self.categoryKey = "ALL";
                self.pageNum = 1;
                var options = {
                    "type" : self.type,
                    "label" : self.categoryLabel,
                    "key" : self.categoryKey,
                    "pagenum" : self.pageNum,
                    "pagelimit" : self.PAGELIMIT,
                    "mac": "lskdjflajsf"
                };
                self.typeSwiper && self.typeSwiper.destroy();
                self.initTypeList(options);
            }
        },

        /**
         * 点击首字母查找按钮的内容
         * @param event
         */
        onBookSearchDetailHandler: function(event){
            var self = this;
            event.stopPropagation();
            event.preventDefault();
            var target = event.target;
            if(target.getAttribute("class") == "book-search-letter"){

                if(self.clickBookClassDetailLock || self.clickBookSearchDetailLock){
                    //console.log("分类锁或者按钮锁被锁定，请等待数据查询结束后再点击");
                    return;
                }
                utils.eventClick();
                self.clickBookSearchDetailLock = true;

                $.find(".letter-selected")[0].setAttribute("class", "book-search-letter");
                target.setAttribute("class", "book-search-letter letter-selected");

                self.categoryKey = target.innerHTML;
                self.pageNum = 1;
                var options = {
                    "type" : self.type,
                    "label" : self.categoryLabel,
                    "key": self.categoryKey,
                    "pagenum": self.pageNum,
                    "pagelimit" : self.PAGELIMIT,
                    "mac": "lskdjflajsf"
                };
                self.typeSwiper && self.typeSwiper.destroy();
                self.initTypeList(options);
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
            var url = utils.bookUrl+bookData.getAttribute("data-id");
            $("#book-qr-code-img").qrcode({width:206,height:206,correctLevel:0,text: url});
        },

        /**
         * 点击图书事件
         * @param event
         */
        onTypeContentHandler: function(event){
            var self = this;
            //event.stopPropagation();
            event.preventDefault();
            var target = event.target;
            if(target.getAttribute("class") == "type-img-0" || target.getAttribute("class") == "type-img-1"
                || target.getAttribute("class") == "type-img-2"){
                //console.log(self.bookDetailMessageFloatLayout);
                //self.bookDetailMessageFloatLayout[0].style.display = "block";
                utils.eventClick();
                utils.eventClickShow(target.getAttribute("data-id"));
                self.renderBookDetail(target);
                self.bookDetailMessageFloatLayout.show();
            }
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            self.typeSwiper && self.typeSwiper.destroy();

        },

        //当页面销毁时触发
        onDestroy : function(){
//            console.log("footer destroy");
        }

    });
});