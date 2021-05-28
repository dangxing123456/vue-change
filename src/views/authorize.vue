<template>
    <div style="width:300px; height:200px; position: absolute;top: calc(50% - 100px);left: calc(50% - 150px);">
        <svg-icon   slot="prefix"
                    icon-class="noauth"
                    style="font-size:36px;position: absolute;top:15px; left:0;"
                    />
        <span style="position: absolute;top:10px; left:55px; font-weight: bold; font-size:16px;color:#666666;">
            您无权访问该页面
        </span>
        <div style="position: absolute;top:35px; left:55px;font-size:13px;color:#999999; line-height:14px;">
            <p>请检查访问地址是否正确</p>
            <p>联系管理员给授权</p>
            <p>权限更新后要重新登录</p>
            <p style="color:#409EFF;cursor: pointer; padding-top:10px;" @click="goback">返回</p>
        </div>


    </div>
</template>

<script>
    export default {
        name: "error",
        methods: {
            goback(){
                this.$router.go(-1)
            }
        }
    }
</script>

<style scoped>

</style>
