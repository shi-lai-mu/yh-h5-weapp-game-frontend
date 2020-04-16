import State from '../utils/state';

export default new class Setting {

  /**
   * 游戏配置
   */
  private _config = {

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

  constructor() {
    let storage: any = localStorage.getItem('gameSetting');
    if (!storage) {
      localStorage.setItem('gameSetting', JSON.stringify(this._config));
    }
    this._config = storage || this._config;
  }

  
  /**
   * 触发游戏设置
   */
  updateSetting() {
    cc.game.emit('updateGameSetting', this);

    const { _config } = this;

    // 帧率设置
    cc.game.setFrameRate(_config.fps);
    // 音乐音量
    cc.audioEngine.setMusicVolume(_config.volume.music);
    // 音效音量
    cc.audioEngine.setEffectsVolume(_config.volume.effects);
  }
}
