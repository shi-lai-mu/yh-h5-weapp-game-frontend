import Vue, { VueConstructor } from 'vue';
import io from 'socket.io-client';
import defaultConfig from '@/config/default.config';
const IoConfig = defaultConfig.io;
const ioChilder: { [key: string]: typeof io.Socket; } = {};
// 开发环境判断
const isDEV = process.env.NODE_ENV === 'development';

// 子IM连接
Object.keys(IoConfig)
  .filter((key: string) => ![ 'main', 'dev' ].includes(key))
  .forEach((key: string) => {
    ioChilder[key] = io(!isDEV ? IoConfig[key] : IoConfig.dev[key], {
      forceNew: true,
    });
    ioChilder[key].emit('connect/test');
  })
;


export default {
  use: (vue: VueConstructor<Vue>) => {
    vue.prototype.$socket = io(!isDEV ? IoConfig.main : IoConfig.dev.main);
    vue.prototype.$io = ioChilder;
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $socket: typeof io.Socket;
    $io: {
      [key: string]: typeof io.Socket;
    };
  }
}
