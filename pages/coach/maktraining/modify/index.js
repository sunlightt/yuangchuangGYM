
Page({
    data: {
        value:''
    },
    onLoad: function (options) {
        var that=this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var preData = prevPage.data.bodyvalue;
        if (preData[options.index]!=''){
            that.setData({
                value: preData[options.index]
            });
        }
        this.setData({
            index: options.index
        });
    },
    bindKeyInput:function(e){
        console.log(e);
        this.setData({
            value: e.detail.value
        });
    },
    savebtn:function(e){
        var that=this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; 
        var preData = prevPage.data.bodyvalue;
        preData[that.data.index] = that.data.value;
        prevPage.setData({
            bodyvalue: preData
        });
        wx.navigateBack({
            delta:1
        });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
    

})