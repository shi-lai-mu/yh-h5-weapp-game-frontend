// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State from '../../utils/state';

@ccclass
export default class UserGameSetting extends cc.Component {
    // 音量调节
    @property(cc.ProgressBar) volume: cc.ProgressBar = null;


    /**
     * 修改音量时
     * @param e 参数
     */
    volumeChang(e) {
        const { volume } = State.system.config;
        volume.music = volume.effects = e.progress;
        State.system.updateSetting();
    }


    /**
     * 修改BGM时
     * @param e 参数
     */
    BgmChang(e) {
        State.system.config.bgm = e.target.name === 'on';
        State.system.updateSetting();
    }


    /**
     * 修改FPS选项时
     * @param e 参数
     */
    FpsChang(e) {
        State.system.config.fps = e.target.name;
        State.system.updateSetting(true);
    }
}
