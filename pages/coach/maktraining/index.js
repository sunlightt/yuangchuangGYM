var app = getApp();
var service_url = app.globalData.service_url;
Page({
    data: {
        bodyvalue: ['', '', '', '', '', '']
    },
    onLoad: function (options) {
        this.setData({
            id: options.id
        });

        this.getquestion();
    },
    modify: function (e) {

        wx.navigateTo({
            url: '/pages/coach/maktraining/modify/index?index=' + e.currentTarget.dataset.index
        });
    },
    question: function (e) {
        wx.navigateTo({
            url: '/pages/question/index?id=' + e.currentTarget.dataset.id
        })
    },
    //获取问题列表
    getquestion: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/question/type/info',
            data: {
                hash_value: app.globalData.hash_value,
                gym_id: app.globalData.unique_id
            },
            success: function (res) {
                console.log(res);
                var data = res.data.response;
                that.setData({
                    question: data
                });
            }

        })
    },
    submit: function (e) {
        var that = this;
        var bodyvalue = that.data.bodyvalue;
        var resault = app.globalData.queresault;
        var anwserstr = JSON.stringify(resault);
        for (var i = 0; i < bodyvalue.length; i++) {
            if (bodyvalue[i] == '') {
                wx.showToast({
                    title: '请填写信息',
                    icon: 'loading',
                    duration: 1000
                });
                return;
            }
        }
        wx.request({
            url: service_url + '/indicators/push',
            data: {
                hash_value: app.globalData.hash_value,
                bust: that.data.bodyvalue[0],
                waist: that.data.bodyvalue[0],
                hip_dimension: that.data.bodyvalue[0],
                weight: that.data.bodyvalue[0],
                bmi: that.data.bodyvalue[0],
                body_fat_rate: that.data.bodyvalue[0]
            },
            success: function (res) {
                if (res.data.success){
                    //健康状况id
                    app.globalData.health_id = res.data.response.id;
                    wx.request({
                        url: service_url + '/answer/questions?health_id=' + res.data.response.id + '&hash_value=' + app.globalData.hash_value,
                        data: anwserstr,
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        success: function (res) {
                            console.log(res);
                            if(res.data.success){
                                wx.navigateBack({
                                    delta:3
                                });
                            }else{
                                wx.showToast({
                                    title: '提交失败',
                                    icon:'loading',
                                    duration:1000
                                });
                            }
                        }
                    });
                }
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getquestion();
        wx.stopPullDownRefresh();
    }
})