<template>
    <div class="tool-search"  >
        <input type="text"  :placeholder="placeholder" v-model="searchValue"
               @keyup.enter="buttonClick(searchValue)"
               autocomplete="off"/>
        <div class="tool-search-icon" @click="buttonClick(searchValue)" >
            <svg-icon slot="prefix" icon-class="fangdajing"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "toolSearch",
        props: {
            placeholder:null
        },
        data() {
            return {
                searchValue: ""
            }
        },
        methods: {
            buttonClick(val) {
                this.$emit('buttonClick',val);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tool-search {
        float: right;
        margin-right: 1px;
        height: 28px;
        margin-top: 8px;
        border: 1px solid #ddd;
        color: #606266;
        input {
            float: left;
            border: 0;
            height: 25px;
            line-height: 25px;
            padding: 2px 5px 0 5px;
            width:calc(100% - 45px);
            color: #606266;
            font-size: 13px;
        }
        .tool-search-icon{
            float: right;
            width:30px;
            line-height:28px;
            text-align: center;
            border-left: 1px solid #ddd;
            cursor: pointer;

            &:hover {
                background-color: #eee !important;
                color: #ffd04b !important;
            }
        }

    }
    input::-webkit-input-placeholder{
        color: #CCCCCC;
    }
</style>
