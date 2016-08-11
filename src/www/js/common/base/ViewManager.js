// 文件名称: ViewManager
//
// 创 建 人: chenshy
// 创建日期: 2015/9/13 12:30
// 描    述: ViewManager
define([
    'router/Backbone.history',
    'marionette',
    'common/base/ViewUtils'
],function(backboneHistory,mn,viewUtils){
    var id = 1;
    return {
        _viewClassMap : {},
        _viewInstanceMap : {},
        _viewInstances : [],
        _maxInstance : 20,
        _foreverInstancePool : [],

        _getViewKey : function(viewClass){
            var map = this._viewClassMap;
            var found = false;
            var key;
            for(key in map){
                if(map[key] === viewClass){
                    found = true;
                    break;
                }
            }

            if(found){
                return key;
            }
            return  -1;
        },
        getViewInstance : function(viewClass,params){
            var view = this._getView(viewClass);

            //console.log(view);
            var key;
            //console.log("存在实例:",view);
            if(view){
                if(params){
                    var options = view.options;
                    for(key in params){
                        options[key] = params[key];
                    }
                }
                return view;
            }

            key = id++;

            this._viewClassMap[key] = viewClass;
            var instance = new viewClass(params);

            var forever = instance.getOption("forever");
            //console.log(forever);
            if(forever){
                this._viewInstanceMap[key] = instance;
                //this._foreverInstancePool.push(instance);
            }else{
                this._viewInstanceMap[key] = instance;
                this._viewInstances.push(instance);

                this._checkViewPool();
            }

            return instance;
        },

        _checkViewPool : function(){
            var instances = this._viewInstances;
            while(instances.length > this._maxInstance){
                var instance = instances.shift();
                this._removeInstanceFromPool(instance);
                viewUtils.empty(instance);
            }
        },

        destroyViewByClass : function(clazz){
            var view = this._getView(clazz);
            //console.log("destroy");
            //console.log(clazz);
            //console.log(view);
            this.destroyView(view);
        },

        destroyView : function(view){

            //console.log("destroy");
            //console.log(clazz);
            //console.log(view);
            this._removeInstanceFromPool(view);
            viewUtils.empty(view);
        },

        _removeInstanceFromPool : function(instance){
            var key;
            for(key in this._viewInstanceMap){
                if(this._viewInstanceMap[key] === instance){
                    this._viewInstanceMap[key] = null;
                    delete this._viewInstanceMap[key];
                    this._viewClassMap[key] = null;
                    delete this._viewClassMap[key];
                    break;
                }
            }
        },

        _getView : function(viewClass){
            var key = this._getViewKey(viewClass);
            var view = this._viewInstanceMap[key];
            return view;
        }

    };
});