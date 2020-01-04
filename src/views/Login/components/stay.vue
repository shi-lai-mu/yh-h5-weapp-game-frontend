<template>
  <GameLayout class="login-stay">
    <div class="bottom-box">
      我已经阅读并同意《服务协议》和《隐私协议》
      <div>
        <ul class="matters-text">
          <li>抵制不良游戏</li>
          <li>拒绝盗版游戏</li>
          <li>注意自我保护</li>
          <li>谨防受骗上当</li>
          <li>适度游戏益脑</li>
          <li>沉迷游戏伤身</li>
          <li>合理安排时间</li>
          <li>享受健康生活</li>
        </ul>
        <ul class="matters-info">
          <li>文网游备字（2020）XXXXX-xx号</li>
          <li>批准文号：xxxxxx号</li>
          <li>出版物号：xxxxxxxxxxxx</li>
          <li>出版单位：杭州游惠有限公司</li>
        </ul>
      </div>
    </div>
    <div class="login-box">
      <span class="but wx-login lock"></span>
      <router-link :to="{ name: 'AccountLogin' }" class="but account-login" data-click="click"></router-link>
      <span class="but xl-login lock"></span>
    </div>
  </GameLayout>
</template>

<script lang="ts">
import GameLayout from '@/layout/game.vue';
import { State } from 'vuex-class';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
    GameLayout,
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss">
  .login-stay {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100%;
    background: url('../../../assets/bg/bg2.png') no-repeat center;
    background-size: cover;
    flex-wrap: wrap;
    flex-direction: column-reverse;

    &::after {
      position: fixed;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(transparent, rgba($color: #000, $alpha: .4));
      content: '';
      pointer-events: none;
    }

    .login-box {
      display: flex;
      width: 100%;
      justify-content: space-evenly;
    }

    .but {
      display: inline-block;
      width: 160px;
      height: 60px;
      background: url('../../../assets/sprites/login_stay_but.png') no-repeat;
      background-size: 320px;

      &:active {
        transform: scale(1.05);
        filter: brightness(1.2);
      }
    }

    .account-login {
      background-position: -158px 0;
    }

    .xl-login {
      background-position: 0 -62px;
    }

    .bottom-box {
      padding: 1%;
      margin-top: 2%;
      color: #fff;
      background-color: rgba($color: #000, $alpha: .3);
      text-align: center;
    }

    .lock {
      filter: grayscale(1);
      &::after {
        position: absolute;
        width: 34px;
        height: 40px;
        content: '';
        background: url('../../../assets/sprites/login_stay_but.png') no-repeat;
        background-size: 320px;
        background-position: -167px -69px;
      }
    }
    .matters-text,
    .matters-info {
      display: flex;
      margin-top: 10px;
      color: #aaa;
      font-size: 12px;
      justify-content: center;

      li {
        margin: 0 5px;
      }
    }
    .matters-info {
      margin-top: 0;
    }
  }
</style>
