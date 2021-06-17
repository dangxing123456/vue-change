import Vue from 'vue'
import {
    Encrypt
} from '@/itsoftUI/utils/dencrypt'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
import Cookies from 'js-cookie'
const loginUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/exchange"
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/exchange/user"
const clientId = Vue.prototype.$itsoftUI.config.clientId
const clientSecret = Vue.prototype.$itsoftUI.config.clientSecret
const thirdLogin = Vue.prototype.$itsoftUI.config.thirdLogin
// 登录服务层
//登录方法
export function loginAction(account, password, captcha, uuid, schoolCode) {
    //对密码进行加密处理
    password = Encrypt(password, clientSecret, clientId)
    //let psjson = Encrypt(JSON.stringify({"password": password, "code": code, "uuid": uuid}))
    return new Promise((resolve, reject) => {
        login(account, password, captcha, uuid, clientId, schoolCode).then(res => {
            //保存token
            Vue.prototype.$itsoftUI.saveTokenKey(res.data)
            //重新获取
            localStorage.removeItem("USER_INFO")
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
}
// 登录方法
export function login(account, password, captcha, uuid, clientId, schoolCode) {
    const data = {
        account,
        password,
        captcha,
        uuid,
        clientId,
        thirdLogin,
        schoolCode
    }
    return request({
        url: loginUrl + '/login/token',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

// 获取验证码
export function getCodeImg() {
    console.log(loginUrl);
    return request({
        url: loginUrl + '/login/captchaImage',
        method: 'get'
    })
}
// 修改密码
export function changePsw(id,psw) {
    psw = Encrypt(psw)
    const data = {
        id,psw
    }
    return request({
        url: loginUrl + '/user/changepsw',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 修改密码
export function changePsw2(oldpsw, newpsw) {
    newpsw = Encrypt(newpsw)
    oldpsw = Encrypt(oldpsw)
    const data = {
        oldpsw,
        newpsw
    }
    return request({
        url: loginUrl + '/user/changepsw2',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 保存表单
export function saveOrUpdate(data) {
    return request({
        url: baseUrl + "/v2/saveOrUpdate",
        method: "post",
        data: data,
        headers: {
            'content-type': 'application/json',
        },
    });
}