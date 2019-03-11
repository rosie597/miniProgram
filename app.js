///app.js
var mta = require('mta_analysis.js')
App({
  //解码函数
  decode: function (input) {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = this._utf8_decode(output);
    return output;
  },
  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c = 0;
    var c2 = 0;
    var c3 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  },
  //请求函数
  requestFn:function(app,reqFn){
    var that=this
    var token = app.globalData.token
    if (token) {
      var time_now = Math.round(new Date() / 1000);
      var expire = app.globalData.expire
      //未过期调用请求函数
      if (expire < time_now) {
        reqFn;
        console.log(1)
      }
      //过期的话用之前的id和openid取得新的token
      else {
        wx.request({
          url: that.globalData.ymUrl+'/qingmang/getNewToken',
          method: "POST",
          data: {
            id: app.globalData.id,
            openId: app.globalData.openId
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (e) {
            var token = e.data.data.token;
            app.globalData.token = token;
            reqFn;
            console.log(2)
          }
        })
      }
    }
    //token不存在时执行一次登陆函数，再调用请求函数
    else {
      console.log('token不存在')
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var code = res.code
          if (code) {
            wx.request({
              url: that.globalData.ymUrl+'/qingmang/getTokenForMini',
              data: {
                code: code
              },
              success: function (e) {
                var token = e.data.data.token
                var token_parts = token.split('.');
                var token_msg = JSON.parse(app.decode(token_parts[1]));
                app.globalData.token = token;
                app.globalData.id = token_msg["id"];
                app.globalData.openId = token_msg["openId"];
                app.globalData.expire = token_msg["exp"];
                reqFn;
                console.log(3)
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                app.globalData.userInfo = res.userInfo
                var info = res.userInfo
                var sex, nickName, headingUrl
                nickName = info.nickName;
                headingUrl = info.avatarUrl;
                that.globalData.nickName = nickName;
                that.globalData.headingUrl = headingUrl;
                if (info.gender == 0 || info.gender == 2) {
                  sex = false
                } else {
                  sex =true
                }
                wx.request({
                  method: "POST",
                  url: that.globalData.ymUrl+'/qingmang/updateUser',
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
                    reqFn;
                    console.log(4)
                    console.log("发送数据成功1：", headingUrl, nickName, sex)
                  }
                })

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
     }
  },
  //获得用户信息
  getUserKey:function(){
    var that=this;
    return new Promise(function(resolve,reject){
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var code = res.code
          if (code) {
            wx.request({
              url: that.globalData.ymUrl+'/qingmang/getTokenForMini',
              data: {
                code: code
              },
              success: function (e) {
                var token = e.data.data.token
                var token_parts = token.split('.');
                var token_msg = JSON.parse(that.decode(token_parts[1]).toString().slice(0, -1));
                that.globalData.token = token;
                that.globalData.id = token_msg["id"];
                that.globalData.openId = token_msg["openId"];
                that.globalData.expire = token_msg["exp"];
                resolve(res);
              }
            })
          } else {
            console.log("login fail")
            reject("error");
            //登陆失败
          }
        }
      })
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                that.globalData.userInfo = res.userInfo
                var info = res.userInfo
                var sex, nickName, headingUrl
                nickName = info.nickName
                headingUrl = info.avatarUrl
                that.globalData.nickName=nickName;
                that.globalData.headingUrl=headingUrl;
                if (info.gender == 0 || info.gender == 2) {
                  sex = false
                } else {
                  sex = true
                }
                wx.request({
                  method: "POST",
                  url: that.globalData.ymUrl+'/qingmang/updateUser',
                  data: {
                    headingUrl: headingUrl,
                    nickname: nickName,
                    sex: sex
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': that.globalData.token
                  },
                  success: function (e) {
                    console.log("发送数据成功：", headingUrl, nickName, sex)
                  },
                  fail: function () {
                    console.log("数据发送失败")
                  }
                })

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    })
  },
  onLaunch: function () {
    mta.App.init({
      "appID": "500634408",
      "eventID": "500634411",
      "statShareApp": true
    });
    var that=this
    if (wx.getStorageSync('guide')!==''){
      that.globalData.guide = wx.getStorageSync('guide')
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({ 
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code=res.code
        if(code){
          wx.request({
            url: that.globalData.ymUrl+'/qingmang/getTokenForMini',
            data:{
              code:code
            },
            success:function(e){
              console.log('launch login 成功',e)
              var token=e.data.data.token
              var token_parts=token.split('.');
              var token_msg = JSON.parse(that.decode(token_parts[1]).toString().slice(0,-1));
              that.globalData.token=token;
              that.globalData.id = token_msg["id"];
              that.globalData.openId = token_msg["openId"];
              that.globalData.expire = token_msg["exp"];
            }
          })
        }else{
          console.log("login fail")
          //登陆失败
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              var info=res.userInfo
              var sex,nickName,headingUrl
              nickName = info.nickName;
              headingUrl = info.avatarUrl;
              that.globalData.nickName = nickName;
              that.globalData.headingUrl = headingUrl;
              if(info.gender==0||info.gender==2){
                sex=false
              }else{
                sex=true
              }
              wx.request({
                method:"POST",
                url: that.globalData.ymUrl+'/qingmang/updateUser',
                data:{
                  headingUrl:headingUrl,
                  nickname:nickName,
                  sex:sex
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Authorization':that.globalData.token
                },
                success:function(e){
                  console.log("发送数据成功：",headingUrl,nickName,sex)
                },
                fail:function(){
                  console.log("数据发送失败")
                }
              })

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //获取access_token
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=' + 'client_credential' + '&appid=' + 'wxafd11a4242a1e62a' + '&secret=' +'fd20efd239d715db2b775c1964199fcc',
      success:function(e){
        console.log('success1',e)
        that.globalData.access_token=e.data.access_token;
      },
      fail:function(e){
        console.log('fail1',e)
      }
    })
  },
  globalData: {
    userInfo:[],
    token:'',
    id:"",
    openId:"",
    expire:0,
    status:false,
    ymUrl:'https://qingmang.shanyutech.net',
    // ymUrl:'https://139.199.199.154',
    //ymUrl:'https://www.gdutcs2.top',
    guide:true,
  }
})