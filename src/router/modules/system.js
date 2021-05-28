/**系统管理
 * Auth login 验证登录 roles 验证登录且验证权限
 * **/
import Layout from '@/views/layout/Layout'
const systemRouter = {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    name: 'System',
    meta: {
        parent: "system",
        title: "系统管理",
        Auth: 'login'
    },
    children: [
        // {
        //     path: '/system/index',
        //     component: () => import('@/views/system/index'),
        //     name: 'SystemIndex',
        //     meta: {
        //         title: '首页',
        //         hidden: true,
        //         Auth: "login",
        //         icon: "daohang"
        //     }
        // },

        {
            path: '/system/role',
            component: () => import('@/views/system/roleList'),
            name: 'roleList',
            meta: {
                title: '用户角色',
                icon: "role",
                desc: "设置用户角色（根据授权对用户分组）、角色模块操作功能授权。",
                Auth: "010200"
            }
        },
        {
            path: '/system/user',
            component: () => import('@/views/system/userList'),
            name: 'userList',
            meta: {
                title: '用户管理',
                icon: "users",
                desc: "设置用户基本信息、授权。",
                Auth: "010100"
            }
        },

    ]
}

export default systemRouter
