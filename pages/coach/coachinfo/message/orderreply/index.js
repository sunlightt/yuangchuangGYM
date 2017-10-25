// orderreply.js
var app = getApp();
var service_url = app.globalData.service_url;
Page({
    data: {
        imgurl: app.globalData.imgurl,
        figure_head: wx.getStorageSync('avatarUrl'),
        name: wx.getStorageSync('name')
    },
    onLoad: function (options) {
        this.setData({
            id: options.id
        });

        // 获取会员约课信息
        this.getreplayinf();
    },
    // 获取约课信息
    getreplayinf: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/member/acout/info',
            data: {
                hash_value: app.globalData.hash_value,
                id: that.data.id
            },
            success: function (res) {
                var data = res.data.response;
                data.create_time = app.formatDateTime({ 'inputTime': data.create_time * 1000, 'type': 'all' })
                that.setData({
                    rplay_data: data
                });
            }
        })
    },
    reply: function (e) {
        var that = this
        if (e.currentTarget.id == 1) {
            var service_url = app.globalData.service_url; 
            wx.reLaunch({
                url: '/pages/coach/coachinfo/message/orderreply/processing/index?id=' + that.data.id + '&mes=' + that.data.mes + '&sendid=' + that.data.rplay_data.reservation_person_id
            })
        } else {
            wx.navigateBack({
                delta:1
            })
        }
    },
    onPullDownRefresh: function (e) {
        var that = this;
        // 获取会员约课信息
        that.getreplayinf();
        wx.stopPullDownRefresh();
    }
})