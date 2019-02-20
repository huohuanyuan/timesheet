/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-04 15:45:28 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-09-06 15:09:46
 * @instructions 部门管理 
 */
<template>
  <div class="component-wrap">
    <Row :gutter="16">
      <Col :md="6" :sm="8" :lg="4">
      <Tree :data="departmentTree" @on-select-change="depSelect"></Tree>
      <split></split>
      </Col>
      <Col :md="18" :sm="16" :lg="20">
      <Row :gutter="16">
        <div>
          <Col :md="8" :sm="24">
          <Input v-model.sync="deptListParams.deptName">
          <span slot="prepend"> 部门名称 </span>
          </Input>
          <split></split>
          </Col>
          <Col :md="8" :sm="24">
          <Input v-model.sync="deptListParams.deptCode">
          <span slot="prepend"> 部门编号 </span>
          </Input>
          <split></split>
          </Col>
          <Col :md="8" :sm="24">
          <div>
            <Button type="info" @click="getDepartmentList"> 查询 </Button>
            <Button @click="restFilter"> 重置 </Button>
          </div>
          <split></split>
          </Col>
        </div>
        <div class="department-wrap">
          <Col span="24">
          <Button type="info" @click="newDepartment('formNewDepartment')" v-if="privilegeData.DEP_ADD"> 新增 </Button>
          <split></split>
          <Table stripe :columns="columnsDepartment" :data="departmentData"></Table>
          <div class="page">
            <Page :total="paging.total" size="small" :current="paging.current" :page-size="paging.size" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
            </Page>
          </div>
          </Col>
        </div>
      </Row>
      </Col>
    </Row>
    <!-- 新建部门 -->
    <Modal v-model="departmentModal" title="添加部门信息" :mask-closable="false" :width="600">
      <Form ref="formNewDepartment" :model="formNewDepartment" :rules="departmentInline" class="from-department" :label-width="80">
        <Row :gutter="16">
          <Col span="24">
          <FormItem label="上级部门">
            <Input v-model.trim="currentDept.deptName" disabled></Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem prop="deptName" label="部门名称">
            <Input v-model.trim="formNewDepartment.deptName"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="24">
          <FormItem prop="description" label="部门描述">
            <Input v-model="formNewDepartment.description" type="textarea" :rows="2"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="newDepartmentSave('formNewDepartment')" :loading="loading" type="primary" long> 保存 </Button>
      </div>
    </Modal>
    <!-- 部门详情 -->
    <Modal v-model="departmentInfoModal" title="部门详情" width="800" :mask-closable="false" :width="800">
      <div>
        <Row>
          <Col span="12">部门名称：{{deptInfoData.deptName}}</Col>
          <Col span="12">部门编号：{{deptInfoData.deptCode}}</Col>
          <Col span="24" v-if="deptInfoData.description">部门描述：{{deptInfoData.description}}</Col>
        </Row>
        <split></split>
        <Row>
          <Table :columns="colDeptUser" :data="deptUserTableData"></Table>
          <div class="page">
            <Page :total="userPaging.total" size="small" :current="userPaging.current" :page-size="userPaging.size" show-elevator show-sizer show-total @on-change="changeUserPage" @on-page-size-change='changeUserPageSize'>
            </Page>
          </div>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="departmentInfoModal=false">关闭</Button>
      </div>
    </Modal>
    <!-- 部门修改 -->
    <Modal v-model="modifyDeptModal" title="修改部门信息" :mask-closable="false" class="dept-modify-model" :width="600">
      <Form ref="modifyDeptForm" :model="modifyDeptForm" :rules="modifyDeptRules" :label-width="80">
        <Row :gutter="16">
          <Col span="24">
          <FormItem label="部门编号">
            <Input v-model="modifyDeptForm.deptCode" disabled>

            </Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="部门名称" prop="deptName">
            <Input v-model="modifyDeptForm.deptName"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="24" class="textarea">
          <FormItem prop="description" label="部门描述">
            <Input type="textarea" v-model="modifyDeptForm.description" :rows="2"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="modifyDeptSave('modifyDeptForm')" :loading="loading" type="primary" long>保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  ApiGetDepartmentTree,
  ApiPostDept,
  ApiGetDeptList,
  ApiDeletDept,
  ApiGetDept,
  ApiPutDept,
  ApiGetDeptStaff
} from "@/api/competence/department-api";
import { resCode } from "@/api/code";
import split from "components/unit/split";

