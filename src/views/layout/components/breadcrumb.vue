<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
    style=" height:34px; line-height:34px; font-size:13px"
  >
    <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
      <span
        v-if="item.redirect===curPath || item.path===curPath || item.redirect==='noRedirect'||index==levelList.length-1"
        class="no-redirect"
      >{{ item.meta.title }}</span>
      <!-- <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a> -->
      <span v-else class="no-redirect">{{ item.meta.title }}</span>

      <!--            <span class="no-redirect">{{ item.meta.title }}</span>-->
      <span v-if="index==levelList.length-1 && item.meta.desc  " class="no-redirect desc">
        <i class="el-icon-info"></i>
        {{ item.meta.desc }}
        <!--                    <svg-icon slot="prefix" icon-class="dengpao" style="font-size:12px;"/>-->
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null,
      curPath: ""
    };
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      this.curPath = this.$route.path;
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      );
      const first = matched[0];
      if (!this.isDashboard(first)) {
        matched = [{ path: "/home", meta: { title: "智能客服" } }].concat(
          matched
        );
      }

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === "home".toLocaleLowerCase();
    },
    handleLink(val) {
      this.$router.push({ path: val.path });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #666;
    cursor: text;
    font-weight: bold;
  }

  .desc {
    position: absolute;
    display: inline-block;
    right: 10px;
    color: #999;
    font-weight: normal;
  }
}

.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  font-weight: normal;
}
</style>
