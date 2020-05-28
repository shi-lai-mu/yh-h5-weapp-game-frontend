// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import axios from '../../utils/axiosUtils';
import State from '../../utils/state';
const {ccclass, property} = cc._decorator;

@ccclass
export default class EliminatingScene extends cc.Component {

    // 岛屿
    @property(cc.Prefab) isLand: cc.Prefab = null;
    // 地图区域
    @property(cc.Node) mapBox: cc.Node = null;
    // 地图数据
    mapData = [
        [ 480, -80 ],
        [ 800, 85 ],
        [ 1090, -180],
        [ 1300, 105],
        [ 1470, -200],
        [ 1657, 135],
        [ 1880, -70],
        [ 2138, 120],
    ];
    // 战绩
    record;
    /**
     * 游戏信息
     */
    get info() {
        return State.system.info('消消乐');
    }


    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, event => {
            console.log(event);
        }, this);
        axios
            .api('game_record', {
                params: {
                    gameId: this.info.id,  
                },
            })
            .then(res => this.updateIsLand(res))
            .catch(err => {
                console.log(err);
                State.tips('战绩数据加载失败', 5, false, 2)
            })
        ;
    }

    
    /**
     * 加载岛屿
     * @param recordData 战绩信息
     */
    updateIsLand(recordData: any[]) {
        console.log(recordData);
        // 是否被锁
        let lock = false;
        // 生成岛屿
        this.mapData.forEach((point, index) => {
            const island = cc.instantiate(this.isLand);
            // 初始化岛屿，EliminatingLand脚本在子节点下
            island.children[0].getComponent('EliminatingLand').init(recordData[index] || undefined, index, lock);
            if (!recordData[index]) lock = true;
            island.x = point[0] - 190;
            island.y = point[1];
            this.mapBox.addChild(island);
            console.log(island);
            
        });
    }


    /**
     * 返回大厅
     */
    backHome() {
        cc.director.loadScene('Home');
    }


    /**
     * 滚动场景时
     * @param e 事件
     */
    scrollScent(e) {
        // console.log(e);
    }
}
