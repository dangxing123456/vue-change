import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs";
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym/system/supplierdr"
//供应商供应范围信息
const apiSupplierDr = {
    // 列表
    List: function (supplier) {
        const data = {
            supplier
        }
        return request({
            url: baseUrl + '/list',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //添加
    Add: function (dr, supplier) {
        const data = {
            dr,
            supplier
        }
        return request({
            url: baseUrl + '/add',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    // 删除
    Del: function Del(id) {
        const data = {
            id
        }
        return request({
            url: baseUrl + '/del',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //添加
    All: function ( supplier,status) {
        const data = {
            supplier,status
        }
        return request({
            url: baseUrl + '/drall',
            method: 'post',
            data: qs.stringify(data)
        })
    },
}
export {apiSupplierDr}
