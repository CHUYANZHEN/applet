//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync("logs") || [];
        logs.unshift(Date.now());
        wx.setStorageSync("logs", logs);

        // 登录
        wx.login({
            success: res => {
                this.globalData.code = res.code;
                // console.log("登录：", res);
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        });
        // 获取用户信息
        wx.getSetting({
            success: res => {
                // console.log("获取授权", res);
                if (res.authSetting["scope.userInfo"]) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // console.log("app获取用户数据：", res);
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo;

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res);
                            }
                            //
                            this.getUerData();
                        }
                    });
                }
            }
        });
    },
    globalData: {
        userInfo: null,
        // https: "http://192.168.40.21:8081"
        https: "https://www.photocar.cn"
    },
    // 保存微信用户信息
    getUerData: function () {
        var _this = this;
        this.httpsRequest({
            url: "/api/updateUserInfo",
            param: {
                code: this.globalData.code,
                nickname: this.globalData.userInfo.nickName,
                avatarUrl: this.globalData.userInfo.avatarUrl
            },
            method: "POST",
            success: function (res) {
                _this.globalData.userInfoId = res.id;
                _this.globalData.openid = res.openid;
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    // 公共请求方法
    httpsRequest: function (params) {
        wx.request({
            url: this.globalData.https + params.url,
            data: params.param,
            method: params.method,
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            dataType: "json",
            success: function (res) {
                if (res.data.code == 0) {
                    var result = result = typeof res.data.data == 'object' ? res.data.data : JSON.parse(res.data.data);
                    if (params.success) params.success(result);
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 1000
                    });
                    if (params.fail) params.fail(res);
                }
            },
            fail: function (res) {
                wx.showToast({
                    title: "请求失败",
                    duration: 1000
                });
                if (params.fail) params.fail(res);
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    }
});