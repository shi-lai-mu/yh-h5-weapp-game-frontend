// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State from '../../utils/state';
import Toggle from '../../perfab/script/Radio/toggle';

@ccclass
export default class UserGameSetting extends cc.Component {
    // 音乐节点
    @property(cc.Slider) musicVolume: cc.Slider = null;
    // 音效节点
    @property(cc.Slider) effectVolume: cc.Slider = null;
    // 背景音乐是否开启节点
    @property(cc.ToggleContainer) bgm: cc.ToggleContainer = null;
    // 游戏帧数节点
    @property(cc.ToggleContainer) fps: cc.ToggleContainer = null;
    // 是否初始化结束
    initState = false;
    
    start() {
        const { config } = State.system;
        console.log(this.musicVolume);
        this.musicVolume.progress = config.volume.music;
        this.effectVolume.progress = config.volume.effects;
        this.setToggleFouse(this.bgm, config.bgm);
        this.setToggleFouse(this.fps, config.fps);

        this.initState = true;
    }


    setToggleFouse(ToggleContainer: cc.ToggleContainer, value: any) {
        const { children } = ToggleContainer.node;
        for (const chi of children) {
            if (chi._name === value) {
                chi.getComponent(cc.Toggle).check();
                break;
            }
        }
    }


    /**
     * 修改音量时
     * @param e 参数
     */
    MusicVolumeChang(e) {
        const { volume } = State.system.config;
        volume.music = e.progress;
        State.system.updateSetting();
    }


    /**
     * 修改音量时
     * @param e 参数
     */
    EffectVolumeChang(e) {
        const { volume } = State.system.config;
        volume.effects = e.progress;
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
        State.system.updateSetting(this.initState);
    }
}
