import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
import {
    exportAPI
} from "@/api/common";
// 列表
export function List(search, order, page, table, fields, groupby) {
    const data = {
        search,
        order,
        page,
        table,
        fields,
        groupby
    }
    return request({
        url: Vue.prototype.$serviceUrl + '/exchange/common/list',
        method: 'post',
        data: qs.stringify(data)
    })
}
//组织机构树列表
export function treeList(data) {
    const config = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    }
    return request.post(Vue.prototype.$itsoftUI.config.serviceUrl + "/manager/organize/tree", data, config)
}
export function SelectList(systemCode, pageSize, pageIndex, account, enablePaging) {
    const data = {
        systemCode,
        pageSize,
        pageIndex,
        account,
        enablePaging
    }
    return request({
        url: Vue.prototype.$itsoftUI.config.serviceUrl + '/exchange/user/v2/selectUserList',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function SystemBaseinfoList() {
    const data = {}
    return request({
        url: Vue.prototype.$itsoftUI.config.serviceUrl + '/exchange/user/systemBaseinfoList',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function Check(account) {
    const data = {
        account
    }
    return request({
        url: Vue.prototype.$itsoftUI.config.serviceUrl + '/exchange/user/check',
        method: 'post',
        data: qs.stringify(data)
    })
}
//提取信息
export function GetUserInfo(id, table) {
    const data = {
        id,
        table
    }
    return request({
        url: Vue.prototype.$itsoftUI.config.serviceUrl + '/exchange/common/get',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function ListSearch(search, table, fields) {
    const data = {
        search,
        table,
        fields
    }
    return request({
        url: Vue.prototype.$serviceUrl + '/exchange/common/list',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 删除
export function Del(ids, table) {
    const data = {
        ids,
        table
    }
    return request({
        url: Vue.prototype.$serviceUrl + '/exchange/common/del',
        method: 'post',
        data: qs.stringify(data)
    })
}

//提取信息
export function Get(id, table) {
    const data = {
        id,
        table
    }
    return request({
        url: Vue.prototype.$serviceUrl + '/exchange/common/get',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function exportCSV(search, table, fields, header, fileName, order, groupby) {
    const data = {
        search,
        table,
        fields,
        header,
        order,
        groupby
    }
    //调用方法
    return new Promise((resolve, reject) => {
        exportAPI(data).then(result => {
            let blob = new Blob([result]);
            fileName = fileName + '-' + (new Date()).valueOf() + '.csv';
            let eLink = document.createElement('a');
            eLink.download = fileName;
            eLink.style.display = 'none';
            eLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href); // 释放URL 对象
            document.body.removeChild(eLink);
            setTimeout(function () {
                resolve()
            }, 1000);
        }).catch(err => {
            reject(err)
        });
    })
}