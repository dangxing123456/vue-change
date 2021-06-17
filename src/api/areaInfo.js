import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
const baseUrl = Vue.prototype.$serviceUrl + "/exchange"
//收费类型api
export const areaInfoApi = {
    //区域信息tree
    ListTree: function (pid) {
        const data = {
            pid
        }
        return request({
            url: baseUrl + '/areaInfo/listTree',
            method: 'post',
            data: qs.stringify(data)

        })
    },
    //获取收费类型数据列表
    List: function (search, page) {
        const data = {
            search,
            page
        }
        return request({
            url: baseUrl + '/areaInfo/list',
            method: 'post',
            data: qs.stringify(data)

        })
    },
    //提取信息
    Get: function (id) {
        const data = {
            id
        };
        return request({
            url: baseUrl + "/areaInfo/get",
            method: "post",
            data: qs.stringify(data)
        });
    },

    // 删除
    Del: function (ids) {
        const data = {
            ids
        }
        return request({
            url: baseUrl + "/areaInfo/delete",
            method: "post",
            data: qs.stringify(data)
        });
    },
    save: function (data) {
        const config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
        return request.post(baseUrl + "/areaInfo/save", data, config)
    }
}