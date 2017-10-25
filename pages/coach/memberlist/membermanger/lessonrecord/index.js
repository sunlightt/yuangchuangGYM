// lessonrecord.js
var common = require("../../../../../utils/util.js")
var app = getApp()
Page({

    data: {
        list: [],
        dateformat: common
    },
    onLoad: function (options) {
       
        var that = this
        this.setData({
            member_id: options.id,
            option_before_hours: options.lessons,
            bought: options.bought
        });

        that.getcourseinf();
        
    },
    getcourseinf:function(e){
        var that=this;
        wx.request({
            url: app.globalData.service_url + '/member/hours/info',
            data: {
                hash_value:app.globalData.hash_value,
                member_id: that.data.member_id,
                option: '1'
            },
            success: function (res) {
                var x = res.data.response.list;
                var list = []
                for (var i = 0; i < x.length; i++) {
                    x[i].day = common.formatTime(x[i].create_time * 1000, 'day')
                    list.push(x[i])
                }
                that.setData({
                    list: list
                })
            }
        });
    },
    onShow:function(opations){
        this.getcourseinf();
    },
    addcourse: function (e) {
        var that=this;
        wx.navigateTo({
            url: '/pages/coach/memberlist/membermanger/lessonrecord/addcourse/index?id=' + that.data.member_id + '&lessons=' + that.data.lessons + '&bought=' + that.data.bought
        })

    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getcourseinf();
        wx.stopPullDownRefresh();
    }

})