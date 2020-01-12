<template>
  <GameLayout class="shop" ref="gameLayout">
    <aside class="yh-gui-shop shop-tab-box">

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

  .shop-tab-box {
    width: 11.9em;
    height: 26.6em;
    margin-right: -.5em
  }

  .shop-list-box {
    position: relative;
    width: 23.2em;
    height: 26.6em;
    background-position: -12.2em 0;
  }

  .shop-info-box {
    width: 17em;
    height: 26.6em;
    margin-left: -.5em;
    background-position: -38em 0;
  }
}
</style>
