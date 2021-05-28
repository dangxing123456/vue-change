<!--
itsoftVUEUI1.0
右边目录树，左边列表
主要实现工具条条、表格、分页、设置、导出、查询综合查询
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
    <div style="height: 100%; ">
        <!--工作区-->
        <el-container ref="listWarp"
                      v-loading="listLoading"
                      :element-loading-text="loadingText"
                      style="height: 100%;background-color:#fff;">
            <!--头部-->
            <el-header class="toolbar-wap" style="height:45px;">
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
            <el-main style="height: 100%;" class="page-main">
                <el-container style="height: 100%;position: relative;" id="mainWarp">
                    <el-aside :width="leftWidth" id="leftWarp"
                              onselectstart="return false;"
                              style="border: 1px solid #e3e8ee;margin-right:3px;">
                        <el-tree
                                ref="leftTree"
                                :props="treeProps"
                                node-key="id"
                                highlight-current
                                :expand-on-click-node=false
                                @current-change="funNodeChange"
                                :default-expanded-keys="['root']"
                                :current-node-key="'root'"
                                lazy
                                :load="funLoadNode">
                             <span class="custom-tree-node" @dblclick="funExpandedNode(data)"
                                   slot-scope="{node, data}">
                                    <span >{{ data.name }}</span>
                                    <span>
                                 <span class="tree-button"
                                       v-if="data.id!='root' && nodePremission"
                                       @click="funNodeEdit(data)"
                                       title="编辑">
                                         <svg-icon slot="prefix" icon-class="edit0"/>
                                    </span>
                                    <span class="tree-button"
                                          v-if="data.id!='root' && nodePremission"
                                          title="删除"
                                          @click.stop
                                          @click="() => funDeleteNode(node, data)">
                                            <svg-icon slot="prefix" icon-class="guanbi"/>
                                    </span>
                                        </span>
                            </span>
                        </el-tree>
                    </el-aside>
                    <!--列表-->
                    <el-main style="height: 100%; padding:0; overflow: hidden;" id="rightWarp">
                        <el-container style="height: 100%;">
                            <el-main style="height: 100%; padding:0;">
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
                                        <svg-icon slot="prefix" icon-class="zanwushuju"
                                                  style="font-size:40px;color:#ccc"/>
                                        <p style="font-size:13px;  margin-top:10px">暂无数据</p>
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
                    </el-main>
                    <!--左右分割鼠标移动-->
                    <resize-x :left="leftWidth"
                              :max=450
                              :min=150
                              @change="funResizeX"/>
                </el-container>
            </el-main>

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
    import resizeX from "@/itsoftUI/components/resize/resizeX";
    import {List, Del, exportCSV} from "@/api/common"

    export default {
        name: "singleTable",
        components: {toolButton, columnSetting, exportData, toolQuery, resizeX},
        data() {
            return {
                //表格数据
                dataList: [],
                //目录树数据
                treeList: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
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
                //导出标识
                isExport: false,
                //左侧宽度
                leftWidth: "200px",
                //选中node
                selectedNodeData: {id:'root',name:'全部类别',code:'root'},


            }
        },
        props: {
            api:null,
            treeApi:null,
            //工具条按钮
            toolButtons: null,
            //列表名称，用于本地存储来
            listName: null,
            //列表默认排序
            defaultOrder: null,
            //目录树排序
            treeOrder: {
                type: String,
                default: ''
            },
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
            nodeField:null,
            nodePremission: {
                type: Boolean,
                default: false
            },


        },
        methods: {
            //按钮事件
            toolButtonClick(text) {
                switch (text) {
                    case "刷新":
                        this.$refs.dataListTable.setCurrentRow()
                        this.funLoadData()
                        break
                    case "添加类别":
                        this.funNodeEdit("0")
                        break
                    case "收起所有":
                        this.funCollapseAll()
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
            //编辑
            funEdit(val) {
                if (val === "edit") {
                    if (!this.currentRow) {
                        this.$message.error('未选中要编辑的数据行');
                        return false
                    }
                    val = this.currentRow
                }
                this.$emit('edit', val);
            },
            //加载数据
            funLoadData() {
                //分页
                let page = {"pageSize": 0, "pageIndex": 0}
                if (this.showPage) {
                    page = {"pageSize": this.pageSize, "pageIndex": this.currentPage}
                }
                //排序
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
                //联动查询
                if(this.selectedNodeData.code!=='root' && this.nodeField){
                    search.push({
                        "andOr": "and",
                        "searchField": this.nodeField,
                        "operator": "likeleft",
                        "searchValue": this.selectedNodeData.code
                    })
                }
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
                    this.api.Export(JSON.stringify(search), fields, header, this.exportFileName, this.tableOrder).then(() => {
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
                    this.api.List(JSON.stringify(search), this.tableOrder, JSON.stringify(page), fields).then((res) => {
                        if (this.showPage) {
                            this.dataList = res.data.rows
                            this.totalRows = res.data.total
                        } else {
                            this.dataList = res.data
                            this.totalRows = res.data.size()
                        }
                        this.listLoading = false;
                    }).catch(() => {
                        this.listLoading = false;
                    });
                }
            },
            //删除数据
            funDelete() {
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
                    this.loadingText="数据删除中..."
                    let ids = []
                    deleteRows.forEach(function (item) {
                        ids.push(item.id)
                    })
                    this.api.Del(JSON.stringify(ids)).then(() => {
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
            //每页数量发生改变
            evtPageSizeChange(val) {
                this.pageSize = val
                this.funLoadData()
            },
            //分页
            evtPageCurrentChange(val) {
                this.currentPage = val
                this.funLoadData()
            },
            //双击行
            evtTableRowdblclick() {
                this.funEdit("edit")
            },
            //单选行
            evtTableRowChange(currentRow) {
                this.currentRow = currentRow
            },
            evtTableSelectionChange(selection) {
                //多选行
                this.selectRows = selection
            },
            //排序改变
            evtTableSortChange(obj) {
                this.tableOrder = ""
                if (obj.order) {
                    if (obj.order === 'descending') {
                        this.tableOrder = obj.prop + " desc "
                    } else {
                        this.tableOrder = obj.prop
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
            },
            //鼠标改变左右宽度
            funResizeX(val) {
                this.leftWidth = val.toString() + 'px'
            },
            //加载目录树
            //通过编码加载目录树数据
            funLoadNode(node, resolve) {
                let nodeId = 'root'
                if (node.level === 0) {
                    return resolve([this.selectedNodeData])
                }else if (node.level > 1) {
                    nodeId = node.data.id
                }
                //分页
                let page = {pageSize: 0, pageIndex: 0}
                //排序
                let order = this.treeOrder
                //组合查询条件
                let search = []
                //加入自定义查询
                search.push({
                    andOr: "and",
                    searchField: "parentid",
                    operator: "=",
                    searchValue: nodeId
                });
                if (nodeId==="root") {
                    //加入默认查询
                    search.unshift(this.defaultSearch)
                }
                //加载数据
                let fields = "id,name,code"
                this.treeApi.List(JSON.stringify(search), order, JSON.stringify(page), fields).then((res) => {
                    return resolve(res.data)
                }).catch(() => {
                    return resolve([])
                });
            },
            //改变节点(单击/双击）
            funNodeChange(node) {
                if  (this.selectedNodeData.id !== node.id) {
                    this.selectedNodeData = node
                    this.funLoadData()
                }
            },
            funNodeEdit(val){
                if (val==='0'){
                    //添加类别
                    if(!this.selectedNodeData.id){
                        this.$message.error('先选中目录节点');
                        return false
                    }
                }
                this.$emit('editNode',this.selectedNodeData, val);
            },
            //添加节点(添加子级）
            addNode(data)
            {
                let  selectedNode=this.$refs.leftTree.getNode(this.selectedNodeData)
                //判断加载数据并展开
                new Promise((resolve) => {
                    this.funExpandedNode(selectedNode,true,resolve)
                }).then((res) =>{
                    //添加
                    if (res==="0")
                        this.$refs.leftTree.append(data,selectedNode)
                })
            },
            //删除节点
            funDeleteNode(node) {
                this.$confirm('确定要删除当前选中的数据吗？', '删除', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '删除',
                    cancelButtonText: '放弃删除',
                    type: 'warning',
                }).then(() => {
                    this.$emit('delNode',node);
                }).catch(() => {

                });

            },
            removeNode(node){
                this.$refs.leftTree.remove(node)
                //判断是否当前选中的node
                if(this.selectedNodeData.id === node.data.id) {
                    this.selectedNodeData={}
                }
            },
            //编辑节点
            updateNode(name){
                this.selectedNodeData.name=name
            },
            //展开、收起节点
            funExpandedNode(nodeData,expanded,resolve) {
                //console.log(node)
                let  node=this.$refs.leftTree.getNode(nodeData)
                if (!node.loaded) {
                    node.loading=true
                    new Promise((resolve) => {
                        this.funLoadNode(node, resolve)
                    }).then(data => {
                        node.doCreateChildren(data)
                        node.loaded = true
                        if (data.length===0) {
                            node.isLeaf=true
                        }else{
                            node.isLeaf=false
                        }
                        if (expanded) {
                            node.expanded=expanded
                        }else{
                            node.expanded = !node.expanded
                        }
                       node.loading=false
                        if (resolve) return resolve("1")

                    })
                }else
                {
                    if (expanded) {
                        node.expanded=expanded
                    }else{
                        node.expanded = !node.expanded
                    }
                    if (resolve) return resolve("0")
                }
            },
            //收起所有
            funCollapseAll(){
                let that = this;
                let treeList = this.$refs.leftTree.store.nodesMap
                for (let item in treeList) {
                    if (item!="root")
                    {
                        that.$refs.leftTree.store.nodesMap[item].expanded = false
                    }
                }

            },
            currentNode(){
                return this.selectedNodeData
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

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        .tree-button {
            display: none;
            color: #999;
            font-size: 12px;
            float: left;
            margin-left:10px;
            &:hover {
                color: #e54545;
                font-size: 13px;
                font-weight: bold;
            }
        }

        &:hover .tree-button {
            display: block;
        }

    }
</style>
