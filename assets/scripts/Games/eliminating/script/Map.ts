import Service from './Service';
import Block from './Block';
import EliminatingInterface from '../../../interface/game/eliminating';

/**
 * 下落深度纪录
 */
let deepX = {};

export default 
/**
 * 地图生成器
 */
class MapCreate {
    /**
     * 地图数据
     */
    private _map: number[][] = [];

    /**
     * 附带脚本的复杂地图数据
     */
    private _mapScript: Block[][] = [];

    /**
     * 地图容器
     */
    private ccc: EliminatingInterface.MapInterface;

    /**
     * 地图数据
     */
    get data() {
        return this._map;
    }

    /**
     * 附带脚本的复杂地图数据
     */
    get mapScript() {
        return this._mapScript;
    }

    /**
     * 下落检测事件
     */
    fallEvent: number = 0;


    /**
     * 地图生成器
     * @param ySize      y轴
     * @param xSize      x轴
     * @param cccOptions ccc内置资源
     */
    constructor(ySize: number, xSize: number, cccOptions: EliminatingInterface.MapInterface) {
        let Map = [];
        this.ccc = cccOptions;
        for (let pointX = 0; pointX < xSize; pointX++) {
            const xMap = [];
            for (let pointY = 0; pointY < ySize; pointY++) {
                xMap.push(Service.randomNumber(Service.MAX, Service.MIN));
            }
            Map.push(xMap);
        }
        this._map = Map;
        this._mapScript = Map;

        // 重复方块筛除
        let checkQuery;
        while (checkQuery = this.mapCheckLine()) {
          this.mapEliminateLine(checkQuery.y, checkQuery.x);
        }
        checkQuery = null;
        console.log('地图中是否有相连：' + this.mapCheckLine());

        // 执行删除地图方法
        this.mapCreate(Map);
    }


    /**
     * 创建地图
     * @param mapData 地图资源
     */
    mapCreate(mapData: number[][]) {
        // 顶部偏移值
        const offsetTop = 50;
        // 左侧偏移值
        const offsetLeft = 200;

        this._mapScript = [];
        const { _mapScript } = this;
        mapData.forEach((yMap, y) => {
            _mapScript.push([]);
            yMap.forEach((blockType, x) => {
                const mapInter = cc.instantiate(this.ccc.mapPrefab);
                const { width, height } = mapInter;
                mapInter.x += x * width + offsetLeft;
                mapInter.y -= y * height + offsetTop;
                this.ccc.mapBox.addChild(mapInter);

                const block = new Block(y, x, blockType, mapInter, this.ccc, _mapScript);

                _mapScript[y].push(block);
            });
        });
    }


    /**
     * 设置指定位置的方块
     * @param y         Y轴
     * @param x         x轴
     * @param blockType 方块类型
     */
    setBlock(y: number, x: number, blockType: number) {
        this._map[y][x] = blockType + 1;
    }


    /**
     * 地图已相连检测
     */
    mapCheckLine(): false | { y: number; x: number; } {
        let isLine: false | { y: number; x: number; } = false;
        this.earch((y, x) => {
            const checkQuery = this.checkLine(y, x);
            if (checkQuery.type !== 0) {
                isLine = { y, x };
                return true;
            }
        });
        
        return isLine;
    }


    /**
     * 地图消除已相连
     * @param y Y轴
     * @param x X轴
     */
    mapEliminateLine(y?: number, x?: number) {
        const { _map } = this;
        // 指定位置消除
        if (y !== undefined && x !== undefined) {
          return this.setBlock(y, x, Service.randomNumber(Service.MAX, Service.MIN, _map[y][x]) - 1);
        }

        // 全局扫描消除
        this.earch((y, x, map) => {
              const checkQuery = this.checkLine(y, x);
            if (checkQuery.type !== 0) {
                this.setBlock(y, x, Service.randomNumber(Service.MAX, Service.MIN, checkQuery.index) - 1);
            }
        });
    }

    
    /**
     * 互换方块
     * @param Point1 方块1
     * @param Point2 方块2
     */
    exchangeBlock(Point1: Block, Point2: Block) {
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
        // 更新地图数据
        this.setBlock(Point1.key.y, Point1.key.x, Point1.script.type);
        this.setBlock(Point2.key.y, Point2.key.x, Point2.script.type);
    }


    /**
     * 移动动画
     * @param currentNode 被移动节点
     * @param moveInfo    移动距离
     * @param reverse     是否逆向
     */
    moveAnimation(
        currentNode: Block,
        moveInfo?: EliminatingInterface.Point,
        reverse: boolean = false,
    ) {
        currentNode.script.move({
            x: moveInfo.x * (reverse ? -1 : 1),
            y: moveInfo.y * (reverse ? -1 : 1),
        });
    }


    /**
     * 销毁方块[动画]
     * @param y      Y轴
     * @param x      X轴
     * @param blocks 方块资源
     */
    destoryBlock(y: number, x: number, block?: Block) {
        const cuurent = block || (this._mapScript[y] ? this._mapScript[y][x] : false);
        if (cuurent) {
            const { node } = cuurent.script.icon;
            node.runAction(
                cc.sequence(
                    cc.scaleTo(.4, .3).easing(cc.easeBounceOut()),
                    cc.callFunc(() => {
                        cuurent.script.node.destroy();
                        this.setBlock(cuurent.key.y, cuurent.key.x, -1);
                        this.destoryFall(block.key.y, block.key.x);
                    }),
                ),
            );
        }
    }


