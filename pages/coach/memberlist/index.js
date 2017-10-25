// memberlist.js
var app = getApp()
Page({
    data: {
        imgurl: app.globalData.imgurl,
        list: []
    },

    onLoad: function (options) {
        var that = this
        that.getsign();
    },
    getsign:function(e){
        var that = this
        wx.request({
            url: app.globalData.service_url + '/fitness/member/list',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                if (res.data.response.list.length == 0) {
                    wx.showToast({
                        title: '没有签约会员',
                        icon: 'loading',
                        duration: 1000
                    });
                    setTimeout(function () {
                        wx.reLaunch({
                            url: '/pages/coach/index'
                        })
                    }, 1000);
                }
                that.setData({
                    list: res.data.response.list
                })
            }
        });
    },
    bindmembermanage: function (e) {
        wx.navigateTo({
            url: '/pages/coach/memberlist/membermanger/index?id=' + e.currentTarget.dataset.id + '&bought=' + e.currentTarget.dataset.bought + '&rest=' + e.currentTarget.dataset.rest,
        });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        that.getsign();
        wx.stopPullDownRefresh();
    }
})