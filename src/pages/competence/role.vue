/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-04 15:45:02 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-07-12 14:01:40
 * @instructions 角色管理
 */
<template>
  <div class="role">
    <Row :gutter="16">
      <Col :md="10" :sm="12">
      <Input v-model="roleName">
      <span slot="prepend"> 角色名称 </span>
      </Input>
      </Col>
      <Col :md="12" :sm="12">
      <Button type="info" @click="getRoles"> 查询 </Button>
      <Button @click="resetRole"> 重置 </Button>
      </Col>
    </Row>
    <split></split>
    <div class="role-wrap">
      <div>
        <Button type="info" @click="newRole" v-if="pagePriData.ROLE_ADD"> 新增 </Button>
      </div>
      <split></split>
      <Table stripe :columns="columnsRole" :data="roleData"></Table>
      <div class="page">
        <Page :total="total" size="small" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
        </Page>
      </div>
    </div>
    <Modal v-model="roleModal" :title="roleTitle" :width="600" :mask-closable="false">
      <Form ref="formNewRole" :model="formNewRole" :rules="roleInline" class="from-role" :label-width="80">
        <Row :gutter="16">
          <Col span="24">
          <FormItem label="角色名称" prop="roleName">
            <Input v-model="formNewRole.roleName"></Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="角色类型">
            <RadioGroup v-model="formNewRole.categoryCode" @on-change="switchRoleTemplate">
              <Radio label="management">行政</Radio>
              <Radio label="study">项目</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="24" v-show="roleTempShow">
          <FormItem prop="roleTempId" label="角色模板">
            <Select v-model="formNewRole.roleTempId">
              <Option v-for="item in roleTemplateList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem prop="description" label="角色描述">
            <Input v-model="formNewRole.description" type="textarea" :rows="4"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="postRole('formNewRole')">保存</Button>
      </div>
    </Modal>
    <Modal v-model="privilegeModal" title="权限分配" :mask-closable="false">
      <Tree :data="privilegeData" show-checkbox multiple ref="tree"></Tree>
      <div slot="footer">
        <Button type="primary" size="large" long @click="getCheckedNodes">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
