const app = getApp();
Page({
    data: {
        wishName: '',
        author: '',
        shareImgUrl: '',
        wishCount: '',
        content: '',
        wishId: '',
        userInfoId: '',
        isCanvasShow: false,
        painting: {},
        shareImage: ''
    },
    onLoad: function (option) {
        console.log(option)
        var _this = this;
        this.setData({
            wishId: option.wishId,
            userInfoId: option.userInfoId || app.globalData.userInfoId
        });
        wx.showLoading({
            title: '加载中...',
        });
        app.httpsRequest({
            url: '/api/wishShare',
            param: {
                wishId: this.data.wishId,
                userInfoId: this.data.userInfoId
                // wishId: '04466dc8e45c49cba586815249c25df2',
                // userInfoId: '6dffd95d16e3482aad5a4d200e0fb0cf'
            },
            method: 'POST',
            success: function (res) {
                wx.hideLoading();
                console.log('当前', res);
                _this.setData({
                    wishName: res.wishName,
                    shareImgUrl: res.shareImgUrl,
                    wishCount: res.wishCount,
                    author: '——' + res.adviceWord.author,
                    content: res.adviceWord.content,
                    adviceImg: res.adviceWord.adviceImg,

                });
                // _this.longTap(res.adviceWord.adviceImg, res.shareImgUrl, res.wishCount);
            },
            fail: function (res) {
                console.log(res)
            }
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {

        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            // title: '',
            path: '/pages/share/share?wishId=' + this.data.wishId + '&userInfoId=' + this.data.userInfoId,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    // 
    eventDraw: function () {
        var _this = this;
        wx.showLoading({
            title: '加载中...',
        });

        this.setData({
            painting: {
                width: 375,
                height: 555,
                clear: true,
                views: [{
                        type: 'image',
                        url: _this.data.adviceImg,
                        top: 0,
                        left: 0,
                        width: 375,
                        height: 555
                    },
                    {
                        type: 'image',
                        url: _this.data.shareImgUrl,
                        top: 400,
                        left: 160,
                        width: 68,
                        height: 68,
                        borderRadius: 50
                    },
                    {
                        type: 'image',
                        url: 'https://www.photocar.cn/files/advice_img/WechatIMG1691.png',
                        top: 400,
                        left: 160,
                        width: 68,
                        height: 68,
                    },
                    {
                        type: 'text',
                        content: '您已点亮星球第' + this.data.wishCount + '盏灯',
                        fontSize: 14,
                        color: '#fff',
                        textAlign: 'center',
                        top: 490,
                        left: 190,
                        lineHeight: 20,
                        width: 375,
                        height: 555
                    }
                ]
            }
        })
    },
    eventGetImage: function (event) {
        console.log(event)
        const {
            tempFilePath,
            errMsg
        } = event.detail
        if (errMsg === 'canvasdrawer:ok') {
            this.setData({
                shareImage: tempFilePath
            })
            this.eventSave();
        }
    },
    eventSave: function () {
        wx.hideLoading();
        console.log(this.data.shareImage)
        // wx.previewImage({
        //     current: [this.data.shareImage],
        //     urls: [this.data.shareImage]
        // })
        wx.saveImageToPhotosAlbum({
            filePath: this.data.shareImage,
            success(res) {
                wx.showToast({
                    title: '保存图片成功',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },
});