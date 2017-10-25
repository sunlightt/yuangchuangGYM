
Page({

    onReady: function () {

    },
    bindKeyInput: function (e) {
        console.log(e)
        this.setData({
            inputValue: e.detail.value
        })
    },
    onPullDownRefresh: function (e) {
        wx.stopPullDownRefresh();
    }
})