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
// import State from '../../utils/state';
import { ShopMenu, ShopItem } from '../../interface/shop';
import scriptPopup from '../../perfab/script/popup';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Activity extends cc.Component {
    // 主盒子内容
    @property(cc.Node) mainContent: cc.Node = null;
    // 商品名
    @property(cc.Label) shopName: cc.Label = null;
    // 商品类型
    @property(cc.Label) shopType: cc.Label = null;
    // 商品价格
    @property(cc.Label) shopPrice: cc.Label = null;
    // 商品简介
    @property(cc.Label) shopDesc: cc.Label = null;
    // 商品图标
    @property(cc.Sprite) shopIcon: cc.Sprite = null;
    // 左侧内容盒子节点
    @property(cc.Node) leftBoxContent: cc.Node = null;
    // 内容可滚动区域
    @property(cc.ScrollView) ScrollView: cc.ScrollView = null;
    // 商城菜单列表prefab 资源
    @property(cc.Prefab) ShopMenuListPrefab: cc.Prefab = null;
    // 菜单物品资源
    @property(cc.Prefab) shopItemPrefab: cc.Prefab = null;
    // 弹窗资源
    @property(cc.Prefab) popup: cc.Prefab = null
    // 没有商品字样
    @property(cc.Node) notGoods: cc.Node = null;

    // 物品数据
    shopItemData: cc.Node[] = [];
    defaultTarget: string = '';

    init(option: { index: string; }) {
        this.defaultTarget = option.index;
    }


    start() {
        this.notGoods.active = false;
        axios.api('shop_menu').then((data: ShopMenu[]) => {
            // 当前左侧列表目标
            let targetItem = null;
            // 当前聚焦的物品
            let focusItem = null;
            data.forEach((item, index) => {
                const prefab = cc.instantiate(this.ShopMenuListPrefab);
                console.log(item);
                const prefabScript = prefab.getComponent('ListItem');
                if (item.imgName) {
                    item.sprite = `https://perfergame.oss-cn-beijing.aliyuncs.com/text/shop/${ item.imgName }.png`;
                }
                item.title = item.name;
                prefab.y = (prefab.y - index * 40) - 200;
                this.leftBoxContent.addChild(prefab);
                prefabScript.init(item, index, !0);
                // 左侧列表的点击事件处理
                prefabScript.clickEvent = () => new Promise(async (resolve, reject) => {
                    console.log(123451326);
                    this.ScrollView.scrollToTop();
                    if (!item.content) {
                        item.content = await axios.api('shop_menu_goods', {
                            params: {
                                menuId: item.id,
                            },
                        }).then((res) => res);
                    }
                    resolve(item);
                    if (targetItem) targetItem.blur();
                    targetItem = prefabScript;
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
                                shopItemData[index].active = true;
                            } else {
                                const shopItemPrefab = cc.instantiate(this.shopItemPrefab);
                                mainContent.addChild(shopItemPrefab);
                                const shopItemScript = shopItemPrefab.getComponent('shopItem')
                                shopItemScript.init(item);
                                shopItemPrefab.x = (mainContent.width / col) * offsetX - 80;
                                shopItemPrefab.y = -Math.round(index / col | 0) * 200 - 100;
                                shopItemData.push(shopItemPrefab);
                                shopItemScript.parentClass = this;
                                // 商品点击事件
                                shopItemScript.clickEvent = (data) => {
                                    focusItem && focusItem.blur();
                                    shopItemScript.focus();
                                    focusItem = shopItemScript;
                                    shopName.string = data.name;
                                    shopType.string = '全部';
                                    shopPrice.string = data.price;
                                    shopDesc.string = data.desc;
                                    shopIcon.spriteFrame = shopItemScript.icon.spriteFrame; 
                                }
                            }
                            // 点击第一个
                            if (index === 0) {
                                shopItemData[0] && shopItemData[0].getComponent('shopItem').onClick();
                            }
                        });

                        // 重渲染 多余数据隐藏
                        if (res.length < shopItemData.length) {
                            for (let i = res.length, len = shopItemData.length; i < len; i++) {
                                shopItemData[i].active = false;
                            }
                        }

                        this.notGoods.active = !res.length ? true : false;
                    }
                })

                // 默认点击第一个
                if (this.defaultTarget) {
                    if (this.defaultTarget == item.name) prefabScript.onClick();
                } else if (index === 0) prefabScript.onClick();
            });
        });
    }


    /**
     * 购买商品时
     * @param goodsData - 商品数据
     */
    buyGoods(goodsData) {
        console.log(goodsData);
        const popup = cc.instantiate(this.popup);
        const scriptPopup: scriptPopup = popup.getComponent('popup');
        this.node.parent.addChild(popup);
        
        scriptPopup.init(`将使用 ${goodsData.price + goodsData.bay_currency_name} 购买,\n[ ${goodsData.name} ]\n是否确定?`);
        scriptPopup.setEvent('success', () => {
            scriptPopup.message('支付中...');
            scriptPopup.setEvent('success', null);
            scriptPopup.setEvent('close', null);
            axios
                .api('shop_buy', {
                    params: {
                        goodsId: goodsData.id,
                    },
                })
                .then((query) => {
                    if(query.status) {
                        scriptPopup.message(`支付成功!获得\n[ ${goodsData.name} ]`);
                    } else {
                        scriptPopup.message('支付失败!\n' + query.msg);
                    }
                    scriptPopup.setEvent('success', () => {
                        popup.destroy();
                    });
                    scriptPopup.setEvent('close', () => {});
                })
                .catch(() => {
                    scriptPopup.message('支付时发生错误!\n请稍后再试...');
                    scriptPopup.setEvent('close', () => {});
                })
            ;
        });
        scriptPopup.setEvent('close', () => {});
    }


    close() {
        this.node.destroy();
    }
}
