//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrolls: [],
    wishNum: 0,
    offset: 0,
    limit: 10000
  },
  onLoad: function () {
    var _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      _this.getindexData();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        _this.getindexData();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          _this.getindexData();
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    // 
    this.getindexData();
    app.getUerData();
  },
  // 祈福灯列表
  getindexData: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.httpsRequest({
      url: '/api/indexWishList',
      param: {
        offset: this.data.offset,
        limit: this.data.limit
      },
      method: 'POST',
      success: function (res) {
        var datas = res.pageData.rows;
        var newData = [];
        var len = parseInt(datas.length / 7);
        if (len) {
          var temp = [];
          for (var i = 0; i < (7 * len); i++) {
            temp.push({
              id: datas[i].id,
              userInfoId: datas[i].userInfoId,
              wishImage: datas[i].wishImage,
              avatarUrl: datas[i].avatarUrl
            });
            if (temp.length == 7) {
              newData.push(temp);
              temp = [];
            }
          }
        }

        var llll = len * 7;
        if (datas.length > llll) {
          var temp = [];
          for (var i = llll; i < datas.length - len; i++) {
            temp.push({
              id: datas[i].id,
              userInfoId: datas[i].userInfoId,
              wishImage: datas[i].wishImage,
              avatarUrl: datas[i].avatarUrl
            });
          }
          newData.push(temp);
        }
        _this.setData({
          scrolls: newData,
          wishNum: res.count
        })
        // _this.setData({
        //   scrolls: (scrolls.concat(newData)),
        //   wishNum: (res.count + _this.wishNum)
        // })
      }
    });
  },
  // 我的心愿
  toMyWish: function () {
    wx.navigateTo({
      url: '../mywish/mywish'
    })
  },
  // 查看祈福灯
  toSee: function (e) {
    wx.navigateTo({
      url: '../tosee/tosee?id=' + e.currentTarget.dataset.id + '&userInfoId=' + e.currentTarget.dataset.userinfoid
    })
  },
  // 写下心愿
  toWriteWish: function () {
    wx.navigateTo({
      url: '../selectype/selectype'
    })
  },
  onShow: function () {
    // this.setData({
    //   offset: 0,
    //   limit: 70,
    //   wishNum: 0,
    //   scrolls: []
    // });
    this.getindexData();
  },
  lower: function () {
    // this.setData({
    //   offset: this.data.offset + 70,
    //   limit: 70
    // });
    // this.getindexData();
  }

})