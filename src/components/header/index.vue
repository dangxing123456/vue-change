<template>
  <el-header class="layout-header" style="height: 50px">
    <el-row>
      <el-col :span="18">
        <div class="header-logo-system">
          <transition name="el-zoom-in-center">
            <div v-show="vShow.opened">
              <img
                style="
                  height: 50px;
                  width: 150px;
                  float: left;
                  object-fit: cover;
                "
                :src="logoFile"
              />
            </div>
          </transition>
          <transition name="el-zoom-in-center">
            <div class="header-system" v-show="vShow.opened">
              <div>
                <div class="header-system-title">易物</div>
                <i class="el-icon-caret-bottom" />
              </div>
            </div>
          </transition>
        </div>
        <ul class="header-right" style="float: left" v-show="vShow.opened">
          <li
            v-for="(item, index) in nav"
            :key="index"
            :class="defaultActive === item.url ? 'menuActive' : ''"
            @click="handRoute(item)"
          >
            <el-dropdown
              placement="bottom"
              @command="MenuHandleCommand"
              class="hover-effect"
              trigger="click"
            >
              <div
                style="color: #f1f1f1; height: 38px; width: 100%"
                class="title"
              >
                {{ item.name }}
              </div>
              <el-dropdown-menu
                slot="dropdown"
                class="header-menu"
                style="width: 180px"
                v-if="menuShow"
              >
                <el-dropdown-item
                  v-for="(menu, index) in routes.filter(
                    (col) => col.path === item.url
                  )[0].children"
                  :divided="menu.meta.divided"
                  :command="menu.path"
                  style="margin-bottom: 5px"
                  :key="index"
                >
                  <span style="font-size: 14px">
                    <svg-icon
                      slot="prefix"
                      style="margin-right: 5px"
                      :icon-class="menu.meta.icon"
                    />
                    {{ menu.meta.title }}
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </el-col>
      <el-col :span="6">
        <transition name="el-fade-in">
          <ul class="header-right" v-show="vShow.opened">
            <el-tooltip
              class="item"
              effect="dark"
              :open-delay="openDelay"
              content="个人中心"
              placement="bottom"
            >
              <li style="padding: 0 13px" @click="funGoHome">
                <svg-icon
                  slot="prefix"
                  icon-class="home"
                  style="font-size: 20px"
                />
              </li>
            </el-tooltip>

            <!-- <el-tooltip
              class="item"
              effect="dark"
              :open-delay="openDelay"
              content="消息中心"
              placement="bottom"
            >
              <li class="header-right-message">
                <svg-icon slot="prefix" icon-class="email" style="font-size:14px; " />
                <em></em>
              </li>
            </el-tooltip>-->

            <el-tooltip
              class="item"
              effect="dark"
              :open-delay="openDelay"
              :content="isFullscreen ? '退出全屏' : '全屏显示'"
              placement="bottom"
            >
              <li @click="fullscreenClick" style="padding: 0 15px">
                <svg-icon
                  :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
                  style="font-size: 13px"
                />
              </li>
            </el-tooltip>
            <li style="padding: 0 5px; height: 50px">
              <el-dropdown
                class="avatar-container right-menu-item hover-effect"
                @command="userInfoHandleCommand"
                trigger="click"
              >
                <div class="avatar-wrapper">
                  <img src="../../assets/img/avatar.png" class="user-avatar" />
                  <div
                    class="user-name"
                    style="font-size: 13px; margin-right: 5px"
                  >
                    {{ this.userInfo.name }}
                  </div>
                  <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown" style="width: 200px">
                  <div class="userinfo">
                    <span style="float: left">{{
                      this.userInfo.schoolName
                    }}</span>
                    <span style="float: right">{{
                      this.userInfo.schoolCode
                    }}</span>
                  </div>
                  <div class="userinfo">
                    <span style="float: left">{{ this.userInfo.name }}</span>
                    <span style="float: right">{{
                      this.userInfo.account
                    }}</span>
                  </div>

                  <!-- <el-dropdown-item divided>
                    <span style="font-size:13px;">个人信息</span>
                  </el-dropdown-item>-->
                  <el-dropdown-item>
                    <el-link
                      :underline="false"
                      :href="$itsoftUI.config.systemUrl + 'account/home?type=1'"
                      target="_blank"
                      style="display: inline-block; width: 100%"
                      >安全设置</el-link
                    >
                  </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <span style="font-size:13px;">访问记录</span>
                  </el-dropdown-item>-->
                  <el-dropdown-item
                    command="logout"
                    divided
                    style="padding: 0 20px"
                  >
                    <span style="font-size: 13px">
                      <svg-icon
                        slot="prefix"
                        icon-class="tuichu"
                        style="font-size: 16px; margin-right: 5px"
                      />安全退出
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </transition>
      </el-col>
    </el-row>
    <!--        <el-button type="text" @click="logout">退出</el-button>-->
  </el-header>
