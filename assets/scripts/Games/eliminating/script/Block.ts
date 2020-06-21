import EliminatingBlock from './EliminatingBlock';
import EliminatingInterface from '../../../interface/game/eliminating';
import { luanchOptions } from '../../../lib/tool';

export default
/**
 * 方块类
 */
class Block {

    /**
     * x轴
     */
    x: number;

    /**
     * y轴
     */
    y: number;

    /**
     * 宽度
     */
    width: number;

    /**
     * 高度
     */
    height: number;

    /**
     * 方块脚本
     */
    script: EliminatingBlock;

    /**
     * 地图位置
     */
    index: string;

    /**
     * 地图位置
     */
    key: EliminatingInterface.Block['key'];
    
    /**
     * map资源
     */
    map: cc.Node;

    /**
     * 实例化方块
     * @param y           Y轴
     * @param x           X轴
     * @param type        类型
     * @param blockPrefab 方块资源
     */
    constructor(y: number, x: number, type: number, map: cc.Node, ccc: EliminatingInterface.MapInterface, _mapScripts: Block[][]) {
        // 动物生成
        const prefab = cc.instantiate(ccc.blockPrefab);
        prefab.x = map.x - (prefab.width / 2);
        prefab.y = map.y + (prefab.height / 2);
        
        const prefabScript: EliminatingBlock = prefab.getComponent('EliminatingBlock');
        const blockInfo = prefabScript.init({
            type,
        });
        ccc.blockBox.addChild(prefab);

        this.x = map.x - map.width / 2;
        this.y = map.y + map.height / 2;
        this.width = map.width;
        this.height = map.height;
        this.script = blockInfo.script;
        this.index = `${y}-${_mapScripts[y].length}`;
        this.map = map;
        this.key = {
            y,
            x: _mapScripts[y].length,
        };
    }
}