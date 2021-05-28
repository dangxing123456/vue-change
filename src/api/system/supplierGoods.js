import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs";
import {exportCSV} from "@/api/export";
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym/system/suppliergoods"
//供应商商品信息
const apiSupplierGoods = {
    // 列表
    List: function (search, order,page,fields) {
        const data = {
            search,
            order,
            page,
            fields
        }
        return request({
            url: baseUrl + '/list',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    //导出
    Export:function (search,fields, header,fileName,order,groupby) {
        let apiPath="/cym/system/suppliergoods/list"
        return exportCSV(search,fields, header,fileName,order,groupby,apiPath)
    },
    //添加
    Add: function (goods, supplier) {
        const data = {
            goods,
            supplier
        }
        return request({
            url: baseUrl + '/add',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    // 删除
    Del: function Del(ids) {
        const data = {
            ids
        }
        return request({
            url: baseUrl + '/del',
            method: 'post',
            data: qs.stringify(data)
        })
    },
}
export {apiSupplierGoods}
