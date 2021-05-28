import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import lrz from "lrz";
import { Message } from 'element-ui'
const Url = Vue.prototype.$itsoftUI.config.serviceUrl + "/file"
// 图片上传
export function uploadImg(req) {
    const self = this;
    let file = req.file;
    let type = file.type;
    let size = file.size;
    let pos = file.name.lastIndexOf('.');
    let filename = file.name.substring(0, pos);
    let extendName = file.name.substring(pos + 1);
    // 压缩图片
    let newFile = null
    // lrz(req.file, {
    //     quality: 1
    // }).then(rst => {
    // 压缩完成
    newFile = file
    // 创建form对象
    const fileData = new FormData()
    fileData.append("file", newFile, file.name);
    fileData.append("system", "manager");
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        // 这一段代码解决进度条不显示的问题。
        onUploadProgress: progressEvent => {
            const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
            req.onProgress({ percent: percentCompleted })
        }
    }
    request.post(Url + '/upload', fileData, config).then(res => {
        req.onSuccess(res)
    }).catch(err => {
        req.onError(err)
    })
    // }).catch(err => {
    //     req.onError(err)
    //     Message.warning("图片压缩失败，"+err);
    // })
}
//其他文件上传
export function uploadFile(req) {
    let file = req.file;
    // 创建form对象
    const fileData = new FormData()
    fileData.append("file", file, file.name);
    fileData.append("system", "manager");
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        // 这一段代码解决进度条不显示的问题。
        onUploadProgress: progressEvent => {
            const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
            req.onProgress({ percent: percentCompleted })
        }
    }
    request.post(Url + '/upload', fileData, config).then(res => {
        req.onSuccess(res)
    }).catch(err => {
        req.onError(err)
    })

}

export function uploadpic(req, hig, wid) {
    const self = this;
    let file = req.file;
    let type = file.type;
    let size = file.size;
    let pos = file.name.lastIndexOf('.');
    let filename = file.name.substring(0, pos);
    let extendName = file.name.substring(pos + 1);
    // 压缩图片
    let newFile = null
    lrz(req.file, {
        quality: 0.7,
        height: hig,
        width: wid
    }).then(rst => {
        // 压缩完成
        newFile = rst.file
        // 创建form对象
        const fileData = new FormData()
        fileData.append("file", newFile, file.name);
        fileData.append("system", "manager");
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            // 这一段代码解决进度条不显示的问题。
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                req.onProgress({ percent: percentCompleted })
            }
        }
        request.post(Url + '/upload', fileData, config).then(res => {
            req.onSuccess(res)
        }).catch(err => {
            req.onError(err)
        })
    }).catch(err => {
        req.onError(err)
        Message.warning("图片压缩失败，" + err);
    })
}
