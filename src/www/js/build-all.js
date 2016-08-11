// 文件名称: build-all
//
// 创 建 人: chenshy
// 创建日期: 2015/1/20 17:51
// 描    述: build-all
({
    baseUrl: "js",
    dir: "../dist",
    appDir : "../../www",
    optimizeCss: 'standard',
    removeCombined: true,
    mainConfigFile: "main.js",
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
        dropload :{
            deps : ['jquery'],
            exports : 'jquery'
        },
        jqtap : {
            deps : ['jquery'],
            exports : 'jquery'
        },
        jqScroll:{
            deps : ['jquery'],
            exports : 'jquery'
        },
        masonry :{
            deps : ['jquery'],
            exports : 'jquery'
        }
	},
	paths: {
        jquery: 'lib/jquery-1.11.3.min',
        underscore: 'lib/backbone/underscore',
        backbone: 'lib/backbone/backbone',
        marionette : 'lib/backbone/backbone.marionette',
        globalMethod : 'common/global_method',
        store : 'lib/backbone/backbone.localStorage',
        'text' : 'lib/require/text',
        jqtap : "lib/jquery.tap",
        jqScroll : "lib/jquery.scrollTo",
        buzzjs : "lib/exclude/audio/buzz",
        photoUtils : "utils/photo_utils",
        voiceUtils : "utils/voice_utils",
        videoUtils : "utils/video_utils",
        utils : "utils/utils",
        engine : "render/engine",
        masonry : "lib/jquery.masonry",
		Sortable : 'lib/Sortable',
        fmalocal : 'common/api/fmaclocal',
        fmaclocalInterface : "common/api/fmaclocalInterface",
        touchSlide : 'lib/TouchSlide.1.1',
        msgbox : "common/views/MsgBox",
        jqrcode : 'lib/jquery.qrcode.min',
        touch : "lib/touch",
        iscroll : "lib/iscroll",
        md5 : 'lib/md5',
        dropload: 'lib/dropload',
        move : "lib/move",
        swiper : 'lib/pageSwitch',
        swipejs : 'lib/swipe-new',
        device : "lib/device",
        swiper3d : "lib/swiper",
        mesnsApi : "common/mesns_api",
        base64Min : 'common/base64.min',
        piwik : 'common/api/piwik',
        analytics : 'common/api/analytics'
	},
    modules: [{
        name: 'main'
    }]
})