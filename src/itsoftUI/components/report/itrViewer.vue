<!--iTR报表浏览器2020版-->
<template>
    <el-container class="h100 pd0">
        <el-main class="pd0" v-loading="Loading">
            <div class="itr-report">
                <el-container class="h100 pd0">
                    <el-header style="height:45px; position: relative;" class="pd0 ">
                        <div class="toolbar-wap">
                            <div class="toolbar-title">
                                <svg-icon slot="prefix" style="font-size:16px;" :icon-class="ReportData.type"/>
                                <span :class="ReportData.type">{{this.ReportData.name}}</span>
                            </div>
                            <div style=" float: left; margin-top:6px;" v-if="ReportData.type==='DataGrid' && isAuth">
                                <el-pagination
                                        background
                                        @current-change="evtPageCurrentChange"
                                        :current-page.sync="PageIndex"
                                        :page-size="PageSize"
                                        layout="total, prev, pager, next"
                                        :total="RowTotal">
                                </el-pagination>
                            </div>
                            <tool-button title="返回" icon="itr_exit" @buttonClick="toolButtonClick"
                                         style="font-size:20px; float: right;margin-right:1px; font-weight: bold;"/>
                            <div v-if="isAuth">
                                <div :class="TabIndex==='1'?'viewer-button on':'viewer-button'"
                                     @click="toolButtonClick('1')"
                                     style="right:206px;">
                                    <svg-icon slot="prefix" icon-class="chaxun" style="font-size:14px;"/>
                                    <span>检索</span>
                                </div>
                                <div :class="TabIndex==='2'?'viewer-button on':'viewer-button'"
                                     v-if="RowTotal>0 "
                                     @click="toolButtonClick('2')"
                                     style="right:138px;">
                                    <svg-icon slot="prefix" icon-class="itr_print" style="font-size:14px;"/>
                                    <span>打印</span>
                                </div>
                                <div v-else class="viewer-button disabled" style="right:138px;">
                                    <svg-icon slot="prefix" icon-class="itr_print" style="font-size:14px;"/>
                                    <span>打印</span>
                                </div>
                                <div :class="TabIndex==='3'?'viewer-button on':'viewer-button'"
                                     @click="toolButtonClick('3')"
                                     v-if="RowTotal>0"
                                     style="right:72px;">
                                    <svg-icon slot="prefix" icon-class="daochu" style="font-size:14px;"/>
                                    <span>导出</span>
                                </div>
                                <div v-else class="viewer-button disabled" style="right:72px;">
                                    <svg-icon slot="prefix" icon-class="daochu" style="font-size:14px;"/>
                                    <span>导出</span>
                                </div>
                                <div :class="TabIndex==='4'?'viewer-button on':'viewer-button'"
                                     @click="toolButtonClick('4')"
                                     style="right:34px;" title="报表资料">
                                    <svg-icon slot="prefix" icon-class="education" style="font-size:14px;"/>
                                </div>
                            </div>
                        </div>
                    </el-header>
                    <el-main class="h100 pd0" style="background-color:#ffffff">
                        <el-container class="h100 page-main-warp" id="page-main-warp"
                                      style="position: relative;"
                                      v-if="ReportData.id!='0' && isAuth">
                            <el-main class="main-warp h100"
                                     id="pagemain"
                                     style="width:100%">
                                <div ref="pageviewer">
                                    <div :style="stylePreviewPageSize"
                                         id="page-viewer"
                                         class="page-viewer">
                                        <div id="report-page-warp"
                                             :style="stylePageMargin">
                                            <!--头部区域-->
                                            <div v-for="area in this.ItReport.Page.Area.filter(item =>item.id==='report-header')"
                                                 :id="area.id"
                                                 :style="area.style"
                                                 :key="area.id">
                                                <!--区域元素-->
                                                <div v-for="node in ItReport.NodeItem.filter(item =>item.Area===area.id )"
                                                     :key="node.Id"
                                                     :style="node.Style">

                                                    <vue-qr v-if="node.BarCode"
                                                            :text="node.Text" :margin="0"
                                                            :colorDark="node.StyleValue.Color"
                                                            colorLight="#fff"
                                                            :size="funMMtoPX(node.StyleValue.Width)">
                                                    </vue-qr>
                                                    <span v-else-if="node.Value === 'pageindex'"
                                                          v-html="PageIndex"></span>
                                                    <span v-else-if="node.Value === 'pagetotal'"
                                                          v-html="PageCount"></span>
                                                    <span v-else-if="node.Value === 'pageindextotal'"
                                                          v-html="'第'+PageIndex+'/共'+PageCount+'页'"></span>
                                                    <div v-else v-html="node.Text"></div>
                                                </div>
                                            </div>
                                            <!--明细区域明细数据-->
                                            <div v-for="(data,index) in ItReport.DataSet[0].Data"
                                                 class="report-detail"
                                                 :style="DetailStyle"
                                                 :key="index">
                                                <!--区域元素-->
                                                <div v-for="node in DetailNodes"
                                                     :key="node.Id"
                                                     :style="node.Style+'overflow: hidden;'">
                                                    <span v-if="node.Text === 'row-index'">{{((PageIndex -1)*PageSize)+index+1}}</span>
                                                    <span v-else-if="node.FieldType === 'ComputeField'">
                                                        <span v-if="node.ReportId && node.ReportId.length>0 && Number(data[node.Text])!==0"
                                                              @click="funReportLink(node,data)"
                                                              class="ReportLink"
                                                              v-html="data[node.Text]"></span>
                                                        <span v-else v-html="data[node.Text]"></span>
                                                    </span>
                                                    <span v-else-if="node.ReportId && node.ReportId.length>0"
                                                          @click="funReportLink(node,data)"
                                                          class="ReportLink">{{data[node.Value]}}</span>
                                                    <span v-else>{{data[node.Value]}}</span>
                                                </div>
                                                <!--明细区域线-->
                                                <div v-for="node in DetailNodesLine"
                                                     :key="node.Id">
                                                    <div v-if="node.RowSplit && index===DataSetData.length-1"
                                                         :style="node.Style"></div>
                                                    <div v-if="!node.RowSplit" :style="node.Style"></div>
                                                </div>
                                            </div>
                                            <!--空数据-->
                                            <div v-if="RowTotal===0 && ItReport.Type==='DataGrid'" class="empty-data">
                                                无数据
                                            </div>
                                            <!--汇总区域明-->
                                            <div v-for="area in this.ItReport.Page.Area.filter(item =>item.id==='report-summary'
                                                && item.Show && this.PageIndex===this.PageCount)"
                                                 :id="area.id"
                                                 :style="ItReport.Page.Area.filter(item=>item.id==='report-detail')[0].style"
                                                 :key="area.id">
                                                <!--区域元素-->
                                                <div v-for="node in ItReport.NodeItem.filter(item =>item.Area===area.id)"
                                                     :key="node.Id"
                                                     :style="node.Style">
                                                    <span v-if="node.FieldType === 'ComputeField'"
                                                          v-html="ItReport.DataSet[0].SumData?ItReport.DataSet[0].SumData[node.Text]:'0'"></span>
                                                    <span v-else-if="node.DataType === 'db'"
                                                          v-html="ItReport.DataSet[0].SumData?ItReport.DataSet[0].SumData[node.Value]:'0'"></span>
                                                    <span v-else v-html="node.Text"></span>
                                                </div>
                                            </div>
                                            <!--尾部区域-->
                                            <div v-for="area in this.ItReport.Page.Area.filter(item =>item.id==='report-footer')"
                                                 :id="area.id"
                                                 :style="area.style"
                                                 :key="area.id">
                                                <!--区域元素-->
                                                <div v-for="node in ItReport.NodeItem.filter(item =>item.Area===area.id )"
                                                     :key="node.Id"
                                                     :style="node.Style">
                                                    <span v-if="node.Value === 'pageindex'"
                                                          v-html="PageIndex"></span>
                                                    <span v-else-if="node.Value === 'pagetotal'"
                                                          v-html="PageCount"></span>
                                                    <span v-else-if="node.Value === 'pageindextotal'"
                                                          v-html="'第'+PageIndex+'/共'+PageCount+'页'"></span>
                                                    <div v-else v-html="node.Text"></div>
                                                </div>
                                            </div>
                                            <!--自由格式-->
                                            <div v-for="area in this.ItReport.Page.Area.filter(item =>item.id==='report-freeform')"
                                                 :id="area.id"
                                                 :style="area.style"
                                                 :key="area.id">
                                                <!--区域元素-->
                                                <div v-for="node in ItReport.NodeItem.filter(item =>item.Area===area.id && item.NodeType==='div' && item.DataType!=='chart' )"
                                                     :key="node.Id"
                                                     :style="node.Style">
                                                    <div v-html="node.Text"></div>
                                                </div>
                                                <table v-for="node in ItReport.NodeItem.filter(item =>item.Area===area.id && item.NodeType==='table' )"
                                                       :key="node.Id"
                                                       :id="node.Id"
                                                       :node-type="node.NodeType"
                                                       :data-type="node.DataType"
                                                       tabindex="0"
                                                       cellpadding="0"
                                                       cellspacing="1"
                                                       :style="node.Style+'table-layout: fixed;cellpadding:0;cellspacing:1pt;'">
                                                    <colgroup>
                                                        <col v-for="(col,index) in node.Tables.ColGroup"
                                                             :key="index"
                                                             :style="'width:'+col+'mm'"/>
                                                    </colgroup>
                                                    <tbody v-for="(dataset,datarow) in funGetTableData(node.DataSetValue)"
                                                           :key="datarow">
                                                    <tr v-for="(TR,row) in node.Tables.RowCol"
                                                        :key="row">
                                                        <td v-for="(TD,col) in TR"
                                                            v-show="TD.Span==='0'"
                                                            :colspan="TD.Colspan.length"
                                                            :rowspan="TD.Rowspan.length===0?-1:TD.Rowspan.length"
                                                            :table-id="node.Id"
                                                            :data-index="row+'-'+col"
                                                            :style="funStyleTD(TD)"
                                                            :key="col">
                                                            <span v-if="TD.Type==='text' && TD.Data==='text'"
                                                                  v-html="TD.Text"></span>
                                                            <span v-if="TD.Type==='text' && TD.Data==='db'"
                                                                  v-html="dataset[TD.Value]"></span>
                                                            <vue-qr v-if="TD.Type==='barcode'"
                                                                    :text="TD.Data==='db'?dataset[TD.Value].toString():TD.Text"
                                                                    :margin="3"
                                                                    colorDark="#000"
                                                                    colorLight="#fff"
                                                                    :size="parseInt(TD.CodeSize)">
                                                            </vue-qr>
                                                            <img v-if="TD.Type==='img'"
                                                                 :src="TD.Data==='db'?dataset[TD.Value].toString():TD.Text"
                                                                 :width="TD.ImgWidth"
                                                                 :height="TD.ImgHeight"/>


                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <div v-for="(node,index) in ItReport.NodeItem.filter(item =>item.Area===area.id && item.DataType==='chart')"
                                                     :key="node.Id+'-'+index"
                                                     :id="node.Id"
                                                     :node-type="node.NodeType"
                                                     :data-type="node.DataType"
                                                     :style="node.Style">
                                                    <div v-if="ItReport.DataSet.filter(item=>item.Id===node.DataSetValue).length>0">
                                                        <chart :option="node.ChartOption"
                                                               :size="funChartSize(node.StyleValue)"
                                                               :field="ItReport.DataSet.filter(item=>item.Id===node.DataSetValue)[0].SelectFields"
                                                               :dataset="ItReport.DataSet.filter(item=>item.Id===node.DataSetValue)[0].Data">
                                                        </chart>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <iframe id="print-iframe"
                                        style="position:absolute;width:0px;height:0px;top:0px;left:0px;"></iframe>
                            </el-main>
                            <!--检索区-->
                            <el-aside class="right-aside" v-show="TabIndex!=='0'">
                                <!--检索-->
                                <div class="query-warp" v-show="TabIndex==='1'">
                                    <div v-if="QueryData.QueryParam.length>0">
                                        <el-form ref="queryForm" :model="QueryData" class="query-form"
                                                 label-width="0px" @submit.native.prevent>
                                            <el-form-item v-for="(query,index) in QueryData.QueryParam"
                                                          :prop="'QueryParam.'+index+'.Default'"
                                                          :rules="funGetRules(query)"
                                                          :key="index">
                                                <div class="title">
                                                    <i class="el-icon-price-tag"
                                                       :style="query.Required ? 'color:#F56C6C' :''"></i>
                                                    <span>{{query.ShowLabel}}</span>
                                                </div>
                                                <!--输入-->
                                                <el-input v-if="query.InputType==='1' &&
                                                            ( !query.Default || typeof query.Default !== 'object')  "
                                                          v-model="query.Default"
                                                          :placeholder="'请输入'+query.ShowLabel"
                                                          size="small"/>
                                                <!--选择静态-->
                                                <el-select v-if="query.InputType==='2' && query.DataSource==='1'"
                                                           v-model="query.Default"
                                                           :placeholder="'请选择'+query.ShowLabel"
                                                           style="width: 100%;"
                                                           :multiple="!query.selectType?true:query.selectType==='check'? true:false"
                                                           :filterable="!query.selectType?false:query.selectType==='check'? false:true"
                                                           @change="(val)=>funChangeSelect(val,query)"
                                                           size="small">
                                                    <div slot="prefix" class="select-prefix">
                                                        <svg-icon slot="prefix"
                                                                  :icon-class="query.selectType?query.selectType:'check'"/>
                                                    </div>
                                                    <el-option
                                                            class="report-setting-Dict-item"
                                                            v-for="(item,index) in query.DataList.filter(item=>item.label.length>0)"
                                                            :key="index"
                                                            :label="item.label"
                                                            :value="item.value"/>
                                                </el-select>
                                                <!--选择字典-->
                                                <el-select v-if="query.InputType==='2' && query.DataSource==='2'"
                                                           v-model="query.Default"
                                                           style="width: 100%;"
                                                           :placeholder="'请选择'+query.ShowLabel"
                                                           :multiple="!query.selectType?true:query.selectType==='check'? true:false"
                                                           :filterable="!query.selectType?false:query.selectType==='check'? false:true"
                                                           :loading="query.loading"
                                                           @visible-change="(val)=>evtSelectLoad(val,query)"
                                                           @change="(val)=>funChangeSelect(val,query)"
                                                           :clearable="!query.Required"
                                                           size="small">
                                                    <div slot="prefix" class="select-prefix">
                                                        <svg-icon slot="prefix"
                                                                  :icon-class="query.selectType?query.selectType:'check'"/>
                                                    </div>
                                                    <el-option
                                                            v-for="(item,index) in query.DataList.filter(item=>item.label.length>0)"
                                                            class="report-setting-Dict-item"
                                                            :key="index"
                                                            :label="item.label"
                                                            :value="item.value"/>
                                                </el-select>
                                                <!--时间查询-->
                                                <el-select v-if="query.FieldType.indexOf('date')>=0"
                                                           v-model="query.Default"
                                                           style="width: 100%;"
                                                           @change="(val)=>funSetSEDate(val,query)"
                                                           size="small">
                                                    <el-option
                                                            v-for="(item,index) in DateParamDefault"
                                                            class="report-setting-item"
                                                            :key="index"
                                                            :label="item.label"
                                                            :value="item.value"/>
                                                </el-select>
                                                <el-date-picker
                                                        style="width: 100%;"
                                                        v-if="query.FieldType.indexOf('date')>=0 && query.Default==='none'"
                                                        v-model="query.SDate"
                                                        :clearable="false"
                                                        :value-format="query.DateFormat==='date'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
                                                        size="small"
                                                        :type="query.DateFormat?query.DateFormat:'date'">
                                                </el-date-picker>
                                                <el-date-picker
                                                        style="width: 100%;"
                                                        v-if="query.FieldType.indexOf('date')>=0 && query.Default==='none'"
                                                        v-model="query.EDate"
                                                        size="small"
                                                        :value-format="query.DateFormat==='date'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
                                                        :clearable="false"
                                                        :type="query.DateFormat?query.DateFormat:'date'">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-form>
                                        <el-button type="primary" style="width:100%; margin-top:30px;" size="small"
                                                   @click="evtQueryData"
                                                   :loading="Loading"
                                                   icon="el-icon-search">数据检索
                                        </el-button>
                                    </div>
                                    <div v-else style="padding: 10px;color:#999999">
                                        <i class="el-icon-info"></i> 未设置检索条件
                                    </div>
                                </div>
                                <!--打印-->
                                <div v-show="TabIndex==='2'" class="query-warp">
                                    <div class="msg"><i class="el-icon-info"></i>共{{RowTotal}}条记录，{{Math.ceil(RowTotal/PageSize)}}页
                                    </div>
                                    <div class="title">
                                        <i class="el-icon-price-tag"></i>
                                        <span>打印范围</span>
                                    </div>
                                    <el-radio-group v-model="PrintRadio" class>
                                        <el-radio :label="1" style="width:100%; margin:10px;">全部</el-radio>
                                        <el-radio :label="2" style="width:100%; margin:10px;">偶数页</el-radio>
                                        <el-radio :label="3" style="width:100%; margin:10px;">奇数页</el-radio>
                                        <el-radio :label="4" style="width:100%; margin:10px;">当前页</el-radio>
                                        <el-radio :label="5" style="width:100%; margin:10px;">页面范围</el-radio>
                                    </el-radio-group>
                                    <!--输入-->
                                    <el-input v-model="PrintPageNum"
                                              style="width:180px; margin-left:30px;"
                                              :placeholder="'请输入页面范围'"
                                              @change="(val)=>{this.PrintRadio=5}"
                                              size="small"/>
                                    <p style="color:#999999; font-size:12px; margin-left:30px;line-height:10px;">
                                        输入页面范围，用逗号分割</p>
                                    <p style="color:#999999; font-size:12px; margin-left:30px;line-height:10px;">
                                        例如:1,2,4-5</p>
                                    <el-button type="primary"
                                               v-if="!Printing"
                                               style="width:100%; margin-top:10px;" size="small"
                                               @click="funPrint">打印
                                    </el-button>
                                    <el-progress v-if="Printing" :percentage="PrintPercentage"
                                                 status="success"></el-progress>


                                </div>
                                <!--导出-->
                                <div v-show="TabIndex==='3'" class="query-warp">
                                    <div class="msg"><i class="el-icon-info"></i>共{{RowTotal}}条记录
                                    </div>
                                    <div class="title">
                                        <i class="el-icon-price-tag"></i>
                                        <span>导出PDF</span>
                                    </div>
                                    <div style=" float: left; padding:0px 0 0px 20px; color:#666;">
                                        <p>PDF格式可以通过打印方式进行导出</p>
                                        <p>1.选择打印，确定要打印的范围</p>
                                        <p>2.进行打印操作，出现打印系统窗口</p>
                                        <p>3.在窗口选择目标打印机（另存PDF）或打印另存</p>
                                    </div>
                                    <div class="title">
                                        <i class="el-icon-price-tag"></i>
                                        <span>导出CSV</span>
                                    </div>
                                    <div style=" float: left; padding:10px 0 20px 20px; line-height:25px;color:#666;">
                                        格式为CSV<i style="font-size:12px">(逗号分隔值文件格式)</i>,可以用Excel软件打开
                                    </div>
                                    <el-button type="primary"
                                               :loading="exportLoading"
                                               style="width:100%; margin-top:10px;" size="small"
                                               @click="funExport">导出CSV
                                    </el-button>

                                </div>
                                <!--报表基本信息-->
                                <div v-show="TabIndex==='4'" class="query-warp">
                                    <div class="title">
                                        <span>编码</span>
                                    </div>
                                    <div class="item" v-html="this.ReportData.serialnum"></div>
                                    <div class="title">
                                        <span>报表名称</span>
                                    </div>
                                    <div class="item" v-html="this.ReportData.name"></div>
                                    <div class="title">
                                        <span>所属模块</span>
                                    </div>
                                    <div class="item" v-html="this.ReportData.module"></div>
                                    <div class="title">
                                        <span>备注说明</span>
                                    </div>
                                    <div class="item" v-html="this.ReportData.remark"></div>
                                    <div class="title">
                                        <span>作者</span>
                                    </div>
                                    <div class="item" v-html="this.ReportData.edituser"></div>
                                    <div class="title">
                                        <span>编辑时间</span>
                                    </div>
                                    <div class="item" v-html="this.ReportData.edittime"></div>
                                </div>

                            </el-aside>
                            <el-backtop target=".main-warp" :right="TabIndex!=='0'?300:40"></el-backtop>
                        </el-container>
                        <el-container class="h100 page-main-warp" v-else>
                            <div style="padding:50px; margin:0 auto;font-size: 14px;">
                                {{authMsg}}
                            </div>
                        </el-container>

                    </el-main>
                </el-container>
            </div>
        </el-main>

    </el-container>
