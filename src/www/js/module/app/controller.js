// 文件名称: controller.js
//
// 创 建 人: chenshy
// 创建日期: 2015/7/22 14:24
// 描    述: app总控制器，只能导入控制器
define([
    'module/home/controller',
    'module/test/controller',
    'module/book/controller',
    //'module/newspaper/controller',
    //'module/journals/controller'
],function(){
    var controllers = {
    };

    for(var i = 0;i < arguments.length;i++){
        _.extend(controllers,arguments[i]);
    }

    //console.log(controllers);
    return controllers;
});