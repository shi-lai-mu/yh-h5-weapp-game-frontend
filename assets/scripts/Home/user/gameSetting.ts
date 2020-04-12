// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State from '../../utils/state';

@ccclass
export default class GameSetting extends cc.Component {
    // 音量调节
    @property(cc.ProgressBar) volume: cc.ProgressBar = null;
    // BGM开关
    @property(cc.ToggleGroup) BGM: cc.ToggleGroup = null;
    // 游戏帧数
    @property(cc.ToggleGroup) fps: cc.ToggleGroup = null;

    start () {

    }


    /**
     * 修改音量时
     * @param e 参数
     */
    volumeChang(e) {
        console.log(e.progress);
    }


    /**
     * 修改BGM时
     * @param e 参数
     */
    BgmChang(e) {
        console.log(e.target.name);
    }


    /**
     * 修改FPS选项时
     * @param e 参数
     */
    FpsChang(e) {
        console.log(e.target.name);
    }
}
