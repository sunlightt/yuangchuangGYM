
var app = getApp();
var service_url = app.globalData.service_url;
Page({
    data: {
        imgurl: app.globalData.imgurl,
        resault: [],
        setindex: 0
    },
    onLoad: function (opations) {
        this.setData({
            id: opations.id,
            hid: opations.hid
        });
        console.log(opations);
        this.answer();
    },
    // 问题表
    answer: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/answer/questions/info',
            data: {
                hash_value: app.globalData.hash_value,
                types_id: that.data.id,
                health_id: that.data.hid
            },
            success: function (res) {
                var data = res.data.response;
                // for (var i = 0; i < data.length; i++) {
                //     that.data.resault.push({ 'gym_id': app.globalData.coachid });
                // }
                that.setData({
                    data: data
                });
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
    
})