//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        inputValue: '',
        inputValue1: ''
    },
    //事件处理函数
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    bindKeyInput1: function (e) {
        this.setData({
            inputValue1: e.detail.value
        })
    },
    submit: function () {
        if (this.data.inputValue == this.data.inputValue1) {
            console.log('same')
            wx.request({
                url: app.globalData.service_url+'/gym/public/index.php', //仅为示例，并非真实的接口地址
                data: {
                    x: '',
                    y: ''
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    console.log(res.data)
                }
            })
            wx.navigateTo({
                url: '../index/index'
            })
        } else {
            console.log('different')
        }
    },
    onLoad: function () {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})
