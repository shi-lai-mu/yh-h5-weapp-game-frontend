import { DefaultConfig } from '../interface/config.interface';
/**
 * 工程默认配置文件
 */
const config: DefaultConfig =  {
  appName: '游惠-游戏端',
  appLogo: 'logo.png',
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
  },
  /**
   * Socket.io Port Conifg
   */
  io: {
    main: 'ws://127.0.0.1:7100',
    dev: {
      main: 'ws://127.0.0.1:7100',
    }
  },
};
export default config;
