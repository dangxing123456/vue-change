<template>
  <el-container class="h100 flex">
    <img
      style="width:508px;height:566px;object-fit: none;"
      :src="$itsoftUI.config.fileServer +
        '/sysres/images/systemlogo/welcome.png'"
      alt
      srcset
    />
    <!-- <el-main class="pd0" style="background-color: #ffffff;">
            <el-container>
                <el-header class="pd0" style="height:200px;border-bottom: 5px solid #f7f7f7;">
                    <div class="title">系统待办</div>
                </el-header>
                <el-main class="pd0">
                    <div class="title">系统地图</div></el-main>
            </el-container>
        </el-main>
        <el-aside width="200px" style="border-left: 5px solid #f7f7f7;">
    <div class="title">常用模块</div></el-aside>-->
  </el-container>
</template>

<script>
export default {
  name: "index"
};
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  color: #666666;
  font-size: 13px;
  padding: 10px;
  font-weight: bold;
}
</style>
