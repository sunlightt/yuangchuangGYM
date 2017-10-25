//index.js
//获取应用实例
var app = getApp();
var service_url = app.globalData.service_url;
var common = require("../../../utils/util.js");
Page({
    data: {
        imgurl: app.globalData.imgurl,
        motto: '',
        info: null,

        circlelist: []
    },
    onLoad: function (opations) {
        console.log('奖励');

        this.setData({
            circleid: opations.id
        })

        var that = this
        var hash_value = app.globalData.hash_value;
        // 获取奖励
        that.getreward();

        that.getcommlist();

        that.getthumlist();
    },
    //获取奖励
    getreward: function (e) {
        var that = this;
        var hash_value = app.globalData.hash_value;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 2,
                limit: 1
            },
            success: function (res) {
                var data = res.data.response.list;
                //奖励发布时间
                var create_time = [];
                for (var i = 0; i < data.length; i++) {
                    create_time.push(data[i].details[0].create_time)
                }

                for (var i = 0; i < create_time.length; i++) {
                    create_time[i] = app.formatDateTime({ "inputTime": create_time[i] * 1000, "type": 'one' });
                }

                for (var i = 0; i < data.length; i++) {
                    data[i].details[0].create_time = app.formatDateTime({ "inputTime": data[i].details[0].create_time * 1000, "type": "all" });
                }
                that.setData({
                    reward_data: data,
                    create_time: create_time
                })

            }
        })
    },
    //评论
    comment: function (e) {
        var that = this
        console.log(e.detail.value);
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
                console.log(res)
                that.setData({
                    commentvalue: ''
                })

                that.getreward();

                that.getcommlist();

                that.getthumlist();
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
                    console.log('点赞成功');

                    that.getreward();

                    that.getcommlist();

                    that.getthumlist();
                }
            }
        })
    },
    //获取品论list
    getcommlist:function(e){
        var that=this;
        wx.request({
            url: service_url + '/circle/comment/info',
            data: {
                hash_value: app.globalData.hash_value,
                circle_id: that.data.circleid,
                limit:10

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
    getthumlist:function(e){
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
        // 获取奖励
        that.getreward();

        that.getcommlist();

        that.getthumlist();
        
        wx.stopPullDownRefresh();
    }
})