</template>

<script>
    import toolButton from "@/itsoftUI/components/toolbar/toolbutton"
    import {Get, List, ListDict, exportCSV} from "@/api/common"
    import {PageStyle} from "@/itsoftUI/components/report/style"
    import {itrFn} from "@/itsoftUI/components/report/data"
    import {ItSoftUtil} from "@/itsoftUI/utils/ItSoftUtil"
    import {unitConver} from "@/itsoftUI/components/report/unitConver";
    import chart from "@/itsoftUI/components/report/chart";
    import vueQr from 'vue-qr'
    import {isArray} from "@/itsoftUI/utils/validate";
    //报表数据表
    const tableName = 'JdJQwwwzsf9olVnBRhcsXg=='
    export default {
        name: "itrViewer",
        components: {toolButton, vueQr, chart},
        data() {
            return {
                ReportData: {
                    id: '0',
                    type: 'xiaoxi',
                    name: ''
                },//报表数据
                ItReport: {
                    DataSet: [],
                },//报表主体
                ReportId: '',
                QueryParam: [],//检索参数值
                QueryData: {}, //检索参数数据
                stylePageSize: "",//页面尺寸
                stylePreviewPageSize: "",
                stylePageMargin: "",//页面边距
                Preview: false,//预览
                DataSetData: [],//数据源数据
                Loading: false,//加载
                DetailStyle: "",
                SumFields: [],//汇总字段集合
                SumData: {},//汇总数据集
                DateParamDefault: ItSoftUtil.getDateList(),//日期类型参数默认值
                DetailNodes: [],//明细区明细
                DetailNodesLine: [],//明细区明细线
                PageSize: 0, //每页数量
                PageIndex: 1, //页码
                PageCount: 0,//总页数
                RowTotal: 0,//总数
                TabIndex: "1",
                PrintRadio: 1,
                PrintPageNum: "",
                PrintPages: [],//打印页面范围
                Printing: false,
                PrintPercentage: 0,
                exportLoading: false,
                isAuth: false,
                authMsg:''

            }
        },
        methods: {
            //按钮事件
            toolButtonClick(text) {
                switch (text) {
                    case "打印预览":
                        if (this.Preview) {
                            this.Preview = false
                        } else {
                            //生成预览数据
                            this.funPreview()
                            this.Preview = true
                        }
                        break;
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                        if (this.TabIndex === text) {
                            this.TabIndex = "0"
                        } else {
                            this.TabIndex = text
                        }

                        break
                    case "返回":
                        if (window.history.length <= 1) {
                            this.$router.push({path: '/'})
                            return false
                        } else {
                            this.$router.go(-1)
                        }
                        break
                }
            },
            //提取报表基础数据
            funGetReport(id) {
                let that = this
                that.Loading = true
                Get(id, tableName).then((res) => {
                    if (res.data) {
                        that.ReportData = res.data
                        //报表
                        that.ItReport = JSON.parse(decodeURIComponent(window.atob(that.ReportData.content)))
                        //边距
                        that.stylePageMargin = PageStyle.stylePageMargin(that.ItReport.Page)
                        //页面尺寸
                        that.stylePageSize = PageStyle.stylePreviePageSize(that.ItReport.Page)
                        //打印预览尺寸
                        that.stylePreviewPageSize = PageStyle.stylePreviePageSize(that.ItReport.Page)
                        //console.log(that.stylePreviewPageSize)
                        //内置数据转换
                        that.ItReport.NodeItem.filter(item => item.DataType === 'fx').forEach(function (item) {
                            itrFn(item.Value).then(data => {
                                item.Text = data
                            })
                        })
                        //DataGrid风格
                        if (that.ItReport.Type === 'DataGrid') {
                            //取报明细区域样式
                            this.DetailStyle = that.ItReport.Page.Area.filter(item => item.id === "report-detail")[0].style
                            //取汇总区字段
                            if (that.ItReport.DataSet.length > 0
                                && that.ItReport.Page.Area.filter(item => item.id === "report-summary"
                                    && item.Show).length > 0) {
                                let sum = []
                                that.ItReport.NodeItem.filter(item => item.Area === "report-summary" &&
                                    (item.FieldType === 'ComputeField' || item.FieldType === 'int' || item.FieldType === 'decimal'))
                                    .forEach(function (col) {
                                        let field = "sum(" + col.Value + ") as " + col.Value
                                        if (col.FieldType === "ComputeField") field = col.Value + " as " + col.Text
                                        if (sum.indexOf(field) === -1) sum.push(field)
                                    })
                                that.ItReport.DataSet[0].SumFields = sum
                            }
                            //明细区域元素
                            that.DetailNodes = that.ItReport.NodeItem.filter(item => item.Area === 'report-detail'
                                && item.DataType !== 'line')
                            that.DetailNodesLine = that.ItReport.NodeItem.filter(item => item.Area === 'report-detail'
                                && item.DataType === 'line')
                            //分页计算
                            let PH = unitConver.unit2Num(that.ItReport.Page.TopMargin) + unitConver.unit2Num(that.ItReport.Page.BottomMargin)
                            that.ItReport.Page.Area.filter(item => item.id !== 'report-detail'
                                && item.id !== 'report-summary').forEach(function (area) {
                                PH += unitConver.unit2Num(area.height)
                            })
                            let PageHeight = unitConver.unit2Num(that.ItReport.Page.Height)
                            let RowHeight = unitConver.unit2Num(that.ItReport.Page.Area.filter(item => item.id === 'report-detail')[0].height)
                            this.PageSize = parseInt(Number(PageHeight - PH) / RowHeight)
                        }
                        //报表检索参数
                        that.QueryData = {QueryParam: that.ItReport.QueryParam}
                        //给检索参数赋值
                        that.QueryParam.forEach(function (col) {
                            let query = that.QueryData.QueryParam.filter(item => item.Id === col.FieldName)[0]
                            if (query) {
                                if (query.FieldType.indexOf('date') >= 0) {
                                    that.$set(query, "SDate", col.FieldValue.split('T')[0])
                                    that.$set(query, "EDate", col.FieldValue.split('T')[1])
                                    that.$set(query, "Default", "none")
                                } else {
                                    if (query.selectType === 'radio') {
                                        query.Default = col.FieldValue
                                    } else {
                                        if (col.FieldValue.length > 0)
                                            query.Default = [col.FieldValue]
                                    }
                                    if (col.QueryDictText) {
                                        that.$set(query, "QueryDictText", col.QueryDictText)
                                    }
                                }
                            }
                        })
                        //日期类型检索条件数据初始化
                        that.QueryData.QueryParam.filter(item => item.FieldType.indexOf('date') >= 0).forEach(function (query) {
                            if (query.Default !== 'none') {
                                itrFn(query.Default).then(data => {
                                    query.Default = data.Value
                                    that.$set(query, "SDate", data.Value.split('T')[0])
                                    that.$set(query, "EDate", data.Value.split('T')[1])
                                })
                            }
                        })
                        //初始化数据字典数据
                        that.QueryData.QueryParam.filter(item => item.InputType === '2' && item.DataSource === '2').forEach(function (query) {
                            if (!query.DataList) {
                                that.$set(query, "DataList", [])
                            } else {
                                // query.DataList = []
                            }
                        })
                        this.funGetSqlSelect()
                        //执行查询
                        that.evtQueryData()
                    } else {
                        that.ReportData.name = "未找到报表"
                        that.$message.error('未找到报表');
                    }
                    that.Loading = false
                })
            },
            //获取数据字段及排序字段(多数据源）
            funGetSqlSelect() {
                let that = this
                that.ItReport.DataSet.forEach(function (dataset) {
                    let sqlSelect = ""
                    let sqlOrderBy = ""
                    let sqlGroupBy = ""
                    //select
                    dataset.SelectFields.forEach(function (node) {
                        if (sqlSelect.length > 0) sqlSelect += ","
                        if (node.DataType === "ComputeField") {
                            //计算列
                            sqlSelect += node.Name + " as " + node.Comment
                        } else {
                            if (node.Sort) {
                                if (sqlOrderBy.length > 0) sqlOrderBy += ","
                                sqlOrderBy += node.Name
                            }
                            sqlSelect += node.Name
                        }
                    })
                    //group by
                    if (dataset.SelectType === '2') {
                        dataset.SelectFields
                            .filter(item => item.DataType !== 'ComputeField').forEach(function (item) {
                            if (sqlGroupBy.length > 0) sqlGroupBy += ","
                            sqlGroupBy += item.Name
                        })
                    }
                    dataset.SqlSelect = sqlSelect
                    dataset.SqlOrderBy = sqlOrderBy
                    dataset.SqlGroupBy = sqlGroupBy
                })
            },
            //获取查询条件，开始的时候默认，检索条件可以改变
            funGetSqlWhere() {
                let that = this
                //映射查询条件
                that.ItReport.DataSet.forEach(function (dataset) {
                    let sqlWhere = []
                    //默认条件
                    sqlWhere.push({
                        "andOr": "and",
                        "searchField": "schoolcode",
                        "operator": "=",
                        "searchValue": that.$itsoftUI.config.schoolCode
                    })
                    dataset.QueryFields.forEach(function (query) {
                        let param = that.QueryData.QueryParam.filter(item => item.Id === query.QueryParam)[0]
                        if (param) {
                            if (param.FieldType.indexOf('date') >= 0) {
                                sqlWhere.push({
                                    "andOr": "and",
                                    "searchField": query.Name,
                                    "operator": ">=",
                                    "searchValue": param.SDate
                                })
                                sqlWhere.push({
                                    "andOr": "and",
                                    "searchField": query.Name,
                                    "operator": "<=",
                                    "searchValue": param.EDate
                                })
                            } else {
                                let operator = "="
                                let searchValue = param.Default
                                if (param.Default) {
                                    if (typeof param.Default === "object" && param.Default.length > 1) {
                                        operator = "in"
                                        searchValue = ""
                                        param.Default.forEach(function (item) {
                                            if (searchValue !== "") {
                                                searchValue += ",【" + item + "】"
                                            } else {
                                                searchValue += "【" + item + "】"
                                            }
                                        })
                                    } else {
                                        searchValue = param.Default.toString()
                                    }
                                }
                                //没有查询值的时候不查询（非必填）
                                if (searchValue && searchValue.length > 0) {
                                    sqlWhere.push({
                                        "andOr": "and",
                                        "searchField": query.Name,
                                        operator,
                                        searchValue
                                    })
                                }
                            }
                        }
                    })
                    dataset.SqlWhere = sqlWhere
                })
            },
            //获取数据(初始化）
            async funGetData() {
                let that = this
                let sumShow = false
                that.Loading = true;
                for (let i = 0; i < that.ItReport.DataSet.length; i++) {
                    let dataset = that.ItReport.DataSet[i]
                    if (dataset.SqlSelect && dataset.SqlSelect.length > 0) {
                        let page = {"pageSize": '0', "pageIndex": '0'}
                        that.PageIndex = 0
                        if (that.ItReport.Type === 'DataGrid') {
                            that.PageIndex = 1
                            page = {"pageSize": this.PageSize, "pageIndex": this.PageIndex}
                        }
                        await this.funLoadDataSet(dataset, page).then((res) => {
                            dataset.Data = res
                            if (that.ItReport.Type === 'DataGrid') {
                                dataset.Data = res.data.rows
                                that.RowTotal = res.data.total
                                if (sumShow) that.RowTotal += 1
                                //计算页数
                                that.PageCount = Math.ceil(that.RowTotal / that.PageSize)
                                //加载头部和尾部字段数据
                                let d1 = null
                                if (dataset.Data.length > 0) d1 = dataset.Data[0]
                                that.funSetHFData(d1)
                            } else {
                                dataset.Data = res.data
                            }
                        })
                        //汇总求和数据
                        if (dataset.SumFields && dataset.SumFields.length > 0) {
                            page = {"pageSize": 0, "pageIndex": 0}
                            let sumdataset = JSON.parse(JSON.stringify(dataset))
                            sumdataset.SqlOrderBy = ""
                            sumdataset.SqlGroupBy = ""
                            sumdataset.SqlSelect = sumdataset.SumFields.join(",")
                            await this.funLoadDataSet(sumdataset, page).then((res) => {
                                this.$set(dataset, "SumData", res.data[0])
                            })
                        }
                        if (i === that.ItReport.DataSet.length - 1) {
                            setTimeout(function () {
                                that.Loading = false;
                            }, 30);
                        }
                    }//if end
                }//for end

            },
            //提取数据到集合
            funLoadDataSet(dataset, page) {
                return new Promise((resolve) => {
                    List(JSON.stringify(dataset.SqlWhere),
                        dataset.SqlOrderBy,
                        JSON.stringify(page),
                        dataset.Name,
                        dataset.SqlSelect,
                        dataset.SqlGroupBy
                    ).then((res) => {
                        resolve(res)
                    })
                });
            },
            funLoadPage(pageIndex, isPrint) {
                let that = this
                return new Promise((resolve) => {
                    let page = {"pageSize": this.PageSize, "pageIndex": pageIndex}
                    //列表数据
                    let dataset = this.ItReport.DataSet[0]
                    List(JSON.stringify(dataset.SqlWhere),
                        dataset.SqlOrderBy,
                        JSON.stringify(page),
                        dataset.Name,
                        dataset.SqlSelect,
                        dataset.SqlGroupBy
                    ).then((res) => {
                        dataset.Data = res.data.rows
                        if (isPrint) {
                            that.PageIndex = pageIndex
                            that.$nextTick(() => {
                                let page = document.getElementById("page-viewer")
                                resolve(page.outerHTML)
                            })
                        } else {
                            that.Loading = false
                        }
                    })
                });

            },
            evtPageCurrentChange(val) {
                //分页
                this.PageIndex = val
                this.Loading = true
                this.funLoadPage(this.PageIndex, false)
            },
            //加载头部和尾部字段数据&检索条件
            funSetHFData(data) {
                let that = this
                this.ItReport.NodeItem.filter(item => (item.Area === 'report-header' ||
                    item.Area === 'report-footer') && item.DataType === 'db').forEach(function (node) {
                    if (data) {
                        node.Text = data[node.Value]
                    } else {
                        node.Text = ""
                    }
                })
                this.ItReport.NodeItem.filter(item => (item.Area === 'report-header' ||
                    item.Area === 'report-footer') && item.DataType === 'query').forEach(function (node) {
                    let query = that.QueryData.QueryParam.filter(col => col.Id === node.Value)[0]
                    if (query) {
                        if (query.InputType === '1') {
                            node.Text = query.Default
                        } else if (query.FieldType.indexOf('date') >= 0) {
                            //日期类型
                            node.Text = query.SDate + " 至 " + query.EDate
                        } else {
                            node.Text = query.QueryDictText ? query.QueryDictText : ''
                        }
                    } else {
                        node.Text = ""
                    }
                })
            },
            //按钮提交
            evtQueryData() {
                this.$nextTick(() => {
                    if (this.QueryData.QueryParam.length === 0) return false
                    this.$refs.queryForm.validate(valid => {
                        if (!valid) return false
                        this.PageIndex = 1
                        //1生成检索条件，根据检索参数设置生成QueryParam
                        //2根据QueryParam生成sqlWhere
                        this.funGetSqlWhere()
                        //获取数据
                        this.funGetData()
                    })
                })
            },
            //打印
            async funPrint() {
                let that = this
                that.PrintPages = []
                //总页数
                let Pages = Math.ceil(that.RowTotal / that.PageSize)
                let arr
                //确定打印范围
                switch (that.PrintRadio) {
                    case 1: // 全部
                    case 2: //偶数页,奇数
                    case 3:
                        for (let i = 1; i <= Pages; i++) {
                            if (that.PrintRadio === 1) that.PrintPages.push(i)
                            if (that.PrintRadio === 2 && i % 2 === 0) that.PrintPages.push(i)
                            if (that.PrintRadio === 3 && i % 2 !== 0) that.PrintPages.push(i)
                        }
                        break
                    case 4: //当前页面
                        that.PrintPages.push(that.PageIndex)
                        break
                    case 5://页面范围
                        if (that.PrintPageNum.length === 0) {
                            this.$message.error("请输入打印页面范围1")
                            return false
                        }
                        arr = that.PrintPageNum.split(',')
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].indexOf('-') > 0) {
                                let arr2 = arr[i].split('-')
                                if (!this.funIsNum(arr2[0]) || parseInt(arr2[0]) <= 0
                                    || !this.funIsNum(arr2[1]) || parseInt(arr2[1]) <= 0) continue
                                for (let j = parseInt(arr2[0]); j <= parseInt(arr2[1]); j++) {
                                    if (that.PrintPages.indexOf(j) < 0) {
                                        that.PrintPages.push(j)
                                    }
                                }
                            } else {
                                if (this.funIsNum(arr[i]) && parseInt(arr[i]) > 0
                                    && parseInt(arr[i]) <= Pages && that.PrintPages.indexOf(parseInt(arr[i])) < 0) {
                                    that.PrintPages.push(parseInt(arr[i]))
                                }
                            }
                        }
                        if (that.PrintPages.length === 0) {
                            this.$message.error("请输入打印页面范围2")
                            return false
                        }
                        break
                }
                if (this.PrintPages.length === 0) return false
                this.Printing = true
                this.PrintPercentage = 0
                let iframe = document.getElementById("print-iframe")
                let doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                //doc.body.style = "margin: 0;padding: 0;overflow: hidden;"
                //生成打印内容
                for (let i = 0; i < that.PrintPages.length; i++) {
                    await this.funLoadPage(that.PrintPages[i], true).then((res) => {
                        doc.write(res);
                        this.PrintPercentage = Math.ceil(((i + 1) / that.PrintPages.length) * 100)
                        if (this.PrintPercentage > 100) this.PrintPercentage = 100
                    })
                }
                doc.close();
                //打印
                let w = iframe.contentWindow || iframe.contentDocument;
                setTimeout(function () {
                    w.focus();
                    doc.body.style = "margin: 0;padding: 0;overflow: hidden;"
                    try {
                        if (!w.document.execCommand('print', false, null)) {
                            w.print();
                        }
                    } catch (e) {
                        w.print();
                    }
                    w.close();
                }, 10);
                this.Printing = false
            },
            getQuerys() {
                //取得路由带过来的参数
                this.Loading = true
                let that = this
                if (this.$route.query.QueryParam) {
                    this.QueryParam = JSON.parse(decodeURIComponent(window.atob(this.$route.query.QueryParam)))
                }
                this.ReportId = this.$route.params && this.$route.params.id
                //判断权限
                this.isAuth=false
                this.$itsoftUI.getUserInfo().then(res => {
                    let auth = JSON.parse(res.auth)
                    let system = auth.filter(item => item.systemcode === 'cym')
                    if (system) {
                        let authorize = JSON.parse(system[0].authorize)
                        for (let i = 0; i < authorize.length; i++) {
                            if (authorize[i].select && authorize[i].select.indexOf("报表管理")>=0){
                                this.isAuth=true
                                this.funLoadReport()
                                break;
                            }
                            for (let j = 0; j < authorize[i].children.length; j++) {
                                let select = authorize[i].children[j].select
                                if (select && select.indexOf(this.ReportId)>=0) {
                                    this.isAuth=true
                                    this.funLoadReport()
                                    break;
                                }
                            }
                        }
                    }
                    if (!this.isAuth){
                        that.Loading = false
                        this.authMsg="访问的报表不存在或您无权访问"
                    }
                });

            },
            funLoadReport(){
                //初始化
                this.PageIndex = 1
                this.DataSetData = []
                this.RowTotal = 0
                this.SumData = []
                this.funGetReport(this.ReportId)
            },
            //验证规则
            funGetRules(query) {
                let rules = null
                if (query.Required) {
                    if (query.InputType === '1') {
                        rules = {required: true, message: '请输入' + query.ShowLabel, trigger: 'change'}
                    } else {
                        rules = {required: true, message: '请选择' + query.ShowLabel, trigger: 'change'}
                    }
                }
                return rules
            },
            //生成日期默认选择项目
            funSetDateParamDefault() {
                this.DateParamDefault.forEach(function (item) {
                    if (item.value !== "none") {
                        itrFn(item.value).then(data => {
                            item.label = item.label + " " + data.Label
                            item.value = data.Value
                        })
                    }
                })
            },
            //根据选择设置开始时间和结束时间
            funSetSEDate(val, query) {
                if (val !== 'none') {
                    query.SDate = val.split('T')[0]
                    query.EDate = val.split('T')[1]
                }
            },
            //选择数据发生改变
            funChangeSelect(val, query) {
                let label = ""
                let arr = []
                if (query.selectType === 'check') {
                    arr = val
                } else {
                    arr.push(val)
                }
                //单选+复选
                arr.forEach(function (value) {
                    let lb = query.DataList.filter(item => item.value === value)[0]
                    if (lb) {
                        if (label.length > 0) {
                            label += "+" + lb.label
                        } else {
                            label += lb.label
                        }
                    }
                })
                this.$set(query, "QueryDictText", label)
            },
            //加载数据
            evtSelectLoad(val, query) {
                if (query.DataList.length > 0) return false
                let fields = query.DictLValue + " value," + query.DictLabel + " label"
                query.loading = true
                ListDict(query.DictTable, fields).then((res) => {
                    query.DataList = res.data
                    query.loading = false;
                }).catch(() => {
                    query.loading = false;
                });
            },
            //判断是否数字
            funIsNum(value) {
                if (value.length === 0) return false
                if (parseInt(value).toString() === "NaN") return false
                return true
            },
            //导出
            funExport() {
                //导出字段
                let sqlSelect = ""
                let sqlHeader = ""
                let sqlOrderBy = ""
                let dataset = this.ItReport.DataSet[0]
                dataset.SelectFields.forEach(function (node) {
                    if (sqlSelect.length > 0) sqlSelect += ","
                    if (sqlHeader.length > 0) sqlHeader += ","
                    if (node.DataType === "ComputeField") {
                        //计算列
                        sqlSelect += node.Name
                        sqlHeader += node.FieldLabel
                    } else {
                        if (node.Sort) {
                            if (sqlOrderBy.length > 0) sqlOrderBy += ","
                            sqlOrderBy += node.Name
                        }
                        sqlSelect += node.Name
                        sqlHeader += node.Comment
                    }
                })
                exportCSV(JSON.stringify(dataset.SqlWhere),
                    dataset.Name,
                    sqlSelect,
                    sqlHeader,
                    this.ReportData.name,
                    dataset.SqlOrderBy,
                    dataset.SqlGroupBy).then(() => {
                    this.exportLoading = false
                }).catch(() => {
                    this.exportLoading = false
                });

            },
            //报表链接
            funReportLink(node, data) {
                //钻取数据
                let that = this
                this.Loading = true
                this.QueryParam = []
                node.QueryParam.forEach(function (item) {
                    let q = {FieldName: item.Id}
                    if (item.InputType === '1') {
                        q.FieldValue = item.Default
                    } else if (item.InputType === '2') {
                        //数据源
                        q.FieldValue = data[item.Default]
                    } else if (item.InputType === '3') {
                        //参数值
                        q.FieldValue = ""
                        let cq = that.QueryData.QueryParam.filter(col => col.Id === item.Default)[0]
                        if (cq) {
                            if (item.FieldType.indexOf('date') >= 0) {
                                q.FieldValue = cq.SDate + "T" + cq.EDate
                            } else {
                                q.FieldValue = cq.Default
                                if (cq.QueryDictText)
                                    q.QueryDictText = cq.QueryDictText
                            }
                        }
                    }
                    that.QueryParam.push(q)
                })
                // console.log(that.QueryParam)
                //console.log(that.QueryData.QueryParam)
                this.$router.push({path: '/itreport/viewer/' + node.ReportId})
            },
            //单位换算
            funMMtoPX(val) {
                return unitConver.mm2Px(unitConver.unit2Num(val))
            },
            funStyleTD(val) {
                return PageStyle.styleTD(val)
            },
            funGetTableData(table) {
                let dataset = this.ItReport.DataSet.filter(item => item.Id === table)[0]
                if (dataset) {
                    return dataset.Data
                } else {
                    return [{}]
                }
            },
            funChartSize(style) {
                return 'width:' + unitConver.mm2Px(unitConver.unit2Num(style.Width)) + 'px;height:' + unitConver.mm2Px(unitConver.unit2Num(style.Height)) + 'px;'
            }
        },
        created() {

            this.funSetDateParamDefault()
            this.getQuerys()
            //this.evtQueryData()
        }
        ,
        watch: {
            //监测路由变化，只要变化了就调用路由参数方法将数据存储本组件即可
            '$route':
                'getQuerys',
        }
        ,
        computed: {}

    }
