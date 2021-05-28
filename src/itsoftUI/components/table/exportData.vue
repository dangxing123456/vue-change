<template>
    <el-drawer
            title="导出"
            :visible.sync="drawerVisible"
            size="400px"
            :with-header="true"
    >
        <div style="padding: 10px;">
            <el-card shadow="hover" style="margin-bottom:20px">
                <div>导出哪些列？</div>
                <div style="line-height:60px; color:#666">导出表格显示的列，可通过<em @click="openSetting" class='setting'>[设置]</em>是否显示来调整</div>
            </el-card>
            <el-card shadow="hover" style="margin-bottom:20px">
                <div>导出的范围？</div>
                <div style="line-height:60px; color:#666">导出的数据和表格一致，目前共有[<b style="color: #e54545">{{this.rows}}</b>]条数据</div>
                <div style="color:#666">可重新查询确定数据范围</div>
            </el-card>
            <el-card shadow="hover" style="margin-bottom:20px">
                <div>导出的格式？</div>
                <div style="line-height:60px; color:#666">格式为CSV<i style="font-size:12px">(逗号分隔值文件格式)</i>,可以用Excel软件打开</div>
            </el-card>
            <div style="width:100%;   text-align: center">
                <el-button type="primary" style="width:100px" @click="exportSubmit"  :disabled="this.rows==0" >导出</el-button>
            </div>
        </div>

    </el-drawer>
</template>

<script>
    export default {
        name: "exportData",
        data() {
            return {
                drawerVisible: false
            };
        },
        props: {
            rows:{
                type:Number,
                default:0
            }
        },
        methods: {
            //来自父组件调用
            exportOpen() {
                this.drawerVisible = true
            },
            openSetting(){
                this.$emit('openSetting');
            },openQuery(){
                this.$emit('openQuery');
            },
            exportSubmit(){
                this.drawerVisible = false
                this.$emit('exportExecute');

            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    :focus {

        outline: 0;
    }
    .setting{ color: #409EFF; cursor: pointer;}
</style>

