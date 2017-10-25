// processing.js
var app = getApp();
var service_url = app.globalData.service_url;
Page({

    data: {
        time: {
            endtime: '',
            starttime: '',
        },
        action: false,
        feeding: 1,
    },
    onLoad: function (options) {
        this.setData({
            member_id: options.id,
            mes: options.mes,
            sendid: options.sendid
        })
    },
    //安排会员课程
    arange_clas:function(){
        var that=this;
        wx.request({
            url: service_url +'/arrange/course/accept',
            data:{
                hash_value: app.globalData.hash_value,
                member_id: that.data.member_id,
            }
        })
    },
    radioChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            feeding: e.detail.value
        })
    },
    
    onShow: function () {
        console.log(this.data)
    },

    settime: function () {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/message/orderreply/processing/settime/index'
        })
    },
    exercise: function () {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/message/orderreply/processing/exercise/index'
        })
    },
    target:function(e){
        wx.navigateTo({
            url: '/pages/coach/coachinfo/message/orderreply/processing/target/index',
        })
    },
    savebtn: function (e) {
        var that = this;
        wx.request({
            url: app.globalData.service_url + '/arrange/course/accept',
            data: {
                hash_value:app.globalData.hash_value,
                member_id: that.data.sendid,
                begin_time: that.data.time.starttime,
                end_time: that.data.time.endtime,
                course_content: JSON.stringify(that.data.result),
                target_section: that.data.targetvalue,
                feeding: that.data.feeding
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res);
                wx.request({
                    url: app.globalData.service_url + '/alerts/reading',
                    data: {
                        hash_value: app.globalData.hash_value,
                        id: that.data.mes
                    },
                    success:function(res){
                        console.log(res);
                    }
                })
                if(res.data.success){
                    wx.navigateTo({
                        url: '/pages/coach/index',
                    });
                }
            }

        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})