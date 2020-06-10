import EliminatingInterface from '../../../interface/game/eliminating';
import MapCreate from './Map';
// 方块最大类型
const MAX = 5;
// 方块最小类型
const MIN = 1;

export default class Service {
    /**
     * 方块最大类型
     */
    static MAX = MAX;

    /**
     * 方块最小类型
     */
    static MIN = MIN;

    /**
     * 随机生成地图
     * @param xSize 横轴数量
     * @param ySize 竖轴数量
     */
    static randomCreate(xSize: number, ySize: number): MapCreate {
        return new MapCreate(ySize, xSize);
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

