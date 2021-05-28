import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
//获取字段
export function ListField(table) {
    const data = {
        table
    }
    return request({
        url: Vue.prototype.$serviceUrl + '/services/common/gettablecolumns',
        method: 'post',
        data: qs.stringify(data)
    })
}
//获取数据字典Dict，根据表判断是否需要强制授权，比如库房,餐厅
export function ListDict(table,fields) {
    const data = {
        table,
        fields
    }
    return request({
        url: Vue.prototype.$serviceUrl + '/services/common/listdict',
        method: 'post',
        data: qs.stringify(data)
    })
}
