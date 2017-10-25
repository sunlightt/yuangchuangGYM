
var app = getApp();
var service_url = app.globalData.service_url;
Page({
    data: {
        share:''
    },
    onLoad: function (options) {
        this.setData({
            imgurl: app.globalData.imgurl,
            figure_head: wx.getStorageSync('avatarUrl'),
            name: wx.getStorageSync('name')
        });
        this.getuiqid();
    },  
    getuiqid:function(e){
        var that=this;
        wx.request({
            url: service_url +'/member/acout/uniqid',
            data:{
                'hash_value': app.globalData.hash_value
            },
            success:function(res){
                that.setData({
                    uniqid: res.data.response.uniqid,
                    replay_date: app.formatDateTime({ 'inputTime': res.data.time_stamp * 1000, 'type': 'all' })
                });
            }
        })
    },
    bindFormSubmit: function (e) {
        var that=this;
        that.setData({
            message: e.detail.value.textarea
        });
        if (that.data.share==''){
            wx.request({
                url: service_url + '/member/acout_course',
                data: {
                    hash_value: app.globalData.hash_value,
                    fitness_id: wx.getStorageSync('fitness_id'),
                    message: e.detail.value.textarea,
                    uniqid: that.data.uniqid
                },
                success: function (res) {
                    if (res.data.success) {
                        that.setData({
                            share: 'share'
                        });
                        wx.showToast({
                            title: '点击通知教练',
                            icon: 'loading',
                            duration: 1000
                        });
                    } else {
                        that.setData({
                            share: ''
                        });
                        wx.showToast({
                            title: '你已约过!',
                            icon: 'loading',
                            duration: 1000
                        });
                        setTimeout(function(){
                            wx.navigateBack({
                                delta:1
                            });
                        },1000);
                    }
                }
            })
        }
    },
    onShareAppMessage:function(e){
        var that=this;
        return {
            title: '约课邀请',
            path: 'pages/coach/coachinfo/message/orderreply/index?id=' + app.globalData.userid,
            success: function (res) {
                // 转发成功
                var uniqid = that.data.uniqid;
                wx.request({
                    url: service_url + '/member/acout/info',
                    data: {
                        'hash_value': app.globalData.hash_value,
                        'uniqid': uniqid
                    },
                    success: function (res) {
                    }
                });
                wx.navigateBack({
                    delta:1
                });
            }
        }
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getuiqid();
        wx.stopPullDownRefresh();
    }
    
})