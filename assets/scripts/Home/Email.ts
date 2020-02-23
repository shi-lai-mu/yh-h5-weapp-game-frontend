// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import axios from '../utils/axiosUtils';

const {ccclass, property} = cc._decorator;

var Item = cc.Class({
    name: 'EmailItem',
    properties: {
        id: 0,
        itemName: '',
        itemPrice: 0,
        iconSF: cc.SpriteFrame
    },
});

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    maskBox: cc.Node = null;

    /**
     * 主盒子
     */
    @property(cc.Node)
    mainBox: cc.Node = null;

    /**
     * Item Prefab 资源
     */
    @property(cc.Prefab)
    listPrefab: cc.Prefab = null;

    /**
     * 左上角盒子
     */
    @property(cc.Node)
    leftTopContent: cc.Node = null;

    /**
     * 主盒子内容
     */
    @property(cc.Label)
    mainContent: cc.Label = null;

    /**
     * 左侧盒子
     */
    @property(cc.Node)
    leftTopBox: cc.Node = null;

    /**
     * 左下角盒子
     */
    @property(cc.Node)
    leftBottomBox: cc.Node = null;

    /**
     * 活动数据
     */
    @property(Item)
    emailData: typeof Item[] = [];


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.fetchEmailRequest();
    }
    
    /**
     * 邮件界面显示
     */
    emailPopupShow() {
        this.fetchEmailRequest();
        const { leftTopBox, leftBottomBox, maskBox } = this;
        maskBox.scale = 1;
        leftTopBox.runAction(
            cc.moveBy(.5, cc.v2(-leftTopBox.width, 0)).easing(cc.easeCubicActionOut()),
        );
        // 底部窗口弹出
        setTimeout(() => {
            leftBottomBox.scale = 1;
            // leftBottomBox.runAction(
            //     cc.moveBy(0.5, cc.v2(0, -leftBottomBox.height), 0).easing(cc.easeCubicActionOut()),
            // );
        }, 700);
    }

    
    /**
     * 邮件界面隐藏
     */
    emailPopupHide() {
        this.node.destroy();
        // const { leftTopBox, leftBottomBox, maskBox } = this;
        // maskBox.scale = 0;
        // leftBottomBox.scale = 0;
        // leftTopBox.runAction(
        //     cc.moveBy(0, cc.v2(leftTopBox.width, 0)).easing(cc.easeCubicActionOut()),
        // );
        // leftBottomBox.runAction(
        //     cc.moveBy(0, cc.v2(0, leftBottomBox.height)).easing(cc.easeCubicActionOut()),
        // );
    }


    /**
     * 获取邮件消息
     */
    fetchEmailRequest() {
        axios.api('home_email').then((data) => {
            this.emailData = data;
            data.forEach((item: any, index: number) => {
                const newItem = cc.instantiate(this.listPrefab);
                this.leftTopContent.addChild(newItem);
                const newComponent = newItem.getComponent('emailActivityListItem');
                if (item.template) {
                    item = {
                        ...item,
                        ...item.template,
                    }
                }
                newComponent.init(item);
                newComponent.clickEvent = () => new Promise((resolve, reject) => {
                    if (!item.is_receive) {
                        axios.api('email_content', {
                            params: {
                                emailId: item.id,
                            },
                        }).then((res) => {
                            item.content = res.content;
                            resolve();
                        });
                    }
                });
                newComponent.ParentClass = this;
                newItem.y = (newItem.y - index * 40) - 200;
                this.leftTopContent.height += 40;
                if (index === 0) {
                    newComponent.onClick();
                }
            });
        });
    }

    // update (dt) {}
}
