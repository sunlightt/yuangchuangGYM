// message.js
var common = require("../../../../utils/util.js")
var app = getApp()
Page({

    data: {
        list: [],
        dateformat: common
    },
    onLoad: function (options) {
        
        this.getreplay();
    },
    // 获取约课
    getreplay:function(e){
        var that=this;
        wx.request({
            url: app.globalData.service_url + '/alert/info',
            data:{
                hash_value:app.globalData.hash_value
            },
            success: function (res) {
                var x = res.data.response;
                var list = []
                for (var i = 0; i < x.length; i++) {
                    x[i].hour = common.formatTime(x[i].create_time, 'hour')
                    x[i].day = common.formatTime(x[i].create_time, 'day')
                    list.push(x[i])
                }
                that.setData({
                    list: list
                })
            }
        })
    },
    //点击跳转  1：签约  3：约课   2：内容
    orderreply: function (e) {
        var type1 = e.currentTarget.dataset.type
        if (type1 == 3) {
            wx.navigateTo({
                url: '../orderreply/orderreply?id=' + e.currentTarget.dataset.id
            })
        } else if (type1 == 2) {
            // wx.navigateTo({
            //   url: '../signapply/orderreply?id=' + e.currentTarget.dataset.id
            // }) 
        } else if (type1 == 1) {
            wx.navigateTo({
                url: '../signapply/signapply?id=' + e.currentTarget.dataset.id + '&mes=' + e.currentTarget.dataset.mes
            })
        }
    },
    onShow: function () {
        var that = this
        console.log(wx.getStorageSync('hash_value'))
        
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getreplay();
        wx.stopPullDownRefresh();
    }
})