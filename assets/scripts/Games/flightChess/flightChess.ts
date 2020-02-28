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
const filghtItem = {
    id: -1,
    nickName: cc.Label,
    dicePoint: cc.Node,
    arrawPoint: cc.Node,
    pedestal: [ cc.Sprite ],
};
const FilghtPlayer = cc.Class({
    name: 'FilghtPlayer',
    properties: filghtItem,
});

@ccclass
export default class FilghtChess extends cc.Component {

    /**
     * 玩家坐标数据
     */
    @property(FilghtPlayer)
    filghtPlayer: typeof filghtItem[] = [];

    /**
     * 加一掷骰子的机会
     */
    @property(cc.Node)
    addDiceCount: cc.Node = null;

    /**
     * 完成状态的图片
     */
    @property(cc.Sprite)
    complete: cc.Sprite = null;
    
    /**
     * 爆炸动画
     */
    @property(cc.Node)
    exploade: cc.Node = null;

    /**
     * 箭头节点
     */
    @property(cc.Node)
    arraw: cc.Node = null;

    /**
     * 骰子
     */
    @property(cc.Node)
    dice: cc.Node = null;

    @property(cc.Node)
    test: cc.Node = null;

    /**
     * 起飞位置
     */
    startPoint: Array<number[]> = [
        [-163.44, -327.72],
        [330.599, -163.543],
        [165.661, 328.74],
        [-328.279, 164.67],
    ];

    point: Array<number[]> = [
        [ 1.001, -306.912, 90 ],
        [ -40.003, -306.912 ],
        [ -81.228, -306.912 ],

        [ -122.232, -286.85, 45 ],

        [ -143.176, -245.625, 0 ],
        [ -143.176, -204.621 ],
        [ -122.268, -163.726 ],

        [ -163.528, -122.38, 45 ],
        [ -205.194, -143.103, 90 ],
        [ -246.198, -143.103 ],

        [ -286.762, -122.601, 45 ],

        [ -307.776, -81.86, 0 ],
        [ -307.776, -40.69 ],
        [ -307.776, 0.75 ],
        [ -307.776, 41.257 ],
        [ -307.776, 82.884 ],

        [ -287.274, 123.007, -45 ],

        [ -246.049, 143.95, -90 ],
        [ -205.147, 143.95 ],
        
        [ -163.702, 123.889, -45 ],
        [ -122.918, 164.452, 0 ],

        [ -142.759, 205.897 ],
        [ -142.759, 246.591 ],

        [ -122.226, 287.845, -45 ],

        [ -81.346, 308.005, -90 ],
        [ -40.092, 308.005 ],
        [ 1.162, 308.005 ],
        [ 42.229, 308.005 ],
        [ 83.296, 308.005 ],

        [ 124.55, 288.032, -135 ],

        [ 145.118, 246.375, -180 ],
        [ 145.118, 205.499 ],

        [ 124.55, 164.623, -135 ],
        [ 165.686, 123.487, -90 ],

        [ 206.939, 144.025 ],
        [ 248.336, 144.025 ],
        
        [ 289.211, 123.717, -135 ],

        [ 309.909, 82.629, -180 ],
        [ 309.909, 41.753 ],
        [ 309.909, 0.244 ],
        [ 309.909, -40.65 ],
        [ 309.909, -81.544 ],

        [ 289.616, -122.746, -225 ],

        [ 248.414, -143.347, -270 ],
        [ 206.905, -143.347 ],

        [ 165.703, -122.131, -225 ],
        [ 124.809, -163.333, -180 ],

        [ 144.795, -204.535 ],
        [ 144.795, -245.737 ],

        [ 124.809, -286.324, 90 ],

        [ 83.3, -306.925 ],
        [ 42.098, -306.925 ],
    ]
    
    start () {
        let index = 0;
        setInterval(() => {
            index++;
            if (index === 52) index = 0;
            const targetIndex = this.point[index];
            this.test.runAction(
                cc.moveTo(.5, targetIndex[0], targetIndex[1])
            )
            if (targetIndex[2] !== undefined) {
                this.test.runAction(
                    cc.rotateTo(.5, targetIndex[2])
                );
            }
        }, 500);
    }

    // update (dt) {}
}
