// signapply.js
var app = getApp();
var service_url = app.globalData.service_url;
var imgurl = app.globalData.imgurl;
Page({
    data:{
        imgurl:imgurl
    },
    onLoad: function (options) {
        var that=this;
        this.setData({
            id: options.id,
            mes: options.mes
        });
        that.getsignapply();
    },
    // 获取签约会员信息
    getsignapply:function(e){
        var that=this;
        wx.request({
            url: service_url +'/member/signgin/application/info',
            data:{
                hash_value: app.globalData.hash_value,
                id: that.data.id  
            },
            success:function(res){
                var data = res.data.response;
                data.create_time = app.formatDateTime({ 'inputTime': data.create_time * 1000,'type':'two'});
                that.setData({
                    data: data
                })
            }
        })
    },
    refuse: function () {
        var that = this
        wx.request({
            url: app.globalData.service_url + '/member/sign/agree',
            data: {
                hash_value: app.globalData.hash_value,
                agree: 0,
                id: that.data.id
            },
            success: function () {
                wx.navigateBack({
                    delta:1
                })
            }
        })
    },
    agree: function () {
        var that = this
        wx.navigateTo({
            url: '/pages/agree/index?id=' + that.data.id + '&mes=' + that.data.mes + '&member_id=' + that.data.data.applicant_id,
        })
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        that.getsignapply();
        wx.stopPullDownRefresh();
    }


})