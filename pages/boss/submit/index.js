
var app = getApp();
var service_url = app.globalData.service_url;
const qiniuUploader = require("../../../utils/qiniuUploader");
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
        imgurl: app.globalData.imgurl,
    },
    onLoad: function (options) {

    },
    upimg: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                var filePath = res.tempFiles[0].path;
                if (res.tempFiles[0].size > 1024 * 1024) {
                    wx.showToast({
                        title: '图片太大',
                        icon: 'loading',
                        duration: 1000
                    });
                    return;
                }
                // 交给七牛上传
                qiniuUploader.upload(filePath, (res) => {
                    that.setData({
                        imgurls: that.data.imgurl+res.key
                    });
                }, (error) => {
                    console.log('error: ' + JSON.stringify(error));
                })
            }
        })

    },
    submit: function (e) {
        var that = this
        var username = e.detail.value.username;
        var id = e.detail.value.id;
        var number = e.detail.value.number;
        wx.request({
            url: service_url + '/icinfo/push',
            data: {
                hash_value: app.globalData.hash_value,
                legal_person_name: username,
                legal_person_card_id: id,
                legal_person_phone_num: number,
                business_license:that.data.imgurls
            },
            success: function (res) {
                console.log(res);
                if (res.data.success){
                    wx.navigateTo({
                        url: '/pages/boss/finish/index'
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'loading',
                        duration:1000
                    })
                }
            }
        })
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})