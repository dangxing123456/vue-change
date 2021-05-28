import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
const schoolIfnoUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/manager"
//餐厅班组
const encryFun = {
    //提取信息
    addEncrypt: function (str) {
        const data = {
            str
        }
        return request({
            url: schoolIfnoUrl + '/encrypt/addEncrypt',
            method: 'post',
            data: qs.stringify(data)
        })
    },

}
export {encryFun}

