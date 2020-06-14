import EliminatingBlock from '../../Games/eliminating/script/EliminatingBlock';

namespace Eliminating {

  /**
   * 方块资源信息
   */
  export interface Block extends Point {
    w: number;
    h: number;
    x: number;
    y: number;
    script: EliminatingBlock;
    // node: cc.Node;
    index: string;
    key: {
      x: number;
      y: number;
    };
  }

  /**
   * 位置信息
   */
  export interface Point {
    x: number;
    y: number;
  }

  /**
   * 移动信息[布尔]
   */
  export interface MoveBoolean {
    bottom: boolean;
    left: boolean;
    right: boolean;
    top: boolean;
  }

  /**
   * 移动定位
   */
  export interface MoveBooleanPoint extends MoveBoolean {
    x: number;
    y: number;
  }


  /**
   * Map 类
   */
  export interface MapInterface {
    /**
     * 内置CCC节点类
     */
    mapBox: cc.Node;

    /**
     * 内置方格容器
     */
    blockBox: cc.Node;

    /**
     * 内置方块资源
     */
    blockPrefab: cc.Prefab;

    /**
     * 内置地图资源
     */
    mapPrefab: cc.Prefab;
  }
}

export default Eliminating;