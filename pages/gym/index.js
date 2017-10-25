var app = getApp();
var service_url = app.globalData.service_url;
var util = require('../../utils/util.js');
var fotimg = [['/resources/img/home-active.png', '/resources/img/gym.png'], ['/resources/img/home.png', '/resources/img/gym-active.png']];
Page({
    data: {
        imgurl: app.globalData.imgurl,
        controls: [{
            id: 1,
            iconPath: "/resources/img/map-symbol.png",
            position: {
                left: 0,
                top: 300 - 50,
                width: 30,
                height: 30
            },
            clickable: true
        }],
        activity: [],
        // 显示动态类型
        dynamic_type: 1,
        gymlist:null,
        fotimg: fotimg[1]
    },
    onLoad: function (opations) {
        var that = this;
        // 角色
        that.setData({
            role:opations.role,
            gym_id:wx.getStorageSync("gym_id"),
            roles:opations.roles
        });

        //健身房    
        that.getgym_info();

        //营养餐
        that.getnutrition();

        // 获取成绩单
        that.gettranscript();

        // 获取奖励
        that.getreward();

        // 排行榜
        that.ranking();

        // 课程动态
        that.getclass_dynamic();

        // 活动
        that.getactivity();

    },
    // 健身房信息
    getgym_info: function (e) {
        var that = this;
        var gym_id = that.data.gym_id;
        wx.request({
            url: service_url + '/gym/info',
            data: {
                hash_value: app.globalData.hash_value,
                type: 'all',
                unique_id: gym_id,
                gym: ''
            },
            success: function (res) {
                that.setData({
                    gym_inf: res.data.response
                });
            }
        })
    },
    //营养餐
    getnutrition: function (e) {
        var that = this;
        var date = new Date();
        var d = date.getDay();
        var cur_day = null;
        wx.request({
            url: service_url + '/meal/today',
            data: {
                hash_value: app.globalData.hash_value,
                gym_id: wx.getStorageSync('gym_id')
            },
            success: function (res) {
                var data = res.data.response;
                for (var i = 0; i < data.length; i++) {
                    data[i].picture = data[i].picture.split(',');
                    data[i].create_time = app.formatDateTime({ 'inputTime': data[i].create_time * 1000, 'type': 'two' });
                    if (data[i].which_day == 1) {

                        data[i].which_day = '一';

                    } else if (data[i].which_day == 2) {
                        data[i].which_day = '二';
                    } else if (data[i].which_day == 3) {
                        data[i].which_day = '三';

                    } else if (data[i].which_day == 4) {
                        data[i].which_day = '四';

                    } else if (data[i].which_day == 5) {
                        data[i].which_day = '五';

                    } else if (data[i].which_day == 6) {
                        data[i].which_day = '六';

                    } else if (data[i].which_day == 0) {
                        data[i].which_day = '日';
                    }
                }
                if (d == 0) {
                    cur_day = data.length - 1;
                } else {
                    cur_day = d - 1;
                }
                that.setData({
                    niutr_data: data,
                    cur_day: cur_day

                });
            }
        });
    },
    // 活动
    getactivity: function (e) {
        var that = this;
        var hash_value = app.globalData.hash_value;
        var gym_id = that.data.gym_id
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 4,
                gym_id: gym_id,
                gym: ''
            },
            success: function (res) {
                if (res.data.response.lis && res.data.response.list.length>0){
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
                        time: app.formatDateTime({ 'inputTime': res.data.response.list[0].details.date_time * 1000, 'type': 'one' })
                    });
                }
                
            }
        })
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
    // 获取成绩单
    gettranscript: function () {

        var that = this;
        var hash_value = app.globalData.hash_value;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 3,
            },
            success: function (res) {
                var data = res.data.response.list;
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].details.content.length; j++) {
                        data[i].details.content[j].create_time = app.formatDateTime({ "inputTime": data[i].details.content[j].create_time * 1000, 'type': 'two' });
                    }
                }
                that.setData({
                    transcript_list: data
                });
            }
        })
    },
    //排行榜
    ranking: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/member/fitness/list',
            data: {
                hash_value: app.globalData.hash_value,
                gym_id: wx.getStorageSync('gym_id'),
                week: 1
            },
            success: function (res) {
                var data = res.data.response;
                that.setData({
                    rank_data: data
                });
            }
        });
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
    addactivity: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/member/joinactivity/index?id=' + id
        })
    },
    showdymaic: function (e) {
        var that = this;
        wx.showActionSheet({
            itemList: ['课程动态', '奖励表', '成绩单', '活动'],
            success: function (res) {
                var index = null;
                if (!res.tapIndex) {
                    index = 1;
                } else {
                    index = res.tapIndex + 1;
                }
                that.setData({
                    dynamic_type: index
                });
            }
        });
    },
    tabchange: function (e) {
        var cur_day = e.currentTarget.dataset.day;
        this.setData({
            cur_day: cur_day
        });
    },
    tabclassdetails: function (e) {
        wx.navigateTo({
            url: '/pages/gym/classdetails/index?id=' + e.currentTarget.dataset.id
        })
    },
    details: function (e) {
        wx.navigateTo({
            url: '/pages/gym/transcriptdetails/index?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index
        })
    },
    tabreworddetails: function (e) {
        wx.navigateTo({
            url: '/pages/gym/reworddetails/index?id=' + e.currentTarget.dataset.id
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
                    // 获取成绩单
                    that.gettranscript();

                    // 获取奖励
                    that.getreward();

                    // 课程动态
                    that.getclass_dynamic();

                    // 活动
                    that.getactivity();

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
                // 获取成绩单
                that.gettranscript();

                // 获取奖励
                that.getreward();

                // 课程动态
                that.getclass_dynamic();

                // 活动
                that.getactivity();
            }
        })
    },
    tabactdetails: function (e) {
        wx.navigateTo({
            url: '/pages/activity/actdetails/index?id=' + e.currentTarget.dataset.id
        })
    },
    getgymlist:function(e){
        var that = this;
        var gym_id = that.data.gym_id;
        var data = null;
        if (that.data.role == 'boss') {
            data={
                hash_value: app.globalData.hash_value,
                type: 'all',
                boss: app.globalData.coachid
            }
        }else{
            data = {
                hash_value: app.globalData.hash_value,
                type: 'all',
                unique_id: gym_id,
                gym: ''
            }
        } 
        wx.request({
            url: service_url + '/gym/info',
            data:data,
            success: function (res) {
                var data = res.data.response.list;
                if (data && data.length>0){
                    that.setData({
                        gymlist: data
                    })

                }else{
                    wx.showToast({
                        title: '未签约其他健身房',
                        icon:'loading',
                        duration:1000
                    });
                }
                
            }
        })
    },
    tabgym: function (e) {
        var that=this;
        var gym_id = e.currentTarget.dataset.id;
        that.setData({
            gym_id: gym_id
        });

        //健身房    
        that.getgym_info();

        //营养餐
        that.getnutrition();

        // 获取成绩单
        that.gettranscript();

        // 获取奖励
        that.getreward();

        // 排行榜
        that.ranking();

        // 课程动态
        that.getclass_dynamic();

        // 活动
        that.getactivity();
    },
    onPullDownRefresh: function (e) {
        wx.stopPullDownRefresh();
    },
    tabfooter: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (index == 0) {
            if (that.data.roles=='memmber') {
                wx.navigateTo({
                    url: '/pages/member/index'
                });
            } else {
                wx.navigateTo({
                    url: '/pages/coach/index'
                });
            }
        }
    }


})