    /**
     * 消除下落逻辑
     * @param y 二维数组y
     * @param x 二维数组x
     */
    destoryFall(y: number, x: number) {
        const { _map, fallEvent, _mapScript } = this;

        // 深度纪录更新
        console.log(deepX[x], y);
        
        if (deepX[x] === undefined) deepX[x] = y;
        if (deepX[x] && deepX[x] < y) {
            deepX[x] = y;
        }

        fallEvent && clearTimeout(fallEvent);
        this.fallEvent = setTimeout(() => {

                // 下落
            Object.keys(deepX).forEach(x => {
                let fallCount = 0;
                let y = deepX[x];
                while (y) {
                    const current = _map[--y][x];
                    if (current) {
                        const currentDeepY = deepX[x] - fallCount;
                        this.exchangeBlock(_mapScript[currentDeepY][x], _mapScript[y][x]);
                        fallCount++;
                        setTimeout(() => {
                            const checkQuery = this.checkLine(currentDeepY, Number(x));
                            console.log(checkQuery);
                            if (checkQuery.destoryBlock.length) {
                                checkQuery.destoryBlock.forEach(targets => this.destoryBlock(0, 0, targets));
                            }
                        }, 500);
                    } else {

                    }
                }
            });

            this.fallEvent = 0;
            // 深度清空
            deepX = {};
        }, 100);
    }
    
    
    /**
     * 检测方块相连
     * @param y          目标x
     * @param x          目标y
     * @param targetType 目标类型
     */
    checkLine(y: number, x: number) {
        const { _map, _mapScript } = this;
        // 达成三连数量
        let xTarget: Block[] = [];
        let yTarget: Block[] = [];
        // 获取目标方块
        
        const index = _map[y] ? _map[y][x] : false;
        const query = {
          type: 0,
          xTarget,
          yTarget,
          index: index || -1,
          destoryBlock: [],
        };
        if (!index) return query;


        // x轴三连检测
        for (let pX = x - 2; pX <= x + 2; pX++) {
            const chackBlock = _map[y][pX];
            // if (chackBlock) {
            //     console.log(chackBlock, index, y, pX);
            // }
            if (chackBlock && chackBlock === index) {
                xTarget.push(_mapScript[y][pX]);
            } else if (xTarget.length < 3) {
                xTarget = [];
            } else {
                break;
            }
        }
        
        
        // y轴三连检测
        for (let pY = y - 2; pY <= y + 2; pY++) {
            const chackBlock = _map[pY] ? _map[pY][x] : false;
            // if (chackBlock) {
            //     console.log(chackBlock, index, pY, x);
            // }
            if (chackBlock && chackBlock === index) {
                yTarget.push(_mapScript[pY][x]);
            } else if (yTarget.length < 3) {
                yTarget = [];
            } else {
                break;
            }
        }
        
        if (xTarget.length === 5 || yTarget.length === 5) {         // 横或竖5连判断
            console.log('彩色鸡');
            query.type = 1;
        } else if (xTarget.length + yTarget.length > 5) {           // L形判断
            console.log('发光本体');
            query.destoryBlock = [ ...xTarget, yTarget ];
            query.type = 2;
        } else if (yTarget.length >= 3 || xTarget.length >= 3) {    // 三连判断
            console.log('三连');
            if (xTarget.length >= 3) {
                query.destoryBlock = xTarget;
                query.type = 3.1;
            } else if (yTarget.length >= 3) {
                query.destoryBlock = yTarget;
                query.type = 3.2;
            }
        }

        query.xTarget = xTarget;
        query.yTarget = yTarget;

        return query;
    }


    /**
     * 是否允许指定方向移动
     */
    isAllowMove(y: number, x: number, moveInfo: EliminatingInterface.MoveBoolean): false | Block {
        let targetBlock: false | Block = false;
        const { _map, _mapScript } = this;

        const { top, right, bottom, left } = moveInfo;

        // 顶部检测
        if (top && _map[y - 1] && _map[y - 1][x]) {
            targetBlock = _mapScript[y - 1][x];
        }
        // 右侧检测
        if (right && _map[y] && _map[y][x + 1]) {
            targetBlock = _mapScript[y][x + 1];
        }
        // 底部检测
        if (bottom && _map[y + 1] && _map[y + 1][x]) {
            targetBlock = _mapScript[y + 1][x];
        }
        // 左侧检测
        if (left && _map[y] && _map[y][x - 1]) {
            targetBlock = _mapScript[y][x - 1];
        }

        return targetBlock;
    }


    /**
     * 遍历地图数据
     * @param callback 回调 (返回true则结束遍历)
     * @param mapData  地图数据
     */
    earch(callback: (y: number, x: number, map: number[][]) => boolean | void, mapData?: number[][]) {
        const { _map } = this;
        mapData = mapData || _map;

        for (let y = 0, yLen = mapData.length - 1; y <= yLen; y++) {
            const targetY = mapData[y];
            for (let x = 0, xLen = targetY.length - 1; x <= xLen; x++) {
                if(callback(y, x, mapData)) break;
            }
        }
    }


    /**
     * 转换数据模拟格式
     */
    transformDataModel(data: any[]) {
        return data.map(item => {
            return item.map(itemVal => {
                if (typeof itemVal === 'number') {
                    return {
                        script: {
                            type: itemVal,
                        },
                    };
                } else {
                    return itemVal.script.type;
                }
            })
        });
    }
    
}
