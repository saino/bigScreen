// 文件名称: AppRouter
//
// 创 建 人: chenshy
// 创建日期: 2015/7/22 17:32
// 描    述: AppRouter
define([
    'marionette',
    'router/BaseRouter'
], function (mn, BaseRouter) {
    return BaseRouter.extend({
        initialize: function () {
//            console.log(this.getOption('controller'))
        },
        /**配置路由**/
        appRoutes: {
            "": "home",
            //"test": "test",
            //"books": "books",
            "home/content/:type/:category/:categoryname": "typeList"
        }
    });
});