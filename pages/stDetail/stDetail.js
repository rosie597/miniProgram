// pages/stDetail/stDetail.js
var mta = require('../../mta_analysis.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIconShow1: true,
    isIconShow2: false,
    isIconShow3: false,
    isStBriefShow: true,
    isDpmShow: false,
    isActivityShow: false,
    currentSwiper: '0',
    logoUrl: '',
    introduction: '',
    dpmBriefInfo: [],
    dotImgs: [],
    ufnInfo: [],
    fnInfo: [],
    //  status:3
    isConcernChecked:false,
    stBriefTop1: 'stBriefTop z1',//默认正面在上面
    stBriefTop2: 'stBriefTop z2',
    unfinish: true,
    finish: false,
    concernimsg:'',
    isQrCode:false,
    isUserSq:false,
    canvasUrl:''
  },
  stTabTapFn1: function () {
    var that=this;
    app.requestFn(app, that.introductionReq());
    app.requestFn(app, that.statusFn());
    app.requestFn(app, that.isFollow(app.globalData.id, that.data.associationId));
    this.setData({
      isIconShow1: true,
      isIconShow2: false,
      isIconShow3: false,
      isStBriefShow: true,
      isDpmShow: false,
      isActivityShow: false,
      stBriefTop1: 'stBriefTop z1',
      stBriefTop2: 'stBriefTop z2',
      pxRatio:2
    })
  },
  departmentReq: function (id) {
    var that = this
    var dpmBriefInfo1 = []
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl +'/qingmang/association/' + id + '/department',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        console.log('department',e)
        var dat = e.data.data
        var dotUrls = []
        if (dat.length > 1) {
          for (var i = 0; i < dat.length; i++) {
            dotUrls.push('../../images/grey_dot.png')
          }
        }
        that.setData({
          dotImgs: dotUrls
        })
        for (let i in dat) {
          dat[i].imgUrl = dat[i].imgUrl.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net")
          dpmBriefInfo1.push(dat[i])
        }
        that.setData({
          dpmBriefInfo: dpmBriefInfo1
        })
      }
    })
  },
  stTabTapFn2: function () {
    var that = this;
    app.requestFn(app, that.departmentReq(that.data.associationId));
    this.setData({
      isIconShow1: false,
      isIconShow2: true,
      isIconShow3: false,
      isStBriefShow: false,
      isDpmShow: true,
      isActivityShow: false
    })
  },
  activityReq: function (id) {
    var that = this;
    var ufnInfo1 = []
    var fnInfo1 = []
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/association/' + id + '/activity',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading()
        console.log('acti',e)
        var dat1 = e.data.data.进行中
        var dat2 = e.data.data.已结束
        for (let i in dat2) {
          dat2[i].cover = dat2[i].cover.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
          fnInfo1.push(dat2[i])
        }
        for (let i in dat1) {
          dat1[i].cover = dat1[i].cover.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net")
          ufnInfo1.push(dat1[i]);
        }
        that.setData({
          ufnInfo: ufnInfo1,
          fnInfo: fnInfo1
        })
      }
    })
  },
  stTabTapFn3: function () {
    var that = this;
    app.requestFn(app, that.activityReq(that.data.associationId));
    this.setData({
      isIconShow1: false,
      isIconShow2: false,
      isIconShow3: true,
      isStBriefShow: false,
      isDpmShow: false,
      isActivityShow: true
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  toChooseFn: function () {
    var that = this;
    if (that.data.status == 1 || that.data.status == 2) {
      wx.navigateTo({
        url: '../identityChoose/identityChoose?associationId=' + that.data.associationId,
      })
    }
    else{
      wx.showToast({
        icon: 'none',
        title: '不在报名时间内哦',
        duration: 1500
      })
    }
  },
  toHdPage: function (e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../hdDetail/hdDetail?id=' + id,
    })
  },
  concernFn: function () {
    var that=this;
    if(that.data.isConcernChecked==false){
      this.setData({
        isConcernChecked: true,
        concernimsg: "已关注"
      });
      that.followReq(true)
    }else{
      this.setData({
        isConcernChecked: false,
        concernimsg: "关注 "+that.data.follow_num+"+"
      });
      that.followReq(false)
    }
  },
  //关注请求
  followReq: function (state) {
    var that = this
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/association/attend',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      data: {
        userId: app.globalData.id,
        associationId: that.data.associationId,
        isAttend: state
      },
      success: function (e) {
        console.log('关注成功', e, that.data.associationId)
        if (e.data.code != 200) {
          if(that.data.isConcernChecked==true){
            that.setData({
              isConcernChecked: false,
              concernimsg: "关注 " + that.data.follow_num + "+"
            });
          }else{
            that.setData({
              isConcernChecked: true,
              concernimsg: "已关注"
            });
          }
        }
      },
      fail: function (e) {
        console.log(e)
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none',
          duration: 1500
        })
        if (that.data.isConcernChecked == true) {
          that.setData({
            isConcernChecked: false,
            concernimsg: "关注 " + that.data.follow_num + "+"
          });
        } else {
          that.setData({
            isConcernChecked: true,
            concernimsg: "已关注"
          });
        }
      }
    })
  },
  rotateFn: function (e) {
    var that = this
    if (this.data.stBriefTop1 == 'stBriefTop z1' &&
      this.data.stBriefTop2 == 'stBriefTop z2') {
      that.setData({
        stBriefTop1: "stBriefTop front",
        stBriefTop2: "stBriefTop back",
      })
      setTimeout(function () {
        that.setData({
          stBriefTop1: "stBriefTop z2",
          stBriefTop2: "stBriefTop z1",
        })
      }, 600);
        that.getQrCodeReq();
    }
    else if ((this.data.stBriefTop1 == 'stBriefTop z2' &&
      this.data.stBriefTop2 == 'stBriefTop z1') ) {
      that.setData({
        stBriefTop1: "stBriefTop back",
        stBriefTop2: "stBriefTop front",
      })
      setTimeout(function () {
        that.setData({
          stBriefTop1: "stBriefTop z1",
          stBriefTop2: "stBriefTop z2",
        })
      }, 600);
    }
  },
  unFinish: function () {
    var that = this;
    that.setData({
      unfinish: true,
      finish: false
    })
  },
  Finish: function () {
    var that = this;
    that.setData({
      unfinish: false,
      finish: true
    })
  },
  isMask: function () {
    var that = this;
    that.setData({
      guide:false
    })
    app.globalData.guide=false;
    wx.setStorageSync('guide', false)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  statusFn: function () {
    var that = this;
    wx.request({
      url: app.globalData.ymUrl +'/qingmang/getRecruitStatus',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      data: {
        associationId: that.data.associationId
      },
      success: function (e) {
        console.log('e', e);
        app.globalData.stStatus = e.data.data.status;
        that.setData({
          status: e.data.data.status
        })
        console.log('status', that.data.status)
      }
    })
  },
  introductionReq: function () {
    var that = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      data: {
        associationId: that.data.associationId
      },
      url: app.globalData.ymUrl + '/qingmang/association/' + that.data.associationId + '/introduction',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        wx.hideLoading();
        var dat = e.data.data
        console.log('11',dat)
        that.setData({
          logoUrl: dat.logoUrl.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"),
          introduction: dat.introduction,
          stCampus: dat.campus,
          stType: dat.associationCategory,
          stSlogan: dat.slogan,
          follow_num:dat.attentionCount,
          concernimsg:"关注 "+dat.attentionCount+" +",
          name:dat.name
        })
        wx.setNavigationBarTitle({
          title: dat.name
        })
      }
    })
  },
  //获取二维码
  getQrCodeReq:function(){
    var that=this;
    wx.request({
      url: app.globalData.ymUrl + '/qingmang/assoQrCode',
      header: {
        'content-type':'application/json',
        'Authorization': app.globalData.token
      },
      data:{
        scene: that.data.associationId,
        page: 'pages/stDetail/stDetail'
      },
      success:function(e){
        console.log('erweima', e, encodeURIComponent(e.data));
        var url=e.data.data
        wx.downloadFile({
          url: app.globalData.ymUrl + url.substring(34, url.length),
          success:function(res){
            console.log("downloaddat",res)
            if(res.statusCode==200){
              that.setData({
                stQrUrl_d:res.tempFilePath
              })
              that.drawCanvas(res.tempFilePath,true);//show loading
            }
          },
          fail:function(res){
            console.log('fail',res)
          }
        })
        that.setData({
          _stQrUrl: app.globalData.ymUrl + url.substring(32, url.length)
        })
      },
      fail:function(e){
        wx.showToast({
          title: '请检查网络',
          icon:'none',
          duration:1500
        })
      }
    })
  },
  drawCanvas:function(url,isShow){
    var that=this
    var sw=that.data.screenWidth;
    const ctx = wx.createCanvasContext('shareCanvas');
    if (isShow){
      wx.showLoading({
        title: '二维码加载中~',
      })
    }
    ctx.drawImage(url, 0, 0, sw / 750 * 300, sw / 750 * 300);//绘制背景图，这里使用后台返回的二维码地址download到本地之后的路径
    if (that.data.logoUrl !='https://www.gdutcs2.top/logo'){
        ctx.restore();
        let p2 = new Promise(function (resolve, reject) {
          wx.getImageInfo({
            src: that.data.logoUrl,
            success(res) {
              resolve(res);
            }
          })
        }).then(res => {
          var w = res.width, h = res.height, x, y
          if (w > h) {
            x = (w - h) / 2;
            y = 0;
            w = h;
          } else if (w < h) {
            y = (h - w) / 2;
            x = 0;
            h = w
          } else {
            x = 0;
            y = 0;
          }
          ctx.beginPath(); //开始绘制
          ctx.arc(sw / 750 * 150, sw / 750 * 150, sw / 750 * 68, 0, Math.PI * 2, false);
          ctx.save();
          ctx.clip();
          ctx.setFillStyle('white');
          ctx.fill();
          //drawImage的参数分别为路径，开始剪裁的x和y位置，剪裁的x和y长度，画布上放置x和y的位置，要使用图像的宽度
          ctx.drawImage(res.path, x, y, w, h, sw / 750 * 82, sw / 750 * 82, sw / 750 * 136, sw / 750 * 136);
          ctx.restore();
          setTimeout(function(){
            ctx.draw(false, that.canvasToImg());
            if(isShow){
              wx.hideLoading();
            }
            that.setData({
              isQrCode: true
            })
            console.log(11)
          },500)
        })
      }else{
        setTimeout(function () {
          ctx.draw(false, that.canvasToImg());
          if (isShow) {
            wx.hideLoading();
          }
          that.setData({
            isQrCode: true
          })
        }, 500)
      }
  },
  //将canvas上传为图片路径
  canvasToImg:function(){
    var that=this;
    var pr=that.data.pxRatio;
    var sw =that.data.screenWidth;
    console.log('pr * sw / 750 * 280', pr * sw / 750 * 280)
    setTimeout(function(){
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        destWidth: 2 * pr * sw / 750 * 300,
        destHeight: 2 * pr * sw / 750 * 300,
        success(res) {
          console.log(res)
          that.setData({
            canvasUrl: res.tempFilePath
          })
        }
      })
    },300)
  },
  //点击二维码查看保存
  imagePreview: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //保存图片时判断用户的授权
  saveImg:function() {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          that.setData({
            isUserSq: true
          })
          console.log('no_writePhotosAlbum')
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              console.log('authorize_success')
              that.saveQrCode();
            },
            fail: function (err) {
              that.setData({
                isUserSq: true
              })
            }
          })
        } else {
          console.log("writePhotosAlbum")
          that.saveQrCode();
        }
      }
    })
  },
  //点击保存二维码按钮保存图片
  saveQrCode: function (e) {
    var that=this;
    var _url = that.data.canvasUrl
    that.drawCanvas(that.data.stQrUrl_d,false)//不显示loading
    that.setData({
      isUserSq: false
    })
    wx.saveImageToPhotosAlbum({
      filePath: _url,
        success: function (data) {
          console.log('save_success', data)
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          })
        },
        fail: function (e) {
          wx.showToast({
            title: '操作失败,请重试',
            duration: 1000,
            icon: 'none'
          })
          console.log('baocunshibai', e)
        }
    })
  },
  sq_btn_tap: function () {
    this.setData({
      isUserSq: false
    })
  },
  openSetting:function(e){
    var that = this;
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '不授权无法保存',
        showCancel: false
      })
    } else {
      console.log('授权成功')
    }
  },
  isFollow: function (userid, assid) {
    var that = this
    wx.request({
      url: app.globalData.ymUrl + '/qingmang/user/' + userid + '/attend/association/' + assid,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        console.log('isAttend', e)
        var status = status = e.data.data.isAttend
        if (status) {
          that.setData({
            isConcernChecked: true
          })
        } else {
          that.setData({
            isConcernChecked:false
          })
        }
      },
      fail: function (e) {
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    //var scene = decodeURIComponent(options.scene)
    var scene=options.scene
    console.log('scene',scene)
    that.setData({
      associationId: options.id||options.scene,
      guide: app.globalData.guide
    })
    app.requestFn(app, that.introductionReq());
    app.requestFn(app, that.statusFn());
    app.requestFn(app, that.isFollow(app.globalData.id,that.data.associationId));
    mta.Page.init();
    console.log(that.data.status)
    wx.getSystemInfo({
      success: function(res) {
        console.log('sys',res.screenWidth)
        that.setData({
          screenWidth: res.screenWidth
        })
      },
    })
    if(options.scene){
      setTimeout(function () {
        app.requestFn(app, that.introductionReq());
        app.requestFn(app, that.statusFn());
        app.requestFn(app, that.isFollow(app.globalData.id, that.data.associationId));
      }, 1000)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          pxRatio:res.pixelRatio
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    app.requestFn(app, that.statusFn());
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
    var that=this
    app.requestFn(app, that.introductionReq());
    app.requestFn(app, that.statusFn());
    app.requestFn(app, that.activityReq(that.data.associationId));
    app.requestFn(app, that.departmentReq(that.data.associationId));
    app.requestFn(app, that.isFollow(app.globalData.id, that.data.associationId));
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
    var that = this;
    return {
      title: '大学生校园社团活动工具',
      desc: '青芒社团',
      path: 'pages/stDetail/stDetail?id=' + that.data.associationId + '&name=' + that.data.name
    }
  }
})