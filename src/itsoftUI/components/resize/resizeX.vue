<template>
    <div class="resize-x" title="拖动鼠标改变左右宽度" :style="style">
    </div>
</template>

<script>
    export default {
        name: "resizeX",
        data() {
            return {
                style: 'top:0;left:'+this.left,
                styleValue:0
            }
        },
        props: {
            left: {
                type: String,
                default: ''
            },
            max:{
                type: Number,
                default:400
            },
            min:{
                type: Number,
                default:100
            },
        },
        methods: {
            funDrag() {
                let that = this
                let resize = document.getElementsByClassName('resize-x')[0];
                resize.onmousedown = function (e) {
                    let startX = e.clientX;
                    resize.left = resize.offsetLeft;
                    // 鼠标拖动事件
                    document.onmousemove = function (e) {
                        let endX = e.clientX;
                         that.styleValue = resize.left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
                        if (that.styleValue < that.min) {
                            that.styleValue=that.min
                            that.funChange()
                            return false

                        }else if (that.styleValue > that.max){
                            that.styleValue=that.max
                            that.funChange()
                            return false
                        }
                        that.style='top:0;left:'+that.styleValue.toString()+'px'

                    }
                    // 鼠标松开事件
                    document.onmouseup = function (evt) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                        resize.releaseCapture && resize.releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                        that.funChange()
                    }
                    resize.setCapture && resize.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
                    return false;
                }
            },
            //更改
            funChange(){
                this.$emit('change', this.styleValue);
            }
        },
        mounted(){
             this.funDrag()
        },
        created() {
            //this.resizeStyle()

        }
    }
</script>

<style lang="scss" scoped>
    .resize-x {
        position: absolute;
        height: 100%;
        width: 3px;
        cursor: col-resize;

        &:hover {
            background-color: #f1f1f1;
        }
    }
</style>
