// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EliminatingBlock from './script/EliminatingBlock';
const {ccclass, property} = cc._decorator;
/**
 * 消消乐游戏场景类
 */
@ccclass
export default class Eliminating extends cc.Component {

    // 方格资源
    @property(cc.Prefab) block: cc.Prefab = null;
    // 方格容器
    @property(cc.Node) blockBox: cc.Node = null;
    // 触摸位置存储
    touch = {
        x: -1,
        y: -1,
    };
    // 方格位置
    blocks = [];
    // 当前目标方格
    currentBlock: number = -1;


    start () {
        // 为方格容器添加触摸事件
        this.blockBox.on(cc.Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.blockBox.on(cc.Node.EventType.TOUCH_END, this.TOUCH_END, this);

        // 测试
        for (let i = 0; i < 10; i++) {
            const prefab = cc.instantiate(this.block);
            prefab.x += i * prefab.width + 200 ;
            const prefabScript: EliminatingBlock = prefab.getComponent('EliminatingBlock');
            const blockInfo = prefabScript.init({
                type: 1,
            });
            this.blocks.push(blockInfo);
            this.blockBox.addChild(prefab);
        }
        console.log(this.blocks);
    }


    /**
     * 触摸开始
     */
    TOUCH_START(event) {
        const { blocks, touch } = this;
        const { target } = event;
        let { x, y } = event.touch._point;
        touch.x = x -= target.x;
        touch.y = y -= target.y;
        
        for (let i = 0, len = blocks.length; i < len; i++) {
            const currentBlock = blocks[i];
            if ((currentBlock.x < touch.x && currentBlock.x + currentBlock.w > touch.x) && (currentBlock.y > touch.y && currentBlock.y - currentBlock.h < touch.y)) {
                this.currentBlock = i;
                break;
            }
        }
    }


    /**
     * 触摸结束
     */
    TOUCH_END(event) {
        const { blocks, touch } = this;
        const { target } = event;
        let { x, y } = event.touch._point;
        x -= target.x;
        y -= target.y;

        // 移动方向参数计算
        const absX = Math.abs(touch.x - x);
        const absY = Math.abs(touch.y - y);
        const move = {
            x: absX > absY ? touch.x - x : 0,
            y: absY > absX ? touch.y - y : 0,
        };
        move.top = move.y < 0;
        move.bottom = move.y > 0;
        move.right = move.x < 0;
        move.left = move.x > 0;

        console.log(move);
    }


    /**
     * 返回首页
     */
    backHome() {
        cc.director.loadScene('Home');
    }
}
