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
  /**
   * 发光状态的icon资源
   * 1：熊
   * 2：狐狸
   * 3：老鼠
   * 4：青蛙
   * 5：鸟
   */
  @property(cc.SpriteFrame) iconsGon: cc.SpriteFrame[] = [];
  // 竖轴资源
  @property(cc.SpriteFrame) Hove: cc.SpriteFrame = null;
  // 横轴资源
  @property(cc.SpriteFrame) Vove: cc.SpriteFrame = null;
  // icon Sprite 节点
  @property(cc.Sprite) icon: cc.Sprite = null;
  // 块类型
  type: number = 0;


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
    this.type = opt.type;
    return {
      x,
      y,
      w: width,
      h: height,
      node: this.node,
      script: this,
    };
  }


  /**
   * 移动节点
   * @param offset   移动距离
   * @param duration 动画时间
   */
  move(
    offset: {
      x: number;
      y: number;
    },
    duration: number = .5,
  ) {
    const { width, height } = this.node;
    const x = offset.x < 0 ? 1 : -1;
    const y = offset.y < 0 ? 1 : -1;
    
    this.icon.node.runAction(
      cc.moveBy(
        duration,
        offset.x ? width * x : 0,
        offset.y ? height * y : 0,
      ).easing(cc.easeSineIn()),
    );
  }
}
