import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import axios from '@/lib/axios';
import Vant from 'vant';
import 'vant/lib/index.css';
import { AxiosInstance } from 'axios';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}


Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

Vue.use(Vant);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
