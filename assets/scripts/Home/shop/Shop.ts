// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import axios from '../../utils/axiosUtils';
import State from '../../utils/state';
import { ShopMenu, ShopItem } from '../../interface/shop';

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
     * prefab 资源
     */
    @property(cc.ScrollView)
    ScrollView: cc.ScrollView = null;

    // /**
    //  * 当前菜单物品数据
    //  */
    // shopItemData: ShopItem[] = [];
    /**
     * 菜单物品资源
     */
    @property(cc.Prefab)
    shopItemPrefab: cc.Prefab = null;
    /**
     * 物品资源数据
     */
    shopItemData: any = [];

    /**
     * 当前聚焦的物品
     */
    focusItem: any;
    /**
     * 商品名
     */
    @property(cc.Label)
    shopName: cc.Label = null;
    /**
     * 商品类型
     */
    @property(cc.Label)
    shopType: cc.Label = null;
    /**
     * 商品价格
     */
    @property(cc.Label)
    shopPrice: cc.Label = null;
    /**
     * 商品简介
     */
    @property(cc.Label)
    shopDesc: cc.Label = null;
    /**
     * 商品图标
     */
    @property(cc.Sprite)
    shopIcon: cc.Sprite = null;


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
                    this.ScrollView.scrollToTop();
                    if (!item.content) {
                        item.content = await axios.api('shop_menu_goods', {
                            params: {
                                menuId: item.id,
                            },
                        }).then((res) => res);
                    }
                    // 渲染
                    const res = item.content;
                    if (res instanceof Array) {
                        const {
                            mainContent,
                            shopItemData,
                            shopName,
                            shopType,
                            shopPrice,
                            shopDesc,
                            shopIcon,
                        } = this;
                        let offsetX = 0;
                        const col = mainContent.width > 600 ? 5 : 4;
                        res.forEach((item, index) => {
                            if (index % 5 === 0) {
                                offsetX = 0;
                            }
                            offsetX++;
                            if (shopItemData[index]) {
                                // 重复渲染时重新初始化
                                shopItemData[index].getComponent('shopItem').init(item);
                                shopItemData[index].scale = .573;
                            } else {
                                const shopItemPrefab = cc.instantiate(this.shopItemPrefab);
                                mainContent.addChild(shopItemPrefab);
                                const shopItemScript = shopItemPrefab.getComponent('shopItem')
                                shopItemScript.init(item);
                                shopItemPrefab.x = (mainContent.width / col) * offsetX - 80;
                                shopItemPrefab.y = -Math.round(index / col | 0) * 200 - 100;
                                shopItemData.push(shopItemPrefab);
                                // 商品点击事件
                                shopItemScript.clickEvent = (data) => {
                                    this.focusItem && this.focusItem.blur();
                                    shopItemScript.focus();
                                    this.focusItem = shopItemScript;
                                    shopName.string = data.name;
                                    shopType.string = '全部';
                                    shopPrice.string = data.price;
                                    shopDesc.string = data.desc;
                                    shopIcon.spriteFrame = shopItemScript.icon.spriteFrame; 
                                }
                            }
                        });

                        // 重渲染 多余数据隐藏
                        if (res.length < shopItemData.length) {
                            for (let i = res.length, len = shopItemData.length; i < len; i++) {
                                shopItemData[i].scale = 0;
                            }
                        }
                    }
                })

                // 默认点击第一个
                if (index === 0) {
                    prefabScript.onClick();
                }
            });
        });
    }
}
