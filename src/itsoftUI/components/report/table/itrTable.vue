<template>
    <div class="itrtable">
        <div v-html="tableData.Header" class="itrtable-header">

        </div>
        <div class="itrtable-body">
            <table cellpadding="0" cellspacing="0" :style="styleTable()" class="itrtable-body-table">
                <tr v-for="(row,rowIndex) in tableData.Data"
                    :style="'height:'+tableData.RowHeight"
                    :key="'row-'+rowIndex">
                    <th v-for="(col,colIndex) in tableData.Columns"
                        v-text="row[col.prop]"
                        :style="styleTh(row,rowIndex,col,colIndex)"
                        :key="'col-'+colIndex">
                    </th>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>

    export default {
        name: "itrTable",
        components: {},
        props: {
            tableData: null
        },
        methods: {
            styleTable() {
                let style = "border-collapse:0;border-spacing:0;"
                switch (this.tableData.Border) {
                    case "all":
                        style += "border-top:1px solid #000000; border-bottom:0px solid #000000;border-left:1px solid #000000;border-right:1px solid #000000;"
                        break
                    default:
                        break
                }
                return style

            },
            styleTh(row, rowIndex, col, colIndex) {
                let style = 'padding: 0 5px;width:' + col.width + ';text-align:' + col.align + ';'
                switch (this.tableData.Border) {
                    case "all":
                        if (colIndex > 0) {
                            style += "border-left:1px solid #000000;"
                        }
                        style += "border-bottom:1px solid #000000;"
                        break
                    case "left":
                        if (colIndex > 0) {
                            style += "border-left:1px solid #000000;"
                        }
                        break
                    case "bottom":

                            style += "border-bottom:1px solid #000000;"

                        break
                    default:
                        break
                }
                return style
            }
        },
        computed: {},
        watch: {},
        created() {

        },
        mounted() {

        },
        destroyed() {

        },
        data() {
            return {}
        }
    }
</script>

<style scoped>

</style>
