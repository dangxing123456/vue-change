/**需求计划
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
import itReportLayout from '@/views/layout/itReportLayout'
const convenientRouter = {
    path: "/areaManager",
    component: Layout,
    name: "areaManager",
    meta: {
        title: "便捷入口管理",
        parent: "areaManager",
        icon: "el-icon-message",
        Auth: "login"
    },
    redirect: "/areaManager/index",
    children: [
        {
            path: "/areaManager/index",
            component: () => import("@/views/areaManager/index"),
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
