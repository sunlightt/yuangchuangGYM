// pages/coach/coachinfo/message/orderreply/processing/target/index.js
Page({
    data: {

    },
    onLoad: function (options) {

    },
    savebtn: function (e) {
        console.log(e);
        var that = this
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
            targetvalue: e.detail.value.target,
            target: true
        })
        wx.navigateBack({
            delta: 1
        });
    }
})