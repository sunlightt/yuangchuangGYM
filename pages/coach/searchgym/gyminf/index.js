// pages/briefinfo/briefinfo.js
var app = getApp()
var service_url = app.globalData.service_url;
Page({
    data: {
        imgurl: app.globalData.imgurl
    },
    onLoad: function (options) {
        this.setData({
            id: options.id,
            phone: options.phone
        });

        this.getcoachinf();
    },
    // 获取健身房
    getcoachinf: function (e) {
        var that = this;
        wx.request({
            url: app.globalData.service_url + '/gym/info',
            data: {
                hash_value: app.globalData.hash_value,
                unique_id: that.data.id,
            },
            success: function (res) {
                that.setData({
                    data: res.data.response
                })
            }
        })
    },
    gym: function (e) {
        wx.switchTab({
            url: '/pages/gym/index',
        })
    },
    savebtn: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/fitness/siging/gym',
            data: {
                hash_value: app.globalData.hash_value,
                fitness_instructor_id: app.globalData.coachid,
                gym_id: that.data.id
            },
            method:'POST',
            success: function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: '签约成功',
                        icon: 'success',
                        duration: 1000
                    });
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 1000
                    }); 
                }
                setTimeout(function(e){
                    wx.navigateBack({
                        delta:3
                    });
                },1000);
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getcoachinf();
        wx.stopPullDownRefresh();
    }
});