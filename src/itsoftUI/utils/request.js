import axios from 'axios'
import {
    Message
} from 'element-ui'
import Token from "../auth/token"
import Config from "@/itsoftUI/config";
import {
    Encrypt
} from "@/itsoftUI/utils/dencrypt"
import qs from "qs"

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    // 超时
    timeout: 20000
})
// request拦截器
service.interceptors.request.use(
    config => {
        //判断是否初次加载
        if (config.url.indexOf("config.json") === -1) {
            let token = Token.getToken()
            let tokenKey = Token.getTokenKey()
            if (token) {
                config.headers['Token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
                config.headers['TokenKey'] = tokenKey
            }
            // let RequestData = qs.parse(config.data)
            // let cnt = 0
            // try {
            //     Object.getOwnPropertyNames(RequestData).forEach(function (key) {
            //         if (key === 'search' || key === 'fields' || key === 'order' || key === 'table' ||
            //             key === 'page' || key === 'groupby') {
            //             RequestData[key] = Encrypt(RequestData[key], tokenKey.substring(0, 16), tokenKey.substring(tokenKey.length - 16, tokenKey.length))
            //             cnt++
            //         }
            //     });
            //     if (cnt > 0) {
            //         config.data = qs.stringify(RequestData)
            //     }
            // } catch (e) {
            //     //异常
            // }
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        if (response.data.status) {
            let status = response.data.status
            if (status === "success") {
                return response.data;
            } else {
                let errorCode = response.data.errorCode
                if (errorCode >= 4010 && errorCode <= 4014) {
                    alert(errorCode)
                    //登录失效 重新登录
                    // Token.localLogout()
                    // window.location.reload()
                } else {
                    Message({
                        showClose: true,
                        message: response.data.message + '-' + response.data.errorCode,
                        type: 'error'
                    });
                }
                return Promise.reject(response.data.errorCode)
            }
        } else {
            return response.data;
        }

    },
    error => {
        Message({
            showClose: true,
            message: 'E>>>' + error.message,
            type: 'error'
        });
        return Promise.reject(error)

    }
)

export default service