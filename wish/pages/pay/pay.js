const app = getApp();
Page({
    data: {
        wishId: '',
        wishImage: 'taohua',
        avatarUrl: '',
        nickName: '',
        templateId: '',
        templateTxt: '',
        content: '',
        price: 0,
        wishToName: '',
        activeTab: ''
    },
    onLoad: function () {
        var _this = this;
        wx.getStorage({
            key: 'paywish',
            success(res) {
                console.log(res);
                _this.setData({
                    wishId: res.data.wishId,
                    wishImage: res.data.wishImage,
                    avatarUrl: res.data.avatarUrl,
                    nickName: res.data.nickName,
                    templateId: res.data.templateId,
                    templateTxt: res.data.templateTxt,
                    content: res.data.content,
                    price: res.data.price,
                    wishToName: res.data.wishToName,
                    activeTab: res.data.activeTab
                });
            }
        })
    },
    onPay: function () {
        var _this = this;
        app.httpsRequest({
            url: '/api/payWish',
            param: {
                wishId: this.data.wishId
            },
            method: 'POST',
            success: function (res) {
                console.log('当前', res);
                _this.onWeiXin(res);
            },
            fail: function (res) {
                console.log(res)
            }
        });
    },
    onWeiXin: function (res) {
        var _this = this;
        wx.requestPayment({
            'timeStamp': res.timeStamp,
            'nonceStr': res.nonceStr,
            'package': res.packageValue,
            'signType': res.signType,
            'paySign': res.paySign,
            'success': function (res) {
                console.log("支付", res);
                wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 3000
                });
                _this.toShare();
            },
            'fail': function (res) {
                console.log("支付", res);
                wx.showToast({
                    title: '支付失败',
                    icon: 'success',
                    duration: 3000
                });
            },
            'complete': function (res) {
                console.log('complete');
            }
        });
    },
    toShare: function () {
        wx.navigateTo({
            url: '../fly/fly?wishId=' + this.data.wishId + '&wishImage=' + this.data.wishImage
        })
    }
});