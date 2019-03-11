// pages/stDetail/stDetail.js
var app = getApp();
var mta = require('../../mta_analysis.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmit:false,
    njItems: [2018, 2017, 2016, 2015],
    polityItems:['群众','团员','党员'],
    slogan: '',//后端
    zyItems: [],//后端传的志愿社团
    zyValue1: "",
    zyValue2: "",
    njValue: "",
    isPickShow1:false,
    isPickShow:false,
    isPickShow2:false,
    isPickShow3: false,
    isItemShow: {},
    logo:'',
    radioChoose:false,
    _formVal:{}
  },
  pickZjFn1: function () {
    this.setData({
      isPickShow1: !this.data.isPickShow1,
      isPickShow2:false,
      isPickShow:false,
      zyPicked:'picked',
      isPickShow3:false
    })
  },
  pickZjFn2: function () {
    this.setData({
      isPickShow2: !this.data.isPickShow2,
      isPickShow:false,
      isPickShow1:false,
      isPickShow3: false
    })
  },
  pickNjFn:function(){
    this.setData({
      isPickShow: !this.data.isPickShow,
      isPickShow1:false,
      isPickShow2:false,
      isPickShow3: false
    })
  },
  pickNjFn1: function () {
    this.setData({
      isPickShow: false,
      isPickShow1: !this.data.isPickShow1,
      isPickShow2: false,
      isPickShow3: false
    })
  },
  pickNjFn2: function () {
    this.setData({
      isPickShow: false,
      isPickShow1: false,
      isPickShow2: !this.data.isPickShow,
      isPickShow3: false
    })
  },
  pickNjFn3: function () {
    this.setData({
      isPickShow: false,
      isPickShow1: false,
      isPickShow2: false,
      isPickShow3: !this.data.isPickShow
    })
  },
  pickPolityFn:function(){
    this.setData({
      isPickShow: false,
      isPickShow1: false,
      isPickShow2: false,
      isPickShow3: !this.data.isPickShow3
    })
  },
  zyItemFn1: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      zyValue1: this.data.zyItems[e.currentTarget.dataset.index].name,
      isPickShow1:false,
      pickId1:id
    })
  },
  zyItemFn2: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      zyValue2: this.data.zyItems[e.currentTarget.dataset.index].name,
      isPickShow2:false,
      pickId2: id
    })
  },
  njItemFn: function (e) {
    this.setData({
      njValue: this.data.njItems[e.currentTarget.dataset.index],
      isPickShow:false
    })
  },
  polityItemFn:function(e){
    this.setData({
      polityValue:this.data.polityItems[e.currentTarget.dataset.index],
      isPickShow3:false
    })
  },
  radioChange:function(){
    this.setData({
      radioChoose:true
    })
  },
  //提交干事报名表单
  workerSubmitReq:function(formVal){
    var that=this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/recruitMember',
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      data:{
        associationId: that.data.associationId,
        form: JSON.stringify(formVal)
      },
      success:function(e){
        wx.hideLoading();
        if(e.data.code==200){
          mta.Event.stat("tijiaoshetuanbaoming", {});
          wx.navigateTo({
            url: '../hdSuccessJoin/hdSuccessJoin',
          })
        } else {
          wx.showToast({
            title: '报名失败，请勿重复报名',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  //提交会员报名表单
  vipSubmitReq:function(formVal){
    var that = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/recruitViper',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      data: {
        associationId: that.data.associationId,
        form: JSON.stringify(formVal),
      },
      success: function (e) {
        wx.hideLoading();
        if(e.data.code==200){
          mta.Event.stat("tijiaoshetuanbaoming", {});
          mta.Event.stat('shetuanbaoming', { 'submitform': 'true' });
          wx.navigateTo({
            url: '../hdSuccessJoin/hdSuccessJoin',
          })
        } else {
          wx.showToast({
            title: '报名失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  //提交表单
  joinSubmitFn:function(e){
    var that=this;
    var zyPick = this.data.zyPick;
    var formVal = e.detail.value;
    var isItemShow=this.data.isItemShow;
    if (isItemShow.firstChoice){
      formVal['firstChoice'] = that.data.pickId1
    }
    if(formVal['secondChoice']){
      formVal['secondChoice'] = that.data.pickId2
    }
    if(formVal['sex']){
      if (formVal['sex']=="男"){
        formVal['sex']=true
      }else{
        formVal['sex'] = false
      }
    }
    for (let i in formVal) {
      if(isItemShow.sex){
        let fms=that.data._formVal['sex']||'';
        if (formVal[i] == ''&&i!='sex'||(this.data.radioChoose==false&&fms!='男'&&fms!='女')){
          that.setData({
            isSubmit:false
          })
          wx.showToast({
            title: '请填完所有信息',
            icon: 'none',
            duration: 2000
          })
        }
        else {
            that.setData({
              isSubmit:true
            })
        }
      }else{
        if (formVal[i] == '') {
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
    setTimeout(function(){
      if (that.data.isSubmit == true) {
        if(isItemShow.phoneNumber){
          if (!(/^1[345789]\d{9}$/.test(formVal.phoneNumber))) {
            wx.showToast({
              title: '请填写正确格式的手机号码',
              icon: 'none',
              duration: 2000
            })
          }
          else {
            console.log('fv',formVal)
            if (that.data.val == '干事') {
              app.requestFn(app, that.workerSubmitReq(formVal));
            }
            else {
             app.requestFn(app, that.vipSubmitReq(formVal));
            }
            var formVal1 = formVal;
            console.log(formVal, formVal1)
            if (formVal1['sex'] == true) {
              formVal1['sex'] = '男'
            } else {
              formVal1['sex'] = '女'
            }
            wx.setStorageSync('formVal_s', formVal1);
          }
        }else{
          console.log('fv', formVal)
          if (that.data.val == '干事') {
            app.requestFn(app, that.workerSubmitReq(formVal));
          }
          else {
            app.requestFn(app, that.vipSubmitReq(formVal));
          }
          var formVal1 = formVal;
          console.log(formVal, formVal1)
          if (formVal1['sex'] == true) {
            formVal1['sex'] = '男'
          } else {
            formVal1['sex'] = '女'
          }
          wx.setStorageSync('formVal_s', formVal1);
        }
      }
    },1000)
  },
  pageTabFn: function () {
    var that = this
    if (this.data.isPickShow1 == true || this.data.isPickShow2 == true || this.data.isPickShow == true) {
      that.setData({
        isPickShow1: false,
        isPickShow2:false,
        isPickShow3:false,
        isPickShow:false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //获得干事报名表
  workerFormReq:function(){
    var that=this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/recruitMember',
      data:{
        associationId: that.data.associationId
      },
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success:function(e){
        wx.hideLoading();
        if(e.data.code==200){
          that.setData({
            slogan:e.data.data.slogan,
            logo: e.data.data.logo.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"),
            isItemShow:e.data.data.form
          })
          if(!e.data.data.form.firstChoice){
            that.setData({
              zyPick:true
            })
          }
        }else{
          wx.navigateBack({
            
          })
        }
      }
    })
  },
  //获得会员报名表
  vipFormReq: function () {
    var that = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/recruitViper',
      data: {
        associationId: that.data.associationId
      },
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        if(e.data.code==200){
          that.setData({
            slogan: e.data.data.slogan,
            logo: e.data.data.logo.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"),
            isItemShow: e.data.data.form
          })
        }else{
          wx.navigateBack({
            
          })
        }
      }
    })
  },
  //获得社团的部门列表
  departmentReq:function(){
    var that=this;
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/department',
      data: {
        associationId: that.data.associationId
      },
      header:{
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success:function(e){
        var dpmList=e.data.data.list;
        var zyItems=[]
        for(let i in dpmList){
          zyItems.push(dpmList[i])
        }
        that.setData({
          zyItems
        })
      }
    })
  },
  onLoad: function (options) {
    var val=options.val
    var that=this
    this.setData({
      associationId: options.associationId,
      val:val
    })
    if(val=='会员'){
      app.requestFn(app, that.vipFormReq());
      app.requestFn(app, that.departmentReq());
    }else{
      app.requestFn(app, that.workerFormReq());
      app.requestFn(app, that.departmentReq());
    }
    wx.setNavigationBarTitle({
      title: val+'报名'
    })
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
    var _formVal=wx.getStorageSync('formVal_s');
    if(_formVal){
      this.setData({
        _formVal:_formVal,
        njValue:_formVal.grade,
        polityValue: _formVal.politicalStatus
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