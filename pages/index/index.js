//index.js
var mta = require('../../mta_analysis.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isInfoShow:true,
    hotHdInfo: [],
    maInfo:[],
    currentSwiper: 0,
    dotImgs:[],
    dotUrl:'../../images/grey_dot.png',
    activeDotUrl: '../../images/u18.png',
    isIconShow1:true,
    isIconShow2:false,
    isIconShow3:false,
    weeks:['全部','本周','下周'],
    isSelectShow:false,
    week_time:'全部',
    notice_num:0,
    isGuideShow:false
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  toSearchPage:function(){
    var that=this
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
  toHdPage:function(e){
    var that = this
    if (that.data.isSelectShow == true) {
      that.setData({
        isSelectShow: false
      })
    } else {
      var id = e.currentTarget.id
      mta.Event.stat('huodongbaoming', { 'clickactivity': 'true' });
      wx.navigateTo({
        url: '../hdDetail/hdDetail?id=' + id
      })
    }
  },
  toHotHdPage: function (e) {
    var that = this
    if (that.data.isSelectShow == true) {
      that.setData({
        isSelectShow: false
      })
    } else {
      var id = e.currentTarget.id
      mta.Event.stat("dianjiremen", {});
      mta.Event.stat('huodongbaoming', { 'clickactivity': 'true' });
      mta.Event.stat('chakanremen-3', { 'clickremen': 'true' })
      wx.navigateTo({
        url: '../hdDetail/hdDetail?id=' + id
      })
    }
  },
  dItemFn: function (e) {
    var currentId = e.currentTarget.id
    var index=e.target.dataset.index
    var that = this
    this.setData({
      isSelectShow: false,
      week_time: currentId,
    })
    app.requestFn(app, that.moreReq(index));
    if (that.data.maInfo == []) {
      wx.showLoading({
        title: '请等待加载',
      })
    } else {
      wx.hideLoading();
    }
  },
  dSelectFn: function () {
    var that = this
    this.setData({
      isSelectShow: !this.data.isSelectShow,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //请求热门活动与更多活动的函数
  hotReq:function(){
    var that = this
    var hotHdInfo1 = []
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/index/hot',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        if(e.data.code==200){
          console.log('hot', e)
          wx.hideLoading();
          var hotAct = e.data.data
          var a
          var dotImgs = []
          for (a = 0; a < hotAct.length; a++) {
            dotImgs.push(a)
            that.setData({
              dotImgs: dotImgs
            })
          }
          for (let i in hotAct) {
            let time = hotAct[i].startTime;
            let url1 = hotAct[i].cover.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
            hotAct[i].cover = url1;
            if (time) {
              time = time.substring(5, 7) + '月' + time.substring(8) + '日';
              hotAct[i].startTime = time;
            }
            else {
              hotAct[i].startTime = ''
            }
            hotHdInfo1.push(hotAct[i])
          }
          that.setData({
            hotHdInfo: hotHdInfo1
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
      fail:function(e){
        console.log('failmsg',e)
        wx.hideLoading();
        wx.showToast({
          title: '请检查网络',
          duration: 1500,
          icon: 'none'
        })
      }
    })
  },
  moreReq:function(x){
    var that = this;
    wx.showLoading({
      title: '等待加载',
    })
    wx.request({
      url: app.globalData.ymUrl+"/qingmang/index/more/"+x,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        if(e.data.code==200){
          wx.hideLoading();
          console.log('more',e)
          var _data=e.data.data
          switch(x){
            case 0:{
              var allInfo = _data.all;
              if (allInfo!=[]) {
                for (let i in allInfo) {
                  let time = allInfo[i].startTime;
                  let url1=allInfo[i].cover.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
                  allInfo[i].cover=url1;
                  if(time){
                    time = time.substring(5, 7) + '月' + time.substring(8) + '日';
                    allInfo[i].startTime = time;
                  }
                  else{
                    allInfo[i].startTime=''
                  }
                }
                that.setData({
                  maInfo: allInfo
                })
                console.log("info",allInfo)
              } else {
                that.setData({
                  maInfo: []
                })
              }
            } break;
            case 1:{
              var thisInfo = _data.thisWeek;
              let url1 = thisInfo[i].cover.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
              thisInfo[i].cover = url1;
              if(thisInfo!=[]){
                for (let i in thisInfo) {
                  let time = thisInfo[i].startTime;
                  if (time) {
                    time = time.substring(5, 7) + '月' + time.substring(8) + '日';
                    thisInfo[i].startTime = time;
                  }
                  else {
                    thisInfo[i].startTime = ''
                  }
                }
                that.setData({
                  maInfo: thisInfo
                })
              }else{
                that.setData({
                  maInfo: []
                })
              }
            } break;
            case 2:{
              var nextInfo = _data.nextWeek;
              let url1 = nextInfo[i].cover.replace("http://img.qingmang.shanyutech.net", "https://qingmang.shanyutech.net");
              nextInfo[i].cover = url1;
              if (nextInfo!=[]){
                for (let i in nextInfo) {
                  let time = nextInfo[i].startTime;
                  if (time) {
                    time = time.substring(5, 7) + '月' + time.substring(8) + '日';
                    nextInfo[i].startTime = time;
                  }
                  else {
                    nextInfo[i].startTime = ''
                  }
                }
                that.setData({
                  maInfo: nextInfo
                })
              }else{
                that.setData({
                  maInfo: []
                })
              }
            }
          }
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '获取数据失败',
            duration: 1500,
            icon: 'none'
          })
        }
      },
      fail:function(e){
        wx.hideLoading();
        wx.showToast({
          title: '请检查网络',
          duration:1500,
          icon:'none'
        })
      }
    })
  },
  pageTap:function(){
    var that=this;
    if(this.data.isSelectShow==true){
      that.setData({
        isSelectShow:false
      })
    }
  },
  ikonw_fn:function(){
    var that = this;
    that.setData({
      isGuideShow: false
    })
    app.globalData.guide1 = false;
    wx.setStorageSync('guide1', false)
  },
  noticeReq: function () {
    var that = this;
    wx.showLoading({
      title: '等待加载',
    })
    wx.request({
      url: app.globalData.ymUrl+'/qingmang/notice',
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (e) {
        console.log('notice',e)
        wx.hideLoading();
        var a= e.data.data.noticeList;
        var b = e.data.data.subscriptionList;
        var count=0;
        for(let i in a){
          if(a[i].status==0){
            count++;
          }
        }
        for (let i in b) {
          if (b[i].status == 0) {
            count++;
          }
        }
        that.setData({
          notice_num:count
        }) 
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },
  onLoad: function (options) {
    var that = this
    console.log('scene',options)
    setTimeout(function(){
      app.requestFn(app, that.noticeReq());
      app.requestFn(app, that.hotReq());
      app.requestFn(app, that.moreReq(0));
    },500)
    console.log('load')
    mta.Page.init();
    that.setData({
      isGuideShow:true
    })
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
    var that = this;
    mta.Event.stat('chakanremen-3', { 'viewshouye': 'true' })
    app.requestFn(app, that.hotReq());
    app.requestFn(app, that.moreReq(0));
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
    var that = this;
    app.requestFn(app, that.hotReq());
    app.requestFn(app, that.moreReq(0));
    wx.stopPullDownRefresh();
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
      path: '/pages/index/index'
    }
  }
})