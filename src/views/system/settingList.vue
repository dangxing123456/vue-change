<template>
    <div style="height: 100%; ">
        <!--工作区-->
        <el-container ref="listWarp" style="height: 100%;background-color:#fff;">
            <el-header class="toolbar-wap" style="height:45px;border-bottom:0px;">
                <span style="line-height:45px; font-size:16px; float:left; margin-left:10px; font-weight:bold;">系统参数配置</span>
                <tool-button text="保存设置" icon="itr_save" style="float: left;margin-left:30%;"
                             :disabled="!isChange"
                             type="primary"
                             v-show="!Loading"
                             @buttonClick="toolButtonClick"/>
                <toolsearch style="float: right;" placeholder="按名称/描述检索"
                            @buttonClick="funSearch"></toolsearch>
            </el-header>
            <el-main style="padding:0 20px;" v-loading="Loading">
                <div v-for="g in settingGroup" :key="g" class="mainwarp">
                    <span class="group-title"><i class="el-icon-s-operation"></i>{{g}}</span>
                    <div class="setting-item"
                         :key="index"
                         v-for="(setting ,index) in settingList.filter(item=>item.sgroup===g)"
                         v-show="setting.isShow"
                        :style="'width:'+setting.width">
                         <span class="title">{{setting.name}}</span>
                         <div class="input">
                             <el-switch v-if="setting.type==='check'"
                                        @change="(val)=>funChange(setting)"
                                        active-value="1"
                                        inactive-value="0"
                                        active-text="开启"
                                        inactive-text="关闭"
                                     v-model="setting.value"></el-switch>
                             <el-input-number v-if="setting.type==='number' && !setting.MinMax"
                                              size="small"
                                              @change="(val)=>funChange(setting)"
                                              v-model="setting.value" >
                             </el-input-number>
                             <el-input-number v-if="setting.type==='number' && setting.MinMax"
                                              size="small"
                                              :max="Number(setting.Max)"
                                              :min="Number(setting.Min)"
                                              @change="(val)=>funChange(setting)"
                                              v-model="setting.value" >
                             </el-input-number>
                             <el-select  v-if="setting.type==='item'"
                                         size="small"
                                         @change="(val)=>funChange(setting)"
                                         style="width:160px;"
                                         v-model="setting.value" >
                                 <el-option
                                         v-for="item in setting.dataitem.split(',')"
                                         :key="item"
                                         :label="item"
                                         :value="item">
                                 </el-option>
                             </el-select>
                             <el-input  v-if="setting.type==='string'"
                                        maxlength="50"
                                        size="small"
                                        style="width:160px;"
                                        @change="(val)=>funChange(setting)"
                                        v-model="setting.value" >
                             </el-input>

                         </div>
                        <div class="edit" :style="setting.width==='100%'?'float:right':'float:left;margin-left:10px;'">
                            <i class="el-icon-user" :style="setting.edituser==='*'?'color:#F56C6C':''"></i>
                            {{setting.edituser}}{{setting.edittime}}【{{setting.code}}】</div>
                         <span class="msg" >{{setting.comment}}</span>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import toolButton from "@/itsoftUI/components/toolbar/toolbutton"
    import toolsearch from "@/itsoftUI/components/toolbar/toolsearch";
    import {List, Edit} from "@/api/system/setting";
    export default {
        name: "settingList",
        components: {toolButton, toolsearch},
        data() {
            return {
                isChange: false,
                settingList: [],
                settingGroup:[],
                searchValue: "",
                schoolCode: this.$itsoftUI.config.schoolCode,
                Loading:false
            }
        },
        methods: {
            toolButtonClick(text) {
                switch (text) {
                    case "保存设置":
                        this.funSaveData()
                        break
                }
            },
            funSearch(val) {
                this.searchValue=val
                this.funLoadData()
            },
            funLoadData() {
                this.Loading = true
                List(this.schoolCode, this.searchValue).then((res) => {
                    this.settingList = res.data
                    this.settingGroup=this.groupArr(this.settingList,"sgroup")
                    this.Loading = false
                    //分析数据
                    let that=this
                    this.settingList.forEach(function (item) {
                        //是否显示
                        let show=false
                        let showcode= item.showcode
                        let showvalue= item.showvalue
                        if (!showcode || showcode.length===0 ||
                            !showvalue || showvalue.length===0) {
                            show=true
                        }else {
                            that.settingList.filter(s=>s.code===showcode).forEach(function (sf) {
                                if (sf.value===showvalue) {
                                    show=true
                                }
                            })
                        }
                        that.$set(item,"isShow",show)
                        //最小/大值
                        if (item.type==="number"){
                            if (item.dataitem && item.dataitem.split(",").length>0 ){
                                let min=item.dataitem.split(",")[0]
                                let max=item.dataitem.split(",")[1]
                                if (parseFloat(min).toString() === "NaN" ||
                                    parseFloat(max).toString() === "NaN"){
                                    that.$set(item,"MinMax",false)
                                }else{
                                    that.$set(item,"MinMax",true)
                                    that.$set(item,"Min",min)
                                    that.$set(item,"Max",max)
                                }
                            }else{
                                that.$set(item,"MinMax",false)
                            }
                        }
                    })
                }).catch(() => {
                    setTimeout(() => {
                        this.Loading = false
                    }, 300);
                });
            },
            groupArr(list, field) {
                let att = [];
                for (let i = 0; i < list.length; i++) {
                    if (att.indexOf(list[i][field])<0)
                        att.push(list[i][field])
                }
                return att;
            },
            funChange(setting){
                setting.edituser="*"
                this.isChange=true
                let value=setting.value
                let that=this
                this.settingList.filter(c=>c.showcode===setting.code).forEach(function (item) {
                    let show=false
                     if (item.showvalue===value){
                         show=true
                     }
                    that.$set(item,"isShow",show)
                })

            },
            funSaveData() {
                this.Loading = true
                let saveData=[]
                this.settingList.filter(item=>item.edituser==='*').forEach(function (setting) {
                    saveData.push({id:setting.id,value:setting.value})
                })
                Edit(JSON.stringify(saveData)).then((res) => {
                    this.Loading = false
                    this.$message.success("提交成功")
                    this.isChange=false
                    this.funLoadData()
                }).catch(() => {
                    setTimeout(() => {
                        this.Loading = false
                    }, 300);
                });
            },
        },
        created() {
            this.funLoadData()
        }

    }
</script>

<style lang="scss" scoped>

    .mainwarp{
        width: 100%;
        height: auto;
        .group-title{
            font-size:14px;
            font-weight: bold;
            color: #333333;
            line-height:40px;
            border-bottom:1px solid #e3e8ee;
            float: left;
            width: 100%;
            margin-bottom:10px;
        }
        .setting-item{
            line-height:30px;
            float: left;
            overflow: hidden;
            padding: 10px 0;
            .title{
                font-size:14px;
                float: left;
                margin-left:10px;
            }
            .input{
                margin:0 20px;
                float: left;

            }
            .msg{
                font-size:13px;
                color: #999999;
                float: left;
                width: 100%;
                margin-left:10px;
            }
            .edit{
                float: right;
                color:#999999;
                font-size: 12px;
                margin-right:10px;

            }
            &:hover{
                background-color: #f7f7f7;
                box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
                border-radius: 3px
            }
        }
    }

</style>
