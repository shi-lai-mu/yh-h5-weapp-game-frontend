import Service from './Service';
import EliminatingInterface from '../../../interface/game/eliminating';

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
    private _mapScript: EliminatingInterface.Block[][] = [];

    /**
     * 地图数据
     */
    get data() {
        return this._map;
    }

    /**
     * 附带脚本的复杂地图数据
     */
    get script() {
        return this._mapScript;
    }
    /**
     * 全量设置地图脚本数据
     */
    set MapScript(mapScript: EliminatingInterface.Block[][]) {
        this._mapScript = mapScript;
    }


    constructor(ySize: number, xSize: number) {
        let Map = [];
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
        console.log('地图中是否有相连：' + this.mapCheckLine());
    }


    /**
     * 地图已相连检测
     */
    mapCheckLine(): false | { y: number; x: number; }  {
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
          return _map[y][x] = Service.randomNumber(Service.MAX, Service.MIN, _map[y][x]);
        }

        // 全局扫描消除
        this.earch((y, x, map) => {
              const checkQuery = this.checkLine(y, x);
            if (checkQuery.type !== 0) {
                map[y][x] = Service.randomNumber(Service.MAX, Service.MIN, checkQuery.index);
            }
        });
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
        let xTarget: EliminatingInterface.Block[] = [];
        let yTarget: EliminatingInterface.Block[] = [];
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
            //     console.log(chackBlock.index, chackBlock.script.type, xTarget.length);
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
            //     console.log(chackBlock.index, chackBlock.script.type, xTarget.length);
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
