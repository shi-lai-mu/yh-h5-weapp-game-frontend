<template>
  <div class="user-account">
    <div class="title">
      <span>{{ title }}</span>
    </div>

    <div class="input">
      <input type="text" placeholder="请输入登陆账号" v-model="account" @blur="checkAccount">
    </div>
    
    <template v-if=" handle === 'register' ">
      <div class="input">
        <input type="text" placeholder="请输入用户名" v-model="userName">
      </div>
    </template>

    <div class="input">
      <input type="text" placeholder="请输入邮箱或者手机号" v-model="mark" @blur="checkType">
    </div>
    <div class="input">
      <div>
        <input type="text" placeholder="请输入验证码" v-model="authCode" @blur="checkAuthCode">
        <van-icon name="checked" color="#27ae60" v-if="verifyAuthCode"/>
        <template v-else>
          <span class="code-btn" @click="getAuthCode" v-if="getCodeShow">{{ authText }}</span>
          <span v-else class="time-down">{{ authText }}</span>
        </template>
      </div>
    </div>
    <div class="input">
      <input type="password" placeholder="请设置登陆密码" v-model="pwd" @focus="inputPwd" @blur="blurPwd">
      <div class="notice" v-show="noticePwd">密码长度6-20位</div>
    </div>
    <div class="input">
      <input type="password" placeholder="确认密码" v-model="confirmPwd" @blur="checkPwd">
    </div>
    <van-button type="info" round @click="handleSubmit" v-if="handle === 'register'">注册</van-button>
    <van-button type="info" round @click="handleSubmit" v-else>确认修改</van-button>
    <div class="navigation">
      <router-link to="/login">
        <span>账号登录</span>
        <van-icon name="arrow" />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Toast } from 'vant';
let timer: any;

@Component
export default class UserAccount extends Vue {
  @Prop(String) private title!: string;
  @Prop(String) private handle!: string;

  private account: string = '';             // 用户登陆账号
  private userName: string = '';            // 用户名
  private mark: string = '';                // 注册号邮箱或者手机号
  private authCode: string = '';            // 用户输入的验证码
  private authText: string = '';            // 验证码按钮文字
  private sendType: string = '';            // 注册号类型
  private pwd: string = '';                 // 注册密码
  private confirmPwd: string = '';          // 确认密码
  private countDown: number = 60;           // 倒计时
  private getCodeShow: boolean = true;      // 获取验证码按钮是否显示
  private msg: string = '';                 // 验证码代码
  private verifyAuthCode: boolean = false;  // 验证码是否输入正确
  private noticePwd: boolean = false;

  // 修改密码时同步数据
  public created() {
    let user: any = localStorage.getItem('user');
    let timeDown: any = localStorage.getItem('timeDown');
    const oldTime: any = localStorage.getItem('dateNow');
    if (timeDown && oldTime) {
      const nowTime = Date.now() - oldTime;
      timeDown = timeDown - Math.ceil(nowTime / 1000);
      this.countDown = timeDown;
      this.getCodeShow = false;
      timer = setInterval( () => {
        this.TimeDown(this.countDown);
      }, 1000);
    } else {
      this.authText = '获取验证码';
    }
    if (user && this.handle === 'reset_pwd') {
      user = JSON.parse(user);
      this.account = user.account;
    }
  }

  // 检查登陆账号是否已注册过
  public checkAccount() {
    if (this.handle === 'register') {
      this.$axios
        .api('user_check', {
          data: {
            account: this.account,
          },
        })
        .then((res: any) => {
          if (res.status) {
            Toast('该账号已被注册，请换一个！');
            return false;
          } else {
            return true;
          }
        });
    }
  }

  // 验证输入的是手机号还是邮箱
  public checkType() {
    const regTel: any = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    const regEmail: any = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/;
    if (regTel.test(this.mark)) {
      this.sendType = 'sms';
      return true;
    } else if (regEmail.test(this.mark)) {
      this.sendType = 'email';
      return true;
    } else {
      Toast('输入的邮箱或者手机号不合法！');
      this.sendType = '';
      return false;
    }
  }

  // 密码长度限制
  public blurPwd() {
    const length = this.pwd.length;
    if (length >= 6 && length <= 20) {
      this.noticePwd = false;
    } else {
      this.noticePwd = true;
    }
  }

  // 提示输入密码的规范
  public inputPwd() {
    this.noticePwd = true;
  }

  // 校验输入的密码
  public checkPwd() {
    const regNull = /^\s*$/;
    if (regNull.test(this.confirmPwd)) {
      Toast('确认密码不能为空！');
      return false;
    } else if (this.pwd !== this.confirmPwd) {
      Toast('两次密码输入不一致');
      return false;
    } else {
      return true;
    }
  }

