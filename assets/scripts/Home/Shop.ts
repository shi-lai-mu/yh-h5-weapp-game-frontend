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
import State from '../utils/state';
import { ShopMenu, ShopItem } from '../interface/shop';

// var Item = cc.Class({
//     name: 'ShopMenuItem',
//     properties: {
//         id: 0,
//         itemName: '',
//         itemPrice: 0,
//         iconSF: cc.SpriteFrame
//     },
// });

const {ccclass, property} = cc._decorator;

@ccclass
export default class Activity extends cc.Component {

    /**
     * 主盒子内容
     */
    @property(cc.Node)
    mainContent: cc.Node = null;
    /**
     * 左侧内容盒子节点
     */
    @property(cc.Node)
    leftBoxContent: cc.Node = null;
    /**
     * 右侧内容盒子节点
     */
    @property(cc.Node)
    rightBoxContent: cc.Node = null;

    /**
     * prefab 资源
     */
    @property(cc.Prefab)
    ShopMenuListPrefab: cc.Prefab = null;

    /**
     * 当前菜单物品数据
     */
    shopItemData: ShopItem[] = [];



    start () {
        axios.api('shop_menu').then((data: ShopMenu[]) => {
            data.forEach((item, index) => {
                const prefab = cc.instantiate(this.ShopMenuListPrefab);
                const prefabScript = prefab.getComponent('emailActivityListItem');
                if (item.imgName) {
                    item.sprite = `https://perfergame.oss-cn-beijing.aliyuncs.com/text/shop/${ item.imgName }.png`;
                }
                item.title = item.name;
                prefab.y = (prefab.y - index * 40) - 200;
                this.leftBoxContent.addChild(prefab);
                prefabScript.init(item);
                prefabScript.clickEvent = () => new Promise(async (resolve, reject) => {

                    if (!item.content) {
                        console.log(123);
                        await axios.api('shop_menu_goods', {
                            params: {
                                menuId: item.id,
                            },
                        }).then((res) => {
                            console.log(res);
                            item.content = res;
                            resolve();
                        });
                        console.log(1023654);
                    }
                })

                // 默认点击第一个
                if (index === 0) {
                    prefabScript.onClick();
                }
            });
        });
    }
    

    /**
     * 邮件界面显示
     * @param Action - 是否显示动画
     */
    // activityPopupShow(Action: boolean = !0) {
    //     this.fetchactivityRequest();
    //     const { leftTopBox, maskBox } = this;
    //     maskBox.scale = 1;
    //     Action && leftTopBox.runAction(
    //         cc.moveBy(1, cc.v2(-leftTopBox.width, 0), 0).easing(cc.easeCubicActionOut()),
    //     );
    // }

    
    /**
     * 邮件界面隐藏
     * @param Action - 是否显示动画
     */
    // activityPopupHide(Action: boolean = !0) {
    //     const { leftTopBox, maskBox } = this;
    //     maskBox.scale = 0;
    //     Action && leftTopBox.runAction(
    //         cc.moveBy(0, cc.v2(leftTopBox.width, 0), 0).easing(cc.easeCubicActionOut()),
    //     );
    // }


    /**
     * 获取邮件消息
     */
    // fetchShopRequest() {
    //     !this.rendererOnly && axios.api('home_activity').then((data) => {
    //         this.activityData = data;
    //         data.forEach((item: ActivityItem, index: number) => {
    //             const newItem = cc.instantiate(this.activityListPrefab);
    //             this.activityListBox.addChild(newItem);
    //             const newComponent = newItem.getComponent('emailActivityListItem');
    //             newComponent.init(item);
    //             newComponent.ParentClass = this;
    //             newItem.y = (newItem.y - index * 40) - 200;
    //             this.activityListBox.height += 40;
    //             this.rendererOnly = !this.rendererOnly;
    //             if (index === 0) {
    //                 newComponent.onClick();
    //             }
    //         });
    //     });
    // }

    // update (dt) {}
}
