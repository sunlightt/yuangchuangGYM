// pages/photolist/photolist.js
var app = getApp()
var service_url = app.globalData.service_url;
const qiniuUploader = require("../../../utils/qiniuUploader");
var imgurl = app.globalData.imgurl;
initQiniu();
function initQiniu() {
    var options = {
        region: 'NCN', // 华北区
        uptoken: app.globalData.upload_token,
        domain: 'https://safe.yuanchuangyuan.com/',
        shouldUseQiniuFileName: false
    };
    qiniuUploader.init(options);
}
Page({
    data: {
        photo_list: []
    },
    onLoad: function (options) {
        var that = this;
        that.getalbum();
    },
    getalbum:function(e){
        var that = this
        wx.request({
            url: service_url + '/album/info',
            data: {
                hash_value: app.globalData.hash_value,
            },
            success: function (res) {
                var data = res.data.response.list;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].img_url.indexOf('http') != 0) {
                        data[i].img_url = imgurl + data[i].img_url;
                    }
                }
                that.setData({
                    photo_list: data,
                    count: res.data.response.count
                })
            }
        })
    },
    clickimg: function (e) {
        var that = this
        var touchTime = that.data.touch_end - that.data.touch_start;
        if (touchTime > 350) {
            wx.showModal({
                title: '提示',
                content: '是否删除该图片',
                success: function (res) {
                    var photo_list = that.data.photo_list;
                    console.log(res)
                    if (res.confirm) {
                        for (var i = 0; i < photo_list.length; i++) {
                            if (e.currentTarget.dataset.id == photo_list[i].id) {
                                photo_list.splice(i, 1)
                            }
                        }
                        that.setData({
                            photo_list: photo_list
                        })
                        wx.request({
                            url: service_url + ' /album/delete',
                            data: {
                                hash_value: app.globalData.hash_value,
                                id: e.currentTarget.dataset.id
                            },
                            success: function (res) {
                                console.log(res)
                            }
                        })
                    }
                }
            })
        } else {
            var photo_list = this.data.photo_list
            var arr = []
            for (var i = 0; i < photo_list.length; i++) {
                arr.push(photo_list[i].img_url)
            }
            var current = e.target.dataset.src
            wx.previewImage({
                current: current,
                urls: arr//内部的地址为绝对路径
            })
        }
    },
    upimg: function (e) {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                var filePath = res.tempFilePaths[0];
                // 交给七牛上传
                qiniuUploader.upload(filePath, (res) => {
                    var imgurls = imgurl + res.key
                    console.log(imgurls);
                    var photo_list = that.data.photo_list;
                    photo_list.push({ 'img_url': imgurls});
                    console.log({});
                    that.setData({
                        photo_list: photo_list
                    });
                    
                    wx.request({
                        url: app.globalData.service_url + '/album/push',
                        data: {
                            hash_value: app.globalData.hash_value,
                            course_dynamic_id: that.data.id,
                            img_url: res.key
                        },
                        success: function (res) {
                        }
                    })
                }, (error) => {
                    console.log('error: ' + JSON.stringify(error));
                })
            }
        })

    },
    mytouchstart: function (e) {
        let that = this;
        that.setData({
            touch_start: e.timeStamp
        })
    },
    //按下事件结束  
    mytouchend: function (e) {
        let that = this;
        that.setData({
            touch_end: e.timeStamp
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        that.getalbum();
        wx.stopPullDownRefresh();
    }

})