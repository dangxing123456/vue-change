<!--面包屑-->
<template>
    <el-header  style="height:34px;" class="topwarp" v-show="vShow.opened">
        <menu-toggle-icon v-if="toggleIcon" :is-active="leftmenu.opened" @toggleClick="toggleLeftMenu" style=" float: left;"/>
        <i class="el-icon-location-outline" v-if="!toggleIcon" style="float: left; line-height:35px; font-size:16px;"></i>
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </el-header>
</template>

<script>
    import { mapGetters } from 'vuex';
    import menuToggleIcon from "@/views/layout/components/menuToggleIcon";
    import Breadcrumb from '@/views/layout/components/breadcrumb'
    export default {
        name: "layoutMainTop",
        components: {
            menuToggleIcon,
            Breadcrumb
        },
        data () {
            return {
                collapsed:false
            }
        },
        props: {
            toggleIcon: {
                type:Boolean,
                default:true
            }
        },
        methods: {
            toggleLeftMenu() {
                this.$store.dispatch('app/toggleLeftMenu')
            }
        },computed: {
            ...mapGetters([
                'leftmenu',
                'vShow'
            ])
        }

    }
</script>

<style scoped>
    .topwarp
    {
        height: 34px;
        line-height:30px;
        font-size:12px;
        padding: 0 10px;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #e3e8ee;
        /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);*/
        position: relative;
    }
    .breadcrumb-container {
        float: left;


    }
</style>
