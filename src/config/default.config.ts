import { DefaultConfig } from '../interface/config.interface';
/**
 * 工程默认配置文件
 */
const config: DefaultConfig =  {
  server: {
    // 主服务器
    host: '/',
    // 后端接口
    api: 'http://127.0.0.1:7100',
  },
};
export default config;
