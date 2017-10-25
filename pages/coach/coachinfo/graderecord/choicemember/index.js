// choicemember.js
var app = getApp()
Page({

    data: {
        url: app.globalData.imgurl,
        list: ''
    },
    onLoad: function (options) {
        var that = this
        wx.request({
            url: app.globalData.service_url + '/fitness/member/list',
            data: {
                hash_value:app.globalData.hash_value
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    list: res.data.response.list
                })
            }
        });
    },
    radioChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            id: e.detail.value
        })
    },
    savebtn: function () {
        var that = this
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
            id: that.data.id,
            namebool: true
        })
        wx.navigateBack({
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.request({
            url: app.globalData.service_url + '/fitness/member/list',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    list: res.data.response.list
                })
            }
        });
        wx.stopPullDownRefresh();
    }
})