/**
 * socket-client 封装
 * author:  ShiLaiMu
 * version: v1.0.0
 * type:    TypeScript
 * encrypt: false
 *
 * 依赖:
 * @/config/default.config.ts
 * npm install @types/socket.io-clien --save
 *
 *
 * 全局:
 * [main.ts]
 *    import io from '@/utils/socketIO';
 *    io.use(Vue);
 *
 * 功能:
 * - 全局统一：  请求api配置中的接口，实现一改配置修改全部请求
 * - 内网连接：  内网访问及调试时，后端请求自动切换为内网域
 * - 多IO连接：  可同时连接多个IM系统并实现统一监听和发送
 *
 * 调用方法:
 * - 主IM:
 *     this.$socket.emit()
 *     this.$socket.on() 等 Socket 方法
 *
 * - 子IM:
 *     this.$io[配置内定义的IM名] 如配置内 io: { main: 'ws://127.0.0.1:7021', gameIM: 'ws://127.0.0.1:7022' }
 *     this.$io.gameIM.emit()
 *     this.$io.gameIM.on() 等 Socket 方法
 */
// const io = require('../lib/socket.io.js');
import * as io from '../lib/socket.io.js';
import State from './state';
import defaultConfig from '../config/default.config';

// IO配置文件引入
const IoConfig = defaultConfig.io;
// 子IO
// const ioChilder: { [key: string]: typeof io.Socket; } = {};
// 账号token获取
// 当前域
const locaHostName = window.location.hostname;
const localRegExp = /127\.0\.0\.1|localhost/;

// 子IM连接
// Object.keys(IoConfig)
//   .filter((key: string) => ![ 'main', 'dev' ].includes(key))
//   .forEach((key: string) => {
//     ioChilder[key] = socket(
//       !isDEV
//         ? IoConfig[key]
//         : localRegExp.test(IoConfig.dev[key]) && !localRegExp.test(locaHostName)
//           ? IoConfig.dev[key].replace(localRegExp, locaHostName)
//           : IoConfig.dev[key],
//       {
//         forceNew: true,
//         query: {
//           token,
//         },
//       },
//     );
//   })
// ;
State.observer.on('tokenUpdate', (newToken) => {
  // if (typeof State.io === 'object') {
  //   // console.warn('断开了一次IO连接');
  //   State.io.disconnect();
  // }
  console.log('==================================');
  console.log(newToken);

  let socket = io.connect(`${localRegExp.test(IoConfig.main) && !localRegExp.test(locaHostName)
    ? IoConfig.main.replace(localRegExp, locaHostName)
    : IoConfig.main
  }/?token=${ newToken }`, 
  { 
      transports:['websocket'],
  });
  socket.on('connect', () => {
      console.log(`\n SocketIo Connect`)
      // this.tipNode.color = cc.Color.GREEN
  });
  // 链接处理
  socket.on('connect', data => console.log('IO连接成功!', data));
  socket.on('reconnect', data => console.log('IO重连中...', data));
  socket.on('disconnect', data => console.log('IO断开了!', data));
  socket.on('disconnecting', data => console.log('IO断开中...', data));
  socket.on('test', console.log);
  State.io = socket;
  window.socket = socket;
});
