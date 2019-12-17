<template>
  <div :style="home" class="home">
    <!-- 背景图 -->
    <img class="bg-img" src="https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/time.png">

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
      <handleBtn iconName="全 屏" iconClass="fangda" bottom="60" @click.native="fullScreen"/>
      <handleBtn iconName="客 服" iconClass="kefu" bottom="43"/>
      <handleBtn iconName="设 置" iconClass="settings" bottom="26"/>

      <!-- 用户信息 -->
      <div class="flex-row">
        <div class="avatar">
          <img src="../../static/images/avater.jpeg" alt="">
        </div>

        <div class="user-info">
          <div class="row user-name">
            <span>雨泽</span>
            <div class="replace">
              <b data-click="click">换</b>
            </div>
          </div>
          <div class="row">
            <img src="../../static/images/yuanbao.png" alt="">
            <span>5000</span>
            <img src="../../static/images/txadd.png" alt="" data-click="click">
          </div>
          <div class="row">
            <img src="../../static/images/jb.png" alt="">
            <span>100</span>
            <img src="../../static/images/txadd.png" alt="" data-click="click">
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
    </div>

    <bgMusic ref="bgMusic"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ScreenInterface } from '@/interface/screen.interface';
import { Games } from '@/interface/home.interface';
import bgMusic from '@/components/public/bgMusic.vue';
import clickMusic from '@/components/public/clickMusic.vue';
import handleBtn from '@/components/home/handleBtn.vue';
import landscape from '@/utils/screen';

@Component({
  components: {
    handleBtn,
    bgMusic,
  },
})
export default class Home extends Vue {
  // 根组件样式
  private home: ScreenInterface = {
    'width': '',
    'height': '',
    'top': '',
    'left': '',
    'transform': '',
    'transform-origin': '',
  };
  private isFullScreen: boolean = false; // 判断是否全屏
  private location: string | null = ''; // 定位
  private weather: string | null = ''; // 天气
  private moreGamesPopup: boolean = false; // 更多游戏弹框
  private moreGames: Games[] = []; // 更多游戏列表
  private smallMoreGames: Games[] = []; // 更多列表框游戏iocn
  private gamesList: Games[] = []; // 游戏列表

  // 获取主页必要的信息
  public created() {
    this.getCity();
    this.getWeather();
    this.getGamesList();
  }

  // 强制设置横屏显示，且添加监听方法
  public mounted() {
    this.$io.emit('connect/test', ['aa']);
    const resize: any = landscape.setLandscape();
    this.home = resize;
    window.addEventListener('resize', this.renderResize, false);
  }

  // 获取游戏列表
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

  // 获取城市信息
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
        console.log(err);
        this.location = null;
      });
  }

  // 获取天气信息
  public getWeather() {
    this.$axios
      .api('get_weather')
      .then((res: any) => {
        console.log(res.data.forecast);
        if (res.data) {
          this.weather = res.data.forecast[0];
        } else {
          this.location = null;
        }
      })
      .catch((err: any) => {
        console.log(err);
        this.weather = null;
      });
  }

  public beforeDestroy() {
    // 移除监听
    window.removeEventListener('resize', this.renderResize, false);
  }

  // 监听横竖屏变化的方法
  public renderResize() {
    const resize: any = landscape.renderResize();
    this.home = resize;
  }

  // 设置全屏显示
  public fullScreen() {
    const result = landscape.fullScreen(this.isFullScreen);
    this.isFullScreen = result;
  }

  // 关闭弹框
  public hiddenPopup() {
    this.moreGamesPopup = false;
  }

  // 显示更多游戏弹框
  public showMoreMages() {
    this.moreGamesPopup = true;
  }
}
</script>
<style lang="scss" scoped>
  .home {
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all 550ms ease-in-out;
  }
  .bg-img {
    width: 100%;
    height: 100%;
    transform: translate(-1px, 1px);
  }
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
        width: 17%;
        font-size: 20px;
      }

      .notice {
        position: relative;
        top: 2px;
        overflow: hidden;
        width: 82%;
        height: 32px;
        

        span {
          display: inline-block;
          color: #FEEECF;
          text-overflow: clip;
          white-space: nowrap;
          animation: carousel 7s linear infinite;
        }

        @keyframes carousel {
          0% {
            transform: translateX(100%)
          }
          100% {
            transform: translateX(-100%)
          }
        }
      }
    }

    .location {
      position: absolute;
      top: 15%;
      left: 10%;
      width: 13%;
      height: 24px;
      background-image: linear-gradient(to right, rgba($color: #000000, $alpha: .8), rgba($color: #000000, $alpha: 0));
      color: #FEEECF;
      line-height: 24px;
      border-radius: 2rem;

      .game {
        position: absolute;
        left: -5%;
        top: -10%;
        font-size: 26px;
      }

      span {
        margin-left: 30%;
      }
    }

    .flex-row {
      position: absolute;
      bottom: 3%;

      .avatar {
        overflow: hidden;
        width: 3.5rem;
        height: 3.5rem;
        border: 3px solid #FBE3A5;
        border-radius: 5px;
        
        img {
          width: 3.5rem;
          height: 3.5rem;
        }
      }

      .user-info {
        margin-left: 10px;

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
    }
    .games-list {
      position: absolute;
      top: 50%;  
      height: 55%;
      background-color: rgba($color: #000000, $alpha: .3);
      border-radius: 10px;

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
          border: 1px solid rgba($color: #fff, $alpha: .7);
          background-color: rgba($color: #fff, $alpha: .4);
          border-radius: 15px;

          img {
            width: 1.8em;
            height: 1.8em;
            margin: 2px 4px;
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
  }
</style>
