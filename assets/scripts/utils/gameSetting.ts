import State from '../utils/state';

// 帧率设置
let storage: any = JSON.parse(localStorage.getItem('gameSetting') || '{}');

const _CONFIG_ = {

  /**
   * 背景音乐开关
   */
  bgm: true,

  /**
   * 音量
   */
  volume: {
    /**
     * 背景音乐
     */
    music: 1,
    /**
     * 音效
     */
    effects: 1,
  },

  /**
   * 游戏帧率
   * - -1: 无上限
   * - 60: 60帧
   * - 30: 30帧
   * - 15: 15帧
   */
  fps: -1,
};
const config = Object.keys(storage).length ? storage : _CONFIG_;
cc.game.setFrameRate(config.fps);

export default new class Setting {

  /**
   * 游戏配置
   */
  config = _CONFIG_;

  constructor() {
    this.updateSetting();
  }

  
  /**
   * 触发游戏设置
   * @param reboot 是否重启游戏
   */
  updateSetting(reboot: boolean = false) {
    cc.game.emit('updateGameSetting', this);

    // 音乐音量
    console.log(config);
    cc.audioEngine.setMusicVolume(config.volume.music);
    // 音效音量
    cc.audioEngine.setEffectsVolume(config.volume.effects);

    // 存储变更
    localStorage.setItem('gameSetting', JSON.stringify(this.config));

    // 判断是否重启
    reboot && cc.game.restart();
  }
  
}
