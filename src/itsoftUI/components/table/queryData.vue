<template>
    <el-drawer
            title="多条件组合查询"
            :visible.sync="drawerVisible"
            size="500px"
            :with-header="false">
        <div style="height: 100%; " class="workspace">
            <el-container style="height: 100%;background-color:#fff;">
                <el-header class="toolbar-wap" style="height:92px; padding:0">
                    <div style="height:47px;border-bottom: 1px solid #e3e8ee;line-height:43px; ">
                        <span style="font-weight: bold; float: left ; font-size:14px; padding:1px 15px;color:#888;">自定义检索条件 | {{title}}</span>
                    </div>
                    <div>
                        <tool-button text="添加" icon="tianjia" right-line @buttonClick="toolButtonClick"/>

                        <tool-button text="清空" icon="qingchu" right-line @buttonClick="toolButtonClick"/>
                        <tool-button text="保存且执行" v-if="listName" icon="baocun" right-line @buttonClick="toolButtonClick"/>
                        <tool-button text="执行查询" icon="bofang" @buttonClick="toolButtonClick"/>
                        <tool-button text="关闭" icon="guanbi" left-line @buttonClick="toolButtonClick"
                                     style=" float:right"/>

                    </div>
                </el-header>
                <el-main style="height: 100%;" class="page-main">
                    <el-table ref="dataListTable"
                              :data="dataList"
                              tooltip-effect="light"
                              empty-text=""
                              border
                              :cell-class-name="cellClassName"
                              :row-class-name="tableRowClassName"
                              height="100%"
                              style="width: 100%;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <div class="cell-delete-btn" @click="deleteRow(scope.$index)">
                                    <svg-icon slot="prefix" icon-class="delete"/>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="searchField"
                                label="查询字段"
                                align="center"
                                width="120">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.searchField"
                                           size="mini"
                                           @change="(value)=> {searchFieldChange(value, scope.row,scope.$index)}"
                                           placeholder="请选择">
                                    <el-option
                                            v-for="item in searchFields"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"/>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="operator"
                                label="运算符"
                                align="center"
                                width="100">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.operator"
                                           :loading="selectLoading"
                                           v-if="scope.row.fieldType"
                                           @visible-change="(value)=> {loadOperators(value, scope.row,scope.$index)}"
                                           size="mini" placeholder="请选择">
                                    <el-option
                                            v-for="item in operators"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"/>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="值">
                            <template slot-scope="scope">
                                <!--字符类型输入-->
                                <el-input v-model="scope.row.searchValue"
                                          v-if="scope.row.fieldType=='string'"
                                          placeholder="请输入内容"
                                          size="mini"/>
                                <el-input-number v-model="scope.row.searchValue"
                                                 v-if="scope.row.fieldType=='number'"
                                                 size="mini"
                                                 :precision="2"
                                                 style="width:100%;"
                                                 controls-position="right"/>
                                <!--日期类型-->
                                <el-date-picker
                                        v-model="scope.row.searchValue"
                                        v-if="scope.row.fieldType=='date'"
                                        type="date"
                                        size="mini"
                                        style="width: 100%;"
                                        :editable=false
                                        prefix-icon="prefix-icon"
                                        placeholder="选择日期"/>
                                <!--select-->
                                <el-select v-model="scope.row.searchValue"
                                           :loading="selectLoading"
                                           :filterable="scope.row.fieldType=='table'"
                                           v-if="scope.row.fieldType=='select' || scope.row.fieldType=='table'"
                                           @visible-change="(value)=> {loadSelectData(value,scope.row)}"
                                           size="mini"
                                           :placeholder="scope.row.fieldType=='select'?'请选择':'请选择/输入'">
                                    <el-option
                                            v-for="item in selectData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"/>
                                </el-select>

                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="andOr"
                                label="连接"
                                width="65"
                                align="center">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.andOr" size="mini">
                                    <el-option
                                            v-for="item in andOrs"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"/>
                                </el-select>
                            </template>
                        </el-table-column>
                        <div slot="empty" class="table-empty">
                            <svg-icon slot="prefix" icon-class="zanwushuju" style="font-size:40px;color:#ccc" />
                            <p  style="font-size:13px;  margin-top:10px" >暂无查询条件</p>
                        </div>
                    </el-table>
                </el-main>
            </el-container>
        </div>
    </el-drawer>
