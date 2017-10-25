// pages/briefinfo/briefinfo.js
var app = getApp()
var service_url = app.globalData.service_url;
var onoff = false;
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
    // 获取教练信息
    getcoachinf: function (e) {
        var that = this;
        wx.request({
            url: app.globalData.service_url + '/user/info',
            data: {
                hash_value: app.globalData.hash_value,
                phone_num: that.data.phone,
                role: 'fitness'
            },
            success: function (res) {

                if (app.globalData.gym_fitness_info){
                    if (app.globalData.gym_fitness_info.fitness_id == res.data.response[0].uuid) {
                        onoff = true
                        that.setData({
                            onoff: onoff
                        });
                        wx.showModal({
                            title: '签约消息',
                            content: '你已和教练签约',
                            showCancel:false,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.navigateBack({
                                        delta:2
                                    })
                                } else if (res.cancel) {
                                   
                                }
                            }
                        })
                    }
                }
                
                that.setData({
                    data: res.data.response[0]
                })
            }
        })
    },
    savebtn: function () {
        var that = this
        wx.request({
            url: service_url + '/member/signing',
            data: {
                hash_value:app.globalData.hash_value,
                acceptance_id: that.data.id,
                message: ''
            },
            success: function (res) {
                console.log(res)
                if (res.data.success) {
                    wx.showToast({
                        title: '签约成功',
                        icon: 'loding',
                        duration: 1000
                    });
                    setTimeout(function () {
                        wx.reLaunch({
                            url: '/pages/member/index',
                        });
                    }, 1000);
                } else {
                    wx.showToast({
                        title: '已签约',
                        icon: 'loading',
                        duration: 1000
                    })
                }

            }
        })
    },
    tabcoach: function (e) {
        wx.navigateTo({
            url: '/pages/coach/index?difren=other&uuid='+e.currentTarget.dataset.uuid,
        });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getcoachinf();
        wx.stopPullDownRefresh();
    }
})