</script>

<style lang="scss" scoped>
    .itr-report {
        height: 100%;
        position: relative;

        .empty-data {
            text-align: center;
            font-size: 14px;
            line-height: 50px;
            color: #999999;
        }


    }

    .toolbar-wap {
        height: 43px;
        background-color: #f7f7f7;
        overflow: hidden;
        color: #666666;
        border: 1px solid #ddd !important;

        .toolbar-title {
            float: left;
            padding: 0 10px;
            overflow: hidden;
            font-size: 13px;
            font-weight: bold;
            line-height: 42px;

            span {
                margin-left: 3px;
            }

            em {
                font-size: 12px;
                margin: 0 10px;
                color: #999999;
            }

            .xiaoxi {
                color: #F56C6C;
            }
        }

        .viewer-button {
            height: 38px;
            line-height: 38px;
            cursor: pointer;
            padding: 0 10px;
            position: absolute;
            z-index: 111;
            top: 5px;

            span {
                margin-left: 3px;
                font-size: 13px;
            }

            &.on {
                border-top: 1px solid #ddd !important;
                border-left: 1px solid #ddd !important;
                border-right: 1px solid #ddd !important;
                background-color: #ffffff;
                top: 6px;
            }

            &:hover:not(disabled) {
                background-color: #ffffff;
            }
        }

        .viewer-button.disabled {
            cursor: not-allowed;
            color: #bbbbbb !important;
        }
    }

    .main-warp {
        padding: 0;
        background-color: #f1f1f1;
        overflow: auto;
        position: relative;
        border: 1px solid #ddd !important;
        border-top: 0px solid #ddd !important;

        .page-viewer {
            margin: 16px auto;
            position: relative;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);
            cursor: default;
        }

        .page-preview {
            margin: 16px auto;
            position: relative;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);
            cursor: default;
        }
    }

    .right-aside {
        width: 270px !important;
        background-color: #ffffff;

        border-bottom: 1px solid #ddd !important;
        border-right: 1px solid #ddd !important;
        font-size: 12px;
        color: #606266;
        padding: 10px;
        z-index: 1;

        .query-warp {

            background-color: #ffffff;
            float: left;
            height: 100%;

            .title {
                float: left;
                width: 100%;
                height: 25px;
                line-height: 25px;
                font-size: 12px;
                font-weight: bold;

                i {
                    transform: rotate(180deg);
                    -webkit-transform: rotate(180deg);
                    margin-right: 5px;
                }
            }

            .input {
                float: left;
            }

            .select-prefix {
                cursor: pointer;
                font-size: 16px;
            }

            .msg {
                float: left;
                font-size: 13px;
                height: 40px;
                line-height: 40px;
                width: 100%;
                color: #666666
            }

            .item {
                float: left;
                height: 30px;
                line-height: 30px;
                width: 100%;
                font-size: 13px;
                padding: 0 0 0 10px;
            }
        }


    }

    .ReportLink {
        cursor: pointer;
        text-decoration: underline;

        &:hover {
            color: #409EFF;

        }
    }
</style>
