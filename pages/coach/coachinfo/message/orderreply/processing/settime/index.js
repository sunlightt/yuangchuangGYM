// settime.js
var app = getApp();
var imgurl = app.globalData.imgurl;
Page({
    data: {
        starttime: '12:01',
        endtime: '16:00',
        imgurl: imgurl
    },
    onLoad: function (options) {
        // 约课
        this.setData({
            order: app.globalData.order
        });
    },
    bindTimeChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if (e.currentTarget.id == 'start') {
            this.setData({
                starttime: e.detail.value
            })
        } else {
            this.setData({
                endtime: e.detail.value
            })
        }
    },
    savetime: function () {
        
        var that = this,
        starttime = this.data.starttime,
        endtime = this.data.endtime,
        starthour = starttime.slice(0, 2),
        startmin = starttime.slice(3, 5),
        endhour = endtime.slice(0, 2),
        endmin = endtime.slice(3, 5);
        console.log(starttime, starthour);

        var startdate = new Date();
        var enddate = new Date();

        var nowdate = new Date().getTime().starthour;
        

        startdate = parseInt(startdate.setHours(starthour, startmin) / 1000);
        enddate = parseInt(enddate.setHours(endhour, endmin) / 1000);
       
        // nowdate = parseInt(nowdate.setHours(endhour, endmin) / 1000);

        // if (startdate >= enddate) {
        //     return;
        // } else if (nowdate >= startdate){
        //     return;
        // }
        
        if (startdate >= enddate) {
            wx.showToast({
                title: '时间设置不符',
                icon:'loading',
                duration:1000
            });   
            return; 
        }else{

        }

        var pages = getCurrentPages();
        console.log(pages);
        var prevPage = pages[pages.length - 2];  //上一个页面
        // 直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
            time: {
                starttime: startdate,
                endtime: enddate,
            },
            settime: true
        });
        wx.navigateBack({
            delta:1
        });
    }
})