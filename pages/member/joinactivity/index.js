// pages/joinactivity/joinactivity.js
var common = require("../../../utils/util.js")
var app = getApp();
var fotimg = [['/resources/img/home-active.png', '/resources/img/gym.png'], ['/resources/img/home.png', '/resources/img/gym-active.png']];
Page({

    data: {
        imgurl: app.globalData.imgurl,
        index:0,
        fotimg: fotimg[0]
    },
    onLoad: function (options) {
        var that = this
        this.setData({
            id: options.id
        });

        that.getactivinf();
       
    },
    getactivinf:function(e){
         var that=this;
         wx.request({
             url: app.globalData.service_url + '/activity/info',
             data: {
                 hash_value: app.globalData.hash_value,
                 id: that.data.id,
                 details: ''
             },
             success: function (res) {
                 var data = res.data.response;
                 var date = new Date(res.data.response.date_time * 1000);
                 var year = date.getFullYear();
                 var day = res.data.response.over_time - res.data.response.date_time;
                 day = Math.ceil(day / 86400);
                 var begin = common.formatTime(res.data.response.date_time * 1000, 'zh')
                 var end = common.formatTime(res.data.response.over_time * 1000, 'zh')
                 var arr = res.data.response.location_code.split(',');
                 if (data.pictures.indexOf(',') != -1) {
                     data.pictures = data.pictures.split(',');
                 } else {
                     data.pictures = [data.pictures];
                 }
                 that.setData({
                     res: data,
                     number: res.data.response.join_list.length,
                     latitude: arr[1],
                     id: res.data.response.id,
                     longitude: arr[0],
                     markers: [{
                         iconPath: "/resources/img/map-symbol.png",
                         id: 0,
                         latitude: arr[1],
                         longitude: arr[0],
                         width: 18,
                         height: 24
                     }],
                     begin: begin,
                     end: end,
                     year: year,
                     day: day
                 })
             }
         });
    },
    savebtn: function () {
        var that = this;
        //活动id
        var activity_id = that.data.res.id;
        wx.request({
            url: app.globalData.service_url + '/join/activity',
            data: {
                hash_value: app.globalData.hash_value,
                activity_id: that.data.id
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                if (res.data.msg == "resquest success") {
                    wx.showModal({
                        title: '提示',
                        content: "已成功报名",
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta:1 
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({

                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }
        })
    },
    tabpic:function(e){
        var index = e.currentTarget.dataset.index;
        var that=this;
        if (that.data.res.pictures[index]){
            that.setData({
                index:index
            })
        }
    },
    tabfooter: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            fotimg: fotimg[index]
        });
        if (index == 1) {
            wx.reLaunch({
                url: '/pages/gym/index',
            });
        }
    },
    tabfooter: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            fotimg: fotimg[index]
        });
        if (index == 0){
            wx.reLaunch({
                url: '/pages/member/index',
            });
        }else if (index == 1) {
            wx.reLaunch({
                url: '/pages/gym/index',
            });
        }
    },
    onPullDownRefresh: function (e) {
        var that = this;
        that.getactivinf();
        wx.stopPullDownRefresh();
    }
})