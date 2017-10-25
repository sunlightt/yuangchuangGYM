const qiniuUploader = require("../../../../utils/qiniuUploader");
var app = getApp()
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

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.imgurl,
        uuid: '',
        grade0: '',
        grade1: '',
        leftimg: '',
        rightimg: '',
        leftbool: false,
        rightbool: false,
        namebool: false,
        leftdete:'----',
        rightdete: '----',
        submiton:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log(this.data);

    },
    leftdata: function (e) {
        var id = e.currentTarget.id
        console.log(e.currentTarget.id)
        wx.navigateTo({
            url: '/pages/coach/coachinfo/graderecord/leftdata/index?id=' + id
        })
    },
    bindmember: function () {
        wx.navigateTo({
            url: '/pages/coach/coachinfo/graderecord/choicemember/index'
        })
    },
    choiceimg: function (e) {
        console.log(e)
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
                    if (e.currentTarget.id == 'leftimg') {
                        that.setData({
                            leftimg: that.data.url+res.key
                        })
                    } else {
                        that.setData({
                            rightimg: that.data.url+res.key
                        })
                    }
                }, (error) => {
                    console.error('error: ' + JSON.stringify(error));
                })
            }
        })
    },
    submit: function () {
        var that = this
        if(that.data.submiton){
            var lthree_dimension = that.data.grade0.bust + ',' + that.data.grade0.waist + ',' + that.data.grade0.hipline;
            var rthree_dimension = that.data.grade1.bust + ',' + that.data.grade1.waist + ',' + that.data.grade1.hipline;
            console.log(lthree_dimension, rthree_dimension);
            wx.request({
                url: app.globalData.service_url + '/transcript/input',
                data: {
                    hash_value: app.globalData.hash_value,
                    member_id: that.data.id,
                    // photo:that.data.leftimg,
                    content: [{
                        weight: that.data.grade0.weight,
                        three_dimension: lthree_dimension,
                        bmi: that.data.leftbmi,
                        photo: that.data.leftimg
                    },
                    {
                        weight: that.data.grade1.weight,
                        three_dimension: rthree_dimension,
                        bmi: that.data.rightbmi,
                        photo: that.data.rightimg
                    }
                    ]
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.success) {
                        wx.showToast({
                            title: '添加成功!',
                            ion: 'loading',
                            duration: 1000
                        });
                        setTimeout(function () {
                            wx.navigateBack({
                                delta:2
                            });
                        }, 1000);
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            ion: 'loading',
                            duration: 1000
                        });
                    }
                }
            });    
        }else{
            wx.showToast({
                title: '勿多次提交',
                icon:'loading',
                duration:1000
            });
        }
        that.setData({
            submiton:false
        });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }


})