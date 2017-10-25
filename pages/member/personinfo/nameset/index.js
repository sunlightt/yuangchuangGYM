// nameset.js
var app = getApp()
Page({
    
    data: {
        name: null,
        inputValue: null
    },
    onLoad: function () {
        this.setData({
            name: wx.getStorageSync('name'),
            inputValue: wx.getStorageSync('name')
        });
    },
    bindKeyInput: function (e) {
        console.log(e)
        this.setData({
            inputValue: e.detail.value
        })
    },
    savebtn: function (e) {
        var name = this.data.inputValue
        wx.setStorageSync('name', name)
        wx.request({
            url: app.globalData.service_url + '/user/monity_info',
            data: {
                hash_value:app.globalData.hash_value,
                nick_name: name
            },
            success: function (res) {
                console.log(res);
                wx.navigateBack({
                    delta: 2
                })
            }
        })
        
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})