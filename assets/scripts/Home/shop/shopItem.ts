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

@ccclass
export default class ShopListItem extends cc.Component {

    /**
     * 物品名
     */
    @property(cc.Sprite)
    Name: cc.Sprite = null;

    /**
     * 价格
     */
    @property(cc.Label)
    Price: cc.Label = null;

    /**
     * 图标
     */
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    /**
     * 焦点样式
     */
    @property(cc.Sprite)
    focusSprite: cc.Sprite = null;


    init(data: any) {
       console.log(data);
       this.Price.string = data.price;
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
    onClick() {

    }

    // update (dt) {}
}
