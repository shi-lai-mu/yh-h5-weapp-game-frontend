
export default {
  /**
   * Server Request Config
   */
  server: {
    host: 'http://127.0.0.1:7100',
    devHost: 'http://127.0.0.1:7100',
    children: {
      // 测试服务器1
      test1: {
        host: 'http://127.0.0.1:8888',
        devHost: 'http://127.0.0.1:8888',
        timeout: 2000,
      },
    },
  }
}