<template>
  <div style="height: 100%" class="workspace">
    <el-container ref="listWarp" style="height: 100%; background-color: #fff">
      <el-header class="toolbar-wap" style="height: 45px">
        <!--工具条按钮-->
        <div>
          <toolButton
            :disabled="button.disabled"
            :icon="button.icon"
            :key="button.text"
            :left-line="button.leftLine"
            :right-line="button.rightLine"
            :text="button.text"
            :title="button.title"
            @buttonClick="toolButtonClick"
            v-for="button in toolButtons"
          />
          <el-cascader
            style="width: 250px; margin-top: 5px; margin-left: 10px"
            size="small"
            :props="props"
            v-model="value"
            @change="handleChange"
          ></el-cascader>
        </div>
      </el-header>
      <el-main style="height: 100%" class="page-main">
        <el-table
          :data="tableData"
          v-loading="loading"
          border
          tooltip-effect="light"
          height="100%"
          style="width: 100%"
          highlight-current-row
          ref="dataListTable"
          row-key="id"
          @row-dblclick="tableDbEdit"
          @current-change="evtTableRowChange"
          @selection-change="handleSelectionChange"
        >
          <!-- 
         
          -->
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            prop="index"
            label="序号"
            width="60"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column
            v-for="col in columns.filter((item) => item.visible)"
            :prop="col.prop"
            :label="col.label"
            :sortable="col.sortable"
            :resizable="col.resizable"
            :type="col.type"
            :show-overflow-tooltip="col.tooltip"
            :align="col.align"
            :width="col.width"
            :fixed="col.fixed"
            :key="col.prop"
          />
        </el-table>
      </el-main>
      <!--底部分页-->
      <el-footer style="height: 45px" class="page-footer">
        <el-pagination
          style="margin-top: 5px"
          background
          layout="prev, pager, next,jumper,total,sizes"
          @size-change="evtPageSizeChange"
          @current-change="evtPageCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[20, 50, 100, 500]"
          :total="totalRows"
        >
        </el-pagination>
      </el-footer>
    </el-container>
    <el-dialog
      title="添加区域"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      destroy-on-close
      lock-scroll
      :before-close="dialogClose"
      width="500px"
      size="small"
    >
      <div class="win-warp" style="height: 180px; overflow: auto">
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="区域名称:" prop="name">
            <el-input
              ref="inputName"
              autofocus
              v-model="formData.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="区域备注:" prop="remark">
            <el-input autofocus v-model="formData.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm"
          ref="btnOk"
          :loading="isSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import toolButton from "@/itsoftUI/components/toolbar/toolbutton";
