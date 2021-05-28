<template>
    <el-container style="height: 100%" direction="vertical">
        <Header/>
        <el-container>

            <el-main style="height: 100%; padding:10px;">
                <transition name="fade-transform" mode="out-in">
                    <router-view></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Header from "@/components/header/index"
    export default {
        name: "homelayout",
        components: {Header}

    }
</script>

<style scoped>

</style>
