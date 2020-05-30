import EliminatingBlock from '../../Games/eliminating/script/EliminatingBlock';

namespace Eliminating {


  export interface Block extends Point {
    w: number;
    h: number;
    script: EliminatingBlock;
    index: string;
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
}

export default Eliminating;