// message.js
var common = require("../../../../utils/util.js")
var app = getApp();

Page({

    data: {
        list: [],
        dateformat: common
    },
    onLoad: function (opations) {
         
        //约课信息列表
        this.getreclass_list();
        
    },
    // 获取约课信息列表
    getreclass_list:function(e){
        var that = this
        wx.request({
            url: app.globalData.service_url + '/alert/info',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                console.log(res)
                var x = res.data.response;
                var list = []
                for (var i = 0; i < x.length; i++) {
                    x[i].hour = app.formatDateTime({ "inputTime": x[i].create_time * 1000, 'type': 'hour' });
                    x[i].day = app.formatDateTime({ "inputTime": x[i].create_time * 1000, 'type': 'day' });
                    list.push(x[i])
                }
                that.setData({
                    res_data: res.data.response,
                    list: list
                })
            }
        })

    },
    //点击跳转  1：签约  3：约课   2：内容
    orderreply: function (e) {
        var type1 = e.currentTarget.dataset.type
        var id = e.currentTarget.dataset.id;
        console.log(id);
        var figure = e.currentTarget.dataset.figure;
        if (type1 == 3) {
            wx.navigateTo({
                url: '/pages/coach/coachinfo/message/orderreply/index?id=' + id + '&figure=' + figure + '&mes=' + e.currentTarget.dataset.mes
            })
        } else if (type1 == 2) {
            wx.navigateTo({
                url: '/pages/coach/coachinfo/message/orderreply/index?id=' + e.currentTarget.dataset.id
            }) 
        } else if (type1 == 1) {
            wx.navigateTo({
                url: '/pages/coach/coachinfo/message/signapply/index?id=' + e.currentTarget.dataset.id + '&mes=' + e.currentTarget.dataset.mes
            })
        }
    },
    onPullDownRefresh: function (e) {
        var that = this;
        //约课信息列表
        this.getreclass_list();
        wx.stopPullDownRefresh();
    }
    
})