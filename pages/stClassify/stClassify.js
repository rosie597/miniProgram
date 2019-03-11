// pages/stSort/stSort.js
var mta = require('../../mta_analysis.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    districts: [
      {
        district: "大学城",
        show: true
      },
      {
        district: "龙洞",
        show: false
      },
      {
        district: "东风路",
        show: false
      }
    ],
    stMessage: []
  },
  campusReq1:function(i){
    var that=this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/search/category/' + that.data.id,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        let message = []
        var dat = e.data.data[i].list
        for (let i in dat) {
          let url1 = dat[i].logoUrl.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
          dat[i].logoUrl=url1
        }
        that.setData({
          stMessage: dat,
        })
      }
    })
  },
    toStDetailFn: function(e) {
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
      mta.Event.stat('shetuanbaoming', { 'clickassociation': 'true' })
      wx.navigateTo({
        url: '../stDetail/stDetail?id=' + that.data.id
      })
    },
  campusReq: function () {
    var that = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/search/category/' + that.data.id,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        console.log(e)
        var i
        var dat=e.data.data
        var districts=that.data.districts
        for(i=0;i<3;i++){
          let datList = dat[i].list
          var message=[]
          if(datList.length==0){
            continue;
          }else{
            for(let j in datList){
              let url1 = datList[j].logoUrl.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
              datList[j].logoUrl=url1
            }
            if(i==0){
                districts[0].show = true
                districts[1].show = false
                districts[2].show = false
            }
            else if(i == 2) {
                districts[0].show = false
                districts[1].show = true
                districts[2].show = false
            }
            else{
                districts[0].show = false
                districts[1].show = false
                districts[2].show = true
            }
            that.setData({
              stMessage: datList,
              districts: districts
            })
            break;
          }
        }
      }
    })
  },
  stTabTapFn: function (e) {
    var that = this
    var currentTap = e.currentTarget.id
    var districts = that.data.districts
    var stMessage = that.data.stMessage
    var currentCam = that.data.currentCam
    var i
    var stType=that.data.stType
    if (currentTap == '大学城'||currentCam==0) {
      app.requestFn(app, that.campusReq1(0));
      districts[0].show = true
      districts[1].show = false
      districts[2].show = false
    }
    else if (currentTap == '龙洞' || currentCam == 1) {
      app.requestFn(app, that.campusReq1(2));
      districts[0].show = false
      districts[1].show = true
      districts[2].show = false
    }
    else {
      app.requestFn(app, that.campusReq1(1));
      districts[0].show = false
      districts[1].show = false
      districts[2].show = true
    }
    this.setData({
      districts,
      stMessage
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that=this
    var id=options.id
    var name = options.name
    that.setData({
      id:id,
      name:name
    })
    var stMessage = this.data.stMessage
    var message=[]
    wx.setNavigationBarTitle({
      title: name,
    })
    app.requestFn(app, that.campusReq());
    mta.Page.init();
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
    var id=this.data.id;
    var name=this.data.name;
    return {
      title: '大学生校园社团活动工具',
      desc: '青芒社团',
      path: 'pages/stDetail/stDetail?id=' + id + '&name=' + name
    }
  }
})