import moment from "moment";
import { privilege } from "common/js/privilege";
import qs from "qs";
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
          vm.remove(params.row.deptId);
        }
      }
    },
    [
      h(
        "Button",
        {
          style: {
            margin: "3px 2px"
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
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.edit(params.row.deptId);
        }
      }
    },
    "编辑"
  );
};
// 查看按钮
const viewButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "success",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.view(params.row.deptId);
        }
      }
    },
    "查看"
  );
};
export default {
  components: {
    split
  },
  data() {
    return {
      privilegeData: {
        DEP_ADD: false,
        DEP_VIEW_SUPER: false,
        DEP_EDIT_SUPER: false,
        DEP_DEL_SUPER: false,
        DEP_CAL_SUPER: false,
        DEP_VIEW: false,
        DEP_EDIT: false,
        DEP_DEL: false,
        DEP_CAL: false
      },
      loading: false, //加载中按钮标记
      departmentTree: [], //部门组织树
      formNewDepartment: {}, //新建部门表单数据
      modifyDeptForm: {}, //修改部门表单数据
      //新建部门表单验证
      departmentInline: {
        deptName: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 32,
            message: "部门名称不能超过32位",
            trigger: "blur"
          }
        ],
        description: [
          {
            type: "string",
            max: 128,
            message: "部门描述不能超过128位",
            trigger: "blur"
          }
        ]
      },
      //修改部门表单验证
      modifyDeptRules: {
        deptName: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 32,
            message: "部门名称不能超过32位",
            trigger: "blur"
          }
        ],
        description: [
          {
            type: "string",
            max: 128,
            message: "部门描述不能超过128位",
            trigger: "blur"
          }
        ]
      },

      //部门分页
      paging: {
        total: 0,
        current: 1,
        size: 10
      },
      //部门详情员工分页
      userPaging: {
        total: 0,
        current: 1,
        size: 10
      },
      //请求部门list参数
      deptListParams: {
        pageNum: 1,
        pageSize: 10,
        deptCode: "",
        deptName: ""
      },
      departmentModal: false,
      departmentInfoModal: false,
      modifyDeptModal: false,
      departmentData: [],
      currentDept: {
        //当前所在部门
        deptId: "",
        deptName: ""
      },
      //部门列表表头
      columnsDepartment: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.deptListParams.pageNum - 1) * vm.deptListParams.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "部门编号",
          key: "deptCode"
        },
        {
          title: "部门名称",
          key: "deptName"
        },

        {
          title: "创建时间",
          key: "createdtime",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.createdtime
                  ? moment(params.row.createdtime).format("YYYY-MM-DD")
                  : "";
              })(this)
            );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h("div", [
              viewButton(this, h, params),
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
      //单个部门下员工列表表头
      colDeptUser: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "员工编号",
          key: "staffCode"
        },
        {
          title: "员工名称",
          key: "name"
        },
        {
          title: "职位",
          key: "roleName"
        }
      ],
      //单个部门下员工列表data
      deptUserTableData: [],
      //部门详情
      deptInfoData: {}
    };
  },
  methods: {
    //部门列表分页控制
    handlePage(value) {
      this.deptListParams.pageNum = value;
      this.getDepartmentList();
    },
    handlePageSize(value) {
      this.deptListParams.pageSize = value;
      this.getDepartmentList();
    },
    //单个部门下所属员工列表分页控制
    changeUserPage(value) {
      this.userPaging.current = value;
      this.getDeptUserList();
    },
    changeUserPageSize(value) {
      this.userPaging.size = value;
      this.getDeptUserList();
    },
    //部门组织树上选中一个部门
    depSelect(msg) {
      this.currentDept.deptId = msg[0].deptId;
      this.currentDept.deptName = msg[0].title;
      this.deptListParams.deptId = msg[0].deptId;
      this.getDepartmentList();
    },
    // 重置
    restFilter() {
      this.deptListParams.deptName = "";
      this.deptListParams.deptCode = "";
      this.getDepartmentList();
    },
    //新建部门
    newDepartment(name) {
      this.departmentModal = true;
      this.$refs[name].resetFields();
      if (!this.currentDept.deptId) {
        this.currentDept.deptId = this.departmentTree[0].deptId;
        this.currentDept.deptName = this.departmentTree[0].title;
      }
    },
    //新建部门保存
    newDepartmentSave(name) {
      this.$refs[name].validate(valid => {
        var me = this;
        if (valid) {
          me.formNewDepartment.parentId = me.currentDept.deptId;
          me.loading = true;
          ApiPostDept(qs.stringify(me.formNewDepartment)).then(function(res) {
            me.loading = false;
            if (res.code == "success") {
              me.$Message.success("新增部门成功");
              me.departmentModal = false;
              me.getDepartmentList();
              me.getDepartmentTree();
            } else {
              if (resCode[res.code]) {
                me.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    //获取部门组织树
    getDepartmentTree() {
      let me = this;
      ApiGetDepartmentTree().then(function(res) {
        if (res.code == "success") {
          me.departmentTree = res.data;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //获取部门列表
    getDepartmentList() {
      let me = this;
      ApiGetDeptList(me.deptListParams).then(function(res) {
        if (res.code == "success") {
          me.departmentData = res.data;
          me.paging.total = res.total;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //查看部门详情
    view(id) {
      let me = this;
      this.departmentInfoModal = true;
      me.currentDept.deptId = id;
      me.getDeptUserList();
      ApiGetDept(me.currentDept.deptId).then(function(res) {
        if (res.code == "success") {
          me.deptInfoData = res.data;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //获取部门详情
    getDeptInfo() {
      let me = this;
      ApiGetDept(me.currentDept.deptId).then(function(res) {
        if (res.code == "success") {
          me.deptInfoData = res.data;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //获取单个部门下的员工列表
    getDeptUserList() {
      let me = this;
      let _params = {
        pageNum: me.userPaging.current,
        pageSize: me.userPaging.size,
        deptId: me.currentDept.deptId
      };
      ApiGetDeptStaff(_params).then(function(res) {
        me.deptUserTableData = res.data;
        me.userPaging.total = res.total;
      });
    },
    //删除部门
    remove(id) {
      let me = this;
      ApiDeletDept(id).then(function(res) {
        if (res.code == "success") {
          //如果当前表格数据只有一条，则请求上一页
          if (me.departmentData.length == 1) {
            me.deptListParams.pageNum =
              me.deptListParams.pageNum > 1 ? --me.deptListParams.pageNum : 1;
          }
          me.getDepartmentList();
          me.getDepartmentTree();
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 点击编辑，请求相求
    edit(id) {
      let me = this;
      this.$refs["modifyDeptForm"].resetFields();
      this.currentDept.deptId = id;
      ApiGetDept(me.currentDept.deptId).then(function(res) {
        if (res.code == "success") {
          me.modifyDeptForm.deptId = res.data.deptId;
          me.modifyDeptForm.deptName = res.data.deptName;
          me.modifyDeptForm.deptCode = res.data.deptCode;
          me.modifyDeptForm.description = res.data.description;
          me.modifyDeptModal = true;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 修改完成，点击保存
    modifyDeptSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let me = this;
          me.loading = true;
          ApiPutDept(qs.stringify(me.modifyDeptForm)).then(function(res) {
            me.loading = false;
            if (res.code == "success") {
              me.modifyDeptModal = false;
              me.getDepartmentList();
              me.getDepartmentTree();
            } else {
              if (resCode[res.code]) {
                me.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    init() {
      this.getDepartmentList();
      this.getDepartmentTree();
      let me = this;
      //获取三级菜单权限
      privilege(me.privilegeData).then(function(result) {
        me.privilegeData = result;
      });
    }
  },
  watch: {
    $route(to, from) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss">
@import "../../common/css/base";
@import "../../common/css/mixin";
</style>


