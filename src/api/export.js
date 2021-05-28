import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"

//导出
export function exportAPI(data,apiPath) {
    const config = {
        responseType: 'blob'
    }
    return request.post(Vue.prototype.$serviceUrl + apiPath, qs.stringify(data), config)
}
export function exportCSV(search,fields, header,fileName,order,groupby,apiPath) {
    const data = {
        search,
        fields,
        header,
        order,
        groupby
    }
    //调用方法
    return new Promise((resolve, reject) => {
        exportAPI(data,apiPath).then(result => {
            let blob = new Blob([result]);
            fileName = fileName+'-'+(new Date()).valueOf()+'.csv';
            let eLink = document.createElement('a');
            eLink.download = fileName;
            eLink.style.display = 'none';
            eLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href); // 释放URL 对象
            document.body.removeChild(eLink);
            setTimeout(function (){
                resolve()
            }, 1000);
        }).catch(err => {
            reject(err)
        });
    })
}

