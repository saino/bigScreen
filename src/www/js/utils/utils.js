// 文件名称: utils.js
//
// 创 建 人: liubiao
// 创建日期: 2016/07/26
// 描    述: 工具类
(function(window) {
    var utils = {};

    utils.bookTypeData = null;
    utils.newspaperTypeData = null;
    utils.journalsTypeData = null;


    //utils.apiUrl = "http://dev.agoodme.com:8080/distr";
    //utils.apiUrl = "http://192.168.6.90:9090/distr";
    utils.apiUrl = "http://192.168.6.214:8080/distr";
    //utils.mac = "ABCABCABC";
    utils.mac = "68:3E:34:27:D3:0C";
    utils.bookUrl = "";

    /**
     * 统计屏幕点击接口
     */
    utils.eventClick = function(){
        var url = utils.apiUrl + "/api/event/click";
        var data = {};
        data.mac = utils.mac;
        $.post(url,data,function (res){
        });
    };

    /**
     * 统计读物点击接口
     * @param bookId  读物的ID
     */
    utils.eventClickShow = function(bookId){
        var url = utils.apiUrl + "/api/event/show/" + bookId;
        var data = {};
        data.mac = utils.mac;
        $.post(url,data,function (res){
        });
    };


    window.utils = utils;
})(window);