<template>
  <GameLayout class="shop" ref="gameLayout">
    <aside class="yh-gui-shop shop-tab-box">
      <div class="tab-list-box">
        <span class="yh-gui-template menu-tab props-buy" data-click="click" v-for="(item, index) in 15" :key="index"></span>
      </div>
    </aside>
    <div class="yh-gui-shop shop-list-box">

    </div>
    <aside class="yh-gui-shop shop-info-box">

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

  .shop-tab-box {
    position: relative;
    width: 11.9em;
    height: 26.6em;
    padding: 3em 2em 3em 0;
    margin-right: -.5em;
    box-sizing: border-box;

    .tab-list-box {
      width: 100%;
      height: 100%;
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
    background-position: -12.2em 0;
  }

  .shop-info-box {
    position: relative;
    width: 17em;
    height: 26.6em;
    margin-left: -.5em;
    background-position: -38em 0;
  }
}
</style>
