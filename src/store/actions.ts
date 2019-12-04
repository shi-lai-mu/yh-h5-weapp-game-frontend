export default {
  // 设置token
  async SET_USER(store: any, data: any) {
    store.commit('SET_USER', data);
  },
};
