import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/manager/systemMenu"
//系统菜单
const apiSystemMenu = {
    //列表
    List: function () {
        return request({
            url: baseUrl + '/list',
            method: 'post'
        })
    },
}
export {apiSystemMenu}
