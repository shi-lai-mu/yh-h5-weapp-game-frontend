<template>
  <div class="activity-box">
    <Sidebar v-model="activeKey">
      <SidebarItem v-for="(item, index) in activity" :key="index" :title="item.title" />
    </Sidebar>
    <div class="activity-content" v-if="activity[activeKey].html">
      <span v-html="activity[activeKey].html"></span>
    </div>
    <div class="activity-content" v-else-if="activity[activeKey].pcitrue">
      <vImage
        width="100%"
        height="100%"
        fit="contain"
        :src="activity[activeKey].pcitrue"
      ></vImage>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Sidebar, SidebarItem, Image } from 'vant';
import { Activity } from '@/interface/home.interface';

@Component({
  components: {
    Sidebar,
    SidebarItem,
    vImage: Image,
  },
})
export default class HomeActivity extends Vue {
  /**
   * 当前选中的活动KEY
   */
  private activeKey: number = 0;
  /**
   * 活动数据
   */
  private activity: Activity[] = [{
    id: 0,
    title: '---',
    pcitrue: 'yh_activity_1.png',
    disable: 0,
  }];

  created() {
    this.$axios.api('home_activity').then((activityData: Activity[]) => {
      this.activity = activityData;
    });
  }
}
</script>

<style scoped lang="scss">
  .activity-box {
    display: flex;

    .van-sidebar {
      overflow-x: hidden;
      width: 25%;
      height: 100%;
      padding: 10px 0;

      .van-sidebar-item {
        font-size: 1rem;
        text-align: center;
        color: #fff;
        width: 10em;
        padding: .3rem 0 .72rem 0;
        margin-bottom: .8em;
        background-color: transparent;
        background: url(/img/yh_gui_template.5ec4f53e.png) no-repeat left top;
        background-size: 45em;
        background-position: -4.15em -19.6em;
      }

      .van-sidebar-item--select {
        border-color: transparent;
        filter: brightness(1.1);
      }
    }

    .activity-content {
      width: 75%;
    }
  }
</style>
