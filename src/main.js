import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import ElementUI, {
    Message
} from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/base.scss'
import {
    getConfig
} from '@/api/config'
import echarts from 'echarts'
import itsoftUI from "@/itsoftUI/index"

const defaultSettings = require('@/settings')
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI);
//系统版本号
Vue.prototype.$ver = defaultSettings.ver
Vue.prototype.$systemAuth = true
//系统菜单
Vue.prototype.$systemMenu = defaultSettings.systemMenu
//获取config 发布文件夹下config.json
getConfig().then(res => {
    //配置文件验证
    if (typeof (res.serviceUrl) === 'undefined' ||
        typeof (res.localUrl) === 'undefined' ||
        typeof (res.loginUrl) === 'undefined'
    ) {
        Message({
            showClose: true,
            message: "请检查系统配置文件(config.json)",
            type: 'error',
            duration: 0
        });
        return
    }
    //初始化通用类库itsoftUI
    Vue.use(itsoftUI, router)
    Vue.prototype.$dialogLoading = {
        text: '请稍等',
        target: ".el-dialog__body",
        background: 'rgba(255, 255, 255, 0.6)'
    }
    Vue.prototype.$exportLoading = {
        text: '正在导出',
        background: 'rgba(255, 255, 255, 0.6)'
    }
    //系统配置参数(配置参数从服务上存储配置文件中获取)
    Vue.prototype.$itsoftUI.config.clientId = defaultSettings.clientId
    Vue.prototype.$itsoftUI.config.clientSecret = defaultSettings.clientSecret
    Vue.prototype.$itsoftUI.config.cookieKey = defaultSettings.cookieKey
    //存储为全局变量
    //系统地址
    Vue.prototype.$itsoftUI.config.localUrl = res.localUrl
    //服务接口地址
    Vue.prototype.$itsoftUI.config.serviceUrl = res.serviceUrl
    //cas退出地址
    Vue.prototype.$itsoftUI.config.casLogoutUrl = res.casLogoutUrl
    //登录地址
    Vue.prototype.$itsoftUI.config.loginUrl = res.loginUrl
    //静态资源服务器
    Vue.prototype.$itsoftUI.config.fileServer = res.fileServer
    //系统路径
    Vue.prototype.$itsoftUI.config.systemUrl = res.systemUrl
    //学校代码
    // Vue.prototype.$itsoftUI.config.schoolCode = res.schoolCode
    // Vue.prototype.$itsoftUI.config.schoolName = res.schoolName
    Vue.prototype.$serviceUrl = res.serviceUrl
    localStorage.removeItem("USER_INFO")
    Vue.prototype.$itsoftUI.getUserInfo(true).then(res => {
        Vue.prototype.$userStatus = res.password
        //学校代码
        Vue.prototype.$itsoftUI.config.schoolCode = res.schoolCode
        Vue.prototype.$itsoftUI.config.schoolName = res.schoolName
        let roles = JSON.parse(res.auth)
        Vue.prototype.$systemMenu = [
            {
                "name": "知识库",
                "url": "/repository",
                "isOpen": "true"
            },
            {
                "name": "便捷入口管理",
                "url": "/convenient",
                "isOpen": "true"
            },
            {
                "name": "问题管理",
                "url": "/problem",
                "isOpen": "true"
            },
            {
                "name": "数据概况",
                "url": "/profileData"
            },
            {
                "name": "系统管理",
                "url": "/system"
            },

        ]
        if (roles.length > 0) {
            //加载权限      
            let roleList = []
            router.options.routes.filter(item => item.children && item.meta && item.meta.Auth).forEach(function (item) {
                if (item.meta.Auth === 'login') {
                    item.children.forEach(el => {
                        if (el.children) {
                            el.children.filter(item => item.meta && item.meta.Auth && item.meta.Auth !== 'login' && item.meta.Auth != "").forEach(it => {
                                // console.log(it.meta.Auth)
                                roleList.push(it.meta.Auth)
                                it.meta.authorize = roles.indexOf(it.meta.Auth) >= 0
                            })
                        }
                    })
                    item.children.filter(item => item.meta && item.meta.Auth && item.meta.Auth !== 'login' && item.meta.Auth != "").forEach(function (c) {
                        //模块权限
                        roleList.push(c.meta.Auth)
                        c.meta.authorize = roles.indexOf(c.meta.Auth) >= 0
                    })
                    console.log(item)
                }
            })
        } else {
            Vue.prototype.$systemAuth = false
        }

        createdVue()
    }).catch(err => {
        //访问失败
        createdVue()
    });
})

function createdVue() {

    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app')
}