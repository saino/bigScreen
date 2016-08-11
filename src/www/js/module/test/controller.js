// 文件名称: controllers.js
//
// 创 建 人: guYY
// 创建日期: 2015/11/25 13:47
// 描    述: controllers.js
define([
    'module/test/views/test'
],function(testView){
    return {
        test : function(){
            app.page.show(testView);
        }
    };
});