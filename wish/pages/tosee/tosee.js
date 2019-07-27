const app = getApp();
Page({
    data: {
        id: '', //当前详情id
        wishId: '', //当前详细页的 对应的wishId
        userInfoId: '', //userid
        wishTypeId: '', //心愿类型id
        wishImage: 'tabhua', // 拼音
        templateId: '', //模板类型
        wishIntroduce: '', //模板
        avatarUrl: '', //头像
        nickname: '',
        content: '', //介绍
        spotList: [],
        spotCount: 0,
        spotFlag: 0, ////点赞状态   0 未点赞 1已经点赞
        createTime: '',
    },
    onLoad: function (option) {
        this.setData({
            wishId: option.id,
            userInfoId: option.userInfoId
        });
        this.getDetail();
    },
    getDetail: function () {
        var _this = this;
        app.httpsRequest({
            url: '/api/wishDetail',
            param: {
                wishId: this.data.wishId,
                userInfoId: app.globalData.userInfoId
            },
            method: 'POST',
            success: function (res) {
                console.log('当前', res);
                _this.setData({
                    userInfoId: res.userInfoId,
                    wishTypeId: res.wishTypeId, //图片id
                    wishImage: res.wishImage, // 图片拼音
                    templateId: res.templateId,
                    wishIntroduce: res.wishIntroduce,
                    avatarUrl: res.avatarUrl,
                    nickname: res.nickname,
                    content: res.content,
                    spotList: res.spotList,
                    spotCount: res.spotCount,
                    spotFlag: res.spotFlag, //点赞状态   0 未点赞 1已经点赞

                    createTime: res.createTime
                });
            },
            fail: function (res) {
                console.log(res)
            }
        });
    },
    giveStart: function () {
        var _this = this;
        app.httpsRequest({
            url: '/api/spotWish',
            param: {
                wishId: this.data.wishId,
                userInfoId: app.globalData.userInfoId
            },
            method: 'POST',
            success: function (res) {
                wx.showToast({
                    title: '点赞成功',
                    duration: 1000
                });
                _this.getDetail();
            },
            fail: function (res) {
                console.log(res)
            }
        });
    },
    hadStart: function () {
        wx.showToast({
            title: '已点赞',
            duration: 1000
        });
    },
    switchWish: function (e) {
        var _this = this;
        app.httpsRequest({
            url: '/api/wishDetailRandom',
            param: {
                createTime: this.data.createTime,
                wishId: this.data.wishId,
                userInfoId: app.globalData.userInfoId,
                type: e.currentTarget.dataset.type
            },
            method: 'POST',
            success: function (res) {
                console.log('当前', res);
                _this.setData({
                    userInfoId: res.userInfoId,
                    wishTypeId: res.wishTypeId, //图片id
                    wishImage: res.wishImage, // 图片拼音
                    templateId: res.templateId,
                    wishIntroduce: res.wishIntroduce,
                    avatarUrl: res.avatarUrl,
                    nickname: res.nickname,
                    content: res.content,
                    spotList: res.spotList,
                    spotCount: res.spotCount,
                    spotFlag: res.spotFlag, //点赞状态   0 未点赞 1已经点赞

                    wishId: res.id,

                    createTime: res.createTime
                });
            },
            fail: function (res) {
                console.log(res)
            }
        });
    },
    lightWish: function () {
        wx.navigateTo({
            url: '../selectype/selectype'
        })
    }
});