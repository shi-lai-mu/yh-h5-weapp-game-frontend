<template>
  <user-account title="修改密码" handle="reset_pwd"/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import userAccount from '@/components/userAccount.vue';

@Component({
  components: {
    userAccount,
  },
})
export default class Home extends Vue {
}
</script>
<style lang="scss" scoped>
</style>
