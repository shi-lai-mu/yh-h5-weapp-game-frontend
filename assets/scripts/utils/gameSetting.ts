import State from '../utils/state';

const fringeScreenModels = [
  'iPhone X', 'iPhone x', 'vivo X21A', 'ASUS Zenfone 5',
  'Ulefone T2 Pro', 'Leagoo S9', 'HUAWEI P20', 'DooGee V',
  'OPPO R15', 'LG G7', 'SAMSUNG S9', 'COR-AL00',
  'vivo Y83A', 'LLD-AL20', 'vivo Z1', 'PACM00', 'PAAM00'
];


// 帧率设置
let storage: any = JSON.parse(localStorage.getItem('gameSetting') || '');

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
const config = storage || this.config;
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


  /**
   * 判断是否为刘海
   */
  hasScreenFringe() {
    const systemInfo = State.IS_WECHAT ? wx.getSystemInfoSync() : { model: null };

    if (systemInfo.model != null) {
        for (let i in fringeScreenModels) {
            if (systemInfo.model.indexOf(fringeScreenModels[i]) > -1) {
                // 是已知机型里的刘海手机
                return true;
            }
        }
    }

    // 屏幕宽高比大于2，基本上90%的手机可以确定是刘海屏，就算个别手机不是也按刘海屏处理
    // 竖屏游戏判断：
    // if (systemInfo.windowHeight >= 800 || systemInfo.windowHeight / systemInfo.windowWidth > 2) {
    //     return true;
    // }

    // // 横屏游戏判断：
    // if (this.systemInfo.windowWidth >= 800 || this.systemInfo.windowWidth / this.systemInfo.windowHeight > 2) {
    //     return true;
    // }

    return false;
  }
  
}
