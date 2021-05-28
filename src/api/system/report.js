import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym"
//编辑报表数据
export function Edit(data) {
    const config = {
        headers: {'Content-Type': 'application/json;charset=utf-8'},
    }
    return request.post(baseUrl + '/system/report/edit', data, config)
}
