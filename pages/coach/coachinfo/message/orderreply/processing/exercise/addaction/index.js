// addaction.js
var app = getApp()
Page({

    data: {
        list: []
    },

    onLoad: function (options) {
        var that = this
        wx.request({
            url: app.globalData.service_url + '/fitness/train/action/cate/info',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    list: res.data.response
                })
            }
        })
    },
    trainaction: function (e) {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/message/orderreply/processing/trainaction/index?id=' + e.currentTarget.id + '&name=' + e.currentTarget.dataset.name
        })
    },
    actiontype: function () {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/message/orderreply/processing/exercise/addaction/actiontype/index',
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.request({
            url: app.globalData.service_url + '/fitness/train/action/cate/info',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    list: res.data.response
                })
            }
        })
        wx.stopPullDownRefresh();
    }
    
})