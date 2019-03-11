// pages/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nextBtnClass: 'nextBtn_unchoose',
    chooseVal: '',
    vipChecked: false,
    workerChecked: false,
    vipText: "1.需要缴纳费用\n2.可参加社团举办的活动和课程",
    workerText: "1.不需要缴纳费用\n2.需要加入社团为社团服务\n3.可参加社团举行的所有活动",
    frameClass1:'frame flex flex-v flex-a-c flex-j-c z1',
    frameClass2: 'frame flex flex-v flex-a-c flex-j-c z2',
    frameClass3: 'frame flex flex-v flex-a-c flex-j-c z1',
    frameClass4: 'frame flex flex-v flex-a-c flex-j-c z2',
    isVipDisable:true,
    isWorkerDisable:true,
    associationId:''
  },
  submitFn: function (e) {
    var that=this
    var chooseVal=this.data.chooseVal
    if(chooseVal){
      wx.navigateTo({
        url: '../joinSt/joinSt?val=' + chooseVal + '&associationId=' + that.data.associationId,
      })
    }
  },
  radioChange: function (e) {
    var that = this
    this.setData({
      chooseVal: e.detail.value
    })
  },
  vipCtnFn: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (id == '1' && that.data.isVipDisable==false) {
      this.setData({
        vipChecked: true,
        workerChecked: false,
        chooseVal:'会员'
      })
    }
    var that = this
    if (this.data.frameClass1 == 'frame flex flex-v flex-a-c flex-j-c z2' &&
      this.data.frameClass2 == 'frame flex flex-v flex-a-c flex-j-c z1') {
      that.setData({
        frameClass1: "frame flex flex-v flex-a-c flex-j-c back",
        frameClass2: "frame flex flex-v flex-a-c flex-j-c front",
      })
      setTimeout(function () {
        that.setData({
          frameClass1: "frame flex flex-v flex-a-c flex-j-c z1",
          frameClass2: "frame flex flex-v flex-a-c flex-j-c z2",
        })
      }, 600);
    }
  },
  workerCtnFn: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (id == '1' && that.data.isWorkerDisable == false) {
      this.setData({
        vipChecked: false,
        workerChecked: true,
        chooseVal: '干事'
      })
    }
    var that = this
    if (this.data.frameClass3 == 'frame flex flex-v flex-a-c flex-j-c z2' &&
      this.data.frameClass4 == 'frame flex flex-v flex-a-c flex-j-c z1') {
      that.setData({
        frameClass3: "frame flex flex-v flex-a-c flex-j-c back",
        frameClass4: "frame flex flex-v flex-a-c flex-j-c front",
      })
      setTimeout(function () {
        that.setData({
          frameClass3: "frame flex flex-v flex-a-c flex-j-c z1",
          frameClass4: "frame flex flex-v flex-a-c flex-j-c z2",
        })
      }, 600);
    }
  },
  vipDetailFn: function (e) {
    var that = this
    if (this.data.frameClass1 == 'frame flex flex-v flex-a-c flex-j-c z1' &&
      this.data.frameClass2 == 'frame flex flex-v flex-a-c flex-j-c z2') {
      that.setData({
        frameClass1: "frame flex flex-v flex-a-c flex-j-c front",
        frameClass2: "frame flex flex-v flex-a-c flex-j-c back",
      })
      setTimeout(function () {
        that.setData({
          frameClass1: "frame flex flex-v flex-a-c flex-j-c z2",
          frameClass2: "frame flex flex-v flex-a-c flex-j-c z1",
        })
      }, 600);
    }
  },
  workerDetailFn: function (e) {
    var that = this
    if (this.data.frameClass3 == 'frame flex flex-v flex-a-c flex-j-c z1' &&
      this.data.frameClass4 == 'frame flex flex-v flex-a-c flex-j-c z2') {
      that.setData({
        frameClass3: "frame flex flex-v flex-a-c flex-j-c front",
        frameClass4: "frame flex flex-v flex-a-c flex-j-c back",
      })
      setTimeout(function () {
        that.setData({
          frameClass3: "frame flex flex-v flex-a-c flex-j-c z2",
          frameClass4: "frame flex flex-v flex-a-c flex-j-c z1",
        })
      }, 600);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //获取招新状态和说明
  statusFn:function(){
    var that=this;
    wx.request({
      url: app.globalData.ymUrl +'/qingmang/getRecruitChannel',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data:{
        associationId: that.data.associationId
      },
      success:function(e){
        console.log(e)
        that.setData({
          isVipDisable:!e.data.data[1].status,
          isWorkerDisable:!e.data.data[0].status,
          vipText: e.data.data[1].content,
          workerText: e.data.data[0].content
        })
      }
    })
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      associationId: options.associationId
    })
    app.requestFn(app, that.statusFn());
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

})