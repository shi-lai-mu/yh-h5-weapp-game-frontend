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
      <handleBtn iconName="全 屏" iconClass="fangda" bottom="68" @click.native="$refs.gameLayout.fullScreen" v-if="!isIOS"/>
      <router-link to="feedback">
        <handleBtn iconName="反 馈" iconClass="feadback" bottom="54"/>
      </router-link>
      <handleBtn iconName="客 服" iconClass="kefu" bottom="40" @click.native="componentId = 'service'"/>
      <handleBtn iconName="设 置" iconClass="settings" bottom="26" @click.native="componentId = 'setting'"/>

      <!-- 用户信息 -->
      <div class="flex-row">
        <!-- <div class="avatar" @click="componentId = 'account'">
          <vanImage :src="`https://perfergame.oss-cn-beijing.aliyuncs.com/avatar/${userInfo.avatarUrl ? userInfo.id : 'default'}.png?x-oss-process=style/tx`" fit="cover" />
        </div> -->

        <!-- <div class="user-info"> -->
        <!-- </div> -->

      </div>

      <!-- 游戏列表 -->
      <gameList />

      <!-- 右下角侧栏 -->
      <BottomAside @asideClick="(id) => componentId = id" />

      <!-- 右上角侧栏 -->
      <div class="top-bar">
        <div class="row user-gem" v-text="userInfo.treasure || 0"></div>
        <div class="row user-money" v-text="userInfo.gold || 0"></div>
        <i class="yh-gui-public ui_btn_round ui_activity" data-click="click" @click="componentId = 'activity'"></i>
        <router-link class="yh-gui-public ui_btn_round ui_shop" data-click="click" tag="i" to="shop"></router-link>
      </div>

      <!-- 左中侧栏 -->
      <clannel class="left-content-bar" />
    </div>

    <Popup
      v-if="componentId"
      v-model="componentPopup"
      @close="componentId = null"
      :class="[ 'yh-gui-popup', 'component_popup', componentList[componentId].classStyle ]"
    >
      <template>
        <div>
          <span class="popup-title">{{ componentList[componentId].name }}</span>
          <i class="yh-gui-public yh-close" @click="componentId = null" data-click="click"></i>
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import GameLayout from '@/layout/game.vue';
import componentList from './config/component.popup';
import handleBtn from '@/components/home/handleBtn.vue';
import clannel from './components/channel/channel.vue';
import gameList from './components/game/list.vue';
import BottomAside from './components/navigation/index.vue';
// import { Games } from '@/interface/home.interface';
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
        top: 1em;
        left: 5.5em;
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
        }
      }

      .main_ui {
        // background: url('../../../public/Plist_MainUI.png') no-repeat;
        background-size: 410px;
      }

      .bottom-bar,
      .top-bar {
        display: flex;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 50vw;
        height: 3em;
        background-size: 410px;
        background-position-y: -259px;
        transform-origin: bottom right;
        align-items: center;
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
        position: relative;
        width: 2.4em;
        height: 2.5em;
        line-height: 3.2em;
        margin: 0 .5em;
        text-align: center;
        user-select: none;
        background-position: -8.9em -15em;
        zoom: .8;

        &::after {
          display: inline-block;
          width: 1.4em;
          height: 1.5em;
          background: inherit;
          content: '';
        }

        &:active {
          transform: scale(1.1);
        }
      }
      
      .top-bar {
        right: 1vw;
        top: 0;

        .ui_btn {
          margin: 0 .2vw;
        }

        .row {
          min-width: 100px;
          height: 2.2rem;
          line-height: 2.4rem;
          text-shadow: 2px 1px 1px #6e4d16;
          // border-bottom: 1px solid #b2b2b2;
        }

        .user-gem,
        .user-money {
          width: 8rem;
          margin-right: 1.5em;
          background: url('../../assets/sprites/game_split/gem_bar.png') no-repeat;
          background-size: 100%;
          letter-spacing: 2px;
          text-indent: 2.8rem;
          text-shadow: 2px 1px 1px #6e4d16;
          color: #F7DE95 !important;
          zoom: .8;
        }

        .user-money {
          background-image: url('../../assets/sprites/game_split/money_bar.png');
        }

        .ui_btn_round {
          transform: scale(1.2);
        }
      }
      .create_room {
        // background: url('../../assets/sprites/game_split/main_bar.png') no-repeat;
        background-position: 0 -79px;
      }

      .ui_shop::after {
        background-position: -14em -13.3em;
      }

      .ui_activity::after {
        background-position: -9.6em -13.3em;
      }
    }

    .component_popup {
      overflow: hidden;
      width: 70%;
      height: 85%;
      // background: url('../../assets/bg/zyc_DI.png') no-repeat;
      // background-size: 100%;
      // overflow: inherit;
      background-color: transparent;

      .yh-close {
        position: fixed;
        top: .5em;
        right: .5em;
        zoom: 1.3;
      }

      &::after,
      .popup-content {
        padding: .5em 2em;
        // position: absolute;
        // top: 20%;
        // right: 0;
        // bottom: 0;
        // left: 0;
        // width: 95%;
        // height: 75%;
        // margin: auto;
        // background-color: rgba($color: #ecd9b0, $alpha: .95);
        // box-shadow: 0 5px 5px #4d4533;
        // border-radius: 1rem;
        // content: '';
      }

      .popup-title {
        position: relative;
        display: block;
        z-index: 2;
        line-height: 4.5rem;
        font-size: 2rem;
        font-weight: bolder;
        color: #ecd9b0;
        text-align: center;
        -webkit-text-stroke-color: #A07354;
        -webkit-text-stroke-width: .5px;
        pointer-events: none;
      }

      .popup-content {
        z-index: 1;
        height: 20em;
        overflow-y: scroll;
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
  // @media screen and (max-height: 500px) {
  //   .left-content-bar,
  //   .flex-row,
  //   .bottom-bar {
  //     zoom: .8;
  //   }
  // }


  // // 500 中分辨率适配
  // @media screen and (max-height: 550px) {
  //   .component_popup {
  //     zoom: .8;
  //   }
  // }
</style>
