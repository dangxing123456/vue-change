<template>
  <div class="tool-query-warp">
    <el-select
      placeholder="快捷检索或自定义检索条件"
      v-model="queryValue"
      @change="evtSelectChange"
      style="width:100%"
      size="small"
    >
      <svg-icon
        slot="prefix"
        v-if="queryValue.length>0"
        icon-class="delete"
        class="el-input__icon input-icon"
        @click="funClear"
        @click.stop
        title="清除条件"
        style="color:#e54545; cursor: pointer;"
      />
      <svg-icon
        slot="prefix"
        v-else
        icon-class="guolv"
        class="el-input__icon input-icon"
        style="color:#409EFF;"
      />
      <el-option :value="searchValue" label style="height:40px;padding:0 10px;">
        <div class="tool-search">
          <input
            type="text"
            :placeholder="'按'+placeholder+'快捷查询'"
            v-model="searchValue"
            @keyup.enter="funQuickSearch"
            @click.stop
            autocomplete="off"
          />
          <div class="tool-search-icon" @click.stop @click="funQuickSearch">
            <svg-icon slot="prefix" icon-class="fangdajing" style="color:#409EFF;" />
          </div>
        </div>
      </el-option>

      <el-option-group key="快捷查询" label="快捷检索"></el-option-group>
      <el-option-group key="自定义" label="自定义检索条件" style="position: relative; " class="query-group">
        <div class="new-button">
          <tool-button
            text="自定义条件"
            icon="tianjia"
            style="font-size:12px; color:#ccc"
            @buttonClick="funEdit"
          />
        </div>
        <el-option
          v-for="item in localQuery"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left;margin-right:10px;">
            <i class="el-icon-search"></i>
          </span>
          <span style="float: left">{{item.label}}</span>
          <span
            class="delete-select-bth"
            @click.stop
            @click="funDeleteLocal(item.label)"
            title="删除"
          >
            <svg-icon slot="prefix" icon-class="guanbi" />
          </span>
          <span
            class="edit-select-bth"
            @click.stop
            @click="funEdit(item.label,JSON.parse(item.value))"
            title="编辑"
          >
            <svg-icon slot="prefix" icon-class="edit0" />
          </span>
        </el-option>
      </el-option-group>
    </el-select>
    <!--组合查询-->
    <query-data
      ref="queryData"
      :columns="columns"
      :list-name="listName"
      @executeQuery="funExecuteQuery"
      @updateSelect="funUpdateSelect"
    />
  </div>
</template>

<script>
import toolButton from "@/itsoftUI/components/toolbar/toolbutton";
import queryData from "@/itsoftUI/components/table/queryData";
export default {
  name: "toolquery",
  components: { toolButton, queryData },
  props: {
    placeholder: null,
    quickQueryField: null,
    columns: null,
    listName: null
  },
  data() {
    return {
      queryValue: "",
      searchValue: "",
      localQuery: [],
      localKey: this.listName + "-" + this.$ver + "-QUERY",
      queryList: [],
      queryTitle: "自定义条件"
    };
  },
  methods: {
    //快速检索
    funQuickSearch() {
      let search = [];
      if (this.quickQueryField) {
        if (this.searchValue.length > 0) {
          search.push({
            andOr: "and",
            searchField: this.quickQueryField,
            operator: "like",
            searchValue: this.searchValue
          });
          this.queryValue = this.placeholder + "包含[" + this.searchValue + "]";
        } else {
          this.queryValue = "";
        }
        this.$emit("executeQuery", search);
      } else {
        this.$message.error("未定义查询字段quickQueryField");
      }
    },
    funEdit(label, value) {
      if (value) {
        //编辑
        this.queryList = value;
      } else {
        //自定义
        if (this.queryValue != "自定义条件") {
          this.queryList = [];
        }
      }
      this.queryTitle = label;
      this.queryOpen();
    },
    //加载本地数据
    funLoadLocal() {
      //本地存储
      this.localQuery = JSON.parse(localStorage.getItem(this.localKey));
      if (!this.localQuery) this.localQuery = [];
    },
    //删除历史
    funDeleteLocal(label) {
      this.$confirm("确定要删[" + label + "]吗？", "删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "放弃删除",
        type: "warning"
      })
        .then(() => {
          for (let i = 0; i < this.localQuery.length; i++) {
            let item = this.localQuery[i];
            if (item.label === label) {
              this.localQuery.splice(i, 1);
              localStorage.setItem(
                this.localKey,
                JSON.stringify(this.localQuery)
              );
              if (this.queryValue === item.value) {
                this.funClear();
              }
              break;
            }
          }
        })
        .catch(() => {
          //
        });
    },
    //选择条件
    evtSelectChange(val) {
      if (val) {
        this.$emit("executeQuery", JSON.parse(val));
      } else {
        this.$emit("executeQuery", null);
      }
    },
    //清除查询
    funClear() {
      this.queryValue = "";
      this.searchValue = "";
      this.$emit("executeQuery", null);
    },
    funExecuteQuery(val) {
      if (val) {
        this.queryValue = this.queryTitle;
        this.queryList = val;
        this.$emit("executeQuery", this.queryList);
      }
    },
    //打开自定义查询
    queryOpen() {
      this.$refs.queryData.queryOpen(this.queryTitle, this.queryList);
    },
    //更新并执行
    funUpdateSelect(query, select) {
      this.queryTitle = select;
      this.localQuery = query;
      this.funExecuteQuery(JSON.parse(select));
    }
  },
  created() {
    //加载本地存储查询条件
    this.funLoadLocal();
  }
};
</script>

<style lang="scss" scoped>
.tool-query-warp {
  line-height: 42px;
}

.tool-search {
  line-height: 26px;
  height: 26px;
  border: 1px solid #ddd;
  color: #606266;
  width: 100%;
  margin-top: 6px;

  input {
    float: left;
    border: 0;
    height: 23px;
    line-height: 23px;
    padding: 2px 5px 0 5px;
    width: calc(100% - 45px);
    color: #606266;
    font-size: 13px;
    font-weight: normal;
  }

  .tool-search-icon {
    float: right;
    width: 30px;
    line-height: 26px;
    text-align: center;
    border-left: 1px solid #ddd;
    cursor: pointer;

    &:hover {
      background-color: #eee !important;
      color: #ffd04b !important;
    }
  }
}

input::-webkit-input-placeholder {
  color: #cccccc;
}

.new-button {
  position: absolute;
  top: -6px;
  right: 15px;
}

.delete-select-bth {
  float: right;
  color: #999;
  font-size: 13px;
  &:hover {
    color: #e54545;
  }
}
.edit-select-bth {
  float: right;
  color: #999;
  font-size: 13px;
  margin-right: 20px;
  &:hover {
    color: #e54545;
  }
}
</style>
