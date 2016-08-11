// 文件名称: controllers.js
//
// 创 建 人: liubiao
// 创建日期: 2016/07/15 09:47
// 描    述: controllers.js
define([
    'module/home/views/home'
],function(HomeView){
    return {
        home : function(){
            app.page.show(HomeView);
        }
    };
});