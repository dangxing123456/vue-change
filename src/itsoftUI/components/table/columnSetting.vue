<!--表格设置-->
<template>
    <el-drawer
            title="设置"
            :visible.sync="drawerVisible"
            size="400px"
            :with-header="true"
            @close="drawerClose"
    >
        <el-main style="height:calc(100% - 3px)" class="page-main">
            <el-table ref="dataListTable"
                      :data="this.data"
                      height="100%"
                      style="width: 100%;font-weight: bold">
                <el-table-column
                        prop="label"
                        label="列"/>
                <el-table-column label="显示" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.visible" @change="switchChange"/>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.sortable" @change="switchChange" />
                    </template>
                </el-table-column>
                <el-table-column label="冻结" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.fixed" @change="switchChange"/>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-drawer>
</template>

<script>
    export default {
        name: "columnSeting",
        data() {
            return {
                drawerVisible: false,
                isChange:false
            };
        },
        props: {
            data: null,
            listName: null
        },
        methods: {
            //关闭
            drawerClose() {
                //本地存储
                if (!this.isChange) return false
                let localData=[]
                this.data.forEach(function (item) {
                    let localItem={ prop:item.prop,
                                    sortable:item.sortable,
                                    visible:item.visible,
                                    fixed:item.fixed
                                    }
                    localData.push(localItem)
                });
                localStorage.setItem(this.listName + "—" + this.$ver, JSON.stringify(localData))
            },
            //编辑提取数据，来自父组件调用
            settingOpen() {
                this.drawerVisible = true
            },
            switchChange(){
                this.isChange=true
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    :focus {

        outline: 0;
    }
</style>
