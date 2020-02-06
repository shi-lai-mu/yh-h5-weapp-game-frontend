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
import State from './utils/state';
import { ActivityItem } from './interface/home';

var Item = cc.Class({
    name: 'Item',
    properties: {
        id: 0,
        itemName: '',
        itemPrice: 0,
        iconSF: cc.SpriteFrame
    }
});

const {ccclass, property} = cc._decorator;

@ccclass
export default class Activity extends cc.Component {

    @property(cc.Node)
    maskBox: cc.Node = null;

    /**
     * 主盒子
     */
    @property(cc.Node)
    mainBox: cc.Node = null;

    /**
     * 左侧盒子
     */
    @property(cc.Node)
    leftTopBox: cc.Node = null;

    /**
     * 左侧内容盒子节点
     */
    @property(cc.Node)
    activityListBox: cc.Node = null;

    /**
     * prefab 资源
     */
    @property(cc.Prefab)
    activityListPrefab: cc.Prefab = null;

    /**
     * 活动数据
     */
    @property(Item)
    activityData: typeof Item[] = [];

    show () {
        this.activityPopupHide();
        this.activityPopupShow();
    }
    
    /**
     * 邮件界面显示
     * @param Action - 是否显示动画
     */
    activityPopupShow(Action: boolean = !0) {
        this.fetchactivityRequest();
        const { leftTopBox, maskBox } = this;
        maskBox.scale = 1;
        Action && leftTopBox.runAction(
            cc.moveBy(1, cc.v2(-leftTopBox.width, 0), 0).easing(cc.easeCubicActionOut()),
        );
    }

    
    /**
     * 邮件界面隐藏
     * @param Action - 是否显示动画
     */
    activityPopupHide(Action: boolean = !0) {
        const { leftTopBox, maskBox } = this;
        maskBox.scale = 0;
        Action && leftTopBox.runAction(
            cc.moveBy(0, cc.v2(leftTopBox.width, 0), 0).easing(cc.easeCubicActionOut()),
        );
    }


    /**
     * 获取邮件消息
     */
    fetchactivityRequest() {
        axios.api('home_activity').then((data) => {
            this.activityData = data;
            data.forEach((item: ActivityItem, index: number) => {
                const newItem = cc.instantiate(this.activityListPrefab);
                this.activityListBox.addChild(newItem);
                newItem.getComponent('emailActivityListItem').init(item);
                newItem.y = newItem.y - index * 35;
            });
        });
    }

    // update (dt) {}
}
