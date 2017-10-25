// pages/coach/dynamicdetails/index.js
Page({
  onPullDownRefresh: function (e) {
      var that = this;
      that.getsignapply();
      wx.stopPullDownRefresh();
  }
})