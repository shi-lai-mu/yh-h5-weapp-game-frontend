export interface DefaultConfig {
  /**
   * 服务器配置
   */
  server: {
    /**
     * ip
     */
    host: string;
    /**
     * 接口
     */
    api: string;
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
         * ip
         */
        host: string;
        /**
         * 接口
         */
        api: string;
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
    host: string;
  };
}