  // 获取验证码
  public getAuthCode() {
    const isCheck = this.checkType();
    if (!isCheck) {
      return;
    }
    const codeType: string = this.handle === 'register' ? 'register' : 'resetPassword';
    Toast.loading({
      message: '正在发送验证码',
      forbidClick: true,
    });
    this.$axios
      .api('get_regCode', {
        params: {
          sendType: this.sendType,
          codeType,
        },
        data: {
          recipient: this.mark,
        },
      }).then( (res: any) => {
        if (res.status) {
          Toast.clear();
          Toast('发送成功');
          this.msg = res.msg;
          this.getCodeShow = false;
          timer = setInterval( () => {
            this.TimeDown(this.countDown);
          }, 1000);
        } else {
          Toast.clear();
          Toast(res.msg);
        }
    });
  }

  // 倒计时
  public TimeDown( countDown: number ) {
    if (countDown <= 0) {
      clearInterval(timer);
      this.getCodeShow = true;
      this.countDown = 60;
      this.authText = '获取验证码';
      localStorage.removeItem('dateNow');
      localStorage.removeItem('timeDown');
      return;
    }
    const RemainingTime: number = countDown - 1;
    this.authText = RemainingTime + 's后重新获取';
    this.countDown = RemainingTime;
    const dateNow: number = Date.now();
    localStorage.setItem('dateNow', dateNow.toString());
    localStorage.setItem('timeDown', RemainingTime.toString());
  }

  // 检查验证码是否输入正确
  public checkAuthCode() {
    if (this.msg !== '') {
      this.$axios
      .api('check_code', {
        params: {
          code: this.msg,
          inputCode: this.authCode,
        },
      }).then( (res: any) => {
        if (!res.status) {
          Toast(res.msg);
          this.verifyAuthCode = false;
        } else {
          this.verifyAuthCode = true;
        }
      });
    } else {
      Toast('请输入短信验证码！');
    }
  }

  // 提交
  public handleSubmit() {
    let data: any = '';
    if (this.handle === 'register') {
      const checkAccount: any = this.checkAccount();
      data = this.checkInput();
      if (!checkAccount) { return; }
      if (!data) { return; }
    } else {
      if (this.sendType !== 'sms' && this.sendType !== 'email') {
        Toast('请检查输入的邮箱或者手机号！');
        return ;
      }
    }
    const checkPwd: any = this.checkPwd();
    if (!this.verifyAuthCode) {
      Toast('验证码错误！');
      return;
    }
    if (!checkPwd) { return; }
    this.handle === 'register' ? this.regAccount(data) : this.resetPwd();
  }

  // 注册账号
  public regAccount(data: any) {
    Toast.loading({
      message: '正在注册',
      forbidClick: true,
    });
    this.$axios
      .api('user_reg', {
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
          localStorage.setItem('user', JSON.stringify(res));
          setTimeout(() => {
            this.$router.push({
              path: '/home',
            });
          }, 1500);
        } else {
          Toast(res.error);
        }
      }).catch( (err: any) => {
        Toast.clear();
        console.log(err);
      });
  }

  // 重置密码
  public resetPwd() {
    Toast.loading({
      message: '正在修改',
      forbidClick: true,
    });
    this.$axios
      .api('reset_pwd', {
        params: {
          resetPasswordCode: this.msg,
        },
        data: {
          account: this.account,
          code: this.authCode,
          newPassword: this.pwd,
        },
      })
      .then( (res: any) => {
        Toast.clear();
        if (res.status) {
          Toast('修改成功');
          console.log(res);
          setTimeout(() => {
            this.$router.push({
              path: '/login',
            });
          }, 1500);
        } else {
          Toast(res.error);
        }
      }).catch( (err: any) => {
        Toast.clear();
        console.log(err);
      });
  }

  // 公共检测input输入部分
  public checkInput() {
    const sendType = this.sendType;
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
    } else if (sendType !== 'sms' && sendType !== 'email') {
      Toast('请检查输入的邮箱或者手机号！');
      return false;
    } else {
      return {sendType, account, nickname, recipient};
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-account {
    padding: 20px;

    .title {
      margin-bottom: 20px;
      font-size: 26px;
    }

    .input {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f6f6f6;
      flex-direction: column;

      input {
        border: 0;
      }

      .code-btn {
        color: #666;
      }
      
      .time-down{
        color: #b8b8b8;
      }

      .notice {
        color: #999;
      }
    }

    .van-button {
      width: 100%;
      margin-top: 20px;
    }
  }

  input {
    width: 66%;
    line-height: 40px;
    outline: none;
  }
</style>