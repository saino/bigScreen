// 文件名称: typeModelData.js
//
// 创 建 人: liubiao
// 创建日期: 2016/7/26 10:10
// 描    述: 类型列表页数据

define([],function(){
    var TypeModel = function(){};

    //home页数据请求
    TypeModel.prototype.getTypeData = function(options, successCB, errorCB){

        var url = utils.apiUrl + "/api/queryContent";
        var data = options;
        data.mac = utils.mac;
        $.post(url,data,function (res){
            successCB && successCB(res);
        });
    };



    var typeModel = new TypeModel();

    return typeModel;
});