// 文件名称: Backbone.history
//
// 创 建 人: chenshy
// 创建日期: 2015/1/28 13:42
// 描    述: 重写Backbone.history的一些方法
define([
    'underscore',
    'backbone'
],function(_,Backbone){
    if(Backbone.history){
        var _h = Backbone.history;

        var _navigate = _h.navigate;

        /**
         * 重写Backbone.history的navigate
         * @param fragment
         * @param options
         */
        _h.navigate = function(fragment, options){
            if(fragment == this._returnUrl){
                this._returnUrl = "";
            }
            //if(!loginValidate._checkFilter(fragment)){
                _h.__isBackHistory = options.isBack;
                _h.__animation = options.animation;
                _navigate.call(this,fragment, options);
            //}
        };

        var _historyFragments = [];

        /**
         * 返回
         */
        _h.goBack = function(option){
            var fragment = this.fragment;

            var b = false;

            var handles = this.__backRouteHandles,len = handles.length,
                handle,arrReg, j,jLen = 0, z,zLen = _historyFragments.length;

            var found = false;
            var backFragment = "";
            for(var i = 0;i<len;i++){
                handle = handles[i];
                if(handle.route.test(fragment)){
                    arrReg = handle.arr;
                    jLen = arrReg.length;
                    for(z = zLen - 1; z >= 0;z--){
                        for(j = 0;j < jLen;j++){
                            if(arrReg[j].test(_historyFragments[z])){
                                found = true;
                                backFragment = _historyFragments[z];
                                _historyFragments.length = z;
                                break;
                            }
                        }
                        if(found){
                            break;
                        }
                    }
                }
                if(found){
                    break;
                }
            }

            if(!found){
                if(_historyFragments.length > 0){
                    _historyFragments.length = _historyFragments.length - 1;
                    //if(loginValidate._checkLogin()){
                    //    var has = false;
                    //    while(_historyFragments.length > 0 && !has){
                    //        backFragment = _historyFragments.pop();
                    //        if(exclude.indexOf(backFragment) == -1){
                    //            has = true;
                    //        }
                    //    }
                    //}else{
                        backFragment = _historyFragments.pop();
                    //}
                }
            }
            //throw new Error(option);
            //console.log(option);
//            _h.__isBackHistory = true;
            if(option && option.animation){
                console.log(option.animation);
                this.navigate(backFragment,{trigger:true,replace:true,isBack:true,animation:option.animation});
            }else{
                this.navigate(backFragment,{trigger:true,replace:true,isBack:true});
            }
        };

        /**
         * 可以push一个路由到历史记录中
         * 作为返回的路由
         * @param fragment
         */
        _h.pushFragment = function(fragment){
            _historyFragments.push(fragment);
        };

        /**
         * 从历史记录中替换当前的路由
         * @param fragment
         */
        _h.replaceFragment = function(fragment){
            _historyFragments[_historyFragments.length - 1] = fragment;
        };

        _h.__backRouteHandles = [];
        _h.__backRoute = function(route,arr){
            this.__backRouteHandles.unshift({route:route,arr:arr});
        };

        _h._returnUrl = "";

        /**
         * 可以手动设置登陆前的路由
         * @param url
         */
        _h.setReturnUrl = function(url){
            if(url){
			   this._returnUrl = url;
			}else{
			   this._returnUrl = Backbone.history.fragment;
			}
        };

        /**
         * 如果未登陆，会保存登陆前的路由，可以通过此方法获取
         * @returns {*}
         */
        _h.getReturnUrl = function(){
            return this._returnUrl;
        };

        _h.isBackHistory = function(){
            var b = this.__isBackHistory;
            this.__isBackHistory = false;
            return b;
        };

        _h.getAnimation = function(){
            var a = this.__animation;
            this.__animation = null;
            return a;
        };

        //监听路由变化
        Backbone.history.on('route',function(param){
            _historyFragments.push(Backbone.history.fragment);
        },this);
    }
    return Backbone.history;
});