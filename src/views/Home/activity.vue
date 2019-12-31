<template>
  <div class="activity-box">
    <Sidebar v-model="activeKey">
      <SidebarItem title="标签名称" />
      <SidebarItem title="标签名称" />
      <SidebarItem title="标签名称" />
      <SidebarItem title="标签名称" />
      <SidebarItem title="标签名称" />
      <SidebarItem title="标签名称" />
    </Sidebar>
    <div class="activity-content">
      活动公告{{ activeKey }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Sidebar, SidebarItem } from 'vant';

@Component({
  components: {
    Sidebar,
    SidebarItem,
  },
})
export default class HomeActivity extends Vue {
  private activeKey: number = 0;
}
</script>

<style scoped lang="scss">
  .activity-box {
    display: flex;

    .van-sidebar {
      overflow-x: hidden;
      width: 25%;
      height: 100%;
      margin: 10px 0;

      .van-sidebar-item {
        font-size: 1rem;
        text-align: center;
        color: #fff;
        padding: 1.1rem 12px 1rem 8px;
        background-color: transparent;
        background: url('../../assets/CKZJ_ANNIU01.png') no-repeat center;
        background-size: 100%;
      }

      .van-sidebar-item--select {
        background-image: url('../../assets/CKZJ_ANNIU02.png');
        border: 0;
      }
    }

    .activity-content {
      width: 75%;
    }
  }
</style>
