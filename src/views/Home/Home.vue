<template>
  <div :style="home" class="home" @click="handleSound">
    <img class="bg-img" src="https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/time.png">

    <div class="content">
      <div class="radio">
        <i class="game game-radio"></i>
        <div class="notice">
          <span>欢迎来到游惠小游戏平台！</span>
        </div>
      </div>

      <div class="location">
        <i class="game game-location"></i>
        <span>{{ location === null ? '获取失败' : location }}</span>
      </div>

      <handleBtn iconName="全 屏" iconClass="fangda" bottom="60" @click.native="fullScreen"/>
      <handleBtn iconName="客 服" iconClass="kefu" bottom="43"/>
      <handleBtn iconName="设 置" iconClass="settings" bottom="26"/>

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

      <div class="games-list">

        <a class="game" v-for="(item, index) of games" :key="index" :href="item.url">
          <img :src="item.icon" data-click="click">
          <span data-click="click">{{ item.name }}</span>
        </a>

        <div class="game" v-if="games.length === 5" data-click="click">
          <div class="more-games">
            <img data-click="click" src="https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/tcs.jpg" alt="">
          </div>
          <span data-click="click">更多游戏</span>
        </div>
      </div>
    </div>

    <bgMusic ref="bgMusic"/>
    <clickMusic ref="clickMusic"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ScreenInterface } from '@/interface/screen.interface';
import bgMusic from '@/components/bgMusic.vue';
import clickMusic from '@/components/clickMusic.vue';
import handleBtn from '@/components/handleBtn.vue';
import landscape from '@/utils/screen';

@Component({
  components: {
    handleBtn,
    bgMusic,
    clickMusic,
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
  private location: string | null = '';
  private games: any = [
    {
      url: '#',
      icon: 'https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/tcs.jpg',
      name: '贪吃蛇',
    },
    {
      url: '#',
      icon: 'https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/tcs.jpg',
      name: '贪吃蛇',
    },
    {
      url: '#',
      icon: 'https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/tcs.jpg',
      name: '贪吃蛇',
    },
    {
      url: '#',
      icon: 'https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/tcs.jpg',
      name: '贪吃蛇',
    },
    {
      url: '#',
      icon: 'https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/tcs.jpg',
      name: '贪吃蛇',
    },
  ];

  // 获取主页必要的信息
  private created() {
    this.getCity();
  }

  // 强制设置横屏显示，且添加监听方法
  private mounted() {
    const resize: any = landscape.setLandscape();
    this.home = resize;
    window.addEventListener('resize', this.renderResize, false);
  }

  // 事件委托
  private handleSound(e: any) {
    if (e.target.dataset.click === 'click') {
      const click: any = this.$refs.clickMusic;
      click.sound();
    }
  }

  // 获取城市信息
  private getCity() {
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

  private beforeDestroy() {
    // 移除监听
    window.removeEventListener('resize', this.renderResize, false);
  }

  // 监听横竖屏变化的方法
  private renderResize() {
    const resize: any = landscape.renderResize();
    this.home = resize;
  }

  // 设置全屏显示
  private fullScreen() {
    const result = landscape.fullScreen(this.isFullScreen);
    this.isFullScreen = result;
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
    .games-list {
      position: absolute;
      display: flex;
      top: 50%;
      right: 5%;
      width: 45%;
      max-height: 60%;
      transform: translateY(-50%);
      flex-wrap: wrap;
      justify-content: space-around;
      background-color: rgba($color: #000000, $alpha: .3);
      border-radius: 10px;

      .game {
        display: flex;
        width: 28%;
        height: 40%;
        margin: 4% 0;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        img {
          width: 5em;
          height: 5em;
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
            margin: 5px;
          }
        }

        span {
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
</style>
