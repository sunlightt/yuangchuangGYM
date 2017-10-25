// lessonhistory.js
var app = getApp()
var imgurl = app.globalData.imgurl
Page({

    data: {
        list: [],
        imgurl: imgurl
    },
    onLoad: function (options) {
        var that=this;
        wx.request({
            url: app.globalData.service_url + '/fitness/member/list',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    list: res.data.response.list,
                    history: options.history
                })
            }
        })
    },
    bindmembermanage:function(e){
        wx.navigateTo({
            url: '/pages/coach/memberlist/membermanger/index?id=' + e.currentTarget.id + '&bought=' + e.currentTarget.dataset.bought + '&rest=' + e.currentTarget.dataset.rest,
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
                    list: res.data.response.list,
                    history: options.history
                })
            }
        })
        wx.stopPullDownRefresh();
    }


})