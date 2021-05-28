<template>
    <el-container class="h100">
        <el-main style="background-color: #ffffff;">
            <div v-for="(menu,index) in menuList"
                 class="box"
                 @click="(val)=>funPushPath(menu.path)"
                 :key="index">
                <div class="title">
                    <svg-icon slot="prefix" class-name="icon" :icon-class="menu.meta.icon"
                              style="font-size:20px; margin-top:5px; "/>
                    <span>{{menu.meta.title}}</span>
                </div>
                <div class="comment">
                    {{menu.meta.desc}}
                </div>
                <div class="desc" style=""><i class="el-icon-info"></i>点击进入模块</div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {constantRoutes} from '@/router'
    export default {
        name: "system",
        data() {
            return {
                menuList: [],
            }
        },
        methods: {
            funGetMenu() {
                let route = constantRoutes.filter(item => !item.hidden && item.meta.parent === 'system')
                if (route.length > 0) {
                    let that = this
                    route[0].children.forEach(function (item) {
                        if (item.path.indexOf("/index") < 0) {
                            that.menuList.push(item)
                        }
                    })
                }
            },
            funPushPath(path){
                this.$router.push({path:path})
            }
        },
        created() {
            this.funGetMenu()
        },
    }
</script>

<style lang="scss" scoped>
    .box {
        float: left;
        width: 15%;
        height: 80px;
        background-color: #f7f7f7;
        border: #ffffff solid 1px;

        padding: 10px 20px 30px 20px;
        margin: 20px;
        cursor: pointer;
        .icon{
            color:#409EFF;
        }
        &:hover {
            background-color: #f1f1f1;
            box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);

            .desc {
                display: block;
            }
            .comment {
                color: #555555;
            }
            .title{
                font-weight: bold;

            }
            .icon{
                color:#E6A23C;
            }
        }

        .title {
            font-size: 14px;
            line-height: 35px;
            color: #000000;
            span {
                padding: 0 6px;
            }


        }
        .comment {
            font-size: 12px;
            color: #888888;
        }
        .desc {
            padding-left:2px;
            margin-top:5px;
            font-size: 12px;
            color: #999999;
            font-weight: normal;
            display: none;
        }

    }
</style>
