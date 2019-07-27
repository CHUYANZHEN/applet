const app = getApp();
Page({
    data: {
        wishImage: '',
        topStyle: 770
    },
    onLoad: function (option) {
        var _this = this;
        this.setData({
            wishImage: option.wishImage
        });
        var interval = setInterval(function () {
            if (_this.data.topStyle <= 0) {
                clearInterval(interval);
                wx.navigateTo({
                    url: '../share/share?wishId=' + option.wishId + '&userInfoId=' + app.globalData.userInfoId
                })
            } else {
                _this.setData({
                    topStyle: _this.data.topStyle - 2
                });
            }
        }, 10);
    },
    onShow: function () {
        if (this.data.topStyle <= 0) {
            wx.navigateBack({
                delta: 5
            });
        }
    }
});