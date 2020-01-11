<template>
  <GameLayout class="home" ref="gameLayout">
    <!-- 背景图 -->
    <popup title="设 置"></popup>
    <div class="bg-gem_bar" style="width: 20px;">cc</div>
    <div class="content">
      <div class="radio">
        <i class="game game-radio"></i>
        <div class="notice">
          <span>欢迎来到游惠小游戏平台！</span>
        </div>
      </div>

      <!-- 按钮 -->
      <handleBtn iconName="全 屏" iconClass="fangda" bottom="68" @click.native="$refs.gameLayout.fullScreen" v-if="!isIOS"/>
      <router-link to="feedback">
        <handleBtn iconName="反 馈" iconClass="feadback" bottom="54"/>
      </router-link>
      <handleBtn iconName="客 服" iconClass="kefu" bottom="40" @click.native="componentId = 'service'"/>
      <handleBtn iconName="设 置" iconClass="settings" bottom="26" @click.native="componentId = 'setting'"/>

      <!-- 用户信息 -->
      <div class="flex-row">
        <div class="avatar" @click="componentId = 'account'">
          <vanImage :src="`https://perfergame.oss-cn-beijing.aliyuncs.com/avatar/${userInfo.avatarUrl ? userInfo.id : 'default'}.png?x-oss-process=style/tx`" fit="cover" />
        </div>

        <div class="user-info">
          <div class="row user-gem" v-text="userInfo.treasure || 0"></div>
          <div class="row user-money" v-text="userInfo.gold || 0"></div>
        </div>

      </div>

      <!-- 游戏列表 -->
      <gameList />

      <!-- 右下角侧栏 -->
      <BottomAside />

      <!-- 右上角侧栏 -->
      <div class="top-bar">
        <i class="main_ui ui_btn ui_btn_round ui_activity" data-click="click" @click="componentId = 'activity'"></i>
        <router-link class="main_ui ui_btn ui_btn_round ui_shop" data-click="click" tag="i" to="shop"></router-link>
      </div>

      <!-- 左中侧栏 -->
      <clannel class="left-content-bar" />
    </div>

    <Popup v-if="componentId" v-model="componentPopup" @close="componentId = null" :class="[ 'component_popup', componentList[componentId].classStyle ]">
      <template>
        <div>
          <span class="popup-title">{{ componentList[componentId].name }}</span>
          <i class="popup-close" @click="componentId = null" data-click="click"></i>
          <component :is="componentList[componentId].component" class="popup-content"></component>
        </div>
      </template>
    </Popup>
    <!-- <bgMusic ref="bgMusic"/> -->
  </GameLayout>
</template>

<script lang="ts">
import { Image, Popup } from 'vant';
import { State } from 'vuex-class';
// import { Games } from '@/interface/home.interface';
import { Component, Vue, Watch } from 'vue-property-decorator';
import GameLayout from '@/layout/game.vue';
import componentList from './config/component.popup';
import handleBtn from '@/components/home/handleBtn.vue';
import clannel from './components/channel/channel.vue';
import gameList from './components/game/list.vue';
import BottomAside from './components/navigation/index.vue';
// import bgMusic from '@/components/public/bgMusic.vue';

@Component({
  components: {
    // bgMusic,
    handleBtn,
    Popup,
    GameLayout,
    vanImage: Image,
    clannel,
    gameList,
    BottomAside,
  },
})
export default class Home extends Vue {
  private isIOS: boolean = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  /**
   * 弹窗
   */
  private componentId: any = null;
  /**
   * 弹窗组件
   */
  private componentList: any = componentList;
  /**
   * 弹窗显示
   */
  private componentPopup: boolean = false;
  @Watch('componentId')
  private componentIdChanged(val: string | null) {
    this.componentPopup = !!val;
  }

  @State private userInfo!: any;


  /**
   * 获取主页必要的信息
   */
  public created() {
    // 关闭拦截
    window.onbeforeunload = () => {
      return 'no'
    };
  }


