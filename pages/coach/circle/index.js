// pages/circle/circle.js
const qiniuUploader = require("../../../utils/qiniuUploader");
var app = getApp()
var imgurl = app.globalData.imgurl;
var service_url = app.globalData.service_url;
var identity = false; //身份核实

initQiniu();
function initQiniu() {
    var options = {
        region: 'NCN', // 华北区
        uptoken: app.globalData.upload_token,
        // uptoken: 'xxxx',
        domain: 'https://safe.yuanchuangyuan.com/',
        shouldUseQiniuFileName: false
    };
    qiniuUploader.init(options);
}
Page({
    data: {
        imgurl: app.globalData.imgurl,
        img1: '/resources/img/borderplus.png',
        img2: '/resources/img/borderplus.png',
        img3: '/resources/img/borderplus.png',
        img4: '/resources/img/borderplus.png',
        duration: 600,
        imgurls: [],
        option: [
            { name: '1', value: '公开', checked: 'true' },
            { name: '2', value: '仅老板可见' }
        ],
        secret: 1 // 留言是否公开
    },

    onLoad: function (options) {
        var that = this
        this.setData({
            id: options.id,
            wid: options.wid
        });

        that.getdymaic();

        that.getpicture();

    },
    //获取图片
    getpicture: function (e) {
        var that = this;
        wx.request({
            url: app.globalData.service_url + '/course/dynamic/picture/info',
            data: {
                hash_value: app.globalData.hash_value,
                course_dynamic_id: that.data.wid
            },
            success: function (res) {
                console.log(res)
                var data = res.data.response;
                data.splice(3, data.length - 4);
                var imglist = [];
                for (var i = 0; i < data.length; i++) {
                    imglist.push(data[i].img_url);
                }
                console.log(imglist);
                that.setData({
                    imgurls: imglist
                });
            }
        })
    },
    //获取动态
    getdymaic: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/course/dynamic/info',
            data: {
                hash_value: app.globalData.hash_value,
                id: that.data.wid,
                detail: ''
            },
            success: function (res) {
                var data = res.data.response;
                data.course.create_time = app.formatDateTime({ 'inputTime': data.course.create_time * 1000, 'type': 'all' });
                data.course.picture = data.course.picture.split(',')[0];

                if (data.coach_id === app.globalData.coachid) {
                    identity = true;
                } else {
                    identity = false;
                }
                that.setData({
                    dynamicdata: data,
                    identity: identity
                });
            }
        })
    },
    tapimg: function (e) {
        console.log(e.currentTarget.dataset.index);
        this.setData({
            current: e.currentTarget.dataset.index
        });
    },
    onShareAppMessage: function (res) {
        var that=this;
        return {
            title: '健身房小程序',
            path: '/pages/coach/circle/index?id='+that.data.id,
            success: function (res) {
            },
        }
    },
    changeimg: function (e) {
        console.log(e)
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
                    var them = {}
                    them[e.currentTarget.dataset.img] = imgurl + res.key
                    var imgurls = that.data.imgurls
                    if (imgurls.length < 4) {
                        imgurls.push(res.key)
                    } else {
                        imgurls.shift();
                        imgurls.unshift(res.key);
                    }
                    that.setData(them)
                    that.setData({
                        imgurls: imgurls
                    })
                    wx.request({
                        url: app.globalData.service_url + '/course/dynamic/picture/push',
                        data: {
                            hash_value: app.globalData.hash_value,
                            course_dynamic_id: that.data.id,
                            img_url: that.data.imgurl+res.key
                        },
                        success: function (res) {
                            console.log(res)
                        }
                    })
                }, (error) => {
                    console.log('error: ' + JSON.stringify(error));
                })
            }
        })
    },
    radioChange: function (e) {
        console.log(e);
        this.setData({
            secret: e.detail.value
        })
    },
    thumb: function (e) {
        var that = this
        wx.request({
            url: service_url + '/circle/thumb',
            data: {
                hash_value: app.globalData.hash_value,
                circle_id: e.currentTarget.dataset.id
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
                if (res.data.success == true) {
                   
                    that.getdymaic();
                }
            }
        })

    },
    bindFormSubmit: function (e) {

        var that = this;

        this.setData({
            textarea: e.detail.value.textarea
        });
        // 公开1 老板见2
        wx.request({
            url: app.globalData.service_url + '/circle/comment/push',
            data: {
                hash_value: app.globalData.hash_value,
                content: e.detail.value.textarea,
                circle_id: that.data.id,
                public_sphere: that.data.secret
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'loading',
                        duration: 1000
                    });
                    setTimeout(function (e) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1000);
                }
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        that.getdymaic();

        that.getpicture();

        wx.stopPullDownRefresh();
    }
})