var app = getApp();
Page({
    
    data: {
        inputValue: ''
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    savephone: function () {
        var phone_number = this.data.inputValue
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(phone_number))) {
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'loading',
                duration: 2000
            })
            return
        }
        wx.setStorageSync('phone_number', phone_number)
        wx.request({
            url: app.globalData.service_url + '/user/monity_info',
            data: {
                hash_value: app.globalData.hash_value,
                phone_num: phone_number
            },
            success: function (res) {
                console.log(res);
                wx.navigateBack({
                    delta:1
                })
            }
        })
        
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})