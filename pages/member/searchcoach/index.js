// searchcoach.js
var app = getApp();
Page({
    data: {
        imgurl: app.globalData.imgurl,
        list: []
    },


    bindKeyInput: function (e) {
        var that = this
        var x = e.detail.value
        wx.request({
            url: app.globalData.service_url + '/user/info',
            data: {
                hash_value: app.globalData.hash_value,
                phone_num: x,
                role: 'fitness'
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    list: res.data.response,
                    phone_num: x
                })
            }
        })
    },
    briefinfo: function (e) {
        var id = e.currentTarget.dataset.id;
        var phone = e.currentTarget.dataset.phone;
        wx.navigateTo({
            url: '/pages/member/searchcoach/briefinfo/index?id=' + id + '&phone=' + phone
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})