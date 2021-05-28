import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
import {exportCSV} from "@/api/export";
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym/system/goods"
//商品信息
const apiGoods = {
    //编辑
    Edit: function (data) {
        const config = {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        }
        return request.post(baseUrl + '/edit', data, config)
    },
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
    //导出
    Export:function (search,fields, header,fileName,order,groupby) {
        let apiPath="/cym/system/goods/list"
        return exportCSV(search,fields, header,fileName,order,groupby,apiPath)
    },
    // 添加库存商品所用
    ListForStock:function (schoolcode, categorycode, storehouseid, finds) {
        const data = {
            schoolcode,
            categorycode,
            storehouseid,
            finds
        }
        return request({
            url: baseUrl + '/listforstock',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    // 添加供应商商品所用
    ListForSupplier:function (schoolcode, categorycode, supplierid, finds) {
        const data = {
            schoolcode,
            categorycode,
            supplierid,
            finds
        }
        return request({
            url: baseUrl + '/listforsupplier',
            method: 'post',
            data: qs.stringify(data)
        })
    }
}
export {apiGoods}

