// pages/join/join.js
var mta = require('../../mta_analysis.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    njItems: [2018, 2017, 2016, 2015],
    njValue: "",
    isPickShow: false,
    isItemShow: {},
    imageUrl:'',
    radioChoose:false,
    isSubmit:false,
    _formVal:{}
  },
  pickNjFn: function () {
    this.setData({
      isPickShow: !this.data.isPickShow
    })
  },
  njItemFn: function (e) {
    this.setData({
      njValue: this.data.njItems[e.currentTarget.dataset.index],
      isPickShow: false
    })
  },
  submitReq:function(fmv,stId,id){
    wx.showLoading({
      title: '',
    })
    wx.request({
      method: "POST",
      url: app.globalData.ymUrl+'/qingmang/user/'+stId+'/register/activity/'+id,
      data: JSON.stringify(fmv),
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        if(e.data.code==200){
          mta.Event.stat("tijiaohuodongbaoming", {});
          mta.Event.stat('huodongbaoming', { 'submitform': 'true' })
          wx.navigateTo({
            url: '../hdSuccessJoin/hdSuccessJoin',
          })
        }else{
          wx.showToast({
            title: '报名失败',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  radioChange: function () {
    this.setData({
      radioChoose: true
    })
  },
  joinSubmit:function(e){
    var that=this
    var formVal=e.detail.value;
    var i
    for (let i in formVal) {
      if (that.data.isItemShow.sex) {
        let fms=that.data._formVal['sex']||'';
        console.log('fms',fms)
        if (formVal[i] == '' && i != 'sex' || (this.data.radioChoose == false && fms != 'boy' && fms != 'girl')){
          that.setData({
            isSubmit: false
          })
          wx.showToast({
            title: '请填完所有信息',
            icon: 'none',
            duration: 2000
          })
        }
        else {
          that.setData({
            isSubmit: true
          })
        }
      }
    }
    setTimeout(function () {
      if (that.data.isSubmit == true) {
        if (that.data.isItemShow.telephone) {
          if (!(/^1[345789]\d{9}$/.test(formVal.telephone))) {
            wx.showToast({
              title: '请填写正确格式的手机号码',
              icon: 'none',
              duration: 2000
            })
          }
          else{
            console.log(1,formVal,)
            app.requestFn(app, that.submitReq(formVal,app.globalData.id, that.data.hdId))
            //保存用户填的信息
            wx.setStorageSync('formVal_a', formVal)
          }
        }else{
          console.log(2, formVal, formVal)
          app.requestFn(app, that.submitReq(formVal, app.globalData.id, that.data.hdId))
          //保存用户填的信息
          wx.setStorageSync('formVal_a', formVal)
        }
      }
    }, 10)
  },
  pageTabFn: function () {
    var that = this
    if (this.data.isPickShow == true) {
      that.setData({
        isPickShow: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getAcReq:function(id){
    var that=this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/activity/' + id + '/form',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        var dat = e.data.data.form;
        var imageUrl = e.data.data.coverUrl
        that.setData({
          isItemShow: dat,
          imageUrl: imageUrl.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net")
        })
      }
    })
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      hdId:options.hdId,
    });
    app.requestFn(app, that.getAcReq(that.data.hdId));
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
    var _formVal = wx.getStorageSync('formVal_a');
    if(_formVal){
      this.setData({
        _formVal:_formVal,
        njValue:_formVal.grade
      })
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

})