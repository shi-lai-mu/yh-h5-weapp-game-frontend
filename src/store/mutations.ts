export default {
  // 设置用户信息
  async SET_USER(state: any, data: any) {
    if (data) {
      state.userInfo = data;
      localStorage.setItem('userInfo', JSON.stringify(data));
    } else {
      // 清空退出
      state.userInfo = false;
      localStorage.clear();
      window.history.go(-1);
    }
  },


  /**
   * 设置屏幕数据
   */
  async SET_SCREEN(state: any, data: any) {
    state.screen = data;
  },
};
