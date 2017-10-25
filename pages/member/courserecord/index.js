var app = getApp();
var service_url = app.globalData.service_url;
Page({
    data: {
        bool: true,
        bool1: false,
        bought_class:null,
        rest_of_class: null,
        store_title: null,
    },
    onLoad: function (options) {
        var that=this;
        if (!options.index){
            that.setData({
                bought_class: app.globalData.gym_fitness_info.bought_class,
                rest_of_class: app.globalData.gym_fitness_info.rest_of_class,
                store_title: app.globalData.gym_fitness_info.store_title
            });
        }else{
            wx.request({
                url: app.globalData.service_url + '/fitness/member/list',
                data: {
                    hash_value: app.globalData.hash_value
                },
                success: function (res) {
                    that.setData({
                        bought_class: res.data.response.list[options.index].bought_class,
                        rest_of_class: res.data.response.list[options.index].rest_of_class,
                        store_title: app.globalData.store_title
                    })
                }
            })
        }
        var that = this
        wx.request({
            url: app.globalData.service_url + '/question/type/info',
            data: {
                hash_value:app.globalData.hash_value,
                gym_id: wx.getStorageSync('gym_id')
            },
            success: function (res) {
                var data = res.data.response;
                that.setData({
                    quetype:data
                })
            }
        });
        wx.request({
            url: app.globalData.service_url + '/indicators/info',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                var data = res.data.response;
                for(var i=0;i<data.length;i++){
                    data[i].create_time = app.formatDateTime({ 'inputTime': data[i].create_time * 1000, 'type':'two'});
                }
                that.setData({
                    recordlist: data
                })
            }
        });
        // 上课记录
        wx.request({
            url: service_url +'/course/history/info',
            data:{
                hash_value: app.globalData.hash_value
            },
            success:function(res){
                var data = res.data.response.list;
                for(var i=0;i<data.length;i++){
                    data[i].create_time = app.formatDateTime({ 'inputTime': data[i].create_time * 1000, 'type':'two'});
                }
                that.setData({
                    record_list:data,
                });
            }
        });
    },
    tabbar: function (e) {
        var that=this;
        var bool
        if (e.currentTarget.dataset.id == 1) {
            bool = true
        } else {
            bool = false;
        }
        this.setData({
            bool: bool
        })
    },
    question:function(e){
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/member/courserecord/question/index?id=' + id + '&hid=' + e.currentTarget.dataset.hid
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})