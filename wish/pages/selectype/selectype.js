const app = getApp()
Page({
    data: {
        lanternList: [{
            id: '122',
            wishImage: 'taohua',
            wishIntroduce: ''
        }]
    },
    onLoad: function () {
        var _this = this;
        app.httpsRequest({
            url: '/api/wishTypeList',
            method: 'POST',
            success: function (res) {
                console.log('当前', res);
                _this.setData({
                    lanternList: res
                });

                wx.setStorage({
                    key: "wishType",
                    data: {
                        lanternList: res
                    }
                });
            }
        });
    },
    toWriteWish: function (e) {
        var dataset = e.currentTarget.dataset;
        wx.navigateTo({
            url: '../writewish/writewish?wishTypeId=' + dataset.wishtypeid + '&wishImage=' + dataset.name + '&txt=' + encodeURI(dataset.txt)
        })
    }
});