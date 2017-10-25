

var app = getApp();
var service_url = app.globalData.service_url;

Page({

    data: {

    },
    onLoad: function (options) {

    },

    submit: function (e) {

        console.log(e);

        var number = e.detail.value.number;
        var rnumber = e.detail.value.rnumber;
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(number))) {
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'loading',
                duration: 1000
            })
            return
        } else if (number != rnumber){
            wx.showToast({
                title:'手机号不一致',
                icon: 'loading',
                duration: 1000
            })
            return
        }
        wx.request({
            url: service_url +'/user/monity_info',
            data:{
                hash_value: app.globalData.hash_value,
                phone_num: number
            },
            success:function(res){
                console.log(res.data.success);
                if (res.data.success){
                    wx.showToast({
                        title: '绑定成功',
                        icon:'success',
                        duration:1000
                    });
                    setTimeout(function(){
                        wx.navigateTo({
                            url: '/pages/boss/submit/index'
                        })
                    },1000);
                }else{
                    wx.showToast({
                        title: '绑定失败',
                        icon: 'loading',
                        duration: 1000
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