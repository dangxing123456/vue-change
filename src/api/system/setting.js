import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym"
const schoolCode =Vue.prototype.$itsoftUI.config.schoolCode
//参数设置
// 列表
export function List(schoolCode,searchValue) {
    const data = {
        schoolCode,
        searchValue
    }
    return request({
        url: baseUrl+'/system/setting/list',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 列表提取多个代码(数组）
export function ListByCodes(Codes) {
    const data = {
        schoolCode,
        Codes
    }
    return request({
        url: baseUrl+'/system/setting/listcode',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 会计区间
export function GetAccountingDate() {
    const data = {
        schoolCode
    }
    return request({
        url: baseUrl+'/system/setting/accountingdate',
        method: 'post',
        data: qs.stringify(data)
    })
}
//提取信息
export function GetSetting(schoolCode,code) {
    const data = {
        schoolCode,
        code
    }
    return request({
        url:baseUrl+ '/system/setting/get',
        method: 'post',
        data: qs.stringify(data)
    })
}
//提取信息
export function GetSettingByCode(code) {
    const data = {
        schoolCode,
        code
    }
    return request({
        url:baseUrl+ '/system/setting/get',
        method: 'post',
        data: qs.stringify(data)
    })
}
//编辑
export function Edit(settings) {
    const data = {
        settings
    }

    return request({
        url:baseUrl+ '/system/setting/edit',
        method: 'post',
        data: qs.stringify(data)
    })
}

