// membermange.js
var app = getApp();
Page({
    onLoad: function (options) {
        this.setData({
            member_id: options.id,
            bought: options.bought,
            lessons: options.rest
        });
    },
    //跳转到剩余课程页面 携带参数为会员Id  和剩余课程数
    overlesson: function () {
        var that = this
        wx.navigateTo({
            url: '/pages/coach/memberlist/membermanger/overlesson/index?id=' + that.data.member_id + '&lessons=' + that.data.lessons + '&bought=' + that.data.bought
        })
    },
    //购买课程记录
    lessonsrecord: function () {
        var that = this
        wx.navigateTo({
            url: '/pages/coach/memberlist/membermanger/lessonrecord/index?id=' + that.data.member_id + '&lessons=' + that.data.lessons + '&bought=' + that.data.bought
        })
    },
    delete: function () {
        var that = this
        wx.request({
            url: app.globalData.service_url + '/fitness/unsigning/member',
            method:'POST',
            data: {
                hash_value:app.globalData.hash_value,
                member_id: that.data.member_id,
                gym_id: wx.getStorageSync('gym_id')
            },
            success: function (res) {
                console.log(res)
                if (res.data.success){
                    wx.showToast({
                        title: '解约成功',
                        icon:'loading',
                        duration:1000
                    });
                    wx.navigateBack({
                       delta:2
                    });
                }else{
                    wx.showToast({
                        title: '解约失败',
                        icon:'loading',
                        duration:1000
                    });
                }
            }
        })
    },
    // 查看上课情况
    situation: function () {
        var that=this;
        wx.navigateTo({
            url: '/pages/coach/memberlist/membermanger/situation/index?id=' + that.data.member_id
        })
    },
    maktraining:function(e){
        var that=this;
        wx.navigateTo({
            url: '/pages/coach/maktraining/index?id=' + that.data.member_id
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }

})