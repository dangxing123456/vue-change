/**需求计划
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
import itReportLayout from '@/views/layout/itReportLayout'
const repositoryRouter = {
    path: "/repository",
    component: Layout,
    name: "repository",
    meta: {
        title: "知识库管理",
        parent: "repository",
        icon: "el-icon-message",
        Auth: "login"
    },
    redirect: "/repository/index",
    children: [
        {
            path: "/repository/index",
            component: () => import("@/views/repository/index"),
            name: "HomeApplication",
            meta: {
                title: "",
                desc: "",
                icon: "wapyy",
                Auth: "030400"
            }
        },
    ]
}

export default repositoryRouter
