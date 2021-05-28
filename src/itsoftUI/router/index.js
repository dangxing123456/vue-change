import Vue from 'vue'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import Config from '../config/index'
import Token from "../auth/token"
import request from "@/itsoftUI/utils/request";

export default {
    init: function (Router) {
        NProgress.configure({
            showSpinner: false
        }) // NProgress Configuration
        Router.beforeEach((to, from, next) => {
            // start progress bar
            NProgress.start()
            if (!Vue.prototype.$systemAuth) {
                window.location.href = Config.loginUrl + "/systemauth?system=智能客服"
            } else {
                let auth = to.meta.Auth;
                let isLogin = Token.isLogin()
                if (auth) {
                    //权限验证
                    if (!isLogin) {
                        //未登录
                        localStorage.removeItem("USER_INFO")
                        let toPath = to.path
                        if (to.path === "/authorize") {
                            toPath = "/home"
                        }
                        let goTo = Config.loginUrl + "/login?redirect=" + Config.localUrl + "&topath=" + toPath
                        window.location.href = goTo
                        // next("/login")
                    } else {
                        //判断用户
                        if (Vue.prototype.$userStatus === '0') {
                            //初始用户，需要修改密码
                            let goTo = Config.loginUrl + "/home"
                            window.location.href = goTo
                        } else if (auth === 'login') {
                            next()
                        } else if (to.meta.authorize) {
                            next()
                        } else {
                            next()
                            // if (from.path === '/authorize') {
                            //     NProgress.done()
                            // } else {
                            //     next('/authorize');
                            //     // next()
                            // }
                        }


                    }
                } else {
                    //无权限验证
                    next()
                }
            }
        })
        Router.afterEach(() => {
            // finish progress bar
            NProgress.done()
            window.scrollTo(0, 0)
        })
    }
}