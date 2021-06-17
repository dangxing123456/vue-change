<!--供应商管理-->
<template>
  <div style="height: 100%" class="workspace">
    <!--工作区-->
    <el-container
      ref="listWarp"
      style="height: 100%; background-color: #fff"
      v-loading="listLoading"
    >
      <!--头部-->
      <el-header class="toolbar-wap" style="height: 45px">
        <!--工具条按钮-->
        <tool-button
          v-for="button in toolButtons"
          :key="button.text"
          :text="button.text"
          :icon="button.icon"
          :disabled="button.disabled"
          :right-line="button.rightLine"
          :left-line="button.leftLine"
          :title="button.title"
          @buttonClick="toolButtonClick"
        />
        <!--工具条查询-->
        <tool-query
          ref="toolQuery"
          :placeholder="quickQueryFieldName"
          :quickQueryField="quickQueryField"
          list-name="userList"
          :columns="columns"
          @executeQuery="funExecuteQuery"
          style="width: 300px; float: right"
        />
      </el-header>
      <!--列表-->
      <el-main style="height: 100%" class="page-main">
        <el-table
          ref="dataListTable"
          :data="dataList"
          highlight-current-row
          :default-sort="defaultOrder"
          border
          tooltip-effect="light"
          height="100%"
          style="width: 100%"
          @sort-change="evtTableSortChange"
          @row-dblclick="evtTableRowdblclick"
          @current-change="evtTableRowChange"
          @selection-change="evtTableSelectionChange"
        >
          <!--序号-->
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="49"
          />
          <el-table-column prop="status" label="状态" width="65" align="center">
            <template slot-scope="scope">
              <el-tag
                size="small"
                v-if="scope.row.status === '0'"
                type="info"
                disable-transitions
                >初始</el-tag
              >
              <el-tag
                v-if="scope.row.status === '1'"
                size="small"
                disable-transitions
                type="success"
                >正常</el-tag
              >
              <el-tag
                v-if="scope.row.status === '2'"
                size="small"
                disable-transitions
                type="danger"
                >冻结</el-tag
              >
            </template>
          </el-table-column>
          <!--绑定列-->
          <el-table-column
            v-for="col in columns.filter(
              (item) => item.visible && item.prop !== 'status'
            )"
            :prop="col.prop"
            :label="col.label"
            :sortable="col.sortable ? 'custom' : col.sortable"
            :resizable="col.resizable"
            :show-overflow-tooltip="col.tooltip"
            :align="col.align"
            :width="col.width"
            :fixed="col.fixed"
            :key="col.prop"
          />
          <!--暂无数据-->
          <div slot="empty" class="table-empty">
            <svg-icon
              slot="prefix"
              icon-class="zanwushuju"
              style="font-size: 40px; color: #ccc"
            />
            <p style="font-size: 13px; margin-top: 10px">暂无数据</p>
          </div>
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
        ></el-pagination>
      </el-footer>
    </el-container>
    <!--信息编辑-->
    <el-dialog
      :visible.sync="edit"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      lock-scroll
      @close="evtDialogClose"
      width="630px"
    >
      <div slot="title" class="dialog-title">
        <span
          :class="tab === 1 ? 'text on' : 'text'"
          @click="
            (val) => {
              this.tab = 1;
            }
          "
          >基本信息</span
        >
        <!-- <span :class="tab===2?'text on':'text'" @click="(val)=>{this.tab=2}">服务单位授权</span>
        <span :class="tab===3?'text on':'text'" @click="(val)=>{this.tab=3}">餐厅授权</span>-->
      </div>
      <el-container>
        <el-main v-loading="Loading" class="pd0">
          <div class="win-warp" style="height: 320px">
            <el-form
              ref="formEdit"
              v-show="tab === 1"
              style="margin-top: 20px"
              :model="formData"
              :rules="rules"
              size="small"
              label-width="90px"
            >
              <el-form-item
                label="帐号:"
                prop="account"
                style="width: 100%; float: left"
              >
                <el-autocomplete
                  ref="account"
                  v-model="formData.account"
                  :fetch-suggestions="querySearchAsync"
                  @select="handleSelect"
                  style="width: 300px"
                  :disabled="formData.id !== '0'"
                >
                  <el-tooltip
                    slot="append"
                    effect="dark"
                    v-if="formData.id === '0'"
                    content="选择其他未授权用户"
                    placement="bottom"
                  >
                    <el-button
                      style="width: 50px"
                      v-on:click.native="selectUser"
                      icon="el-icon-search"
                    ></el-button>
                  </el-tooltip>
                </el-autocomplete>
                <span style="font-size: 12px; color: #999999; margin-left: 5px"
                  >用户登录帐号,确定后不能修改</span
                >
              </el-form-item>
              <el-form-item
                label="姓名:"
                prop="name"
                style="width: 100%; float: left"
              >
                <el-input
                  ref="name"
                  v-model="formData.name"
                  style="width: 300px"
                  v-focus-next-on-enter="'unifiedaccount'"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="统一认证:"
                prop="unifiedaccount"
                style="width: 100%; float: left"
              >
                <el-input
                  ref="unifiedaccount"
                  v-model="formData.unifiedaccount"
                  style="width: 300px"
                  v-focus-next-on-enter="'rolesid'"
                ></el-input>
                <span style="font-size: 12px; color: #999999; margin-left: 5px"
                  >第三方认证帐号，可选项</span
                >
              </el-form-item>
              <el-form-item
                label="系统角色:"
                prop="rolesid"
                style="width: 100%; float: left"
              >
                <el-select
                  v-model="formData.rolesid"
                  size="small"
                  style="width: 300px"
                  placeholder="请选择角色"
                >
                  <el-option
                    v-for="item in rolesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="手机号码:"
                prop="mobile"
                style="width: 100%; float: left"
              >
                <el-input
                  ref="mobile"
                  v-model="formData.mobile"
                  style="width: 300px"
                  v-focus-next-on-enter="'email'"
                ></el-input>
                <span style="font-size: 12px; color: #999999; margin-left: 5px"
                  >初始修改密码需要手机号验证</span
                >
              </el-form-item>
              <el-form-item
                label="Email:"
                prop="email"
                style="width: 100%; float: left"
              >
                <el-input
                  ref="email"
                  style="width: 300px"
                  v-model="formData.email"
                ></el-input>
              </el-form-item>
            </el-form>

            <div v-show="tab === 2">
              <el-divider content-position="left"
                >请选择要授权的单位</el-divider
              >
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <!-- <div style="margin: 15px 0;">{{checkedCities}}</div> -->
              <el-checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="city in cities"
                  :label="city"
                  :key="city.id"
                  style="padding: 5px 30px; margin: 0"
                  >{{ city.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
            <!-- <el-checkbox
                v-for="(storehouse,index) in storehouseList "
                size="small"
                border
                :key="index"
                style="margin-bottom:10px; margin-top:10px;"
                :label="storehouse.id"
            >{{storehouse.name}}</el-checkbox>-->

            <div v-show="tab === 3">
              <!-- <table cellpadding="1" cellspacing="1" style="width: 100%;background-color:#DCDFE6;">
                <colgroup>
                  <col width="160" />
                  <col width="330" />
                </colgroup>
                <td style="padding:10px;background-color:#f1f1f1">餐厅</td>
                <td style="padding:10px;background-color:#f1f1f1">档口</td>
                <tr v-for="(dr,index) in drData" :key="index">
                  <td style="padding:10px;background-color:#ffffff">
                    <el-checkbox
                      :indeterminate="dr.indeterminate"
                      @change="(val)=>funRolesSelectAll(val,dr)"
                      v-model="dr.checkall"
                    >{{dr.name}}</el-checkbox>
                  </td>
                  <td style="padding:10px;background-color:#ffffff">
                    <el-checkbox-group v-model="dr.select">
                      <el-checkbox
                        v-for="auth in dr.data"
                        @change="(val)=>funRolesSelect(val,dr)"
                        size="small"
                        :key="auth.id"
                        :label="auth.id"
                      >{{auth.name}}</el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
              </table>-->

              <el-divider content-position="left"
                >请选择要授权的餐厅</el-divider
              >
              <el-checkbox
                :indeterminate="RestisIndeterminate"
                v-model="RestcheckAll"
                @change="ResthandleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="RestcheckedCities"
                @change="resthandleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="city in restCities"
                  :label="city"
                  :key="city.id"
                  style="padding: 5px 30px; margin: 0"
                  >{{ city.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button
              @click="
                (val) => {
                  this.edit = false;
                }
              "
              >取 消</el-button
            >
            <el-button
              type="primary"
              @click="evtSubmitForm"
              :loading="Loading"
              ref="btnOk"
              >确 定</el-button
            >
          </div>
        </el-main>
      </el-container>
      <el-dialog
        :visible.sync="innerVisible"
        width="680px"
        style
        title="选择人员"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        lock-scroll
        append-to-body
        @close="userClose"
      >
        <el-container style="height: 600px; overflow-x: hidden">
          <!--头部-->
          <el-header class="toolbar-wap" style="height: 45px">
            <!--工具条按钮-->
            <toolButton
              v-for="button in toolButtonSelect"
              :key="button.text"
              :text="button.text"
              :icon="button.icon"
              :disabled="button.disabled"
              :right-line="button.rightLine"
              :left-line="button.leftLine"
              :title="button.title"
              @buttonClick="toolButtonClickSelect"
            />
            <el-input
              size="small"
              placeholder="账号/姓名/统一认证"
              v-model="serachVal"
              style="width: 250px; float: right; margin-top: 7px"
              @change="searchClick"
            >
              <el-button
                @click="searchClick"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-header>
          <el-main style="height: 100%" class="page-main">
            <el-table
              ref="dataListTable"
              :data="dataSelectList"
              highlight-current-row
              v-loading="selectLoading"
              border
              tooltip-effect="light"
              height="100%"
              style="width: 100%"
              @current-change="evtTableRowSelect"
              @row-dblclick="evtTableRowdblSelect"
            >
              <!--序号-->
              <el-table-column
                type="index"
                align="center"
                label="序号"
                width="49"
              />
              <!--绑定列-->
              <el-table-column
                v-for="col in columnSelect.filter(
                  (item) => item.visible && item.prop !== 'status'
                )"
                :prop="col.prop"
                :label="col.label"
                :sortable="col.sortable ? 'custom' : col.sortable"
                :resizable="col.resizable"
                :show-overflow-tooltip="col.tooltip"
                :align="col.align"
                :width="col.width"
                :fixed="col.fixed"
                :key="col.prop"
              />
              <!--暂无数据-->
              <div slot="empty" class="table-empty">
                <svg-icon
                  slot="prefix"
                  icon-class="zanwushuju"
                  style="font-size: 40px; color: #ccc"
                />
                <p style="font-size: 13px; margin-top: 10px">暂无数据</p>
              </div>
            </el-table>
          </el-main>
          <!--底部分页-->
          <!-- <el-footer style="height:45px" class="page-footer"> -->
          <el-pagination
            style="margin: 5px 0"
            background
            layout="prev, pager, next,jumper,total,sizes"
            @size-change="evtPageSizeSelect"
            @current-change="evtPageCurrentSelect"
            :current-page.sync="selectCurrentPage"
            :page-sizes="[20, 50, 100, 500]"
            :total="selectTotalRows"
          ></el-pagination>
          <!-- </el-footer> -->
        </el-container>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import toolButton from "@/itsoftUI/components/toolbar/toolbutton";
import toolQuery from "@/itsoftUI/components/toolbar/toolquery";
import { apiUser } from "@/api/user/baseinfo";
import {
  Get,
  GetUserInfo,
  List,
  exportCSV,
  SelectList,
  Check,
} from "@/api/user/usercommon";
import { apiRoles } from "@/api/user/roles";
import { apiStoreHouse } from "@/api/system/storehouse";
import { apiDr } from "@/api/system/dr";
import { apiUserAuth } from "@/api/system/userauth";
import { getPremission } from "@/itsoftUI/auth/permission";
import { validateEmail, validateMobile } from "@/itsoftUI/utils/validate";
export default {
  name: "userList",
  components: { toolButton, toolQuery },
  data() {
    return {
      restaurants: [],
      userAll: [],
      state: "",
      timeout: null,
      serachVal: "",
      innerVisible: false,
      checkAll: false,
      RestcheckAll: false,
      checkedCities: [],
      RestcheckedCities: [],
      cities: [],
      restCities: [],
      isIndeterminate: false,
      RestisIndeterminate: false,
      defaultOrder: { prop: "edittime desc", order: "ascending" },
      dataList: [],
      rolesList: [],
      dataSelectList: [],
      listLoading: false,
      selectLoading: false,
      currentPage: 1,
      totalRows: 0,
      pageSize: 20,
      selectCurrentPage: 1,
      SelectPageSize: 20,
      selectTotalRows: 0,
      currentRow: null,
      selectRows: [],
      tableOrder: "",
      quickQueryFieldName: "帐号/姓名",
      quickQueryField: "account/name",
      //列
      columns: [
        {
          prop: "status",
          label: "状态",
          sortable: true,
          width: "80",
          visible: true,
          fixed: false,
          tooltip: true,
          type: "select",
          selectData: [
            { value: "0", label: "初始" },
            { value: "1", label: "正常" },
            { value: "2", label: "冻结" },
          ],
        },
        {
          prop: "account",
          label: "帐号",
          sortable: true,
          width: "120",
          visible: true,
          fixed: false,
          tooltip: true,
          max: 30,
        },
        {
          prop: "name",
          label: "姓名",
          sortable: true,
          width: "110",
          visible: true,
          tooltip: true,
          max: 50,
        },
        {
          prop: "unifiedaccount",
          label: "统一认证",
          sortable: true,
          width: "130",
          visible: true,
          tooltip: true,
          max: 30,
        },
        {
          prop: "rolesname",
          label: "系统角色",
          sortable: false,
          width: "120",
          visible: true,
          tooltip: true,
          max: 100,
        },
        {
          prop: "mobile",
          label: "手机号码",
          sortable: false,
          width: "130",
          align: "center",
          tooltip: true,
          visible: true,
          max: 20,
        },
        {
          prop: "email",
          label: "email",
          sortable: false,
          width: "160",
          visible: true,
          tooltip: true,
          max: 20,
        },
        {
          prop: "lastlogintime",
          label: "最后登录时间",
          width: "160",
          sortable: true,
          visible: true,
          tooltip: true,
          type: "date",
        },

        {
          prop: "edituser",
          label: "最后编辑",
          sortable: false,
          width: "100",
          visible: true,
          tooltip: true,
        },
        {
          prop: "edittime",
          label: "编辑时间",
          sortable: false,
          width: "",
          visible: true,
          tooltip: true,
          type: "date",
        },
      ],
      columnSelect: [
        {
          prop: "account",
          label: "帐号",
          sortable: true,
          width: "120",
          visible: true,
          fixed: false,
          tooltip: true,
          max: 30,
        },
        {
          prop: "name",
          label: "姓名",
          sortable: true,
          width: "110",
          visible: true,
          tooltip: true,
          max: 50,
        },
        {
          prop: "unifiedaccount",
          label: "统一认证",
          sortable: true,
          width: "130",
          visible: true,
          tooltip: true,
          max: 30,
        },

        {
          prop: "mobile",
          label: "手机号码",
          sortable: false,

          align: "center",
          tooltip: true,
          visible: true,
          max: 20,
        },
      ],
      toolButtons: [
        { text: "刷新", icon: "shuaxin", rightLine: true },
        { text: "新增", auth: "010101", icon: "add" },
        { text: "编辑", auth: "010102", icon: "edit" },
        { text: "删除", auth: "010103", icon: "delete" },
        { text: "初始密码", auth: "010104", icon: "psw", leftLine: true },
        { text: "冻结/解冻", auth: "010105", icon: "itr_lock", leftLine: true },
        { text: "解锁", auth: "010106", icon: "itr_unlock", leftLine: true },
      ],
      toolButtonSelect: [
        {
          text: "取消",
        },
        {
          text: "加入",
        },
      ],
      //默认查询
      defaultSearch: {
        andOr: "and",
        searchField: "schoolcode",
        operator: "=",
        searchValue: this.$itsoftUI.config.schoolCode,
      },
      Loading: false,
      edit: false,
      formData: {},
      rules: {
        name: [{ required: true, message: "姓名不能为空" }],
        account: [{ required: true, message: "帐号不能为空" }],
        rolesid: [{ required: true, message: "请选择角色" }],
        mobile: [{ required: true, validator: validateMobile }],
        email: [{ validator: validateEmail }],
      },
      tab: 1,
      dialogImg: false,
      isExport: false,
      exportFileName: "用户信息",
      queryList: [],
      storehouseList: [], //库房基本信息列表
      storehouseAuth: [], //库房授权
      userAuthData: {},
      drList: [], //餐厅房基本信息列表
      drAuth: [], //
      drData: [], //餐厅授权[{dr,select,checkall,indeterminate}]
    };
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString != undefined) {
        Check(queryString).then((res) => {
          if (res.data) {
            this.$message.error("此账号已存在,请重新注册");
          }
        });
      }
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.userAll.forEach((el) => {
        if (el.account === item.value) {
          this.formData = el;
          this.formData.systemcode = "exchange ";
        }
      });
    },
    toolButtonClick(text) {
      switch (text) {
        case "刷新":
          this.$refs.dataListTable.setCurrentRow();
          this.funLoadData();
          break;
        case "新增":
          // this.getUserList();
          let sysytemCode = "exchange ";
          this.selectLoading = true;
          let pageSize = 9999;
          let pageIndex = 1;
          SelectList(sysytemCode, pageSize, pageIndex, this.serachVal).then(
            (res) => {
              this.userAll = res.data.rows;
              res.data.rows.forEach((el) => {
                let obj = {
                  value: el.account,
                };
                this.restaurants.push(obj);
              });
              this.selectLoading = false;
            }
          );
          this.evtSingleTableEdit(null);
          break;
        case "编辑":
          //编辑
          if (!this.currentRow) {
            this.$message.error("未选中要编辑的数据行");
            return false;
          }
          this.evtSingleTableEdit(this.currentRow);
          break;
        case "删除":
          this.funDelete();
          break;
        case "初始密码":
          this.funChangePsw();
          break;
        case "冻结/解冻":
          this.funLockUser();
          break;
        case "解锁":
          this.fununLockUser();
          break;
        case "导出":
          this.exportOpen();
          break;
        case "设置":
          this.settingOpen();
          break;
      }
    },
    toolButtonClickSelect(text) {
      switch (text) {
        case "取消":
          this.selectCurrentRow = null;
          this.innerVisible = false;
          break;
        case "加入":
          if (!this.selectCurrentRow) {
            this.$message.error("未选中要加入的数据行");
            return false;
          }
          this.funSetData();
          break;
      }
    },
    selectUser() {
      this.innerVisible = true;
      this.getUserList();
    },
    userClose() {
      this.serachVal = "";
      this.selectCurrentPage = 1;
      this.SelectPageSize = 20;
    },
    searchClick() {
      this.getUserList();
    },
    //加载数据
    funLoadData() {
      //分页
      let page = { pageSize: this.pageSize, pageIndex: this.currentPage };
      //排序
      if (this.tableOrder === "") {
        if (this.defaultOrder.order) {
          if (this.defaultOrder.order === "descending") {
            this.tableOrder = this.defaultOrder.prop + " desc ";
          } else {
            this.tableOrder = this.defaultOrder.prop;
          }
        }
      }
      //组合查询条件
      let search = [];
      //加入自定义查询
      if (this.queryList) {
        search = this.queryList.slice();
      }
      search.push({
        andOr: "and",
        searchField: "systemcode",
        operator: "=",
        searchValue: "exchange ",
      });
      //加入默认查询
      search.unshift(this.defaultSearch);
      //加载数据
      let fields = "id,rolesid";
      this.columns.forEach(function (item) {
        fields = fields + "," + item.prop;
      });
      this.listLoading = true;
      apiUser
        .List(
          JSON.stringify(search),
          fields,
          this.tableOrder,
          JSON.stringify(page)
        )
        .then((res) => {
          this.dataList = res.data.rows;
          this.totalRows = res.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    funDelete() {
      //删除数据
      let that = this;
      if (!this.currentRow) {
        this.$message.error("未选中要删除的数据行");
        return false;
      }
      this.$confirm("确定要删除当前选中的数据吗？", "删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "放弃删除",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          apiUser
            .Del(this.currentRow.id, this.currentRow.rolesid)
            .then(() => {
              for (let i = 0; i < that.dataList.length; i++) {
                if (that.dataList[i].id === that.currentRow.id) {
                  that.dataList.splice(i, 1);
                  break;
                }
              }
              this.listLoading = false;
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => {});
    },
    funChangePsw() {
      //初始化
      if (!this.currentRow) {
        this.$message.error("请选择数据行");
        return false;
      }
      this.$confirm("确定要对当前选中的用户初始化密码吗？", "密码初始化", {
        distinguishCancelAndClose: true,
        confirmButtonText: "初始化",
        cancelButtonText: "放弃初始化",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          apiUser
            .Psw(this.currentRow.id, "")
            .then(() => {
              this.listLoading = false;
              this.$message.success("密码成功初始化为itsoft123,请重新登录");
              for (let i = 0; i < this.dataList.length; i++) {
                if (this.dataList[i].id === this.currentRow.id) {
                  this.dataList[i].status = "0";
                  break;
                }
              }
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => {});
    },
    //冻结/解冻
    funLockUser() {
      if (!this.currentRow) {
        this.$message.error("请选择数据行");
        return false;
      }
      let status = this.currentRow.status;
      let title = "";
      let msg = "";
      if (status === "0") {
        this.$message.error("初始状态下不能操作");
        return false;
      } else if (status === "1") {
        status = "2";
        title = "冻结用户";
        msg = "确定要冻结当前选中的用户吗？";
      } else {
        status = "1";
        title = "解冻";
        msg = "确定要解冻当前选中的用户吗？";
      }
      this.$confirm(msg, title, {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "放弃",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          apiUser
            .Lock(this.currentRow.id, status)
            .then(() => {
              this.listLoading = false;
              this.$message.success(title + "操作成功");
              for (let i = 0; i < this.dataList.length; i++) {
                if (this.dataList[i].id === this.currentRow.id) {
                  this.dataList[i].status = status;
                  break;
                }
              }
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => {});
    },
    // 解锁
    fununLockUser() {
      if (!this.currentRow) {
        this.$message.error("请选择数据行");
        return false;
      }
      // let status = this.currentRow.status;
      let title = "解锁用户";
      let msg = "确定要解锁当前选中的用户吗？";
      this.$confirm(msg, title, {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "放弃",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          apiUser
            .unLock(this.currentRow.account)
            .then(() => {
              this.listLoading = false;
              this.$message.success(title + "操作成功");
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => {});
    },
    evtPageSizeChange(val) {
      //每页数量
      this.pageSize = val;
      this.funLoadData();
    },
    evtPageCurrentChange(val) {
      //分页
      this.currentPage = val;
      this.funLoadData();
    },
    evtPageSizeSelect(val) {
      //每页数量
      this.SelectPageSize = val;
      this.getUserList();
    },
    evtPageCurrentChange(val) {
      //分页
      this.currentPage = val;
      this.funLoadData();
    },
    evtPageCurrentSelect(val) {
      //分页
      this.selectCurrentPage = val;
      this.getUserList();
    },
    evtTableRowdblclick() {
      //双击行
      let edit = this.toolButtons.filter((item) => item.auth === "010102");
      if (edit && edit.length > 0 && edit[0].disabled) return false;
      this.evtSingleTableEdit(this.currentRow);
    },
    evtTableRowChange(currentRow) {
      //单选行
      this.currentRow = currentRow;
    },
    evtTableSelectionChange(selection) {
      //多选行
      this.selectRows = selection;
    },
    evtTableRowSelect(currentRow) {
      this.selectCurrentRow = currentRow;
    },
    evtTableRowdblSelect() {
      this.funSetData();
    },
    funSetData() {
      let tabName = "0LxAqbYeOhsr3ctBq6bqyQ==";
      GetUserInfo(this.selectCurrentRow.id, tabName).then((res) => {
        this.formData = res.data;
        this.formData.systemcode = "exchange ";
        this.innerVisible = false;
      });
    },
    getUserList() {
      let sysytemCode = "exchange ";
      this.selectLoading = true;
      let pageSize = this.SelectPageSize;
      let pageIndex = this.selectCurrentPage;
      SelectList(sysytemCode, pageSize, pageIndex, this.serachVal).then(
        (res) => {
          this.dataSelectList = res.data.rows;
          this.selectTotalRows = res.data.total;
          this.selectLoading = false;
        }
      );
    },
    searchClick() {
      let sysytemCode = "exchange ";
      this.selectLoading = true;
      let pageSize = this.SelectPageSize;
      let pageIndex = this.selectCurrentPage;
      SelectList(sysytemCode, pageSize, pageIndex, this.serachVal).then(
        (res) => {
          this.dataSelectList = res.data.rows;
          this.selectTotalRows = res.data.total;
          this.selectLoading = false;
        }
      );
    },
    evtTableSortChange(obj) {
      //排序
      this.tableOrder = "";
      if (obj.order) {
        if (obj.order === "descending") {
          this.tableOrder = obj.prop + " desc ";
        } else {
          this.tableOrder = obj.prop;
        }
      }
      this.funLoadData();
    },
    //更新行
    funUpdateRow(data) {
      //查找行并更新
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].id === data.id) {
          //更新数据
          this.dataList.splice(i, 1, data);
          //选中行
          this.$refs.dataListTable.setCurrentRow(this.dataList[i]);
          break;
        }
      }
    },
    //添加行
    funAddRow(data) {
      this.dataList.unshift(data);
    },
    //本地加载列
    funLoadColumns() {
      let cols = JSON.parse(
        localStorage.getItem(this.listName + "—" + this.$ver)
      );
      if (cols) {
        let that = this;
        cols.forEach(function (item) {
          for (let i = 0; i < that.columns.length; i++) {
            if (that.columns[i].prop === item.prop) {
              that.columns[i].visible = item.visible;
              that.columns[i].fixed = item.fixed;
              that.columns[i].sortable = item.sortable;
              break;
            }
          }
        });
      }
    },
    //编辑、添加
    evtSingleTableEdit(val) {
      this.tab = 1;
      if (val) {
        //编辑提取基本信息
        let systemCode = "exchange ";
        apiUser.Get(val.id, systemCode).then((res) => {
          if (res.data) {
            this.formData = res.data;
            this.formData.oldrolesid = res.data.rolesid;
            this.edit = true;
            this.Loading = false;
          } else {
            this.$message.error("编辑数据不存在");
          }
        });
        //获取授权

        // this.storehouseAuth = [];
        // apiUserAuth.Get(val.id).then(res => {
        //   this.drAuth = [];
        //   this.storehouseAuth = [];
        //   this.userAuthData = res.data;
        //   this.storehouseAuth = JSON.parse(res.data.storehouse);
        //   if (res.data.dr && res.data.dr.length > 0)
        //     this.drAuth = JSON.parse(res.data.dr);
        //   //获取餐厅班组信息设置权限
        //   //加入默认查询
        //   // apiDr.List("", this.$itsoftUI.config.schoolCode).then(res => {
        //   //   this.drList = res.data;
        //   //   this.drData = [];
        //   //   let that = this;
        //   //   this.drList
        //   //     .filter(item => item.parentid === "root")
        //   //     .forEach(function(item) {
        //   //       let da = {};
        //   //       da.id = item.id;
        //   //       da.name = item.name;
        //   //       da.select = [];
        //   //       da.data = [];
        //   //       da.checkall = false;
        //   //       da.indeterminate = false;
        //   //       that.drList
        //   //         .filter(dr => dr.parentid === item.id)
        //   //         .forEach(function(citem) {
        //   //           da.data.push({
        //   //             id: citem.id,
        //   //             name: citem.name,
        //   //             parentid: citem.parentid
        //   //           });
        //   //         });
        //   //       that.drAuth
        //   //         .filter(citem => citem.id === item.id)
        //   //         .forEach(function(auth) {
        //   //           da.select = auth.select;
        //   //           da.checkall = auth.checkall;
        //   //           da.indeterminate = auth.indeterminate;
        //   //         });
        //   //       that.drData.push(da);
        //   //     });
        //   // });
        // });
      } else {
        //新增
        //获取授权
        this.funCreateNewData();
        this.edit = true;
      }
      if (this.rolesList.length === 0) {
        //获取角色
        let page = { pageSize: 0, pageIndex: 0 };
        //排序
        let order = "name";
        //组合查询条件
        let search = [];
        search.push({
          andOr: "and",
          searchField: "systemcode",
          operator: "=",
          searchValue: "exchange ",
        });
        //加入默认查询
        search.unshift(this.defaultSearch);
        let fields = "id,name";
        apiRoles
          .List(JSON.stringify(search), fields, order, JSON.stringify(page))
          .then((res) => {
            this.rolesList = res.data;
          });
      }
      //获取库房信息
      this.funGetStoreHouse(val);
    },
    //创建新数据
    funCreateNewData() {
      this.formData = {};
      this.formData.id = "0";
      this.formData.schoolcode = this.$itsoftUI.config.schoolCode;
      this.formData.oldrolesid = "0";
      this.formData.statusname = "初始";
      this.formData.status = "0";
      this.storehouseAuth = [];
      this.drAuth = [];
      this.userAuthData.id = "0";
    },
    evtSubmitForm() {
      this.$refs["formEdit"].validate((valid) => {
        //验证失败
        if (!valid) return false;
        this.Loading = true;
        // //餐厅授权

        apiUser
          .Edit(this.formData)
          .then((edit) => {
            let systemCode = "exchange ";
            apiUser.Get(edit.data.id, systemCode).then((res) => {
              this.$message.success("提交成功");
              let user = res.data;
              //关闭loading
              this.funLoadData();
              this.$refs.formEdit.resetFields();
              this.Loading = false;
              this.edit = false;
            });
          })
          .catch(() => {
            setTimeout(() => {
              this.Loading = false;
            }, 300);
          });
      });
    },
    //创建字段长度约束条件
    createRules() {
      let that = this;
      this.columns
        .filter((item) => item.max)
        .forEach(function (item) {
          let rule = {
            max: item.max,
            message: "长度不能大于" + item.max.toString(),
            trigger: "blur",
          };
          if (that.rules[item.prop]) {
            that.rules[item.prop].push(rule);
          } else {
            that.rules[item.prop] = rule;
          }
        });
    },

    //执行查询
    funExecuteQuery(val) {
      this.queryList = [];
      let that = this;
      if (val) {
        val.forEach(function (item) {
          that.queryList.push(item);
        });
      }
      this.funLoadData();
    },
    evtDialogClose() {
      this.$refs.formEdit.clearValidate();
      this.$refs.formEdit.resetFields();
      // this.formData = {};
      this.RestcheckedCities = [];
      this.isIndeterminate = false;
      this.RestisIndeterminate = false;
      this.checkedCities = [];
      this.restaurants = [];
    },
    //服务单位授权
    funGetStoreHouse(val) {},
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : [];
      this.isIndeterminate = false;
    },
    ResthandleCheckAllChange(val) {
      this.RestcheckedCities = val ? this.restCities : [];

      this.RestisIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    resthandleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.RestcheckAll = checkedCount === this.restCities.length;
      this.RestisIndeterminate =
        checkedCount > 0 && checkedCount < this.restCities.length;
    },
  },
  created() {
    this.funLoadData();
    this.createRules();

    //功能权限
    getPremission(this.toolButtons);
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.dialog-title {
  margin-left: 40px;
  font-size: 13px;
  color: rgba(255, 208, 75, 0.8);

  .text {
    float: left;
    height: 45px;
    padding: 0 10px;
    line-height: 35px;
    cursor: pointer;
    margin-right: 10px;
  }

  .on {
    margin-top: 5px;
    background-color: #ffffff;
    color: #606266;
    line-height: 30px;
    font-weight: bold;
  }
}
</style>