import { areaInfoApi } from "@/api/areaInfo";
export default {
  components: {
    toolButton,
  },
  data() {
    return {
      formData: {
        name: "",
        id: "",
        level: 4,
        displayorder: 0,
        remark: "",
        visible: 2,
      },
      rules: {
        name: [
          { required: true, message: "区域名称不能为空", trigger: "blur" },
        ],
      },
      value: "",
      dialogFormVisible: false,
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level == 0) {
            setTimeout(() => {
              let pid = "0";
              areaInfoApi.ListTree(pid).then((res) => {
                let nodes = res.data.map((r) => {
                  return {
                    value: r.id,
                    label: r.name,
                    leaf: r.hadChildren == "0" ? true : false,
                  };
                });
                resolve(nodes);
              });
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            }, 100);
          } else if (level == 1) {
            setTimeout(() => {
              let pid = node.value;
              areaInfoApi.ListTree(pid).then((res) => {
                let nodes = res.data.map((r) => {
                  return {
                    value: r.id,
                    label: r.name,
                    leaf: r.hadChildren == "0" ? true : false,
                  };
                });
                resolve(nodes);
              });
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            }, 100);
          } else if (level == 2) {
            setTimeout(() => {
              let pid = node.value;
              areaInfoApi.ListTree(pid).then((res) => {
                let nodes = res.data.map((r) => {
                  return {
                    value: r.id,
                    label: r.name,
                    leaf: true,
                  };
                });
                resolve(nodes);
              });
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            }, 100);
          }
        },
      },
      columns: [
        {
          prop: "name",
          label: "区域名称",
          sortable: false,
          visible: true,
          tooltip: true,
          max: 100,
          width: 400,
        },
        {
          prop: "level",
          label: "等级",
          sortable: false,
          visible: true,
          tooltip: true,
          max: 100,
          width: 200,
        },
        {
          prop: "remark",
          label: "备注",
          sortable: false,
          visible: true,
          tooltip: true,
          max: 250,
        },
      ],
      tableData: [],
      loading: false,
      toolButtons: [
        {
          text: "刷新",
          icon: "shuaxin",
          rightLine: true,
        },
        {
          text: "新增",
          auth: "020302",
          icon: "add",
        },
        {
          text: "编辑",
          auth: "020303",
          icon: "edit",
        },
        {
          text: "删除",
          auth: "020304",
          icon: "delete",
        },
      ],
      currentPage: 1,
      totalRows: 0,
      pageSize: 20,
      isSubmit: false,
      multipleSelection: [],
      currentRow: null,
    };
  },
  methods: {
    handleChange() {
      console.log(this.value);
      this.funLoadList();
    },
    toolButtonClick(text) {
      if (this.value == "") {
        this.$message.error("请先选择区域");
        return false;
      }
      switch (text) {
        case "刷新":
          this.loading = true;
          setTimeout(() => {
            this.funLoadList();
            this.$message.success("刷新成功");
            this.loading = false;
          }, 500);

          break;
        case "新增":
          this.dialogFormVisible = true;
          break;
        case "编辑":
          if (!this.currentRow) {
            this.$message.error("请选择要编辑的数据行");
            return false;
          }
          this.funGetDetail();
          break;
        case "删除":
          if (this.multipleSelection.length == 0) {
            this.$message.error("请选中要删除的数据");
            return false;
          }
          this.del();
          break;
      }
    },
    funLoadList() {
      let search = [
        {
          andOr: "and",
          searchField: "pid",
          operator: "=",
          searchValue: this.value[this.value.length - 1],
        },
      ];
      let page = { pageIndex: this.currentPage, pageSize: this.pageSize };
      this.loading = true;
      areaInfoApi
        .List(JSON.stringify(search), JSON.stringify(page))
        .then((res) => {
          if (res.status == "success") {
            this.tableData = res.data.rows;
            this.totalRows = res.data.total;
            this.loading = false;
          }
        });
    },
    evtPageSizeChange(val) {
      //每页数量
      this.pageSize = val;
      this.funLoadList();
    },
    evtPageCurrentChange(val) {
      //分页
      this.currentPage = val;
      this.funLoadList();
    },
    evtTableRowChange(currentRow) {
      this.currentRow = currentRow;
    },
    tableDbEdit(currentRow) {
      this.currentRow = currentRow;
      setTimeout(() => {
        this.funGetDetail();
      });
    },
    funGetDetail() {
      let loadingInstance = this.$loading(this.$dialogLoading);
      //编辑提取
      areaInfoApi
        .Get(this.currentRow.id)
        .then((res) => {
          if (res.data) {
            this.formData = res.data;
            this.dialogFormVisible = true;
            loadingInstance.close();
          } else {
            this.$message.error("编辑数据不存在");
            loadingInstance.close();
          }
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    submitForm() {
      this.formData.pid = this.value[this.value.length - 1];
      this.$refs["form"].validate((valid) => {
        //验证失败
        if (!valid) return false;
        let loadingInstance = this.$loading(this.$dialogLoading);
        this.isSubmit = true;
        //提交
        areaInfoApi
          .save(this.formData)
          .then((res) => {
            //改变提交状态
            this.isSubmit = false;
            if (this.formData.id == "") {
              //新增，连续新增
              this.formData = {
                name: "",
                id: "",
                level: 4,
                displayorder: 0,
                remark: "",
                visible: 2,
              };
            } else {
              this.dialogFormVisible = false;
            }
            this.funLoadList();
            //关闭loading
            loadingInstance.close();
          })
          .catch(() => {
            setTimeout(() => {
              loadingInstance.close();
              this.isSubmit = false;
            }, 300);
          });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    del() {
      let that = this;
      this.$confirm("确定要删除当前选中的数据吗？", "删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "放弃删除",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          this.loadingText = "数据正在删除...";
          let ids = [];
          this.multipleSelection.forEach(function (item) {
            ids.push(item.id);
          });
          areaInfoApi
            .Del(ids.toString())
            .then(() => {
              this.multipleSelection.forEach(function (item) {
                for (let i = 0; i < that.tableData.length; i++) {
                  if (that.tableData[i].id === item.id) {
                    that.tableData.splice(i, 1);
                    break;
                  }
                }
              });
              this.listLoading = false;
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => {
          this.$refs.dataListTable.clearSelection();
        });
    },
    dialogClose() {
      this.dialogFormVisible = false;
      this.formData = {
        name: "",
        id: "",
        level: 4,
        displayorder: 0,
        remark: "",
        visible: 2,
      };
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.toolbar-wap {
}
</style>