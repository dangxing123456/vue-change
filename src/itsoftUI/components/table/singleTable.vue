<!--
itsoftVUEUI1.0
单一列表,主要实现工具条条、表格、分页、设置、导出、查询综合查询
2020.01
数据表主键：id
属性：
table-name              数据表名称，对应数据库，加密产生
tool-buttons            工具条按钮
list-name               列表名称，用于本地存储KEY
default-order           默认排序,可以为组合排序
columns                 表格列
quick-query-field       快捷查询字段
quick-query-field-name  快捷查询字段中文描述
export-file-name        导出文件前缀
show-page               是否分页                        默认false

-->
<template>
    <div style="height: 100%; " >
        <!--工作区-->
        <el-container ref="listWarp" style="height: 100%;background-color:#fff;"
                      v-loading="listLoading" :element-loading-text="loadingText">
            <!--头部-->
            <el-header class="toolbar-wap" style="height:45px">
                <!--工具条按钮-->
                <tool-button
                        v-for="button in toolButtons"
                        :key="button.text"
                        :text="button.text"
                        :icon="button.icon"
                        :disabled="button.disabled"
                        :right-line="button.rightLine"
                        :left-line="button.leftLine"
                        :title="button.title"
                        @buttonClick="toolButtonClick"/>
                <!--工具条查询-->
                <tool-query ref="toolQuery"
                            :placeholder="quickQueryFieldName"
                            :quickQueryField="quickQueryField"
                            :list-name="listName"
                            :columns="columns"
                            @executeQuery="funExecuteQuery"
                            style="width:300px; float: right"/>
            </el-header>
            <!--列表-->
            <el-main style="height: 100%;" class="page-main">
                <el-table ref="dataListTable"
                          :data="dataList"
                          highlight-current-row
                          :default-sort="defaultOrder"
                          border
                          tooltip-effect="light"
                          height="100%"
                          style="width: 100%;"
                          @sort-change="evtTableSortChange"
                          @row-dblclick="evtTableRowdblclick"
                          @current-change="evtTableRowChange"
                          @selection-change="evtTableSelectionChange">
                    <!--选择-->
                    <el-table-column
                            type="selection"
                            align="left"
                            width="40"/>
                    <!--序号-->
                    <el-table-column
                            type="index"
                            align="center"
                            label="序号"
                            width="49"/>
                    <!--绑定列-->
                    <el-table-column
                            v-for="col in columns.filter(item => item.visible)"
                            :prop="col.prop"
                            :label="col.label"
                            :sortable="col.sortable?'custom':col.sortable"
                            :resizable="col.resizable"
                            :show-overflow-tooltip="col.tooltip"
                            :align="col.align"
                            :width="col.width"
                            :fixed="col.fixed"
                            :key="col.prop"/>
                    <!--暂无数据-->
                    <div slot="empty" class="table-empty">
                        <svg-icon slot="prefix" icon-class="zanwushuju" style="font-size:40px;color:#ccc" />
                        <p  style="font-size:13px;  margin-top:10px" >暂无数据</p>
                    </div>
                </el-table>
            </el-main>
            <!--底部分页-->
            <el-footer style="height:45px" class="page-footer" v-if="showPage">
                <el-pagination
                        style="margin-top:5px"
                        background
                        layout="prev, pager, next,jumper,total,sizes"
                        @size-change="evtPageSizeChange"
                        @current-change="evtPageCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[20, 50, 100, 500]"
                        :total="totalRows">
                </el-pagination>
            </el-footer>
        </el-container>
        <!--设置-->
        <column-setting :data="columns" :list-name="listName" ref="tableSetting"/>
        <!--导出-->
        <export-data ref="exportData" :rows="totalRows" @exportExecute="exportExecute" @openSetting="settingOpen"/>
    </div>
