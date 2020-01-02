export default {
  /**
   * 设置token
   */
  async SET_USER(store: any, data: any) {
    store.commit('SET_USER', data);
  },


  /**
   * 设置屏幕
   */
  async SET_SCREEN(store: any, data: any) {
    store.commit('SET_SCREEN', data);
    data.isOrientation = !!data.transform;
  },
};
