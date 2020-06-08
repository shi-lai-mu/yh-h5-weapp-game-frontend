// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EliminatingBlock from './EliminatingBlock';
import Service from './Service';
import EliminatingInterface from '../../../interface/game/eliminating';
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
    blocks: EliminatingInterface.Block[][] = [];
    // 当前目标方格
    currentBlock: string = '';
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
        Service.randomCreate(5, 11).forEach((yItem, y) => {
            yItem.forEach((xItem, x) => this.createMap(++index, x, y, xItem))
        });
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
        console.log(move);
        

        // 执行移动操作
        const { targetBlock } = this.isAllowMove({
            ...move,
            top: move.y < 0,
            bottom: move.y > 0,
            right: move.x < 0,
            left: move.x > 0,
        });
        if (targetBlock) {
            const prevBlock = this.currentBlock.split('-');
            const nextBlock = targetBlock.index.split('-');
            const [ prevY, prevX ] = prevBlock;
            const [nextY, nextX ] = nextBlock;
            const prev = this.blocks[prevY][prevX];
            this.exchangeBlock(prev, targetBlock);
            // 三连消除检测
            setTimeout(() => {
                const p1Query = this.eliminateCheck(Number(nextY), Number(nextX));
                this.eliminateCheck(Number(prevY), Number(prevX));
                if (!p1Query) {
                    this.exchangeBlock(targetBlock, prev);
                }
            }, 500);
        }
    }

    
    /**
     * 互换方块
     * @param Point1 方块1
     * @param Point2 方块2
     */
    exchangeBlock(Point1: EliminatingInterface.Block, Point2: EliminatingInterface.Block) {
        const absX = Math.abs(Point1.x - Point2.x);
        const absY = Math.abs(Point1.y - Point2.y);
        
        const move: any = {
            x: Point1.x - Point2.x,
            y: Point1.y - Point2.y,
        };
        
        this.moveAnimation(Point1, move);
        // 移动方向的方块反向移动
        this.moveAnimation(Point2, move, true);
        // 反向互换方块脚本
        const Point1Script = Point1.script;
        Point1.script = Point2.script;
        Point2.script = Point1Script;
    }


    /**
     * 是否允许指定方向移动
     */
    isAllowMove(moveInfo: EliminatingInterface.MoveBoolean): {
        targetBlock: false | EliminatingInterface.Block;
    } {
        const { currentBlock } = this;
        const { blocks } = this;
        let targetBlock: false | EliminatingInterface.Block = false;

        if (!currentBlock) {
            console.warn(currentBlock);
            return { targetBlock };
        }

        const point = currentBlock.split('-');
        const y = Number(point[0]);
        const x = Number(point[1]);
        const { top, right, bottom, left } = moveInfo;

        // 顶部检测
        if (top && blocks[y - 1] && blocks[y - 1][x]) {
            targetBlock = blocks[y - 1][x];
        }
        // 右侧检测
        if (right && blocks[y] && blocks[y][x + 1]) {
            targetBlock = blocks[y][x + 1];
        }
        // 底部检测
        if (bottom && blocks[y + 1] && blocks[y + 1][x]) {
            targetBlock = blocks[y + 1][x];
        }
        // 左侧检测
        if (left && blocks[y] && blocks[y][x - 1]) {
            targetBlock = blocks[y][x - 1];
        }

        return {
            targetBlock,
        };
    }

    
    /**
     * 定位block资源
     * @param x x轴
     * @param y y轴
     */
    targetBlock(x: number, y: number) {
        const { blocks } = this;
        let target = '';
        for (let i = 0, len = blocks.length; i < len; i++) {
            const currentBlock = blocks[i];
            for (const block of currentBlock) {
                if (block) {
                    if ((block.x < x && block.x + block.w > x) && (block.y > y && block.y - block.h < y)) {
                        target = block.index;
                        break;
                    }
                }
                if (target) break;
            }
        }
        return target;
    }


    /**
     * 移动方块操作
     */
    moveBlock(moveInfo: EliminatingInterface.Point) {
        const { currentBlock } = this;
        if (!currentBlock) {
            return false;
        }
        const point = currentBlock.toString().split('-');
        
        // 方向动作操作
        this.moveAnimation(this.blocks[point[0]][point[1]], moveInfo);
        this.currentBlock = '';
        return true;
    }


    /**
     * 移动动画
     * @param currentNode 被移动节点
     * @param moveInfo    移动距离
     * @param reverse     是否逆向
     */
    moveAnimation(
        currentNode: { node: cc.Node; script: EliminatingBlock; w: number; h: number; x: number; y: number; },
        moveInfo?: EliminatingInterface.Point,
        reverse: boolean = false,
    ) {
        currentNode.script.move({
            x: moveInfo.x * (reverse ? -1 : 1),
            y: moveInfo.y * (reverse ? -1 : 1),
        });
    }


    /**
     * 消除检测 [检测四各方向是否达成三连消除条件]
     * @param y 二维数组y轴
     * @param x 二维数组x轴
     */
    eliminateCheck(y: number, x: number) {
        const { blocks } = this;
        const checkQuery = Service.checkLine(blocks, y, x);
        console.log(checkQuery);
        if (checkQuery.destoryBlock.length) {
            checkQuery.destoryBlock.forEach(targets => this.destoryBlock(0, 0, targets));
            return true;
        }
        return false;
    }


    /**
     * 销毁方块[动画]
     * @param x      二维数组x
     * @param y      二维数组y
     * @param blocks 方块资源
     */
    destoryBlock(x: number, y: number, blocks?: EliminatingInterface.Block) {
        const cuurent = blocks || (this.blocks[y] ? this.blocks[y][x] : false);
        if (cuurent) {
            const { node } = cuurent.script.icon;
            node.runAction(
                cc.sequence(
                    cc.scaleTo(.4, .3).easing(cc.easeBounceOut()),
                    cc.callFunc(() => cuurent.script.node.destroy()),
                ),
            );
        }
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
            type: blockType,
        });
        
        blocks[y].push({
            x: mapInter.x - mapInter.width / 2,
            y: mapInter.y + mapInter.height / 2,
            w: mapInter.width,
            h: mapInter.height,
            script: blockInfo.script,
            index: `${y}-${blocks[y].length}`,
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