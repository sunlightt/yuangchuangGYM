
var app = getApp()
Page({
    data: {
        bought: 1,
        rest_of_class: 1
    },
    onLoad: function (options) {
        this.setData({
            id: options.id,
            mes: options.mes,
            member_id: options.member_id
        });
        console.log(options);
    },
    bindKeyInput: function (e) {
        if (e.currentTarget.dataset.type == 'bought') {
            this.setData({
                bought: e.detail.value
            })
        } else {
            this.setData({
                rest_of_class: e.detail.value
            })
        }
    },
    savebtn: function () {
        var that = this
        wx.request({
            url: app.globalData.service_url + '/member/sign/agree',
            data: {
                hash_value: app.globalData.hash_value,
                agree: 1,
                member_id: that.data.member_id,
                gym_id: wx.getStorageSync('gym_id'),
                bought_class: that.data.bought,
                fitness_instructor_id: wx.getStorageSync('uuid'),
                rest_of_class: that.data.rest_of_class
            },
            success: function (res) {
                console.log(res)
                
                wx.request({
                    url: app.globalData.service_url +'/alerts/reading',
                    data:{
                        hash_value: app.globalData.hash_value,
                        id: that.data.mes
                    },
                    success:function(res){
                        if (res.data.success){
                            wx.navigateBack({
                                delta: 3
                            });
                        } 
                    }
                })
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }


})