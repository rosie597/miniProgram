// pages/search/search.js
var app = getApp();
var mta = require('../../mta_analysis.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: "请输入关键词",
    isCancelShow: false,
    isSelectShow: false,
    searchValue: '',
    isOriginalShow: true,
    isOutcomeShow: false,
    isNoneShow: false,
    typeId:0,
    ranges: [
      "搜全部", "搜活动", "搜社团"
    ],
    classification: [],
    searchRecord: [],
    outcomeInfo: []
  },
  pageTabFn:function(){
    var that=this
    if (this.data.isSelectShow==true){
      that.setData({
        isSelectShow:false
      })
    }
  },
  // 失去焦点时小叉隐藏判断
  inputBlurFn: function () {
    var that = this;
    if (that.data.searchValue != '') {
      that.setData({
        isCancelShow: true
      })
    }
    else {
      that.setData({
        isCancelShow: false
      })
    }
  },
  //下拉菜单的显示
  pickIconFn: function () {
    this.setData({
      isSelectShow: !this.data.isSelectShow
    })
  },
  //点击选项后文本框提示内容改变
  rangesItemFn: function (e) {
    this.setData({
      typeId:e.currentTarget.dataset.index,
      isSelectShow: false,
      placeholder: this.data.ranges[e.currentTarget.dataset.index]
    })
  },
  //绑定输入值,输入值不为空时显示叉,空时隐藏叉
  inputFn: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
    var that = this;
    if (that.data.searchValue != '') {
      that.setData({
        isCancelShow: true
      })
    }
    else {
      that.setData({
        isCancelShow: false,
        isOriginalShow: true,
        isOutcomeShow: false,
        isNoneShow: false
      })
    }
  },
  //点击小叉清空搜索框并隐藏小叉
  inputCancelFn: function () {
    if (this.data.searchValue != '') {
      this.setData({
        searchValue: "",
        isCancelShow: false,
        isOriginalShow: true,
        isOutcomeShow: false,
        isNoneShow: false
      })
    }
  },
  //点击历史搜索自动跳转
  autoSearchFn:function(e){
    var that=this;
    console.log(e)
    var id=e.currentTarget.id
    that.keywordReq(id,0);
  },
  //搜索结果跳转
  outcomeTapFn:function(e){
    var id=e.currentTarget.id
    var name=e.currentTarget.dataset.name
    var typeName=e.currentTarget.dataset.typename
    if(typeName=='社团'){
      mta.Event.stat('shetuanbaoming', { 'clickassociation': 'true' })
      wx.navigateTo({
        url: '../stDetail/stDetail?id=' + id +'&name='+name,
      })
    }
    else{
      mta.Event.stat('huodongbaoming', { 'clickactivity': 'true' })
      wx.navigateTo({
        url: '../hdDetail/hdDetail?id=' + id,
      })
    }
  },
  //打开历史搜索记录列表，在页面onload时候启用
  openLocationsercher: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],//若无储存则为空
    })
  },
  //关键词搜索请求
  keywordReq: function (inputVal,typeId){
    var that=this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      method: "POST",
      url: app.globalData.ymUrl+"/qingmang/search/keyword",
      data: {
        keyword: inputVal,
        typeId: typeId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        var dat = e.data.data
        var outcomeInfo1 = []
        for (let i in dat) {
          outcomeInfo1.push(dat[i])
        }
        if (e.data.data.length==0){
          that.setData({
            isOriginalShow: false,
            isOutcomeShow: false,
            isNoneShow: true
            //将获取的e携带的参数放入数组outcomeInfo中
          })
        }else{
          that.setData({
            outcomeInfo: outcomeInfo1,
            isOriginalShow: false,
            isOutcomeShow: true,
            isNoneShow: false
          })
        }
      },
      //无返回数据时显示无结果
      fail: function () {
        that.setData({
          isOriginalShow: false,
          isOutcomeShow: false,
          isNoneShow: true
        })
      }
    })
  },
  //点击搜索按钮提交表单跳转并储存历史记录
  searchSubmitFn: function (e) {
    var that = this
    var inputVal = e.detail.value.input
    var searchRecord = this.data.searchRecord
    var outcomeInfo = this.data.outcomeInfo
    //输入为空时显示没有搜索结果
    mta.Event.stat("dianjisousuo", {});

    if (inputVal == '') {
      that.setData({
        isOriginalShow: false,
        isOutcomeShow: false,
        isNoneShow: true
      })
    }
    else {
      //将搜索值放入历史记录中,只能放前五条
      if (searchRecord.length < 5) {
        searchRecord.unshift(
          {
            value: inputVal,
            id: searchRecord.length
          }
        )
      }
      else {
        searchRecord.pop()//删掉旧的时间最早的第一条
        searchRecord.unshift(
          {
            value: inputVal,
            id: that.data.searchRecord.length
          }
        )
      }
      //将历史记录数组整体储存到缓存中
      wx.setStorageSync('searchRecord', searchRecord)
      app.requestFn(app, that.keywordReq(inputVal,that.data.typeId));
    }
  },
  //点击垃圾桶删除历史纪录和本地储存
  historyDelFn: function () {
    mta.Event.stat("shanchulishisousuo", {});
    wx.clearStorageSync('searhRecord');
    this.setData({
      searchRecord: []
    })
  },
  toCsfStFn: function (e) {
    var id= e.currentTarget.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../stClassify/stClassify?id=' + id+'&name='+name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  csfReq:function(){
    var that=this;
    var classification=[];
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/search',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        var dat = e.data.data
        for (let i in dat) {
          if (dat[i].name){
            classification.push(dat[i])
          }
        }
        that.setData({
          classification
        })
      }
    })
  },
  onLoad: function (options) {
    var that=this;
    this.openLocationsercher();
    app.requestFn(app, that.csfReq());
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
    return {
      title: '大学生校园社团活动工具',
      desc: '青芒社团',
      path: '/pages/search/search'
    }
  }
})