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
import { ActivityItem } from '../interface/home';

var Item = cc.Class({
    name: 'Item',
    properties: {
        id: 0,
        itemName: '',
        itemPrice: 0,
        iconSF: cc.SpriteFrame
    },
});

const {ccclass, property} = cc._decorator;

@ccclass
export default class Activity extends cc.Component {

    @property(cc.Node) maskBox: cc.Node = null;
    // 主盒子
    @property(cc.Node) mainBox: cc.Node = null;
    // 主盒子内容
    @property(cc.Label) mainContent: cc.Label = null;
    // 左侧盒子
    @property(cc.Node) leftTopBox: cc.Node = null;
    // 左侧内容盒子节点
    @property(cc.Node) activityListBox: cc.Node = null;
    // prefab 资源
    @property(cc.Prefab) activityListPrefab: cc.Prefab = null;
    // 活动数据
    @property(Item) activityData: typeof Item[] = [];
    // 只初始化一次
    @property({ visible: !1 }) rendererOnly: boolean = !1;


    start () {
        this.fetchactivityRequest();
        this.mainContent.string = '活动内容获取失败!';
    }
    
    
    /**
     * 活动界面隐藏
     */
    activityPopupHide() {
        this.node.destroy();
    }


    /**
     * 获取活动消息
     */
    fetchactivityRequest() {
        !this.rendererOnly && axios.api('home_activity').then((data) => {
            this.activityData = data;
            let lastItem = null;
            data.forEach((item: ActivityItem, index: number) => {
                const newItem = cc.instantiate(this.activityListPrefab);
                this.activityListBox.addChild(newItem);
                const newComponent = newItem.getComponent('ListItem');
                newComponent.init(item);
                newComponent.clickEvent = () => {
                    this.mainContent.string = item.html || '活动获取失败!';
                    lastItem && lastItem.blur();
                    lastItem = newComponent;
                };
                newComponent.ParentClass = this;
                newItem.y = (newItem.y - index * 50) - newItem.height;
                this.activityListBox.height += 40;
                this.rendererOnly = !this.rendererOnly;
                if (index === 0) {
                    newComponent.onClick();
                }
            });
        });
    }

    
    onDestroy() {
        // cc.loader.setAutoReleaseRecursively('ActivityPopupBox', true);
    }
}
