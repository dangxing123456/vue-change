/**需求计划
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
import itReportLayout from '@/views/layout/itReportLayout'
const problemRouter = {
    path: "/dictionary",
    component: Layout,
    name: "Dictionary",
    meta: {
        title: "问题管理",
        parent: "dictionary",
        icon: "el-icon-message",
        Auth: "login"
    },
    redirect: "/dictionary/index",
    children: [
        {
            path: "/dictionary/index",
            component: () => import("@/views/dictionary/index"),
            name: "SystemModule",
            meta: {
                title: "问题管理",
                desc: "问题管理",
                icon: "xtmk",
                Auth: "030100"
            }
        },
    ]
}

export default problemRouter
