// leftData.js
const qiniuUploader = require("../../../../../utils/qiniuUploader");
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
    data:{
        url: app.globalData.imgurl,
        starttime: '',
        imgsrc:'/resources/img/borderplus.png'
    },
    onLoad: function (options) {
        
        var that=this;

        this.setData({
            index: options.id
        });
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        if (options.id == 'left'){
            if (prevPage.data.grade0) {
                that.setData({
                    prpdata: prevPage.data.grade0,
                    starttime: prevPage.leftdete
                });
            }
        }else{
            if (prevPage.data.grade1) {
                that.setData({
                    prpdata: prevPage.data.grade1,
                    starttime: prevPage.rightdete
                });
            }
        }
    },
    bindsavebtn: function () {
        var that = this
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        var bmi=null, mass=null;
        
        var tall=that.data.tall/100 , wieght=that.data.weight;

        bmi = parseFloat(wieght / (tall * tall)).toFixed(2);

        if (bmi<18){
            mass='underweight';   
        } else if (bmi < 18.5){
            mass = 'thin for weight';   
        } else if (bmi>18.6 && bmi < 24.9){
            mass = 'health wiehgt';   
        } else if (bmi > 25 && bmi < 29.9){
            mass = 'overweight';   
        }else{
            mass = '过重';   
        }
        that.data['mass'] = mass;
        that.data['bmi'] = bmi;
        if (this.data.index == 'left') {
            console.log(that.data);
            prevPage.setData({
                grade0: that.data,
                leftmass:mass,
                leftbmi:bmi,
                leftimg: that.data.leftimg,
                leftdete: that.data.starttime,
                leftbool: true
            });
        } else {
            prevPage.setData({
                grade1: that.data,
                rightmass: mass,
                rightbmi: bmi,
                rightimg: that.data.rightimg,
                rightdete: that.data.starttime,
                rightbool: true
            });
        }
        wx.navigateBack({
            delta:1 
        });
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

                qiniuUploader.upload(filePath, (res) => {
                    if (that.data.index == 'left') {
                        that.setData({
                            leftimg:that.data.url+res.key
                        })
                    } else {
                        that.setData({
                            rightimg:that.data.url +res.key
                        })
                    }
                    var imgsrc = res.key;
                    that.setData({
                        imgsrc:that.data.url+res.key
                    });
                }, (error) => {
                    console.error('error: ' + JSON.stringify(error));
                });
               
            }
        })
    },
    bindKeyInput: function (e) {
        this.data[e.currentTarget.id] = e.detail.value
    },
    bindDateChange:function(e){

        this.setData({
            starttime: e.detail.value
        })

    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})