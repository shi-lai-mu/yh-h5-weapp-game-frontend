import State from '../utils/state';

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

export default new class Setting {

  /**
   * 游戏配置
   */
  config = _CONFIG_;

  constructor() {
    let storage: any = JSON.parse(localStorage.getItem('gameSetting') || '');
    this.config = storage || this.config;
    this.updateSetting();
  }

  
  /**
   * 触发游戏设置
   */
  updateSetting() {
    cc.game.emit('updateGameSetting', this);

    const { config } = this;

    // 帧率设置
    cc.game.setFrameRate(config.fps);
    // 音乐音量
    console.log(config);
    cc.audioEngine.setMusicVolume(config.volume.music);
    // 音效音量
    cc.audioEngine.setEffectsVolume(config.volume.effects);

    // 存储变更
    localStorage.setItem('gameSetting', JSON.stringify(this.config));
  }
}
