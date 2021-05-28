<!--iTR报表设计器2020版-->
<template>
    <el-container class="h100 pd0">
        <el-main class="pd0" v-loading="loading" onselectstart="return false;">
            <div class="itr-report">
                <el-container class="h100 pd0">
                    <el-header style="height:45px;" class="pd0 ">
                        <div class="toolbar-wap">
                            <div class="toolbar-title" v-if="ItReport.Type!=='0'">
                                <i class="el-icon-edit"></i>
                                <em>{{this.ReportData.type }}</em>
                                <span>{{this.ReportData.name}}</span>
                            </div>
                            <tool-button title="返回" icon="itr_exit" @buttonClick="toolButtonClick"
                                         style="font-size:20px; float: right;margin-right:1px; font-weight: bold;"/>
                            <div v-if="ItReport.Type!=='0'">
                                <tool-button title="复制报表" :disabled="ReportData.id==='0'" icon="itr_copy"
                                             @buttonClick="toolButtonClick"
                                             style="font-size:20px; float: right;margin-right:9px; margin-left:9px"/>
                                <tool-button title="保存" :disabled="ReportChangeCount<=2" icon="itr_save"
                                             @buttonClick="toolButtonClick"
                                             style="font-size:20px; float: right;margin-right:10px; margin-left:10px"/>
                                <tool-button title="预览报表" :disabled="ReportData.id==='0'" icon="itr_preview"
                                             @buttonClick="toolButtonClick"
                                             style="font-size:20px; float: right;margin-right:10px; margin-left:10px"/>
                                <tool-button title="报表代码" icon="json" @buttonClick="funViewReportJson"
                                             right-line
                                             style="font-size:20px; float: right;margin-right:2px; margin-left:10px"/>

                                <tool-button title="删除" icon="itr_del" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             :disabled="!multipleNodes.length"/>
                                <tool-button title="粘贴" icon="itr_paste" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             :disabled="!pasteNode.length"/>
                                <tool-button title="复制" icon="itr_copys" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             right-line
                                             :disabled="!multipleNodes.length"/>
                                <tool-button title="左对齐" icon="itr_align_left" @buttonClick="toolButtonClick"
                                             :disabled="!alignLeft"/>
                                <tool-button title="下对齐" icon="itr_align_bottom" @buttonClick="toolButtonClick"
                                             :disabled="!alignTop"/>
                                <tool-button title="右对齐" icon="itr_align_right" @buttonClick="toolButtonClick"
                                             :disabled="!alignLeft"/>
                                <tool-button title="上对齐" icon="itr_align_top" @buttonClick="toolButtonClick"
                                             right-line
                                             :disabled="!alignTop"/>
                                <tool-button title="等高" icon="itr_d_height" @buttonClick="toolButtonClick"
                                             :disabled="!(multipleNodes.length>1)"/>
                                <tool-button title="等宽" icon="itr_d_width" @buttonClick="toolButtonClick"
                                             right-line
                                             :disabled="!(multipleNodes.length>1)"/>
                                <tool-button title="合并列" icon="itr_colspan" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             v-if="ColSpan"/>
                                <tool-button title="取消合并列" icon="itr_colspan_del" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             v-if="ColSpanDel && multipleTDs.length===1"/>
                                <tool-button title="合并行" icon="itr_colspan" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             transform="90"
                                             v-if="RowSpan"/>
                                <tool-button title="取消合并行" icon="itr_colspan_del" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             transform="90"
                                             v-if="RowSpanDel && multipleTDs.length===1"/>
                                <tool-button title="插入列" icon="itr_table_insertcol" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             v-if="!ColSpanDel && multipleTDs.length===1"/>
                                <tool-button title="删除列" icon="itr_table_delcol" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             v-if="!ColSpanDel && multipleTDs.length===1"/>
                                <tool-button title="插入行" icon="itr_table_insertrow" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             v-if="multipleTDs.length===1"/>
                                <tool-button title="删除行" icon="itr_table_delrow" @buttonClick="toolButtonClick"
                                             style="font-size:16px;"
                                             v-if="!RowSpanDel && multipleTDs.length===1"/>


                            </div>
                            <div v-else style="line-height:45px; color:#666666;font-size:13px;margin-left:10px">
                                <i class="el-icon-edit"></i> 创建新报表，请选择报表风格
                            </div>
                        </div>
                    </el-header>
                    <el-main class="h100 pd0 ">
                        <el-container v-if="ItReport.Type==='0'" class="h100">
                            <div class="new-report">
                                <div class="warp">
                                    <div class="box">
                                        <div class="title">
                                            <svg-icon slot="prefix" icon-class="DataGrid"
                                                      style="font-size:22px; margin-top:5px;"/>
                                            <span>表格风格</span>
                                            <i>DataGrid</i>
                                        </div>
                                        <div class="comment">
                                            <p>1.单个据源，支持表头、表尾部</p>
                                            <p>2.实现查询汇总清单、各类单据</p>
                                            <p>3.支持自动分页打印、导出功能</p>
                                        </div>
                                        <transition name="el-zoom-in-center">
                                            <div class="button">
                                                <el-button @click="funCreatReport('DataGrid')" type="primary">创建报表
                                                </el-button>
                                            </div>
                                        </transition>
                                    </div>
                                    <div class="box">
                                        <div class="title">
                                            <svg-icon slot="prefix" icon-class="FreeForm"
                                                      style="font-size:22px; margin-top:5px;"/>
                                            <span>自由风格</span>
                                            <i>FreeForm</i>
                                        </div>
                                        <div class="comment">
                                            <p>1.支持多数据集合</p>
                                            <p>2.支持多个表格(table)和多种统计图表</p>
                                            <p>3.主要实现各类图表混合统计分析报表</p>
                                        </div>
                                        <transition name="el-zoom-in-center">
                                            <div class="button">
                                                <el-button @click="funCreatReport('FreeForm')" type="primary">创建报表
                                                </el-button>
                                            </div>
                                        </transition>

                                    </div>
                                </div>

                            </div>
                        </el-container>
                        <el-container v-if="ItReport.Type!=='0'"
                                      class="h100" id="page-main-warp" style="position: relative;">
                            <el-aside :class="leftNavClose?'left-aside  close':'left-aside'">
                                <!--工具-->
                                <div class="nav1">
                                    <tool-button title="文本"
                                                 @mousedown.native="funCreateText"
                                                 icon="itr_text"
                                                 tip-placement="right"
                                                 id="btn-itr-text"/>
                                    <tool-button title="图片" icon="itr_img"
                                                 id="btn-itr-image"
                                                 @mousedown.native="funCreateImg"
                                                 tip-placement="right"/>
                                    <tool-button title="线条" icon="itr_line"
                                                 @mousedown.native="funCreateLine"
                                                 tip-placement="right"/>
                                    <tool-button title="图形" icon="itr_shape"
                                                 @mousedown.native="funCreateShape"
                                                 tip-placement="right"/>
                                    <tool-button title="表格" icon="itr_table"
                                                 v-if="ItReport.Type==='FreeForm'"
                                                 @mousedown.native="funCreateTable"
                                                 tip-placement="right"/>
                                    <tool-button title="统计图" icon="itr_chart"
                                                 @mousedown.native="funCreateChart"
                                                 v-if="ItReport.Type==='FreeForm'"
                                                 tip-placement="right"/>
                                    <tool-button title="数据源"
                                                 @buttonClick="toolButtonClick"
                                                 :selected="btnDataSetSelected"
                                                 arrow-right
                                                 icon="itr_data"
                                                 id="btn-itr-data"
                                                 tip-placement="right"/>
                                    <tool-button title="元素目录"
                                                 style="position: absolute;left:0px; bottom: 0"
                                                 @buttonClick="toolButtonClick"
                                                 :selected="btnNodesSelected"
                                                 arrow-right
                                                 icon="itr_list"
                                                 tip-placement="right"/>
                                </div>
                                <!--数据源设置-->
                                <div class="nav2" v-if="btnDataSetSelected">
                                    <el-collapse v-model="activeName" accordion>
                                        <el-collapse-item name="1">
                                            <template slot="title">
                                                <span>数据集合</span>
                                                <div class="datasource-setting"
                                                     v-if="ItReport.Type==='FreeForm'
                                                     || (ItReport.Type==='DataGrid' && ItReport.DataSet.length===0)"
                                                     @click.stop
                                                     @click="evtEditDataSet('0')"
                                                     title="添加数据集合">
                                                    <svg-icon slot="prefix" icon-class="tianjia"/>
                                                </div>
                                            </template>
                                            <!--数据集合-->
                                            <div id="dataset-warp"
                                                 v-for="(dataset,index) in this.ItReport.DataSet"
                                                 :key="index">
                                                <div v-if="dataset.SelectFields.length>0 && ItReport.Type==='DataGrid'"
                                                     style="padding:10px 10px 0; color:#999999">
                                                    <i class="el-icon-info"></i>
                                                    {{dataset.SelectType==='1'? '单一模式':'分组模式'}}
                                                </div>
                                                <div class="data2">
                                                    <svg-icon slot="prefix" icon-class="itr_data"
                                                              style="font-size:14px;"/>
                                                    <span class="edit"
                                                          @click="evtEditDataSet(dataset.Id)">
                                                        {{dataset.Label.length===0?dataset.Comments:dataset.Label}}
                                                    </span>
                                                    <i class="el-icon-close i-del" title="删除"
                                                       @click="(val)=>funDelDataSet(index,dataset.Id)"></i>
                                                </div>
                                                <div v-if="ItReport.Type==='DataGrid'">
                                                    <div class="field-item"
                                                         v-for="(fd,index) in dataset.SelectFields"
                                                         @mousedown="(val)=>funCreateDb(val,fd.Name,fd.Comment,fd.DataType,dataset.Id,dataset.Label)"
                                                         :key="fd.Name">
                                                        <div class="line-warp">
                                                            <span class="line1"></span>
                                                            <span class="line2"
                                                                  v-if="index<dataset.SelectFields.length -1"></span>
                                                        </div>
                                                        <div class="comment">
                                                            <span>{{fd.Comment}}{{fd.FieldLabel?fd.FieldLabel:''}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="dataset.SelectFields.length===0"
                                                     style=" padding:10px 20px;color:#999999;">
                                                    <i class="el-icon-info"></i>无查询字段
                                                </div>
                                            </div>
                                            <div v-if="this.ItReport.DataSet.length===0"
                                                 style=" padding:20px 10px;color:#999999;">
                                                <i class="el-icon-info"></i>未设置数据集合
                                            </div>
                                        </el-collapse-item>
                                        <el-collapse-item name="2">
                                            <template slot="title">
                                                <span>检索参数</span>
                                                <div slot="reference" class="queryparam-setting"
                                                     @click.stop
                                                     @click="funAddQueryParam"
                                                     title="添加检索参数">
                                                    <svg-icon slot="prefix" icon-class="tianjia"/>
                                                </div>
                                            </template>
                                            <div v-if="ItReport.QueryParam.length===0"
                                                 style="line-height:30px;padding:10px;color:#999999">
                                                <p><i class="el-icon-info"></i>未添加检索参数</p>
                                            </div>
                                            <div class="data3" v-for=" (col,index) in ItReport.QueryParam"
                                                 @mousedown="(val)=>funCreateQuery(val,col.Id,col.ShowLabel,col.FieldType)"
                                                 :title="col.Required ? '必填参数':''"
                                                 :key="col.Id">
                                                <i class="el-icon-view" :style="col.Required ? 'color:#F56C6C;':''"></i>
                                                <span style="margin-left:5px;">{{col.ShowLabel}}</span>
                                                <i class="el-icon-close i-del" title="删除"
                                                   @click="(val)=>funDelQueryParam(index,col.Id)"></i>
                                                <i class="el-icon-setting i-setting" title="参数设置"
                                                   @click="(val)=>funSelectQueryParam(col.ShowLabel,col.Id,col.DictTable)"></i>
                                                <i class="el-icon-top i-up" title="向上移动"
                                                   v-if="index!=0"
                                                   @click="(val)=>funMoveQueryParam(index,'up')"></i>
                                                <i class="el-icon-bottom i-down" title="向下移动"
                                                   v-if="index!=ItReport.QueryParam.length-1"
                                                   @click="(val)=>funMoveQueryParam(index,'down')"></i>
                                            </div>
                                        </el-collapse-item>
                                        <el-collapse-item title="内置数据" name="3">
                                            <div class="data3" v-for=" col in inData"
                                                 @mousedown.self="funCreateFx"
                                                 :data-text="col.name"
                                                 :data-value="col.value"
                                                 :key="col.name">
                                                <svg-icon slot="prefix" icon-class="itr_fx"/>
                                                {{col.name}}
                                            </div>

                                        </el-collapse-item>
                                    </el-collapse>
                                </div>
                                <!--元素列表-->
                                <div class="nav2" v-if="btnNodesSelected">
                                    <div v-for=" area in ItReport.Page.Area"
                                         class="nav-node-list"
                                         :key="area.id">
                                        <div class="title">
                                            <svg-icon slot="prefix" icon-class="itr_list" style="font-size:16px;"/>
                                            <span>{{area.name}}</span>
                                        </div>
                                        <div class="warp">
                                            <div v-for="(node,index) in ItReport.NodeItem.filter(item=>item.Area===area.id)"
                                                 class="item"
                                                 :key="node.Id">
                                                <div class="line-warp">
                                                    <span class="line1"></span>
                                                    <span class="line2"
                                                          v-if="ItReport.NodeItem.filter(item=>item.Area===area.id).length>index+1"
                                                    ></span>
                                                </div>
                                                <div class="icon">
                                                    <svg-icon slot="prefix"
                                                              :icon-class="'itr_'+node.DataType"/>
                                                </div>
                                                <div class="comment" v-if="node.DataType==='line' ||
                                                        node.DataType==='shape' || node.DataType==='img'"
                                                     @click="(val)=>funAreaNodeSelect(val,node.Id)">
                                                    {{node.Id}}
                                                </div>
                                                <div class="comment" v-else
                                                     @click="(val)=>funAreaNodeSelect(val,node.Id)">
                                                    {{node.Text}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-aside>
                            <el-main class="main-warp h100 page-viewer"
                                     id="pagemain"
                                     @scroll.native="evtScroll"
                                     style="width:100%">
                                <!--标尺-->
                                <div class="ruler-x" id="ruler-x"
                                     @mouseover="(e)=>evtRulerMouseOver(e,'x')"
                                     @mouseout="(e)=>evtRulerMouseOut(e,'x')"
                                     @mousemove="(e)=>evtRulerMouseMove(e,'x')"
                                     @click="(e)=>evtAddLine(e,'x')"
                                     :style="styleRulerX">
                                    <span v-for="(item,index) in xScale" :key="index"
                                          :style="{left:index * 50 + 2 + 'px'}"
                                          class="n">{{ item.id }}</span>
                                    <div class="ruler-x-bg" id="ruler-x-bg" :style="styleRulerX">
                                    </div>
                                    <div id="ruler-x-base-line" class="line base">
                                        <span id="ruler-x-base-line-value" class="value"></span>
                                    </div>
                                    <div class="line" v-for="(line,index) in ItReport.RulerXLine"
                                         @mouseover.stop
                                         @mousemove.stop
                                         @click.stop
                                         @mousedown="(e)=>evtMoveLine(e,'x',index)"
                                         :style="'left:'+line"
                                         :key="line">
                                        <div class="action">
                                            <i class="el-icon-delete" @click="evtDelLine('x',index)"></i>
                                            <span>{{line}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="ruler-y" id="ruler-y"
                                     @mouseover="(e)=>evtRulerMouseOver(e,'y')"
                                     @mouseout="(e)=>evtRulerMouseOut(e,'y')"
                                     @mousemove="(e)=>evtRulerMouseMove(e,'y')"
                                     @click="(e)=>evtAddLine(e,'y')"
                                     :style="styleRulerY">
                                    <span v-for="(item,index) in yScale"
                                          :key="index" :style="{top:index * 50 + 2 + 'px'}" class="n">
                                        {{ item.id }}
                                    </span>
                                    <div class="ruler-y-bg" id="ruler-y-bg" :style="styleRulerY"></div>
                                    <div id="ruler-y-base-line" class="line base">
                                        <span id="ruler-y-base-line-value" class="value"></span>
                                    </div>
                                    <div class="line" v-for="(line,index) in ItReport.RulerYLine"
                                         @mouseover.stop
                                         @mousemove.stop
                                         @click.stop
                                         @mousedown="(e)=>evtMoveLine(e,'y',index)"
                                         :style="'top:'+line"
                                         :key="line">
                                        <div class="action">
                                            <i class="el-icon-delete" @click="evtDelLine('y',index)"></i>
                                            <span>{{line}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="ruler-empty" id="ruler-empty" title="回到原点" @click="evtScrollGo"></div>
                                <div class="page"
                                     :style="stylePageSize"
                                     @keyup="funKeyUp"
                                     @keydown="funKeyDown"
                                     @click.self="funSelectedPage"
                                     tabindex="1"
                                     id="report-page">
                                    <div id="report-page-warp"
                                         @click.self="funSelectedPage"
                                         :style="stylePageMargin">
                                        <!--区域-->
                                        <div v-for="area in this.ItReport.Page.Area"
                                             :key="area.id">
                                            <!--区域元素-->
                                            <div :id="area.id"
                                                 v-if="area.id!=='report-summary'||(area.id==='report-summary' && area.Show)"
                                                 :style="area.id==='report-summary'? ItReport.Page.Area.filter(item=>item.id==='report-detail')[0].style: area.style"
                                                 @click.self="funSelectedPage">
                                                <div v-for="node in ItReport.NodeItem.filter(item =>item.Area===area.id
                                                        && (item.NodeType==='div') )"
                                                     :key="node.Id"
                                                     :id="node.Id"
                                                     :node-type="node.NodeType"
                                                     :data-type="node.DataType"
                                                     :class="'ele '+ node.DataType"
                                                     tabindex="0"
                                                     @mousedown="evMouseDown"
                                                     :style="node.Style"
                                                     v-html="node.Text">
                                                </div>
                                                <table v-for="node in ItReport.NodeItem.filter(item =>item.Area===area.id && item.NodeType==='table' )"
                                                       :key="node.Id"
                                                       :id="node.Id"
                                                       :node-type="node.NodeType"
                                                       :data-type="node.DataType"
                                                       :class="'ele '+ node.DataType "
                                                       tabindex="0"
                                                       @mousedown="evMouseDown"
                                                       cellpadding="0"
                                                       cellspacing="1"
                                                       :style="node.Style+'table-layout: fixed;cellpadding:0;cellspacing:1pt;border:3pt solid #ccc'">
                                                    <colgroup>
                                                        <col v-for="(col,index) in node.Tables.ColGroup"
                                                             :key="index"
                                                             :style="'width:'+col+'mm'"/>
                                                    </colgroup>
                                                    <tbody>
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
                                                            {{TD.Text}}
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <!--区域分割带-->
                                            <div :class="area.id==='report-summary'?'split-area-sum':'split-area t'"
                                                 :id="area.id+'-split'"
                                                 v-if="area.id!=='report-summary'||(area.id==='report-summary' && area.Show)"
                                                 @mousedown="funResizeNode"
                                                 v-show="showAreaSp">
                                                <span> <i class="el-icon-top"></i>{{area.name}}</span>
                                                <em v-if="area.id!=='report-summary'">{{area.height}}</em>
                                            </div>
                                        </div>
                                    </div>
                                    <!--边距分割线-->
                                    <div class="resize page-margin t" id="page-margin-top"
                                         @mousedown="funResizeNode"
                                         :style="stylePageMarginTop"></div>
                                    <div class="resize page-margin l" id="page-margin-left"
                                         @mousedown="funResizeNode"
                                         :style="stylePageMarginLeft"></div>
                                    <div class="resize page-margin l" id="page-margin-right"
                                         @mousedown="funResizeNode"
                                         :style="stylePageMarginRight"></div>
                                    <div class="resize page-margin t" id="page-margin-bottom"
                                         @mousedown="funResizeNode"
                                         :style="stylePageMarginBottom"></div>
                                </div>
                            </el-main>
                            <el-aside class="right-aside">
                                <el-container class="h100 pd0">
                                    <el-header class="setting-header">
                                        <div class="title"
                                             :class="this.settingTab===0?'on':''"
                                             @click="(e)=>{this.settingTab=0}"
                                             v-html="this.setTitle">
                                        </div>
                                        <div class="title"
                                             v-if="SelectQueryParam"
                                             @click="(e)=> {this.settingTab=1}"
                                             :class="this.settingTab===1?'on':''">
                                            <i class="el-icon-view"></i>
                                            {{SelectQueryParam.ShowLabel}}
                                        </div>
                                    </el-header>
                                    <el-main class="h100 setting-warp" style="padding:0 15px 0 10px;font-size:12px;">
                                        <!--报表主体-->
                                        <div v-if="this.setTitle==='报表主体' && this.settingTab===0">
                                            <div class="title">基本信息</div>
                                            <div class="setting-item">
                                                <span class="label">报表名称</span>
                                                <div class="input">
                                                    <el-input size="mini" v-model="ReportData.name"></el-input>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">所属模块</span>
                                                <div class="input">
                                                    <el-select size="mini"
                                                               v-model="ReportData.module">
                                                        <el-option
                                                                class="report-setting-item"
                                                                v-for="item in Modules"
                                                                :key="item.label"
                                                                :label="item.label"
                                                                :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">编码</span>
                                                <div class="input">
                                                    <el-input ref="textValue" size="mini"
                                                              v-model="ReportData.serialnum"></el-input>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">备注</span>
                                                <div class="input">
                                                    <el-input ref="textValue" size="mini"
                                                              v-model="ReportData.remark"></el-input>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">报表类型</span>
                                                <div class="input">
                                                    <svg-icon slot="prefix" style="font-size:16px;"
                                                              :icon-class="ReportData.type"/>
                                                    <span style="color:#999999;margin-left:5px;">{{ReportData.type}}</span>
                                                </div>
                                            </div>
                                            <div class="title line">页边距</div>
                                            <div class="setting-item">
                                                <span class="label">上 T</span>
                                                <div class="input">
                                                    <el-input size="mini" v-model="ItReport.Page.TopMargin"></el-input>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">右 R</span>
                                                <div class="input">
                                                    <el-input size="mini"
                                                              v-model="ItReport.Page.RightMargin"></el-input>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">下 B</span>
                                                <div class="input">
                                                    <el-input size="mini"
                                                              v-model="ItReport.Page.BottomMargin"></el-input>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">左 L</span>
                                                <div class="input">
                                                    <el-input size="mini" v-model="ItReport.Page.LeftMargin"></el-input>
                                                </div>
                                            </div>
                                            <div class="title line">页面尺寸</div>
                                            <div class="setting-item">
                                                <span class="label">宽 W</span>
                                                <div class="input">
                                                    <el-input size="mini" v-model="ItReport.Page.Width"></el-input>
                                                </div>
                                            </div>
                                            <div class="setting-item" v-if="ReportData.type==='DataGrid'">
                                                <span class="label">高 H</span>
                                                <div class="input">
                                                    <el-input size="mini" v-model="ItReport.Page.Height"></el-input>
                                                </div>
                                            </div>
                                            <div class="title line">页面区域</div>
                                            <div class="setting-item">
                                                <span class="label lh42">分隔带</span>
                                                <div class="input">
                                                    <el-switch
                                                            v-model="showAreaSp"
                                                            active-text="显示"
                                                            inactive-text="隐藏">
                                                    </el-switch>
                                                </div>
                                            </div>
                                            <div class="setting-item" v-for="area in ItReport.Page.Area"
                                                 :key="'setting-'+area.id">
                                            <span class="label">
                                                {{area.name}}
                                            </span>
                                                <div class="input">
                                                    <el-input size="mini"
                                                              v-if="area.id!=='report-summary'"
                                                              v-model="area.height"></el-input>
                                                    <el-switch
                                                            v-if="area.id==='report-summary'"
                                                            v-model="area.Show"
                                                            active-text="打开"
                                                            inactive-text="关闭">
                                                    </el-switch>

                                                </div>
                                            </div>
                                            <div class="title line">其他信息</div>
                                            <div class="setting-item">
                                                <span class="label">作者</span>
                                                <div class="input">
                                                    {{ReportData.edituser}}
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">编辑时间</span>
                                                <div class="input">
                                                    {{ReportData.edittime}}
                                                </div>
                                            </div>

                                        </div>
                                        <!--报表元素-->
                                        <!--多选-->
                                        <div v-if="((multipleNodes.length>1  && MultipleText)|| multipleTDs.length>1) && this.settingTab===0">
                                            <div class="title ">文本样式</div>
                                            <div class="setting-item">
                                                <span class="label">字体</span>
                                                <div class="input">
                                                    <el-select size="mini" style="width:120px; float: left;"
                                                               @change="(val)=>funMultipleSetting('FontFamily',val)"
                                                               value="">
                                                        <el-option
                                                                class="report-setting-item"
                                                                v-for="item in FontFamilyList"
                                                                :key="item.label"
                                                                :label="item.label"
                                                                :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <el-color-picker value=""
                                                                     @change="(val)=>funMultipleSetting('Color',val)"
                                                                     style=" float: right; margin-top:5px;"
                                                                     size="mini"></el-color-picker>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">大小</span>
                                                <div class="input">
                                                    <el-select size="mini" value=""
                                                               @change="(val)=>funMultipleSetting('FontSize',val)">
                                                        <el-option
                                                                class="report-setting-item"
                                                                v-for="item in FontSizeList"
                                                                :key="item.label"
                                                                :label="item.label"
                                                                :value="item.label">
                                                        </el-option>
                                                    </el-select>

                                                </div>
                                            </div>
                                            <div class="setting-item" v-if="multipleNodes.length>1">
                                                <span class="label">格式</span>
                                                <div class="input">
                                                    <el-checkbox-group v-model="FontStyleSelect"
                                                                       @change="evtFontStyleChange"
                                                                       size="mini">
                                                        <el-checkbox-button v-for="style in FontStyle"
                                                                            :label="style" :key="style">
                                                            <el-tooltip :content="style" :open-delay=200
                                                                        :hide-after=3000>
                                                                <div>
                                                                    <svg-icon slot="prefix"
                                                                              :icon-class="style"/>
                                                                </div>
                                                            </el-tooltip>
                                                        </el-checkbox-button>
                                                    </el-checkbox-group>
                                                </div>
                                            </div>
                                            <div class="setting-item">
                                                <span class="label">对齐</span>
                                                <div class="input" style="height:30px;">
                                                    <el-radio-group v-model="TextAlignRadio"
                                                                    @change="(val)=>funMultipleSetting('TextAlign',val)"
                                                                    size="mini">
                                                        <el-radio-button label="left">
                                                            <div>
                                                                <svg-icon slot="prefix" icon-class="left"/>
                                                            </div>
                                                        </el-radio-button>
                                                        <el-radio-button label="center">
                                                            <div>
                                                                <svg-icon slot="prefix"
                                                                          icon-class="center"/>
                                                            </div>
                                                        </el-radio-button>
                                                        <el-radio-button label="right">
                                                            <div>
                                                                <svg-icon slot="prefix" icon-class="right"/>
                                                            </div>
                                                        </el-radio-button>
                                                    </el-radio-group>
                                                </div>
                                            </div>
                                            <div class="setting-item" style="height:45px;"
                                                 v-if="multipleNodes.length>1">
                                                <span class="label">背景颜色</span>
                                                <div class="input" style=" margin-top:5px;">
                                                    <el-color-picker
                                                            value=""
                                                            @change="(val)=>funMultipleSetting('BackgroundColor',val)"
                                                            size="mini"></el-color-picker>
                                                </div>
                                            </div>
                                            <!--边框-->
                                            <div v-if="multipleNodes.length>1">
                                                <div class="title line">边框</div>
                                                <div class="setting-item">
                                                    <span class="label">全部</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   @change="(val)=>funMultipleSetting('Border',val)"
                                                                   v-model="BoxValue">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in styleBox"
                                                                    :key="item.label"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">顶 T</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   @change="(val)=>funMultipleSetting('BorderTop',val)"
                                                                   value="请选择">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in styleBorder"
                                                                    :key="item.label"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                                <div>
                                                                    <span style="float: left;">{{item.label}}</span>
                                                                    <span class="border-line"
                                                                          :style="'border-top:'+item.value"></span>
                                                                </div>
                                                            </el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">右 R</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   @change="(val)=>funMultipleSetting('BorderRight',val)"
                                                                   value="请选择">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in styleBorder"
                                                                    :key="item.label"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                                <div>
                                                                    <span style="float: left;">{{item.label}}</span>
                                                                    <span class="border-line"
                                                                          :style="'border-top:'+item.value"></span>
                                                                </div>
                                                            </el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">底 B</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   @change="(val)=>funMultipleSetting('BorderBottom',val)"
                                                                   value="请选择">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in styleBorder"
                                                                    :key="item.label"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                                <div>
                                                                    <span style="float: left;">{{item.label}}</span>
                                                                    <span class="border-line"
                                                                          :style="'border-top:'+item.value"></span>
                                                                </div>
                                                            </el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">左 L</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   @change="(val)=>funMultipleSetting('BorderLeft',val)"
                                                                   value="请选择">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in styleBorder"
                                                                    :key="item.label"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                                <div>
                                                                    <span style="float: left;">{{item.label}}</span>
                                                                    <span class="border-line"
                                                                          :style="'border-top:'+item.value"></span>
                                                                </div>
                                                            </el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item" style="height:45px;">
                                                    <span class="label">颜色</span>
                                                    <div class="input">
                                                        <el-color-picker value=""
                                                                         @change="(val)=>funMultipleSetting('BorderColor',val)"
                                                                         style="margin-top:5px;"
                                                                         size="mini"></el-color-picker>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--单选-->
                                        <div v-if="multipleNodes.length===1 && this.settingTab===0">
                                            <div v-for="node in multipleNodes"
                                                 :key="'node-'+node.nodeId">
                                                <div v-for="col in ItReport.NodeItem.filter((item => (item.Id===node.nodeId )))"
                                                     :id="col.Id"
                                                     :key="col.Id">
                                                    <!--文本内容-->
                                                    <div class="setting-item" v-if="col.DataType==='text'">
                                                        <span class="label">文本内容</span>
                                                        <div class="input">
                                                            <el-input @change="evtTextChange" ref="textValue"
                                                                      size="mini"
                                                                      v-model="col.Text"></el-input>
                                                        </div>
                                                    </div>
                                                    <!--区域位置-->
                                                    <div class="setting-item">
                                                        <span class="label">区域位置</span>
                                                        <div class="input">
                                                            {{col.Area}}
                                                        </div>
                                                    </div>
                                                    <div class="setting-item">
                                                        <span class="label">名称</span>
                                                        <div class="input">
                                                            {{col.Id}}
                                                        </div>
                                                    </div>
                                                    <!--数据-->
                                                    <div class="setting-item" v-if="col.DataType==='fx'">
                                                        <span class="label">数据</span>
                                                        <div class="input">
                                                            {{col.Value}}
                                                        </div>
                                                    </div>
                                                    <!--检索参数-->
                                                    <div v-if="col.DataType==='query'">
                                                        <div class="setting-item">
                                                            <span class="label">标识码</span>
                                                            <div class="input">
                                                                {{col.Value}}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--选择图片-->
                                                    <div class="setting-item" style="height:50px;line-height:25px;"
                                                         v-if="col.DataType==='img'">
                                                        <span class="label">选择图片</span>
                                                        <div class="input">
                                                            <el-button type="primary" @click="evtSelectFile" size="mini"
                                                                       :loading="fileLoading">选择文件
                                                            </el-button>
                                                            <p style="line-height:0px;color:#999999">
                                                                文件格式jpg/png且小于2M</p>
                                                            <input type="file" id="SelectImg" name="image"
                                                                   ref="SelectImg"
                                                                   style="display:none"
                                                                   @change="(value)=> {evtSelectImg(value,col)}"
                                                                   accept="image/jpg,image/jpeg,image/png">
                                                        </div>

                                                    </div>
                                                    <!--文本样式-->
                                                    <div v-if="col.DataType==='text' || col.DataType==='fx'
                                                    || col.DataType==='db' || col.DataType==='query'  ">
                                                        <div class="title line">文本样式</div>
                                                        <div class="setting-item">
                                                            <span class="label">二维码</span>
                                                            <div class="input">
                                                                <el-checkbox v-model="col.BarCode">是否为二维码</el-checkbox>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">字体</span>
                                                            <div class="input">
                                                                <el-select size="mini" style="width:120px; float: left;"
                                                                           v-model="col.StyleValue.FontFamily">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in FontFamilyList"
                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                    </el-option>
                                                                </el-select>
                                                                <el-color-picker v-model="col.StyleValue.Color"
                                                                                 style=" float: right; margin-top:5px;"
                                                                                 size="mini"></el-color-picker>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">大小</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           v-model="col.StyleValue.FontSize">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in FontSizeList"
                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.label">
                                                                    </el-option>
                                                                </el-select>

                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">格式</span>
                                                            <div class="input">
                                                                <el-checkbox-group v-model="FontStyleSelect"
                                                                                   @change="evtFontStyleChange"
                                                                                   size="mini">
                                                                    <el-checkbox-button v-for="style in FontStyle"
                                                                                        :label="style" :key="style">
                                                                        <el-tooltip :content="style" :open-delay=200
                                                                                    :hide-after=3000>
                                                                            <div>
                                                                                <svg-icon slot="prefix"
                                                                                          :icon-class="style"/>
                                                                            </div>
                                                                        </el-tooltip>
                                                                    </el-checkbox-button>
                                                                </el-checkbox-group>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">对齐</span>
                                                            <div class="input" style="height:30px;">
                                                                <el-radio-group v-model="col.StyleValue.TextAlign"
                                                                                size="mini">
                                                                    <el-radio-button label="left">
                                                                        <div>
                                                                            <svg-icon slot="prefix" icon-class="left"/>
                                                                        </div>
                                                                    </el-radio-button>
                                                                    <el-radio-button label="center">
                                                                        <div>
                                                                            <svg-icon slot="prefix"
                                                                                      icon-class="center"/>
                                                                        </div>
                                                                    </el-radio-button>
                                                                    <el-radio-button label="right">
                                                                        <div>
                                                                            <svg-icon slot="prefix" icon-class="right"/>
                                                                        </div>
                                                                    </el-radio-button>
                                                                </el-radio-group>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">边距</span>
                                                            <div class="input">
                                                                <el-input size="mini"
                                                                          v-model="col.StyleValue.Padding"></el-input>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item" style="height:45px; ">
                                                            <span class="label">背景颜色</span>
                                                            <div class="input" style=" margin-top:5px;">
                                                                <el-color-picker
                                                                        v-model="col.StyleValue.BackgroundColor"
                                                                        size="mini"></el-color-picker>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--图形样式-->
                                                    <div v-if="col.DataType==='shape'">
                                                        <div class="title line">图形样式</div>
                                                        <div class="setting-item" style="height:45px;">
                                                            <span class="label">背景颜色</span>
                                                            <div class="input">
                                                                <el-color-picker
                                                                        v-model="col.StyleValue.BackgroundColor"
                                                                        size="mini"></el-color-picker>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">图形样式</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           v-model="col.StyleValue.BorderRadius">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in Shapes"
                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--统计图-->
                                                    <div v-if="col.DataType==='chart'">
                                                        <div class="setting-item">
                                                            <span class="label">标签内容</span>
                                                            <div class="input">
                                                                <el-input size="mini" v-model="col.Text"></el-input>
                                                            </div>
                                                        </div>
                                                        <div class="title line">数据绑定</div>
                                                        <div class="setting-item">
                                                            <span class="label">数据集合</span>
                                                            <div class="input">
                                                                <el-select size="mini" v-model="col.DataSetValue">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in ItReport.DataSet"
                                                                            :key="item.Id"
                                                                            :label="item.Label"
                                                                            :value="item.Id">
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                        <div class="title line">样式类型</div>
                                                        <div class="setting-item" style="text-align: center;">
                                                            <el-button type="primary"
                                                                       @click="(val)=>funChangeChartOption(val,col.Id,col.ChartOption)"
                                                                       size="mini">类型参数配置
                                                            </el-button>

                                                        </div>

                                                    </div>
                                                    <!--边框-->
                                                    <div v-if="col.DataType!=='line' && col.DataType!=='table' ">
                                                        <div class="title line">边框</div>
                                                        <div class="setting-item">
                                                            <span class="label">全部</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           @change="(val)=>funSelectBox(val,col.StyleValue)"
                                                                           v-model="BoxValue">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in styleBox"

                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">顶 T</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           v-model="col.StyleValue.BorderTop">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in styleBorder"
                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                        <div>
                                                                            <span style="float: left;">{{item.label}}</span>
                                                                            <span class="border-line"
                                                                                  :style="'border-top:'+item.value"></span>
                                                                        </div>
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">右 R</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           v-model="col.StyleValue.BorderRight">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in styleBorder"
                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                        <div>
                                                                            <span style="float: left;">{{item.label}}</span>
                                                                            <span class="border-line"
                                                                                  :style="'border-top:'+item.value"></span>
                                                                        </div>
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">底 B</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           v-model="col.StyleValue.BorderBottom">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in styleBorder"
                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                        <div>
                                                                            <span style="float: left;">{{item.label}}</span>
                                                                            <span class="border-line"
                                                                                  :style="'border-top:'+item.value"></span>
                                                                        </div>
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">左 L</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           v-model="col.StyleValue.BorderLeft">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in styleBorder"
                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                        <div>
                                                                            <span style="float: left;">{{item.label}}</span>
                                                                            <span class="border-line"
                                                                                  :style="'border-top:'+item.value"></span>
                                                                        </div>
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item" style="height:45px;">
                                                            <span class="label">颜色</span>
                                                            <div class="input">
                                                                <el-color-picker v-model="col.StyleValue.BorderColor"
                                                                                 style="margin-top:5px;"
                                                                                 size="mini"></el-color-picker>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--线条-->
                                                    <div v-if="col.DataType==='line'">
                                                        <div class="title line">线条样式</div>
                                                        <div class="setting-item">
                                                            <span class="label">线条</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           v-model="col.StyleValue.BorderTop">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in styleBorder"
                                                                            :key="item.label"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                        <div>
                                                                            <span style="float: left;">{{item.label}}</span>
                                                                            <span class="border-line"
                                                                                  :style="'border-top:'+item.value"></span>
                                                                        </div>
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item" style="height:45px;">
                                                            <span class="label">颜色</span>
                                                            <div class="input">
                                                                <el-color-picker v-model="col.StyleValue.BorderColor"
                                                                                 style="margin-top:5px;"
                                                                                 size="mini"></el-color-picker>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item" style="height:45px;">
                                                            <span class="label">旋转</span>
                                                            <div class="input">
                                                                <el-input ref="textValue" size="mini"
                                                                          v-model="col.StyleValue.Transform"></el-input>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label lh42">类型</span>
                                                            <div class="input">
                                                                <el-switch
                                                                        v-model="col.RowSplit"
                                                                        active-text="行分割线"
                                                                        inactive-text="普通">
                                                                </el-switch>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--尺寸位置-->
                                                    <div>
                                                        <div class="title line">尺寸位置</div>
                                                        <div class="setting-item">
                                                            <span class="label">层叠顺序</span>
                                                            <div class="input">
                                                                <el-input-number size="mini"
                                                                                 v-model="col.StyleValue.zIndex"></el-input-number>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item" v-if="col.DataType!=='table'">
                                                            <span class="label">宽 W</span>
                                                            <div class="input">
                                                                <el-input size="mini"
                                                                          v-model="col.StyleValue.Width"></el-input>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item"
                                                             v-if="col.DataType!=='line' && col.DataType!=='table'">
                                                            <span class="label">高 H</span>
                                                            <div class="input">
                                                                <el-input size="mini"
                                                                          v-model="col.StyleValue.Height"></el-input>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">顶 T</span>
                                                            <div class="input">
                                                                <el-input size="mini"
                                                                          v-model="col.StyleValue.Top"></el-input>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">左 L</span>
                                                            <div class="input">
                                                                <el-input size="mini"
                                                                          v-model="col.StyleValue.Left"></el-input>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--数据钻取-->
                                                    <div v-if="col.DataType==='db' && col.Area==='report-detail' ">
                                                        <div class="title line">数据钻取</div>
                                                        <div class="setting-item">
                                                            <span class="label">目标报表</span>
                                                            <div class="input">
                                                                <el-select size="mini"
                                                                           clearable
                                                                           @change="(val)=>funGetReportQueryParam(val,col)"
                                                                           v-model="col.ReportId">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in ReportList"
                                                                            :key="item.value"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                        <div class="setting-item-list"
                                                             v-if="col.ReportId && col.ReportId.length>0">
                                                            <div v-for=" query in col.QueryParam"
                                                                 :key="query.FieldValue">
                                                                <div class="list"
                                                                     style="background-color:#f1f1f1;text-align: center; font-weight: bold; color:#666;">
                                                                    {{query.ShowLabel}}
                                                                </div>
                                                                <div style="background-color: #ffffff;">
                                                                    <div class="item">
                                                                        <el-radio-group v-model="query.InputType"
                                                                                        @change="(val)=>{query.Default=''}"
                                                                                        size="mini">
                                                                            <el-radio-button label="1">固定值
                                                                            </el-radio-button>
                                                                            <el-radio-button label="2">数据源
                                                                            </el-radio-button>
                                                                            <el-radio-button label="3">参数值
                                                                            </el-radio-button>
                                                                        </el-radio-group>
                                                                    </div>
                                                                    <div class="item" v-if="query.InputType==='1'">
                                                                        <el-input size="mini" placeholder="请输入内容"
                                                                                  style=" width: 96%;"
                                                                                  v-model="query.Default"></el-input>
                                                                    </div>
                                                                    <div class="item" v-if="query.InputType==='2'">
                                                                        <el-select size="mini"
                                                                                   style=" width: 96%;"
                                                                                   placeholder="请选择数据源字段"
                                                                                   v-model="query.Default">
                                                                            <el-option
                                                                                    class="report-setting-item"
                                                                                    v-for="item in funGetDataSetFields(col)"
                                                                                    :key="item.Name"
                                                                                    :label="item.Comment"
                                                                                    :value="item.Name">
                                                                            </el-option>
                                                                        </el-select>
                                                                    </div>
                                                                    <div class="item" v-if="query.InputType==='3'">
                                                                        <el-select size="mini"
                                                                                   style=" width: 96%;"
                                                                                   placeholder="请选择检索参数"
                                                                                   v-model="query.Default">
                                                                            <el-option
                                                                                    class="report-setting-item"
                                                                                    v-for="item in ItReport.QueryParam"
                                                                                    :key="item.Id"
                                                                                    :label="item.ShowLabel"
                                                                                    :value="item.Id">
                                                                            </el-option>
                                                                        </el-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span></span>
                                                        </div>
                                                    </div>
                                                    <!--数据源-->
                                                    <div v-if="col.DataType==='db'">
                                                        <div class="title line">数据源</div>
                                                        <div class="setting-item">
                                                            <span class="label">描述</span>
                                                            <div class="input">
                                                                {{col.DataSetName}}
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">字段名称</span>
                                                            <div class="input">
                                                                {{col.Value}}
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">字段描述</span>
                                                            <div class="input">
                                                                {{col.Text}}
                                                            </div>
                                                        </div>
                                                        <div class="setting-item">
                                                            <span class="label">数据类型</span>
                                                            <div class="input">
                                                                {{col.FieldType}}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--数据绑定-->
                                                    <div v-if="col.DataType==='table' ">
                                                        <div class="title line">边框</div>
                                                        <div class="setting-item" style="height:45px;">
                                                            <span class="label">颜色</span>
                                                            <div class="input">
                                                                <el-color-picker
                                                                        v-model="col.StyleValue.BackgroundColor"
                                                                        style="margin-top:5px;"
                                                                        size="mini"></el-color-picker>
                                                            </div>
                                                        </div>
                                                        <div class="title line">数据绑定</div>
                                                        <div class="setting-item">
                                                            <span class="label">数据集合</span>
                                                            <div class="input">
                                                                <el-select size="mini" v-model="col.DataSetValue">
                                                                    <el-option
                                                                            class="report-setting-item"
                                                                            v-for="item in ItReport.DataSet"
                                                                            :key="item.Id"
                                                                            :label="item.Label"
                                                                            :value="item.Id">
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--colFor-->
                                            </div>
                                            <!--itemFor-->
                                        </div>
                                        <!--检索参数-->
                                        <div v-if="SelectQueryParam && this.settingTab===1">
                                            <div v-for="query in ItReport.QueryParam.filter(item=> item.Id===SelectQueryParam.id)"
                                                 :key="query.FieldValue">
                                                <div class="title ">参数选项设置</div>
                                                <div class="setting-item">
                                                    <span class="label">显示标签</span>
                                                    <div class="input">
                                                        <el-input size="mini" v-model="query.ShowLabel"></el-input>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">数据类型</span>
                                                    <div class="input">
                                                        <el-select size="mini" v-model="query.FieldType"
                                                                   @change="(val)=>funFieldTypeChange(val,query)">
                                                            <el-option label="字符类型" value="char"></el-option>
                                                            <el-option label="日期类型" value="date"></el-option>
                                                            <el-option label="数字类型" value="number"></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label lh42">是否必选</span>
                                                    <div class="input">
                                                        <el-switch
                                                                size="mini"
                                                                v-model="query.Required"
                                                                active-text="必选"
                                                                inactive-text="可选">
                                                        </el-switch>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">输入/选择</span>
                                                    <div class="input">
                                                        <el-radio-group v-model="query.InputType" size="mini"
                                                                        :disabled="query.FieldType==='date' ||
                                                                                     query.FieldType==='number'">
                                                            <el-radio-button label="1">手动输入</el-radio-button>
                                                            <el-radio-button label="2">选择方式</el-radio-button>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                                <div class="setting-item"
                                                     v-if="query.InputType==='2' && query.FieldType!=='date'">
                                                    <span class="label">数据来源</span>
                                                    <div class="input">
                                                        <el-radio-group v-model="query.DataSource" size="mini">
                                                            <el-radio-button label="1">手动添加</el-radio-button>
                                                            <el-radio-button label="2">数据字典</el-radio-button>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                                <!--手动添加数据-->
                                                <div v-if="query.DataSource==='1' && query.InputType==='2'"
                                                     class="datalistwarp">
                                                    <el-table ref="dataListTable"
                                                              :data="query.DataList"
                                                              tooltip-effect="light"
                                                              empty-text="无数据"
                                                              class="table-mini"
                                                              :cell-class-name="cellClassName"
                                                              border
                                                              style="width: 100%;">
                                                        <el-table-column
                                                                prop="label"
                                                                label="标签"
                                                                align="center"
                                                                :resizable=false
                                                                width="85">
                                                            <template slot-scope="scope">
                                                                <el-input v-model="scope.row.label" size="mini"/>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column
                                                                prop="label"
                                                                label="数据"
                                                                align="center"
                                                                :resizable=false
                                                                width="85">
                                                            <template slot-scope="scope">
                                                                <el-input v-model="scope.row.value" size="mini"/>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column width="40" :resizable=false>
                                                            <template slot="header" slot-scope="scope">
                                                                <el-tooltip content="添加数据" placement="top"
                                                                            :open-delay=300>
                                                                    <i class="el-icon-plus cell-add-btn"
                                                                       @click="evtAddRow(query)"></i>
                                                                </el-tooltip>
                                                            </template>
                                                            <template slot-scope="scope">
                                                                <div class="cell-delete-btn"
                                                                     @click="evtDeleteRow(query.DataList,scope.$index)">
                                                                    <svg-icon slot="prefix" icon-class="delete"/>
                                                                </div>
                                                            </template>
                                                        </el-table-column>
                                                    </el-table>
                                                </div>
                                                <!--数据字段-->
                                                <div v-if="query.DataSource==='2' && query.InputType==='2'">
                                                    <div class="setting-item">
                                                        <span class="label">数据源</span>
                                                        <div class="input">
                                                            <el-select size="mini"
                                                                       filterable
                                                                       @change="funLoadDictField"
                                                                       v-model="query.DictTable">
                                                                <el-option
                                                                        class="report-setting-item"
                                                                        v-for="item in DictTableList"
                                                                        :key="item.name"
                                                                        :label="item.comments"
                                                                        :value="item.name">
                                                                </el-option>
                                                            </el-select>
                                                        </div>
                                                    </div>
                                                    <div class="setting-item">
                                                        <span class="label">数据字段</span>
                                                        <div class="input">
                                                            <el-select size="mini"
                                                                       filterable
                                                                       v-model="query.DictLValue">
                                                                <el-option
                                                                        class="report-setting-item"
                                                                        v-for="item in DictFieldList"
                                                                        :key="item.name"
                                                                        :label="item.comment"
                                                                        :value="item.name">
                                                                </el-option>
                                                            </el-select>
                                                        </div>
                                                    </div>
                                                    <div class="setting-item">
                                                        <span class="label">标签字段</span>
                                                        <div class="input">
                                                            <el-select size="mini"
                                                                       filterable
                                                                       v-model="query.DictLabel">
                                                                <el-option
                                                                        class="report-setting-item"
                                                                        v-for="item in DictFieldList"
                                                                        :key="item.name"
                                                                        :label="item.comment"
                                                                        :value="item.name">
                                                                </el-option>
                                                            </el-select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="setting-item" v-if="query.FieldType.indexOf('date')>=0">
                                                    <span class="label">默认值</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   v-model="query.Default">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in DateParamDefault"
                                                                    :key="item.label"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item" v-if="query.FieldType.indexOf('date')>=0">
                                                    <span class="label">日期格式</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   v-model="query.DateFormat">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    label="日期格式"
                                                                    value="date">
                                                            </el-option>
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    label="日期时间格式"
                                                                    value="datetime">
                                                            </el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item"
                                                     v-if="query.InputType==='2' && query.FieldType.indexOf('date')<0 ">
                                                    <span class="label">单/复选</span>
                                                    <div class="input">
                                                        <el-radio-group v-model="query.selectType" size="mini">
                                                            <el-radio-button label="radio">单&nbsp;&nbsp;&nbsp;&nbsp;选
                                                            </el-radio-button>
                                                            <el-radio-button label="check">复&nbsp;&nbsp;&nbsp;&nbsp;选
                                                            </el-radio-button>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                                <div class="title line">其他信息</div>
                                                <div class="setting-item h30">
                                                    <span class="label">标识码</span>
                                                    <div class="input">
                                                        {{query.Id}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--表格单元格-->
                                        <div v-if="this.setTitle==='表格单元格' && this.settingTab===0 &&
                                                multipleTDs.length===1">
                                            <div v-for="table in ItReport.NodeItem.filter((item => (item.Id===multipleTDs[0].tableid )))"
                                                 :key="'table-'+table.Id">
                                                <div class="title">基本信息</div>
                                                <div class="setting-item">
                                                    <span class="label">所属表格</span>
                                                    <div class="input">
                                                        {{table.Id}}
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">位置</span>
                                                    <div class="input">
                                                        {{'第'+parseInt(parseInt(multipleTDs[0].index.split('-')[0])+1)+'行,第'+parseInt(parseInt(multipleTDs[0].index.split('-')[1])+1)+'列'}}
                                                    </div>
                                                </div>
                                                <div class="title line">尺寸大小</div>
                                                <div class="setting-item">
                                                    <span class="label">行高</span>
                                                    <div class="input">
                                                        <el-input-number size="mini"
                                                                         v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Height"></el-input-number>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">列宽</span>
                                                    <div class="input">
                                                        <el-input-number size="mini"
                                                                         v-model="table.Tables.ColGroup[multipleTDs[0].index.split('-')[1]]"></el-input-number>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">边距</span>
                                                    <div class="input">
                                                        <el-input-number size="mini"
                                                                         v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Padding"></el-input-number>
                                                    </div>
                                                </div>
                                                <div class="title line">数据绑定</div>
                                                <div class="setting-item">
                                                    <span class="label">绑定</span>
                                                    <div class="input">
                                                        <el-radio-group
                                                                v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Data"
                                                                size="mini">
                                                            <el-radio-button label="text">静态文本</el-radio-button>
                                                            <el-radio-button label="db">动态数据</el-radio-button>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                                <div class="setting-item"
                                                     v-if="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Data==='text'">
                                                    <span class="label">文本内容</span>
                                                    <div class="input">
                                                        <el-input size="mini"
                                                                  v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Text"></el-input>
                                                    </div>
                                                </div>
                                                <div class="setting-item"
                                                     v-if="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Data==='db'">
                                                    <span class="label">字段</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   clearable
                                                                   no-data-text="未绑定数据集合"
                                                                   @change="(val)=>funTableFieldChange(val,table.Id,table.DataSetValue,multipleTDs[0].index)"
                                                                   v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Value">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in funSelectFieldList(table.DataSetValue)"
                                                                    :key="item.Name"
                                                                    :label="item.Comment"
                                                                    :value="item.DataType==='ComputeField'?item.Comment:item.Name">
                                                            </el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">类型</span>
                                                    <div class="input">
                                                        <el-radio-group
                                                                v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Type"
                                                                size="mini">
                                                            <el-radio-button label="text">文本</el-radio-button>
                                                            <el-radio-button label="img">图片</el-radio-button>
                                                            <el-radio-button label="barcode">二维码</el-radio-button>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                                <div class="setting-item"
                                                     v-if="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Type==='barcode'">
                                                    <span class="label">尺寸</span>
                                                    <div class="input">
                                                        <el-input-number size="mini"
                                                                         v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].CodeSize"></el-input-number>
                                                    </div>
                                                </div>
                                                <div class="setting-item"
                                                     v-if="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Type==='img'">
                                                    <span class="label">高</span>
                                                    <div class="input">
                                                        <el-input size="mini"
                                                                  v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].ImgHeight"></el-input>
                                                    </div>
                                                </div>
                                                <div class="setting-item"
                                                     v-if="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Type==='img'">
                                                    <span class="label">宽</span>
                                                    <div class="input">
                                                        <el-input size="mini"
                                                                  v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].ImgWidth"></el-input>
                                                    </div>
                                                </div>
                                                <div class="title line">文本样式</div>
                                                <div class="setting-item">
                                                    <span class="label">字体</span>
                                                    <div class="input">
                                                        <el-select size="mini" style="width:120px; float: left;"
                                                                   v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].FontFamily">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in FontFamilyList"
                                                                    :key="item.label"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                        <el-color-picker
                                                                v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].Color"
                                                                style=" float: right; margin-top:5px;"
                                                                size="mini"></el-color-picker>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">大小</span>
                                                    <div class="input">
                                                        <el-select size="mini"
                                                                   v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].FontSize">
                                                            <el-option
                                                                    class="report-setting-item"
                                                                    v-for="item in FontSizeList"
                                                                    :key="item.label"
                                                                    :label="item.label"
                                                                    :value="item.label">
                                                            </el-option>
                                                        </el-select>

                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">对齐</span>
                                                    <div class="input" style="height:30px;">
                                                        <el-radio-group
                                                                v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].TextAlign"
                                                                size="mini">
                                                            <el-radio-button label="left">
                                                                <div>
                                                                    <svg-icon slot="prefix" icon-class="left"/>
                                                                </div>
                                                            </el-radio-button>
                                                            <el-radio-button label="center">
                                                                <div>
                                                                    <svg-icon slot="prefix"
                                                                              icon-class="center"/>
                                                                </div>
                                                            </el-radio-button>
                                                            <el-radio-button label="right">
                                                                <div>
                                                                    <svg-icon slot="prefix" icon-class="right"/>
                                                                </div>
                                                            </el-radio-button>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                                <div class="setting-item">
                                                    <span class="label">加粗</span>
                                                    <div class="input">
                                                        <el-radio-group
                                                                v-model="table.Tables.RowCol[multipleTDs[0].index.split('-')[0]][multipleTDs[0].index.split('-')[1]].FontWeight"
                                                                size="mini">
                                                            <el-radio-button label="normal">正常</el-radio-button>
                                                            <el-radio-button label="bold">加粗</el-radio-button>
                                                            <el-radio-button label="bolder">更粗</el-radio-button>
                                                        </el-radio-group>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </el-main>
                                </el-container>
                            </el-aside>
                        </el-container>
                    </el-main>
                </el-container>
                <div id="resizable" style="display: none">
                    <i class="resizable div  l " data-type="left" id="resizable-left"></i>
                    <i class=" resizable div  th r" data-type="right" id="resizable-right"></i>
                    <i class=" resizable div  t" data-type="top" id="resizable-top"></i>
                    <i class=" resizable div  b" data-type="bottom" id="resizable-bottom"></i>
                    <i class="resizable div   tl " data-type="top-left" id="resizable-top-left"></i>
                    <i class=" resizable div  tr " data-type="top-right" id="resizable-top-right"></i>
                    <i class=" resizable div  bl" data-type="bottom-left" id="resizable-bottom-left"></i>
                    <i class=" resizable div  br" data-type="bottom-right" id="resizable-bottom-right"></i>
                    <i class=" resizable line rt" data-type="rightTop" id="resizable-line-right"></i>
                    <i class=" resizable line lt" data-type="leftTop" id="resizable-line-left"></i>
                    <i class=" resizable line ct" data-type="leftTop" id="resizable-line-center"></i>
                </div>
            </div>
        </el-main>
        <el-dialog
                title="数据源设置"
                :visible.sync="dialogDataSource"
                :close-on-click-modal=false
                destroy-on-close
                lock-scroll
                top="15px"
                width="600px">
            <div class="datasource-warp">
                <el-container class="h100 pd0" v-loading="FieldLoading">
                    <el-header style="height:45px;" class="pd0 ">
                        <div class="toolbar-wap">
                            <div style="float:left; line-height:45px; padding: 0 10px;">
                                <el-radio-group v-model="DataSource.SelectType" size="mini"
                                                :disabled="DataSource.SelectFields.length>0">
                                    <el-radio-button label="1">单一模式</el-radio-button>
                                    <el-radio-button label="2">分组模式</el-radio-button>
                                </el-radio-group>
                            </div>
                            <tool-button title="求和" icon="sum"
                                         left-line
                                         :disabled=" !(DataSource.SelectType==='2')"
                                         @buttonClick="toolButtonClick"
                                         style="font-size:16px; "/>
                            <tool-button title="平均值" icon="avg"
                                         :disabled=" !(DataSource.SelectType==='2')"
                                         @buttonClick="toolButtonClick"
                                         style="font-size:20px;"/>
                            <tool-button title="计数" icon="count"
                                         :disabled=" !(DataSource.SelectType==='2')"
                                         @buttonClick="toolButtonClick"
                                         style="font-size:22px; "/>
                            <tool-button title="最大值" icon="max"
                                         :disabled=" !(DataSource.SelectType==='2')"
                                         @buttonClick="toolButtonClick"
                                         style="font-size:22px; "/>
                            <tool-button title="最小值" icon="min"
                                         :disabled=" !(DataSource.SelectType==='2')"
                                         @buttonClick="toolButtonClick"
                                         style="font-size:22px;"/>
                            <tool-button text="保存" icon="save"
                                         left-line
                                         @buttonClick="funSaveDateSet"/>
                            <tool-button text="取消" icon="exit"
                                         style="float: right;"
                                         left-line
                                         @buttonClick="(val)=>{this.dialogDataSource = false}"/>
                        </div>
                    </el-header>
                    <el-main class="pd0" style="overflow:hidden;">
                        <div class="left">
                            <div class="title" style=" line-height:25px">
                                <el-select v-if="DataSource.SelectFields.length===0
                                            && DataSource.QueryFields.length===0"
                                           v-model="DataSource.Name"
                                           style="width: 286px; margin-top:3px;"
                                           filterable
                                           placeholder="请选择数据源"
                                           @visible-change="evtGetDataSet"
                                           @change="(val)=>funSelectDataSource(val,DataSource.Id)"
                                           size="mini">
                                    <el-option
                                            v-for="(item,index) in DataSet"
                                            class="report-setting-item"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value"/>
                                </el-select>
                                <div v-else>
                                    <el-input size="mini" style="width: 286px; margin-top:4px;font-weight: normal;"
                                              v-model="DataSource.Label">
                                        <template slot="prepend">数据集合名称</template>
                                    </el-input>
                                </div>
                            </div>
                            <div class="warp">
                                <div v-if="DataSource.SelectFields.length>0
                                            || DataSource.QueryFields.length>0"
                                     class="comments-msg">
                                    数据源:{{DataSource.Comments}}
                                </div>
                                <div v-for=" field in this.DataField"
                                     class="item"
                                     :key="field.name">
                                    <el-checkbox class="check" v-model="field.check"
                                                 @change="(val)=>funFieldCheck(val,field.name)"
                                                 v-if="DataSource.SelectType==='2' && field.type==='decimal' "></el-checkbox>
                                    <span class="comment">{{field.comment.length===0?field.name:field.comment}}</span>
                                    <span class="name">{{field.name}}</span>
                                    <span class="type">{{field.type}}</span>
                                    <i class="el-icon-view i-query" title="检索字段"
                                       v-if="field.Queryed==='0' || !field.Queryed"
                                       @click="funAddQueryField(field)"></i>
                                    <i class="el-icon-right i-add" title="添加字段"
                                       v-if="field.Selected==='0' || !field.Selected"
                                       @click="funAddDataField(field)"></i>
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <div class="title" style="text-align: left">
                                <span style="margin-left:10px;">查询&排序字段</span>
                                <span style="font-size:12px; float: right; margin-right:10px;  font-weight: normal; color:#999;">
                                    <i class="el-icon-info"></i>勾选是否排序,移动改变顺序</span>
                            </div>
                            <div class="warp" style="height:270px;">
                                <div v-for=" (field,index) in DataSource.SelectFields"
                                     class="item"
                                     :key="field.Name">
                                    <el-checkbox class="check" v-model="field.Sort" title="选择是否排序"
                                                 v-if="field.DataType!=='ComputeField'"></el-checkbox>
                                    <span class="comment">{{field.Comment}}</span>
                                    <span class="name">{{field.Name}}</span>
                                    <span class="type">{{field.DataType}}</span>
                                    <i class="el-icon-top i-up" title="向上移动"
                                       v-if="index!==0"
                                       @click="(val)=>funMoveField(index,'up')"></i>
                                    <i class="el-icon-bottom i-down" title="向下移动"
                                       v-if="index!==DataSource.SelectFields.length -1"
                                       @click="(val)=>funMoveField(index,'down')"></i>
                                    <i class="el-icon-close i-del"
                                       @click="funDelDataField(field,index,DataSource.Id)"></i>
                                </div>
                            </div>
                            <div class="title" style="text-align: left; border-top: 1px solid #ddd;">
                                <i class="el-icon-view" style="margin-left:10px;"></i>
                                <span style="margin-left:10px;">检索字段 </span>
                                <span style="font-size:12px; float: right; margin-right:10px;  font-weight: normal; color:#999;">
                                    <i class="el-icon-info"></i>映射报表检索参数</span>
                            </div>
                            <div class="warp" style="height:150px;">
                                <div v-for=" (field,index) in DataSource.QueryFields"
                                     class="item"
                                     :key="field.Name">
                                    <span class="comment" style="padding-left:2px;">{{field.Comment}}</span>
                                    <span class="name" style="padding-left:2px;">{{field.Name}}</span>
                                    <div class="query">
                                        <el-select size="mini"
                                                   placeholder="选择检索参数"
                                                   v-model="field.QueryParam">
                                            <el-option
                                                    class="report-setting-item"
                                                    v-for="item in ItReport.QueryParam"
                                                    :key="item.Id"
                                                    :label="item.ShowLabel"
                                                    :value="item.Id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <i class="el-icon-close i-del" @click="funDelQueryField(field,index)"></i>
                                </div>
                            </div>
                        </div>
                    </el-main>
                </el-container>
            </div>
        </el-dialog>
        <el-dialog
                title="统计图参数配置"
                :visible.sync="dialogChartOption"
                :close-on-click-modal=false
                lock-scroll
                width="700px">
            <div class="chartoption-warp">
                <el-container class="h100 pd0">
                    <el-header style="height:45px;" class="pd0 ">
                        <div style="width: 200px; margin:6px 0 0 10px; float: left;">
                            <el-select
                                    placeholder="请选择常用模版"
                                    @change="funSelectChartTemplate"
                                    v-model="ChartTemplateVal"
                                    size="small">
                                <el-option
                                        v-for="(item,index) in ChartTemplate"
                                        class="report-setting-item"
                                        :key="index"
                                        :label="item.Label"
                                        :value="item.Value"/>
                            </el-select>
                        </div>
                        <tool-button text="保存" icon="save"
                                     left-line
                                     @buttonClick="funSaveChartOption"/>
                        <tool-button text="取消" icon="exit"
                                     style="float: right;"
                                     left-line
                                     @buttonClick="(val)=>{this.dialogChartOption = false}"/>
                    </el-header>
                    <el-main class="pd0" style="overflow:hidden;">
                        <json-editor ref="jsonEditor" v-model="ChartOption"/>
                    </el-main>
                </el-container>
            </div>
        </el-dialog>
        <el-dialog
                title="报表数据浏览(在此编辑无效)"
                :visible.sync="dialogItReportJson"
                :close-on-click-modal=false
                lock-scroll
                width="800px">
            <div class="chartoption-warp" style="height:450px;">
                <json-editor ref="jsonEditor" v-model="ItReportJson"/>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    import toolButton from "@/itsoftUI/components/toolbar/toolbutton"
    import {PageStyle} from "@/itsoftUI/components/report/style"
    import {unitConver} from "@/itsoftUI/components/report/unitConver";
    import lrz from "lrz";
    import {Edit} from "@/api/system/report"
    import {Get, ListSearch, ListField} from "@/api/common"
    import {ItSoftUtil} from "@/itsoftUI/utils/ItSoftUtil"
    import JsonEditor from "@/itsoftUI/components/JsonEditor"

    const defaultFontSize = "10pt" //默认字体大小
    const defaultFontFamily = "Arial" //默认字体
    const defaultPadding = "1mm" //默认边距
    const DataSourceTable = "yS7/PaNlnw6x8zatws+N5SpBvfvhNM8bjqB9JwgMbQw="
    const tableName = 'JdJQwwwzsf9olVnBRhcsXg=='
    export default {
        name: "reportDesign",
        components: {toolButton, JsonEditor},
        data() {
            return {
                ReportList: [],//报表列表
                ReportData: {
                    id: '0',
                    type: 'DataGrid',
                    schoolcode: this.$itsoftUI.config.schoolCode,
                    name: '新报表',
                    module: '',
                    content: '',
                    remark: '',
                    edittime: '',
                    edituser: '',
                    serialnum: ''
                },
                ItReport: {
                    Name: '',
                    Type: '',
                    Page: {
                        Width: "210mm",
                        Height: "297mm",
                        RightMargin: "1mm",
                        LeftMargin: "1mm",
                        TopMargin: "1mm",
                        BottomMargin: "1mm",
                        Area: []
                    },
                    NodeItem: [],
                    DataSet: [],
                    QueryParam: [],
                },
                ItReportJson: {},
                DataSource: {Name: '', Label: '', SelectType: '1', SelectFields: [], QueryFields: []},
                stylePageSize: "",
                stylePageMargin: "",
                stylePageMarginTop: "",
                stylePageMarginBottom: "",
                stylePageMarginLeft: "",
                stylePageMarginRight: "",
                stylePageHeader: "",
                stylePageDetail: "",
                stylePageFooter: "",
                selectReportArea: null,
                loading: true,
                styleRulerX: '',
                styleRulerY: '',
                headerHeight: '',
                detailHeight: '',
                footerHeight: '',
                xScale: [], // 水平刻度
                yScale: [], // 垂直刻度
                isMultiple: false,
                MultipleText: false,
                x: [],
                pasteNode: [],//粘贴板
                multipleNodes: [],
                multipleTDs: [],
                alignLeft: false, //对齐按钮状态
                alignTop: false,
                styleTable: "",
                setTitle: "报表主体",//设置标题
                settingTab: 0,
                showAreaSp: true,
                fileLoading: false,
                FontFamilyList: [{label: '宋体', value: "SimSun,STSong"},
                    {label: '仿宋', value: "FangSong,STSong"},
                    {label: '黑体', value: "SimHei,STHeiti"},
                    {label: '楷体', value: "STKaiti,KaiTi"},
                    {label: 'Arial', value: "Arial"},
                    {label: 'Arial Black', value: '"Arial Black"'},
                    {label: 'Comic Sans MS', value: '"Comic Sans MS"'},
                    {label: 'Verdana', value: "Verdana"}],
                FontSizeList: [{label: '8pt'}, {label: '9pt'}, {label: '10pt'}, {label: '11pt'}, {label: '12pt'}
                    , {label: '14pt'}, {label: '16pt'}, {label: '18pt'}, {label: '20pt'}, {label: '22pt'}, {label: '24pt'}
                    , {label: '26pt'}, {label: '28pt'}, {label: '36pt'}, {label: '48pt'}, {label: '72pt'}],
                FontStyle: ['加粗', '斜体', '下划线'],
                FontStyleSelect: [],
                styleBorder: [{label: '无', value: "solid 0pt"}
                    , {label: '1pt实线', value: "solid 1pt"}
                    , {label: '1pt虚线', value: "dashed 1pt"}
                    , {label: '1pt点虚线', value: "dotted 1pt"}
                    , {label: '2pt实线', value: "solid 2pt"}
                    , {label: '2pt虚线', value: "dashed 2pt"}
                    , {label: '2pt点虚线', value: "dotted 2pt"}
                    , {label: '4pt实线', value: "solid 4pt"}
                    , {label: '4pt虚线', value: "dashed 4pt"}
                    , {label: '4pt点虚线', value: "dotted 4pt"},
                ],
                styleBox: [{label: '无', value: ""}, {label: '边框', value: "all"}],
                BoxValue: null,
                Shapes: [{label: '矩形', value: '0'}, {label: '椭圆形', value: '50%'},],
                Modules: [{label: '需求计划', value: "需求计划"}
                    , {label: '采购入库', value: "采购入库"}
                    , {label: '供应出库', value: "供应出库"}
                    , {label: '库房管理', value: "库房管理"}
                ],
                ChartList: [{Label: '饼图', Value: 'pie'}, {Label: '曲线图', Value: 'line'}, {Label: '柱状图', Value: 'bar'}]
                ,
                leftNavClose: true,
                btnDataSetSelected: false,
                btnNodesSelected: false,
                activeName: '1',
                inData: [],//内置数据
                DataSet: [],//数据源
                loadDataSet: true,//加载数据源状态
                DataField: [],//字段
                QueryParamDataField: [],//字段
                FieldLoading: false,
                SelectQueryParam: null,//选中的检索参数
                DateParamDefault: ItSoftUtil.getDateList(),//日期类型参数默认值
                DictTableList: [],//数据字典表
                DictFieldList: [],//数据字典字段数据
                ReportChangeCount: 0,//修改次数
                TextAlignRadio: '',
                dialogDataSource: false,//数据源弹窗
                dialogChartOption: false,//统计图配置弹窗
                dialogItReportJson: false,//统计图配置弹窗
                ChartId: 0,//统计图ID
                ChartOption: {},
                ColSpan: false,
                ColSpanDel: false,
                RowSpan: false,
                RowSpanDel: false,
                ChartTemplate: [
                    {
                        Label: 'pie饼图',
                        Value: {
                            tooltip: {trigger: "item", formatter: "{b} ({d}%)"},
                            series: [{type: "pie", radius: "55%", center: ["50%", "60%"]}]
                        }
                    },
                    {
                        Label: 'bar柱状图',
                        Value: {
                            xAxis: {type: "category",},
                            yAxis: {type: "value"},
                            series: [{type: "bar"}]
                        }
                    },
                    {
                        Label: 'line折线图',
                        Value: {
                            xAxis: {type: "category",},
                            yAxis: {type: "value"},
                            series: [{type: "line"}]
                        }
                    }
                ],
                ChartTemplateVal: ''

            }
        },
        methods: {
            //按钮事件
            toolButtonClick(text) {
                switch (text) {
                    case "数据源":
                        this.funDbFxManger()
                        break
                    case "元素目录":
                        this.funNodesManger()
                        break
                    case "左对齐":
                    case "右对齐":
                    case "上对齐":
                    case "下对齐":
                    case "等高":
                    case "等宽":
                        this.funAlignNode(text)
                        break
                    case "合并列":
                        this.funTableColSpan()
                        break
                    case "取消合并列":
                        this.funTableColSpanDel()
                        break
                    case "合并行":
                        this.funTableRowSpan()
                        break
                    case "取消合并行":
                        this.funTableRowSpanDel()
                        break
                    case "插入列":
                        this.funTableAddCol()
                        break
                    case "删除列":
                        this.funTableDelCol()
                        break
                    case "插入行":
                        this.funTableAddRow()
                        break
                    case "删除行":
                        this.funTableDelRow()
                        break
                    case "复制":
                        this.funCopyNode()
                        break
                    case "粘贴":
                        this.funPasteNode()
                        break
                    case "删除":
                        this.funRemoveNode()
                        break
                    case "保存":
                        this.funSaveReport()
                        break

                    case "求和":
                        this.funAddComputeField('sum')
                        break
                    case "平均值":
                        this.funAddComputeField('avg')
                        break
                    case "计数":
                        this.funAddComputeField('count')
                        break
                    case "最小值":
                        this.funAddComputeField('min')
                        break
                    case "最大值":
                        this.funAddComputeField('max')
                        break
                    case "复制报表":
                    case "返回":
                    case "预览报表":
                        if (this.ReportChangeCount > 2) {
                            this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                                distinguishCancelAndClose: true,
                                confirmButtonText: '保存',
                                cancelButtonText: '放弃修改',
                                type: 'warning',
                            }).then(() => {
                                new Promise((resolve) => {
                                    this.funSaveReport(resolve)
                                }).then(data => {
                                    if (data === '保存成功')
                                        this.funExitDesign(text)
                                })
                            }).catch(action => {
                                if (action === 'cancel') {
                                    //放弃保存并离开页面
                                    this.funExitDesign(text)
                                }
                            });
                        } else {
                            this.funExitDesign(text)
                        }
                        break
                }
            },
            //选择数据源并获取字段
            funSelectDataSource(val, id) {
                //取数据源的描述
                this.DataSource.Comments = this.DataSet.filter(item => item.value === val)[0].label
                this.DataSource.Label = this.DataSource.Comments
                this.funGetDataSourceField(val, id)
            },
            //提取数据源
            evtGetDataSet() {
                if (this.DataSet.length === 0) {
                    let search = []
                    search.push({
                        "andOr": "and",
                        "searchField": "type",
                        "operator": "=",
                        "searchValue": "view"
                    })
                    this.loadDataSet = true
                    ListSearch(JSON.stringify(search), DataSourceTable, "name value,comments label").then((res) => {
                        this.DataSet = res.data
                        this.loadDataSet = false
                    })
                }
            },
            //添加编辑数据集合
            evtEditDataSet(id) {
                let that = this
                if (id === "0") {
                    //添加集合
                    that.DataField = []
                    that.DataSource = {Id: '0', Name: '', Label: '', SelectType: '1', SelectFields: [], QueryFields: []}
                    that.dialogDataSource = true
                } else {
                    //编辑集合
                    that.DataSource = JSON.parse(JSON.stringify(this.ItReport.DataSet.filter(item => item.Id === id)[0]));
                    this.evtGetDataSet()
                    this.funGetDataSourceField(that.DataSource.Name).then((res) => {
                        if (res === "ok")
                            that.dialogDataSource = true
                    })
                }
            },
            //删除数据集合
            funDelDataSet(index, id) {
                //判断报表是否引用
                if (this.ItReport.NodeItem.filter(item => item.DataSetValue === id &&
                    item.DataType === 'db').length > 0) {
                    this.$message.error("报表正在使用，无法删除")
                    return false
                }
                this.ItReport.DataSet.splice(index, 1)
                this.$message.success("数据集合已删除")
            },
            //保存数据集合
            funSaveDateSet() {
                let that = this
                //数据验证
                if (that.DataSource.Name.length === 0) {
                    this.$message.error("请选择数据源")
                    return false
                }
                if (that.DataSource.SelectFields.length === 0) {
                    this.$message.error("请选择查询字段")
                    return false
                }
                if (that.DataSource.Id === "0") {
                    that.DataSource.Id = new Date().valueOf().toString()
                    that.ItReport.DataSet.push(that.DataSource)
                } else {
                    for (let i = 0; i < that.ItReport.DataSet.length; i++) {
                        if (that.ItReport.DataSet[i].Id === that.DataSource.Id) {
                            that.ItReport.DataSet.splice(i, 1, that.DataSource)
                            break
                        }
                    }
                }
                this.dialogDataSource = false
                this.$message.success("保存成功")
            },
            //获取字段
            funGetDataSourceField(table, id) {
                let that = this
                let fn = new Promise((resolve) => {
                    //获取数据字段
                    that.FieldLoading = true
                    ListField(table).then((res) => {
                        //判断是否已经选择
                        if (id !== "0") {
                            res.data.forEach(function (item) {
                                if (that.DataSource.SelectFields.filter(col => col.Name === item.name).length > 0) {
                                    item.Selected = "1"
                                } else {
                                    item.Selected = "0"
                                }
                                if (that.DataSource.QueryFields.filter(col => col.Name === item.name).length > 0) {
                                    item.Queryed = "1"
                                } else {
                                    item.Queryed = "0"
                                }
                                item.check = false
                            })
                        }
                        that.DataField = res.data
                        that.FieldLoading = false
                        return resolve("ok")
                    })
                });
                return fn
            },
            //复选改单选字段
            funFieldCheck(val, name) {
                if (val) {
                    this.DataField.filter(item => item.check).forEach(function (item) {
                        if (item.name !== name)
                            item.check = false
                    })
                }
            },
            //添加数据集合
            funAddDataField(field) {
                if (field) {
                    if (this.DataSource.SelectFields.filter(item => item.Name === field.name).length > 0) {
                        this.$message.error(field.comment + "已存在")
                        return false
                    }
                    let fd = {}
                    fd.Name = field.name;
                    fd.Comment = field.comment
                    fd.DataType = field.type
                    //添加查询字段
                    this.DataSource.SelectFields.push(fd)
                    //隐藏添加按钮
                    this.DataField.filter(item => item.name === field.name)[0].Selected = "1"
                    this.$forceUpdate()
                }
            },
            funAddQueryField(field) {
                if (field) {
                    if (this.DataSource.QueryFields.filter(item => item.Name === field.name).length > 0) {
                        this.$message.error(field.comment + "已存在")
                        return false
                    }
                    let fd = {}
                    fd.Name = field.name;
                    fd.Comment = field.comment
                    fd.DataType = field.type
                    fd.QueryParam = ""
                    //添加检索字段
                    this.DataSource.QueryFields.push(fd)
                    //隐藏添加按钮
                    this.DataField.filter(item => item.name === field.name)[0].Queryed = "1"
                    this.$forceUpdate()
                }
            },
            funDelQueryField(field, index) {
                this.DataSource.QueryFields.splice(index, 1)
                let d = this.DataField.filter(item => item.name === field.Name)[0]
                if (d)
                    d.Queryed = "0"
                this.$forceUpdate()
            },
            funDelDataField(field, index, id) {
                //判断报表是否引用
                if (this.ItReport.NodeItem.filter(item => item.DataSetValue === id &&
                    item.DataType === 'db' && item.Value === field.Name).length > 0) {
                    this.$message.error(field.Comment + "报表正在使用，无法删除")
                    return false
                }
                //如果分组
                if (this.DataSource.SelectType === '2'
                    && field.DataType !== "ComputeField"
                    && this.DataSource.SelectFields.filter(item => item.DataType !== "ComputeField").length === 1
                    && this.DataSource.SelectFields.filter(item => item.DataType === "ComputeField").length > 0) {
                    this.$message.error("分组模式下存在有计算列，不能全部删除字段，无法分组")
                    return false
                }
                this.DataSource.SelectFields.splice(index, 1)
                let d = this.DataField.filter(item => item.name === field.Name)[0]
                if (d)
                    d.Selected = "0"
                this.$forceUpdate()
            },
            //添加计算列
            funAddComputeField(val) {
                let Name = ""
                let FieldLabel = ""
                if (val === "count") {
                    Name = "count(*)"
                } else {
                    //判断是否选择字段
                    let field = this.DataField.filter(item => item.check) [0]
                    if (!field) {
                        this.$message.error(val + "前要先选择字段")
                        return false
                    }
                    Name = val + "(" + field.name + ")"
                    FieldLabel = field.comment
                }
                //判断是否存在
                if (this.DataSource.SelectFields.filter(item => item.Name === Name).length > 0) {
                    this.$message.error(Name + "已经存在")
                    return false
                }
                let DataType = "ComputeField"
                let Comment = this.funMakeComputeFieldID()
                //添加查询字段
                this.DataSource.SelectFields.push({Name, Comment, DataType, FieldLabel})
            },
            //生成计算列ID
            funMakeComputeFieldID() {
                let id = 0
                let nodes = this.DataSource.SelectFields.filter(item => item.DataType === 'ComputeField')
                for (let i = 0; i < nodes.length; i++) {
                    let j = Number(nodes[i].Comment.slice(7))
                    if (id < j) id = j
                }
                id++
                return 'compute' + id.toString()
            },
            //数据元素管理
            funDbFxManger() {
                if (this.btnDataSetSelected) {
                    //已选中下要取消
                    this.btnDataSetSelected = false
                    //关闭
                    this.leftNavClose = true
                } else {
                    //未选中下要选中
                    this.btnDataSetSelected = true
                    if (this.leftNavClose) this.leftNavClose = false
                    this.btnNodesSelected = this.leftNavClose
                    if (this.DictTableList.length === 0) {
                        let search = []
                        search.push(
                            {
                                "andOr": "and",
                                "searchField": "type",
                                "operator": "=",
                                "searchValue": "table"
                            })
                        ListSearch(JSON.stringify(search), DataSourceTable, "name,comments").then((res) => {
                            this.DictTableList = res.data
                        })
                    }
                }

            },
            //报表元素展示
            funNodesManger() {
                if (this.btnNodesSelected) {
                    //已选中下要取消
                    this.btnNodesSelected = false
                    //关闭
                    this.leftNavClose = true
                } else {
                    //未选中下要选中
                    this.btnNodesSelected = true
                    if (this.leftNavClose) this.leftNavClose = false
                    this.btnDataSetSelected = this.leftNavClose
                }
            },
            //添加报表参数
            funAddQueryParam() {
                //显示标签
                let Id = new Date().valueOf().toString()
                let ShowLabel = "报表参数"
                let FieldType = "char"
                //输入类型1输入2选择
                let InputType = null
                //是否必填项目
                let Required = false
                //默认值
                let Default = null
                //单选
                let selectType = "radio"
                InputType = "1"
                let data = {Id, ShowLabel, FieldType, Required, InputType, Default, selectType}
                this.ItReport.QueryParam.push(data)
                this.$message.success("添加成功，请点击设置图标进行详细设置")
                this.activeName = "2"
            },
            //删除报表参数
            funDelQueryParam(index, id) {
                let nodes = this.ItReport.NodeItem.filter(item => item.DataType === "query" && item.Value === id)
                if (nodes.length > 0) {
                    this.$message.error("报表中已经引用该参数，无法删除")
                    return false
                }
                //数据集合中是否引用
                for (let i = 0; i < this.ItReport.DataSet.length; i++) {
                    if (this.ItReport.DataSet[i].QueryFields.filter(item => item.QueryParam === id).length > 0) {
                        this.$message.error("数据集合正在引用，无法删除")
                        return false
                    }
                }
                this.ItReport.QueryParam.splice(index, 1)
                this.settingTab = 0
                this.SelectQueryParam = null
            },
            //选择检索参数进行编辑
            funSelectQueryParam(ShowLabel, id, DictTable) {
                this.SelectQueryParam = {ShowLabel, id};
                this.settingTab = 1
                //加载字段
                if (DictTable)
                    this.funLoadDictField(DictTable)
            },
            //添加参数数据行
            evtAddRow(query) {
                if (!query.DataList) query.DataList = []
                let label = "", value = ""
                query.DataList.push({label, value})
                this.$forceUpdate()
            },
            //删除参数数据行
            evtDeleteRow(data, index) {
                data.splice(index, 1)
            },
            //表格单元样式
            cellClassName({columnIndex}) {
                if (columnIndex === 0 || columnIndex === 1) {
                    return 'cell-input'
                }
            },
            //加载数据字段表
            funLoadDictField(table) {
                //表
                ListField(table).then((res) => {
                    this.DictFieldList = res.data
                })
            },
            //选中列表元素
            funAreaNodeSelect(e, id) {
                let selected = document.getElementsByClassName("comment-selected")
                for (let i = 0; i < selected.length; i++) {
                    selected[i].classList.remove("comment-selected")
                }
                selected = document.getElementById(id)
                if (selected) {
                    e.target.classList.add("comment-selected")
                    this.funSelectNode(selected)
                }
            },
            //获取元素index
            getNodeIndex(id) {
                for (let i = 0; i < this.ItReport.NodeItem.length; i++) {
                    if (this.ItReport.NodeItem[i].Id === id) {
                        return i
                    }
                }
            },
            //生成元素ID
            funMakeNodeID(type) {
                //根据类型生产元素ID
                let id = 0
                let nodes = this.ItReport.NodeItem.filter(item => item.DataType === type)
                for (let i = 0; i < nodes.length; i++) {
                    let j = Number(nodes[i].Id.split('-')[1])
                    if (id < j) id = j
                }
                id++
                return type + "-" + id.toString()
            },
            //删除元素
            funRemoveNode() {
                if (this.multipleNodes.length > 0) {
                    let that = this
                    this.multipleNodes.forEach(function (item) {
                        let index = that.getNodeIndex(item.nodeId)
                        if (index >= 0) {
                            that.ItReport.NodeItem.splice(index, 1)
                        }
                    })
                    this.clearSelected()
                    this.multipleNodes = []
                    this.setTitle = "报表主体"
                }
            },
            //复制元素
            funCopyNode() {
                if (this.pasteNode.filter(item => (item.parentId === "report-table")).length > 0) {
                    //明细区域表格不复制
                    this.pasteNode = []
                } else {
                    this.pasteNode = this.multipleNodes.concat()
                }
            },
            //粘贴元素
            funPasteNode() {
                let that = this
                this.pasteNode.forEach(function (node) {
                    let temp = that.ItReport.NodeItem.filter(item => (item.Id === node.nodeId))[0]
                    let nodeItem = JSON.parse(JSON.stringify(temp))
                    nodeItem.Id = that.funMakeNodeID(temp.DataType)
                    nodeItem.StyleValue.Top = (unitConver.unit2Num(temp.StyleValue.Top) + 1) + "mm"
                    nodeItem.StyleValue.Left = (unitConver.unit2Num(temp.StyleValue.Left) + 1) + "mm"
                    that.ItReport.NodeItem.push(nodeItem)
                })
                //清空
                this.pasteNode = []
            },
            //元素对齐
            funAlignNode(align) {
                if (this.multipleNodes.length <= 1) return
                let sNode = this.multipleNodes[this.multipleNodes.length - 1].selected
                for (let i = 0; i < this.multipleNodes.length - 1; i++) {
                    let index = -1
                    let bottom, right
                    switch (align) {
                        case "左对齐":
                            this.multipleNodes[i].selected.style.left = sNode.style.left
                            index = this.getNodeIndex(this.multipleNodes[i].selected.id)
                            if (index >= 0) {
                                this.ItReport.NodeItem[index].StyleValue.Left = sNode.style.left
                            }
                            break
                        case "上对齐":
                            this.multipleNodes[i].selected.style.top = sNode.style.top
                            index = this.getNodeIndex(this.multipleNodes[i].selected.id)
                            if (index >= 0) {
                                this.ItReport.NodeItem[index].StyleValue.Top = sNode.style.top
                            }
                            break
                        case "下对齐":
                            bottom = this.multipleNodes[i].selected.offsetTop + (sNode.offsetTop + sNode.offsetHeight) -
                                (this.multipleNodes[i].selected.offsetTop + this.multipleNodes[i].selected.offsetHeight)
                            this.multipleNodes[i].selected.style.top = unitConver.px2Mm(bottom) + "mm"
                            index = this.getNodeIndex(this.multipleNodes[i].selected.id)
                            if (index >= 0) {
                                this.ItReport.NodeItem[index].StyleValue.Top = unitConver.px2Mm(bottom) + "mm"
                            }
                            break
                        case "右对齐":
                            right = this.multipleNodes[i].selected.offsetLeft + (sNode.offsetLeft + sNode.offsetWidth) -
                                (this.multipleNodes[i].selected.offsetLeft + this.multipleNodes[i].selected.offsetWidth)
                            this.multipleNodes[i].selected.style.left = unitConver.px2Mm(right) + "mm"
                            index = this.getNodeIndex(this.multipleNodes[i].selected.id)
                            if (index >= 0) {
                                this.ItReport.NodeItem[index].StyleValue.Left = unitConver.px2Mm(right) + "mm"
                            }
                            break
                        case "等高":
                            this.multipleNodes[i].selected.style.height = sNode.style.height
                            index = this.getNodeIndex(this.multipleNodes[i].selected.id)
                            if (index >= 0) {
                                this.ItReport.NodeItem[index].StyleValue.Height = sNode.style.height
                            }
                            break
                        case "等宽":
                            this.multipleNodes[i].selected.style.width = sNode.style.width
                            index = this.getNodeIndex(this.multipleNodes[i].selected.id)
                            if (index >= 0) {
                                this.ItReport.NodeItem[index].StyleValue.Width = sNode.style.width
                            }
                            break
                    }
                }

            },
            //边框全部设置
            funSelectBox(val, style) {
                if (val === "all") {
                    style.BorderTop = "solid 1pt"
                    style.BorderLeft = "solid 1pt"
                    style.BorderRight = "solid 1pt"
                    style.BorderBottom = "solid 1pt"
                } else {
                    style.BorderTop = ""
                    style.BorderLeft = ""
                    style.BorderRight = ""
                    style.BorderBottom = ""
                }
            },
            //创建文本
            funCreateText(e) {
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "div")
                tempText.setAttribute("data-type", "text")
                tempText.setAttribute("data-value", "")
                tempText.innerHTML = "新文本"
                tempText.style.fontFamily = "Arial"
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.zIndex = "999"
                tempText.style.color = "#000000"
                warp.appendChild(tempText)
                let x = e.offsetX
                let y = e.offsetY + (tempText.offsetHeight / 2)
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.style.fontFamily = defaultFontFamily
                tempText.style.padding = defaultPadding
                tempText.style.fontSize = defaultFontSize
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                this.leftNavClose = true
                this.btnDataSetSelected = false
                this.btnNodesSelected = false
                return false
            },
            //创建字段数据
            funCreateDb(e, fieldName, fieldComment, fieldType, id, Label) {
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "div")
                tempText.setAttribute("data-type", "db")
                tempText.setAttribute("data-value", fieldName)
                tempText.setAttribute("data-dataset-name", Label)
                tempText.setAttribute("data-dataset-value", id)
                tempText.setAttribute("data-field-type", fieldType)
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.fontFamily = defaultFontFamily
                tempText.style.padding = defaultPadding
                tempText.style.fontSize = defaultFontSize
                tempText.style.color = "#000000"
                tempText.style.zIndex = "999"
                if (fieldType === "ComputeField") {
                    tempText.append(fieldComment)
                } else {
                    tempText.append("[" + fieldComment + "]")
                }
                warp.appendChild(tempText)
                let x = e.offsetX + 50
                let y = (e.clientY - 160) + (tempText.offsetHeight / 2)
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                return false
            },
            //创建检索条件
            funCreateQuery(e, id, ShowLabel, FieldType) {
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "div")
                tempText.setAttribute("data-type", "query")
                tempText.setAttribute("data-value", id)
                tempText.setAttribute("data-field-type", FieldType)
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.fontFamily = defaultFontFamily
                tempText.style.padding = defaultPadding
                tempText.style.fontSize = defaultFontSize
                tempText.style.color = "#000000"
                tempText.style.zIndex = "999"
                tempText.append("(" + ShowLabel + ")")
                warp.appendChild(tempText)
                let x = e.offsetX + 50
                let y = (e.clientY - 160) + (tempText.offsetHeight / 2)
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                return false
            },
            //创建线条
            funCreateLine(e) {
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "div")
                tempText.setAttribute("data-type", "line")
                tempText.setAttribute("data-value", "")
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.zIndex = "999"
                tempText.style.width = "20mm"
                tempText.style.borderTop = "solid 1pt"
                tempText.style.borderColor = "#000000"
                tempText.style.transformOrigin = "left top"
                //tempText.style.transform="rotate(0rad)"
                warp.appendChild(tempText)
                let x = e.offsetX
                let y = e.clientY - 135
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                this.leftNavClose = true
                this.btnDataSetSelected = false
                this.btnNodesSelected = false
                return false
            },
            //创建图形
            funCreateShape(e) {
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "div")
                tempText.setAttribute("data-type", "shape")
                tempText.setAttribute("data-value", "")
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.zIndex = "999"
                tempText.style.width = "15mm"
                tempText.style.height = "7mm"
                let border = "solid 1pt"
                tempText.style.borderLeft = border
                tempText.style.borderRight = border
                tempText.style.borderTop = border
                tempText.style.borderBottom = border
                tempText.style.borderColor = "#000000"
                warp.appendChild(tempText)
                let x = e.offsetX
                let y = e.clientY - 150
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                this.leftNavClose = true
                this.btnDataSetSelected = false
                this.btnNodesSelected = false
                return false
            },
            //创建表格
            funCreateTable(e) {
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "table")
                tempText.setAttribute("data-type", "table")
                tempText.setAttribute("data-value", "")
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.zIndex = "999"
                tempText.style.width = "60mm"
                tempText.style.height = "auto"
                tempText.innerHTML = "表格（3行X3列)"
                warp.appendChild(tempText)
                let x = e.offsetX
                let y = e.clientY - 150
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                this.leftNavClose = true
                this.btnDataSetSelected = false
                this.btnNodesSelected = false
                return false
            },
            //创建统计图
            funCreateChart(e) {
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "div")
                tempText.setAttribute("data-type", "chart")
                tempText.setAttribute("data-value", "")
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.zIndex = "999"
                tempText.style.width = "15mm"
                tempText.style.height = "15mm"
                tempText.innerHTML = "统计图"
                warp.appendChild(tempText)
                let x = e.offsetX
                let y = e.clientY - 150
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                this.leftNavClose = true
                this.btnDataSetSelected = false
                this.btnNodesSelected = false
                return false
            },
            //创建图片
            funCreateImg(e) {
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "div")
                tempText.setAttribute("data-type", "img")
                tempText.setAttribute("data-value", "")
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.zIndex = "999"
                tempText.style.width = "15mm"
                tempText.style.height = "12mm"
                let border = "solid 1pt"
                tempText.style.borderLeft = border
                tempText.style.borderRight = border
                tempText.style.borderTop = border
                tempText.style.borderBottom = border
                tempText.style.borderColor = "#dddddd"
                tempText.style.fontSize = "9pt"
                tempText.style.textAlign = "center"
                tempText.innerHTML = "图片"
                warp.appendChild(tempText)
                let x = e.offsetX
                let y = (e.clientY - 160) + (tempText.offsetHeight / 2)
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                this.leftNavClose = true
                this.btnDataSetSelected = false
                this.btnNodesSelected = false
                return false
            },
            //创建内置数据
            funCreateFx(e) {
                let obj = e.target
                let warp = document.getElementById("page-main-warp")
                let tempText = document.createElement("div")
                tempText.setAttribute("node-type", "div")
                tempText.setAttribute("data-type", "fx")
                tempText.setAttribute("data-value", obj.getAttribute("data-value"))
                tempText.style.position = "absolute"
                tempText.style.cursor = "default"
                tempText.style.fontFamily = defaultFontFamily
                tempText.style.padding = defaultPadding
                tempText.style.fontSize = defaultFontSize
                tempText.style.color = "#000000"
                tempText.style.zIndex = "999"
                tempText.append("{" + obj.getAttribute("data-text") + "}")
                warp.appendChild(tempText)
                let x = e.offsetX
                let y = (e.clientY - 155) + (tempText.offsetHeight / 2)
                tempText.style.top = y + "px"
                tempText.style.left = x + "px"
                tempText.id = this.funMakeNodeID(tempText.getAttribute("data-type"))
                //绑定事件
                this.evMouseDown(e, tempText, true)
                return false
            },
            //区域自动判断并生产数据
            funAreaAuto(e, selected) {
                let page = document.getElementById("pagemain")
                let scrollY = page.scrollTop
                let scrollX = page.scrollLeft
                for (let i = 0; i < this.ItReport.Page.Area.length; i++) {
                    let area = document.getElementById(this.ItReport.Page.Area[i].id)
                    if (!area) continue
                    let minY = area.offsetTop + page.offsetTop + 16 - scrollY
                    let maxY = minY + area.offsetHeight
                    let minX = area.offsetLeft + page.offsetLeft + 16 - scrollX
                    let maxX = minX + area.offsetWidth
                    let X = unitConver.unit2Num(selected.style.left)
                    let Y = unitConver.unit2Num(selected.style.top)
                    if ((X >= minX && X <= maxX) && (Y >= minY && Y <= maxY)) {
                        X = X - minX
                        Y = Y - minY
                        //添加数据
                        let item = {}
                        item.Area = area.id
                        item.Id = selected.id
                        item.NodeType = selected.getAttribute("node-type")
                        item.DataType = selected.getAttribute("data-type")
                        item.Value = selected.getAttribute("data-value")
                        item.DataSetValue = ""
                        item.DataSetName = ""
                        if (item.DataType === "db") {
                            item.DataSetName = selected.getAttribute("data-dataset-name")
                            item.DataSetValue = selected.getAttribute("data-dataset-value")
                            item.FieldType = selected.getAttribute("data-field-type")
                        }
                        if (item.DataType === "chart") {
                            item.ChartOption = {}
                        }
                        item.Text = selected.innerHTML
                        let StyleValue = {}
                        if (item.DataType === "table") {
                            StyleValue.BackgroundColor = "#000000"
                        }
                        StyleValue.Top = unitConver.px2Mm(Y) + "mm"
                        StyleValue.Left = unitConver.px2Mm(X) + "mm"
                        StyleValue.Width = selected.style.width ? selected.style.width :
                            unitConver.NumFixed2(unitConver.px2Mm(selected.offsetWidth)) + 'mm'
                        StyleValue.Height = selected.style.height ? selected.style.height :
                            unitConver.NumFixed2(unitConver.px2Mm(selected.offsetHeight)) + 'mm'
                        StyleValue.TextAlign = selected.style.textAlign
                        if (item.DataType === "chart") {
                            StyleValue.TextAlign = "center"
                        }
                        StyleValue.FontFamily = selected.style.fontFamily
                        StyleValue.FontSize = selected.style.fontSize
                        StyleValue.Color = selected.style.color
                        StyleValue.BorderLeft = selected.style.borderLeftStyle + " " + selected.style.borderLeftWidth
                        StyleValue.BorderRight = selected.style.borderRightStyle + " " + selected.style.borderRightWidth
                        StyleValue.BorderTop = selected.style.borderTopStyle + " " + selected.style.borderTopWidth
                        StyleValue.BorderBottom = selected.style.borderBottomStyle + " " + selected.style.borderBottomWidth
                        StyleValue.BorderColor = selected.style.borderColor
                        StyleValue.BorderRadius = "0"
                        StyleValue.TransformOrigin = selected.style.transformOrigin
                        StyleValue.Padding = selected.style.padding
                        StyleValue.Transform = "0"
                        item.StyleValue = StyleValue
                        if (item.NodeType === 'table') {

                            item.Text = "表格" + item.Id
                            let ColGroup = ['20', '20', '20']
                            let RowCol = []
                            for (let i = 0; i < 3; i++) {
                                let row = [];
                                for (let j = 0; j < 3; j++) {
                                    let col = {
                                        Type: 'text', Text: '', Value: '', Data: 'text', Padding: '1', Height: '10',
                                        FontSize: defaultFontSize, FontFamily: defaultFontFamily,
                                        Span: '0', Colspan: [], Rowspan: []
                                    }
                                    row.push(col)
                                }
                                RowCol.push(row)
                            }

                            this.$set(item, "Tables", {ColGroup, RowCol})
                        }

                        this.ItReport.NodeItem.push(item)
                        if (item.NodeType === 'table') {
                            this.$forceUpdate()
                        }
                        selected.remove()
                        return false
                    }
                }
                selected.remove()
            },
            //鼠标按下(移动元素）
            evMouseDown(e, selected, isNew) {
                if (!selected) {
                    selected = e.target
                }
                let parent = selected.parentNode
                if (selected.tagName === "IMG") {
                    selected = parent
                    parent = selected.parentNode
                }
                //选中
                if (!isNew)
                    this.funSelectNode(selected)
                if (selected.tagName === "TD") {
                    return false
                }
                let mouseXY = this.funGetMouseXY(e)
                let StartX = parseInt(mouseXY.x) - selected.offsetLeft
                let StartY = parseInt(mouseXY.y) - selected.offsetTop
                let that = this
                //鼠标移动
                document.onmousemove = function (e) {
                    that.funResizable()
                    let endXY = that.funGetMouseXY(e);
                    // 获取移动后的元素的坐标
                    let x = endXY.x - StartX
                    let y = endXY.y - StartY
                    if (parent) {
                        // 计算可移动位置的大小， 保证元素不会超过可移动范围
                        let maxWidth = parent.offsetWidth - selected.offsetWidth
                        let maxHeight = parent.offsetHeight - selected.offsetHeight
                        // min方法保证不会超过右边界，max保证不会超过左边界
                        x = Math.min(Math.max(0, x), maxWidth)
                        y = Math.min(Math.max(0, y), maxHeight)
                    }
                    selected.style.left = x + 'px'
                    selected.style.top = y + 'px'
                    return false
                }
                // 鼠标松开
                document.onmouseup = function (e) {
                    if (isNew) {
                        that.funAreaAuto(e, selected)
                    } else {
                        //改变数组
                        let index = that.getNodeIndex(selected.id)
                        if (index >= 0) {
                            that.funResizable(selected)
                            that.ItReport.NodeItem[index].StyleValue.Left = unitConver.NumFixed2(unitConver.px2Mm(selected.offsetLeft)) + 'mm'
                            that.ItReport.NodeItem[index].StyleValue.Top = unitConver.NumFixed2(unitConver.px2Mm(selected.offsetTop)) + 'mm'
                        }
                    }
                    document.onmousemove = null;
                    document.onmouseup = null;
                    return false
                }

            },
            //函数用于获取鼠标的位置
            funGetMouseXY(e) {
                let x = 0, y = 0
                e = e || window.event
                if (e.pageX) {
                    x = e.pageX
                    y = e.pageY
                } else {
                    x = e.clientX + document.body.scrollLeft - document.body.clientLeft
                    y = e.clientY + document.body.scrollTop - document.body.clientTop
                }
                return {
                    x: x,
                    y: y
                }
            },
            //选中元素
            funSelectNode(selected) {
                this.BoxValue = null
                switch (selected.getAttribute("data-type")) {
                    case "text":
                        this.setTitle = "文本"
                        break
                    case "img":
                        this.setTitle = "图片"
                        break
                    case "line":
                        this.setTitle = "线条"
                        break
                    case "shape":
                        this.setTitle = "图形"
                        break
                    case "fx":
                        this.setTitle = "内置数据"
                        break
                    case "db":
                        this.setTitle = "字段数据"
                        break
                    case "query":
                        this.setTitle = "检索参数"
                        break
                    case "table":
                        this.setTitle = "表格"
                        break
                    case "chart":
                        this.setTitle = "统计图"
                        break
                    default:
                        if (selected.tagName === 'TD') {
                            this.setTitle = "表格单元格"
                        }
                }
                this.settingTab = 0
                let parentId = selected.parentNode.id
                let nodeId = selected.id
                if (selected.tagName === 'TD') {
                    let index = selected.getAttribute("data-index")
                    let tableid = selected.getAttribute("table-id")
                    let obj = {tableid, index}
                    if (this.isMultiple) {
                        //不能跨表选
                        if (this.multipleTDs.length > 0
                            && this.multipleTDs.filter(item => item.tableid !== tableid).length > 0) {
                            this.clearSelected()
                        }
                        if (this.multipleTDs.length > 0) {
                            //不能列行混选，这样没有办法合并
                            for (let i = 0; i < this.multipleTDs.length; i++) {
                                let col = this.multipleTDs[i].index
                                if (col.split('-')[0] !== index.split('-')[0] && col.split('-')[1] !== index.split('-')[1]) {
                                    return false
                                }
                            }
                        }
                        selected.classList.add("selected")
                        let i = this.multipleTDs.filter(item => item.index === index)
                        if (i <= 0) {
                            this.multipleTDs.push(obj)
                        }
                        //判断列合并还是行合并
                        this.ColSpan = false
                        this.RowSpan = false
                        if (this.multipleTDs.length > 1) {
                            this.setTitle = "多选单元格"
                            let col1 = this.multipleTDs[0].index
                            let col2 = this.multipleTDs[this.multipleTDs.length - 1].index
                            if (col1.split('-')[0] === col2.split('-')[0]) {
                                this.ColSpan = true
                            } else {
                                this.RowSpan = true
                            }
                        }
                    } else {
                        this.FontStyleSelect = []
                        this.clearSelected()
                        selected.classList.add("selected")
                        let obj = {tableid, index}
                        this.multipleTDs.push(obj)
                        this.RowSpanDel = false
                        this.ColSpanDel = false
                        if (selected.getAttribute("colspan") !== '0') this.ColSpanDel = true
                        if (selected.getAttribute("rowspan") !== '-1') this.RowSpanDel = true

                    }
                } else {
                    if (this.isMultiple) {
                        this.FontStyleSelect = []
                        //复选
                        if (this.multipleNodes.filter(item => (item.nodeId === nodeId)).length === 0) {
                            this.multipleNodes.push({nodeId, selected, parentId})
                            this.funResizable()
                            selected.classList.add("selected")
                        }
                        if (this.multipleNodes.length > 1)
                            this.setTitle = "多选元素"
                    } else {
                        //单选
                        this.clearSelected()
                        this.multipleNodes.push({nodeId, selected, parentId})
                        this.funResizable(selected)
                        selected.classList.add("selected")
                        //字体样式改变
                        this.funGetFontStyle()
                    }
                }
            },
            //清除选中
            clearSelected() {
                let old = document.getElementById("pagemain").getElementsByClassName("selected")
                let jj = old.length
                for (let i = 0; i < jj; i++) {
                    if (old.length === 0) break
                    old[0].classList.remove("selected")
                }
                this.multipleNodes = []
                this.funResizable()
                this.FontStyleSelect = []
                this.multipleTDs = []
                this.ColSpan = false
                this.ColSpanDel = false
                this.RowSpan = false
                this.RowSpanDel = false
            },
            //鼠标改变尺寸布局
            funResizable(selected) {
                let old = document.getElementById("pagemain").getElementsByClassName("resizable")
                let j = old.length
                for (let i = 0; i < j; i++) {
                    if (old.length === 0) break
                    old[0].remove()
                }
                if (selected) {
                    //添加resizable
                    let type = selected.getAttribute("node-type")
                    if (selected.getAttribute("data-type") === "line") type = "line"
                    let resizables = document.getElementById("resizable").getElementsByClassName(type)
                    for (let i = 0; i < resizables.length; i++) {
                        let obj = resizables[i].cloneNode()
                        obj.onmousedown = (e) => {
                            this.funResizeNode(e, selected)
                        }
                        selected.append(obj)
                    }
                }
            },
            //选中页面
            funSelectedPage() {
                this.selectReportArea = document.getElementById("report-page")
                this.clearSelected()
                this.setTitle = "报表主体"
                this.settingTab = 0
            },
            //创建新报表
            funCreatReport(val) {
                let that = this
                that.loading = true
                that.ReportData.id = "0"
                that.ItReport.Name = '新报表'
                that.ReportData.type = val
                let area = []
                //分区
                if (val === 'DataGrid') {
                    area = [{id: "report-header", name: "头部区域", height: "35.4mm"},
                        {id: "report-detail", name: "明细区域", height: "9mm"},
                        {id: "report-summary", name: "汇总区域", height: "0mm"},
                        {id: "report-footer", name: "尾部区域", height: "10mm"}]
                } else {
                    area = [{id: "report-freeform", name: "自由风格", height: "290mm"}]
                }
                that.$set(that.ItReport.Page, "Area", area)
                that.funPageSize(this.ItReport.Page)
                that.ItReport.Type = val
                this.funCreateInData()
                that.$nextTick(() => {
                    setTimeout(function () {
                        that.loading = false;
                    }, 30);
                })
            },
            //内置数据
            funCreateInData() {
                if (this.ItReport.Type === 'DataGrid') {
                    this.inData = [
                        {name: '当前登录用户', value: 'username'},
                        {name: '当前日期', value: 'nowdate'},
                        {name: '当前日期和时间', value: 'nowdatetime'},
                        {name: '页码', value: 'pageindex'},
                        {name: '页数', value: 'pagetotal'},
                        {name: '第N页/共M页', value: 'pageindextotal'},
                        {name: '行号', value: 'row-index'},
                        {name: '机构名称', value: 'organization'}]
                } else {
                    this.inData = [
                        {name: '当前登录用户', value: 'username'},
                        {name: '当前日期', value: 'nowdate'},
                        {name: '当前日期和时间', value: 'nowdatetime'},
                        {name: '机构名称', value: 'organization'}]
                }
            },
            //提取报表数据
            funGetReport(id) {
                this.loading = true
                if (id === "0") {
                    //新增
                    this.ItReport.Type = "0"
                    this.loading = false
                } else {
                    let that = this
                    setTimeout(function () {
                        Get(id, tableName).then((res) => {
                            if (res.data) {
                                that.ReportData = res.data
                                that.ItReport = JSON.parse(decodeURIComponent(window.atob(that.ReportData.content)))
                                if (!that.ItReport.QueryParam) that.ItReport.QueryParam = []
                                that.funCreateInData()
                            } else {
                                that.$message.error('编辑数据不存在');
                            }
                            that.loading = false
                        });
                    }, 1)
                    //提取其他报表列表
                    let search = []
                    search.push({
                        "andOr": "and",
                        "searchField": "id",
                        "operator": "<>",
                        "searchValue": id
                    })
                    ListSearch(JSON.stringify(search), tableName, "id value,name label").then((res) => {
                        this.ReportList = res.data
                    })
                }
            },
            //获取其他报表，配置数据钻取用
            funGetReportQueryParam(id, node) {
                let that = this
                if (id.length === 0) {
                    node.QueryParam = []
                } else {
                    Get(id, tableName).then((res) => {
                        if (res.data) {
                            let query = JSON.parse(decodeURIComponent(window.atob(res.data.content))).QueryParam
                            query.forEach(function (item) {
                                that.$set(item, "InputType", "1")
                                that.$set(item, "Default", "")
                            })
                            this.$set(node, "QueryParam", query)
                        } else {
                            this.$message.error('报表不存在');
                        }
                    });
                }

            },
            //存储报表
            funSaveReport(resolve) {
                //修正树图标
                if (document.getElementById('dataset-warp')) {
                    let downs = document.getElementById('dataset-warp').getElementsByClassName("el-icon-caret-bottom")
                    for (let i = 0; i < downs.length; i++) {
                        downs[i].classList.remove("el-icon-caret-down")
                        downs[i].classList.add("el-icon-caret-right")
                    }
                }
                //console.log(this.ItReport)
                //名称
                this.ItReport.Name = this.ReportData.name
                //对报表数据进行编码Base64
                this.ReportData.content = window.btoa(encodeURIComponent(JSON.stringify(this.ItReport)))
                this.loading = true
                Edit(this.ReportData).then((res) => {
                    //关闭loading
                    this.loading = false
                    //修改状态复位
                    if (resolve) {
                        return resolve("保存成功")
                    } else {
                        this.$message.success("报表成功提交")
                        this.ReportData.edituser = res.data.edituser
                        this.ReportData.edittime = res.data.edittime
                        this.ReportData.id = res.data.id
                        this.ReportChangeCount = 1

                    }
                });
            },
            //预览报表,返回,复制报表
            funExitDesign(val) {
                if (val === '返回') {
                    if (window.history.length <= 1) {
                        this.$router.push({path: '/'})
                        return false
                    } else {
                        this.$router.go(-1)
                    }
                } else if (val === '预览报表') {
                    //预览报表
                    let query = {}
                    let QueryParam = [{FieldName: 'orderno', FieldValue: 'RK20200209001'}]
                    //query.reportid = this.ReportData.id
                    query.queryparam = window.btoa(encodeURIComponent(JSON.stringify(QueryParam)))
                    this.$router.push({path: '/itreport/viewer/' + this.ReportData.id})
                } else if (val === '复制报表') {
                    this.ReportData.id = "0"
                    this.ReportData.name = "新报表"
                    this.$message.success("新报表已复制，请保存确认")
                }
            },
            //滚动条固定标尺位置
            evtScroll(e) {
                let x = Math.max(document.body.scrollTop, e.target.scrollTop)
                let y = Math.max(document.body.scrollLeft, e.target.scrollLeft)
                document.getElementById("ruler-y").style.left = y + "px"
                document.getElementById("ruler-x").style.top = x + "px"
                document.getElementById("ruler-empty").style.top = x + "px"
                document.getElementById("ruler-empty").style.left = y + "px"
                if (e.target.scrollTop > 0 || e.target.scrollLeft > 0) {
                    document.getElementById("ruler-empty").classList.add("on")
                } else {
                    document.getElementById("ruler-empty").classList.remove("on")
                }
            },
            //滚动回到原点（0，0）
            evtScrollGo() {
                if (document.getElementById("ruler-empty").classList.contains("on")) {
                    let page = document.getElementById("pagemain")
                    page.scrollTop = 0
                    page.scrollLeft = 0
                }
            },
            evtRulerMouseOver(e, v) {
                if (v === 'x') {
                    document.getElementById("ruler-x-base-line").style.display = "block"
                } else {
                    document.getElementById("ruler-y-base-line").style.display = "block"
                }
            },
            evtRulerMouseOut(e, v) {
                if (v === 'x') {
                    document.getElementById("ruler-x-base-line").style.display = "none"
                } else {
                    document.getElementById("ruler-y-base-line").style.display = "none"
                }
            },
            //标尺鼠标移动
            evtRulerMouseMove(e, v) {
                if (v === 'x') {
                    let line = document.getElementById("ruler-x-base-line")
                    document.getElementById("ruler-x-base-line-value").innerText = e.offsetX
                    line.style.left = (e.offsetX) + 'px'
                } else {
                    let line = document.getElementById("ruler-y-base-line")
                    document.getElementById("ruler-y-base-line-value").innerText = e.offsetY
                    line.style.top = (e.offsetY) + 'px'
                }
            },
            //添加标尺参考线
            evtAddLine(e, v) {
                if (v === 'x') {
                    if (!this.ItReport.RulerXLine) this.ItReport.RulerXLine = []
                    let x = e.offsetX + 'px'
                    if (!this.ItReport.RulerXLine.includes(x)) this.ItReport.RulerXLine.push(x)
                } else {
                    if (!this.ItReport.RulerYLine) this.ItReport.RulerYLine = []
                    let y = e.offsetY + 'px'
                    if (!this.ItReport.RulerYLine.includes(y)) this.ItReport.RulerYLine.push(y)
                }
                this.$forceUpdate()
            },
            //删除参考线
            evtDelLine(v, index) {
                if (v === 'x') {
                    this.ItReport.RulerXLine.splice(index, 1)
                } else {
                    this.ItReport.RulerYLine.splice(index, 1)
                }
                this.$forceUpdate()
            },
            //移动线
            evtMoveLine(e, v, index) {
                let line = e.target
                let mouseXY = this.funGetMouseXY(e)
                let StartX = parseInt(mouseXY.x) - line.offsetLeft
                let StartY = parseInt(mouseXY.y) - line.offsetTop
                let that = this
                //鼠标移动
                document.onmousemove = function (e) {
                    let endXY = that.funGetMouseXY(e);
                    // 获取移动后的元素的坐标
                    let x = endXY.x - StartX
                    let y = endXY.y - StartY
                    if (v === 'x') {
                        that.ItReport.RulerXLine[index] = x + 'px'
                    } else {
                        that.ItReport.RulerYLine[index] = y + 'px'
                    }
                    that.$forceUpdate()
                    return false
                }
                // 鼠标松开
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    return false
                }
            },
            //元素尺寸改变
            funResizeNode(e, selected) {
                let obj = e.target
                let that = this
                let startX = e.clientX;
                let startY = e.clientY;
                let X = obj.offsetLeft
                let Y = obj.offsetTop
                let HH = 0
                if (document.getElementById("report-header"))
                    HH = document.getElementById("report-header").offsetHeight
                let DH = 0
                if (document.getElementById("report-detail"))
                    DH = document.getElementById("report-detail").offsetHeight
                let FreeH = 0
                if (document.getElementById("report-freeform"))
                    FreeH = document.getElementById("report-freeform").offsetHeight
                let FH = 0
                if (document.getElementById("report-footer"))
                    FH = document.getElementById("report-footer").offsetHeight
                let R = {}
                let startAngle
                let angle
                let index
                if (selected) {
                    index = this.getNodeIndex(selected.id)
                    startAngle = parseFloat(this.ItReport.NodeItem[index].StyleValue.Transform) || 0
                }
                switch (obj.id) {
                    case "resizable-top":
                        R.H = selected.offsetHeight
                        R.T = selected.offsetTop
                        break
                    case "resizable-bottom":
                        R.H = selected.offsetHeight
                        break
                    case "resizable-left":
                        R.W = selected.offsetWidth
                        R.L = selected.offsetLeft
                        break
                    case "resizable-line-right":
                    case "resizable-right":
                        R.W = selected.offsetWidth
                        break
                    case "resizable-top-left":
                    case "resizable-top-right":
                    case "resizable-bottom-left":
                    case "resizable-bottom-right":
                        R.H = selected.offsetHeight
                        R.T = selected.offsetTop
                        R.W = selected.offsetWidth
                        R.L = selected.offsetLeft
                        break
                }
                document.onmousemove = function (emove) {
                    let endX = emove.clientX;
                    let endY = emove.clientY;
                    let area = null
                    let maxH = 0
                    switch (obj.id) {
                        case "report-header-split":
                            area = that.ItReport.Page.Area.filter(item => (item.id === "report-header"))[0]
                            if (area) {
                                maxH = unitConver.unit2Num(that.ItReport.Page.Height) / 5
                                area.height = unitConver.NumFixed2(Math.min(maxH, Math.max(0, unitConver.px2Mm(HH + (endY - startY))))) + "mm"
                            }
                            break
                        case "report-detail-split":
                            area = that.ItReport.Page.Area.filter(item => (item.id === "report-detail"))[0]
                            if (area) {
                                maxH = unitConver.unit2Num(that.ItReport.Page.Height)
                                area.height = unitConver.NumFixed2(Math.min(maxH, Math.max(unitConver.px2Mm(30), unitConver.px2Mm(DH + (endY - startY))))) + "mm"
                            }
                            break
                        case "report-footer-split":
                            area = that.ItReport.Page.Area.filter(item => (item.id === "report-footer"))[0]
                            if (area) {
                                maxH = unitConver.unit2Num(that.ItReport.Page.Height) / 5
                                area.height = unitConver.NumFixed2(Math.min(maxH, Math.max(0, unitConver.px2Mm(FH + (endY - startY))))) + "mm"
                            }
                            break
                        case "report-freeform-split":
                            area = that.ItReport.Page.Area.filter(item => (item.id === "report-freeform"))[0]
                            if (area) {
                                area.height = unitConver.NumFixed2(Math.max(50, unitConver.px2Mm(FreeH + (endY - startY)))) + "mm"
                            }
                            break
                        case "page-margin-top":
                        case "page-margin-bottom":
                            obj.style.top = unitConver.NumFixed2(unitConver.px2Mm((Y + (endY - startY)))) + "mm"
                            break
                        case "page-margin-right":
                        case "page-margin-left":
                            obj.style.left = unitConver.NumFixed2(unitConver.px2Mm(X + (endX - startX))) + "mm"
                            break
                        case "resizable-top":
                            selected.style.top = unitConver.NumFixed2(unitConver.px2Mm(Math.max(0, (R.T + (endY - startY))))) + "mm"
                            selected.style.height = unitConver.NumFixed2(unitConver.px2Mm(R.H - (endY - startY) - 5)) + "mm"
                            break

                        case "resizable-bottom":
                            selected.style.height = unitConver.NumFixed2(unitConver.px2Mm(R.H + (endY - startY) - 5)) + "mm"
                            break
                        case "resizable-left":
                            selected.style.left = unitConver.NumFixed2(unitConver.px2Mm(Math.max(0, (R.L + (endX - startX))))) + "mm"
                            selected.style.width = unitConver.NumFixed2(unitConver.px2Mm(R.W - (endX - startX) - 5)) + "mm"
                            break
                        case "resizable-right":
                            selected.style.width = unitConver.NumFixed2(unitConver.px2Mm(R.W + (endX - startX) - 5)) + "mm"
                            break
                        case "resizable-top-left":
                            //top
                            selected.style.top = unitConver.NumFixed2(unitConver.px2Mm(Math.max(0, (R.T + (endY - startY))))) + "mm"
                            selected.style.height = unitConver.NumFixed2(unitConver.px2Mm(R.H - (endY - startY) - 5)) + "mm"
                            //left
                            selected.style.left = unitConver.NumFixed2(unitConver.px2Mm(Math.max(0, (R.L + (endX - startX))))) + "mm"
                            selected.style.width = unitConver.NumFixed2(unitConver.px2Mm(R.W - (endX - startX) - 5)) + "mm"
                            break
                        case "resizable-top-right":
                            //top
                            selected.style.top = unitConver.NumFixed2(unitConver.px2Mm(Math.max(0, (R.T + (endY - startY))))) + "mm"
                            selected.style.height = unitConver.NumFixed2(unitConver.px2Mm(R.H - (endY - startY) - 5)) + "mm"
                            //right
                            selected.style.width = unitConver.NumFixed2(unitConver.px2Mm(R.W + (endX - startX) - 5)) + "mm"
                            break
                        case "resizable-bottom-right":
                            selected.style.height = unitConver.NumFixed2(unitConver.px2Mm(R.H + (endY - startY) - 5)) + "mm"
                            selected.style.width = unitConver.NumFixed2(unitConver.px2Mm(R.W + (endX - startX) - 5)) + "mm"
                            break
                        case "resizable-bottom-left":
                            selected.style.height = unitConver.NumFixed2(unitConver.px2Mm(R.H + (endY - startY) - 5)) + "mm"
                            selected.style.width = unitConver.NumFixed2(unitConver.px2Mm(R.W - (endX - startX) - 5)) + "mm"
                            selected.style.left = unitConver.NumFixed2(unitConver.px2Mm(Math.max(0, (R.L + (endX - startX))))) + "mm"
                            break
                        case "resizable-line-right":
                            selected.style.width = unitConver.NumFixed2(unitConver.px2Mm(R.W + (endX - startX) - 5)) + "mm"
                            break
                        case "resizable-line-center":
                            if (selected.getAttribute("data-type") === "line") {
                                angle = unitConver.NumFixed2(Math.atan2(Y + (endY - startY), X + (endX - startX)) + startAngle)
                                selected.style.transform = "rotate(" + angle + "rad)"
                                that.ItReport.NodeItem[index].StyleValue.Transform = angle
                            }
                            break

                    }
                    return false
                }
                document.onmouseup = function () {
                    let pw = document.getElementById("report-page").offsetWidth
                    let ph = document.getElementById("report-page").offsetHeight
                    let lf = unitConver.unit2Num(obj.style.left)
                    let lt = unitConver.unit2Num(obj.style.top)
                    let index

                    switch (obj.id) {
                        case "page-margin-top":
                            obj.style.top = unitConver.NumFixed2(Math.min(unitConver.px2Mm(ph) / 5, Math.max(0, lt))) + 'mm'
                            that.ItReport.Page.TopMargin = obj.style.top
                            break
                        case "page-margin-left":
                            obj.style.left = unitConver.NumFixed2(Math.min(unitConver.px2Mm(pw) / 5, Math.max(0, lf))) + 'mm'
                            that.ItReport.Page.LeftMargin = obj.style.left
                            break
                        case "page-margin-right":
                            that.ItReport.Page.RightMargin = unitConver.NumFixed2(Math.min(unitConver.px2Mm(pw) / 5, Math.max(0, unitConver.px2Mm(pw) - lf))) + 'mm'
                            obj.style.left = ""
                            break
                        case "page-margin-bottom":
                            that.ItReport.Page.BottomMargin = unitConver.NumFixed2(Math.min(unitConver.px2Mm(ph) / 5, Math.max(0, unitConver.px2Mm(ph) - lt))) + 'mm'
                            obj.style.top = ""
                            break
                        case "report-freeform-split":
                            //修改页面高度尺寸
                            that.ItReport.Page.Height = that.ItReport.Page.Area.filter(item => item.Id = 'report-freeform')[0].height
                            break
                        case "resizable-top":
                        case "resizable-bottom":
                        case "resizable-left":
                        case "resizable-right":
                        case "resizable-line-right":
                        case "resizable-top-left":
                        case "resizable-top-right":
                        case "resizable-bottom-right":
                        case "resizable-bottom-left":
                            //元素
                            index = that.getNodeIndex(selected.id)
                            if (index >= 0) {
                                that.ItReport.NodeItem[index].StyleValue.Left = selected.style.left
                                that.ItReport.NodeItem[index].StyleValue.Top = selected.style.top
                                if (obj.id !== "resizable-line-right")
                                    that.ItReport.NodeItem[index].StyleValue.Height = selected.style.height
                                that.ItReport.NodeItem[index].StyleValue.Width = selected.style.width
                            }

                            break
                    }
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
                e.stopPropagation()
            },
            //键盘移动元素
            funMoveNode(code) {
                let that = this
                this.multipleNodes.filter(col => col.selected.tagName !== "TH").forEach(function (node) {
                    let nodeItem = that.ItReport.NodeItem.filter(item => (item.Id === node.nodeId))[0]
                    if (nodeItem) {
                        let step = unitConver.px2Mm(1) //1px
                        switch (code) {
                            case 37://右
                                node.selected.style.left = (unitConver.unit2Num(nodeItem.StyleValue.Left) - step) + "mm"
                                nodeItem.StyleValue.Left = node.selected.style.left
                                break
                            case 38://上
                                node.selected.style.top = (unitConver.unit2Num(nodeItem.StyleValue.Top) - step) + "mm"
                                nodeItem.StyleValue.Top = node.selected.style.top
                                break
                            case 39://左
                                node.selected.style.left = (unitConver.unit2Num(nodeItem.StyleValue.Left) + step) + "mm"
                                nodeItem.StyleValue.Left = node.selected.style.left
                                break
                            case 40://下
                                node.selected.style.top = (unitConver.unit2Num(nodeItem.StyleValue.Top) + step) + "mm"
                                nodeItem.StyleValue.Top = node.selected.style.top
                                break
                        }
                    }
                })

            },
            //键盘
            funKeyUp(e) {
                switch (e.keyCode) {
                    case 8:
                    case 46:
                        //删除
                        this.funRemoveNode()
                        break
                    case 16:
                        this.isMultiple = false
                        break
                    case 37:
                    case 38:
                    case 39:
                    case 40:
                        this.funMoveNode(e.keyCode)
                        break
                }
                if (e.preventDefault) {
                    e.preventDefault()//w3c浏览器
                } else {
                    e.returnValue = false//IE
                }
            },
            funKeyDown(e) {
                if (e.keyCode === 16) {
                    this.isMultiple = true
                }
                if (e.preventDefault) {
                    e.preventDefault()//w3c浏览器
                } else {
                    e.returnValue = false//IE
                }
            },
            //字体样式改变
            evtFontStyleChange(val) {
                let that = this
                this.multipleNodes.forEach(function (node) {
                    let item = null
                    item = that.ItReport.NodeItem.filter(item => item.Id === node.nodeId)[0]
                    if (item) {
                        item.StyleValue.FontWeight = "normal"
                        item.StyleValue.FontStyle = "normal"
                        item.StyleValue.TextDecoration = "none"
                        val.forEach(function (col) {
                            if (col === "加粗") item.StyleValue.FontWeight = "bold"
                            if (col === "斜体") item.StyleValue.FontStyle = "italic"
                            if (col === "下划线") item.StyleValue.TextDecoration = "underline"
                        })
                        //更新样式
                        node.selected.style.fontStyle = item.StyleValue.FontStyle
                        node.selected.style.fontWeight = item.StyleValue.FontWeight
                        node.selected.style.textDecoration = item.StyleValue.TextDecoration
                    }
                })

            },
            //取字体样式数据
            funGetFontStyle() {
                if (this.multipleNodes.length !== 1) return
                let node = this.multipleNodes[0]
                let item = null
                this.FontStyleSelect = []
                item = this.ItReport.NodeItem.filter(item => item.Id === node.nodeId)[0]
                if (item) {
                    if (item.StyleValue.FontWeight === "bold") //normal
                        this.FontStyleSelect.push("加粗")
                    if (item.StyleValue.FontStyle === "italic") //normal
                        this.FontStyleSelect.push("斜体")
                    if (item.StyleValue.TextDecoration === "underline")  //none
                        this.FontStyleSelect.push("下划线")
                }
            },
            //文本内容改变判断为空
            evtTextChange(val) {

                if (val.length === 0) {
                    let node = this.multipleNodes[0]
                    let item = this.ItReport.NodeItem.filter(item => item.Id === node.nodeId)[0]
                    if (item) {
                        item.Text = "空文本"
                    }

                }
            },
            //选择图片
            evtSelectImg(e, data) {
                let files = e.target.files[0]
                let fileSize = 0;
                let fileMaxSize = 2 * 1024 * 1024;//1M
                if (files) {
                    fileSize = files.size;
                    if (fileSize > fileMaxSize) {
                        this.$message.error("文件大小不能大于2M！")
                        files.value = "";
                        return false;
                    } else if (fileSize <= 0) {
                        this.$message.error("文件大小不能为0M！")
                        files.value = "";
                        return false;
                    }
                } else {
                    return false;
                }
                this.fileLoading = true
                let that = this
                //压缩转码base64
                lrz(files, {
                    quality: 0.7
                }).then(rst => {
                    //转码base64
                    let reader = new FileReader();
                    reader.readAsDataURL(rst.file)
                    reader.onload = e => {
                        data.Text = '<img style="width:100%;height:100%;" src="' + e.target.result + '"/>'
                        that.fileLoading = false
                    }
                }).catch(err => {
                    that.fileLoading = false
                    this.$message.error("文件压缩失败！" + err)
                })
            },
            //选择文件
            evtSelectFile() {
                let fl = document.getElementById("SelectImg")
                if (fl)
                    fl.click()
            },
            //页面尺寸
            funPageSize(val) {
                this.stylePageMargin = PageStyle.stylePageMargin(val)
                this.stylePageSize = PageStyle.styleDesignPageSize(val)
                let wd = unitConver.mm2Px(unitConver.unit2Num(val.Width))
                let hd = unitConver.mm2Px(unitConver.unit2Num(val.Height))
                this.styleRulerX = "width:" + wd + "px;"
                this.styleRulerY = "height:" + hd + "px;"
                this.xScale = []
                this.yScale = []
                for (let i = 0; i < wd; i += 1) {
                    if (i % 50 === 0) {
                        this.xScale.push({id: i})
                    }
                }
                for (let i = 0; i < hd; i += 1) {
                    if (i % 50 === 0) {
                        this.yScale.push({id: i})
                    }
                }
                let mg = PageStyle.stylePageMargins(val)
                this.stylePageMarginTop = mg.top
                this.stylePageMarginBottom = mg.bottom
                this.stylePageMarginLeft = mg.left
                this.stylePageMarginRight = mg.right
                val.Area.forEach(function (item) {
                    switch (item.id) {
                        case "report-header":
                            item.style = PageStyle.stylePageHeader(item)
                            break
                        case "report-freeform":
                            item.style = PageStyle.stylePageHeader(item)
                            break
                        case "report-summary":
                        case "report-detail":
                            item.style = "position:relative;overflow: hidden; height:" + item.height
                            break
                        case "report-footer":
                            item.style = PageStyle.stylePageFooter(item)
                            break
                    }
                })


            },
            //多选元素属性设置
            funMultipleSetting(type, value) {
                let that = this
                this.multipleNodes.forEach(function (node) {
                    let item = null
                    item = that.ItReport.NodeItem.filter(item => item.Id === node.nodeId)[0]
                    if (item) {
                        if (type === 'Border') {
                            that.funSelectBox(value, item.StyleValue)
                        } else {
                            item.StyleValue[type] = value
                        }
                    }
                })
                this.multipleTDs.forEach(function (TD) {
                    let table = null
                    let tableid = TD.tableid
                    let row = TD.index.split('-')[0]
                    let col = TD.index.split('-')[1]
                    table = that.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                    if (table) {
                        table.Tables.RowCol[row][col][type] = value
                    }
                })
                this.$forceUpdate()
            },
            //检索参数移动
            funMoveQueryParam(index, v) {
                if (v === "up") {
                    if (index !== 0) {
                        this.ItReport.QueryParam[index]
                            = this.ItReport.QueryParam.splice(index - 1, 1, this.ItReport.QueryParam[index])[0];
                    }
                }
                if (v === "down") {
                    if (index !== this.ItReport.QueryParam.length - 1) {
                        this.ItReport.QueryParam[index]
                            = this.ItReport.QueryParam.splice(index + 1, 1, this.ItReport.QueryParam[index])[0];
                    }
                }
            },
            //字段移动
            funMoveField(index, v) {
                if (v === "up") {
                    if (index !== 0) {
                        this.DataSource.SelectFields[index]
                            = this.DataSource.SelectFields.splice(index - 1, 1, this.DataSource.SelectFields[index])[0];
                    }
                }
                if (v === "down") {
                    if (index !== this.DataSource.SelectFields.length - 1) {
                        this.DataSource.SelectFields[index]
                            = this.DataSource.SelectFields.splice(index + 1, 1, this.DataSource.SelectFields[index])[0];
                    }
                }
            },
            //合并列
            funTableColSpan() {
                let cols = []
                let tableid = ""
                this.multipleTDs.forEach(function (item) {
                    tableid = item.tableid
                    cols.push(item.index)
                })
                cols.sort()
                let row = cols[0].split('-')[0]
                let col = cols[0].split('-')[1]
                let table = this.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                if (table) {

                    cols.forEach(function (item) {
                        if (table.Tables.RowCol[row][col].Colspan.indexOf(item) < 0) {
                            table.Tables.RowCol[row][col].Colspan.push(item)
                        }
                    })
                    this.$set(table.Tables.RowCol[row][col], "Span", "0")
                    //其他列
                    for (let i = 1; i < cols.length; i++) {
                        col = cols[i].split('-')[1]
                        this.$set(table.Tables.RowCol[row][col], "Span", cols[0])
                    }

                }
                this.clearSelected()
            },
            //合并列取消
            funTableColSpanDel() {
                let index = this.multipleTDs[0].index
                let tableid = this.multipleTDs[0].tableid
                let table = this.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                if (table) {
                    let row = index.split('-')[0]
                    let col = index.split('-')[1]
                    let span = table.Tables.RowCol[row][col].Colspan
                    table.Tables.RowCol[row][col].Span = "0"
                    //其他列
                    for (let i = 1; i < span.length; i++) {
                        col = span[i].split('-')[1]
                        table.Tables.RowCol[row][col].Span = "0"
                    }
                    col = index.split('-')[1]
                    table.Tables.RowCol[row][col].Colspan = []
                }

                this.clearSelected()
            },
            //合并行
            funTableRowSpan() {
                let cols = []
                let tableid = ""
                this.multipleTDs.forEach(function (item) {
                    tableid = item.tableid
                    cols.push(item.index)
                })
                cols.sort()
                let row = cols[0].split('-')[0]
                let col = cols[0].split('-')[1]
                let table = this.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                if (table) {
                    cols.forEach(function (item) {
                        if (table.Tables.RowCol[row][col].Rowspan.indexOf(item) < 0) {
                            table.Tables.RowCol[row][col].Rowspan.push(item)
                        }
                    })
                    table.Tables.RowCol[row][col].Span = "0"
                    //其他行
                    for (let i = 1; i < cols.length; i++) {
                        row = cols[i].split('-')[0]
                        table.Tables.RowCol[row][col].Span = cols[0]
                    }
                }
                this.clearSelected()
            },
            //合并行取消
            funTableRowSpanDel() {
                let index = this.multipleTDs[0].index
                let tableid = this.multipleTDs[0].tableid
                let table = this.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                if (table) {
                    let row = index.split('-')[0]
                    let col = index.split('-')[1]
                    let span = table.Tables.RowCol[row][col].Rowspan
                    table.Tables.RowCol[row][col].Span = "0"
                    //其他行
                    for (let i = 1; i < span.length; i++) {
                        row = span[i].split('-')[0]
                        table.Tables.RowCol[row][col].Span = "0"
                    }
                    row = index.split('-')[0]
                    table.Tables.RowCol[row][col].Rowspan = []
                }
                this.clearSelected()
            },
            //插入列
            funTableAddCol() {
                if (this.multipleTDs.length === 0) return false
                let index = this.multipleTDs[0].index
                let tableid = this.multipleTDs[0].tableid
                let table = this.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                if (table) {
                    let colindex = index.split('-')[1]
                    let col = {
                        Type: 'text', Text: '', Value: '', Data: 'text', Padding: '1', Height: '10',
                        FontSize: defaultFontSize, FontFamily: defaultFontFamily,
                        Span: '0', Colspan: [], Rowspan: []
                    }
                    //插入groupcol
                    table.Tables.ColGroup.splice(colindex, 0, "20")
                    table.Tables.RowCol.forEach(function (row) {
                        row.splice(colindex, 0, col)
                    })
                    this.$forceUpdate()
                }
            },
            //删除列
            funTableDelCol() {
                if (this.multipleTDs.length === 0) return false
                let index = this.multipleTDs[0].index
                let tableid = this.multipleTDs[0].tableid
                let table = this.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                if (table) {
                    let colindex = index.split('-')[1]
                    //最后一列不能删除
                    if (table.Tables.ColGroup.length === 1) return false
                    table.Tables.ColGroup.splice(colindex, 1)
                    table.Tables.RowCol.forEach(function (row) {
                        row.splice(colindex, 1)
                    })
                    this.clearSelected()
                    this.$forceUpdate()
                }
            },
            //插入行
            funTableAddRow() {
                if (this.multipleTDs.length === 0) return false
                let index = this.multipleTDs[0].index
                let tableid = this.multipleTDs[0].tableid
                let table = this.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                if (table) {
                    let rowindex = index.split('-')[0]
                    let row = []
                    for (let i = 0; i < table.Tables.ColGroup.length; i++) {
                        let col = {
                            Type: 'text', Text: '', Value: '', Data: 'text', Padding: '1', Height: '10',
                            FontSize: defaultFontSize, FontFamily: defaultFontFamily,
                            Span: '0', Colspan: [], Rowspan: []
                        }
                        row.push(col)
                    }
                    table.Tables.RowCol.splice(rowindex, 0, row)
                    this.$forceUpdate()
                }
            },
            //删除行
            funTableDelRow() {
                if (this.multipleTDs.length === 0) return false
                let index = this.multipleTDs[0].index
                let tableid = this.multipleTDs[0].tableid
                let table = this.ItReport.NodeItem.filter(item => item.Id === tableid)[0]
                if (table) {
                    let rowindex = index.split('-')[0]
                    //最后一行不能删除
                    if (table.Tables.RowCol.length === 1) return false
                    table.Tables.RowCol.splice(rowindex, 1)
                    this.clearSelected()
                    this.$forceUpdate()
                }
            },
            //获取数据集合字段
            funSelectFieldList(id) {
                if (id) {
                    let dataset = this.ItReport.DataSet.filter(dataset => dataset.Id = id)[0]
                    if (dataset) {
                        return dataset.SelectFields
                    } else {
                        return []
                    }
                } else {
                    return []
                }
            },
            //单元格绑定字段
            funTableFieldChange(val, id, dataset, index) {
                let text = ""
                if (val.length === 0) {
                    text = ""
                } else {
                    let f = this.ItReport.DataSet.filter(dataset => dataset.Id = dataset)[0]
                    if (f) {
                        let field = f.SelectFields.filter(item => item.Name === val)[0]
                        if (field) {
                            text = "[" + field.Comment + "]"
                        } else {
                            text = "[" + val + "]"
                        }
                    } else {
                        text = "[" + val + "]"
                    }
                }
                let table = this.ItReport.NodeItem.filter(item => item.Id === id)[0]
                if (table) {
                    this.$set(table.Tables.RowCol[index.split('-')[0]][index.split('-')[1]], "Text", text)
                }
            },
            funStyleTD(val) {
                return PageStyle.styleTD(val)
            },
            funFieldTypeChange(val, query) {
                if (val === 'date') {
                    query.InputType = '2'
                } else {
                    query.InputType = '1'
                }
            },
            funGetDataSetFields(col) {
                let dataset = this.ItReport.DataSet.filter(item => item.Id = col.DataSetValue)[0]
                if (dataset) {
                    return dataset.SelectFields.filter(item => item.DataType !== 'ComputeField')
                } else {
                    return []
                }
            },
            funChangeChartOption(val, nodeid, option) {
                this.ChartId = nodeid
                let arr = Object.keys(option);
                if (arr.length > 0) {
                    this.ChartOption = JSON.parse(JSON.stringify(option))
                } else {
                    this.ChartOption = {}
                }
                this.dialogChartOption = true
            },
            funViewReportJson() {
                this.ItReportJson = JSON.parse(JSON.stringify(this.ItReport))
                this.dialogItReportJson = true
            },
            funSaveChartOption() {
                let node = this.ItReport.NodeItem.filter(item => item.Id === this.ChartId)[0]
                if (node) {
                    try {
                        node.ChartOption = JSON.parse(this.$refs.jsonEditor.getValue())
                        this.dialogChartOption = false
                    } catch (e) {
                        this.$message.error("数据格式错误，请检查")
                    }
                } else {
                    this.dialogChartOption = false
                }


            },
            funSelectChartTemplate(val) {
                this.ChartOption = val
            },

        },
        mounted() {
            let resizeNodes = document.getElementsByClassName("resize")
            for (let i = 0; i < resizeNodes.length; i++) {
                resizeNodes[i].addEventListener("mousedown", this.funResizeNode, true)
            }
        },

        beforeDestroy: function () {
            let resizeNodes = document.getElementsByClassName("resize")
            for (let i = 0; i < resizeNodes.length; i++) {
                resizeNodes[i].removeEventListener("mousedown", this.funResizeNode, true)
            }
        },
        watch: {
            //报表数据
            'ReportData': {
                handler: function () {
                    this.ReportChangeCount++
                },
                deep: true
            },
            'ItReport': {
                handler: function () {
                    this.ReportChangeCount++
                },
                deep: true
            },
            //页面设置
            'ItReport.Page': {
                handler: function (val) {
                    this.funPageSize(val)
                },
                deep: true
            },
            //元素
            'ItReport.NodeItem': {
                handler: function (newValue) {
                    for (let i = 0; i < newValue.length; i++) {
                        newValue[i].Style = PageStyle.styleNode(newValue[i].StyleValue)
                    }
                },
                deep: true
            },
            //复选元素
            multipleNodes: {
                handler: function (val) {
                    this.BoxValue = null
                    if (val.length <= 1) {
                        this.alignLeft = false
                        this.alignTop = false
                        this.MultipleText = false
                    } else {
                        this.alignLeft = true
                        this.alignTop = true
                        this.selectColumn = false
                        //判断是否跨区选择
                        let areaCount = 1
                        let oldarea = null
                        let that = this
                        val.forEach(function (v) {
                            if (v.selected.getAttribute("data-type") === "text" ||
                                v.selected.getAttribute("data-type") === "db" ||
                                v.selected.getAttribute("data-type") === "fx") {
                                that.MultipleText = true
                            }
                            if (oldarea) {
                                if (oldarea !== v.parentId) {
                                    areaCount++
                                    oldarea = v.parentId
                                }
                            } else {
                                oldarea = v.parentId
                            }
                        });
                        if (areaCount > 1) {
                            this.alignTop = false
                        }
                    }
                },
            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id
            this.funGetReport(id)
        },
    }
