import EliminatingInterface from '../../../interface/game/eliminating';

export default class Service {
    /**
     * 随机生成地图
     * @param xSize 横轴数量
     * @param ySize 竖轴数量
     */
    static randomCreate(xSize: number, ySize: number): number[][] {
        const MAX = 5;
        const MIN = 1;
        let Map = []
        for (let pointX = 0; pointX < xSize; pointX++) {
            const xMap = [];
            for (let pointY = 0; pointY < ySize; pointY++) {
                xMap.push(Service.randomNumber(MAX, MIN));
            }
            Map.push(xMap);
        }

        // Map 相连过滤
        const transformData = Service.transformDataModel(Map);
        for (let y = 0, yLen = transformData.length - 1; y <= yLen; y++) {
            const targetY = transformData[y];
            for (let x = 0, xLen = targetY.length - 1; x <= xLen; x++) {
                const checkQuery = Service.checkLine(transformData, y, x);
                if (checkQuery.type !== 0) {
                    const after = {
                        script: {
                            type: Service.randomNumber(MAX, MIN, checkQuery.index),
                        },
                    };
                    transformData[y][x] = after;
                }
            }
        }
        console.log(transformData, Service.transformDataModel(transformData));
        
        return Service.transformDataModel(transformData);
    }
    
    
    /**
     * 检测方块相连
     * @param blocks     方块库
     * @param y          目标x
     * @param x          目标y
     * @param targetType 目标类型
     * @param dataModel  数据检索模式
     */
    static checkLine(blocks, y: number, x: number, targetType: number | false = false, dataModel: boolean = false) {
        // 数据格式转换
        if (dataModel) {
            blocks = Service.transformDataModel(blocks);
        }
        // 达成三连数量
        let xTarget: EliminatingInterface.Block[] = [];
        let yTarget: EliminatingInterface.Block[] = [];
        // 获取目标方块
        const target = blocks[y] ? blocks[y][x] : false;
        const query = {
          type: 0,
          target,
          xTarget,
          yTarget,
          index: targetType,
          destoryBlock: [],
        };
        if (!target) return query;
        targetType = typeof targetType === 'number' ? targetType : target.script.type;
        query.index = targetType;


        // x轴三连检测
        for (let startX = x - 2; startX <= x + 2; startX++) {
            const chackBlock = blocks[y][startX];
            // if (chackBlock) {
            //     console.log(chackBlock.index, chackBlock.script.type, xTarget.length);
            // }
            if (chackBlock && chackBlock.script.type === targetType) {
                xTarget.push(chackBlock);
            } else if (xTarget.length < 3) {
                xTarget = [];
            } else {
                break;
            }
        }
        
        // y轴三连检测
        for (let startY = y - 2; startY <= y + 2; startY++) {
            const chackBlock = blocks[startY] ? blocks[startY][x] : false;
            // if (chackBlock) {
            //     console.log(chackBlock.index, chackBlock.script.type, xTarget.length);
            // }
            if (chackBlock && chackBlock.script.type === targetType) {
                yTarget.push(chackBlock);
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
     * 转换数据模拟格式
     */
    static transformDataModel(data: any[]) {
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
    
    
    /**
     * 生成随机整数
     * @param max 最大
     * @param min 最小
     */
    static randomNumber(max: number, min: number = 0, num: number | false = false) {
        let randomNumber = (Math.random() * max + min) >> 0;
        if (num !== false) {
            if (randomNumber === min) {
                randomNumber = max;
            } else if (randomNumber === max) {
                randomNumber = min;
            }
        }
        return randomNumber;
    }
};
