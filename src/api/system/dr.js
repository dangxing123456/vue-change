import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym/system/dr"
//餐厅班组
const apiDr = {
    // 列表
    List: function (parentId, schoolCode) {
        const data = {
            parentId,
            schoolCode
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
    //商品信息
    Edit: function (data) {
        const config = {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        }
        return request.post(baseUrl + '/edit', data, config)
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
    },
    // 添加库存商品所用
    ListForStock: function (schoolcode, storehouseid) {
        const data = {
            schoolcode,
            storehouseid
        }
        return request({
            url: baseUrl + '/listforstock',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    // 全部
    ListAll: function () {
        return request({
            url: baseUrl + '/listall',
            method: 'post'
        })
    },
}
export {apiDr}

