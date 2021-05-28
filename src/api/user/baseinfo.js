import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs";
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/auth"
const apiUser = {
    //列表
    List: function (search, fields, order, page) {
        const data = {
            search,
            fields,
            order,
            page
        }
        return request({
            url: baseUrl + '/user/list',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //提取信息
    Get: function (userId, systemCode) {
        const data = {
            userId,
            systemCode
        }
        return request({
            url: baseUrl + '/user/get',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //提取系统权限
    userRolesAuthorizeList: function (systemCode, userId, schoolCode) {
        const data = {
            systemCode,
            userId,
            schoolCode
        }
        return request({
            url: '/api/auth/user/userRolesAuthorizeList',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //用户信息
    Edit: function (data) {
        const config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
        return request.post(baseUrl + '/user/edit', data, config)
    },
    //删除用户
    Del: function (id, rolesid) {
        const data = {
            id,
            rolesid
        }
        return request({
            url: baseUrl + '/user/del',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //删除用户
    Psw: function (id, psw) {
        const data = {
            id,
            psw
        }
        return request({
            url: baseUrl + '/user/changepsw',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //删除用户
    Lock: function (id, status) {
        const data = {
            id,
            status
        }
        return request({
            url: baseUrl + '/user/lock',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //解锁用户
    unLock: function (account) {
        const data = {
            account
        }
        return request({
            url: baseUrl + '/login/unlock',
            method: 'post',
            data: qs.stringify(data)
        })
    },
}
export {
    apiUser
}