var app = getApp();
var service_url = app.globalData.service_url;
Page({
    data: {
        imgurl: app.globalData.imgurl,
        resault:[],
        setindex:0
    },
    onLoad: function (opations) {
        this.setData({
            id: opations.id
        });
        this.answer();
    },
    // 问题表
    answer: function (e) {
        var that = this;
        wx.request({
            url: service_url + '/question/info',
            data: {
                hash_value: app.globalData.hash_value,
                types_id: that.data.id
            },
            success: function (res) {
                var data = res.data.response;
                for (var i = 0; i < data.length;i++){
                    that.data.resault.push({ 'gym_id': wx.getStorageSync('gym_id')});
                }
                that.setData({
                    data:data
                });
            }
        });
    },
    setindex:function(e){
        var index = e.currentTarget.dataset.index;
        var resault = this.data.resault;
        resault[index].question_id = e.currentTarget.dataset.id;
        this.setData({
            setindex:index
        });
    },
    inputvalue:function(e){
        var index=e.currentTarget.dataset.index;
        var that=this;
        var resault = that.data.resault;
        resault[index].supplement_id = e.detail.value;
        resault[index].supplement_value = e.detail.value;
    },
    radioChange:function(e){
        var index = e.currentTarget.dataset.index;
        var that = this;
        var resault = that.data.resault;
        resault[index].answer_id = e.detail.value;
        
    },
    oneinput:function(e){
        var index = e.currentTarget.dataset.index;
        var that = this;
        var resault = that.data.resault;
        resault[index].question_id = e.currentTarget.dataset.id;
        resault[index].answer_id = e.currentTarget.dataset.index;
        resault[index].supplement_id = 0;
        resault[index].supplement_value = e.detail.value;
    },
    forsubmit:function(e){
        var that=this;
        var resault = that.data.resault;
        var anwserstr = JSON.stringify(that.data.resault);
        //将问题答案存储本地
        var queresault = wx.getStorageSync('queresault'); 
        if (!app.globalData.queresault){
            app.globalData.queresault = that.data.resault;
        }else{
            var queresault = app.globalData.queresault; 
            for(var i = 0; i < that.data.resault.length;i++){
                queresault.push(that.data.resault[i]);
            }
            app.globalData.queresault = queresault;
        }
        wx.navigateBack({
            delta:1
        });

        // wx.request({
        //     url: service_url + '/answer/questions?health_id=' + app.globalData.health_id + '&hash_value=' + app.globalData.hash_value,
        //     data: anwserstr,
        //     header:{
        //         'content-type': 'application/x-www-form-urlencoded' 
        //     },
        //     method:'POST',
        //     success:function(res){
        //         console.log(res);

        //         console.log(wx.getStorageSync('queresault'));
                
        //     }
        // })
        
        
    },
    onPullDownRefresh: function (e) {
        var that = this;
        this.answer();
        wx.stopPullDownRefresh();
    }


})