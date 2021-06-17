/**
 * 用户TOKEN方法封装
 * Copyright (c) 2019 itsoft
 */
import Cookies from 'js-cookie'
import Config from '../config/index'
import {
    Encrypt,
    Decrypt
} from '../utils/dencrypt'
import qs from "qs";

import request from "@/itsoftUI/utils/request";
//失效时间20分钟
//const  expiresTime = new Date(new Date().getTime() + 20 * 60 * 1000);
export default {
    /**
     * 生产token
     */
    getToken() {
        let tokenBody = {}
        let strTokenKey = Cookies.get(Config.cookieKey)
        if (strTokenKey) {
            tokenBody.tokenKey = strTokenKey
            tokenBody.clientId = Config.clientId
            tokenBody.timestamp = (new Date()).valueOf()
            tokenBody.GUID = this.guid()
            let strTokenBody = JSON.stringify(tokenBody)
            //加密
            strTokenBody = Encrypt(strTokenBody, Config.clientSecret, Config.clientId)
            return strTokenBody
        }

        return ""
    },
    /**
     * 从cookie 获取 tokenKey
     */
    getTokenKey() {
        let strTokenKey = Cookies.get(Config.cookieKey)

        return strTokenKey
    },
    /**
     * 保存tokenKey
     */
    saveTokenKey(tokenKey) {
        //加密存储
        return Cookies.set(Config.cookieKey, tokenKey)
    },
    /**
     * 是否登陆
     */
    isLogin() {
        return Cookies.get(Config.cookieKey)
    },
    /**
     * 获取用户信息
     */
    async getUserInfo(auth) {
        let userInfo = localStorage.getItem("USER_INFO")
        if (userInfo) {
            userInfo = JSON.parse(Decrypt(userInfo));
        } else {
            if (!this.isLogin()) return ""
            await request({
                url: Config.serviceUrl + '/exchange/user/info',
                method: 'get'
            }).then(res => {
                localStorage.setItem("USER_INFO", Encrypt(JSON.stringify(res.data)))
                userInfo = res.data
            })
        }
        userInfo.auth = []
        if (auth) {
            //用户权限
            const data = {
                systemCode: "exchange ",
                userId: userInfo.id,
                schoolCode: userInfo.schoolcode
            }
            await request({
                url: Config.serviceUrl + '/exchange/user/userRolesAuthorizeList',
                method: 'post',
                data: qs.stringify(data)
            }).then(res => {
                // console.log(res.data)
                // console.log(res.data[0].authorize)
                console.log(res);
                // if (res.data.length > 0) {
                userInfo.auth = res.data.authorize
                console.log(userInfo);
                // }
            })
        }
        return userInfo
    },
    /**
     * 获取
     */
    userRolesAuthorizeList(systemCode, userId, schoolCode) {
        const data = {
            systemCode,
            userId,
            schoolCode
        }

        request({
            url: Config.serviceUrl + '/exchange/user/userRolesAuthorizeList',
            method: 'post',
            data: qs.stringify(data)
        }).then(res => {

            return res
        });
    },
    /**
     * 退出
     */
    logout() {
        //退出
        request({
            url: Config.serviceUrl + '/exchange/user/logout',
            method: 'get'
        }).then(res => {
            this.localLogout()
            if (Config.casLogoutUrl) {
                window.location.href = Config.casLogoutUrl
            } else {
                window.location.reload()
            }
            return res
        });
    },
    localLogout() {
        localStorage.removeItem("USER_INFO")
        Cookies.remove(Config.cookieKey)
    },
    getTimestamp() {
        return Encrypt(new Date().valueOf())
    },
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


}