
var app = getApp();
Page({

    data: {
        imgurl: app.globalData.imgurl,
        default:false
    },
    onLoad: function (options) {
        this.getsinggym();
    },
    getsinggym: function (e) {
        var that = this;
        wx.request({
            url: app.globalData.service_url + '/gym/info',
            data: {
                hash_value: app.globalData.hash_value,
                unique_id: app.globalData.unique_id
            },
            success: function (res) {
                console.log(res);
                var data = res.data.response;
                data.create_time = app.formatDateTime({ 'inputTime': data.create_time * 1000, 'type':'two'});
                if (data.store_title =='系统默认的健身房'){
                    that.setData({
                        default:true
                    });
                }
                that.setData({
                    data:data
                });
            }
        })
    },
    unsigning:function(e){
        var that=this;
        wx.request({
            url: app.globalData.service_url + '/fitness/unsign/gym',
            data:{
                hash_value: app.globalData.hash_value,
                fitness_instructor_id: app.globalData.coachid,
                gym_id: app.globalData.unique_id,
            },
            method:'GET',
            success:function(res){
                that.getsinggym();
                if(res.data.success){
                    wx.showToast({
                        title: '解约成功',
                        icon:'loading',
                        duration:1000,
                    });
                    setTimeout(function(){
                        wx.navigateBack({
                            delta:2
                        })
                    },1000);

                }
            }
            
        })
    }
})