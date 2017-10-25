// app.js
var upload_token = require("utils/tokenTools.js");
var qiniuUploader = require("utils/qiniuUploader.js");
initQiniu();
function initQiniu() {
    var that = this;
    var options = {
        region: 'NCN', // 华北区
        uptoken: upload_token.upload_token,
        domain: 'https://safe.yuanchuangyuan.com/',
        shouldUseQiniuFileName: false
    };
    qiniuUploader.init(options);
}
App({
    onLaunch: function () {
        var oppenid = wx.getStorageSync('oppenid');
        var that = this;
        // if (oppenid) {
        // } else {
            wx.login({
                success: function (res) {

                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: that.globalData.service_url + '/user/signin',
                            data: {
                                type: 'wechat_app',
                                code: res.code
                            },
                            success: function (res) {
                                that.globalData.hash_value = res.data.response.hash_value;
                                that.globalData.base_info = res.data.response.base_info;
                                
                                if (res.data.response.base_info){
                                  
                                    wx.setStorage({
                                        key: "base_info",
                                        data: res.data.response.base_info
                                    });

                                    that.globalData.role_info = res.data.response.role_info;

                                    if (res.data.response.role_info == 'member') {
                                        wx.reLaunch({
                                            url: '/pages/member/index',
                                        });
                                    } else if (res.data.response.role_info == 'fitness') {
                                        wx.reLaunch({
                                            url: '/pages/coach/index',
                                        })
                                    } else if (res.data.response.role_info == 'boss') {
                                        wx.navigateTo({
                                            url: '/pages/boss/finish/index'
                                        })
                                    }

                                    that.globalData.netwrorkstate = true;
                                }
                                wx.setStorage({
                                    key: "oppenid",
                                    data: res.data.response.openid,
                                })
                            }
                        })
                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                    }
                }
            });
        // }
    },
    onHide: function (e) {

        wx.reLaunch({
            url: '/' + getCurrentPages()[0].route
        });

    },
    formatDateTime: function formatDateTime(opations) {

        // type
        // all return return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
        // one return return y + '年' + m + '月' + d + '日';
        // two return return y + '-' + m + '-' + d
        // day return return y + '/' + m + '/' + d
        // hour return return h + ':' + minute 
        // md return m+'月'+d+'日'
        var inputTime = opations.inputTime;
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        if (opations.type == 'all') {
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
        } else if (opations.type == 'one') {
            return y + '年' + m + '月' + d + '日';
        } else if (opations.type == 'two') {
            return y + '-' + m + '-' + d;
        } else if (opations.type == 'day') {
            return y + '/' + m + '/' + d;
        } else if (opations.type == 'hour') {
            return h + ':' + minute;
        } else if (opations.type == 'md') {
            return m + '月' + d + '日'
        }
    },
    globalData: {
        userInfo: null,
        //线上运行地址
        //https://www.beautieslife.com/gym/public/index.php
        //本地测试地址
        //https://caihhy.s1.natapp.cc/gym/public/index.php
        service_url: 'https://www.beautieslife.com/gym/public/index.php',
        upload_token: upload_token.upload_token,
        imgurl: 'https://safe.yuanchuangyuan.com/',
        // 教练hash_value
        chash_value: '5f0334f091f1a31754aa4dee482a8edb11db50e8',
        //用户hash_value
        hash_value: 'e0c71d545821b5ffc619380855332ee8975610a6',
        netwrorkstate:false,
        onLine:true,
        atLine:'',
    }
    
   
})
