<template>
    <div class="it-dropdown">
        <span class="msg">{{title}}</span>
        <el-dropdown size="small" split-button type="plain" placement="bottom"
                     @click="evtClick"
                     @command="evtCommand">
            <span class="label" :style="'min-width:'+width+'; padding-left:'+labelLeft+';'">{{label}}</span>
            <el-dropdown-menu slot="dropdown" class="it-dropdown-menu" :style="'width:'+menuWidth+';'">
                <el-dropdown-item v-for="(item ,index) in items"
                                  :key="index"
                                  :divided="item.divided"
                                  :command="item">{{item.label}}
                </el-dropdown-item>
                <div v-if="!items" style="text-align: center; color: #F56C6C">
                    无数据(或未授权)
                </div>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
    export default {
        name: "dropdown",
        data() {
            return {
                label: "请选择",
                value: "",
                search:"",
            }
        },
        props: {
            width: null,
            menuWidth: null,
            labelLeft: null,
            items: null,
            title:null
        },
        methods: {
            evtCommand(val) {
                if (this.value !== val.value) {
                    this.label = val.label
                    this.value = val.value
                    this.$emit('change', this.label,this.value);
                }
            },
            evtClick() {
                this.$emit('click');
            },
            funSetDefault(list){
                if (list.length > 0) {
                    this.label = list[0].label
                    this.value = list[0].value
                    list.filter(item => item.selected).forEach(function (item) {
                        this.label = item.label
                        this.value = item.value
                    })
                }
            },
            setSetDefault(label,value){
                this.label =label
                this.value = value
            }
        },
        created() {
            //默认值
            this.funSetDefault(this.items)
        }
    }
</script>

<style lang="scss" scoped>
    .it-dropdown {
        position: relative;

        .msg {
            font-size: 12px;
            color: #909399;
            font-weight: normal;
            position: absolute;
            left: 7px;
            top: 7px;
            z-index: 99;
        }

        &:hover {
            .msg {
                color: #409EFF;
                font-weight: bold;
            }

        }

        .el-dropdown__caret-button {
            &:hover {
                .el-icon-arrow-down {
                    color: red;
                    transform: rotate(180deg);
                    -webkit-transform: rotate(180deg);
                }
            }
        }

        .label {
            float: left;
            text-align: left;

        }
    }
</style>
