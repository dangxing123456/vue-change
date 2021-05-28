/**需求计划
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
import itReportLayout from '@/views/layout/itReportLayout'
const problemRouter = {
    path: "/problem",
    component: Layout,
    name: "Problem",
    meta: {
        title: "问题管理",
        parent: "problem",
        icon: "el-icon-message",
        Auth: "login"
    },
    redirect: "/problem/index",
    children: [
        {
            path: "/problem/index",
            component: () => import("@/views/problem/index"),
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
