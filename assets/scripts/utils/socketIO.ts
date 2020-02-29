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
const io = require('../lib/weapp.socket.io.js');
import State from './state';
import defaultConfig from '../config/default.config';

// IO配置文件引入
const IoConfig = defaultConfig.io;
// 子IO
// const ioChilder: { [key: string]: typeof io.Socket; } = {};
// 账号token获取
const { token } = JSON.parse(localStorage.getItem('userInfo') || '{}');
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
console.log(token);

const socket = io('ws://127.0.0.1:7100/?token=186198010f8643d2678fc6c8de71a09cfd703f8464cc069223289119829a1ef0')

socket.connect()
console.log(socket);
// 链接处理
socket.on('connect', console.log)

socket.on('disconnect', console.warn)
socket.on('disconnecting', console.warn)
// 错误处理
socket.on('error', console.warn)
State.io = socket;