const app = getApp();
Page({
    data: {
        headImg: "",
        headTxt: "",
        activeTab: "0",
        wishList: [{
            userInfoId: '',
            wishTypeId: "",
            templateId: '',
            wishImage: 'taohua',
            avatarUrl: "",
            wishToName: "",
            wishIntroduce: "",
            content: "",
            spotCount: 0
        }]
    },
    onLoad: function () {
        this.setData({
            headImg: app.globalData.userInfo.avatarUrl,
            headTxt: app.globalData.userInfo.nickName
        });
        this.getlist();
    },
    tabSwitch: function (e) {
        var type = e.currentTarget.dataset.type;
        this.setData({
            activeTab: type
        });
        this.getlist();
    },
    getlist: function () {
        var _this = this;
        app.httpsRequest({
            url: "/api/wishList",
            param: {
                userInfoId: app.globalData.userInfoId,
                type: this.data.activeTab,
                offset: 0,
                limit: 10000
            },
            method: "POST",
            success: function (res) {
                console.log("当前", res);
                _this.setData({
                    wishList: res.rows
                });
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    toDetail: function (e) {
        var dataset = e.currentTarget.dataset;
        wx.navigateTo({
            url: '../tosee/tosee?id=' + dataset.wishtypeid + '&userinfoid=' + dataset.userInfoId
        })
    }
});