  /**
   * 打开反馈页面
   */
  public toFeadback() {
    this.$router.push({
      name: 'feedback',
    });
  }
}
</script>
<style lang="scss" scoped>
  .home {
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all 550ms ease-in-out;
    background: url('../../assets/bg/bg1.png') no-repeat center;
    background-size: cover;

    &::before {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(transparent, rgba($color: #000, $alpha: .4));
      content: '';
      pointer-events: none;
    }

    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding-left: 5px;

      .radio {
        display: flex;
        position: absolute;
        top: 5%;
        left: .5em;
        width: 40%;
        padding: 5px;
        background-color: rgba($color: #000, $alpha: .3);
        font-size: .8em;
        color: #FEEECF;
        line-height: 1.2em;
        border-radius: 2rem;

        .game-radio {
          font-size: 1.6em;
        }

        .notice {
          position: relative;
          overflow: hidden;
          width: 100%;
          margin-left: .5em;

          span {
            display: inline-block;
            color: #FEEECF;
            text-overflow: clip;
            white-space: nowrap;
            animation: carousel 7s linear infinite;
          }

          @keyframes carousel {
            0% {
              transform: translateX(200%)
            }
            100% {
              transform: translateX(-100%)
            }
          }
        }
      }

      .flex-row {
        position: absolute;
        bottom: 1%;

        .avatar {
          overflow: hidden;
          width: 4.5rem;
          height: 4.5rem;
          border: 3px solid #FBE3A5;
          border-radius: 5px;
          
          img {
            width: 3.5rem;
            height: 3.5rem;
          }
        }

        .user-info {
          height: 4.5rem;
          margin-left: 10px;
          padding-top: .2rem;
          font-weight: bold;
          color: #F7DE95 !important;
          letter-spacing: 2px;
          text-indent: 2.8rem;

          .row {
            min-width: 100px;
            height: 2.2rem;
            line-height: 2.4rem;
            text-shadow: 2px 1px 1px #6e4d16;
            // border-bottom: 1px solid #b2b2b2;

            img {
              width: 1.4rem;
              height: 1.4rem;
            }
          }

          .user-gem,
          .user-money {
            width: 8rem;
            background: url('../../assets/sprites/game_split/gem_bar.png') no-repeat;
            background-size: 100%;
          }

          .user-money {
            background-image: url('../../assets/sprites/game_split/money_bar.png');
          }
        }
      }

      .main_ui {
        background: url('../../../public/Plist_MainUI.png') no-repeat;
        background-size: 410px;
      }

      .bottom-bar,
      .top-bar {
        display: flex;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 342px;
        height: 40px;
        background-size: 410px;
        background-position-y: -259px;
        transform-origin: bottom right;
        transform: scale(1.5);
        align-items: flex-end;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .ui_btn {
        display: inline-block;
        width: 30px;
        height: 40px;
        margin: 0 1vw;
        background-size: 365px;
        transform: scale(.8) translateY(10%);

        &:active {
          transform: scale(.9) translateY(10%);
        }
      }

      .ui_btn_round {
        width: 40px;
        background-size: 295px;
      }
      
      .top-bar {
        right: 1vw;
        top: 0;
        height: 55px;

        .ui_btn {
          margin: 0 .2vw;
        }
      }
      .create_room {
        // background: url('../../assets/sprites/game_split/main_bar.png') no-repeat;
        background-position: 0 -79px;
      }

      .ui_friends {
        background-position: -100px -143px;
      }

      .ui_backpack {
        background-position: -1px -143px;
      }

      .ui_record {
        background-position: -36px -143px;
      }

      .ui_recruiting {
        background-position: -68px -143px;
      }

      .ui_shop {
        background-position: -214px -88px;
      }

      .ui_activity {
        background-position: -171px -53px;
      }

      .ui_email {
        background-position: -2px -182px;
      }
    }

    .component_popup {
      width: 70%;
      height: 85%;
      background: url('../../assets/bg/zyc_DI.png') no-repeat;
      background-size: 100%;
      overflow: inherit;

      &::after,
      .popup-content {
        position: absolute;
        top: 20%;
        right: 0;
        bottom: 0;
        left: 0;
        width: 95%;
        height: 75%;
        margin: auto;
        background-color: rgba($color: #ecd9b0, $alpha: .95);
        box-shadow: 0 5px 5px #4d4533;
        border-radius: 1rem;
        content: '';
      }

      .popup-title {
        position: relative;
        display: block;
        z-index: 2;
        line-height: 4.5rem;
        font-size: 2.5rem;
        font-weight: bolder;
        color: #ecd9b0;
        text-align: center;
        -webkit-text-stroke-color: #A07354;
        -webkit-text-stroke-width: .5px;
        pointer-events: none;
      }

      .popup-content {
        z-index: 1;
        overflow-y: scroll;
      }

      .popup-close {
        position: absolute;
        top: 12%;
        right: 1%;
        width: 6%;
        height: 10%;
        background: url('../../assets/button/TY_btn_close.png') no-repeat;
        background-size: 100%;

        &:active {
          transform: scale(1.1);
        }
      }
    }

    .component_popup_p {
      width: 80%;
      height: 90%;
      background-image: url('../../assets/bg/zyc_DI_1.png');

      &::before {
        position: absolute;
        top: -5px;
        left: 0;
        right: 0;
        width: 20rem;
        height: 20rem;
        margin: auto;
        background: url('../../assets/bg/gy_biaotilan.png') no-repeat;
        content: '';
        background-size: 100%;
        pointer-events: none;
      }

      &::after,
      .popup-content {
        height: 85%;
        top: 15%;
      }
      .popup-close {
        top: 2%;
      }
      .popup-title {
        font-size: 2rem;
        line-height: 3.5rem;
      }
    }
  }

  // .bg-img {
  //   width: 100%;
  //   height: 100%;
  //   transform: translate(-1px, 1px);
  //   background: url('../../assets/bg/time.png');
  // }


  // 500 中分辨率适配
  @media screen and (max-height: 500px) {
    .left-content-bar,
    .flex-row,
    .bottom-bar {
      zoom: .8;
    }
  }


  // 500 中分辨率适配
  @media screen and (max-height: 550px) {
    .component_popup {
      zoom: .8;
    }
  }
</style>
