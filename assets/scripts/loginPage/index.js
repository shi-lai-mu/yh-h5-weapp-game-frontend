// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        LoginPopup: {
            default: null,
            type: cc.Node,
            tooltip: '登录弹窗节点',
            displayName: '弹窗节点',
        },
        LoginPopupMask: {
            default: null,
            type: cc.Node,
            tooltip: '登录弹窗遮罩层',
            displayName: '登录弹窗遮罩节点',
        },
        LoginPopupState: {
            default: !0,
            trpe: cc.Boolean,
            visible: false,
            tooltip: '当前登录弹窗状态',
        }
        

        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.LoginPopupMask.scale = 0;
    },


    /**
     * 登录按钮点击
     */
    onLoginClick() {
        this.LoginPopup.runAction(cc.fadeTo(0.3, 255));
        this.LoginPopupMask.runAction(cc.fadeTo(0.3, 200));
        this.LoginPopupMask.runAction(cc.scaleTo(0.1, 1).easing(cc.easeBackInOut()));
        this.LoginPopup.runAction(cc.scaleTo(0.4, 1).easing(cc.easeBackInOut()));
    },


    /**
     * 关闭登录按钮
     */
    onLoginClose() {
        this.LoginPopup.runAction(cc.fadeTo(255, 0));
        this.LoginPopup.runAction(cc.scaleTo(1, 0).easing(cc.easeBackInOut()));
        this.LoginPopupMask.scale = 0;
    }

    // update (dt) {},
});
