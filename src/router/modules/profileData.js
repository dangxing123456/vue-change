/**需求计划
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
import itReportLayout from '@/views/layout/itReportLayout'
const profileDataRouter = {
    path: "/profileData",
    component: Layout,
    name: "ProfileData",
    meta: {
        title: "数据概况",
        parent: "profileData",
        icon: "el-icon-message",
        Auth: "login"
    },
    children: [
        {
            path: "/profileData/baseStatistics",
            component: () => import("@/views/profileData/baseStatistics"),
            name: "baseStatistics",
            meta: {
                title: "数据统计",
                desc: "数据统计",
                icon: "xxxx",
                Auth: "020100"
            }
        },
        {
            path: "/profileData/datastatistics",
            component: () => import("@/views/profileData/datastatistics"),
            name: "datastatistics",
            meta: {
                title: "知识库统计",
                desc: "知识库统计",
                icon: "xxxx",
                Auth: "020100"
            }
        },
        {
            path: "/profileData/satisfactionStatistics",
            component: () => import("@/views/profileData/satisfactionStatistics"),
            name: "satisfactionStatistics",
            meta: {
                title: "满意度统计",
                desc: "满意度统计",
                icon: "xxxx",
                Auth: "020100"
            }
        },
    ]
}

export default profileDataRouter

//Optional 可选模块