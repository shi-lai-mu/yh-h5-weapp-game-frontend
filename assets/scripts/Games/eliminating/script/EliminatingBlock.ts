// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class EliminatingBlock extends cc.Component {
  /**
   * icon资源类型
   * 1：熊
   * 2：狐狸
   * 3：老鼠
   * 4：青蛙
   * 5：鸟
   */
  @property(cc.SpriteFrame) icons: cc.SpriteFrame[] = [];
  // icon Sprite 节点
  @property(cc.Sprite) icon: cc.Sprite = null;

  /**
   * 初始化入口
   */
  init(opt: {
    /**
     * icon类型
     */
    type: number;
  }) {
    this.icon.spriteFrame = this.icons[opt.type];
    const { node } = this;
    const { x, y, width, height } = node;
    return {
      x,
      y,
      w: width,
      h: height,
    };
  }
}
