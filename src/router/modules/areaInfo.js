/**需求计划
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
import itReportLayout from '@/views/layout/itReportLayout'
const repositoryRouter = {
    path: "/areaInfo",
    component: Layout,
    name: "areaInfo",
    meta: {
        title: "知识库管理",
        parent: "areaInfo",
        icon: "el-icon-message",
        Auth: "login"
    },
    redirect: "/areaInfo/index",
    children: [
        {
            path: "/areaInfo/index",
            component: () => import("@/views/areaInfo/index"),
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
