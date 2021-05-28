import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym/system/category"
//商品类别
const apiCategory = {
    Edit: function (data) {
        const config = {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        }
        return request.post(baseUrl + '/edit', data, config)
    },
    // 列表
    List: function (search) {
        const data = {
            search
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
    // 删除
    Del: function (id) {
        const data = {
            id
        }
        return request({
            url: baseUrl + '/del',
            method: 'post',
            data: qs.stringify(data)
        })
    }

}
export {apiCategory}

