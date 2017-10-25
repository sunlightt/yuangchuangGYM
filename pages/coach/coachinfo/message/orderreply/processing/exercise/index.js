// exercise.js
Page({

    data: {
        list: [],
        result: []
    },
    addaction: function () {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/message/orderreply/processing/exercise/addaction/index'
        })
    },
    savebtn: function () {
        var that = this
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
            result: that.data.result,
            action: true
        })
        wx.navigateBack({
            delta:1
        });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})