
var app=getApp();

Page({

    data: {
        array: []
    },
    onLoad: function (options) {
        this.getbodyinf();  
    },
    getbodyinf:function(e){
        var that = this;
        wx.request({
            url: app.globalData.service_url + '/indicators/info',
            data: {
                hash_value: app.globalData.hash_value
            },
            success: function (res) {
                console.log(res);
                var y, m, d;
                var x = res.data.response;
                for (var i = 0; i < x.length; i++) {
                    var time = new Date(x[i].create_time * 1000)
                    y = time.getFullYear();
                    m = time.getMonth();
                    d = time.getDay();
                    x[i].create_time = y + '-' + m + '-' + d;
                }
                that.setData({
                    array: res.data.response
                })
            }
        });
    },
    praseString: function (date) {
        var x = new Date(date);
        var y, m, d;
        y = x.getFullYear();
        m = x.getMonth();
        d = x.getDay();
        return y + '-' + m + '-' + d;
    },
    onReady: function () {
        
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.getbodyinf();  
        wx.stopPullDownRefresh();
    }
})