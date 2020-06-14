// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EliminatingBlock from './EliminatingBlock';
import Service from './Service';
import Map from './Map';
import EliminatingInterface from '../../../interface/game/eliminating';
import Block from './Block';
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
    currentBlock: Block;
    // 横轴可放置点数
    // transverseCount = 4;
    // 地图
    Map: Map;

    start () {
        // 为方格容器添加触摸事件
        this.blockBox.on(cc.Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.blockBox.on(cc.Node.EventType.TOUCH_END, this.TOUCH_END, this);

        // 生成随机性的地图
        const MapClass = Service.randomCreate(5, 11, {
            mapBox: this.mapBox,
            blockPrefab: this.block,
            mapPrefab: this.mapPrefab,
            blockBox: this.blockBox,
        });
        
        // MapClass.data.forEach((yItem, y) => {
        //     yItem.forEach((xItem, x) => this.createMapScript(++index, x, y, xItem));
        //     MapClass.MapScript = this.blocks;
        // });
        this.Map = MapClass;
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
        

        // 执行移动操作
        const prevBlock = this.currentBlock.index.split('-');
        console.log(prevBlock);
        
        const [ prevY, prevX ] = prevBlock;
        const targetBlock = this.Map.isAllowMove(
            Number(prevY),
            Number(prevX),
            {
                ...move,
                top: move.y < 0,
                bottom: move.y > 0,
                right: move.x < 0,
                left: move.x > 0,
            }
        );
        console.log(targetBlock);
        if (targetBlock) {
            const nextBlock = targetBlock.index.split('-');
            const [nextY, nextX ] = nextBlock;
            const prev = this.Map.mapScript[prevY][prevX];
            this.Map.exchangeBlock(prev, targetBlock);
            // 三连消除检测
            setTimeout(() => {
                const p1Query = this.eliminateCheck(Number(nextY), Number(nextX));
                const p2Query = this.eliminateCheck(Number(prevY), Number(prevX));
                if (!p1Query && !p2Query) {
                    this.Map.exchangeBlock(targetBlock, prev);
                }
            }, 500);
        }
    }


    
    /**
     * 定位block资源
     * @param x x轴
     * @param y y轴
     */
    targetBlock(x: number, y: number) {
        const { mapScript } = this.Map;
        let target: Block;
        for (let i = 0, len = mapScript.length; i < len; i++) {
            const currentBlock = mapScript[i];
            for (const block of currentBlock) {
                if (block) {
                    if ((block.x < x && block.x + block.width > x) && (block.y > y && block.y - block.height < y)) {
                        target = block;
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
        this.Map.moveAnimation(this.blocks[point[0]][point[1]], moveInfo);
        this.currentBlock = null;
        return true;
    }


    /**
     * 消除检测 [检测四各方向是否达成三连消除条件]
     * @param y 二维数组y轴
     * @param x 二维数组x轴
     */
    eliminateCheck(y: number, x: number) {
        const checkQuery = this.Map.checkLine(y, x);
        // console.log(checkQuery, y, x);
        
        if (checkQuery.destoryBlock.length) {
            checkQuery.destoryBlock.forEach(targets => this.Map.destoryBlock(0, 0, targets));
            return true;
        }
        return false;
    }


    /**
     * 创建地图脚本
     * @param mapIndex  地图下标
     * @param x         X轴
     * @param y         Y轴
     * @param blockType 类型
     */
    createMapScript(mapIndex: number, x: number, y: number, blockType: number) {

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
            key: {
                y,
                x: blocks[y].length,
            },
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