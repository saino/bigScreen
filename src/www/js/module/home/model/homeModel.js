// 文件名称: homeModel.js
//
// 创 建 人: liubiao
// 创建日期: 2016/7/22 14:54
// 描    述: home页数据

define([],function(){
    var HomeModel = function(){};

    //home页数据请求
    HomeModel.prototype.getHomeData = function(successCB, errorCB){
        $.ajax({
            type: "POST",
            url: utils.apiUrl + "/api/home",
            data: {mac: utils.mac},
            dataType: "json",
            async: true,
            success: function(data){
                successCB && successCB(data);
            },
            error: function(err){
                errorCB && errorCB(err);
            }
        });

    };



    var homeModel = new HomeModel();

    return homeModel;
});