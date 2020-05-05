import GameSetting from '../utils/gameSetting';

/**
 * 工具类
 */
export namespace Utils {
  export interface State {

    /**
     * 用户数据
     */
    userInfo: {
      /**
       * 用户id
       */
      id: '0000';
      /**
       * 用户昵称
       */
      nickname: '* * * * * *';
      /**
       * 钻石数量
       */
      diamond: 0;
      /**
       * 金币数量
       */
      gold: 0;
      /**
       * 令牌
       */
      token: false;
      /**
       * 头像
       */
      avatarUrl: false;
      /**
       * 信号
       */
      signal: 0;
    };


    /**
     * Socket.io
     */
    io: {
      /**
       * 是否处于连接状态
       */
      connected: false,
      /**
       * 推送IO事件
       * @param event 事件名
       * @param data  数据
       */
      emit: (event, data) => void;
      /**
       * 订阅IO事件
       * @param event 事件名
       * @param data  数据
       */
      on: (event, data) => void;
      /**
       * 取消IO事件
       * @param event 事件名
       * @param data  数据
       */
      off: (event, data) => void;
      /**
       * 是否被占线
       */
      online: false,
    };


    /**
     * 服务器数据
     */
    server: {
      /**
       * 状态:
       *  - -1: 关闭中
       *  -  0: 正常
       *  -  1: 维护中
       *  -  2: 拥挤
       *   
       */
      state: 0;
    };


    /**
     * 服务器配置
     */
    serverConfig: {
      /**
       * 服务器状态
       */
      state: {
        value: 0;
      };
      /**
       * 启动内容
       */
      startMessage: {
        value: 0,
      };
    };


    /**
     * 游戏配置
     */
    games: Array<{
      /**
       * 游戏id
       */
      id: number;
      /**
       * 游戏名[中文]
       */
      name: string;
      /**
       * 游戏名[英文]
       */
      name_en: string;
      /**
       * 游戏类型
       */
      typeId: number;
    }>;


    /**
     * 房间游戏内的数据
     */
    gameData: any;
    
    
    /**
     * 是否为微信游戏客户端
     */
    IS_WECHAT: boolean;
    
    
    /**
     * 是否为浏览器
     */
    IS_BROWSER: boolean;
    
    
    /**
     * OSS对象加速
     */
    OSS_BASE: string;
    
    
    /**
     * 系统设置
     */
    system: typeof GameSetting;

    /**
     * 
     * 弹出提示
     * @param content 内容
     * @param timeout 收起时间
     * @param effect  是否播放音效
     * @param icon    图标（-1：不显示，1：成功，2：失败，3：警告）
     */
    tips: (content: string, timeout?: number, effect?: boolean, icon?: number) => Promise<any>;
  }
}
