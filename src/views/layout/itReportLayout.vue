<template>
    <el-container style="height: 100%"  direction="vertical">
        <!--头部-->
        <!-- <Header/> -->
        <el-container style="height: 300px" >
            <el-container style="height: 100%" direction="vertical">
                <!--主工作区头部-->
                <!-- <layout-main-top :toggle-icon="false"/> -->
                <!--主工作区-->
                <layout-main style="height: 100%"/>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
    import Header from "@/components/header/index"
    import layoutMain from "@/views/layout/components/itlayoutMain"
    // import layoutMainTop from "@/views/layout/components/layoutMainTop";
    export default {
        name: "itReportLayout",
        components: {layoutMain},
        data() {
            return {
            }
        },
        methods: {
        },
        created() {
        }
    }
</script>

<style scoped>

</style>
