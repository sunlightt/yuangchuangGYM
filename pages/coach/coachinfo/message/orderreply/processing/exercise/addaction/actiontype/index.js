// actiontype.js
var app = getApp();
var service_url = app.globalData.service_url;
Page({
    data: {
        action: {
            title: '',
            id: ""
        }
    },
    bindKeyInput: function (e) {
        this.setData({
            action: {
                title: e.detail.value,
                id: ""
            }
        })
    },
    savebtn: function () {
        var that = this
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        wx.request({
            url:service_url+'/fitness/train/action/cate/add',
            method: 'post',
            data: {
                hash_value: app.globalData.hash_value,
                title: that.data.action.title
            },
            success: function (res) {
                if (res.data.success){
                    wx.showToast({
                        title: '添加成功',
                        icon:'loading',
                        duration:1000
                    });
                    setTimeout(function(e){
                        wx.navigateBack({
                            delta: 1
                        });  
                    },1000);
                }else{
                    wx.showModal({
                        title: '提示信息',
                        content:res.data.msg,
                        showCancel:false,
                    });
                }
                that.data.action.id = res.data.response.id;
                prevPage.data.list.push(that.data.action)
                prevPage.setData({
                    list: prevPage.data.list
                })
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
    
})