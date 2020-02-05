// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import axios from './utils/axiosUtils';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    maskBox: cc.Node = null;

    @property(cc.Node)
    mainBox: cc.Node = null;

    @property(cc.Node)
    leftTopBox: cc.Node = null;

    @property(cc.Node)
    leftBottomBox: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.emailPopupHide();
    }

    
    /**
     * 邮件界面显示
     */
    emailPopupShow() {
        this.fetchEmailRequest();
        const { leftTopBox, leftBottomBox, maskBox } = this;
        maskBox.scale = 1;
        leftTopBox.runAction(
            cc.moveBy(1, cc.v2(-leftTopBox.width, 0), 0).easing(cc.easeCubicActionOut()),
        );
        // 底部窗口弹出
        setTimeout(() => {
            leftBottomBox.scale = 1;
            leftBottomBox.runAction(
                cc.moveBy(0.5, cc.v2(0, -leftBottomBox.height), 0).easing(cc.easeCubicActionOut()),
            );
        }, 1000);
    }

    
    /**
     * 邮件界面隐藏
     */
    emailPopupHide() {
        const { leftTopBox, leftBottomBox, maskBox } = this;
        maskBox.scale = 0;
        leftBottomBox.scale = 0;
        leftTopBox.runAction(
            cc.moveBy(0, cc.v2(leftTopBox.width, 0), 0).easing(cc.easeCubicActionOut()),
        );
        leftBottomBox.runAction(
            cc.moveBy(0, cc.v2(0, leftBottomBox.height), 0).easing(cc.easeCubicActionOut()),
        );
    }


    /**
     * 获取邮件消息
     */
    fetchEmailRequest() {
        // axios.api('')
    }

    // update (dt) {}
}
