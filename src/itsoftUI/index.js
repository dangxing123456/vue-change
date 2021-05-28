/**
 * 通用框架封装
 * Copyright (c) 2019 itsoft
 */
import itsoftUIRouter from './router/index'
import itsoftUIConfig from './config/index'
import itsoftToken from './auth/token'
import './icons'
export default {
    install: function (Vue, Router) {
        // 初始化router
        itsoftUIRouter.init(Router)
        // 设置vue原型链
        Vue.prototype.$itsoftUI = {
            config: itsoftUIConfig,
            getToken() {
                return itsoftToken.getToken()
            },
            getTokenKey() {
                return itsoftToken.getTokenKey()
            },
            saveTokenKey(tokenKey) {
                return itsoftToken.saveTokenKey(tokenKey);
            },
            logout() {
                return itsoftToken.logout()
            },
            async getUserInfo(auth) {
                return itsoftToken.getUserInfo(auth);
            },
            userRolesAuthorizeList(systemCode, userId, schoolCode) {
                return itsoftToken.userRolesAuthorizeList(systemCode, userId, schoolCode);
            },
            getTimestamp() {
                return itsoftToken.getTimestamp()
            }

        };
        //回车切换焦点
        Vue.directive('focusNextOnEnter', {
            bind: function (el, {
                value
            }, vnode) {
                el.addEventListener('keyup', (ev) => {
                    if (ev.key === "Enter") {
                        let nextInput = vnode.context.$refs[value]
                        if (nextInput && typeof nextInput.focus === 'function') {
                            nextInput.focus()
                            //nextInput.select()
                        }
                    }
                })
            }
        });
    }
}