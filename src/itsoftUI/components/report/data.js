/* eslint-disable */
import Vue from 'vue'
import request from '@/itsoftUI/utils/request'
import qs from "qs"
import {ItSoftUtil} from "@/itsoftUI/utils/ItSoftUtil"
import {clearMilliseconds} from "element-ui/src/utils/date-util";
const baseUrl = Vue.prototype.$itsoftUI.config.serviceUrl + "/cym"

export function itrFn(value, param) {
    let SDate,EDate
    let d
    let fn = new Promise((resolve) => {
        switch (value) {
            case "nowdate":
                //当前日期
                return resolve(ItSoftUtil.dateFormat( new Date(),"yyyy-MM-dd"))
            case "nowdatetime":
                //当前日期和时间
                return resolve(ItSoftUtil.dateFormat( new Date(),"yyyy-MM-dd hh:mm:ss"))
            case "username":
                //当前登录用户
                return userName(resolve)
            case "pageindex":
                //页码
                return resolve(value)
            case "pagetotal":
                //页数
                return resolve(value)
            case "pageindextotal":
                return resolve(value)
            case "row-index":
                return resolve("row-index")
            case "today":
                SDate=ItSoftUtil.dateFormat(new Date(),"yyyy-MM-dd")
                EDate=ItSoftUtil.dateFormat( new Date(),"yyyy-MM-dd")
                return resolve({Label:SDate,Value:SDate+'T'+EDate})
            case "thisMonth":
                SDate=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+"-01"
                EDate=ItSoftUtil.dateFormat( new Date(),"yyyy-MM-dd")
                return resolve({Label:SDate+'T'+EDate,Value:SDate+'T'+EDate})
            case "lastMonth":
                return getlastMonth(resolve)
            case "thisYear":
                SDate=(new Date()).getFullYear()+"-01-01"
                EDate=(new Date()).getFullYear()+"-12-31"
                return resolve({Label:SDate+'T'+EDate,Value:SDate+'T'+EDate})
            case "lastDays7":
                EDate=ItSoftUtil.dateFormat(new Date(),"yyyy-MM-dd")
                SDate=ItSoftUtil.dateFormat(ItSoftUtil.dateCalDay("2",7,EDate),"yyyy-MM-dd")
                return resolve({Label:SDate+'T'+EDate,Value:SDate+'T'+EDate})
            case "lastDays30":
                EDate=ItSoftUtil.dateFormat(new Date(),"yyyy-MM-dd")
                SDate=ItSoftUtil.dateFormat(ItSoftUtil.dateCalDay("2",30,EDate),"yyyy-MM-dd")
                return resolve({Label:SDate+'T'+EDate,Value:SDate+'T'+EDate})
            case "organization":
                //机构名称
                return getOrganization(resolve)
            //页数
            default:
                return resolve("内置数据不存在")

        }
    })
    return fn
}

function userName(resolve) {
    // console.log("user")
    Vue.prototype.$itsoftUI.getUserInfo().then(res => {
        return resolve(res.name)
    })

}
function getOrganization(resolve) {
    // console.log("user")
    Vue.prototype.$itsoftUI.getUserInfo().then(res => {
        return resolve(res.schoolName)
    })

}
//本月
function getlastMonth(resolve){



   let fd = new Date(new Date().getFullYear(), new Date().getMonth()-1, 1);

    let date = new Date();
    let day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    let enddate = new Date(new Date().getFullYear(), new Date().getMonth()-1, day);



     let s=ItSoftUtil.dateFormat(fd,"yyyy-MM-dd")+"T"+ItSoftUtil.dateFormat(enddate,"yyyy-MM-dd")
     return resolve({Label:s,Value:s})


}
