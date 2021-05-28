<template>
  <el-container style="height: 100%" direction="vertical">
    <!--头部-->
    <Header />
    <el-container style="height: 300px">
      <!--左侧菜单-->
      <!-- <el-aside v-if="isLeft" style=" width: auto; height: 100%; ">
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="defaultActive"
          :collapse="isCollapse"
          router
          unique-opened
          :collapse-transition="false"
          mode="vertical"
          :background-color="menuBg"
          :text-color="menuTextColor"
          :active-text-color="menuActiveText"
        >
          <template v-for="(item, index) in menuList">
            <el-submenu
              :index="index + ''"
              v-if="item.children && item.meta.children"
              :key="index"
            >
              <template slot="title">
                <svg-icon
                  slot="prefix"
                  :icon-class="item.meta.icon"
                  :style="
                    isCollapse
                      ? 'font-size:20px;margin-right:5px;'
                      : 'font-size:16px;margin-right:5px ;'
                  "
                />
                <span>{{ item.meta.title }}</span>
              </template>
              <el-menu-item
                v-for="(itemChild, cindex) in item.children.filter(
                  (item) => !item.meta.hidden
                )"
                :index="itemChild.path"
                :key="cindex"
                style="padding-left:20px; position: relative;"
              >
               
                <span
                  style="font-size:13px;position: absolute;top:2px;left:40px;"
                  >{{ itemChild.meta.title }}</span
                >
                <span
                  style="font-size:12px; float: left; width:100%; position: absolute; top:10px; left:40px;color:#999999"
                  >{{ itemChild.meta.remark }}</span
                >
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.path" :key="item.path" v-else>
              <i
                ><svg-icon
                  slot="prefix"
                  :icon-class="item.meta.icon"
                  :style="
                    isCollapse
                      ? 'font-size:20px; margin-right:3px;'
                      : 'font-size:16px;margin-right:3px;'
                  "
              /></i>
              <span slot="title"> {{ item.meta.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside> -->
      <el-container style="height: 100%" direction="vertical">
        <!--主工作区头部-->
        <layout-main-top :toggle-icon="isLeft" />
        <!--主工作区-->
        <layout-main style="height: 100%" />
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import Header from '@/components/header/index'
import layoutMain from '@/views/layout/components/layoutMain'
import layoutMainTop from '@/views/layout/components/layoutMainTop'
import { constantRoutes } from '@/router'
import { mapGetters } from 'vuex'
export default {
  name: 'systemLayout',
  components: { Header, layoutMain, layoutMainTop },
  data() {
    return {
      menuList: null,
      SelectMenu: null,
      menuBg: '#333',
      menuTextColor: '#f7f7f7',
      menuActiveText: '#ffd04b',
      msg: this.$route.params.msg,
      isLeft: true,
    }
  },
  methods: {
    getMenu() {
      if (this.$route.path.indexOf('/index') > 0) {
        this.isLeft = false
      } else {
        this.isLeft = true
      }
      this.menuList = []
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.parent
      )
      if (matched.length > 0) {
        let route = constantRoutes.filter(
          (item) => !item.hidden && item.meta.parent === matched[0].meta.parent
        )
        if (route.length > 0) {
          //生成相关报表菜单
          let menu = route[0].children
          let report = menu.filter((item) => item.meta.report)

          if (report && report.length > 0) {
            let item = report[0]
            item.children = []
            //获取报表数据

            this.menuList = menu
          } else {
            this.menuList = menu
          }
        }
      }
    },
  },
  created() {
    this.getMenu()
  },
  watch: {
    //监测路由变化，只要变化了就调用路由参数方法将数据存储本组件即可
    $route: 'getMenu',
  },
  computed: {
    ...mapGetters(['leftmenu', 'vShow']),
    isCollapse() {
      return !this.leftmenu.opened
    },
    defaultActive() {
      const route = this.$route
      const { meta, path } = route

      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
  },
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
}

// menu hover
.submenu-title-noDropdown,
.el-submenu__title {
  &:hover {
    background-color: #263445 !important;
  }
}

.is-active > .el-submenu__title {
  color: #ffd04b !important;
}

.nest-menu .el-submenu > .el-submenu__title,
.el-submenu .el-menu-item {
  background-color: #262626 !important;

  &:hover {
    background-color: #444 !important;
  }
}

.el-scrollbar__view {
  height: 100%;
}
</style>
