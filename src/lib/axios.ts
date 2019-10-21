/**
 * Axios 请求二次封装 ts版本[未启用加密版]
 */

import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
// get数据
import axiosQs from 'qs';
// api调用
import API from '../config/api.config';
// 配置文件
import config from '../config/default.config';
// token存储
let token = false;
// 判断是否为服务端的请求
// const isServer = process.title === 'node';

// 创建axios实例
const $axios: AxiosInstance = axios.create({
  baseURL: config.server.api,
  timeout: 15000,
  // withCredentials: true
});

$axios.interceptors.response.use(
  (res: any) => {
    const { data } = res;
    // token 自动化更新
    if (data.token) {
      token = data.token;
    }
    return data;
  },
);

$axios.interceptors.request.use(
  (value: AxiosRequestConfig) => {
    const data = value.data;
    if (!token) {
    // if (!token && !isServer) {
      token = JSON.parse(localStorage.getItem('user') || '{}').token;
    } else {
      value.headers.token = encodeURIComponent(token);
    }

    if (data) {
      // RSA 加密处理
      const rsa = data.rsa;
      delete value.data.rsa;
      for (const key in rsa) {
        if (rsa[key] && key in data) {
          throw new Error(`RSA.${key} there is Data in the!`);
        }
      }

      // GET 数据处理
      if (value.method === 'get') {
        value.url += `?${axiosQs.stringify(data)}`;
        value.data = '';
      }
    }

    // post 处理
    const postData = value.data;
    if (value.method !== 'get' && postData.api) {
      value.data = {
        token,
        ...value.data.data,
      };
      delete value.data.api;
    }

    // 路径参数
    const params = value.params || (data && data.params);
    if (params && value.url) {
      for (const key in params) {
        if (params[key] !== undefined) {
          value.url = value.url.replace(`:${key}`, params[key]);
        }
      }
      delete value.params;
      delete data.params;
    }
    return value;
  },
);

/**
 * axios API request
 * @param {string/object} api API库内的键
 * @return 链式操作请求方式，内部传入与axios相同，排除第一个URL
 */
$axios.api = (api: (string | { data: any; key: string; })) => {
  let URL: string = API[typeof api === 'string' ? api : api.key];

  // 动态API
  if (typeof api === 'object' && URL) {
    for (const key in api.data) {
      if (api.data[key]) {
        URL = URL.replace(`:${key}`, api.data[key]);
      }
    }
    api = api.key;
  }

  return {
    get: (res = {}) => $axios.get(URL, { api, ...res }),
    post: (res: AxiosRequestConfig) => $axios.post(URL, { api, ...res }),
    put: (res: AxiosRequestConfig = {}) => $axios.put(URL, { api, ...res }),
    delete: (res) => $axios.delete(URL, { api, ...res }),
    then: async (res)  => await $axios.get(URL, { api }).then(res),
  };
};

export default $axios;

declare module 'axios/index' {
  interface AxiosInstance {
    api: (api: (string | { data: any; key: string; })) => {
      get: (res?: AxiosRequestConfig) => Promise<any>;
      post: (res: AxiosRequestConfig) => Promise<any>;
      delete: (res: AxiosRequestConfig) => Promise<any>;
      put: (res: AxiosRequestConfig) => Promise<any>;
      then: (res: any) => Promise<any>;
    };
  }

  interface AxiosRequestConfig {
    api?: string | { data: any; key: string; };
  }
}
