/**需求计划
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
import itReportLayout from '@/views/layout/itReportLayout'
const convenientRouter = {
    path: "/convenient",
    component: Layout,
    name: "Convenient",
    meta: {
        title: "便捷入口管理",
        parent: "convenient",
        icon: "el-icon-message",
        Auth: "login"
    },
    redirect: "/convenient/index",
    children: [
        {
            path: "/convenient/index",
            component: () => import("@/views/convenient/index"),
            name: "HomeApplication",
            meta: {
                title: "便捷入口管理",
                desc: "",
                icon: "wapyy",
                Auth: "030400"
            }
        },

    ]
}

export default convenientRouter