// 删除按钮
const deleteButton = (vm, h, params) => {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title: "您确定要删除这条数据吗?",
        transfer: true
      },
      on: {
        "on-ok": () => {
          vm.deleteRole(params.row.roleId);
        }
      }
    },
    [
      h(
        "Button",
        {
          style: {
            marginRight: "5px"
          },
          props: {
            type: "error",
            placement: "top",
            size: "small"
          }
        },
        "删除"
      )
    ]
  );
};
// 编辑按钮
const editButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.$refs["formNewRole"].resetFields();
          vm.getRoleCon(params.row.roleId);
        }
      }
    },
    "编辑"
  );
};
// 权限按钮
const assignButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "success",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.getRolePrivilege(params.row.roleId);
        }
      }
    },
    "权限"
  );
};
import {
  ApiGetRoleTemplate,
  ApiPostRole,
  ApiGetRoles,
  ApiDeletRole,
  ApiGetRoleCon,
  ApiPutRole,
  ApiGetRolePrivilege,
  ApiPutPrivilege
} from "@/api/competence/role-api";
import qs from "qs";
import split from "components/unit/split";
import { privilege } from "common/js/privilege";
import { resCode } from "@/api/code";
export default {
   components: {
    split
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "title"
      },
      roleTitle:"",
      pagePriData: {
        //页面权限
        ROLE_ADD: false
      },
      total: 0,
      pageNum: 1,
      pageSize: 10,
      roleData: [],
      roleId: "",
      roleName: "",
      managementData: [],
      studyData: [],
      roleTempShow: true,
      columnsRole: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "角色名称",
          key: "roleName",
          align: "center"
        },
        {
          title: "角色类型",
          key: "categoryCode",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.categoryCode == "management"
                  ? "行政"
                  : "项目";
              })(this)
            );
          }
        },
        {
          title: "角色描述",
          key: "description",
          className: "description-column",
          align: "center",
          width: 320,
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    type: "text",
                    content: params.row.description,
                    className: "tooltip-hover"
                  }
                },
                params.row.description
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 280,
          align: "center",
          render: (h, params) => {
            return h("div", [
              (function(vm) {
                if (params.row.allowAsgPerms) {
                  return assignButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                if (params.row.allowEdit) {
                  return editButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                if (params.row.allowDel) {
                  return deleteButton(vm, h, params);
                }
              })(this)
            ]);
          }
        }
      ],
      roleModal: false,
      privilegeModal: false,
      privilegeData: [],
      formNewRole: {
        roleName: "",
        categoryCode: "management",
        description: "",
        roleTempId: ""
      },
      roleInline: {
        roleName: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 32,
            message: "角色名称不能超过32位",
            trigger: "blur"
          }
        ],
        description: [
          {
            type: "string",
            max: 128,
            message: "角色描述不能超过128位",
            trigger: "blur"
          }
        ]
      },
      roleTemplateList: [],
      oldCheckedNodes: []
    };
  },
  methods: {
    init() {
      let me = this;
      this.getRoles();
      //获取三级菜单权限
      privilege(me.pagePriData).then(function(result) {
        me.pagePriData = result;
      });
    },
    //分页
    handlePage(value) {
      this.pageNum = value;
      this.getRoles();
    },
    handlePageSize(value) {
      this.pageSize = value;
      this.getRoles();
    },
    // 点击 新增按钮
    newRole() {
      this.getRoleTemplate();
    },
    // 获取 角色模版
    getRoleTemplate() {
      let _this = this;
      _this.roleId = "";
      _this.managementData = [];
      _this.studyData = [];
      _this.roleModal = true;
      _this.roleTitle = "添加角色信息";
      _this.roleTempShow = true;
      _this.handleReset("formNewRole");
      ApiGetRoleTemplate().then(function(res) {
        if (res.code == "success") {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].categoryCode == "management") {
              _this.managementData.push(res.data[i]);
              _this.roleTemplateList = _this.managementData;
            } else {
              _this.studyData.push(res.data[i]);
            }
          }
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 选择角色类型
    switchRoleTemplate() {
      if (this.formNewRole.categoryCode == "management") {
        this.roleTemplateList = this.managementData;
      } else if (this.formNewRole.categoryCode == "study") {
        this.roleTemplateList = this.studyData;
      }
    },
    // 获取 角色列表
    getRoles() {
      let _this = this;
      ApiGetRoles({
        pageNum: _this.pageNum,
        pageSize: _this.pageSize,
        roleName: _this.roleName
      }).then(function(res) {
        if (res.code == "success") {
          _this.roleData = res.data;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].description == "") {
              res.data[i].description = "暂无";
            }
          }
          _this.total = res.total;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 新增角色，保存提交 / 修改角色，保存提交
    postRole(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let _this = this;
          if (_this.roleId !== "") {
            ApiPutRole(qs.stringify(_this.formNewRole)).then(function(res) {
              if (res.code == "success") {
                _this.$Message.success("添加成功!");
                _this.roleModal = false;
                _this.getRoles();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          } else {
            delete _this.formNewRole.roleId;
            ApiPostRole(qs.stringify(_this.formNewRole)).then(function(res) {
              if (res.code == "success") {
                _this.$Message.success("添加成功!");
                _this.roleModal = false;
                _this.getRoles();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        }
      });
    },
    // 获取权限
    getRolePrivilege(roleId) {
      let _this = this;
      _this.roleId = "";
      ApiGetRolePrivilege(roleId).then(function(res) {
        if (res.code == "success") {
          _this.privilegeModal = true;
          _this.privilegeData = res.data;
          _this.roleId = roleId;
          _this.oldCheckedNodes = [];
          // 等待视图渲染完成后执行
          _this.$nextTick(function() {
            let checkedNodes = _this.$refs.tree.getCheckedNodes();
            for (let i = 0; i < checkedNodes.length; i++) {
              _this.oldCheckedNodes.push(checkedNodes[i].menuId);
            }
          });
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 修改权限完成后，点击保存
    getCheckedNodes() {
      let newCheckedNodes = [];
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      for (let i = 0; i < checkedNodes.length; i++) {
        newCheckedNodes.push(checkedNodes[i].menuId);
      }
      for (var i = 0; i < this.oldCheckedNodes.length; i++) {
        for (var j = 0; j < newCheckedNodes.length; j++) {
          if (this.oldCheckedNodes[i] == newCheckedNodes[j]) {
            this.oldCheckedNodes.splice(i, 1);
            newCheckedNodes.splice(j, 1);
            j = j - 1;
          }
        }
      }
      let delPrivileges = this.oldCheckedNodes;
      let addPrivileges = newCheckedNodes;
      var data = {
        roleId: this.roleId,
        delPrivileges: this.oldCheckedNodes,
        addPrivileges: newCheckedNodes
      };
      let _this = this;
      ApiPutPrivilege(qs.stringify(data, { arrayFormat: "brackets" })).then(
        function(res) {
          if (res.code == "success") {
            _this.$Message.success("修改成功!");
            _this.privilegeModal = false;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        }
      );
    },
    // 获取 角色详情
    getRoleCon(roleId) {
      let _this = this;
      _this.roleTempShow = false;
      ApiGetRoleCon(roleId).then(function(res) {
        if (res.code == "success") {
          _this.formNewRole = res.data;
          _this.roleModal = true;
          _this.roleTitle = "修改角色信息";
          _this.roleId = roleId;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 删除角色
    deleteRole(roleId) {
      let _this = this;
      ApiDeletRole(roleId).then(function(res) {
        if (res.code == "success") {
          //如果当前表格数据只有一条，则请求上一页
          if (_this.roleData.length == 1) {
            _this.pageNum = _this.pageNum > 1 ? --_this.pageNum : 1;
          }
          _this.getRoles();
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 重置
    resetRole() {
      this.roleName = "";
      this.getRoles();
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  },
  watch: {
    $route(to, from) {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss">
@import "../../common/css/base";

.from-role {
  padding: 0 20px;
  .category-code {
    margin-bottom: 20px;
  }
  button {
    margin-top: 20px;
  }
}
.description-column {
  .ivu-tooltip-rel {
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ivu-tooltip-inner {
    white-space: inherit;
  }
}
</style>

