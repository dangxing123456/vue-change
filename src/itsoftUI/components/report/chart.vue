<template>
    <div ref="pieChart" :style="size"></div>
</template>

<script>
    export default {
        name: "chart",
        props: {
            option: null,
            dataset:null,
            size:null,
            field:null,
        },
        mounted(){
            // this.getEchartData()
        },
        methods:{
            getEchartData() {
                let that=this
                const chart = this.$refs.pieChart;
                if (chart && this.dataset) {
                    const myChart = this.$echarts.init(chart);
                    //数据加工
                    let source=[]
                    that.dataset.forEach(function (data) {
                        let row=[]
                        that.field.forEach(function (col) {
                            if (col.DataType==='ComputeField'){
                                row.push(data[col.Comment])
                            }else{
                                row.push(data[col.Name])
                            }
                        })
                        source.push(row)
                    })
                    this.option.dataset={source}
                    myChart.setOption(this.option);
                    // window.addEventListener("resize", function () {
                    //     myChart.resize();
                    // });
                   // console.log(this.dataset)
                }

            }
        },
        watch: {
            //报表数据
            'dataset': {
                handler: function () {
                    this.getEchartData()
                    //console.log(this.dataset)
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>
