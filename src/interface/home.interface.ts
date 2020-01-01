/**
 * 屏幕转换样式接口
 */
export interface Games {
  id?: number;
  url: string;
  icon: string;
  name: string;
}

/**
 * 游戏活动
 */
export interface Activity {
  /**
   * 活动ID
   */
  id: number;
  /**
   * 活动标题
   */
  title: string;
  /**
   * 活动封面
   */
  pcitrue: string;
  /**
   * 活动是否禁用
   */
  disable: number;
  /**
   * 活动HTML
   */
  html?: string;
  /**
   * 活动链接
   */
  url?: string;
}