</template>

<script>
import screenfull from "screenfull";
import { mapGetters } from "vuex";
import Config from "@/itsoftUI/config";
// import { SystemBaseinfoList } from "../../api/user/usercommon";
import Vue from "vue";
export default {
  name: "index",
  data() {
    return {
      openDelay: 300,
      isFullscreen: false,
      userInfo: {},
      avatar: "../../../../images/avatar.png",
      nav: Vue.prototype.$systemMenu,
      routes: [],
      index: 1,
      baseinfoList: [],
      menuShow: true,
      logoFile:
        Vue.prototype.$itsoftUI.config.fileServer +
        "/sysres/images/systemlogo/systemlogo01.png",
    };
  },
  methods: {
    // 点击左边
    leftClick() {
      if (this.index >= this.baseinfoList.length - 4) {
        return false;
      }
      this.$refs.sli.style.left = -220 * this.index + "px";
      this.$refs.sli.style.transition = "all 0.5s";
      this.index++;
    },
    //点击右边
    rightClick() {
      if (this.index == 1) {
        return false;
      }
      this.index--;
      this.$refs.sli.style.left = -220 * (this.index - 1) + "px";
      this.$refs.sli.style.transition = "all 0.5s";
    },
    //系统跳转
    goSystem(item) {
      window.open(this.$itsoftUI.config.systemUrl + item.code, "_blank");
    },
    handRoute(item) {
      this.menuShow = true;
      if (item.name == "统计报表") {
        this.report = true;
      } else {
        this.report = false;
      }
      if (item.isOpen) {
        this.menuShow = false;
        this.$router.push(item.url);
      }
    },
    getUserInfo() {
      this.$itsoftUI.getUserInfo().then((res) => {
        this.userInfo = res;
        let that = this;
        setTimeout(function () {
          that.$store.dispatch("app/togglevShow");
        }, 100);
      });
    },
    handleSelect(key, keyPath) {
      //console.log(key, keyPath);
      //this.$router.push(key);
    },
    fullscreenClick() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "不支持全屏显示",
          type: "warning",
        });
        return false;
      }
      screenfull.toggle();
    },
    MenuHandleCommand(command) {
      console.log(command);
      this.$router.push(command);
    },
    fullscreenChange() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    fullscreenInit() {
      if (screenfull.isEnabled) {
        screenfull.on("change", this.fullscreenChange);
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off("change", this.fullscreenChange);
      }
    },
    navClick(url) {
      if (
        url.substr(0, 7).toLowerCase() == "http://" ||
        url.substr(0, 8).toLowerCase() == "https://"
      ) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    userInfoHandleCommand(command) {
      switch (command) {
        case "logout":
          this.$confirm("确定要退出系统吗?", "退出系统", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$itsoftUI.logout();
            })
            .catch(() => {});
          break;
        default:
          break;
      }
    },
    funGoHome() {
      let goTo = Config.loginUrl + "/home";
      window.location.href = goTo;
    },
  },
  created() {
    this.getUserInfo();
    // SystemBaseinfoList().then((res) => {
    //   this.baseinfoList = res;
    // });
    this.routes = this.$router.options.routes;

    console.log(Vue.prototype.$systemMenu);
  },
  mounted() {
    this.fullscreenInit();
  },
  beforeDestroy() {
    this.destroy();
  },
  computed: {
    ...mapGetters(["vShow"]),

    defaultActive() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set

      if (meta.activeMenu) {
        if (meta.activeMenu.indexOf("/system/report") >= 0) {
          return "/system";
        }
        return meta.activeMenu;
      }
      if (path.indexOf("/dictionary/") >= 0) {
        return "/dictionary";
      } else if (path.indexOf("/areaInfo/") >= 0) {
        return "/areaInfo";
      } else if (path.indexOf("/areaManager/") >= 0) {
        return "/areaManager";
      } else if (path.indexOf("/shop/") >= 0) {
        return "/shop";
      } else if (path.indexOf("/system/") >= 0) {
        return "/system";
      }

      return "";
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.layout-header {
  background-color: #262626;
  color: #f7f7f7;
}

.header-logo-system {
  float: left;
  height: 50px;
  width: 272px;
  border-right: 1px solid #000;

  .header-logo {
    float: left;
    height: 50px;
    padding: 0 3px 0 15px;
    /*border-right: 1px solid #000;*/
    width: 33px;
    background: url("../../assets/img/logo.png") no-repeat center center;
  }

  .header-title {
    font-weight: bold;
    font-size: 18px;
    padding: 0;
    float: left;
    height: 50px;
    line-height: 50px;

    i {
      font-size: 12px;
      color: #ccc;
      padding-left: 5px;
    }
  }

  .header-system {
    float: left;
    cursor: pointer;
    position: relative;
    .el-icon-caret-bottom {
      position: absolute;
      right: 5px;
      top: 18px;
      font-size: 12px;
    }

    .header-system-title {
      margin-top: 15px;
      height: 23px;
      font-weight: bold;
      width: 100px;
      text-align: center;
    }

    .el-dropdown {
      padding: 0 10px 0 10px;
      color: #f7f7f7;
      font-size: 14px;
    }
  }
}

.header-system-menu {
  border-radius: 0;
  display: flex;
  justify-content: center;
  border: 1px solid rgba(27, 31, 35, 0.15);
  width: calc(100% - 13px);
  height: 30%;
  left: 0 !important;
  padding-bottom: 0;

  .header_school {
    background-color: rgba(27, 31, 35, 0.15);
    /*text-align: center;*/
    line-height: 35px;
    padding: 0 10px;
    margin-top: 10px;
  }

  .menu-system {
    // float: left;
    height: 110px;
    margin: 10px 0;
    background: #f7fafc;
    // box-shadow: 0px 0px 10px 1px rgba(139, 201, 229, 0.3);
    border-radius: 4px;
    // border: 1px solid #ebeef5;
    // webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    // }
    .img {
      // margin-top: 58px;
      img {
        width: 45px;
      }
    }
    i {
      font-size: 20px;
      margin-right: 5px;
    }
    span {
      padding: 0 10px;
    }
    .info {
      display: none;
    }
    &:hover {
      display: flex;
      align-items: center;
      // margin: 0px;
      // background: url("../../assets/img/yrbg.png");
      cursor: pointer;
      // background-size: 100% 100%;
      // background-attachment: fixed;
      background: #3787ff;
      color: #ffffff !important;

      .info {
        display: block;
      }
      .menuName {
        // display: none;
      }
      .menuName {
        margin-bottom: 10px;
      }
      .img {
        margin-top: 0;
      }
    }
  }
}

.header-nav-menu {
  height: 50px;
  float: left;
  margin-left: 10px;

  .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
  }

  .el-menu-item.is-active {
    border-bottom: 0px solid #409eff;
  }
}

