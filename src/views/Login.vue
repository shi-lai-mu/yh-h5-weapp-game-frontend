<template>
  <div class="login">
    <div class="title">
      <span>快捷登录注册</span>
    </div>
    <div class="input">
      <input type="text" placeholder="请输入邮箱或者手机号" v-model="mark" @blur="checkInput">
    </div>
    <div class="input">
      <input type="text" placeholder="请输入验证码" v-model="authCode">
      <span class="code-btn">获取动态密码</span>
    </div>
    <van-button type="info" :disabled="isDisabled" round>登陆</van-button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Login extends Vue {
  private mark: string = '';
  private authCode: string = '';
  private isDisabled: boolean = true;

  // public checkInput(){}
}
</script>
<style lang="scss" scoped>
  .login {
    padding: 20px;

    .title {
      margin-bottom: 20px;
      font-size: 26px;
    }

    .input {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f6f6f6;

      .code-btn {
        color: #666;
      }
    }

    .van-button {
      width: 100%;
      margin-top: 20px;
    }
  }

  input {
    width: 65%;
    line-height: 40px;
    outline: none;
  }
  input::-webkit-input-placeholder{
    color: #b7b7b7;
    font-size: 17px;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color: #b7b7b7;
    font-size: 17px;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color: #b7b7b7;
    font-size: 17px;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color: #b7b7b7;
    font-size: 17px;
  }
</style>