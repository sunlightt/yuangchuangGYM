// pages/commnet/commnet.js
Page({
    onLoad: function (options) {
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: app.globalData.hash_value,
            },
            success: function (res) {

            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})