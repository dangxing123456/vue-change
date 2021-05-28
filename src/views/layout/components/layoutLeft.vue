<!--布局左侧菜单-->
<template>
    <el-aside style=" width: auto; height: 100%; " v-show="isShow">
        <el-menu
                class="el-menu-vertical-demo"
                :default-active="defaultActive"
                :collapse="isCollapse"
                router
                unique-opened
                :collapse-transition="false"
                mode="vertical"
                :background-color="menuBg"
                :text-color="menuTextColor"
                :active-text-color="menuActiveText">
            <template v-for="(item , index) in route">
                <!--多级菜单-->
                <el-submenu :index="index+''" v-if="item.children && item.meta.children" :key="index">
                    <!--标题-->
                    <template slot="title">
                        <svg-icon slot="prefix" :icon-class="item.meta.icon"
                                  :style="isCollapse?'font-size:20px;margin-right:5px;':'font-size:16px;margin-right:5px ;'"/>
                        <span>{{item.meta.title}}</span>
                    </template>
                    <!--子菜单-->
                    <el-menu-item v-for="(itemChild , index) in item.children.filter(item => !item.meta.hidden)"
                                  :index="itemChild.path" :key="index"
                                  style="padding-left:25px;">
                        <i>
                            <svg-icon slot="prefix" :icon-class="itemChild.meta.icon"
                                      :style="isCollapse?'font-size:20px;':'font-size:16px;'"/>
                        </i>
                        <span style="font-size:13px;">{{itemChild.meta.title}}</span>
                    </el-menu-item>
                </el-submenu>
                <!--单级菜单-->
                <el-menu-item :index="item.path" :key="index" v-else>
                    <i>
                        <svg-icon slot="prefix"
                                  :icon-class="item.meta.icon"
                                  :style="isCollapse?'font-size:20px; margin-right:3px;':'font-size:16px;margin-right:3px;'"/>
                    </i>
                    <span slot="title"> {{item.meta.title}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </el-aside>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'layoutLeft',

        props: {
            route: null,
            defaultActive:null
        },
        data() {
            return {
                menuBg: "#333",
                menuTextColor: "#bfcbd9",
                menuActiveText: "#ffd04b",
                msg: this.$route.params.msg,
            }
        },
        components: { // 组件

        },

        computed: {
            ...mapGetters([
                'leftmenu',
                'vShow'
            ]),
            isCollapse() {
                return !this.leftmenu.opened
            },
            isShow() {
                return this.vShow.opened
            },
            // defaultActive() {
            //     const route = this.$route
            //     const {meta, path} = route
            //     console.log(path)
            //     // if set path, the sidebar will highlight the path you set
            //     // console.log(meta)
            //     // console.log(path)
            //     // if (meta.activeMenu) {
            //     //     return meta.activeMenu
            //     // }
            //     return path
            // }

        },
        methods: { // 方法事件
            setDefaultActive() {
                const route = this.$route
                const {meta, path} = route
                //if set path, the sidebar will highlight the path you set
             
                if (meta.activeMenu) {
                    this.defaultActive = meta.activeMenu
                }
                this.defaultActive=path
                this.$forceUpdate()
            }

        },
        mounted() { // 加载完成

        },

        created() { // 创建
            //this.setDefaultActive()
        },


    }
</script>

<style lang="scss" scoped>
    .el-menu-vertical-demo {
        height: 100%;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 160px;

    }

    // menu hover
    .submenu-title-noDropdown,
    .el-submenu__title {
        &:hover {
            background-color: #263445 !important;
        }
    }

    .is-active > .el-submenu__title {
        color: #ffd04b !important;
    }

    .nest-menu .el-submenu > .el-submenu__title,
    .el-submenu .el-menu-item {

        background-color: #262626 !important;

        &:hover {
            background-color: #444 !important;
        }
    }

    .el-scrollbar__view {
        height: 100%;
    }
</style>
