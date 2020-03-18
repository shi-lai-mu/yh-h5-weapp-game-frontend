// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { url, loadImg } from '../../utils/tool';
import parentClass from './Shop';

@ccclass
export default class ShopListItem extends cc.Component {
    // 物品名
    @property(cc.Sprite) Name: cc.Sprite = null;
    // 价格
    @property(cc.Label) Price: cc.Label = null;
    // 图标
    @property(cc.Sprite) icon: cc.Sprite = null;
    // 焦点样式
    @property(cc.Sprite) focusSprite: cc.Sprite = null;


    // 点击触发的事件
    clickEvent: any;
    data: any;
    parentClass: parentClass;


    /**
     * 初始化
     * @param data - 数据
     */
    init(opaction: { price: number; icon: string }) {
        this.Price.string = opaction.price.toString();
        this.data = opaction;
       
        loadImg(`${url}/text/shop/${opaction.icon}-text.png`, (spriteFrame) => {
            this.Name.spriteFrame = spriteFrame;
        });
        
        loadImg(`${url}/H5Game/shop/${opaction.icon}.png`, (spriteFrame) => {
            this.icon.spriteFrame = spriteFrame;
        });
    }
    

    /**
     * 获得焦点
     */
    focus() {
        this.focusSprite.node.opacity = 255;
    }
    

    /**
     * 失去焦点
     */
    blur() {
        this.focusSprite.node.opacity = 0;
    }


    /**
     * 点击事件
     */
    async onClick() {
        const { data, clickEvent } = this;
        clickEvent && await clickEvent(data);
    }


    /**
     * 点击购买
     */
    buy() {
        this.parentClass.buyGoods(this.data);
    }
}
