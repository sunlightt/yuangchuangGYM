// motto.js
Page({

    data: {
        bool: true,
        items: [
            { name: 'USA', value: '美国' },
            { name: 'CHN', value: '中国', checked: 'true' },
            { name: 'BRA', value: '巴西' },
            { name: 'JPN', value: '日本' },
            { name: 'ENG', value: '英国' },
            { name: 'TUR', value: '法国' },
        ],
        moto_list:[
            { moto:'年轻时我想变成任何人，除了我自己1','check':'true'},
            { moto: '年轻时我想变成任何人，除了我自己2', 'check': 'false' },
            { moto: '年轻时我想变成任何人，除了我自己3', 'check': 'false' },
            { moto:'年轻时我想变成任何人，除了我自己4','check':'false'},
            { moto: '年轻时我想变成任何人，除了我自己5', 'check': 'false' },
            { moto: '年轻时我想变成任何人，除了我自己6', 'check': 'false' },
        ],
    },
    active1: function () {
        this.setData({
            bool: true
        })
    },
    active2: function () {
        this.setData({
            bool: false
        })
    },
    option: function (e) {
        var that=this;
        var index=e.currentTarget.dataset.index;
        var moto_list=that.data.moto_list;
        for(var i=0;i<moto_list.length;i++){
            
            if(i==index){
                moto_list[i].check='true';
            }else{
                moto_list[i].check = 'false';
            }
        }
        that.setData({
            moto_list: moto_list
        })
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
    },
    onPullDownRefresh: function (e) {
        var that = this;
        wx.stopPullDownRefresh();
    }
})