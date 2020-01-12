<template>
  <GameLayout class="shop" ref="gameLayout">
    <aside class="yh-gui-shop shop-tab-box">
      <div class="tab-list-box padding-box">
        <span class="yh-gui-template menu-tab props-buy" data-click="click" v-for="(item, index) in 15" :key="index"></span>
      </div>
    </aside>
    <div class="yh-gui-popup shop-list-box" :style="{
      width: targetGoods ? '23.2em' : 'calc(90% - 12em)'
    }">
      <div class="goods-list-box">
        <div class="goods-list" :style="{ columns: targetGoods ? 3 : 5 }">
          <span
            :class="['yh-gui-shop', 'shop-goods', { 'target-goods': targetGoods === index } ]"
            v-for="(item, index) in 20"
            :key="index"
            @click="targetGoods = index"
          >
            
          </span>
        </div>
      </div>
    </div>
    <aside class="yh-gui-shop shop-info-box" v-show="targetGoods">
      <div class="padding-box">
        <div class="absolute-center goods-png"></div>
        <div class="absolute-center goods-input-info goods-name"></div>
        <div class="absolute-center goods-input-info goods-price"></div>
        <div class="absolute-center goods-input-info goods-type"></div>
        <div class="absolute-center goods-description"></div>
      </div>
    </aside>
  </GameLayout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GameLayout from '@/layout/game.vue';

@Component({
  components: {
    GameLayout,
  },
})
export default class ShopHome extends Vue {
  /**
   * 选中的商品
   */
  private targetGoods: string = '';
}
</script>

<style scoped lang="scss">
.shop {
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(transparent, rgba($color: #000, $alpha: .9));
    content: '';
    pointer-events: none;
  }

  .padding-box {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .shop-tab-box {
    position: relative;
    width: 11.9em;
    height: 26.6em;
    padding: 2em 2em 2em 0;
    margin-right: -.8em;
    box-sizing: border-box;

    .tab-list-box {
      overflow-x: hidden;
    }

    .menu-tab {
      display: flex;
      width: 8.8em;
      height: 2em;
      margin: 0 auto .5em;
      background-size: 40em;
      background-position: -3.6em -17.4em;
      justify-content: center;
      align-items: center;

      &::after {
        display: inline-block;
        width: 6em;
        height: 1.3em;
        content: '';
        background: url('../../assets/sprites/yh_gui_shop.png') no-repeat left top;
        background-size: 55em;
      }

      &:active {
        filter: brightness(1.1);
        transform: scale(1.1);
      }
    }

    .props-buy::after {
      background-position: -6.3em -27.1em;
    }
  }

  .shop-list-box {
    position: relative;
    z-index: 2;
    width: 23.2em;
    height: 26.6em;
    padding: 2em 1.5em;
    transition: .5s;
    // background-position: -12.2em 0;

    .goods-list-box {
      height: 23.6em;
      overflow-x: hidden;
    }

    .goods-list {
      width: 100%;
      text-align: center;
    }

    .shop-goods {
      display: inline-block;
      width: 5.9em;
      height: 7.7em;
      margin-bottom: .5em;
      background-position: 0 -27.1em;
    }

    // .target-goods {
    //   // border: #07cc31 solid .1em;
    // }
  }

  .shop-info-box {
    position: relative;
    width: 17em;
    height: 26.6em;
    margin-left: -.5em;
    background-position: -38em 0;
    padding-left: 2.4em;
    box-sizing: border-box;
    
    .absolute-center {
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
    }

    .goods-input-info {
      left: 3.5em;
      width: 8.5em;
      height: 1.2em;
    }

    .goods-png {
      top: 2.5em;
      width: 8em;
      height: 5em;
      background-color: red;
    }

    .goods-name {
      top: 9em;
      background-color: red;
    }

    .goods-price {
      top: 11.5em;
      background-color: red;
    }

    .goods-type {
      top: 13.9em;
      background-color: red;
    }

    .goods-description {
      overflow-x: hidden;
      top: 16.8em;
      left: .5em;
      width: 11em;
      height: 5.5em;
      background-color: red;
    }
  }
}
</style>
