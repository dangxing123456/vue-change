import Vue from 'vue'
import router from "@/router";
import {
    apiUser
} from "@/api/user/baseinfo"
export function getPremission(toolButtons) {
    Vue.prototype.$itsoftUI.getUserInfo().then(res => {
        let systemcode = "exchange "
        let schoolCode = Vue.prototype.$itsoftUI.config.schoolCode
        apiUser.userRolesAuthorizeList(systemcode, res.id, schoolCode).then(res => {
            let roles = JSON.parse(res.data.authorize)
            toolButtons.filter(item => item.auth).forEach(function (btn) {
                Vue.set(btn, "disabled", roles.indexOf(btn.auth) < 0)
            })
        })
    })

}