<template>
  <GameLayout class="shop" ref="gameLayout">
    <div class="yh-gui-public yh-close" data-click="click" @click="$router.go(-1)"></div>
    <aside class="yh-gui-shop shop-tab-box">
      <div class="tab-list-box padding-box">
        <span
          v-for="(item, index) in menuList"
          :key="index"
          :class="[
            'yh-gui-template',
            'menu-tab',
            { 'target-tab': targetTab === index },
            item.className ? item.className : 'props-buy',
          ]"
          @click="targetTab = index"
          data-click="click"
        ></span>
      </div>
    </aside>
    <div class="yh-gui-popup shop-list-box" :style="{
      width: targetGoods !== undefined ? '23.2em' : 'calc(90% - 12em)'
    }">
      <div class="yh-gui-template yh-gui-title shop-title"></div>
      <div class="goods-list-box">
        <div class="goods-list" :style="{ columns: targetGoods !== undefined ? 3 : 5 }">
          <span
            :class="['yh-gui-shop', 'shop-goods', { 'target-goods': targetGoods === index } ]"
            v-for="(item, index) in goods"
            :key="index"
            @click="targetGoods = index"
          >
            
          </span>
        </div>
      </div>
    </div>
    <aside class="yh-gui-shop shop-info-box" v-show="targetGoods !== undefined">
      <div class="padding-box">
        <div class="absolute-center goods-png"></div>
        <div class="absolute-center goods-input-info goods-name" v-text="goods[targetGoods].name"></div>
        <div class="absolute-center goods-input-info goods-price">
          {{ goods[targetGoods].price }}{{ goods[targetGoods].bay_currency_name }}
        </div>
        <div class="absolute-center goods-input-info goods-type">...</div>
        <div class="absolute-center goods-description" v-text="goods[targetGoods].desc"></div>
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
  watch: {
    targetTab(newTabIndex: number) {
      this
        .$axios
        .api('shio_menu_goods', {
          params: {
            menuId: newTabIndex,
          },
        })
        .then((res: any) => {
          const that: any = this;
          that.goods = res;
        })
      ;
    },
  },
})
export default class ShopHome extends Vue {
  /**
   * 选中的商品
   */
  private targetGoods: number = 0;
  /**
   * 选中的菜单
   */
  private targetTab: number = 1;
  /**
   * 菜单
   */
  private menuList = [];
  /**
   * 商品
   */
  private goods = [];


  private created() {
    this
      .$axios
      .api('shop_menu')
      .then((res: any) => {
        this.menuList = res;
      })
    ;
    this.targetTab = 0;
  }
}
</script>

<style scoped lang="scss">
$shopSprite: url('../../assets/sprites/yh_gui_shop.png') no-repeat left top;

.shop {
  display: flex;
  padding-top: 3%;
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

  .yh-close {
    position: fixed;
    top: .5em;
    right: .5em;
    zoom: 1.2;
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
        background: $shopSprite;
        background-size: 55em;
      }

      &:active {
        filter: brightness(1.1);
        transform: scale(1.1);
      }
    }

    /**
     * ICON
     */
    .props-buy::after {
      background-position: -6.3em -27.1em;
    }
    .room-card::after {
      background-position: -6.3em -28.8em;
    }
    .wing::after {
      background-position: -6.3em -30.5em;
    }
  }

  .target-tab {
    filter: brightness(1.15);
    transform: scale(1.05);
  }

  .shop-list-box {
    position: relative;
    z-index: 2;
    width: 23.2em;
    height: 26.6em;
    padding: 2em 1.5em;
    transition: .3s;
    // background-position: -12.2em 0;

    .shop-title {
      position: absolute;
      top: -1em;
      right: 0;
      left: 0;
      margin: 0 auto;

      &::after {
        display: block;
        width: 3.5em;
        height: 2.5em;
        content: '';
        background: $shopSprite;
        background-size: 40em;
        background-position: -36.4em -19.7em;
      }
    }

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

    .target-goods {
      // border: #07cc31 solid .1em;
      filter: grayscale(1.1);
    }
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
      color: #7a5e38;
      font-weight: bold;
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
    }

    .goods-name {
      top: 9em;
    }

    .goods-price {
      top: 11.5em;
    }

    .goods-type {
      top: 13.9em;
    }

    .goods-description {
      overflow-x: hidden;
      top: 16.8em;
      left: .5em;
      width: 11em;
      height: 5.5em;
    }
  }
}
</style>
