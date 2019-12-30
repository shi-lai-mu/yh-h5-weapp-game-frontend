<template>
  <div :style="home" class="home">
    <!-- 背景图 -->
    <img class="bg-img" src="@/assets/time.png">

    <popup title="设 置"></popup>

    <div class="content">
      <div class="radio">
        <i class="game game-radio"></i>
        <div class="notice">
          <span>欢迎来到游惠小游戏平台！</span>
        </div>
      </div>

      <!-- 定位 -->
      <div class="location">
        <i class="game game-location"></i>
        <span>{{ location === null ? '获取失败' : location }}</span>
      </div>

      <!-- 按钮 -->
      <router-link to="feedback">
        <handleBtn iconName="反 馈" iconClass="feadback" bottom="68"/>
      </router-link>
      <handleBtn iconName="全 屏" iconClass="fangda" bottom="54" @click.native="fullScreen"/>
      <handleBtn iconName="客 服" iconClass="kefu" bottom="40" @click.native="componentId = 'service'"/>
      <handleBtn iconName="设 置" iconClass="settings" bottom="26" @click.native="componentId = 'setting'"/>

      <!-- 用户信息 -->
      <div class="flex-row">
        <div class="avatar">
          <vanImage :src="`https://perfergame.oss-cn-beijing.aliyuncs.com/avatar/${userInfo.avatarUrl ? userInfo.id : 'default'}.png?x-oss-process=style/tx`" fit="cover" />
        </div>

        <div class="user-info">
          <div class="row user-name">
            <span v-text="userInfo.nickname" class="van-ellipsis"></span>
            <img src="@/static/images/toggle_user.png" alt="" data-click="click">
          </div>
          <div class="row">
            <img src="@/static/images/yuanbao.png" alt="">
            <span v-text="userInfo.treasure"></span>
            <img src="@/static/images/txadd.png" alt="" data-click="click">
          </div>
          <div class="row">
            <img src="@/static/images/jb.png" alt="">
            <span v-text="userInfo.gold"></span>
            <img src="@/static/images/txadd.png" alt="" data-click="click">
          </div>
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
        <i class="main_ui ui_btn ui_backpack" data-click="click"></i>
        <i class="main_ui ui_btn ui_record" data-click="click"></i>
        <i class="main_ui ui_btn ui_recruiting" data-click="click"></i>
      </div>

      <!-- 右上角侧栏 -->
      <div class="top-bar">
        <i class="main_ui ui_btn ui_btn_round ui_activity" data-click="click" @click="componentId = 'activity'"></i>
        <i class="main_ui ui_btn ui_btn_round ui_shop" data-click="click"></i>
      </div>

      <!-- 左中侧栏 -->
      <ul class="left-content-bar">
        <li class="main_ui join_room" data-click="click"></li>
        <li class="main_ui create_room" data-click="click"></li>
      </ul>
    </div>

    <Popup v-if="componentId" v-model="componentPopup" @close="componentId = null" :class="[ 'component_popup', componentList[componentId].classStyle ]">
      <template>
        <div>
          <span class="popup-title css1df6a1233820fb9">{{ componentList[componentId].name }}</span>
          <i class="popup-close" @click="componentId = null" data-click="click"></i>
          <component :is="componentList[componentId].component" class="popup-content"></component>
        </div>
      </template>
    </Popup>
    <!-- <bgMusic ref="bgMusic"/> -->
  </div>
</template>

<script lang="ts">
import { Image, Popup } from 'vant';
import { State } from 'vuex-class';
import { Games } from '@/interface/home.interface';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ScreenInterface } from '@/interface/screen.interface';
// import bgMusic from '@/components/public/bgMusic.vue';
import clickMusic from '@/components/public/clickMusic.vue';
import handleBtn from '@/components/home/handleBtn.vue';
import landscape from '@/utils/screen';