</template>

<script>
    import toolButton from "@/itsoftUI/components/toolbar/toolbutton"
    import {List} from "@/api/common"
    export default {
        name: "queryData",
        components: {toolButton},
        props: {
            columns: null,
            listName: null
        },
        data() {
            return {
                drawerVisible: false,
                //查询条件
                dataList: [],
                //运算符池
                operatorsAll: [
                    {value: '=', label: '等于', type: 'all'},
                    {value: '<>', label: '不等于', type: 'all'},
                    {value: '>', label: '大于', type: 'number,date'},
                    {value: '<', label: '小于', type: 'number,date'},
                    {value: '>=', label: '大于等于', type: 'number,date'},
                    {value: '<=', label: '小于等于', type: 'number,date'},
                    {value: 'like', label: '包含', type: 'string'},
                    {value: 'likeleft', label: '左包含', type: 'string'},
                ],
                //当前运算符（根据字段类型筛选过滤后得到）
                operators: [],
                //逻辑连接符
                andOrs: [
                    {value: 'or', label: '或'},
                    {value: 'and', label: '且'}
                ],
                //查询字段
                searchFields: [],
                selectData: [],
                selectLoading: false,
                //本地存储查询
                localQuery: [],
                localKey: this.listName + "-" + this.$ver + "-QUERY",
                title:'自定义条件'
            };
        },
        methods: {
            toolButtonClick(text) {
                switch (text) {
                    case "添加":
                        this.dataList.push({
                            andOr: "and",
                            searchField: "",
                            operator: "",
                            searchValue: "",
                            fieldType: null})
                        break
                    case "清空":
                        this.dataList = []
                        break
                    case "保存且执行":
                        this.saveList()
                        break
                    case "执行查询":
                        this.searchSubmit()
                        break
                    case "关闭":
                        this.drawerVisible = false
                        break
                }
            },
            deleteRow(index) {
                this.dataList.splice(index, 1)
            },
            cellClassName() {
                return 'cell-input'
            },
            tableRowClassName({row}) {
                if (row.operator === "" || row.searchField === "" || row.searchValue === "" || row.searchValue === null) {
                    row.status = '0'
                    return 'warning-row'
                } else {
                    row.status = '1'
                    return ""
                }
            },
            //来自父组件调用打开窗口
            queryOpen(label,value) {
                if (value) {
                    this.dataList = value
                } else {
                    this.dataList = []
                }
                this.title=label
                this.drawerVisible = true
            },
            //加载运算符
            loadOperators(val, row) {
                //运算符过滤，根据查询
                if (val) {
                    this.operators = []
                    //显示
                    //判断字段
                    let field = row.searchField
                    if (!field) {
                        this.$message.warning("请先选查询字段")
                        return false
                    }
                    this.selectLoading = true
                    let fieldType = "string"
                    this.searchFields.filter(item => item.value == field).forEach(function (item) {
                        if (item.type) {
                            fieldType = item.type
                        }
                    })
                    this.operators = this.operatorsAll.filter(item => item.type.indexOf(fieldType) >= 0 || item.type.indexOf('all') >= 0)
                    this.selectLoading = false
                    //console.log(this.operators)
                }
            },
            //加载select数据
            loadSelectData(val, row) {
                if (val) {
                    this.selectLoading = true
                    this.selectData = []
                    let that = this
                    //判断字段
                    let field = row.searchField
                    this.searchFields.filter(item => item.value == field).forEach(function (item) {
                        if (item.type === 'select') {
                            if (item.selectData) {
                                that.selectData = item.selectData
                                that.selectLoading = false
                            }
                        } else {
                            List(JSON.stringify(item.selectData.search),
                                null, null,
                                item.selectData.table,
                                item.selectData.field).then((res) => {
                                that.selectData = res.data
                                that.selectLoading = false
                            }).catch(() => {
                                that.selectLoading = false
                            });
                        }
                    })
                }
            },
            //加载字段
            loadColumns() {
                let that = this
                if (this.columns) {
                    this.columns.forEach(function (item) {
                        let type = "string"
                        let prop = item.prop
                        if (item.type) {
                            type = item.type
                        }
                        if (item.searchProp) {
                            prop = item.searchProp
                        }
                        if (type != "none") {
                            let field = {label: item.label, value: prop, type: type, selectData: item.selectData}
                            that.searchFields.push(field)
                        }
                    })
                }
            },
            //选中字段触发
            searchFieldChange(val, row) {
                this.operators = this.operatorsAll.filter(item => item.value == '=')
                row.operator = "="
                row.searchValue = null
                row.fieldType = "string"
                this.searchFields.filter(item => item.value == val).forEach(function (item) {
                    if (item.type) {
                        row.fieldType = item.type
                    }
                });
            },
            //保存条件
            saveList() {
                if (this.dataList.length === 0) {
                    this.$message.warning("请先添加查询条件")
                    return false
                }
                //提取本地存储数据
                this.localQuery = JSON.parse(localStorage.getItem(this.localKey))
                if (!this.localQuery) this.localQuery = []

                if ( this.title==='自定义条件') {
                    this.$prompt('保存查询，给查询起一个名字', {
                        inputValidator: (val) => {
                            //必填
                            if (val === null || val.length === 0) {
                                return '名称不能为空'
                            }
                            if (val === '自定义条件') {
                                return '名称不能为[自定义条件]'
                            }
                            //判断名称是否存在
                            for (let i = 0; i < this.localQuery.length; i++) {
                                if (this.localQuery[i].label === val) {
                                    return val + "已存在";
                                    break
                                }
                            }
                            return true
                        }
                    }).then((val) => {
                        let item = {label: val.value, value: JSON.stringify(this.dataList)}
                        this.localQuery.push(item)
                        localStorage.setItem(this.localKey, JSON.stringify(this.localQuery))
                        this.title=val.value
                        this.$emit('updateSelect', this.localQuery,JSON.stringify(this.dataList));
                        this.$message.success("新增保存成功")
                    }).catch(() => {
                        //取消
                        return false;
                    });
                } else {
                    //编辑
                    for (let i = 0; i < this.localQuery.length; i++) {
                        if (this.localQuery[i].label === this.title) {
                            //更新数据
                            let item = {label: this.title, value: JSON.stringify(this.dataList)}
                            this.localQuery.splice(i, 1, item)
                            break
                        }
                    }
                    localStorage.setItem(this.localKey, JSON.stringify(this.localQuery))
                    this.$emit('updateSelect', this.localQuery,JSON.stringify(this.dataList));
                    this.$message.success("编辑保存成功")
                }
            },
            //确定执行查询
            searchSubmit() {
                if (this.dataList.length === 0) {
                    this.$message.warning("请添加查询条件")
                    return false
                }
                if (this.dataList.filter(item => item.status == "0").length > 0) {
                    this.$message.warning("请检查条件是否完整")
                    return false
                }
                this.$emit('executeQuery', this.dataList);
            },

        },
        created() {
            //加载字段
            this.loadColumns()
        }
    }
</script>

<style lang="scss" scoped>
    .cell-delete-btn {
        float: left;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;

        &:hover {
            color: #e54545;
            font-weight: bold;
            font-size: 16px;
        }
    }

    .prefix-icon {
        margin-right: 20px;
    }



    .delete-select-bth {
        float: right;
        color: #999;
        font-size: 13px;

        &:hover {
            color: #e54545;
        }
    }

</style>
