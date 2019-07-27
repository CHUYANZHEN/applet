const app = getApp();
Page({
    data: {
        scrolls: [{
            id: "13213",
            content: "#新的一年健健康康……#"
        }],
        wishTypeId: "", //心愿类型id
        wishImage: "taohua",
        wishIntroduce: "", //心愿类型 内容

        activeTab: "0",
        isHer: false,
        textHer: "",
        textArea: "",
        templateId: "", //选中模板id
        templateTxt: "", //选中模板内容
        typeTab: "0",
        headImg: "", //
        lanternList: []
    },
    onLoad: function (options) {
        var _this = this;
        _this.setData({
            wishTypeId: options.wishTypeId,
            wishImage: options.wishImage,
            wishIntroduce: decodeURI(options.txt),
            headImg: app.globalData.userInfo.avatarUrl
        });
        wx.getStorage({
            key: "wishType",
            success(res) {
                _this.setData({
                    wishTypeId: options.wishTypeId,
                    lanternList: res.data.lanternList
                });
            }
        });
        this.getTemplateList();
    },
    getTemplateList: function () {
        var _this = this;
        app.httpsRequest({
            url: "/api/templateList",
            param: {
                wishTypeId: this.data.wishTypeId
            },
            method: "POST",
            success: function (res) {
                console.log("当前", res);
                _this.setData({
                    scrolls: res
                });
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    // 选择标签
    selectTag: function (e) {
        var templateId = e.currentTarget.dataset.id;
        var content = e.currentTarget.dataset.content;
        this.setData({
            textArea: content,
            templateId: templateId,
            templateTxt: content
        });
    },
    // tab 切换
    tabSwitch: function (e) {
        var type = e.currentTarget.dataset.type;
        var isHer = false;
        if (type == "1") {
            isHer = true;
        } else {
            isHer = false;
        }
        this.setData({
            activeTab: type,
            isHer: isHer
        });
    },
    // 方式切换
    typeTab: function (e) {
        var type = e.currentTarget.dataset.type;
        this.setData({
            typeTab: type
        });
    },
    //
    switchType: function (e) {
        var swi = e.currentTarget.dataset.switch;
        var idArray = [];
        this.data.lanternList.forEach(function (item, index) {
            idArray.push(item.id);
        });
        var idx = idArray.indexOf(this.data.wishTypeId);
        var selectId = "";
        if (swi == "-1") {
            //上一个
            if (idx <= 0) {
                selectId = 11;
            } else {
                selectId = idx - 1;
            }
        } else {
            if (idx >= 11) {
                selectId = 0;
            } else {
                selectId = idx + 1;
            }
        }
        this.setData({
            wishTypeId: this.data.lanternList[selectId].id,
            wishImage: this.data.lanternList[selectId].wishImage,
            wishIntroduce: this.data.lanternList[selectId].wishIntroduce
        });
        this.getTemplateList();
    },

    //
    inputHer: function (e) {
        this.setData({
            textHer: e.detail.value
        });
    },
    textArea: function (e) {
        this.setData({
            textArea: e.detail.value
        });
    },
    //
    toPayWish: function () {
        var _this = this;
        var flag = false;
        if (_this.data.activeTab == "1") {
            if (
                this.data.textHer.trim() != "" &&
                this.data.textArea.trim() != ""
            ) {
                flag = true;
            }
        } else {
            if (this.data.textArea.trim() != "") flag = true;
        }
        if (flag) {
            _this.toSaveWish();
        } else {
            wx.showToast({
                title: "请填写相关信息",
                duration: 1000
            });
        }
    },
    // 保存
    toSaveWish: function () {
        var _this = this;
        app.httpsRequest({
            url: "/api/wish",
            param: {
                userInfoId: app.globalData.userInfoId,
                wishTypeId: this.data.wishTypeId,
                templateId: this.data.templateId,
                content: this.data.textArea,
                wishToName: this.data.textHer, //toWho
                wishToType: this.data.activeTab, //许愿类型 0 为自己 1 为朋友 3 为微信群
                openType: this.data.typeTab //0 公开 1 匿名
            },
            method: "POST",
            success: function (res) {
                console.log("当前", res);
                wx.setStorage({
                    key: "paywish",
                    data: {
                        wishId: res.wish.id,
                        wishImage: _this.data.wishImage,
                        avatarUrl: app.globalData.userInfo.avatarUrl,
                        nickName: app.globalData.userInfo.nickName,
                        templateId: res.wish.templateId,
                        templateTxt: _this.data.templateTxt,
                        content: res.wish.content,
                        price: res.wish.price / 100,
                        wishToName: res.wish.wishToName,
                        activeTab: _this.data.activeTab
                    }
                });

                wx.navigateTo({
                    url: "../pay/pay"
                });
            },
            fail: function (res) {
                console.log(res);
            }
        });
    }
});