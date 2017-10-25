//index.js
//获取应用实例
var app = getApp();
var service_url = app.globalData.service_url;
var common = require("../../utils/util.js");
var fotimg = [['/resources/img/home-active.png', '/resources/img/gym.png'], ['/resources/img/home.png', '/resources/img/gym-active.png']];
Page({
    data: {
        imgurl: app.globalData.imgurl,
        motto: '',
        info:null,
        circlelist: [],
        // 显示动态类型
        dynamic_type:1,
        fotimg: fotimg[0],
        typearr: ['课程动态', '奖励表', '成绩单', '活动']
    },
    onLoad: function (opations) {
       
        var that = this
        var hash_value = app.globalData.hash_value;
      
        // 获取会员信息
        that.getmemberinfo();

        // 获取动态
        that.getdynamic();

        // 获取成绩单
        that.gettranscript();

        // 获取奖励
        that.getreward();

        // 获取教练信息
        // that.getcoachinf();

    },
    onShow: function (opations){
        
        var that=this;

        // 获取会员信息
        that.getmemberinfo();
        
        // 获取动态
        that.getdynamic();

        // 获取成绩单
        that.gettranscript();

        // 获取奖励
        that.getreward();

    },
    // 获取会员信息
    getmemberinfo:function(e){
        var that=this;
        wx.request({
            url: service_url + '/manager',
            data: {
                hash_value:app.globalData.hash_value
            },
            success: function (res) {
                that.setData({
                    motto: res.data.response.motto,
                    info: {
                        name: res.data.response.nick_name,
                        head_figure: res.data.response.head_figure,
                    }
                });
                // 用户id
                app.globalData.userid = res.data.response.uuid; 

                //是否签约教练
                if (res.data.response.gym_fitness_info){
                   app.globalData.gym_fitness_info = res.data.response.gym_fitness_info;
                   wx.setStorageSync('gym_id', res.data.response.gym_fitness_info);
                   that.setData({
                        gym_id: res.data.response.gym_fitness_info.gym_id,
                        gym_fitness_info: res.data.response.gym_fitness_info,
                   });
                   wx.setStorage({
                       key: 'fitness_id',
                       data: res.data.response.gym_fitness_info.fitness_id,
                   });
                   that.setData({
                       signcoach: true
                   });
                }else{
                    that.setData({
                        signcoach:false
                    });
                }

                wx.setStorage({
                    key: "sex",
                    data: res.data.response.gender
                });
                wx.setStorage({
                    key: "phone_number",
                    data: res.data.response.phone_num
                });
                wx.setStorage({
                    key: 'avatarUrl',
                    data: res.data.response.head_figure,
                });
                wx.setStorage({
                    key: 'name',
                    data: res.data.response.nick_name,
                });
                
                // 活动
                that.getactivity();
            }
        });
    },
    // 获取动态
    getdynamic:function(){
        var that=this;
        var hash_value=app.globalData.hash_value;
        wx.request({
            url: service_url + '/user/circle',
            data:{
                hash_value:hash_value,
                type: 1
            },
            success:function(res){
                if (res.data.response.list && res.data.response.list.length>0){
                    var data = res.data.response.list
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
    //获取奖励
    getreward:function(e){
        var that = this;
        var hash_value = app.globalData.hash_value;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type:2,
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
    // 获取成绩单
    gettranscript:function(){

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
    // 活动
    getactivity:function(e){
        var that = this;
        var hash_value = app.globalData.hash_value;
        var gym_id = that.data.gym_id;
        wx.request({
            url: service_url + '/user/circle',
            data: {
                hash_value: hash_value,
                type: 4,
                gym_id: gym_id,
                gym:''
            },
            success: function (res) {
                if (res.data.response.list && res.data.response.list.length > 0) {
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
    bindmyhome: function () {
        wx.navigateTo({
            url: '/pages/member/personinfo/index'
        })
    },
    bindbodyRecord: function () {
        wx.navigateTo({
            url: '/pages/member/bodyRecord/index'
        })
    },
    bindorder: function (e) {
        if (this.data.signcoach){
            wx.navigateTo({
                url: '/pages/member/order/index'
            });
        }else{
            wx.showToast({
                title: '请签约教练',
                icon:'loading',
                duration:1000
            })
        }
        
    },
    bindmotto: function () {
        wx.navigateTo({
            url: '/pages/member/motto/index'
        })
    },
    regionchange:function(e) {
        console.log(e.type)
    },
    markertap: function(e) {
        console.log(e.markerId)
    },
    controltap: function(e) {
        console.log(e.controlId)
    },
    bindmap: function () {
        wx.navigateTo({
            url: '/pages/mapdetail/index',
        })
    },
    searchcoach: function () {
        wx.navigateTo({
            url: '/pages/member/searchcoach/index',
        })
    },
    courserecord: function () {
        if (this.data.signcoach) {
            wx.navigateTo({
                url: '/pages/member/courserecord/index'
            });
        } else {
            wx.showToast({
                title: '请签约教练',
                icon: 'loading',
                duration: 1000
            })
        }
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
                if (res.data.success==true){
                    console.log('点赞成功');
                    console.log(res);
                    
                    // 获取动态
                    that.getdynamic();

                    // 获取成绩单
                    that.gettranscript();

                    // 获取奖励
                    that.getreward();

                    that.getactivity();

                }
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
                // 获取动态
                that.getdynamic();

                // 获取成绩单
                that.gettranscript();

                // 获取奖励
                that.getreward();

                that.getactivity();
            }
        })
    },
    bindcircle: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/member/circle/index?id=' + id + '&wid=' + e.currentTarget.dataset.wid
        })
    },
    addactivity: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/member/joinactivity/index?id=' + id
        })
    },
    tabrewrodetails:function(e){
        wx.navigateTo({
            url: '/pages/member/reword/index?id=' + e.currentTarget.dataset.id
        })
    },
    tabtranscript:function(e){
        wx.navigateTo({
            url: '/pages/member/transcriptdetails/index?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index
        })
    },
    tabactive: function (e) {
        wx.navigateTo({
            url: '/pages/member/activedetails/index',
        })
    },
    tabthumbsuser:function(e){
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/thumbsuser/index?id='+ id
        })
    },
    tabactdetails:function(e){
        wx.navigateTo({
            url: '/pages/activity/actdetails/index?id=' + e.currentTarget.dataset.id
        })
    },
    tabfooter:function(e){
        var that=this;
        var index = e.currentTarget.dataset.index;  
        this.setData({
            fotimg: fotimg[index] 
        });
        if (index==1){
            if (that.data.signcoach) {
                that.setData({
                    fotimg: fotimg[index]
                });
                wx.reLaunch({
                    url: '/pages/gym/index?roles=memmber',
                });
            } else {
                wx.showToast({
                    title: '还未签约教练',
                    icon: 'loading',
                    duration: 1000
                });
            }
        }
    },
    showdymaic: function (e) {
        var that = this;
        wx.showActionSheet({
            itemList: ['课程动态', '奖励表', '成绩单', '活动'],
            success: function (res) {
                var index=null;
                if (!res.tapIndex){
                    index=1; 
                }else{
                    index = res.tapIndex + 1;
                }
                that.setData({
                    dynamic_type: index
                });
            },
        });
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

        // 获取会员信息
        that.getmemberinfo();

        // 获取动态
        that.getdynamic();

        // 获取成绩单
        that.gettranscript();

        // 获取奖励
        that.getreward();

        // 获取教练信息
        // that.getcoachinf();

        wx.stopPullDownRefresh();
    }
})
