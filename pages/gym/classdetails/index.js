var app = getApp();
var service_url = app.globalData.service_url;
var util = require('../../../utils/util.js');
Page({
    data: {
        imgurl: app.globalData.imgurl,
    },
    onLoad: function () {
        var that = this
        // 课程动态
        that.getclass_dynamic();

        that.getcommlist();

        that.getthumlist();
    },
    // 课程动态
    getclass_dynamic: function (e) {
        var that = this;
        var hash_value = app.globalData.hash_value;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 1,
                limit: 1
            },
            success: function (res) {
                var data = res.data.response.list
                for (var i = 0; i < data.length; i++) {
                    data[i].details.create_time = app.formatDateTime({ "inputTime": data[i].details.create_time * 1000, "type": "all" });
                }
                that.setData({
                    clasdynamic: data
                });
            }
        })
    },
    // 点赞
    thumb: function (e) {
        var that = this
        wx.request({
            url: service_url + '/circle/thumb',
            data: {
                hash_value: app.globalData.hash_value,
                circle_id: e.currentTarget.dataset.id
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
                if (res.data.success == true) {
                    // 课程动态
                    that.getclass_dynamic();

                    that.getcommlist();

                    that.getthumlist();
                }
            }
        })
    },
    //评论
    comment: function (e) {
        var that = this
        wx.request({
            url: app.globalData.service_url + '/circle/comment/push',
            data: {
                hash_value: app.globalData.hash_value,
                content: e.detail.value,
                circle_id: e.currentTarget.dataset.id,
                public_sphere: 1
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                that.setData({
                    commentvalue: ''
                })
                // 课程动态
                that.getclass_dynamic();

                that.getcommlist();

                that.getthumlist();
               
            }
        })
    },
    //获取品论list
    getcommlist: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/circle/comment/info',
            data: {
                hash_value: app.globalData.hash_value,
                circle_id: that.data.circleid,
                limit: 10

            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                that.setData({
                    commlist: res.data.response.list
                });

            }
        });
    },
    //点赞查询
    getthumlist: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/circle/thumb/info',
            data: {
                hash_value: app.globalData.hash_value,
                circle_id: that.data.circleid,
                limit: 10
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                that.setData({
                    thumlist: res.data.response
                });
            }
        });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        // 课程动态
        that.getclass_dynamic();

        that.getcommlist();

        that.getthumlist();
        wx.stopPullDownRefresh();
    }


})