// pages/association/association.js
var mta = require('../../mta_analysis.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    districts: [ "大学城","龙洞","东风路"],
    district:"大学城",
    pull_icon:"下拉icon1",
    isSelectShow:false,
    stSlogan:'',
    stType:"",
    isTabShow:false,
    isSearchShow:true,
    tabIndex: 0,
    stMessage: [],
  },
  dItemFn: function (e) {
    var stMessage = []
    var currentTap = e.currentTarget.dataset.id
    var currentId = e.currentTarget.id
    var i
    var that = this
    this.setData({
      isSelectShow: false,
      district: currentTap,
    })
    app.requestFn(app, that.campusReq(currentId));
    if (that.data.stMessage == []) {
      wx.showLoading({
        title: '请等待加载',
      })
    } else {
      wx.hideLoading();
    }
  },
  pageTapFn:function(){
    var that=this
    if (this.data.isSelectShow==true){
      that.setData({
        isSelectShow:false
      })
    }
  },
  dSelectFn:function(){
    var i
    var that=this
    this.setData({
      isSelectShow: !this.data.isSelectShow,
    })
  },
  getCampusReq:function(){
    var that=this;
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/campus',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success:function(e){
        var dat=e.data.data
        var districts=[]
        for (let i in dat){
          districts.push(dat[i])
        }
        that.setData({
          districts: districts
        })
      }
    })
  },
  campusReq:function(campusId){
    var that=this;
    wx.showLoading({
      title: '请等待',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/' + campusId + '/association',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        console.log(e)
        if(e.data.code==200){
          wx.hideLoading();
          let message = []
          var dat = e.data.data
          for (let i in dat) {
            let url1 = dat[i].logoUrl.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
            dat[i].logoUrl = url1;
            message.push(dat[i]);
          }
          for(let i in message){
            if (i > 5) { 
              message[i].show = false
            }
            else{
              message[i].show = true
            }
          }
          console.log(message)
          that.setData({
            stMessage: message,
          })
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '获取数据失败',
            duration: 1500,
            icon: 'none'
          })
        }
      },
      fail:function(){
        wx.hideLoading();
        wx.showToast({
          title: '请检查网络',
          duration: 1500,
          icon: 'none'
        })
      }
    })
  },
  toSearchPage: function () {
    var that=this;
    if (that.data.isSelectShow==true){
      that.setData({
        isSelectShow:false
      })
    }else{
      wx.navigateTo({
        url: '../search/search'
      })
    }
  },
  toStDetailFn:function(e){
    var that = this;
    if (that.data.isSelectShow == true) {
      that.setData({
        isSelectShow: false
      })
    } else {
      var i
      var that = this
      var name = e.currentTarget.dataset.name
      var stMessage = this.data.stMessage
      for (i = 0; i < stMessage.length; i++) {
        if (name == stMessage[i].name) {
          that.setData({
            name: name,
            id: stMessage[i].id
          })
        }
      }
      mta.Event.stat('shetuanbaoming', { 'clickassociation': 'true' });
      wx.navigateTo({
        url: '../stDetail/stDetail?id=' + that.data.id
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that=this;
    app.requestFn(app, that.campusReq(1));
    app.requestFn(app, that.getCampusReq());
    mta.Page.init();
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    var that=this
    var stMessage = that.data.stMessage
    var height=that.data.height
    if (e.scrollTop > that.data.scrollTop) {
      that.setData({
        isTabShow: true
      })
    } else {
      that.setData({
        isSelectShow:false,
        isTabShow: false
      })
    }
    wx.createSelectorQuery().selectAll('.stItem').boundingClientRect((ret) => {
      ret.forEach((item, index) => {
        if (item.top <= height) {
          stMessage[index].show = true // 根据下标改变状态
        }
      })
      that.setData({
        stMessage
      })
    }).exec()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('.stContent').boundingClientRect(function (res) {
      that.setData({
        scrollTop: res.top
      })
    }).exec()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height:res.screenHeight
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.campusReq(1);
    this.getCampusReq();
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
    this.campusReq(1);
    this.getCampusReq();
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
      path: '/pages/association/association'
    }
  },
})