<template>
  <div class="reg">
    <div class="title">
      <span>快捷登录注册</span>
    </div>
    <div class="input">
      <input type="text" placeholder="请设置登陆账号(字母+数字)" v-model="account">
    </div>
    <div class="input">
      <input type="text" placeholder="请输入用户名" v-model="userName">
    </div>
    <div class="input">
      <input type="text" placeholder="请输入邮箱或者手机号" v-model="mark" @blur="checkType">
    </div>
    <div class="input">
      <input type="text" placeholder="请输入验证码" v-model="authCode" @blur="checkAuthCode">
      <span class="code-btn" @click="getAuthCode" v-if="getCodeShow">{{ authText }}</span>
      <span v-else class="time-down">{{ authText }}</span>
    </div>
    <div class="input">
      <input type="password" placeholder="请设置登陆密码" v-model="pwd">
    </div>
    <van-button type="info" round @click="regAccount">注册</van-button>
    <div class="login">
      <router-link to="/login">
        <span>账号登录</span>
        <van-icon name="arrow" />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Toast } from 'vant';

@Component({
  components: {
  },
})
export default class Login extends Vue {
  private account: string = '';             // 用户登陆账号
  private userName: string = '';            // 用户名
  private mark: string = '';                // 注册号邮箱或者手机号
  private authCode: string = '';            // 用户输入的验证码
  private authText: string = '获取验证码';    // 验证码按钮文字
  private codeType: string = '';            // 注册号类型
  private pwd: string = '';                 // 注册密码
  private countDown: number = 60;           // 倒计时
  private getCodeShow: boolean = true;      // 获取验证码按钮是否显示
  private msg: string = '';                 // 验证码代码
  private verifyAuthCode: boolean = false;  // 验证码是否输入正确

  // 验证输入的是手机号还是邮箱
  public checkType(): undefined {
    const regTel: any = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    const regEmail: any = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/;
    if (regTel.test(this.mark)) {
      this.codeType = 'sms';
    } else if (regEmail.test(this.mark)) {
      this.codeType = 'email';
    } else {
      Toast('输入的邮箱或者手机号不合法！');
      this.codeType = '';
      return;
    }
  }

  // 获取验证码
  public getAuthCode(): void {
    const data: any = this.checkInput();
    if (!data) { return; }
    Toast.loading({
      message: '正在发送验证码',
      forbidClick: true,
    });
    this.$axios
      .api('get_regCode')
      .get({
        params: {
          codeType: data.codeType,
        },
        data: {
          account: data.account,
          nickname: data.nickname,
          recipient: data.recipient,
        },
      }).then( (res: any) => {
        if (res.status) {
          Toast.clear();
          Toast('发送成功');
          this.msg = res.msg;
          this.getCodeShow = false;
          // 倒计时
          const timer: any = setInterval( () => {
            const countDown: number = this.countDown;
            if (countDown === 0) {
              clearInterval(timer);
              this.getCodeShow = true;
              this.countDown = 60;
              this.authText = '获取验证码';
              return;
            }
            const RemainingTime: number = countDown - 1;
            this.authText = RemainingTime + 's后重新获取';
            this.countDown = RemainingTime;
          }, 1000);
        } else {
          Toast.clear();
          Toast(res.msg);
        }
    });
  }

  // 检查验证码是否输入正确
  public checkAuthCode() {
    if (this.msg !== '') {
      this.$axios
      .api('check_code')
      .get({
        params: {
          code: this.msg,
          inputCode: this.authCode,
        },
        data: {},
      }).then( (res: any) => {
        if (!res.status) {
          Toast(res.msg);
        } else {
          this.verifyAuthCode = true;
        }
      });
    } else {
      Toast('请输入短信验证码！');
    }
  }

  // 注册账号
  public regAccount(): void {
    const data: any = this.checkInput();
    if (!data) { return; }
    if (!this.verifyAuthCode) {
      Toast('验证码错误！');
      return;
    }
    if (this.pwd === '') {
      Toast('请设置您的登陆密码！');
      return;
    }
    Toast.loading({
      message: '正在注册',
      forbidClick: true,
    });
    this.$axios
      .api('user_reg')
      .post({
        params: {
          registerCode: this.msg,
        },
        data: {
          account: data.account,
          nickname: data.nickname,
          recipient: data.recipient,
          code: this.authCode,
          password: this.pwd,
        },
      }).then( (res: any) => {
        Toast.clear();
        if (res.id) {
          Toast('注册成功');
          setTimeout(() => {
            this.$router.push({
              path: '/login',
            });
          }, 1000);
        } else {
          Toast(res.error);
        }
      }).catch( (err: any) => {
        console.log(err);
      });
  }

  // 公共检测input输入部分
  public checkInput(): any {
    const codeType = this.codeType;
    const account = this.account;
    const nickname = this.userName;
    const recipient = this.mark;
    const regAccount: any = /^[a-zA-Z0-9@.]{4,16}$/;
    const regUname: any = /^[a-zA-Z0-9\u4e00-\u9fa5_]{2,16}$/;
    if (!regAccount.test(account)) {
      Toast('请检查输入的登陆账号！');
      return false;
    } else if (!regUname.test(nickname)) {
      Toast('请检查输入的用户名！');
      return false;
    } else if (codeType !== 'sms' && codeType !== 'email') {
      Toast('输入的邮箱或者手机号不合法！');
      return false;
    } else {
      return {codeType, account, nickname, recipient};
    }
  }
}
</script>
<style lang="scss" scoped>
  .reg {
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
      
      .time-down{
        color: #b8b8b8;
      }
    }

    .van-button {
      width: 100%;
      margin-top: 20px;
    }

    .login {
      margin-top: 20px;
      text-align: center;

      a{
        position: relative;
        display: inline-block;
        width: 40%;

        .van-icon-arrow{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }

  input {
    width: 66%;
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