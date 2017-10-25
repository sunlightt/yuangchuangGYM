
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
            url: app.globalData.service_url + '/gym/info',
            data: {
                hash_value: app.globalData.hash_value,
                phone_num: x
            },
            success: function (res) {
                that.setData({
                    list: res.data.response.list,
                    phone_num: x
                })
            }
        })
    },
    gyminf: function (e) {
        var id = e.currentTarget.dataset.id;
        var phone = e.currentTarget.dataset.phone;
        wx.navigateTo({
            url: '/pages/coach/searchgym/gyminf/index?id=' + id + '&phone=' + phone
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})