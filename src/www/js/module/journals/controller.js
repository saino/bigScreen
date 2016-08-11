// 文件名称: controllers.js
//
// 创 建 人: liubiao
// 创建日期: 2016/07/18 10:00
// 描    述: controllers.js
define([
    'module/book/views/journals'
],function(JournalsView){
    return {
        journals : function(){
            app.page.show(JournalsView);
        }
    };
});