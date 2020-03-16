/**
 * Io 接收到的数据
 */
export interface ioOnData {
    type: string;
    msg: {
      prveCard: any,
      timeout?: number;
      /**
       * 桌面分数
       */
      desktopScore: 0,
      /**
       * 分数
       */
      score: number[];
      /**
       * 抓分分数
       */
      noteScore: number[];
      /**
       * 玩家牌数
       */
      cardCount: number[];
      /**
       * 玩家状态(0：未加入, 1：正常, 2：已打完手牌, -1：掉线, 3: 离开房间[游戏已开始, 1分钟内未连线])
       */
      playerState: number[];
    },
    callback?: string,
}

/**
 * 扑克牌列表元素
 */
export interface CardList {
    node: cc.Node;
    x: number;
    y: number;
    number: number;
    row: number;
    col: number;
    buttonScipt: any;
    clickEventHandler: any;
    mask: cc.Node;
    isSelect?: boolean;
}


/**
 * 玩家
 */
export interface FourCardsPlayers {
    nickname: cc.Label;
    score: cc.Label;
    noteScore: cc.Label;
    cardCount: cc.Label;
    avatarUrl: cc.Sprite;
    cardPoint: cc.Node;
}

/**
 * 玩家发牌后的接收到的IO数据
 */
export interface SendCardData {
    params: Array<{ r: number; c: number; n: number; }>;
    userId: number;
    prveCard: '' | any[]; 
    next: {
        index: any;
    };
    /**
     * 桌面分数
     */
    desktopScore: 0,
    /**
     * 分数
     */
    score: number[];
    /**
     * 抓分分数
     */
    noteScore: number[];
    /**
     * 玩家牌数
     */
    cardCount: number[];
    /**
     * 玩家状态(0：未加入, 1：正常, 2：已打完手牌, -1：掉线, 3: 离开房间[游戏已开始, 1分钟内未连线])
     */
    playerState: number[];
}

/**
 * 用户数据
 */
export interface UserData {
    id: number;
    nickname: string;
    avatarUrl: number;
    setp: number;
    timeOut: number;
    time: number;
    index: number;
}
