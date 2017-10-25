const qiniuUploader = require("../../../utils/qiniuUploader");
var app = getApp()
var imgurl = app.globalData.imgurl
initQiniu();
function initQiniu() {
    var options = {
        region: 'NCN', // 华北区
        uptoken: app.globalData.upload_token,
        // uptoken: 'xxxx',
        domain: 'http://oud405zol.bkt.clouddn.com',
        shouldUseQiniuFileName: false
    };
    qiniuUploader.init(options);
}
Page({
    data: {
        imgurl: imgurl,
        imgsrc:'/resources/img/1.jpg'
    },
    onLoad: function () {
        var  that=this;
        this.setData({
            name: wx.getStorageSync('name'),
            head_figure: wx.getStorageSync('head_figure'),
            phone_number: wx.getStorageSync('phone_number')
        });

        //获取二维码
        wx.request({
            url: app.globalData.service_url + '/get/qrcode/token',
            data: {
                grant_type: 'client_credential',
                hash_value: app.globalData.hash_value,
                appid: 'wx145fe54bbc990632',
                secret: '9aac1209e7dba0b7914f9a287a30b639',
                params: {
                    path: '/pages/index/index',
                    width: 430,
                    auto_color: false,
                    line_color: { "r": "0", "g": "0", "b": "0" }
                }
            },
            success: function (res) {
                if (res.data.src) {
                    that.setData({
                        previewsrc: res.data.src
                    });
                }
            }
        });   
    },
    bindheadimg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                var filePath = res.tempFilePaths[0];
                // 交给七牛上传
                qiniuUploader.upload(filePath, (res) => {

                    wx.setStorageSync('head_figure', that.data.imgurl+res.key)
                    that.setData({
                        head_figure: that.data.imgurl+res.key
                    });
                    wx.request({
                        url: app.globalData.service_url + '/user/monity_info',
                        data: {
                            hash_value: app.globalData.hash_value,
                            head_figure: that.data.imgurl+res.key
                        },
                        success: function (res) {
                            
                        }
                    })
                }, (error) => {
                    console.error('error: ' + JSON.stringify(error));
                })
            }
        })
    },
    bindname: function () {
        var that = this;
        wx.navigateTo({
            url: '/pages/member/personinfo/nameset/index'
        })
    },
    bindphone: function () {
        wx.navigateTo({
            url: '/pages/member/personinfo/setphone/index'
        })
    },
    bindgraderecord: function () {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/graderecord/index',
        })
    },
    bindmessage: function () {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/message/index',
        })
    },
    coachlist: function () {
        wx.navigateTo({
            url: '/pages/member/personinfo/coachlist/index',
        })
    },
    signgym: function (e) {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/singgym/index'
        })
    },
    previewimg:function(e){
        var that=this;
        console.log(that.data);
        wx.previewImage({
            current: that.data.previewsrc,
            urls: [that.data.previewsrc]
        });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }

})