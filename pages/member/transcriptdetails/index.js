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

        this.setData({
            circleid: opations.id,
            index: opations.index
        })
        var that = this
        var hash_value = app.globalData.hash_value;
        
        that.gettranscript();

        that.getcommlist();

        that.getthumlist();
    },
    // 获取成绩单
    gettranscript: function () {
        var that = this;
        var hash_value = app.globalData.hash_value;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type:3,
            },
            success: function (res) {
                console.log(res);
                var data = res.data.response.list;
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].details.content.length; j++) {
                        data[i].details.content[j].create_time = app.formatDateTime({ "inputTime": data[i].details.content[j].create_time * 1000, 'type': 'two' });
                    }
                }
                that.setData({
                    transcript_list: data[that.data.index]
                });
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
                });
                that.gettranscript();

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
                    
                    that.gettranscript();

                    that.getcommlist();

                    that.getthumlist();
                }
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
    previewImg: function (e) {

        var viewsrc = e.currentTarget.dataset.viewsrc;
        wx.previewImage({
            current: viewsrc,
            urls: [viewsrc]
        });

    },
    onPullDownRefresh: function (e) {
        var that = this;
        that.gettranscript();

        that.getcommlist();

        that.getthumlist();
        
        wx.stopPullDownRefresh();
    }
    
})
