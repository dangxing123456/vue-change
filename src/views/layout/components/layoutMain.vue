<!--布局主工作区-->
<template>
    <el-main style="height: 100%; padding:7px;
    background-color:rgba(0, 0, 0, .1); overflow: hidden;
box-shadow:inset 0 1px 3px 0 rgba(0, 0, 0, .12)
,inset 0 -3px 3px 0 rgba(0, 0, 0, .12);" v-show="isShow">
        <router-view >

        </router-view>
    </el-main>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "layoutMain",
        computed: {
            ...mapGetters([
                'vShow'
            ]),
            isShow() {
                return this.vShow.opened
            }
        }
    }
</script>

<style scoped>

</style>