</script>
<style lang="scss" scoped>
    .new-report {
        background-color: #ffffff;
        width: 100%;
        float: left;
        border-top: 1px solid #ddd;

        .warp {
            margin: 40px 0 0 40px;

            .box {
                float: left;
                width: 230px;
                height: 200px;
                background-color: #f7f7f7;
                padding: 20px;
                margin-right: 30px;

                &:hover {
                    box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);

                    .button {
                        display: block;
                    }

                    .comment {
                        color: #555555;
                    }
                }

                .title {
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 35px;

                    span {
                        padding: 0 6px;
                    }

                    i {
                        font-size: 12px;
                        color: #999999;
                        font-weight: normal;
                    }
                }

                .comment {
                    font-size: 12px;
                    color: #888888;
                }

                .button {
                    display: none;
                    text-align: center;
                    margin-top: 30px;
                }

            }
        }
    }

    .itr-report {
        height: 100%;
        position: relative;
    }

    .toolbar-wap {
        height: 45px;
        background-color: #f7f7f7;
        overflow: hidden;
        z-index: 5;

        .msg {
            float: left;
            font-size: 13px;
            color: #666666;
            padding: 0 10px;
            line-height: 45px;
        }
    }

    .main-warp {
        padding: 0;
        background-color: #f1f1f1;
        overflow: auto;
        position: relative;
        border: 1px solid #ddd !important;

        .page {
            margin: 16px;
            position: relative;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);
            cursor: default;

        }

        .ruler-x {
            position: absolute;
            top: 0;
            background-color: #f7f7f7;
            z-index: 2;
            left: 16px;
            height: 16px;
            width: 100%;

            .n {
                position: absolute;
                font: 9pt/1 Arial, sans-serif;
                color: #555;
                top: 1px;
                word-wrap: break-word;
                transform: scale(0.75);
            }

            .line {
                position: absolute;
                height: 100vh;
                top: 0px;
                padding-left: 5px;
                border-left-width: 1px;
                border-left-style: solid;
                border-left-color: rgb(235, 86, 72);
                cursor: ew-resize;

                .value {
                    font: 9pt/1 Arial, sans-serif;
                    color: rgb(235, 86, 72);
                    pointer-events: none;
                    transform: scale(0.83);
                    background-color: #f7f7f7;
                }

                .action {
                    position: relative;
                    font: 9pt/1 Arial, sans-serif;
                    color: #333;

                    i {
                        position: absolute;
                        background-color: #EBEEF5;
                        top: 17px;
                        left: -20px;
                        padding: 1px;
                        cursor: pointer;
                    }

                    span {
                        position: absolute;
                        background-color: #EBEEF5;
                        top: 16px;
                        left: -5px;
                        padding: 2px;
                        cursor: default;
                    }
                }
            }

            .base {
                display: none;
                cursor: default;
                pointer-events: none;
            }

        }

        .ruler-x-bg {
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAMAAAAuTX21AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACNJREFUeNpiYCAdMDKRCka1jGoBA2JZZGshiaCXFpIBQIABAAplBkCmQpujAAAAAElFTkSuQmCC) bottom left repeat-x; /*./image/ruler_h.png*/
            left: 16px;
            height: 16px;
            width: 100%;
            opacity: 0.1;
        }

        .ruler-y {
            position: absolute;
            top: 16px;
            left: 0;
            width: 16px;
            background-color: #f7f7f7;
            height: 100%;
            z-index: 2;

            .n {
                position: absolute;
                font: 9pt/1 Arial, sans-serif;
                color: #555;
                width: 8px;
                left: 3px;
                word-wrap: break-word;
                overflow: hidden;
                transform: scale(0.75);
            }

            .line {
                position: absolute;
                width: 100vw;
                left: 0px;
                padding-top: 5px;
                border-top-width: 1px;
                border-top-style: solid;
                border-top-color: rgb(235, 86, 72);
                cursor: ns-resize;

                .value {
                    font: 9pt/1 Arial, sans-serif;
                    color: rgb(235, 86, 72);
                    pointer-events: none;
                    transform: scale(0.83);
                    background-color: #f7f7f7;
                }
            }

            .base {
                pointer-events: none;
                display: none;
                cursor: default;
            }

            .action {
                position: relative;
                font: 9pt/1 Arial, sans-serif;
                color: #333;

                i {
                    position: absolute;
                    background-color: #EBEEF5;
                    top: -20px;
                    left: 17px;
                    padding: 1px;
                    cursor: pointer;
                }

                span {
                    position: absolute;
                    background-color: #EBEEF5;
                    top: -4px;
                    left: 17px;
                    padding: 2px;
                }
            }


        }

        .ruler-y-bg {
            width: 16px;
            height: 100%;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAMAAABmvHtTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACBJREFUeNpiYGBEBwwMTGiAakI0NX7U9aOuHyGuBwgwAH6bBkAR6jkzAAAAAElFTkSuQmCC) top right repeat-y; /*./image/ruler_v.png*/
            opacity: 0.1;
        }

        .ruler-empty {
            position: absolute;
            top: 0;
            left: 0px;
            width: 16px;
            height: 16px;
            background-color: #ffffff;
            z-index: 3
        }

        .ruler-empty.on {
            background-color: rgb(235, 86, 72);
            cursor: pointer;
        }
    }

    .left-aside {
        width: 240px !important;
        background-color: #f7f7f7;
        z-index: 5;
        border-top: 1px solid #ddd !important;

        .tool-button {
            font-size: 20px !important;
        }

        .nav1 {
            position: relative;
            float: left;
            width: 47px;
            height: 100%;
            border-right: 1px solid #ddd !important;
        }

        .nav2 {
            /*float: right;*/
            height: 100%;
            /*width: 192px;*/
            background-color: #ffffff;
            font-size: 12px;
            overflow: auto;

        }

        .datasource-setting {
            margin-left: 67px;
            font-size: 12px;

            &:hover {
                color: #409EFF;
            }
        }

        .queryparam-setting {
            margin-left: 67px;
            font-size: 12px;
            font-weight: bold;

            &:hover {
                color: #409EFF;
            }
        }

        .data2 {
            padding: 2px 0px;
            float: left;
            height: 28px;
            line-height: 28px;
            width: 162px;
            font-size: 12px;
            margin-left: 10px;
            cursor: default;

            span {
                float: left;
            }

            .edit {
                cursor: pointer;

                &:hover {
                    font-weight: bold;
                    color: #409EFF !important;
                }
            }

            .i-tree {
                float: left;
                cursor: pointer;
                font-size: 14px;
                line-height: 28px;
                margin-right: 3px;
                color: #888888;

                &:hover {
                    color: #333333 !important;
                }
            }

            .i-del {
                float: right;
                font-size: 13px;
                line-height: 25px;
                margin-right: 5px;
                cursor: pointer;
                color: #cccccc;

                &:hover {
                    font-weight: bold;
                    color: #F56C6C !important;
                }
            }


            &:hover {
                i {
                    color: #666666;
                }
            }

            svg {
                margin-top: 7px;
                float: left;
                font-size: 14px;
            }


        }

        .field-item {
            width: 162px;
            font-size: 12px;
            height: 28px;
            line-height: 28px;
            position: relative;
            float: left;
            margin-left: 7px;

            .comment {
                float: left;
                margin-left: 23px;
                padding: 0px 5px;
                border-radius: 4px;
                cursor: move;

                .add-query {
                    font-size: 14px;
                    color: transparent;
                    margin-left: 5px;

                }

                &:hover {
                    background-color: #409eff;
                    color: #ffffff;

                    .add-query {
                        color: #ffffff;
                        cursor: pointer !important;
                        border: 1px solid #f7f7f7 !important;
                        padding: 1px 2px;
                    }

                }
            }


        }

        .data3 {
            padding: 2px 10px;
            float: left;
            height: 25px;
            line-height: 25px;
            width: 162px;
            cursor: move;

            .i-setting, .i-up, .i-down {
                float: right;
                font-size: 13px;
                line-height: 25px;
                margin-right: 5px;
                cursor: pointer;
                color: #cccccc;

                &:hover {
                    font-weight: bold;
                    color: #409EFF !important;
                }
            }

            .i-del {
                float: right;
                font-size: 13px;
                line-height: 25px;
                margin-right: 5px;
                cursor: pointer;
                color: #cccccc;

                &:hover {
                    font-weight: bold;
                    color: #F56C6C !important;
                }
            }

            &:hover {
                background-color: #f1f1f1;

                .i-setting, .i-del {
                    color: #606266
                }
            }

            svg {
                font-size: 14px;
            }
        }

        .add-dataset {
            float: left;
            padding: 5px 0 5px 10px;
            height: 25px;
            line-height: 25px;
            width: 80px;
            cursor: pointer;
            margin-left: 3px;

            span {
                margin-left: 2px;
            }

            &:hover {
                color: #409eff;
            }
        }

        .nav-node-list {
            width: 172px;

            .title {
                padding: 5px 10px;
                font-weight: bold;

                i {
                    padding-right: 3px;
                    font-size: 14px;
                }
            }

            .warp {
                .item {
                    width: 162px;
                    font-size: 12px;
                    height: 28px;
                    line-height: 28px;
                    position: relative;
                    float: left;
                    margin-left: 7px;

                    .icon {
                        float: left;
                        margin-left: 21px;
                        font-size: 13px;
                    }

                    .comment {
                        float: left;
                        margin-left: 2px;
                        padding: 0px 4px;
                        border-radius: 4px;
                        cursor: pointer;
                        overflow: hidden;
                        max-width: 100px;
                        max-height: 26px;
                        line-height: 26px;

                        &:hover {
                            background-color: #409eff;
                            color: #ffffff;
                        }
                    }

                    .comment-selected {
                        background-color: #409eff;
                        color: #ffffff;
                    }
                }
            }

        }
    }

    .line-warp {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 18px;
        height: 100%;
        padding-left: 9px;

        .line1 {
            display: block;
            width: 9px;
            height: 15px;
            border-bottom: 1px dashed #d8d8d8;
            border-left: 1px dashed #d8d8d8;
        }

        .line2 {
            display: block;
            width: 9px;
            height: calc(100% - 15px);
            border-left: 1px dashed #d8d8d8;
        }
    }

    .left-aside.close {
        width: 45px !important;
    }

    .right-aside {
        width: 245px !important;
        background-color: #f7f7f7;
        border-top: 1px solid #ddd !important;
        border-bottom: 1px solid #ddd !important;
        font-size: 13px;

        .setting-header {
            height: 35px !important;
            padding: 0 10px !important;
            border-bottom: 1px solid #ddd;
            background-color: #eeeeee;

            .title {
                float: left;
                color: #666;
                font-size: 13px;
                height: 35px;
                line-height: 35px;
                text-align: center;
                padding: 0 10px;
                cursor: pointer;
                margin-right: 20px;
            }

            .on {
                height: 33px;
                line-height: 33px;
                font-weight: bold;
                border-bottom: 2px solid #666666;
            }
        }

        .setting-warp {
            font-size: 12px;
            margin-bottom: 15px;

            .title {
                float: left;
                font-weight: bold;
                width: 100%;
                padding: 10px 0 5px 0;

            }

            .line {
                float: left;
                border-top: 1px solid #ddd;
                width: 100%;
                margin-top: 10px;
            }

            .setting-item {
                float: left;
                height: 36px;
                line-height: 36px;
                width: 100%;

                .label {
                    width: 55px;
                    float: left;
                    text-align: left;
                    margin-right: 5px;
                }

                .input {
                    width: 150px;
                    float: right;
                }


            }

            .setting-item-list {
                float: left;
                background: #ffffff;
                border: 1px solid #ddd;
                margin-top: 5px;
                width: 100%;

                .list {
                    height: 30px;
                    line-height: 30px;
                    float: left;
                    width: 100%;
                    border-bottom: 1px solid #ddd;
                }

                .item {
                    height: 35px;
                    line-height: 35px;
                    float: left;
                    width: 100%;
                    padding: 0 3px;
                    margin-bottom: 5px;


                }
            }
        }

        .datalistwarp {
            float: left;
            margin-top: 10px;
            border: 1px solid #d3d4d6;

            .cell-add-btn {
                font-weight: bold;
                cursor: pointer;
            }

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
        }
    }

    .report-header,
    .report-footer,
    .report-detail {
        position: relative;
    }

    .page-margin {
        position: absolute;
    }

    .split-area, .split-area-sum {
        width: 100%;
        height: 16px;
        background-color: #eeeeee;
        border-top: 1px solid #ffffff;

        span {
            font: 9pt/.8 Arial, sans-serif;
            color: #888888;
            transform: scale(0.75);
            padding: 0 10px;
        }

        em {
            font: 9pt/1 Arial, sans-serif;
            color: #888888;
            transform: scale(0.95);
            padding: 2px 20px;
            float: right;
        }
    }

    .split-area {
        cursor: row-resize;

        &:hover {
            background-color: #298df8;

            span, em {
                color: #ffffff;
            }
        }
    }

    .tool-line {
        height: 22px;
        line-height: 31px;
        float: right;
        width: 1px;
        border-right: 1px solid #d3d4d6;
        margin-top: 12px;
        margin-right: 5px;
        margin-left: 5px;
    }

    .toolbar-title {
        float: left;
        line-height: 45px;
        width: 200px;
        padding: 0 10px;
        overflow: hidden;
        font-size: 13px;
        font-weight: bold;

        span {
            margin-left: 3px;
        }

        em {
            font-size: 12px;
            margin-left: 3px;
            color: #999999;
        }
    }

    .resize {
        &:hover {
            background-color: #298df8;

            span, em {
                color: #ffffff;
            }
        }
    }

    .resize.l {
        cursor: col-resize;
    }

    .resize.t {
        cursor: row-resize;
    }

    .itrtable-body-table {
        th {
            &:hover {
                background-color: #dddddd;
            }

            .selected {
                background-color: #298df8;
            }
        }
    }

    .border-line {
        float: right;
        border-color: #000000;
        width: 40px;
        margin-top: 13px;
    }

    .h30 {
        height: 30px !important;
        line-height: 30px !important;
    }

    .lh42 {
        line-height: 42px !important;
    }

    .datasource-warp {
        height: 546px;
        background-color: #f7f7f7;

        .left {
            float: left;
            width: 294px;
            height: 500px;
            border-right: 1px solid #ddd;
            border-top: 1px solid #ddd;
            background-color: #ffffff;
            overflow: hidden;
        }

        .right {
            float: right;
            width: 294px;
            height: 500px;
            border-left: 1px solid #ddd;
            border-top: 1px solid #ddd;
            background-color: #ffffff;
            overflow: hidden;

        }

        .title {
            background-color: #f1f1f1;
            width: 100%;
            height: 35px;
            line-height: 35px;
            font-weight: bold;
            text-align: center;
            font-size: 12px;
            color: #666666;
            border-bottom: 1px solid #ddd;
        }

        .warp {
            height: 460px;
            overflow-y: auto;
            overflow-x: hidden;
            width: 294px;

            .comments-msg {
                font-size: 12px;
                color: #999999;
                line-height: 20px;
                border-bottom: 1px solid #ddd;
                text-align: center;
            }

            .item {
                position: relative;
                border-bottom: 1px solid #ddd;
                float: left;
                width: 274px;
                cursor: default;
                padding: 2px 10px;

                &:hover {
                    background-color: #f1f1f1;
                }

                .comment {
                    float: left;
                    width: 224px;
                    padding: 2px 25px 0;
                    color: #666666;
                    font-size: 13px;
                }

                .name, .type {
                    float: left;
                    font-size: 12px;
                    color: #999999;
                }

                .name {
                    width: 100px;
                    padding: 1px 25px 0;
                }

                .check, i {
                    position: absolute;
                }

                .check {
                    top: 10px;
                    left: 10px;
                }

                i {
                    color: #999999;
                    cursor: pointer;

                    &:hover {
                        color: #409EFF;
                        font-size: 16px;
                        font-weight: bold;
                    }
                }

                .i-add, .i-del {
                    top: 13px;
                    right: 20px;
                }

                .i-query {
                    top: 13px;
                    right: 50px;
                }

                .i-up {
                    top: 3px;
                    right: 125px;
                }

                .i-down {
                    top: 3px;
                    right: 100px;
                }

                .query {
                    position: absolute;
                    top: 6px;
                    right: 40px;
                    width: 120px;
                }
            }

        }
    }

    .chartoption-warp {
        height: 445px;
        width: 100%;
        overflow: auto;
    }
