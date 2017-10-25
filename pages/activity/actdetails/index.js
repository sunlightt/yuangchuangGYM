
//index.js
//获取应用实例
var app = getApp();
var service_url = app.globalData.service_url;
var common = require("../../../utils/util.js");
Page({
    data: {
        imgurl: app.globalData.imgurl,
    },
    onLoad: function (opations) {

        var that = this;

        console.log(opations);

        that.setData({
            id: opations.id
        })
       
        that.getactivity();

        that.getcommlist();

        that.getthumlist();
    },
    // 活动
    getactivity: function (e) {
        var that = this;
        var hash_value = app.globalData.hash_value;
        // var gym_id = app.globalData.gym_fitness_info.gym_id wx.getStorageSync('gym_id');
        var gym_id =wx.getStorageSync('gym_id');
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 4,
                gym_id: gym_id,
                gym: ''
            },
            success: function (res) {
                var data = res.data.response.list[0];
                data.details.create_time = app.formatDateTime({ "inputTime": data.details.create_time * 1000, "type": "all" });
                var date = new Date(data.details.date_time * 1000);
                var year = date.getFullYear();
                var day = data.details.over_time - data.details.date_time;
                day = Math.ceil(day / 86400);
                var begin = app.formatDateTime({ 'inputTime': data.details.date_time * 1000, 'type': 'md' });
                var end = app.formatDateTime({ 'inputTime': data.details.over_time * 1000, 'type': 'md' });
                var arr = data.details.location_code.split(',');

                data.details.date_time = app.formatDateTime({ 'inputTime': data.details.date_time * 1000, 'type': 'md' })
                data.details.over_time = app.formatDateTime({ 'inputTime': data.details.over_time * 1000, 'type': 'md' })
                
                that.setData({
                    latitude: arr[1],
                    longitude: arr[0],
                    markers: [{
                        iconPath: "../../resources/img/map-symbol.png",
                        id: 0,
                        latitude: arr[1],
                        longitude: arr[0],
                        width: 20,
                        height: 30
                    }],
                    polyline: [{
                        points: [{
                            longitude: arr[0],
                            latitude: arr[1]
                        }, {
                            longitude: arr[0],
                            latitude: arr[1]
                        }],
                        color: "#FF0000DD",
                        width: 2,
                        dottedLine: true
                    }],
                    join_count: data.details.join_count,
                    acti_data: data,
                    day: day,
                    begin: begin,
                    end: end,
                    time: app.formatDateTime({ 'inputTime': data.details.date_time * 1000, 'type': 'one' })
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

                    that.getactivity();

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
                console.log(res)
                that.setData({
                    commentvalue: ''
                })
                
                that.getactivity();

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
                circle_id: that.data.id,
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
                circle_id: that.data.id,
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
    onPullDownRefresh:function(e){
        var that=this;

        that.getactivity();

        that.getcommlist();

        that.getthumlist();

        wx.stopPullDownRefresh();
    }
})
