var app = getApp();
var service_url = app.globalData.service_url;
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        onshow:false
    },
    onLoad: function (opations) {
        var that=this;
        wx.showLoading({
            title: '加载中'
        });

        var timer=setInterval(function(){

            if (app.globalData.netwrorkstate) {
                that.setData({
                    onshow:true
                })
                wx.hideLoading();
                clearInterval(timer);
            }
        },1000);
    },
    choicerole: function (e) {
        var that = this;
        var base_info = app.globalData.base_info;
        var index = e.currentTarget.dataset.index;
        var role = null;
        if (base_info) {
            if (index == 2) {
                role = 'boss';
                wx.navigateTo({
                    url: '/pages/coach/index?role=' + role
                });
            }else if (index == 3) {
                role = 'boss';
                wx.navigateTo({
                    url: '/pages/boss/finish/index'
                });
            }else{
                wx.showToast({
                    title: '和已选角色不符',
                    cion:'loading',
                    duration:1000
                });
            }
        } else {
            
            if (index == 1){
                role ='member';
            } else if (index == 2){
                role = 'fitness';
            } else if (index == 3){
                role = 'boss';
            }
            wx.request({
                url: service_url + '/user/setrole',
                data: {
                    hash_value: app.globalData.hash_value,
                    role: role
                },
                success: function (res) {
                    wx.getUserInfo({
                        success: function (res) {
                            wx.setStorageSync('nick_name', app.globalData.hash_value);
                            wx.setStorageSync('head_figure', res.userInfo.avatarUrl);
                            wx.setStorageSync('gender', res.userInfo.gender);
                            wx.request({
                                url: service_url + '/user/monity_info',
                                data: {
                                    hash_value: app.globalData.hash_value,
                                    nick_name: res.userInfo.nickName,
                                    head_figure: res.userInfo.avatarUrl,
                                    gender: res.userInfo.gender
                                },
                                success: function (res) {
                                    if(res.data.success){
                                        wx.reLaunch({
                                            url: '',
                                        })
                                        if (index ==1) {
                                            wx.reLaunch({
                                                url: '/pages/member/index',
                                            });
                                        } else if (index == 2) {
                                            wx.reLaunch({
                                                url: '/pages/coach/index?role=' + role,
                                            });
                                        } else if (index ==3) {
                                            wx.navigateTo({
                                                url: '/pages/boss/binding/index'
                                            })
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})
