// pages/circle/circle.js
const qiniuUploader = require("../../../utils/qiniuUploader");
var app = getApp()
var imgurl = app.globalData.imgurl;
var service_url = app.globalData.service_url;
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
            memid: options.memid,
            coid: options.coid
        });

        that.getdetails();
    },
    //获取详情
    getdetails: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/course/info',
            data: {
                hash_value: app.globalData.hash_value,
                id: that.data.id
            },
            success: function (res) {
                var data = res.data.response;
                data.create_time = app.formatDateTime({ 'inputTime': data.create_time * 1000, 'type': 'all' });
                that.setData({
                    datadetails: data
                })
            }
        })
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
                        imgurls.shift()
                        imgurls.push(res.key)
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
                            img_url: res.key
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
    bindFormSubmit: function (e) {
        var that = this;
        console.log(e);
        // 公开1 老板见2
        wx.request({
            url: app.globalData.service_url + '/course/dynamic/push',
            data: {
                hash_value: app.globalData.hash_value,
                gym_id: wx.getStorageSync('gym_id'),
                coach_id: that.data.coid,
                coach_reviews: e.detail.value.textarea,
                course_content_id: that.data.id,
                member_id: that.data.memid
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res);
                if (res.data.success) {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 1000
                    });
                    setTimeout(function(){
                        wx.navigateBack({
                              delta:1
                        })
                    },1000);
                }
                
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})