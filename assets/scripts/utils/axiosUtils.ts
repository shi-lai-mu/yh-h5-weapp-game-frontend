/* tslint:disable */
/**
 * Axios 二次封装 [未启用加密版]
 * author:  ShiLaiMu
 * version: v1.2.1
 * type:    TypeScript
 * encrypt: false
 * 
 * 依赖:
 * @/config/api.config.ts
 * @/config/default.config.ts
 * npm install @types/axios @types/qs --save
 * 
 * 全局:
 * [main.ts] Vue.prototype.$axios = axios;
 * 
 * 功能:
 * - 全局统一：  请求api配置中的接口，实现一改配置修改全部请求
 * - 统一配置化: 请求信息，分离 [服务器配置文件] 和 [请求配置文件]，实现可配置 [主和子服务器/请求延迟/请求路由/请求方式/请求的目标服务器]
 * - 身份携带：  token自动化加入请求头，读取本地缓存
 * - 请求权重：  调用时指定的请求信息必定覆盖配置内的请求信息
 * - 路由参数：  配置文件中支持路由
 * - 临时令牌：  如果response header内存在token则会将它作为临时token，下次请求时使用
 * - 线上线下域：生产模式下自动切换为线上请求域，开发模式自动切换为内网域或开发本地域   ——   V1.1.6+
 * - 全局监听：  全局监听axios的事件，统一处理请求指定事件并及时响应   ——   V1.2.0+
 * - 内网请求：  内网访问及调试时，后端请求自动切换为内网域   ——   V1.2.1+
 * 
 * 调用方法:
 * - 推荐:
 *   this.$axios.api('login', RequestConfig).then(console.log).catch(console.error)
 *   请求「@/config/api.config.ts」文件中 login 路由，并携带RequestConfig内的参数
 *   此方法的请求主机和和方法均为配置中的指向，如 testServer1:post./user/login 默认指向 testServer1 主机，使用post方法请求/user/login
 * 
 * - 权重法:
 *   this.$axios.api('login').get(RequestConfig).then(console.log).catch(console.error)
 *   请求 login 路由，并携带RequestConfig内的参数，但会强制使用get方法请求，并非配置中的post请求，此时post可视为默认请求，但get为指定所以权重更高
 * 
 * - 路由参数:
 *   RequestConfig 内可传入 params 对象，如路由为 testServer1:post./user/:username/login
 *   传入 RequestConfig = { params: { username: 'slm' } } 则会被转换为 testServer1:post./user/slm/login
 *
 * - 内网请求
 *   当请求为127.0.0.1或loaclhost且前端的域非两者之一，自动将请求域替换为当前前端的域，以实现内网请求及调试
 * 
 * - 全局监听
 *   this.$axios.observer.emit(EventKey, callback)  绑定
 *   this.$axios.observer.off(EventKey, callback)   解绑
 *   EventKey: 
 *      + response.updateToken  请求响应更新token时
 *      + response.error        请求响应错误时
 *      + response.default      请求默认响应时
 * 
 * 配置方法：
 * - @/config/api.config.ts
 *   {  路由名: '服务器名:请求方法.路由' } 如 { login: 'test1:post./user/:user' } 服务器名和请求方法均为可选参数
 *   如 'post./user/:user' 或 'test1:/user/:user' 或 '/user/:user' 当请求方法不存在时默认为GET请求，当服务器名不存在时默认为主服务器
 */
// api调用
import API from '../config/api.config';
// 配置文件
import config from '../config/default.config';
// 开发环境判断
const isDEV = !0;
// token存储
let token: any = false;
// 服务器配置
const serverConfig = config.server;
// 频繁请求处理
const requestClock: any = {};
// 观察者
const observer: any = {
  /**
   * 响应
   */
  response: {
    /**
     * 更新token时
     */
    updateToken: [],
    /**
     * 响应错误时
     */
    error: [],
    /**
     * 默认
     */
    default: [],
  },
};
// 当前域
const locaHostName = window.location.hostname;
const localRegExp = /127\.0\.0\.1|localhost/;

let ObserverKey: ('response' | 'response.error' | 'response.updateToken');

export default class HttpUtil {

  private static baseUrl:string = !isDEV
  ? serverConfig.host
  : localRegExp.test(serverConfig.devHost) && !localRegExp.test(locaHostName)
    ? serverConfig.devHost.replace(localRegExp, locaHostName)
    : serverConfig.devHost
  ;


