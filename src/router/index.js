import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout 主框架 */
import HomeLayout from '@/views/layout/homeLayout'

/* Router Modules 路由模块 */

import systemRouter from './modules/system'
import repositoryRouter from "./modules/repository"
import problemRouter from "./modules/problem"
import convenientRouter from "./modules/convenient"
import profileDataRouter from "./modules/profileData"
export const constantRoutes = [{
    path: '/redirect',
    component: HomeLayout,
    hidden: true,
    children: [{
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
    }]
},
{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
},
{
    path: '/loginlocal',
    component: () => import('@/views/login/index'),
    hidden: true
},
{
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
},
{
    path: '/error',
    component: () => import('@/views/error'),
    hidden: true
},
{
    path: '',
    name: '系统框架',
    component: HomeLayout,
    redirect: 'home',
    iconCls: 'el-icon-message',
    meta: {
        hidden: true
    },
    children: [{
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: {
            title: '智能客服',
            icon: 'el-icon-message',
            Auth: "login",
            hidden: true
        }
    },
    {
        path: 'authorize',
        component: () => import('@/views/authorize'),
        name: 'authorize',
        meta: {
            title: '智能客服',
            icon: 'el-icon-message',
            Auth: "login",
            hidden: true
        }
    }
    ]
},
    systemRouter,
    repositoryRouter,
    problemRouter,
    convenientRouter,
    profileDataRouter,
{
    path: '*',
    redirect: '/404',
    hidden: true
}
]
const createRouter = () => new Router({
    mode: 'history', // require service support
    base: '/account/',
    code: 'account', //系统授权代码
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})
const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}
export default router
/*
    权限说明：
    meta.Auth
    无：表示不受权限控制
    login: 只验证是否登录
    roles: 验证权限模块
    为数组时验证按钮操作权限
    例如：
    [{name:'edit',label:'添加',value:'0'},
     {name:'del',label:'删除',value:'0'},
     {name:'export',label:'导出',value:'0'}]
    模块验证的规则：
    验证name值，name值要有唯一性
    验证的方法：
    在main.js加载所有模块的权限
*/