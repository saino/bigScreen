window.EventsName = "tap";    //监听事件名称 window.EventsName

window.networkState = "";	//当前网络状态
window.networkFullState = {};	//有网络状态

window.onLineError = true;  //是否是有网加载情况
var timeTemp = null;    //android 物理返回键的间隔时间
window.IS_PAUSE = false; //app是否在后台

document.addEventListener("deviceready", onDeviceReady, false);
document.body.addEventListener("touchstart", function(){}, false);


window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
window.cancelRequestAnimationFrame = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame;
// device APIs are available
//
function onDeviceReady() {
    //alert("11");
    //修改IOS第一启动可能出现卡死的情况
    //setTimeout( endSplash, 2000 );

    document.addEventListener('backbutton',myBackbutton,false);

    //检测当前网络状态
    //window.networkState = navigator.connection.type;
    //window.networkFullState[Connection.UNKNOWN]  = 'Unknown connection';
    //window.networkFullState[Connection.ETHERNET] = 'Ethernet connection';
    //window.networkFullState[Connection.WIFI]     = 'WiFi connection';
    //window.networkFullState[Connection.CELL_2G]  = 'Cell 2G connection';
    //window.networkFullState[Connection.CELL_3G]  = 'Cell 3G connection';
    //window.networkFullState[Connection.CELL_4G]  = 'Cell 4G connection';
    //window.networkFullState[Connection.NONE]     = 'No network connection';

    //document.addEventListener("online", onOnline, false);   //线上事件
//    document.addEventListener("offline", onOffline, false);   //线下事件
}
//线上事件
function onOnline(){
    window.onLineError = true;  //是否是有网加载情况
}

function endSplash(){

    if ( navigator.splashscreen ){
        navigator.splashscreen.hide();
//		navigator.splashscreen = null;
    }else {
        setTimeout( endSplash, 2000 );
    }
}

//点击返回按钮的事件
function myBackbutton(){
    //alert("1");
    //暂时就是所有页面直接双击退出，以后增加不是主页反回
    //cordova.exec(null, null, "ExitApp", "execute", []);
    var url = window.location.href;
    var bookFloatDom = $("#book-detail-message-float-layout");
    if(bookFloatDom && bookFloatDom.css("display") == "block"){
        bookFloatDom.hide();
    }else if(url.lastIndexOf("home/content") > -1 ){
        //alert("2");
        app.goBack();
    }else{
        cordova.exec(null, null, "ExitApp", "execute", []);
    }
}

//js库配置
//加载所需的依赖包
require.config({
    //开发模式下给地址加动态参数
    //防止缓存
    //urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
        underscore: {
            exports : '_'
        },
        backbone: {
            deps : [
                'underscore',
                'jquery'
            ],
            exports : 'Backbone'
        },
        marionette: {
            exports: 'Backbone.Marionette',
            deps: ['jquery','backbone']
        },
        jqrcode :{
            deps : ['jquery'],
            exports : 'jquery'
        },
        jqtap : {
            deps : ['jquery'],
            exports : 'jquery'
        }
	},
	paths: {
        jquery: 'lib/jquery-1.11.3.min',
        underscore: 'lib/backbone/underscore',
        backbone: 'lib/backbone/backbone',
        marionette : 'lib/backbone/backbone.marionette',
        //globalMethod : 'common/global_method',
//        'backbone.babysitter' : "lib/backbone/backbone.babysitter",
//        'backbone.wreqr' : 'lib/backbone/backbone.wreqr',
//        store : 'lib/backbone/backbone.localStorage',
        'text' : 'lib/require/text',
        jqtap : "lib/jquery.tap",
        touchSlide : 'lib/TouchSlide.1.1',
        //msgbox : "common/views/MsgBox",
        jqrcode : 'lib/jquery.qrcode.min',//二维码
        touch : "lib/touch",
        device : "lib/device",
        utils : "utils/utils"
	},
    waitSeconds: 0
});

//应用程序入口
require([
    'jquery',
    'backbone',
    'router/Backbone.history',
    'module/app/app',
    'module/app/controller',
    'router/AppRouter',
    //'config/app_config',
    'underscore',
    'text',
    "device",
    'jqtap',
    "jqrcode",
    'lib/pageSwitch',
    'utils'
    //'../cordova'
], function($,Backbone,BackboneHistory,app,controller, AppRouter) {

    $(document).ready(function() {
        // 获取Mac地址
        //Contact.getMacAddress(function(success){
        //    alert("getMacAddress success");
        //    alert(success);
        //}, function(error){
        //    alert("getMacAddress error");
        //    alert(error);
        //});
        //
        ////获取IP地址
        //Contact.getIpAddress(function(success){
        //    alert("getIpAddress success");
        //    alert(success);
        //}, function(error){
        //    alert("getIpAddress error");
        //    alert(error);
        //});
        //
        ////获取设备ID
        //Contact.getDeviceId (function(success){
        //    alert("getDeviceId  success");
        //    alert(success);
        //}, function(error){
        //    alert("getDeviceId  error");
        //    alert(error);
        //});
        readyHandle();
    });

    function readyHandle (){

        app.VERSION = "1.0.0";
        app.router = new AppRouter({controller:controller});
        BackboneHistory.start({pushState: false});
        app.history = BackboneHistory;
        app.start();
    }
});



