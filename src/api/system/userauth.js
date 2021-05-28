import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs";
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym/system/userauth"
//用户授权
const apiUserAuth = {
    Edit: function (data) {
        const config = {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        }
        return request.post(baseUrl + '/edit', data, config)
    },
    //提取信息
    Get: function (userId) {
        const data = {
            userId
        }
        return request({
            url: baseUrl + '/get',
            method: 'post',
            data: qs.stringify(data)
        })
    },
}
export {apiUserAuth}
