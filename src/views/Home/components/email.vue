<template>
  <div>
    <collapse v-model="activeNames" accordion>
      <collapse-item :name="index" v-for="(item, index) in 20" :key="index">
        <template slot="title">
          <i class="game-youjianyidu"></i>
          <div class="email-title-content">
            <div class="email-title-box">
              <span class="email-title van-ellipsis">嘻嘻嘻嘻嘻嘻嘻嘻寻寻寻寻寻嘻嘻嘻嘻嘻嘻嘻</span>
              <span>2020-01-01</span>
            </div>
            <div class="email-info">
              <div>
                <div><i class="game-huabanfuben"></i>这是舰长</div>
                <div><i class="game-user"></i>爱酱</div>
              </div>
              <div class="email-tool">
                <Button size="small">查看</Button>
                <Button size="small">领取</Button>
              </div>
            </div>
          </div>
        </template>
        内容
      </collapse-item>
      <collapse-item name="62">
        <template slot="title">
          <i class="red-round"></i>
          <i class="game-youjianweidu"></i>
          <div class="email-title-content">
            <div class="email-title-box">
              <span class="email-title van-ellipsis">嘻嘻嘻嘻嘻嘻嘻嘻寻寻寻寻寻嘻嘻嘻嘻嘻嘻嘻</span>
              <span>2020-01-01</span>
            </div>
            <div class="email-info">
              <div>
                <div>这是舰长</div>
                <div>爱酱</div>
              </div>
              <div class="email-tool">
                <Button size="small">查看</Button>
                <Button size="small">领取</Button>
              </div>
            </div>
          </div>
        </template>
        内容
      </collapse-item>
    </collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Collapse, CollapseItem, Button } from 'vant';

@Component({
  components: {
    Collapse,
    CollapseItem,
    Button,
  },
})
export default class HomeSetting extends Vue {
  private activeNames = ['1'];

  private created() {
    console.log(123465);
  }
}
</script>

<style scoped lang="scss">
  .van-collapse-item {
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
  }

  /deep/ .van-cell,
  /deep/ .van-collapse-item__content {
    background-color: rgba($color: #fff, $alpha: .8);
  }

  /deep/ .van-icon-arrow {
    line-height: 60px;
  }

  /deep/ .van-cell__title {
    display: flex;
    height: 60px;
    align-items: center;
  }

  .email-title-content {
    flex: 100;
  }

  .email-title-box {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    .email-title {
      font-size: 1.3em;
      font-weight: 400;
    }
  }

  .email-info {
    display: flex;
    justify-content: space-between;
    color: #888;
    i {
      margin-right: 5px;
    }
  }

  .game-youjianyidu,
  .game-youjianweidu {
    margin-right: 20px;
    font-size: 40px;
    color: rgba($color: #333, $alpha: .7);
  }

  .game-youjianweidu {
    font-weight: 600;
  }

  .red-round {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 10px;
    height: 10px;
    background-color: #e20;
    border-radius: 10px;
    box-shadow: 2px 2px 5px rgba($color: #000, $alpha: .5);
  }

  .email-tool {
    display: flex;
    align-items: flex-end;

    .van-button {
      background-color: #f5d7ad;
      color: #fff;
      margin: 5px 10px;
    }
  }
</style>
