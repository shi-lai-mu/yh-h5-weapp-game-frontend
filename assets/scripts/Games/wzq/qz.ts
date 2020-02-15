// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State from '../../utils/state';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    qzH: cc.Node = null;

    @property(cc.Node)
    qzB: cc.Node = null;

    @property({ visible: !1 })
    point: Point = {
        // 行
        row: 0,
        // 列
        col: 0,
        // 棋子类型 0：黑子  1：白子
        pieceType: -1,
    };

    @property(cc.AudioClip)
    audio: cc.AudioClip = null;


    @property({ visible: !0 })
    pieceType: number = -1;

    /**
     * 调用者指针
     */
    game: any;

    /**
     * 初始化
     */
    init(point: Point) {
        this.point = point;
    }


    /**
     * 点击事件
     * @param pieceType - 棋子类型 0：黑子  1：白子
     */
    onClick(pieceType) {
        pieceType = typeof pieceType === 'number' ? pieceType : this.pieceType;
        const { point } = this;
        const { row, col } = point;
        if (point.pieceType === -1) {
            State.io.emit('goBang/setp', {
                x: col,
                y: row,
                s: pieceType,
            });
        }
    }

    ioClick(pieceType) {
        pieceType = typeof pieceType === 'number' ? pieceType : this.pieceType;
        const { point } = this;
        if (point.pieceType === -1) {
            // pieceType = 1;
            point.pieceType = pieceType;
            this.qzB.scale = pieceType ? 1 : 0;
            this.qzH.scale = pieceType ? 0 : 1;
            
            cc.audioEngine.playEffect(this.audio, false);
            // 五子连通检测
            this.game.checkConnectivity(point, pieceType);
        }
    }

    // update (dt) {}
}

interface Point {
    row: number;
    col: number;
    pieceType: ( 0 | 1 | -1 )
}