</template>
<script>
    import toolButton from "@/itsoftUI/components/toolbar/toolbutton"
    import toolQuery from "@/itsoftUI/components/toolbar/toolquery"
    import columnSetting from "@/itsoftUI/components/table/columnSetting"
    import exportData from "@/itsoftUI/components/table/exportData"
    export default {
        name: "singleTable",
        components: {toolButton, columnSetting, exportData, toolQuery},
        data() {
            return {
                dataList: [],
                listLoading: false,
                loadingText:"",
                currentPage: 1,
                totalRows: 0,
                pageSize: 20,
                currentRow: null,
                selectRows: [],
                tableOrder: "",
                //默认查询
                defaultSearch: {
                    "andOr": "and",
                    "searchField": "schoolcode",
                    "operator": "=",
                    "searchValue": this.$itsoftUI.config.schoolCode
                },
                queryList: null, //查询条件
                isExport: false
            }
        },
        props: {
            //数据表名称
            tableName: null,
            //工具条按钮
            toolButtons:null,
            //列表名称，用于本地存储来
            listName: null,
            //默认排序
            defaultOrder: null,
            //列
            columns: null,
            //快捷查询
            quickQueryField: null,
            quickQueryFieldName: null,
            //导出文件名称
            exportFileName: null,
            //是否分页
            showPage: {
                type: Boolean,
                default: false
            },
            api:null

        },
        methods: {
            toolButtonClick(text) {
                switch (text) {
                    case "刷新":
                        this.$refs.dataListTable.setCurrentRow()
                        this.funLoadData()
                        break
                    case "新增":
                        this.funEdit(null)
                        break
                    case "编辑":
                        this.funEdit("edit")
                        break
                    case "删除":
                        this.funDelete()
                        break
                    case "导出":
                        this.exportOpen()
                        break
                    case "设置":
                        this.settingOpen()
                        break
                }
            },
            funEdit(val) {
                //编辑
                if (val === "edit") {
                    if (!this.currentRow) {
                        this.$message.error('未选中要编辑的数据行');
                        return false
                    }
                    val =this.currentRow
                }
                this.$emit('edit', val);
            },
            //加载数据
            funLoadData() {
                //分页
                let page = {"pageSize": 0, "pageIndex":0}
                if (this.showPage) {
                    page = {"pageSize": this.pageSize, "pageIndex": this.currentPage}
                }
                //排序
                if (this.tableOrder === '') {
                    if (this.defaultOrder.order) {
                        if (this.defaultOrder.order === 'descending') {
                            this.tableOrder = this.defaultOrder.prop + " desc "
                        } else {
                            this.tableOrder = this.defaultOrder.prop
                        }
                    }
                }
                //组合查询条件
                let search = []
                //加入自定义查询
                if (this.queryList) {
                    search = this.queryList.slice()
                }
                //加入默认查询
                search.unshift(this.defaultSearch)
                this.listLoading = true
                if (this.isExport) {
                    this.isExport = false
                    //导出数据
                    let header = ""
                    let fields = ""
                    this.columns.filter(item => item.visible).forEach(function (item) {
                        if (header === "") {
                            header = item.label
                        } else {
                            header = header + ',' + item.label
                        }
                        if (fields === "") {
                            fields = item.prop
                        } else {
                            fields = fields + ',' + item.prop
                        }
                    })
                    this.loadingText="数据导出中..."
                    this.api.Export(JSON.stringify(search),fields, header, this.exportFileName,this.tableOrder).then(() => {
                        this.listLoading = false;
                    }).catch(() => {
                        this.listLoading = false;
                    });
                } else {
                    //加载数据
                    let fields = "id"
                    this.columns.forEach(function (item) {
                        fields = fields + ',' + item.prop
                    })
                    this.loadingText="数据加载中..."
                    this.api.List(JSON.stringify(search),this.tableOrder,JSON.stringify(page),fields).then((res) => {
                        if(this.showPage) {
                            this.dataList = res.data.rows
                            this.totalRows = res.data.total
                        }else{
                            this.dataList = res.data
                            this.totalRows=res.data.length
                        }
                        this.listLoading = false;
                    }).catch(() => {
                        this.listLoading = false;
                    });
                }
            },
            funDelete() {
                //删除数据
                let that = this
                let deleteRows = this.selectRows
                if (deleteRows.length === 0) {
                    this.$message.error('请选择要删除的数据行');
                    return
                }
                this.$confirm('确定要删除当前选中的数据吗？', '删除', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '删除',
                    cancelButtonText: '放弃删除',
                    type: 'warning',
                }).then(() => {
                    this.listLoading = true
                    this.loadingText="数据正在删除..."
                    let ids = []
                    deleteRows.forEach(function (item) {
                        ids.push(item.id)
                    })
                    this.api.Del(JSON.stringify(ids), this.tableName).then(() => {
                        deleteRows.forEach(function (item) {
                            for (let i = 0; i < that.dataList.length; i++) {
                                if (that.dataList[i].id === item.id) {
                                    that.dataList.splice(i, 1)
                                    break
                                }
                            }
                        });
                        this.listLoading = false;
                        this.$message.success('删除成功');
                    }).catch(() => {
                        this.listLoading = false;
                    });
                }).catch(() => {
                    this.$refs.dataListTable.clearSelection()
                });
            },
            evtPageSizeChange(val) {
                //每页数量
                this.pageSize = val
                this.funLoadData()
            },
            evtPageCurrentChange(val) {
                //分页
                this.currentPage = val
                this.funLoadData()
            },
            evtTableRowdblclick() {
                //双击行
                this.funEdit("edit")
            },
            evtTableRowChange(currentRow) {
                //单选行
                this.currentRow = currentRow
            },
            evtTableSelectionChange(selection) {
                //多选行
                this.selectRows = selection
            },
            evtTableSortChange(obj) {
                //排序
                this.tableOrder=""
                if (obj.order) {
                    if ( obj.order==='descending') {
                        this.tableOrder=obj.prop+" desc "
                    }else
                    {
                        this.tableOrder=obj.prop
                    }
                }
                this.funLoadData()
            },
            //更新行
            funUpdateRow(data) {
                //查找行并更新
                for (let i = 0; i < this.dataList.length; i++) {
                    if (this.dataList[i].id === data.id) {
                        //更新数据
                        this.dataList.splice(i, 1, data)
                        //选中行
                        this.$refs.dataListTable.setCurrentRow(this.dataList[i])
                        break
                    }
                }
            },
            //添加行
            funAddRow(data) {
                this.dataList.unshift(data);
            },
            //本地加载列
            funLoadColumns() {
                let cols = JSON.parse(localStorage.getItem(this.listName + "—" + this.$ver))
                if (cols) {
                    let that = this
                    cols.forEach(function (item) {
                        for (let i = 0; i < that.columns.length; i++) {
                            if (that.columns[i].prop === item.prop) {
                                that.columns[i].visible = item.visible
                                that.columns[i].fixed = item.fixed
                                that.columns[i].sortable = item.sortable
                                break
                            }
                        }
                    })
                }
            },
            //表格设置
            settingOpen() {
                this.$refs.tableSetting.settingOpen()
            },
            //打开导出数据窗口
            exportOpen() {
                this.$refs.exportData.exportOpen()
            },
            //导出数据
            exportExecute() {
                this.isExport = true;
                this.funLoadData()
            },
            //执行查询
            funExecuteQuery(val) {
                this.queryList = []
                let that = this
                if (val) {
                    val.forEach(function (item) {
                        that.queryList.push(item)
                    })
                }
                this.funLoadData()
            }
        },
        created() {
            //本地存储的
            this.funLoadColumns()
            //加载数据
            this.funLoadData()
        }
    }
</script>

<style lang="scss" scoped>


</style>
