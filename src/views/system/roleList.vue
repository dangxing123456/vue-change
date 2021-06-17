<template>
  <div style="height: 100%; " class="workspace">
    <el-container ref="listWarp" v-loading="Loading" style="height: 100%;background-color:#fff;">
      <el-aside width="200px" class="left" v-if="!isNew">
        <el-container class="h100">
          <el-header class="top" height="45px">
            <div style="float: left;margin-left:5px;">
              <svg-icon slot="prefix" icon-class="role" style="color: #409EFF;" />
            </div>
            <span>用户角色</span>
            <el-tooltip v-if="editPremission" content="添加角色" :open-delay="300" :hide-after="3000">
              <i class="el-icon-plus" @click="funAddData"></i>
            </el-tooltip>
          </el-header>
          <el-main class="pd0 h100">
            <div
              v-for="(item,index) in DataList"
              @click="(val)=>funSelectData(item,index)"
              :class="item.select==='1'?'item on':'item' "
              :key="item.id"
            >
              <span class="name">{{item.name}}</span>
              <span class="remark">{{item.remark}}</span>
              <i
                class="el-icon-delete"
                style="color:#E6A23C;"
                v-if="item.issys==='0' && delPremission"
                @click.stop
                @click="(val)=>funDelData(item.id,index)"
              ></i>
            </div>
          </el-main>
        </el-container>
      </el-aside>
      <el-main class="h100">
        <div v-if="roleData.id==='none'">
          <h3 style="color:#606266">角色管理</h3>
          <div style="color:#999999">
            <i class="el-icon-top-left" style="color: #409EFF"></i>请选择角色
          </div>
        </div>
        <div v-else style="float: left;width: 100%; margin-bottom:40px;">
          <div class="formitem">
            <span class="label">角色名称:</span>
            <div class="input">
              <el-input
                ref="name"
                v-model="roleData.name"
                size="small"
                maxlength="20"
                style="width:180px;"
              ></el-input>
            </div>
            <span class="label">备注:</span>
            <div class="input">
              <el-input v-model="roleData.remark" size="small" maxlength="50" style="width:200px;"></el-input>
            </div>
            <div
              class="input"
              v-if="roleData.edituser"
              style="margin-left:15px; color: #999999;"
            >最新编辑: {{roleData.edituser}} {{roleData.edittime}}</div>
          </div>
          <table cellpadding="1" cellspacing="1" class="rolestable">
            <colgroup>
              <col style="width:15%; " />
              <col style="width:85%;" />
            </colgroup>
            <tr>
              <td style="background-color:#f1f1f1;">一级模块</td>
              <td style="padding:0;background-color:#f1f1f1;">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  style="width: 100%;background-color:#f1f1f1;"
                >
                  <colgroup>
                    <col style="width:20%; " />
                    <col style="width:80%;" />
                  </colgroup>
                  <tr>
                    <td
                      style="padding:0 0 0 10px ;height:40px; border-right: 1px solid #DCDFE6;background-color:#f1f1f1;"
                    >二级菜单</td>
                    <td style="padding:0 0 0 10px;background-color:#f1f1f1;">三级功能明细</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr v-for="(row,index) in routerMenu" :key="index">
              <td class="name">
                <el-checkbox
                  :indeterminate="row.indeterminate"
                  v-model="row.check"
                  @change="(val)=>funRolesSelectAll(val,row)"
                >{{row.name}}</el-checkbox>
              </td>
              <td class="roles" style="padding:0">
                <table cellpadding="0" cellspacing="0" class="rolestable">
                  <colgroup>
                    <col style="width:20%; " />
                    <col style="width:80%;" />
                  </colgroup>
                  <tr v-for="(col,cindex) in row.submenu" :key="cindex">
                    <td
                      :class="(index+cindex+1)%2===0?'tdbk':''"
                      :style="cindex+1<row.submenu.length?'border-bottom: 1px solid #DCDFE6;padding:0 0 0 10px ;height:32px; border-right: 1px solid #DCDFE6;':'padding:0 0 0 10px ;height:32px; border-right: 1px solid #DCDFE6;'"
                    >
                      <el-checkbox
                        v-model="col.check"
                        :indeterminate="!col.check && col.select.length>0"
                        @change="(val)=>funRolesSelect(val,row,col)"
                      >{{col.name}}</el-checkbox>
                    </td>
                    <td
                      :style="cindex+1<row.submenu.length?'border-bottom: 1px solid #DCDFE6;':''"
                      :class="(index+cindex+1)%2===0?'tdbk':''"
                    >
                      <el-checkbox-group v-model="col.select">
                        <el-checkbox
                          v-for="(child,aindex) in col.children"
                          size="small"
                          @change="(val)=>funRolesSelect(val,row,col,child.id)"
                          :key="aindex"
                          style="padding:5px 0;"
                          :label="child.id"
                        >{{child.name}}</el-checkbox>
                      </el-checkbox-group>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div class="btn" v-if="editPremission">
            <el-button type="primary" @click="funSaveData">提交</el-button>
            <el-button v-if="roleData.id==='0'" @click="funCancelData">取消添加</el-button>
            <el-button v-else @click="funCopyData">复制角色</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Vue from "vue";
