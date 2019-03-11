// pages/login/login.js
var app=getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    console.log(this.data.canIUse)
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log('已经授权')
              //从数据库获取用户信息
              // that.queryUserInfo();
              //用户已经授权过
              wx.switchTab({
                url: '../index/index'
              })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      console.log(e.detail.userInfo);
      var info = e.detail.userInfo;
      headingUrl = info.avatarUrl;
      nickName = info.nickName;
      if (info.gender == 0 || info.gender == 2) {
        sex = false
      } else {
        sex = true
      }
      var sex,nickName,headingUrl
      wx.request({
        method: "POST",
        url: app.globalData.ymUrl +'/qingmang/updateUser',
        data: {
          headingUrl: headingUrl,
          nickname: nickName,
          sex: sex
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': app.globalData.token
        },
        success: function (e) {
          console.log("发送数据成功：", headingUrl, nickName, sex)
        }
      });
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '../index/index'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  onShow:function(){

  },

})