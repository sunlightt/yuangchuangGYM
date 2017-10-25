var common = require("../../utils/util.js");
var app = getApp();
var service_url = app.globalData.service_url;
var imgurl = app.globalData.imgurl;
var fotimg = [['/resources/img/home-active.png', '/resources/img/gym.png'], ['/resources/img/home.png', '/resources/img/gym-active.png']];

Page({
    data: {
        imgurl: imgurl,
        head_figure: '',
        name: '',
        //代表总的剩余课时
        rest_of_class: '',
        count: '',
        surplus: '',
        photo: {
            photo_list: [],
            count: '',
        },
        //成绩单  0代表左侧   1代表右侧
        grade0: {

        },
        grade1: {

        },
        student: {

        },
        order: [],
        today: true,
        circlelist: [],
        page: 1,
        bool: false,
        date: common,
        today_date: '',
        commnetvalue: '',
        other: true,
        typearr: ['课程动态', '奖励表', '成绩单', '活动'],
        dynamic_type: 1,
        fotimg: fotimg[0],

        //判断是会员或教练
        jumid:false,

    },
    onLoad: function (options) {
        var that = this
        that.setData({
            role: options.role,
            uuid: options.uuid
        });

        if (!options.uuid){
            that.setData({
                jumid:true
            });
        }else{
            that.setData({
                jumid: false
            });
        }
        
        var date = new Date();
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var cur_day = y + "-" + m + '-' + d;

        //判断是否是教练自己进入首页
        var other = null;
        if (options.difren && options.difren == 'other') {
            other = false
            that.setData({
                other: other
            });
        }
        this.setData({
            today_date: common.formatTime(date, 'day'),
            cur_day: cur_day
        })

        this.getcoachinf();

        this.getimglist();

        // this.getallinf();

        // 获取动态
        that.getdynamic();

        // 获取成绩单
        that.gettranscript();

        // 获取奖励
        that.getreward();
    },
    onShow: function (options) {
        var that = this;

        that.getcoachinf();

        that.getimglist();

        // this.getallinf();

        // 获取动态
        that.getdynamic();

        // 获取成绩单
        that.gettranscript();

        // 获取奖励
        that.getreward();

        // 活动
        that.getactivity();

    },
    
    //获取教练的个人信息
    getcoachinf: function (e) {
        var that = this;
        var data=null;
        console.group('id');
        console.log(that.data.uuid);
        console.groupEnd();
        if (!that.data.uuid){
            data={
                hash_value: app.globalData.hash_value,
                role: 'fitness'
            }
        }else{
            data = {
                hash_value: app.globalData.hash_value,
                uid:that.data.uuid,
                role: 'fitness'
            } 
        }
        wx.request({
            url: service_url + '/manager',
            data: data,
            success: function (res) {
                var x = res.data.response.about_class.today;
                var order = []
                for (var i = 0; i < x.length; i++) {
                    x[i].begin_hour = app.formatDateTime({ "inputTime": x[i].begin_time * 1000, "type": "hour" });
                    x[i].end_hour = app.formatDateTime({ "inputTime": x[i].end_time * 1000, "type": "hour" });
                    x[i].last_course = app.formatDateTime({ "inputTime": x[i].create_time * 1000, "type": "two" });
                    order.push(x[i]);
                }
                app.globalData.order = order;

                // 教练id
                app.globalData.coachid = res.data.response.user_info.uuid;

                wx.setStorageSync('head_figure', res.data.response.user_info.head_figure);

                that.setData({
                    gym_inf: res.data.response,
                    head_figure: res.data.response.user_info.head_figure,
                    name: res.data.response.user_info.nick_name,
                    rest_of_class: res.data.response.rest_of_class,
                    signing_sum: res.data.response.signing_sum,
                    count: res.data.response.about_class.count,
                    surplus: res.data.response.about_class.surplus,
                    order: order,
                    todaylist: res.data.response.about_class.today,
                    history: res.data.response.history_class_count,

                });
               
                // if (that.data.uuid == res.data.response.user_info.uuid){
                //     that.setData({
                //         jumid: true
                //     });
                // }

                if (res.data.response.sign_gym_info && res.data.response.sign_gym_info.length > 0) {
                    app.globalData.store_title = res.data.response.sign_gym_info[0].store_title;
                    //健身房id
                    app.globalData.unique_id = res.data.response.sign_gym_info[0].unique_id;
                    wx.setStorageSync('gym_id', res.data.response.sign_gym_info[0].gym_id);
                    that.setData({
                        signgym: true,
                        gym_id: res.data.response.sign_gym_info[0].gym_id
                    });
                } else {
                    that.setData({
                        signgym: false
                    });
                }
                if (res.data.response.about_class.first != 0 && res.data.response.about_class.last != 0) {
                    that.setData({
                        first: app.formatDateTime({ "inputTime": res.data.response.about_class.first * 1000, "type": "hour" }),
                        last: app.formatDateTime({ "inputTime": res.data.response.about_class.last * 1000, "type": "hour" })
                    });
                } else {
                    that.setData({
                        first: '-',
                        last: '-'
                    });
                }
                wx.setStorageSync('coachid', res.data.response.user_info.uuid);
                wx.setStorageSync('name', res.data.response.user_info.nick_name);
                // wx.setStorageSync('head_figure', res.data.response.user_info.head_figure);
                wx.setStorageSync('phone_number', res.data.response.user_info.phone_num);
                wx.setStorageSync('signing_sum', res.data.response.signing_sum);
                wx.setStorageSync('uuid', res.data.response.user_info.uuid);

                // // 活动
                // that.getactivity();

            }
        });
    },
    //获取相册的前4张图片
    getimglist: function (e) {
        var that = this;
        var data=null;
        if (!that.data.uuid) {
            data = {
                hash_value: app.globalData.hash_value,
                limit: '4',
                page: '1'
            }
        } else {
            data = {
                hash_value: app.globalData.hash_value,
                uid: that.data.uuid,
                limit: '4',
                page: '1'
            }
        }
        wx.request({
            url: service_url + '/album/info',
            data: data,
            success: function (res) {
                console.log(res)
                var data = res.data.response.list;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].img_url.indexOf('http') != 0) {
                        data[i].img_url = imgurl + data[i].img_url;
                    }
                }
                that.setData({
                    photo: {
                        photo_list: data,
                        count: res.data.response.count
                    }
                })
            }
        });
    },
    // 获取动态
    getdynamic: function () {
        var that = this;
        var hash_value = app.globalData.hash_value;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 1,
            },
            success: function (res) {
                if (res.data.response.list && res.data.response.list.length > 0) {
                    var data = res.data.response.list;
                    for (var i = 0; i < data.length; i++) {
                        data[i].details.create_time = app.formatDateTime({ "inputTime": data[i].details.create_time * 1000, "type": "all" });
                    }
                    that.setData({
                        circlelist: data,
                        pagesum: res.data.response.page_sum
                    });
                    wx.setStorage({
                        key: 'gym_id',
                        data: res.data.response.list[0].details.gym_id,
                    });
                }

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
                if (res.data.response.list && res.data.response.list.length > 0) {
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
                if (res.data.response.list && res.data.response.list.length > 0) {
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
            }
        })
    },
    // 活动
    getactivity: function (e) {
        var that = this;
        var hash_value = app.globalData.hash_value;
        var gym_id = that.data.gym_id;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 4,
                gym_id: gym_id,
                gym: ''
            },
            success: function (res) {
                if (res.data.response.list && res.data.response.list.length > 0) {
                    var data = res.data.response.list[0];
                    var datalist = res.data.response.list;
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
                        datalist: datalist,
                        day: day,
                        begin: begin,
                        end: end,
                        time: app.formatDateTime({ 'inputTime': res.data.response.list[0].details.date_time * 1000, 'type': 'one' })
                    });
                }
            }
        })
    },
    coachInfo: function () {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/index'
        })
    },
    bindlist: function () {
        wx.navigateTo({
            url: '/pages/coach/memberlist/index'
        })
    },
    //剩余课时
    surpluslesson: function () {
        wx.navigateTo({
            url: '/pages/coach/surpluslesson/index'
        })
    },
    //历史课时
    lessonhistory: function () {
        var that = this
        console.log(that.data.history);
        wx.navigateTo({
            url: '/pages/coach/lessonhistory/index?history=' + that.data.history
        })
    },
    todaylist: function () {
        var that = this
        this.setData({
            order: that.data.todaylist,
            today: true
        })
    },
    tomorrowlist: function () {
        var that = this
        wx.request({
            url: app.globalData.service_url + '/course/about_class_info',
            data: {
                hash_value: app.globalData.hash_value,
                condition: 'tomorrow'
            },
            success: function (res) {
                that.setData({
                    order: res.data.response.about_class.today,
                    today: false
                })
            }
        })
    },
    bindcircle: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/coach/circle/index?id=' + id + '&wid=' + e.currentTarget.dataset.wid
        })
    },
    tabactdetails: function (e) {
        wx.navigateTo({
            url: '/pages/activity/actdetails/index?id=' + e.currentTarget.dataset.id
        })
    },
    tabrewrodetails: function (e) {
        wx.navigateTo({
            url: '/pages/member/reword/index?id=' + e.currentTarget.dataset.id
        })
    },
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

                // 获取动态
                that.getdynamic();

                // 获取成绩单
                that.gettranscript();

                // 获取奖励
                that.getreward();

                // 活动
                that.getactivity();
            }
        })
    },
    member: function () {
        wx.switchTab({
            url: '/pages/member/index',
        })
    },
    //进入相册
    photolist: function (e) {
        var number = e.currentTarget.dataset.number
        wx.navigateTo({
            url: '/pages/coach/photolist/index?number=' + number,
        })
    },
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

                that.setData({
                    commentvalue: ''
                });

                // 获取动态
                that.getdynamic();

                // 获取成绩单
                that.gettranscript();

                // 获取奖励
                that.getreward();

                // 活动
                that.getactivity();

            }
        })
    },
    tocircle: function (e) {
        wx.navigateTo({
            url: '/pages/coach/publish/index?id=' + e.currentTarget.dataset.id + '&memid=' + e.currentTarget.dataset.memid + '&coid=' + e.currentTarget.dataset.coid
        })
    },
    tabtranscript: function (e) {
        console.log('ceshi');
        wx.navigateTo({
            url: '/pages/coach/transcriptdetails/index?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index
        });
    },
    showdymaic: function (e) {
        var that = this;
        that.getactivity();
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
            },
        });
    },
    searchgym: function (e) {
        wx.navigateTo({
            url: '/pages/coach/searchgym/index',
        });
    },
    tabfooter: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (index == 1) {
            if (that.data.signgym) {
                that.setData({
                    fotimg: fotimg[index]
                });
                if (that.data.role == 'boss') {
                    wx.reLaunch({
                        url: '/pages/gym/index?role=' + 'boss',
                    });
                } else {
                    wx.reLaunch({
                        url: '/pages/gym/index?role=' + '',
                    });
                }

            } else {
                wx.showToast({
                    title: '还未签约健身房',
                    icon: 'loading',
                    duration: 1000
                });
            }

        }
    },
    addactivity: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/member/joinactivity/index?id=' + id
        })
    },
    //点赞跳转
    thumbsuser: function (e) {
        var uuid = e.currentTarget.dataset.uuid;
        wx.request({
            url: service_url + '/manager',
            data: {
                hash_value: app.globalData.hash_value,
                uid: uuid
            },
            success: function (res) {
                console.log(res.data.response.role);
                if (res.data.response.role == 'member') {
                    wx.navigateTo({
                        url: '/pages/thumbsuser/index?uuid=' + uuid
                    });
                } else {
                    wx.navigateTo({
                        url: '/pages/coach/index?uuid=' + uuid
                    });
                }
            }
        });

    },
    onPullDownRefresh: function (e) {

        var that = this;

        wx.stopPullDownRefresh();

        // 获取动态
        that.getdynamic();

        // 获取成绩单
        that.gettranscript();

        // 获取奖励
        that.getreward();

        // 活动
        that.getactivity();

       
    },
   
})