.header-right {
  float: right;
  list-style: none;
  margin: 0;
  line-height: 50px;
  padding: 0;

  &:focus {
    outline: none;
  }

  .header-right-icon {
    font-size: 18px;
  }

  li {
    float: left;
    padding: 0 20px;
    cursor: pointer;

    &:hover {
      background-color: rgb(30, 30, 30);
    }
  }

  .header-right-message {
    position: relative;

    em {
      height: 6px;
      width: 6px;
      border-radius: 50%;
      background-color: #e54545;
      position: absolute;
      top: 16px;
      right: 16px;
    }
  }

  .avatar-container {
    height: 38px;

    .avatar-wrapper {
      .user-avatar {
        width: 23px;
        height: 23px;
        border-radius: 10px;
        float: left;
        margin-top: 13px;
        margin-left: 5px;
      }

      .user-name {
        float: left;
        margin-left: 10px;

        color: #f7f7f7;
      }
    }
  }
}

.right-menu {
  float: right;
  height: 100%;
  /*line-height: 50px;*/

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 10px;
      }

      .user-name {
        font-size: 12px;
        color: #ccc;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -15px;
        top: 20px;
        font-size: 12px;
        color: #ccc;
      }
    }
  }
}

.userinfo {
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  color: #999;

  span {
    font-size: 13px;
  }
}

.header-menu {
  border-radius: 0;
  border: 1px solid rgba(27, 31, 35, 0.15);

  padding-bottom: 0;
}
.menuActive {
  background-color: rgb(30, 30, 30);
  .title {
    color: #ffd04b !important;
  }
}
</style>