</style>
<style lang="scss">
    .page-viewer {
        .ele {
            cursor: move;
        }

        .ele:not(.line):hover {
            border: 1px solid #298df8;
            border-color: #298df8 !important;
        }

        .ele.line:hover {
            border-top: 1px solid #298df8 !important;
            border-color: #298df8 !important;
        }

        .selected:not(.line) {
            border: 1px solid #298df8;
            border-color: #298df8 !important;
        }

        .ele.table.td-selected {
            border-color: #cccccc !important;
        }

        .resizable {
            position: absolute;
            border-radius: 50%;
            border: 1px solid #298df8;
            background-color: #ffffff;
            width: 4px;
            height: 4px;
            z-index: 9;

            &:hover {
                background-color: #298df8;
            }
        }

        .resizable.ll {
            cursor: col-resize;
        }

        .resizable.t {
            top: -3px;
            left: calc(50% - 3px);
            cursor: n-resize;
        }

        .resizable.r {
            top: calc(50% - 3px);
            right: -3px;
            cursor: e-resize;
        }

        .resizable.b {
            bottom: -3px;
            left: calc(50% - 3px);
            cursor: s-resize;
        }

        .resizable.l {
            top: calc(50% - 3px);
            left: -3px;
            cursor: w-resize;
        }

        .resizable.tl {
            top: -2px;
            left: -2px;
            cursor: nw-resize;
        }

        .resizable.tr {
            top: -3px;
            right: -3px;
            cursor: ne-resize;
        }

        .resizable.bl {
            bottom: -3px;
            left: -3px;
            cursor: sw-resize;
        }

        .resizable.br {
            bottom: -3px;
            right: -3px;
            cursor: se-resize;
        }

        .resizable.rt {
            top: -3px;
            right: -3px;
            cursor: e-resize;
        }

        .resizable.ct {
            top: -3px;
            left: calc(50% - 3px);
            cursor: se-resize;
        }

        .resizable.lt {
            top: -3px;
            left: -3px;
            background-color: #298df8;
        }

        th {
            position: relative;
        }
    }

    .setting-item {
        .input {
            .el-input--mini .el-input__inner {
                border-radius: 0 !important;
            }

            .el-checkbox-button--mini .el-checkbox-button__inner,
            .el-radio-button--mini .el-radio-button__inner {
                padding: 5px 10px !important;
                font-size: 11px !important;
            }
        }
    }

    .left-aside {
        .tool-button {
            font-size: 20px !important;
            margin-top: 10px;
            margin-bottom: 10px;
        }
    }


    .nav2 {
        .el-collapse-item__header {
            background-color: #f7f7f7 !important;
            height: 30px !important;
            line-height: 30px !important;
            color: #666666 !important;
            font-size: 13px;
            font-weight: normal !important;
            padding-left: 10px;
            border-bottom: 1px solid #d8d8d8 !important;

        }

        .el-collapse-item__content {
            font-size: 12px !important;
            float: left;
            height: 100%;
            padding-bottom: 5px;
        }
    }

    .report-dataset {
        padding: 7px;
        overflow: auto;

        .el-popover__title {
            padding-left: 1px;
            line-height: 25px;
            color: #666666;
            margin-bottom: 0 !important;
            font-weight: bold;
            font-size: 14px !important;

        }
    }

    .data1 {
        padding: 2px 0px;
        float: left;
        height: 28px;
        line-height: 28px;
        width: 100%;
        font-weight: bold;
        font-size: 12px;
        border-bottom: 1px solid #d8d8d8;

        i {
            float: left;
            font-size: 13px;
            line-height: 25px;
            margin-right: 10px;
            cursor: pointer;
            color: #cccccc;

            &:hover {
                font-weight: bold;
                color: #409eff !important;
            }
        }

        &:hover {
            background-color: #f1f1f1;

            i {
                color: #666666;
            }
        }

        svg {
            font-size: 14px;
            margin-right: 5px;
        }
    }
</style>

