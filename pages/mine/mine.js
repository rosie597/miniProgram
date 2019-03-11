// pages/notice/notice.js
var mta = require('../../mta_analysis.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeItems: [],
    likeItems: [
    ],
    isNoticeChecked: true,
    isLikeChecked: false,
    contactHeight:'40rpx',
    ctcClass:'bottom'
  },
  noticeAppear: function () {
    var that=this
    var height = that.data.contactHeight;
    if (height == '140rpx') {
      that.changeHeight(140, 40);
    } else {
      that.setData({
        isNoticeChecked: true,
        isLikeChecked: false
      });
    }
  },
  likeAppear: function () {
    var that=this
    var height = that.data.contactHeight;
    if (height == '140rpx') {
      that.changeHeight(140, 40);
    } else {
      that.setData({
        isNoticeChecked: false,
        isLikeChecked: true
      });
    }
  },
  confirmReq:function(id,idx){
    var that=this
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/confirm',
      method: "POST",
      data: {
        noticeId: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', 
        'Authorization': app.globalData.token
      },
      success: function (e) {
        if(e.data.code==200){
          console.log('成功发送数据:', id)
        }
        else{
          wx.showToast({
            title: '操作失败，请重试',
            icon:'none',
            duration:1500
          })
          var noticeItems = that.data.noticeItems;
          noticeItems[idx].status = 0;
          that.setData({
            noticeItems
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '请检查网络',
          icon: 'none',
          duration: 1500
        })
        var noticeItems = that.data.noticeItems;
        noticeItems[idx].status = 0;
        that.setData({
          noticeItems
        })
      }
    })
    mta.Event.stat("clicktongzhishoudao", {});
  },
  confirmFn: function (e) {
    var that = this
    var height = that.data.contactHeight;
    if (height == '140rpx') {
      that.changeHeight(140, 40);
    } else {
      var idx = e.currentTarget.id
      var id = e.currentTarget.dataset.noticeid
      var noticeItems = this.data.noticeItems;
      noticeItems[idx].status = 1;
      mta.Event.stat('tongzhishoudao', { 'clickshoudao': 'true' });
      this.setData({
        noticeItems
      })
      app.requestFn(app, that.confirmReq(id, idx));
    }
  },
  //高度缓冲变化
  changeHeight:function(start,end){
    var that=this
    var timer
    var current = parseFloat(start);
    timer=setInterval(function () {
      var speed=(end-current)/5;
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
      if(current==end){
        clearInterval(timer);
      }else{
        current=current+speed
        that.setData({
          contactHeight:current+'rpx'
        })
      }
    }, 30)
  },
  contactFn:function(){
    var that=this
    var height = that.data.contactHeight;
    if(height=='40rpx'){
      that.changeHeight(40,140);
    }else{
      that.changeHeight(140,40);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  noticeReq:function(){
    var that = this;
    wx.showLoading({
      title: '等待加载',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/notice',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        console.log('notice',e)
        var noticeItems=[],_noticeItems=[]
        var noticeList=e.data.data.noticeList;
        var subscriptionList=e.data.data.subscriptionList;
        for(let i in noticeList){
          noticeItems.push(noticeList[i])
        }
        for(let i in subscriptionList){
          noticeItems.push(subscriptionList[i])
        }
        for(let i in noticeItems){
          var time=new Date(noticeItems[i].time);
          var m = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
          time = time.getFullYear() + '-' + m + time.getDate() + ' '+time.getHours()+':'+time.getMinutes()
          noticeItems[i].time=time
        }
        function sortId(a, b) {
          if (a.time > b.time) {
            return -1
          }
          if (a.time == b.time) {
            return 0
          }
          if (a.time < b.time) {
            return 1
          }
        }
        noticeItems.sort(sortId);
        that.setData({
          noticeItems
        })
        console.log('noticeItems',noticeItems)
      }
    })
  },
  pageTap:function(){
    var that=this
    if(this.data.contactHeight=='140rpx'){
     that.changeHeight(140, 40);
    }
  },
  toStDetail:function(e){
    var that=this
    var height = that.data.contactHeight;
    if (height == '140rpx') {
      that.changeHeight(140, 40);
    } else {
      var i,name = e.currentTarget.dataset.name
      var stMessage = this.data.likeItems
      for (i = 0; i < stMessage.length; i++) {
        if (name == stMessage[i].associationName) {
          that.setData({
            name: stMessage[i].associationName,
            id: stMessage[i].associationId
          })
        }
      }
      mta.Event.stat('shetuanbaoming', { 'clickassociation': 'true' });
      wx.navigateTo({
        url: '../stDetail/stDetail?id=' + that.data.id + '&name=' + name
      })
    }
  },
  attentionReq:function(){
    var that=this
    wx.request({
      url: app.globalData.ymUrl +'/qingmang/user/'+app.globalData.id+'/attention',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success:function(e){
        console.log('sss',e)
        if(e.data.code==200){
          var likeList=e.data.data
          for(let i in likeList){
            let url1 = likeList[i].logoUrl.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
            likeList[i].logoUrl = url1;
          }
          that.setData({
            likeItems:likeList
          })
          console.log('like', that.data.likeItems)
        }
      },
      fail:function(e){
        wx.showToast({
          title: '请检查你的网络',
          icon:'none',
          duration:1500
        })
      }
    })
  },
  onLoad: function (options) {
    var that=this;
    app.requestFn(app, that.noticeReq());
    app.requestFn(app, that.attentionReq());
    mta.Page.init();
    const scene = decodeURIComponent(options.scene);
    that.setData({
      nickName:app.globalData.nickName,
      headingUrl:app.globalData.headingUrl
    })
    var noticeItems=that.data.noticeItems
    for (let i in noticeItems) {
      var time = noticeItems[i].time
      time = time.substring(0, 10) + ' ' + time.substring(11, 16)
      noticeItems[i].time = time
    }
    function sortId(a, b) {
      if (a.time > b.time) {
        return -1
      }
      if (a.time == b.time) {
        return 0
      }
      if (a.time < b.time) {
        return 1
      }
    }
    noticeItems.sort(sortId);
    that.setData({
      noticeItems
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    mta.Event.stat('tongzhishoudao', { 'clicktongzhiyemian': 'true' });
    app.requestFn(app, that.noticeReq());
    app.requestFn(app, that.attentionReq());
    that.setData({
      contactHeight:'40rpx'
    })
    that.setData({
      nickName: app.globalData.nickName,
      headingUrl: app.globalData.headingUrl
    })
    if (!that.data.nickName){
      app.getUserKey()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '大学生校园社团活动工具',
      desc: '青芒社团',
      path: '/pages/notice/notice'
    }
  }
})