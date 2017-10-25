// overlesson.js
var app = getApp()
Page({

    data: {
        value: '30',
        text: '',
        option_before_hours: ''
    },
    
    onLoad: function (options) {
        var that = this
        this.setData({
            member_id: options.id,
            value: options.lessons,
            option_before_hours: options.lessons,
            bought: options.bought
        });
    },
    plus: function () {
        var that = this
        this.setData({
            value: that.data.value * 1 + 1
        })
    },
    reduce: function () {
        var that = this
        console.log(that)
        this.setData({
            value: that.data.value * 1 - 1
        })
    },
    bindKeyInput: function (e) {
        var that = this
        this.setData({
            value: e.detail.value
        })
    },
    text: function (e) {
        this.setData({
            text: e.detail.value
        })
    },
    savebtn: function () {
        var that = this
        var option = 0
        var hours = 0
        var bought = that.data.bought;
        if (that.data.option_before_hours > that.data.value) {
            hours = parseInt(that.data.option_before_hours) - that.data.value
            bought = bought - hours
            option = 2
        } else {
            hours = that.data.value - that.data.option_before_hours
            option = 1
            bought = parseInt(bought) + parseInt(hours)
        }
        wx.request({
            url: app.globalData.service_url + '/member/hours/option',
            data: {
                hash_value: app.globalData.hash_value,
                gym_id: wx.getStorageSync('gym_id'),
                member_id: that.data.member_id,
                option_before_hours: that.data.option_before_hours,
                option: option,
                hours: hours,
                note: that.data.text,
                type_status:2
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];  //上一个页面
                // 直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                prevPage.setData({
                    lessons: that.data.value,
                    bought: bought
                })
                wx.navigateBack({
                    delta:1
                })
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }

})