  /**
   * 发送WEB请求
   * @param method   - 请求方式
   * @param url      - 请求链接
   * @param config   - 请求参数
   */
  static async request(method: ( 'post' | 'get' | 'delete' | 'put' ) = 'get', url: string, config: any = {}, api?: string) {
      if (!token) {
        token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        if (token) {
          token = encodeURIComponent(token);
          observer.response.updateToken.forEach((cb: any) => cb(token));
        }
      } else token = encodeURIComponent(token);

      let dataStr = '';
      const { data } = config;
      Object.keys(data || {}).forEach(key => {
          dataStr += key + '=' + encodeURIComponent(data[key]) + '&';
      })

      if (dataStr !== '') {
          dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
          if (method === 'get') {
            url += '?' + dataStr;
          }
      }
      
      // 路径参数
      const params = config.params || (data && data.params);
      if (params && url) {
        for (const key in params) {
          if (params[key] !== undefined) {
            url = url.replace(`:${key}`, params[key]);
          }
        }
        delete config.params;
        if (data) delete data.params;
      }

      // 统一处理路由
      if (url) {
        const targetServer = (url.match(/^(\w+)(?=\:)/) || [])[0];
        if (targetServer) {
          const targetChild = serverConfig.children[targetServer];
          if (targetChild) {
            url = url.replace(/^(\w+)\:/, '');
            config.baseURL = !isDEV ? targetChild.host : targetChild.devHost;
          } else  throw Error(`${targetServer} 子服务器未在配置内!`);
        }
        url = url.replace(/^(post|get|put|delete)\./i, '');
      }

      
      // 频繁请求拦截
      const requestKey = method + url;
      if (requestKey) {
        const targetClock = requestClock[requestKey];
        if (targetClock && targetClock > Date.now()) {
          return Promise.reject({ error: '频繁请求拦截！' });
        }
        requestClock[requestKey] = Date.now() + 400;
      }

      url = HttpUtil.baseUrl + url;
      return new Promise((resolve, reject) => {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.open(method.toLocaleUpperCase(), url, true);
        xhr.setRequestHeader('Content-Type', `${method !== 'get' ? 'application/x-www-form-urlencoded' : 'text/plain' };charset=UTF-8`);
        xhr.setRequestHeader('token', token);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            let response = xhr.responseText;
            if (xhr.status >= 200 && xhr.status < 300) {
              const res = JSON.parse(response) || xhr;
              resolve(res);
              observer.response.default.forEach((cb: any) => cb(res, api));
            } else {
              observer.response.error.forEach((cb: any) => cb(xhr));
              reject(xhr);
            }
          }
        };
        xhr.send(method !== 'get' ? dataStr : '');
      });
  }


  /**
   * 调用API请求
   * @param api          - api
   * @param axiosRequest - 请求体
   */
  static api(api: (string | { data: any; key: string; }), axiosRequest = {}) {
    let URL: string = API[typeof api === 'string' ? api : api.key];
    // 未知API
    if (!URL) throw new Error(`api: 「${api}」在配置内未定义!`);
  
    // 动态API
    if (typeof api === 'object' && URL) {
      for (const key in api.data) {
        api.data[key] && (URL = URL.replace(`:${key}`, api.data[key]));
      }
      api = api.key;
    }
  
    const methods: any = {
      // get:        (res = {}) => HttpUtil.get(URL,    { api, ...res }),
      // put:        (res = {}) => HttpUtil.put(URL,    { api, ...res }),
      // post:       (res)      => HttpUtil.post(URL,   { api, ...res }),
      // delete:     (res)      => HttpUtil.delete(URL, { api, ...res }),
    };
  
    return {
      ...methods,
      then: async (res) => {
        const regExp = /((\w+)(?=\:))?(post|get|put|delete)(?=\.)/ig;
        const method: any = (URL.match(regExp) || [])[0];
        return await HttpUtil.request(method || 'get', URL, axiosRequest, api).then(res);
      },
    };
  }


  /**
   * axios observer
   * @param api - API库内的键
   * @param axiosRequest
   *        - 请求数据配置
   *        - 仅 api(*, *).then() 时生效
   * @return 链式操作请求方式，内部传入与axios相同，排除第一个URL
   */
  static observer() {
    return {
      emit: (
        key: typeof ObserverKey,
        cb: (param) => void,) => {
        const split = key.split('.');
        const parent = split[0];
        const child = split[1] || 'default';
        observer[parent][child].push(cb);
        return HttpUtil;
      },
      off: (
        key: typeof ObserverKey,
        cb: (param) => void,) => {
        const split = key.split('.');
        const parent = split[0];
        const child = split[1] || 'default';
        observer[parent][child].forEach((fn: any, index: number) => {
          if (cb === fn) observer[parent][child].splice(index, 1);
        });;
        return HttpUtil;
      },
    };
  }

}
