
var app = getApp()

function deleteListItem(val) {

}
Page({
    data: {
        value: [],
        list: [

        ],
        num: [],
        group: [],
        result: []
    },
    onLoad: function (options) {
        var that = this
        console.log(options)
        wx.request({
            url: app.globalData.service_url + '/fitness/train/action/cate/info',
            data: {
                hash_value: app.globalData.hash_value,
                parent: options.id
            },
            success: function (res) {
                console.log(res)
                var dataObject;
                dataObject = res.data.response
                var datalist = []
                for (var i = 0; i < dataObject.length; i++) {
                    var x = {};
                    x.exercise_vent_id = dataObject[i].id
                    x.length = 1;
                    x.repeat = 1;
                    datalist.push(x)
                }
                that.setData({
                    list: dataObject,
                    title: options.name,
                    id: options.id,
                    datalist: datalist
                })
            }
        })
    },
    checkboxChange: function (e) {
        var listValue, datalist, result;
        result = []
        datalist = this.data.datalist
        this.data.value = e.detail.value
        listValue = e.detail.value
        for (var i = 0; i < e.detail.value.length; i++) {
            for (var j = 0; j < datalist.length; j++) {
                if (listValue[i] == datalist[j].exercise_vent_id) {
                    result.push(datalist[j])
                }
            }
        }
        this.setData({
            result: result
        })
    },
    savebtn: function () {
        var that = this
        var thisresult = this.data.result
        var arr = this.data.value
        var actiondata = []
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 3];
        var x = {}
        var list = prevPage.data.list
        var result = prevPage.data.result
        var zxc = result.concat(thisresult)
        x.title = that.data.title,
            x.id = that.data.id
        list.push(x)
        prevPage.setData({
            list: list,
            result: zxc
        })
        wx.navigateBack({
            delta: 2
        })
    },
    bindKeygroup: function (e) {
        var id = e.currentTarget.dataset.id
        var datalist = this.data.datalist
        for (var i = 0; i < datalist.length; i++) {
            if (datalist[i].exercise_vent_id == id) {
                datalist[i].length = e.detail.value
            }
        }
        this.data.datalist = datalist
        var result = []
        var value = this.data.value
        for (var i = 0; i < value.length; i++) {
            for (var j = 0; j < datalist.length; j++) {
                if (value[i] == datalist[j].exercise_vent_id) {
                    result.push(datalist[j])
                }
            }
        }
        this.data.result = result
    },
    bindKeylength: function (e) {
        var id = e.currentTarget.dataset.id
        var datalist = this.data.datalist
        for (var i = 0; i < datalist.length; i++) {
            if (datalist[i].exercise_vent_id == id) {
                datalist[i].repeat = e.detail.value
            }
        }
        this.data.datalist = datalist
        var result = []
        var value = this.data.value
        for (var i = 0; i < value.length; i++) {
            for (var j = 0; j < datalist.length; j++) {
                if (value[i] == datalist[j].exercise_vent_id) {
                    result.push(datalist[j])
                }
            }
        }
        this.data.result = result
    },
    formSubmit: function (e) {
        console.log('form发生了submit事件，携带数据为：', e)
    }
})