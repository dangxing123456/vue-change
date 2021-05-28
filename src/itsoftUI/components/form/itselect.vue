<!--库房选择通用组件-->
<template>
    <div>
    <el-select
            :class="selectClass"
            placeholder="请选择"
            style="width:100%;"
            :filterable="filterable"
            :clearable="clearable"
            v-model="selectValue"
            no-data-text="无数据"
            @change="evtSelectChange"
            @clear="evtClear"
            popper-class="it-select-dr-menu"
            @focus="evtFocus"
            @blur="evtBlur"
            size="small">
        <el-option
                v-for="(item,index) in dataList"
                :key="index"
                :label="item.label"
                :value="item.value">
        </el-option>
        <div slot="prefix" :style="selectStyle" v-text="title"></div>
    </el-select>
    </div>
</template>

<script>
    export default {
        name: "selectdr",
        components: {},
        data() {
            return {
                selectValue: null,
                selectFocus:false
            }
        },
        props: {
            dataList: null,
            title:null,
            filterable:{
                type:Boolean,
                default:false
            },
            clearable:{
                type:Boolean,
                default:false
            },
        },
        methods: {
            evtSelectChange(val) {
                let item = this.dataList.filter(item => item.value === val)[0]
                if (item) {
                    this.$emit('change', {value: this.selectValue, label: item.label});
                }
            },
            evtClear(){
                this.$emit('clear');
            },
            evtFocus(){
                this.selectFocus=true
            },
            evtBlur(){
                this.selectFocus=false
            },
            funSetSelect(value){
                this.selectValue=value
            }
        },
        computed: {
            // 计算属性的 getter
            selectClass: function () {
                let cls=""
                if (this.title){
                    switch (this.title.length) {
                        case 3:
                            cls= "it-select-dr3"
                            break
                        case 4:
                            cls= "it-select-dr4"
                            break
                        case 5:
                            cls= "it-select-dr5"
                            break
                        default:
                            cls= "it-select-dr"
                            break
                    }
                }else{
                    cls= "it-select-dr"
                }
                return cls
            },
            selectStyle:function () {
                let style="font-size:12px; line-height:32px;font-weight: normal; padding-left:3px; "
                if (this.selectFocus){
                    style=style+"color: #409EFF;"
                }else{
                    style=style+"color: #909399;"
                }
                return style
            }
        },
        created() {

        },
        mounted() {
        }
    }
</script>

