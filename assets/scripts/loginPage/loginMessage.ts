// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginMessage extends cc.Component {
    // 标题
    @property(cc.Sprite) title: cc.Sprite = null;
    // 内容
    @property(cc.Label) content: cc.Label = null;
    // 内容容器节点 续修改此节点长度达到可滚动
    @property(cc.Node) contentBox: cc.Node = null;


    /**
     * 设置标题
     * @param spriteFrame 标题资源
     */
    setTitle(spriteFrame: cc.SpriteFrame) {
        this.title.spriteFrame = spriteFrame;
    }


    /**
     * 设置内容
     * @param content 文章内容
     */
    setContent(content: string) {
        this.content.string = content;
        setTimeout(() => this.contentBox.height = this.content.node.height / 2 + 70, 500)
    }


    close() {
        this.node.destroy();
    }
}
