<!--布局主工作区-->
<template>
  <router-view v-show="isShow"></router-view>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "layoutMain",
  computed: {
    ...mapGetters(["vShow"]),
    isShow() {
      return this.vShow.opened;
    }
  }
};
</script>

<style scoped>
</style>
