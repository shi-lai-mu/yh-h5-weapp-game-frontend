// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Service from './Service';
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
  blockType: number = 0;
  // 轴体节点
  oveNode: cc.Node;
  // 资源下标
  setFrameType: number = 0;
  // 块类型
  get type() {
    return this.node ? this.blockType : -1;
  }
  set type(type: number) {
    this.blockType = type - 1;
  }


  /**
   * 初始化入口
   */
  init(opt: {
    /**
     * icon类型
     */
    type: number;
  }) {
    const { node } = this;
    const { x, y, width, height } = node;
    this.type = opt.type;
    this.icon.spriteFrame = this.icons[opt.type - 1];
    this.setFrameType = opt.type - 1;
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
   * 设置方块贴图
   * @param num 类型
   */
  setFrame(num?: number) {
    if (num === undefined) num = Service.randomNumber(Service.MAX - 1, Service.MIN, this.type);
    this.icon.spriteFrame = this.icons[num];
    this.setFrameType = num;
  }


  /**
   * 移动节点
   * @param offset   移动距离
   * @param duration 动画时间
   */
  async move(
    offset: {
      x: number;
      y: number;
    },
    duration: number = .5,
    callbackFn?: any,
  ) {
    const { node, icon } = this;
    if (node && icon.node) {
      // const { width, height } = node;
      // const x = offset.x < 0 ? 1 : -1;
      // const y = offset.y < 0 ? 1 : -1;
      return new Promise((res, rej) => {
        icon.node.runAction(
          cc.sequence(
            cc.moveBy(
              duration,
              -offset.x,
              -offset.y,
              // offset.x ? width * x : 0,
              // offset.y ? height * y : 0,
            ).easing(cc.easeSineIn()),
            cc.callFunc(() => res(callbackFn ? callbackFn() : {})),
          ),
        );
      })
    }
  }


  /**
   * 发光方法
   * @param toggle 是否发光
   */
  toggleLuminescence(toggle: boolean) {
    this.icon.spriteFrame = this[toggle ? 'iconsGon' : 'icons'][this.blockType];
  }


  /**
   * 显示横轴或竖轴
   * @param ovrType
   * - false: 关闭显示
   * - h: 竖轴
   * - v: 横轴
   */
  toggleOve(ovrType: false | string) {
    const node = new cc.Node();
    const sprite = node.addComponent(cc.Sprite);
    if (this.oveNode) {
      this.oveNode.destroy();
    }
    if (typeof ovrType === 'string') {
      sprite.spriteFrame = ovrType === 'h' ? this.Hove : this.Vove;
      this.icon.node.addChild(node);
      this.oveNode = node;
      // this.node.addChild(node);
      // node.height = this.node.height;
      // node.y -= node.height / 2;
      // node.x += this.node.width / 2;
    }
  }
}
