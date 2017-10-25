// pages/situation/situation.js

var app = getApp();
var service_url = app.globalData.service_url;
var imgurl = app.globalData.imgurl;
Page({

    data: {
        list: []
    },
    onLoad:function(opations){
        this.setData({
            member_id: opations.id
        });
        this.getclasslist();
    },
    getclasslist:function(e){
        var that=this;
         wx.request({
             url: service_url +'/course/history/info',
             data:{
                 hash_value: app.globalData.hash_value,
                 uid: that.data.member_id
             },
             success:function(res){
                 console.log(res);
                 var data = res.data.response.list;
                 for(var i=0;i<data.length;i++){
                     data[i].create_time = app.formatDateTime({ 'inputTime': data[i].create_time * 1000, 'type':'two'});
                 }
                 that.setData({
                     listdata:data
                 })
             }
         })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getclasslist();
        wx.stopPullDownRefresh();
    }

})