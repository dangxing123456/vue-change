<!--工具条按钮-->
<template>
    <div>
        <div v-if="this.leftLine" class="tool-line"></div>
        <el-tooltip :disabled="!title"
                    :content="title"
                    :placement="tipPlacement"
                    :open-delay=300
                    :hide-after=3000>
                <div
                     :class="this.getClass()"
                     @click="buttonClick()">
                    <svg-icon   slot="prefix"
                                :id="'icon-'+id"
                                :icon-class="this.icon"
                                :style="'transform: rotate('+transform+'deg);-webkit-transform: rotate('+transform+'deg);'"
                                :class-name="notextClass"/>
                    <span>{{this.text}}</span>
                    <i :class="selected?'el-icon-arrow-left arrow arrow-right':'el-icon-arrow-right arrow arrow-right'" v-if="arrowRight"></i>
                    <em v-if="remind"></em>
                </div>
        </el-tooltip>
        <div v-if="this.rightLine" class="tool-line"></div>
    </div>
</template>
<script>
    export default {
        name: "toolButton",
        props: {
            id: {
                type: String,
                default: ''
            },
            text: {
                type: String,
                default: ''
            },
            icon: null,
            rightLine: {
                type: Boolean,
                default: false
            },
            leftLine: {
                type: Boolean,
                default: false
            },
            arrowRight: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            selected: {
                type: Boolean,
                default: false
            },
            remind: {
                type: Boolean,
                default: false
            },
            title: null,
            //缓冲事件避免连续点击
            clickDelay: {
                type: Number,
                default: 500
            },
            tipPlacement:{
                type: String,
                default: 'bottom'
            },
            transform:{
                type: String,
                default: '0'
            },
            type:{
                type: String,
                default: ''
            },
        },
        data() {
            return {
                notextClass: this.text === '' ? 'notextClass' : '',
                stoping: false
            }
        },
        methods: {
            buttonClick() {
                let val = this.text
                if (val === '') {
                    val = this.title
                }
                if (!this.disabled && !this.stoping) {
                    let that = this
                    this.stoping = true
                    this.$emit('buttonClick', val);
                    setTimeout(function () {
                        that.stoping = false
                    }, this.clickDelay);
                }

            },
            getClass() {
                let cls = " tool-button "
                if (this.type!=="")
                    cls+="tool-button-"+this.type
                if (this.disabled) {
                    cls += " disabled "
                } else {
                    cls += " enable "
                }
                if (this.selected) {
                    cls += " selected "
                }
                if (this.text.length === 0) {
                    cls += " notext "
                }
                if (this.stoping) {
                    cls += " stoping "
                }
                return cls

            },

            test(val) {
                alert(val)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tool-button {
        padding: 0 10px;
        height: 31px;
        line-height: 31px;
        margin-top: 7px;
        margin-left: 5px;
        float: left;
        border-radius: 4px;
        position: relative;

        svg-icon {
            font-size: 20px;
        }

        span {
            margin-left: 5px;

        }

        em {
            height: 6px;
            width: 6px;
            border-radius: 50%;
            background-color: #e54545;
            position: absolute;
            top: 5px;
            right: 3px;
        }

    }

    .tool-button.enable {
        cursor: pointer;
        color: #555;
        &:hover {
            background-color: #eee ;
            color: #333;
            .arrow{
                color: #409EFF;
            }
        }
    }

    .tool-button.disabled {
        cursor: not-allowed;
        color: #bbbbbb !important;
    }

    .tool-button.notext {
        padding: 0 3px;
    }

    .tool-button.stoping {
        color: #aaaaaa !important;
    }

    .tool-line {
        height: 25px;
        line-height: 31px;
        float: left;
        width: 5px;
        border-right: 1px solid #e3e8ee;
        margin-right: 5px;
        margin-top: 10px;
    }

    .notextClass {
        margin-left: 5px;
    }

    .tool-button.selected {
        color: #3a8ee6 !important;
        background-color: #e7e7e7 !important;
        .arrow-right{
            font-weight: bold;
            right: -2px;
            color: #409EFF;
        }
    }
    .arrow{ position:absolute; font-size:12px; color: #999999 }
    .arrow-right{right:-2px;top:10px;}
    .tool-button-primary{
        background-color:#409eff !important;
        color: #ffffff !important;


    }
    .tool-button-danger{
        background-color:#fef0f0 !important;
        color: #f56c6c !important;
        .disabled {
            color: #f56c6c !important;
        }

    }
    .tool-button-warning{
        background-color:#e6a23c !important;
        color: #ffffff !important;
        .disabled {
            color: #ffffff !important;
        }

    }


</style>
