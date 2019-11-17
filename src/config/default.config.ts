import { DefaultConfig } from '../interface/config.interface';
/**
 * 工程默认配置文件
 */
const config: DefaultConfig =  {
  server: {
    // 主服务器
    host: 'http://127.0.0.1:7100',
    api: '',
    children: {
      // 测试服务器1
      test1: {
        host: 'http://127.0.0.1:8888',
        api: '',
        timeout: 2000,
      },
    },
  },
};
export default config;
