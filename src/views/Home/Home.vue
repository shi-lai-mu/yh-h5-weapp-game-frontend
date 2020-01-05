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
          <!-- <div class="row user-name">
            <span v-text="userInfo.nickname" class="van-ellipsis"></span>
            <img src="@/assets/button/toggle_user.png" data-click="click">
          </div> -->
          <div class="row user-gem" v-text="userInfo.treasure || 0"></div>
          <div class="row user-money" v-text="userInfo.gold || 0"></div>
        </div>

      </div>

      <!-- 游戏列表 -->
      <div class="games-list right-games">

        <a class="list" v-for="(item, index) of gamesList" :key="index" :href="item.url">
          <img :src="item.icon" data-click="click">
          <span data-click="click">{{ item.name }}</span>
        </a>

        <div class="list" v-if="moreGames.length > 0" @click="showMoreMages">
          <div class="more-games" data-click="click">
            <img data-click="click" v-for="(item, index) of smallMoreGames" :key="index" :src="item.icon" alt="">
            <i data-click="click" v-if="moreGames.length > 3" class="game game-ellipsis"></i>
          </div>
          <span data-click="click">更多游戏</span>
        </div>
      </div>

      <!-- 更多游戏弹框 -->
      <div class="popup more-games-popup" v-show="moreGamesPopup">
        <i class="game game-solid-close" data-click="click" @click="hiddenPopup"></i>

        <div class="popup-games games-list vertical-horizontal-center">
          <a class="list" v-for="(item, index) of moreGames" :key="index" :href="item.url">
            <img :src="item.icon" data-click="click">
            <span data-click="click">{{ item.name }}</span>
          </a>
        </div>
      </div>

      <!-- 右下角侧栏 -->
      <div class="main_ui bottom-bar">
        <i class="main_ui ui_btn ui_email" data-click="click" @click="componentId = 'email'"></i>
        <i class="main_ui ui_btn ui_friends" data-click="click"></i>
        <i class="main_ui ui_btn ui_backpack" data-click="click" @click="componentId = 'backpack'"></i>
        <i class="main_ui ui_btn ui_record" data-click="click"></i>
        <i class="main_ui ui_btn ui_recruiting" data-click="click"></i>
      </div>

      <!-- 右上角侧栏 -->
      <div class="top-bar">
        <i class="main_ui ui_btn ui_btn_round ui_activity" data-click="click" @click="componentId = 'activity'"></i>
        <router-link class="main_ui ui_btn ui_btn_round ui_shop" data-click="click" tag="i" :to="{ name: 'shop' }"></router-link>
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
import { Games } from '@/interface/home.interface';
import { Component, Vue, Watch } from 'vue-property-decorator';
// import bgMusic from '@/components/public/bgMusic.vue';
import clickMusic from '@/components/public/clickMusic.vue';
import handleBtn from '@/components/home/handleBtn.vue';
import GameLayout from '@/layout/game.vue';
import componentList from './config/component.popup';
import clannel from './components/channel/channel.vue';

@Component({
  components: {
    // bgMusic,
    handleBtn,
    Popup,
    GameLayout,
    vanImage: Image,
    clannel,
  },
})
export default class Home extends Vue {
  private isIOS: boolean = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  /**
   * 天气
   */
  private weather: string | null = '';
  /**
   * 更多游戏弹框
   */
  private moreGamesPopup: boolean = false;
  /**
   * 更多游戏列表
   */
  private moreGames: Games[] = [];
  /**
   * 更多列表框游戏iocn
   */
  private smallMoreGames: Games[] = [];
  /**
   * 游戏列表
   */
  private gamesList: Games[] = [];
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
    console.log(123465);
    this.getGamesList();

    // 关闭拦截
    window.onbeforeunload = () => {
      return 'no'
    };
  }


  /**
   * 获取游戏列表
   */
  public getGamesList() {
    this.$axios
      .api('get_games_list')
      .then((res: any) => {
        let moreGames: Games[] = [];
        if (res.length > 5) {
          this.gamesList = res.slice(0, 5);
          moreGames = res.slice(5);
          this.moreGames = moreGames;
          if (moreGames.length > 3) {
            this.smallMoreGames = moreGames.slice(0, 3);
          } else {
            this.smallMoreGames = moreGames;
          }
        } else {
          this.gamesList = res;
        }
      });
  }


  /**
   * 关闭弹框
   */
  public hiddenPopup() {
    this.moreGamesPopup = false;
  }


  /**
   * 显示更多游戏弹框
   */
  public showMoreMages() {
    this.moreGamesPopup = true;
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
        left: 10%;
        width: 26%;
        padding-left: 5px;
        background-color: rgba($color: #000000, $alpha: .3);
        color: #FEEECF;
        line-height: 32px;
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

      .location {
        display: flex;
        position: absolute;
        top: 15%;
        left: 10%;
        width: 20%;
        height: 24px;
        background-image: linear-gradient(to right, rgba($color: #000000, $alpha: .8), rgba($color: #000000, $alpha: 0));
        color: #FEEECF;
        line-height: 24px;
        border-radius: 2rem;
        align-items: center;

        .game {
          position: absolute;
          margin: 0 .1em;
          font-size: 1.6em;
        }

        span {
          margin-left: 2.5em;
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
            width: 130px;
            background: url('../../assets/sprites/game_split/gem_bar.png') no-repeat;
            background-size: 100%;
          }

          .user-money {
            background-image: url('../../assets/sprites/game_split/money_bar.png');
          }
        }
      }

      .right-games {
        right: 5%;
        width: 42%;
        transform: translateY(-50%);
        border: 1px solid rgba($color: #fff, $alpha: .2);
      }

      .games-list {
        position: absolute;
        top: 50%;  
        height: 55%;
        background-image: radial-gradient(transparent, rgba($color: #000, $alpha: .5));
        border-radius: 10px;
        transition: .5s;

        .list {
          display: flex;
          float: left;
          width: 33%;
          height: 40%;
          margin: 4% 0;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;

          img {
            width: 5em;
            height: 5em;
            border-radius: 13px;
          }

          .more-games {
            width: 5em;
            height: 5em;
            padding: 5px;
            border: 1px solid rgba($color: #fff, $alpha: .7);
            background-color: rgba($color: #fff, $alpha: .4);
            border-radius: 15px;
            columns: 2;

            img {
              width: 1.6em;
              height: 1.6em;
            }

            .game-ellipsis {
              float: right;
              margin-right: 4px;
              font-size: 26px;
              color: #fff;
            }
          }

          span {
            font-size: 14px;
            color: #fff;
            -webkit-text-stroke-color: #999;
            -webkit-text-stroke-width: .5px;
          }

          &:active {
            transform: scale(1.1);
            filter: brightness(1.1);
          }
        }
      }

      .more-games-popup {

        .game-solid-close {
          padding: fixed;
          top: 22.5%;
          right: 23%;
        }

        .popup-games {
          position: absolute;
          z-index: 1000;
          overflow-y: auto;
          overflow-x: hidden;
          width: 54%;
          background-image: linear-gradient(to bottom, rgba($color: #9198A2, $alpha: .8) 0%, rgba($color: #fff, $alpha: .15) 20%);

          .list {
            width: 25%;
            margin: 3% 0;
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

      .left-content-bar {
        position: absolute;
        top: 15%;
        left: 12%;
        width: 237px;

        li {
          width: 100%;
          height: 80px;
          margin-bottom: 1vh;

          &:active {
            transform: scale(1.05);
          }
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
    .games-list .list,
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
