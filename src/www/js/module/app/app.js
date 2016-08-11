// 文件名称: app
//
// 创 建 人: chenshy
// 创建日期: 2015/7/22 11:25
// 描    述: app应用程序启动类
define([
    'marionette',
    'common/region/trans_page_region'
],function(mn,TransRegion){
    var app = new mn.Application();

    var regions = {
        page : {el : "#pageContent", regionClass : TransRegion}
    };

    app.navigate = function(url,obj){
        if(window.isTransing) return;


        app.router.navigate(url,obj);
    };

    app.goBack = function(option){
        if(window.isTransing) return;

        app.router.goBack(option);
    };

    app.addRegions(regions);

    return window.app = app;
});