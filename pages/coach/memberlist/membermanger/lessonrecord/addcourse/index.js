
var app=getApp();
Page({
    data: {

    },
    onLoad: function (options) {
        this.setData({
            member_id: options.id,
            option_before_hours: options.lessons,
            bought: options.bought
        });
    },
    bindKeyInput: function (e) {
        var value = e.detail.value;
        var that = this;
        that.setData({
            value: value
        });
    },
    savebtn:function(e){
        var that=this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        wx.request({
            url: app.globalData.service_url + '/member/hours/option',
            data: {
                hash_value: app.globalData.hash_value,
                gym_id: wx.getStorageSync('gym_id'),
                member_id: that.data.member_id,
                option_before_hours: that.data.option_before_hours,
                option: 1,
                hours: that.data.value,
                note: '',
                type_status: 1
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                wx.navigateBack({
                    delta: 1
                })
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})