@Component({
  components: {
    // bgMusic,
    handleBtn,
    Popup,
    vanImage: Image,
  },
})
export default class Home extends Vue {
  /**
   * 根组件样式
   */
  private home: ScreenInterface = {
    'width': '',
    'height': '',
    'top': '',
    'left': '',
    'transform': '',
    'transform-origin': '',
  };
  /**
   * 判断是否全屏
   */
  private isFullScreen: boolean = false;
  /**
   * 定位
   */
  private location: string | null = '';
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
  private componentList: any = {
    setting: {
      name: '设置',
      component: (resolve: any) => require([ './setting.vue' ], resolve),
    },
    service: {
      name: '客服',
      component: (resolve: any) => require([ './service.vue' ], resolve),
    },
    activity: {
      name: '活动',
      component: (resolve: any) => require([ './activity.vue' ], resolve),
    },
    email: {
      name: '邮件',
      classStyle: 'component_popup_p',
      component: (resolve: any) => require([ './email.vue' ], resolve),
    },
  };
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
    this.getCity();
    this.getGamesList();

    // 关闭拦截
    window.onbeforeunload = () => {
      return 'no'
    };
  }


  /**
   * 强制设置横屏显示，且添加监听方法
   */
  public mounted() {
    // this.$io.emit('connect/test', ['aa']);
    const resize: any = landscape.setLandscape();
    this.home = resize;
    window.addEventListener('resize', this.renderResize, false);
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
   * 获取城市信息
   */
  public getCity() {
    this.$axios
      .api('get_city')
      .then((res: any) => {
        if (res.data) {
          this.location = res.data.city;
        } else {
          this.location = null;
        }
      })
      .catch((err: any) => {
        this.location = null;
      });
  }


  /**
   * 获取天气信息
   */
  public getWeather() {
    this.$axios
      .api('get_weather')
      .then((res: any) => {
        if (res.data) {
          this.weather = res.data.forecast[0];
        } else {
          this.location = null;
        }
      })
      .catch((err: any) => {
        this.weather = null;
      });
  }


  /**
   * 移除监听
   */
  public beforeDestroy() {
    window.removeEventListener('resize', this.renderResize, false);
  }

  /**
   * 监听横竖屏变化的方法
   */
  public renderResize() {
    const resize: any = landscape.renderResize();
    this.home = resize;
  }


  /**
   * 设置全屏显示
   */
  public fullScreen() {
    const result = landscape.fullScreen(this.isFullScreen);
    this.isFullScreen = result;
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

    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding-left: 30px;

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
          margin-left: 10px;
          padding-right: 1.2rem;

          .row {
            display: flex;
            min-width: 100px;
            height: 26px;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #b2b2b2;

            img {
              width: 1.4rem;
              height: 1.4rem;
            }

            span {
              width: 60%;
              padding-left: 5px;
              font-weight: bold;
              color: #F7DE95 !important;
              letter-spacing: 2px;
            }
          }
          .user-name {
            span {
              width: 7em;
              color: #FCEFD2 !important;
            }
            .replace {
              width: 1.2rem;
              line-height: 1.2rem;
              color: #A07354;
              text-align: center;
              border-radius: 50%;
              background-image: radial-gradient(circle, #FACF9C, #ECD7C2, #fff);
              
              b {
                position: relative;
                top: 2px;
              }
            }
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
        top: 25%;
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
      background: url('../../assets/zyc_DI.png') no-repeat;
      background-size: 100%;
      overflow: hidden;

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
        display: block;
        line-height: 4.5rem;
        font-size: 2.5rem;
        font-weight: bolder;
        color: #ecd9b0;
        text-align: center;
        -webkit-text-stroke-color: #A07354;
        -webkit-text-stroke-width: .3px;
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
        background: url('../../assets/TY_btn_close.png') no-repeat;
        background-size: 100%;

        &:active {
          transform: scale(1.1);
        }
      }
    }

    .component_popup_p {
      width: 80%;
      height: 90%;
      background-image: url('../../assets/zyc_DI_1.png');

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

  .bg-img {
    width: 100%;
    height: 100%;
    transform: translate(-1px, 1px);
  }


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
