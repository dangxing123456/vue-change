import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
// 数据字典
export function dictionary(table) {
    const data = {
        table
    }
    return request({
        url: Vue.prototype.$serviceUrl+'/cym/system/dictionary/list',
        method: 'post',
        data: qs.stringify(data)
    })
}

