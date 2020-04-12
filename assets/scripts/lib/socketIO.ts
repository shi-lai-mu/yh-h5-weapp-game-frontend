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
import * as io from './asocket.ioLib/asocket.io';
// import State from './state';
import State from '../utils/state';
import defaultConfig from '../config/default.config';
// IO配置文件引入
const IoConfig = defaultConfig.io;
// 子IO
// const ioChilder: { [key: string]: typeof io.Socket; } = {};
// 账号token获取
// 当前域
const locaHostName = window.location.hostname;
const localRegExp = /127\.0\.0\.1|localhost/;
// let clock = null;

export default {
  init() {
    console.log('IO 机制加载成功!');
    State.observer.on('tokenUpdate', this.connect.bind(this));
    if (State.userInfo.token) {
      this.connect(State.userInfo.token);
    }
  },

  connect(token) {
    console.log(`IO 连接中...`, token);
    let socket = io.connect(`${
      (localRegExp.test(IoConfig.main) && !localRegExp.test(locaHostName)) || CC_DEV
        ? IoConfig.dev.main.replace(localRegExp, locaHostName)
        : IoConfig.main
    }/`, 
    {
      query: {
        token: token,
      },
      forceNew: true,
      transports: [ 'websocket' ],
    });
    
    // 账号已在线检测
    socket.on('onLine', data => {
      State.io.online = true;
      State.observer.emit('onLine', data);
    });

    // 连接成功
    socket.on('connect', () => {
      State.io = socket;
      console.log(`IO 连接成功!`);
      State.observer.emit('socketConnect');
      socket.emit('connect/test');
    });

    // 链接处理
    socket.on('reconnect', data => console.log('IO重连中...', data));

    // 断开连接
    socket.on('disconnect', data => {
      console.log(data);
      // 服务器关闭
      if (data === 'transport close') {
        State.server.state = -1;
        State.observer.emit('serverClose');
      }
    });

    // 自定义事件
    socket.reconnect = () => {
      socket.disconnect();
      socket.connect();
    }

    // 用户数据更新
    socket.on('updateUserData', data => State.observer.emit('updateUserData', data));
    
    State.io = socket;
    window.socket = socket;
  }
};
