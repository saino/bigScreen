// 文件名称: ViewUtils
//
// 创 建 人: chenshy
// 创建日期: 2015/9/22 10:19
// 描    述: ViewUtils
define([
    'marionette'
],function(mn){
    return {
        empty : function(view){
            if(!view || view.isDestroyed){
                return;
            }
            view._isShown = false;
            mn.triggerMethod('before:empty', view);
            //console.log("viewUtils",view);
            if (view.destroy && !view.isDestroyed) {
                //console.log("method",view.onDestroy);
                view.destroy();
            } else if (view.remove) {
                view.remove();
                view.isDestroyed = true;
            }
            mn.triggerMethod('empty', view);
        }
    };
});