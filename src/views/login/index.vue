<template>
  <div class="login">
    <div class="welcome" v-show="!titleShow">
      <span>
        智慧后勤
        <i>4.0</i>欢迎您
      </span>
    </div>
    <transition name="el-zoom-in-center">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        v-show="titleShow"
      >
        <div class="title">
          <span>智慧后勤</span>
          <i>4.0</i>
        </div>
        <el-form-item prop="schoolName">
          <el-input
            v-model="loginForm.schoolName"
            ref="schoolName"
            type="text"
            disabled
            placeholder="请选择学校"
            style="font-weight: bold"
          >
            <svg-icon
              slot="prefix"
              icon-class="xuexiao"
              class="el-input__icon input-icon"
            />
            <span
              slot="suffix"
              style="
                line-height: 45px;
                font-weight: normal;
                padding-right: 10px;
              "
              >{{ loginForm.schoolCode }}</span
            >
            <el-button
              v-if="!isLocal"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            ref="account"
            type="text"
            auto-complete="off"
            placeholder="账号"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item
          prop="code"
          v-show="
            this.errorCode === 1 ||
            this.errorCode === 2 ||
            this.errorCode === 99
          "
        >
          <el-input
            ref="code"
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            maxlength="4"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="yanzhengma"
              class="el-input__icon input-icon"
            />
          </el-input>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击刷新验证码"
            :open-delay="openDelay"
            placement="bottom"
          >
            <div class="login-code">
              <img :src="codeUrl" @click.stop="getCode" />
            </div>
          </el-tooltip>
          <!-- <div class="login-code">
            <img :src="codeUrl" @click="getCode" />
            哈哈
          </div>
          <span @click="getCode">哈哈</span> -->
        </el-form-item>
        <el-form-item
          style="width: 100%"
          v-show="
            this.errorCode !== 1 &&
            this.errorCode !== 2 &&
            this.errorCode !== 99
          "
        >
          <div
            style="
              font-size: 12px;
              color: #999999;
              line-height: 22px;
              padding: 0 5px;
            "
          >
            <b>温馨提醒:</b>
            登录试错超过2次需要输入验证码；超过5次系统自动锁定1小时，可联系管理员解除锁定。
          </div>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </transition>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020 itsoft All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, loginAction } from "@/api/login";
export default {
  name: "login",
  components: {},
  data() {
    return {
      // this.$itsoftUI.config.schoolName
      // this.$itsoftUI.config.schoolCode
      openDelay: 300,
      errorCode: 0,
      codeUrl: "",
      loginForm: {
        account: "",
        password: "",
        code: "",
        uuid: "",
        schoolName: "陕西师范大学",
        schoolCode: "10618",
      },
      loginRules: {
        schoolName: [
          { required: true, trigger: "blur", message: "要确定学校" },
        ],
        account: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [
          // {
          //   required: true,
          //   min: 4,
          //   trigger: "blur",
          //   message: "验证码不能为空且长度=4",
          // },
        ],
      },
      loading: false,
      redirect: undefined,
      topath: null,
      titleShow: false,
      isLocal: true,
      // this.$itsoftUI.config.schoolCode.length > 0
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
        this.topath = route.query && route.query.topath;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.show();
  },
  methods: {
    show() {
      let that = this;
      setTimeout(function () {
        that.titleShow = true;
        that.$refs.account.focus();
      }, 1500);
    },
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.data.img;
        this.loginForm.uuid = res.data.uuid;
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          loginAction(
            this.loginForm.account,
            this.loginForm.password,
            this.loginForm.code,
            this.loginForm.uuid,
            this.loginForm.schoolCode
          )
            .then(() => {
              this.loading = false;
              if (this.$route.path == "/loginlocal") {
                this.$router.push("/home");
              }
              
              if (this.topath) {
                window.location.href = this.redirect + this.topath;
              } else {
                if (!this.redirect) this.redirect = "/home";
                this.$router.push({ path: this.redirect });
              }
            })
            // http://localhost:8080/account/login?redirect=https://www.baidu.com
            .catch((error) => {
              if (error == 1 || error == 2) {
                this.loginForm.code = "";
                this.loginRules.code = [
                  {
                    required: true,
                    min: 4,
                    trigger: "change",
                    message: "验证码不能为空且长度=4",
                  },
                ];
                this.$refs.code.focus();
              } else if (error == 3 || error == 4 || error == 99) {
                this.loginForm.code = "";
                this.loginForm.password = "";
                this.$refs.password.focus();
                if (error === 99) {
                  this.loginRules.code = [
                    {
                      required: true,
                      min: 4,
                      trigger: "change",
                      message: "验证码不能为空且长度=4",
                    },
                  ];
                }
              }
              this.loading = false;
              this.getCode();
              this.errorCode = error;
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  background-image: url("../../assets/img/login.png");
  /deep/ .el-button--primary {
    background-color: #3398ff;
    border-color: #3398ff;
  }
}

.title {
  margin: 0px auto 20px auto;
  text-align: center;
  span {
    font-size: 20px;
    font-weight: bold;
    color: #707070;
  }

  i {
    margin-left: 3px;
    color: #888;
    font-size: 13px;
  }
}

.code {
  /*margin: 400px auto;*/
  width: 114px;
  height: 40px;
  /*border: 1px solid red;*/
}
.welcome {
  border-radius: 6px;
  background: #ffffff;
  width: 300px;
  height: 50px;
  padding: 20px 25px 5px 25px;
  text-align: center;
  span {
    font-weight: bold;
    font-size: 20px;
    color: #707070;
  }
  i {
    margin-left: 3px;
    margin-right: 3px;
    color: #888;
    font-size: 13px;
  }
}
.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  height: 385px;
  padding: 20px 25px 5px 25px;

  .el-input {
    height: 45px;

    input {
      height: 45px;
    }
  }

  .input-icon {
    height: 45px;
    width: 14px;
    margin-left: 4px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 34%;
  height: 42px;
  float: right;
  cursor: pointer;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
