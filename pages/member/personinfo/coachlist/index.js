// coachlist.js

var app=getApp();
var service_url = app.globalData.service_url;

Page({
    
    data: {
        imgurl: app.globalData.imgurl,
    },
    onLoad: function (options) {
        
        this.getorder();
    },
    getorder: function (e) {
        var that=this;
        wx.request({
            url: service_url + '/member/fitness/signing/list',
            data: {
                hash_value:app.globalData.hash_value
            },
            success: function (res) {

                console.log(res);

                var order_data = res.data.response;
                for (var i = 0; i < order_data.length;i++){
                    order_data[i]
                }
                that.setData({
                    order_data: order_data
                }) 

            }
        })
    },
    // 解约
    unsigning:function(e){
        console.log('dexhighdi');
        var gym_id = app.globalData.gym_fitness_info.gym_id;
        var fitness_instructor_id = app.globalData.gym_fitness_info.fitness_id;
        wx.request({
            url: service_url +'/member/unsigning/fitness',
            method:'POST',
            data:{
                hash_value:app.globalData.hash_value,
                fitness_instructor_id: fitness_instructor_id,
                gym_id: gym_id
            },
            success:function(res){

                console.log(res);
                if (res.data.success==true){
                    wx.showToast({
                        title:'解约成功',
                        icon:'success',
                        duration:1000
                    });
                    setTimeout(function () {
                        wx.switchTab({
                            url: '/pages/member/index',
                        })
                    }, 1000);

                    this.getorder();

                }else{
                    wx.showToast({
                        title: '解约失败',
                        icon: 'success',
                        duration: 1000
                    })
                }
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getorder();
        wx.stopPullDownRefresh();
    }

})