import { ListSearch } from "@/api/common";
import { apiRoles } from "@/api/user/roles";
import router from "@/router/index";
import { getPremission } from "@/itsoftUI/auth/permission";
import { apiSystemMenu } from "@/api/system/menu";
const SystemCode = "exchange ";
export default {
  name: "roleList",
  data() {
    return {
      reportTable: "JdJQwwwzsf9olVnBRhcsXg==",
      DataList: [],
      roleData: { id: "none", issys: "0" },
      Loading: false,
      tableOrder: "edittime",
      //默认查询
      defaultSearch: {
        andOr: "and",
        searchField: "schoolcode",
        operator: "=",
        searchValue: this.$itsoftUI.config.schoolCode,
      },
      isNew: false,
      dataIndex: null,
      systemMenu: Vue.prototype.$systemMenu,
      routerMenu: [],
      toolButtons: [
        { text: "复制/保存", auth: "010201" },
        { text: "删除", auth: "010202" },
      ],
      editPremission: true,
      delPremission: true,
    };
  },
  methods: {
    funLoadData() {
      //分页
      let page = { pageSize: 0, pageIndex: 0 };
      //排序
      let order = this.tableOrder;
      let search = [];
      //加入默认查询
      search.unshift(this.defaultSearch);
      search.push({
        andOr: "and",
        searchField: "systemcode",
        operator: "=",
        searchValue: SystemCode,
      });
      //加载数据
      let fields = "*";
      this.Loading = true;
      apiRoles
        .List(JSON.stringify(search), fields, order, JSON.stringify(page))
        .then((res) => {
          this.DataList = res.data;
          //创建菜单
          this.funCreateSystemMenu();
          //this.Loading = false;
        })
        .catch(() => {
          this.Loading = false;
        });
    },
    funSelectData(val, index) {
      let that = this;
      if (that.Loading) return false;
      if (this.isNew || this.roleData.id === val.id) return false;
      that.Loading = true;
      setTimeout(function () {
        that.DataList.filter(
          (item) => item.select && item.select === "1"
        ).forEach(function (data) {
          that.$set(data, "select", "0");
        });
        that.$set(val, "select", "1");
        that.roleData = JSON.parse(JSON.stringify(val));
        that.funGetRoles(val.authorize);
        that.dataIndex = index;
        that.Loading = false;
      }, 100);
    },
    //添加角色
    funAddData() {
      let that = this;
      this.roleData = {
        id: "0",
        schoolcode: this.$itsoftUI.config.schoolCode,
        systemcode: SystemCode,
        issys: "0",
      };
      this.DataList.filter(
        (item) => item.select && item.select === "1"
      ).forEach(function (data) {
        that.$set(data, "select", "0");
      });
      this.dataIndex = null;
      this.funGetRoles();
      this.isNew = true;
    },
    //取消添加
    funCancelData() {
      this.roleData = { id: "none", issys: "0" };
      this.isNew = false;
      this.dataIndex = null;
    },
    funDelData(val, index) {
      let that = this;
      this.$confirm("确定要删除当前选中的数据吗？", "删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "放弃删除",
        type: "warning",
      }).then(() => {
        apiRoles.Del(val).then(() => {
          that.DataList.splice(index, 1);
          that.roleData = { id: "none" };
          this.$message.success("删除成功");
        });
      });
    },
    funSaveData() {
      if (!this.roleData.name) {
        this.$message.error("请输入角色名称");
        this.$refs.name.focus();
        return false;
      }
      if (this.roleData.name.length === 0) {
        this.$message.error("请输入角色名称");
        this.$refs.name.focus();
        return false;
      }
      this.Loading = true;
      //授权分析
      let roles = [];
      this.routerMenu.forEach(function (item) {
        item.submenu
          .filter((sub) => sub.select.length > 0)
          .forEach(function (menu) {
            Array.prototype.push.apply(roles, menu.select);
          });
      });
      if (roles.length === 0) {
        this.$message.error("请给角色分配操作权限");
        this.Loading = false;
        return false;
      }
      this.roleData.authorize = JSON.stringify(roles);
      apiRoles.Edit(this.roleData).then((res) => {
        this.Loading = false;
        this.isNew = false;
        //判断新增/编辑
        if (this.roleData.id === "0") {
          //添加
          res.data.select = "1";
          this.DataList.push(res.data);
          this.funGetDataIndex();
        } else {
          res.data.select = "1";
          this.DataList.splice(this.dataIndex, 1, res.data);
        }
        this.roleData = JSON.parse(JSON.stringify(res.data));
        this.$message.success("提交成功");
      });
    },
    funCreateMenu() {
      let that = this;
      //读取报表信息
      let search = [];
      //加入默认查询
      search.unshift(this.defaultSearch);
      //加载数据
      let fields = "id,name,module";
      let reportList = [];
      ListSearch(JSON.stringify(search), this.reportTable, fields).then(
        (res) => {
          reportList = res.data;
          this.systemMenu.forEach(function (menu1) {
            //menu1大模块
            let name = menu1.name;
            let submenu = [];
            let children = [];
            let menu = router.options.routes.filter(
              (item) => item.path === menu1.url
            )[0];
            //menu大模块明细
            if (menu && menu.children) {
              menu.children
                .filter((item) => item.meta.Auth !== "login")
                .forEach(function (menu2) {
                  submenu.push(menu2.meta.title); //二级菜单
                  let authmenu = []; //详细操作
                  let report = menu2.meta.report;
                  if (report) {
                    //相关统计
                    reportList
                      .filter((item) => item.module === report)
                      .forEach(function (rpt) {
                        authmenu.push({ name: rpt.id, label: rpt.name });
                      });
                    children.push({
                      name: menu2.meta.title,
                      authmenu,
                      select: [],
                    });
                  } else {
                    if (menu2.meta.Auth.constructor === Array) {
                      menu2.meta.Auth.forEach(function (auth) {
                        authmenu.push({ name: auth.name, label: auth.label });
                      });
                    }
                    children.push({
                      name: menu2.meta.title,
                      authmenu,
                      select: [],
                    });
                  }
                });
            }
            let select = [];
            let indeterminate = false;
            let checkall = false;
            that.routerMenu.push({
              name,
              indeterminate,
              submenu,
              select,
              checkall,
              children,
            });
          });
        }
      );
    },
    funRolesSelect(val, row, col, id) {
      //id 存在时表示选功能
      if (id) {
        if (id.substring(4, 6) === "00") {
          if (!val) {
            col.select = [];
          }
        } else {
          let pid = id.substring(0, 4) + "00";
          if (val && col.select.indexOf(pid) < 0) {
            col.select.push(pid);
          }
        }
        let checkedCount = col.select.length;
        this.$set(col, "check", checkedCount === col.children.length);
      } else {
        if (val) {
          col.select = [];
          col.children.forEach(function (a) {
            col.select.push(a.id);
          });
        } else {
          col.select = [];
        }
      }
      let count = row.submenu.length;
      let checkCount = row.submenu.filter((item) => item.check).length;
      row.check = count === checkCount;
      row.indeterminate = checkCount > 0 && checkCount < count;
    },
    funRolesSelectAll(val, menu) {
      menu.indeterminate = false;
      //模块选择
      menu.submenu.forEach(function (c) {
        if (val) {
          c.select = [];
          c.children.forEach(function (a) {
            c.select.push(a.id);
          });
          c.check = true;
        } else {
          c.select = [];
          c.check = false;
        }
      });
    },
    funGetRoles(roles) {
      let authorize = [];
      if (roles) {
        authorize = JSON.parse(roles);
      }
      this.routerMenu.forEach(function (item) {
        item.submenu.forEach(function (menu) {
          let pid = menu.id.substring(0, 4);
          let pmenu = authorize.filter((item) => item.substring(0, 4) === pid);
          if (pmenu.length > 0) {
            menu.select = pmenu;
          } else {
            menu.select = [];
          }
          menu.check = menu.select.length === menu.children.length;
        });
        let count = item.submenu.length;
        let checkCount = item.submenu.filter((item) => item.check).length;
        item.check = count === checkCount;
        item.indeterminate = checkCount > 0 && checkCount < count;
      });
    },
    funGetDataIndex() {
      for (let i = 0; i < this.DataList.length; i++) {
        if (this.DataList[i].select === "1") {
          this.dataIndex = i;
          return;
        }
      }
    },
    //复制角色
    funCopyData() {
      let that = this;
      this.dataIndex = null;
      this.isNew = true;
      this.roleData.id = "0";
      this.roleData.name = "";
      this.roleData.remark = "";
      this.roleData.issys = "0";
      this.$message.success("角色已复制，请重新编辑后提交");
      this.DataList.filter(
        (item) => item.select && item.select === "1"
      ).forEach(function (data) {
        that.$set(data, "select", "0");
      });
    },
    funCreateSystemMenu() {
      let that = this;
      let systemMenu = [];
      this.routerMenu = [];
      apiSystemMenu.List().then((res) => {
        systemMenu = res.data;
        systemMenu.forEach(function (item) {
          if (!that.routerMenu.some((c) => c.name === item.module)) {
            let menu = {};
            that.$set(menu, "name", item.module); //模块名称
            that.$set(menu, "indeterminate", false); //模块的选择状态
            that.$set(menu, "check", false); //模块是否全部选择
            let submenu = [];
            systemMenu
              .filter((r) => r.module === item.module)
              .forEach(function (subitem) {
                if (!submenu.some((c) => c.name === subitem.menu)) {
                  let smenu = {};
                  that.$set(smenu, "name", subitem.menu); //菜单名称
                  that.$set(smenu, "id", subitem.id);
                  that.$set(smenu, "select", []);
                  that.$set(smenu, "check", false); //全部选择
                  let children = [];
                  systemMenu
                    .filter(
                      (r) => r.id.substring(0, 4) === subitem.id.substring(0, 4)
                    )
                    .forEach(function (child) {
                      if (!children.some((c) => c.id === child.id)) {
                        let childMenu = {};
                        that.$set(childMenu, "name", child.action); //功能名称
                        that.$set(childMenu, "id", child.id);
                        children.push(childMenu);
                      }
                    });
                  that.$set(smenu, "children", children);
                  submenu.push(smenu);
                }
              });
            that.$set(menu, "submenu", submenu); //二级菜单
            that.routerMenu.push(menu);
          }
        });
        that.Loading = false;
      });
    },
  },
  created() {
    //加载数据
    this.funLoadData();
    //功能权限
    getPremission(this.toolButtons);
  },
  watch: {
    //功能权限
    toolButtons: {
      handler: function (val) {
        let that = this;
        //功能权限
        let edit = val.filter((item) => item.auth === "010201");
        if (edit && edit.length > 0 && edit[0].disabled)
          that.editPremission = false;
        edit = val.filter((item) => item.auth === "010202");
        if (edit && edit.length > 0 && edit[0].disabled)
          that.delPremission = false;
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.left {
  background-color: #f1f1f1;

  .top {
    position: relative;
    line-height: 45px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    color: #666666;

    span {
      font-size: 13px;
      font-weight: bold;
      padding-left: 5px;
    }

    i {
      font-weight: bold;
      position: absolute;
      top: 15px;
      right: 20px;
      cursor: pointer;

      &:hover {
        color: #409eff;
      }
    }
  }

  .item {
    position: relative;
    float: left;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #dcdfe6;
    cursor: pointer;

    span {
      float: left;
      width: 175px;
      height: 20px;
      line-height: 20px;
      padding-left: 25px;
    }

    .name {
      margin-top: 5px;
      color: #333333;
      overflow: hidden;
    }

    .remark {
      font-size: 12px;
      color: #999999;
      overflow: hidden;
    }

    i {
      position: absolute;
      top: 20px;
      left: 5px;
      color: #666666;
      display: none;
      cursor: pointer;
    }

    &:hover:not(.on) {
      background-color: #f7f7f7;
    }
  }

  .on {
    background-color: #ffffff;
    cursor: default !important;
    border-left: 2px solid #409eff;
    i {
      display: block;
    }
  }
}

.line {
  float: left;

  .el-divider__text {
    font-weight: bold !important;
    color: #333333;
    font-size: 13px;
  }
}

.formitem {
  color: #606266;
  float: left;
  height: 80px;
  line-height: 80px;
  font-size: 13px;
  width: calc(100% - 2px);
  border: 1px solid #dcdfe6;
  border-bottom: 0px solid #dcdfe6;

  .label {
    float: left;
    width: 60px;
    color: #888888;
    text-align: right;
    padding-right: 10px;
  }

  .input {
    float: left;
  }
}

.btn {
  text-align: center;
  float: left;
  width: 100%;
  margin-top: 10px;

  .el-button {
    width: 100px;
    margin-right: 60px;
  }
}

.rolestable {
  background-color: #dcdfe6;
  width: 100%;

  tr {
  }

  td {
    padding: 6px 10px;
    background-color: #ffffff;
  }

  .name {
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    color: #606266;
  }

  .roles {
    font-size: 13px;
  }

  .tdbk {
    background-color: #f7f7f7 !important;
  }
}
</style>
