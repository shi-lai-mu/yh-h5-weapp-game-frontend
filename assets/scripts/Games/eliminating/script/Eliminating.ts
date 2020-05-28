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

    // 方格容器
    @property(cc.Node) blockBox: cc.Node = null;
    // 地图容器
    @property(cc.Node) mapBox: cc.Node = null;
    // 地图格资源
    @property(cc.Prefab) mapPrefab: cc.Prefab = null;
    // 方格资源
    @property(cc.Prefab) block: cc.Prefab = null;
    // 触摸位置存储
    touch = {
        x: -1,
        y: -1,
    };
    // 方格位置
    blocks = [];
    // 当前目标方格
    currentBlock: number = -1;
    // 横轴可放置点数
    // transverseCount = 4;
    // 地图
    map: any[] = [];

    start () {
        // 为方格容器添加触摸事件
        this.blockBox.on(cc.Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.blockBox.on(cc.Node.EventType.TOUCH_END, this.TOUCH_END, this);

        // 测试
        let index = 0;
        [
            [1,1,0,1,0,1,0],
            [0,0,0,0,1,0,1],
            [0,0,0,0,1,0,1],
        ].forEach((yItem, y) => {
            yItem.forEach((xItem, x) => {
                index++;
                this.createMap(index, x, y, xItem);
            })
        })
        console.log(this.blocks);
    }


    /**
     * 触摸开始
     */
    TOUCH_START(event) {
        const { touch } = this;
        const { target } = event;
        let { x, y } = event.touch._point;
        touch.x = x -= target.x;
        touch.y = y -= target.y;
        this.currentBlock = this.targetBlock(touch.x, touch.y);
    }


    /**
     * 触摸结束
     */
    TOUCH_END(event) {
        const { touch } = this;
        const { target } = event;
        let { x, y } = event.touch._point;
        x -= target.x;
        y -= target.y;

        // 移动方向参数计算
        const absX = Math.abs(touch.x - x);
        const absY = Math.abs(touch.y - y);
        const move: any = {
            x: absX > absY ? touch.x - x : 0,
            y: absY > absX ? touch.y - y : 0,
        };
        move.top = move.y < 0;
        move.bottom = move.y > 0;
        move.right = move.x < 0;
        move.left = move.x > 0;

        // 执行移动操作
        this.moveBlock(move);

    }


    /**
     * 是否允许移动
     */
    isAllowMove(moveInfo: { bottom: boolean; left: boolean; right: boolean; top: boolean; }) {

    }

    
    /**
     * 定位block资源
     * @param x x轴
     * @param y y轴
     */
    targetBlock(x: number, y: number) {
        const { blocks } = this;
        let target = -1;
        for (let i = 0, len = blocks.length; i < len; i++) {
            const currentBlock = blocks[i];
            if ((currentBlock.x < x && currentBlock.x + currentBlock.w > x) && (currentBlock.y > y && currentBlock.y - currentBlock.h < y)) {
                target = i;
                break;
            }
        }
        return target;
    }


    /**
     * 移动方块操作
     */
    moveBlock(moveInfo: { bottom: boolean; left: boolean; right: boolean; top: boolean; x: number; y: number; }) {
        if (this.currentBlock === -1) {
            return;
        }
        console.log(moveInfo);
        
        // 方向动作操作
        console.log(this.currentBlock);
        this.moveAnimation(this.blocks[this.currentBlock], moveInfo);
        this.currentBlock = -1;
    }


    /**
     * 移动动画
     * @param currentNode 被移动节点
     */
    moveAnimation(
        currentNode: { node: cc.Node; script: EliminatingBlock; w: number; h: number; x: number; y: number; },
        moveInfo?: any,
    ) {
        console.log(moveInfo);
        currentNode.script.move({
            x: moveInfo.x,
            y: moveInfo.y,
        })
    }


    /**
     * 创建地图
     * @param mapIndex  地图下标
     * @param x         X轴
     * @param y         Y轴
     * @param blockType 类型
     */
    createMap(mapIndex: number, x: number, y: number, blockType: number) {

        // 类型空则跳出
        if (typeof blockType !== 'number') {
            return false;
        }
        
        const { blocks } = this;

        // 存储数据
        if (!blocks[y]) {
            blocks[y] = [];
        }

        // 为0跳出
        if (blockType === 0) {
            blocks[y].push(null);
            return true;
        }

        // 顶部偏移值
        const offsetTop = 50;
        // 左侧偏移值
        const offsetLeft = 200;
        // 横轴偏移
        let h = 0;
        // 地图生成
        const mapInter = cc.instantiate(this.mapPrefab);
        const { width, height } = mapInter;
        
        mapInter.x += x * width + offsetLeft;
        mapInter.y -= y * height + offsetTop;
        this.mapBox.addChild(mapInter);

        // 动物生成
        const prefab = cc.instantiate(this.block);
        prefab.x = mapInter.x - (prefab.width / 2);
        prefab.y = mapInter.y + (prefab.height / 2);
        const prefabScript: EliminatingBlock = prefab.getComponent('EliminatingBlock');
        const blockInfo = prefabScript.init({
            type: 1,
        });
        
        blocks[y].push({
            x: mapInter.x - mapInter.width / 2,
            y: mapInter.y,
            w: mapInter.width,
            h: mapInter.height,
            script: blockInfo.script,
        });
        
        this.blockBox.addChild(prefab);
    }


    /**
     * 返回首页
     */
    backHome() {
        cc.director.loadScene('Home');
    }
}