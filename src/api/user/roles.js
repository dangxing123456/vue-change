import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs";
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/auth/roles"

//用户角色
const apiRoles = {
    //列表
    List: function (search, fields, order, page) {
        const data = {
            search,
            fields,
            order,
            page
        }
        return request({
            url: baseUrl + '/list',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //提取信息
    Get: function (id) {
        const data = {
            id
        }
        return request({
            url: baseUrl + '/get',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //编辑
    Edit: function (data) {
        const config = {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        }
        return request.post(baseUrl + '/edit', data, config)
    },
    //删除
    Del: function (id) {
        const data = {
            id
        }
        return request({
            url: baseUrl + '/del',
            method: 'post',
            data: qs.stringify(data)
        })
    },

}
export {apiRoles}
