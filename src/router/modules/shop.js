/**需求计划
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
import itReportLayout from '@/views/layout/itReportLayout'
const profileDataRouter = {
    path: "/shop",
    component: Layout,
    name: "shop",
    meta: {
        title: "数据概况",
        parent: "shop",
        icon: "el-icon-message",
        Auth: "login"
    },
    redirect: "/shop/index",
    children: [
        {
            path: "/shop/index",
            component: () => import("@/views/shop/index"),
            name: "baseStatistics",
            meta: {
                title: "数据统计",
                desc: "数据统计",
                icon: "xxxx",
                Auth: "020100"
            }
        },

    ]
}

export default profileDataRouter

//Optional 可选模块