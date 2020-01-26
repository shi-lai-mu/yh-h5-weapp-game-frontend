import Vue, { VueConstructor } from 'vue';

export default {
  use: (vue: VueConstructor<Vue>) => {
    vue.prototype.$observer = new Vue();
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $observer: Vue;
  }
}
