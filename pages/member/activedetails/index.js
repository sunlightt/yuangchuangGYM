//获取应用实例
var app = getApp();
var service_url = app.globalData.service_url;
var common = require("../../../utils/util.js");
Page({

    data:{
        imgurl: app.globalData.imgur
    },
    onLoad:function(opations){
        // 活动
        that.getactivity();
    },
    getactivity: function (e) {
        var that = this;
        var hash_value = app.globalData.hash_value;
        var gym_id = app.globalData.gym_fitness_info.gym_id;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 4,
                gym_id: gym_id,
                gym: ''
            },
            success: function (res) {
                console.log(res);

                var data = res.data.response.list[0];

                data.details.create_time = app.formatDateTime({ "inputTime": data.details.create_time * 1000, "type": "all" });

                var date = new Date(data.details.date_time * 1000);
                var year = date.getFullYear();
                var day = data.details.over_time - data.details.date_time;
                day = Math.ceil(day / 86400);
                var begin = app.formatDateTime({ 'inputTime': data.details.date_time * 1000, 'type': 'md' })
                var end = app.formatDateTime({ 'inputTime': data.details.over_time * 1000, 'type': 'md' })
                var arr = data.details.location_code.split(',')
                console.log(arr[1], arr[0]);
                that.setData({
                    latitude: 39.990464,
                    longitude: 116.481488,
                    markers: [{
                        iconPath: "../../resources/img/map-symbol.png",
                        id: 0,
                        latitude: 39.990464,
                        longitude: 116.481488,
                        width: 20,
                        height: 30
                    }],
                    polyline: [{
                        points: [{
                            longitude: 113.3245211,
                            latitude: 23.10229
                        }, {
                            longitude: 113.324520,
                            latitude: 23.21229
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
                    time: app.formatDateTime({ 'inputTime': res.data.response.list[0].details.date_time * 1000, 'type': 'one' })
                });
                // markers: [{
                //     iconPath: "../../resources/img/map-symbol.png",
                //     id: 0,
                //     latitude: 23.099994,
                //     longitude: 113.324520,
                //     width: 20,
                //     height: 30
                // }],
                //     polyline: [{
                //         points: [{
                //             longitude: 113.3245211,
                //             latitude: 23.10229
                //         }, {
                //             longitude: 113.324520,
                //             latitude: 23.21229
                //         }],
                //         color: "#FF0000DD",
                //         width: 2,
                //         dottedLine: true
                //     }],
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;

        wx.stopPullDownRefresh();
    }





});