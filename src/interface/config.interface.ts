export interface DefaultConfig {
  /**
   * 应用名称
   */
  appName: string;
  /**
   * 应用LOGO url
   */
  appLogo: string;
  /**
   * 服务器配置
   */
  server: {
    /**
     * 生产环境请求
     */
    host: string;
    /**
     * 开发环境请求
     */
    devHost: string;
    /**
     * 请求超时定义 ms
     */
    timeout?: number;
    /**
     * 子服务器
     */
    children: {
      [key: string]: {
        /**
         * 生产环境请求
         */
        host: string;
        /**
         * 开发环境请求
         */
        devHost: string;
        /**
         * 请求超时定义 ms
         */
        timeout?: number;
      };
    };
  };
  // IO服务器
  io: {
    /**
     * IP
     */
    dev: {
      main: string;
      [key: string]: string;
    };
    main: string;
    [key: string]: any;
  };
}
