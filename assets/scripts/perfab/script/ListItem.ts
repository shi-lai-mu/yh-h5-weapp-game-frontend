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
export default class EmailActivityListItem extends cc.Component {

    @property()
    id: number = 0;

    @property(cc.Label)
    itemPrice: cc.Label = null;
    
    @property(cc.SpriteFrame)
    itemTarget: cc.SpriteFrame = null;

    ParentClass: any = null;

    data: any = {};

    Sprite = null;

    /**
     * 点击触发的事件
     */
    clickEvent: any;


    /**
     * 点击事件
     */
    async onClick() {
        const { data, id, clickEvent } = this;
        clickEvent && await clickEvent(data, id);
        const { html, content } = data;
        if ((html || content) && typeof content === 'string') {
            this.ParentClass.mainContent.string = html || content;
        }
        const Sprite = this.node.getComponent(cc.Sprite);
        if (!this.Sprite) {
            this.Sprite = Sprite.spriteFrame;
        }
        Sprite.spriteFrame = this.itemTarget;
    }

    /**
     * 失焦
     */
    blur() {
        this.node.getComponent(cc.Sprite).spriteFrame = this.Sprite;
    }


    /**
     * 初始化数据
     * @param data  - 初始出具
     * @param index - 下标
     * @param auto  - 是否自适应
     */
    init(data: any, index: number, auto: boolean = !1) {
        const { id, title, sprite, scale } = data;

        if (auto) {
            // 大小适配
            const parentWidth = this.node.parent.width;
            this.node.width *= parentWidth / 140;
            this.node.height *= parentWidth / 140;
        }

        this.id = id;
        // 图片加载
        if (sprite) {
            typeof sprite === 'string' ? loadImg(sprite, this.setSprite.bind(this)) : this.setSprite(sprite, scale || .5);
        } else {
            this.itemPrice.string = title.length > 5 ? title.substr(0, 5) + '...' : title;
        }
        data.index = index;
        this.data = data;
    }


    /**
     * 创建精灵图
     */
    setSprite(SpriteFrame, scale: number = .5) {
        const node = new cc.Node();
        const Sprite = node.addComponent(cc.Sprite);
        Sprite.spriteFrame = SpriteFrame;
        node.scale = scale;
        this.node.addChild(node);
    }
    // update (dt) {}
}


/**
 * 加载图片
 * @param url      - 图片url
 * @param callback - 回调函数
 */
const loadImg = (url, callback) => {
    cc.loader.load(url, (_error, texture) => {
        _error && console.error(_error);
        callback(new cc.SpriteFrame(texture));
    });
}
