// surpluslesson.js
var app = getApp();
var imgurl = app.globalData.imgurl
Page({
  
    data: {
        imgurl: imgurl,
        list: []
    },
    onLoad: function (options) {
        this.getmermber();
    },
    getmermber:function(e){
        var that = this
        wx.request({
            url: app.globalData.service_url + '/fitness/member/list',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                if (res.data.response.list.length == 0) {
                    wx.showToast({
                        title: '没有剩余课时',
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
    membermanage:function(e){
        var bought = e.currentTarget.dataset.bought;
        var id = e.currentTarget.dataset.id;
        var nick_name = e.currentTarget.dataset.nick_name;
        var rest_calass = e.currentTarget.dataset.rest_calass;
        var index = e.currentTarget.dataset.index;
        wx.reLaunch({
            url: '/pages/member/courserecord/index?bought=' + bought + '&id=' + id + '&nick_name=' + nick_name + '&nick_name=' + nick_name + '&index=' + index
        });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getmermber();
        wx.stopPullDownRefresh();
    }
})