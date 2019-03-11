// pages/hdDetail/hdDetail.js
var app = getApp();
var mta = require('../../mta_analysis.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[],
    videoUrl:'',
    introduction:'',
    isVideoShow: false,
    isImgShow1: true,
    isVideoShow1: false,
    currentNum: 1,
    totalNum: 0,
    controls:false,
    imgUrls: [],
    status:false,
    btnText:"报名",
    isBtnShow:true,
    canIUse: wx.canIUse('cover-view'),
    followSrc:'../../images/follow.png',
    joinStatus:1
  },
  cancelVideo:function(){
    this.setData({
      isVideoShow:false,
      isVideoShow1: false,
      isImgShow1: true
    })
  },
  //关注社团按钮事件
  isFollowFn:function(){
    var that=this
    if (that.data.followSrc == '../../images/follow.png'){
      that.setData({
        followSrc:'../../images/unfollow.png'
      })
      that.followReq(true);
    }else{
      that.setData({
        followSrc: '../../images/follow.png'
      })
      that.followReq(false);
    }
  },
  _btnTap:function(){
    var that=this 
    var state=that.data.joinStatus
    if(state==0){
      wx.showToast({
        icon:'none',
        title: '不在报名时间内哦',
        duration:1500
      })
    }else if(state==1){
      mta.Event.stat("clickhuodongbaoming", {});
      mta.Event.stat('huodongbaoming', { 'signupactivity': 'true' });
      wx.navigateTo({
        url: '../joinActivity/joinActivity?hdId=' + that.data.id
      })
    }
  },
  videoPlayFn:function(){
    mta.Event.stat("clickvideo", {});
  },
  swiperChange: function (e) {
    this.setData({
      currentNum: ++e.detail.current
    })
  },
  viewVideoFn:function(){
    this.setData({
      isVideoShow: true,
      isVideoShow1:true,
      isImgShow1:false
    })
  },
  viewImgFn: function () {
    this.setData({
      isVideoShow1: false,
      isImgShow1: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  noticeReq:function(id){
    var that=this
    var imgUrls1 = []
    wx.request({
      url: app.globalData.ymUrl + '/qingmang/user/'+app.globalData.id+'/activity/'+id,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        var dat = e.data.data
        console.log('detail',e)
        var i
        if(dat.imgUrl1){
          imgUrls1.push(dat.imgUrl1.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"))
        }
        if (dat.imgUrl2) {
          imgUrls1.push(dat.imgUrl2.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"))
        }
        if (dat.imgUrl3) {
          imgUrls1.push(dat.imgUrl3.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"))
        }
        if (dat.imgUrl4) {
          imgUrls1.push(dat.imgUrl4.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"))
        }
        if (dat.imgUrl5) {
          imgUrls1.push(dat.imgUrl5.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"))
        }
        var videoUrl = dat.videoUrl
        dat.association.associationLogo = dat.association.associationLogo.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net")
        that.setData({
          imgUrls: imgUrls1,
          videoUrl: videoUrl.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net"),
          detailInfo:dat
        })
        wx.setNavigationBarTitle({
          title: dat.name
        })
      }
    })
  },
  //报名状态请求
  statusReq:function(id){
    var that=this;
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/user/'+app.globalData.id+'/activity/'+id+'/channel',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success:function(e){
        console.log(e)
        var state=e.data.data.isOpen.type;
        that.setData({
          joinStatus:state
        })
        if(state==1||state==0){
          that.setData({
            btnText: "报名"
          })
        }else if(state==2){
          that.setData({
            btnText:"已报名"
          })
        }
      }
    })
  },
  //关注请求
  followReq:function(state){
    var that=this
    wx.request({
      url: app.globalData.ymUrl +'/qingmang/association/attend',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      data:{
        userId:app.globalData.id,
        associationId: that.data.detailInfo.association.associationId,
        isAttend:state
      },
      success:function(e){
        console.log('关注成功', e)
        if(e.data.code!=200){
          wx.showToast({
            title: e.data.msg,
            icon:'none',
            duration:1500
          })
          if (that.data.followSrc == '../../images/follow.png') {
            that.setData({
              followSrc: '../../images/unfollow.png'
            })
          } else {
            that.setData({
              followSrc: '../../images/follow.png'
            })
          }
        }
      },
      fail:function(e){
        console.log(e)
        wx.showToast({
          title: '操作失败，请重试',
          icon:'none',
          duration: 1500
        })
        if(that.data.followSrc == '../../images/follow.png') {
          that.setData({
            followSrc: '../../images/unfollow.png'
          })
        } else {
          that.setData({
            followSrc: '../../images/follow.png'
          })
        }
      }
    })
  },
  //是否关注社团
  isFollow:function(userid,assid){
    var that=this
    wx.request({
      url: app.globalData.ymUrl + '/qingmang/user/'+userid+'/attend/association/'+assid,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success:function(e){
        console.log('isAttend',e)
        var status=e.data.data.isAttend
        if(status){
          that.setData({
            followSrc:'../../images/unfollow.png'
          })
        }else{
          that.setData({
            followSrc: '../../images/follow.png'
          })
        }
      },
      fail:function(e){
      }
    })
  },
  onLoad: function (options) {
    var that=this;
    var id=options.id;
    that.setData({
      id
    });
    app.requestFn(app, that.noticeReq(id));
    app.requestFn(app, that.statusReq(id));
    setTimeout(function(){
      app.requestFn(app, that.isFollow(app.globalData.id, that.data.detailInfo.association.associationId));
    },1000)
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
  onShareAppMessage: function (e) {
    var id=e.data.id;
    return {
      title: '大学生校园社团活动工具',
      desc: '青芒社团',
      path: '/pages/hdDetail/hdDetail?id='+id
    }
  }
})