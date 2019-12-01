<template>
  <div :style="home" class="home">

    <img class="bg-img" src="https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/time.png">
    <div class="content">
      <div class="radio">
        <i class="game game-radio"></i>
        <div class="notice">
          <span>欢迎来到游惠小游戏平台！</span>
        </div>
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
              <b>换</b>
            </div>
          </div>
          <div class="row">
            <img src="../../static/images/yuanbao.png" alt="">
            <span>5000</span>
            <img src="../../static/images/txadd.png" alt="">
          </div>
          <div class="row">
            <img src="../../static/images/jb.png" alt="">
            <span>100</span>
            <img src="../../static/images/txadd.png" alt="">
          </div>
        </div>

      </div>
    </div>

    <bgMusic ref="bgMusic"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ScreenInterface } from '@/interface/screen.interface';
import bgMusic from '@/components/bgMusic.vue';
import handleBtn from '@/components/handleBtn.vue';
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

  // 强制设置横屏显示，且添加监听方法
  private mounted() {
    const resize: any = landscape.setLandscape();
    this.home = resize;
    window.addEventListener('resize', this.renderResize, false);
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
  }
</style>
