/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-04 15:43:25 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-01-31 14:22:53
 * @instructions 用户管理
 */
<template>
  <div>
    <Row :gutter="16">
      <Col :md="6" :sm="8" :lg="4">
      <Tree :data="departmentTree" @on-select-change="depSelect"></Tree>
      <split></split>
      </Col>
      <Col :md="18" :sm="16" :lg="20">
      <div class="user-manage">
        <Row :gutter="16">
          <Col :md="6" :sm="24">
          <Input v-model="userListPrames.name">
          <span slot="prepend">姓名</span>
          </Input>
          <split></split>
          </Col>
          <Col :md="6" :sm="24">
          <Input v-model="userListPrames.staffNumber">
          <span slot="prepend">工号</span>
          </Input>
          <split></split>
          </Col>
          <Col :md="6" :sm="24">
          <Input v-model="userListPrames.lineManagerName">
          <span slot="prepend">直属领导</span>
          </Input>
          <split></split>
          </Col>
          <Col :md="6" :sm="24">
          <div>
            <Button type="info" @click="seach">查询</Button>
            <Button @click="restFilter">重置</Button>
          </div>
          <split></split>
          </Col>
        </Row>
        <!-- <div>
          <Button type="info" @click="newUser('newuserForm')" v-if="privilegeData.USER_ADD">新增</Button>
          <Button type="info" v-if="privilegeData.USER_IMPT" @click="getReportTemplate"> 下载模板 </Button>
          <Button type="info" @click="uploadFile" v-if="privilegeData.USER_IMPT">导入</Button>
          <Button type="info" v-if="privilegeData.USER_EXPT" @click="reportStaffExport"> 导出 </Button>
        </div> -->
        <split></split>
        <div>
          <Table stripe :columns="userTableTitle" :data="userTableData" ref="userTable"></Table>
      
            <div class="page">
              <Page :total="paging.total" :current="paging.current" :page-size="paging.size" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-elevator show-sizer show-total></Page>
            </div>
       
        </div>
      </div>
      </Col>
    </Row>
    <!-- 修改用户modal -->
    <Modal v-model="modifyUserModal" title="修改用户" class="user-modify-model" :width="800" :mask-closable="false">
      <!-- 修改用户基本信息 -->
      <Tabs type="card" @on-click="tabChange" v-model="tabName">
        <TabPane label="基本信息" name="staffInfo">
          <Form ref="modifyUserForm" :model="modifyUserForm"  :label-width="80">
            <Row :gutter="16">
              <Col :xs="24" :sm="12">
              <FormItem label="公司">
                <Input v-model="company" disabled>
                </Input>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem prop="name" label="姓名">
                <Input v-model="modifyUserForm.name" disabled>
                </Input>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem prop="staffNumber" label="工号">
                <Input v-model.trim="modifyUserForm.staffNumber" disabled>
                </Input>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem class="radios" label="性别">
                <RadioGroup v-model="modifyUserForm.gender">
                  <Radio v-for="(item,index) in genderList" :label="item.dictionaryId" :key="index" disabled>
                    {{item.dictionaryName}}
                  </Radio>
                </RadioGroup>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem label="直属领导">
                <Input v-model.trim="modifyUserForm.lineManageName" disabled>
                </Input>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem label="角色" prop="roleId">
                <Select v-model.sync="modifyUserForm.roleId">
                  <Option v-for="item in roleList" :value="item.roleId" :key="item.roleName">{{ item.roleName }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem prop="email" label="邮箱">
                <Input v-model.trim="modifyUserForm.email" disabled>
                </Input>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem prop="mobile" label="手机">
                <Input v-model.trim="modifyUserForm.mobile" disabled>
                </Input>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem prop="entryDate" label="入职日期">
                <DatePicker :editable='false' :clearable='false' type="date" v-model="modifyUserForm.entryDate" disabled readonly></DatePicker>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem label="出生日期">
                <DatePicker :editable='false' type="date" prop="birthday" v-model="modifyUserForm.birthday" disabled readonly></DatePicker>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem label="考勤组">
                <Select v-model="modifyUserForm.attendanceGroupId">
                  <Option v-for="item in groupCompanyList" :value="item.attendanceGroupId" :key="item.attendanceGroupId">{{ item.attendanceGroupName }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem label="申报周期">
                <Select v-model="modifyUserForm.ruleId">
                  <Option v-for="item in ruleCompanyList" :value="item.ruleId" :key="item.ruleId">{{ item.ruleName }}</Option>
                </Select>
              </FormItem>
              </Col>

               <Col :xs="24" :sm="12">
              <FormItem label="职位">
                <Select v-model="modifyUserForm.positionId" @on-change='selectRank'>
                  <Option v-for="item in rankList" :value="item.positionId" :key="item.positionId">{{ item.positionName }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem label="级别">
                <Select v-model="modifyUserForm.positionLevelId" ref="level">
                  <Option v-for="item in levelList" :value="item.positionLevelId" :key="item.positionLevelId">{{ item.positionLevelName }}</Option>
                </Select>
              </FormItem>
              </Col>
               <Col :xs="24" :sm="12">
              <FormItem label="地区">
                {{modifyUserForm.countryName == null ? "暂无" :modifyUserForm.countryName }}
              </FormItem>
              </Col>
              <Col :xs="24" :sm="12">
              <FormItem label="城市">
                {{modifyUserForm.cityName == null ? "暂无" :modifyUserForm.cityName }}
              </FormItem>
              </Col>
              <Col :xs="24" :sm="24">
              <FormItem prop="address" label="地址">
                <Input v-model.trim="modifyUserForm.address" disabled>
                </Input>
              </FormItem>
              </Col>
              <Col span="24">
              <Button @click="modifyUserSave('modifyUserForm')" :loading="loading" long type="primary">保存</Button>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <!-- 修改用户假期信息 -->
        <TabPane label="假期信息" name="staffLeave">
          <Table :columns="leaveTableCol" :data="leaveTableData"></Table>

        </TabPane>
      </Tabs>
      <div slot="footer">
      </div>
    </Modal>
    <!-- 用户信息 -->
    <Modal title="用户详情" v-model="userInfoModal" class="user-info-model">
      <div class="wrap">
        <div class="basic-msg">
          <ul>
            <li>
              <label>工号：</label>
              <span>{{userInfoData.staffNumber}}</span>
            </li>
            <li>
              <label>姓名：</label>
              <span>{{userInfoData.name}}</span>
            </li>
            <li>
              <label>直属领导：</label>
              <span>{{userInfoData.lineManageName}}</span>
            </li>
              <li>
              <label>职位：</label>
              <span>{{userInfoData.positionName}}</span>
            </li>
              <li>
              <label>级别：</label>
              <span>{{userInfoData.positionLevelName}}</span>
            </li>
            <li>
              <label>考勤组：</label>
              <span>{{userInfoData.attendanceGroupName == null ? "暂无" :userInfoData.attendanceGroupName}}</span>
            </li>
            <li>
              <label>申报周期：</label>
              <span>{{userInfoData.ruleName == null ? "暂无" :userInfoData.ruleName}}</span>
            </li>
            <li>
              <label>性别：</label>
              <span>{{userInfoData.genderCode}}</span>
            </li>
            <li>
              <label>生日：</label>
              <span>{{userInfoData.birthday | moment}}</span>
            </li>
            <li>
              <label>邮箱：</label>
              <span>{{userInfoData.email}}</span>
            </li>
            <li>
              <label>手机：</label>
              <span>{{userInfoData.mobile}}</span>
            </li>

          </ul>
          <div class="img-wrap">
            <img :src="userInfoData.resourcePath">
          </div>
        </div>
        <div>
          <ul>
            <li v-if="userInfoData.countryName">
              <label>地区：</label>
              <span>{{userInfoData.countryName}}</span>
            </li>
            <li v-if="userInfoData.cityName">
              <label>城市：</label>
              <span>{{userInfoData.cityName}}</span>
            </li>
            <li>
              <label>角色：</label>
              <span>{{userInfoData.roleName}}</span>
            </li>
            <li>
              <label>入职日期：</label>
              <span>{{userInfoData.entryDate | moment }}</span>
            </li>
            <li>
              <label>地址：</label>
              <span>{{userInfoData.address}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <Button @click="userInfoModal=false">关闭</Button>
      </div>
    </Modal>
    <!--  导入员工 -->
    <Modal title="导入员工" v-model="listImportModal">
      <Upload ref="upload" :with-credentials='true' type="drag" :show-upload-list="false" :before-upload="handleUpload" :headers="header" :format="['xls','xlsx']" :on-format-error="handleFormatError" :action="actionSrc" :on-success='uploadSuccess'>
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或者拖拽文件上传</p>
        </div>
      </Upload>
      <p> 注：只能导入和模版格式相同的Excel 文件</p>
      <div class="file-list" v-if="file != null">
        <span class="file-span"> 上传文件：</span>
        <p class="upload-list-file">
          <Icon type="document-text"></Icon>
          <span class="file-name-span"> {{ file.name }} </span>
          <span class="close" @click="delectFile">
            <Icon type="ios-close-empty"></Icon>
          </span>
        </p>
        <Button class="update-btn" type="ghost" icon="ios-cloud-upload-outline" @click="upload" long> 上传 </Button>
      </div>
      <div>
        <p v-show="fileTile.dupEmails"> 邮箱重复：{{ fileData.dupEmails}} </p>
        <p v-show="fileTile.dupMobiles"> 电话重复：{{ fileData.dupMobiles}} </p>
        <p v-show="fileTile.dupStaffNumber"> 员工工号重复：{{ fileData.dupStaffNumber}} </p>
        <p v-show="fileTile.notExistsDeptCodes"> 不存在的部门编号：{{ fileData.notExistsDeptCodes}} </p>
        <p v-show="fileTile.notExistsRoleNames"> 不存在的角色名称：{{ fileData.notExistsRoleNames}} </p>
        <p v-show="fileTile.notExistsLineManagers"> 不存在的直属领导：{{ fileData.notExistsLineManagers}} </p>
        <p v-show="fileTile.errCoordinate"> 错误坐标：{{ fileData.errCoordinate}} </p>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import split from "components/unit/split";
import moment from "moment";
import { ApiGetDict, ApiGetCountry, ApiGetCity } from "@/api/api";
import { ApiGetDepartmentTree } from "@/api/competence/department-api";
import {
  ApiPostUser,
  ApiGetUsers,
  ApiPutActiveUser,
  ApiGetUserInfo,
  ApiGetUserRoleList,
  ApiPutUserInfo,
  ApiDeleteUser,
  ApiGetAttendanceGroupCompany,
  ApiGetCycleRuleCompany,
  ApiGetManger,
  ApiGetLeaveStaff,
  ApiPutLeaveStaff,
  ApiGetPositionList,
  ApiGetPosLevel
} from "@/api/competence/user-api";

import qs from "qs";
import { resCode } from "@/api/code";
import { privilege } from "common/js/privilege";

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
          vm.edit(params.row.staffId);
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
          vm.view(params.row.staffId);
        }
      }
    },
    "查看"
  );
};
// 假期余额
const balancetaffInput = (vm, h, params) => {
  return h("InputNumber", {
    props: {
      min: 0,
      step: 1,
      value: params.row.balance
    },
    on: {
      "on-blur": value => {
        vm.modifyLeaveSave(
          params.row.staffId,
          params.row.leaveStaffId,
          params.row.balance,
          event.target.value
        );
      }
    }
  });
};
export default {
  components: {
    split
  },
  data() {
    return {
      file: null,
      header: {
        Authorization: localStorage.getItem("token")
      },
      fileData: {
        dupEmails: "",
        dupMobiles: "",
        dupStaffNumber: "",
        notExistsDeptCodes: "",
        notExistsRoleNames: "",
        notExistsLineManagers: "",
        errCoordinate: ""
      },
      fileTile: {
        dupEmails: false,
        dupMobiles: false,
        dupStaffNumber: false,
        notExistsDeptCodes: false,
        notExistsRoleNames: false,
        notExistsLineManagers: false,
        errCoordinate: false
      },
      privilegeData: {
        USER_ADD: false,
        USER_EXPT: false,
        USER_IMPT: false,
        USER_VIEW_SUPER: false,
        USER_EDIT_SUPER: false,
        USER_DEL_SUPER: false,
        USER_AC_SUPER: false,
        USER_VIEW: false,
        USER_EDIT: false,
        USER_DEL: false,
        USER_AC: false
      },
      loading: false, //加载中按钮标记
      // newUserModal: false,
      modifyUserModal: false,
      userInfoModal: false,
      listImportModal: false,
      company: "",
      departmentTree: [],
      countryList: [],
      cityList: [],
      genderList: [],
      roleList: [],
      currentDept: {
        deptId: "",
        deptName: ""
      },
      //用户列表title
      userTableTitle: [
        {
          title: "序号",
          width: 60,
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.userListPrames.pageNum - 1) * vm.userListPrames.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "工号",
          key: "staffNumber"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "性别",
          key: "genderCode"
        },
        {
          title: "职位",
          key: "job"
        },
        {
          title: "直属领导",
          key: "lineManagerName"
        },
        {
          title: "入职日期",
          key: "entryDate",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.entryDate
                  ? moment(params.row.entryDate).format("YYYY-MM-DD")
                  : "";
              })(this)
            );
          }
        },
        {
          title: "部门",
          key: "deptName"
        },

        {
          title: "状态",
          key: "activated",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.activated ? "激活" : "冻结";
              })(this)
            );
          }
        },
        {
          title: "操作",
          key: "activated",
          width: 130,
          render: (h, params) => {
            return h("div", [
              viewButton(this, h, params),
              (function(vm) {
                if (params.row.allowEdit) {
                  return editButton(vm, h, params);
                }
              })(this)
            ]);
          }
        }
      ],
      //用户列表数据
      userTableData: [],
      //分页
      paging: {
        total: 0,
        current: 1,
        size: 10
      },
      //请求用户列表参数
      userListPrames: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        staffNumber: "",
        deptId: "",
        lineManagerName: ""
      },
      //新建用户表单数据
      newuserForm: {
        name: "",
        staffNumber: "",
        email: "",
        gender: "",
        birthday: "",
        mobile: "",
        countryId: "",
        cityId: "",
        entryDate: "",
        address: "",
        roleId: "",
        lineManage: "",
        attendanceGroupId: "",
        ruleId: ""
      },
      modifyUserId: "", //修改用户id
      //用户基本信息
      modifyUserForm: {
        name: "",
        staffNumber: "",
        email: "",
        gender: "",
        birthday: "",
        mobile: "",
        countryId: "",
        cityId: "",
        entryDate: "",
        address: "",
        roleId: "",
        deptIdList: [],
        lineManage: "",
        lineManageName: "",
        attendanceGroupId: "",
        ruleId: ""
      },
      //新建用户表单验证
      newuserRule: {
        name: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            max: 16,
            message: "姓名长度不能超过16位",
            trigger: "blur"
          }
        ],
        staffNumber: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            max: 16,
            message: "姓名长度不能超过16位",
            trigger: "blur"
          }
        ],
        roleId: [
          {
            required: true,
            type: "number",
            message: " ",
            trigger: "change"
          }
        ],

        email: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          },
          {
            max: 64,
            message: "邮箱长度不能超过64位",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            len: 11,
            message: "手机号格式不正确",
            trigger: "blur"
          },
          {
            type: "number",
            trigger: "blur",
            message: "手机号格式不正确",
            transform(value) {
              return Number(value);
            }
          }
        ],

        entryDate: [
          {
            required: true,
            message: " ",
            type: "date",
            trigger: "change"
          }
        ],

        address: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            max: 256,
            message: "地址长度不能超过256个字符",
            trigger: "blur"
          }
        ]
      },
      tabName: "staffInfo", //修改用户是默认打开的tab名
      //用户假期table列
      leaveTableCol: [
        {
          title: "序号",
          width: 60,
          align: "center",
          type: "index"
        },
        {
          title: "假期类型名称",
          key: "leaveName",
          align: "center"
        },
        {
          title: "时长计算方式",
          key: "leaveUnit",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                switch (params.row.leaveUnit) {
                  case "DAY":
                    return "天";

                  case "HALF_DAY":
                    return "半天";
                  case "HOUR":
                    return "小时";
                }
              })(this)
            );
          }
        },
        {
          title: "时长类型",
          key: "leaveWorkingDay",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.leaveWorkingDay) {
                  return "工作日";
                } else {
                  return "自然日";
                }
              })(this)
            );
          }
        },
        {
          title: "假期余额",
          key: "balance",
          align: "center",
          render: (h, params) => {
            return h("div", [
              (function(vm) {
                return balancetaffInput(vm, h, params);
              })(this)
            ]);
          }
        }
      ],
      //用户假期table数据
      leaveTableData: [],
      //用户详情
      userInfoData: {},
      modifyInfoData: {},
      leadership: {
        name: "",
        staffNumber: "",
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      leadershipName: "",
      leadershipData: [],
      leadershipCon: {},
      columnsLeadership: [
        {
          title: " ",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "工号",
          key: "staffNumber"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "部门",
          key: "deptName"
        },
        {
          title: "性别",
          key: "genderCode"
        }
      ],
      groupCompanyList: [],
      ruleCompanyList: [],
      rankList:[],
      levelList:[]
    };
  },
  methods: {
    // 上传文件之前
    handleUpload(file) {
      this.file = file;
      return false;
    },
    // 上传文件
    upload() {
      this.$refs.upload.post(this.file);
    },
    // 删除文件
    delectFile() {
      this.file = null;
    },
    seach() {
      this.userListPrames.pageNum = 1;
      this.getUserList();
    },
   
    uploadSuccess(res, file) {
      if (res.data.dupEmails) {
        if (res.data.dupEmails.length > 0) {
          this.fileTile.dupEmails = true;
          this.fileData.dupEmails = res.data.dupEmails.toString();
        }
      }
      if (res.data.dupMobiles) {
        if (res.data.dupMobiles.length > 0) {
          this.fileTile.dupMobiles = true;
          this.fileData.dupMobiles = res.data.dupMobiles.toString();
        }
      }
      if (res.data.dupStaffNumber) {
        if (res.data.dupStaffNumber.length > 0) {
          this.fileTile.dupStaffNumber = true;
          this.fileData.dupStaffNumber = res.data.dupStaffNumber.toString();
        }
      }
      if (res.data.notExistsDeptCodes) {
        if (res.data.notExistsDeptCodes.length > 0) {
          this.fileTile.notExistsDeptCodes = true;
          this.fileData.notExistsDeptCodes = res.data.notExistsDeptCodes.toString();
        }
      }
      if (res.data.notExistsRoleNames) {
        if (res.data.notExistsRoleNames.length > 0) {
          this.fileTile.notExistsRoleNames = true;
          this.fileData.notExistsRoleNames = res.data.notExistsRoleNames.toString();
        }
      }
      if (res.data.notExistsLineManagers) {
        if (res.data.notExistsLineManagers.length > 0) {
          this.fileTile.notExistsLineManagers = true;
          this.fileData.notExistsLineManagers = res.data.notExistsLineManagers.toString();
        }
      }
      if (res.data.errCoordinate) {
        if (res.data.errCoordinate.length > 0) {
          this.fileTile.errCoordinate = true;
          this.fileData.errCoordinate = res.data.errCoordinate.toString();
        }
      }

      //用户管理的导入成功之后的回调
      if (res.code == "success") {
        if (res.data.successCount) {
          this.$Message.info("导入成功" + res.data.successCount + "条");
        }
        this.file = null;
        this.getUserList();
      } else if (res.code == "fail") {
        this.$Message.error(res.msg);
      }
    },
    // 上传文件的格式验证
    handleFormatError(file) {
      this.$Message.warning(file.name + "的文件格式不正确，请选择xls或xlsx!");
    },
    // 直属领导的分页
    handlePageLeadership(value) {
      this.leadership.pageNum = value;
      this.DirectLeadership();
    },
    handlePageSizeLeadership(value) {
      this.leadership.pageSize = value;
      this.DirectLeadership();
    },
    //  ---- 查询公司职位下拉列表
    getPositionList(){
      ApiGetPositionList().then(res=> {
        if (res.code == "success") {
          this.rankList = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 选择 职位 触发的方法
    selectRank(value){
      if(value){
        this.getPosLevel(value);
      }
    },
    // 获取职级信息
    getPosLevel(value){
      this.$refs.level.clearSingleSelect();
      ApiGetPosLevel(value).then(res=> {
        if (res.code == "success") {
          this.levelList = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //获取人员列表
    getUserList() {
      let me = this;
      ApiGetUsers(me.userListPrames).then(function(res) {
        if (res.code == "success") {
          me.paging.total = res.total;
          me.userTableData = res.data;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 分页
    changePage(current) {
      this.userListPrames.pageNum = current;
      this.getUserList();
    },
    changePageSize(size) {
      this.userListPrames.pageSize = size;
      this.getUserList();
    },
    /**
     * @param  {Arr} msg 当前选中的树形 数据
     */
    depSelect(msg) {
      this.userListPrames.deptId = msg[0].deptId;
      this.currentDept.deptId = msg[0].deptId;
      this.currentDept.deptName = msg[0].title;
      this.getUserList();
    },
    // 重置
    restFilter() {
      this.userListPrames.name = "";
      this.userListPrames.staffNumber = "";
      this.userListPrames.lineManagerName = "";
      this.getUserList();
    },
    // 检索公司考勤组信息
    getAttendanceGroupCompany() {
      let _this = this;
      ApiGetAttendanceGroupCompany().then(function(res) {
        if (res.code == "success") {
          _this.groupCompanyList = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 检索公司申报周期规则信息
    getCycleRuleCompany() {
      let _this = this;
      ApiGetCycleRuleCompany().then(function(res) {
        if (res.code == "success") {
          _this.ruleCompanyList = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //查看
    view(id) {
      var me = this;
      this.userInfoModal = true;
      me.userInfoData = [];
      ApiGetUserInfo(id).then(function(res) {
        if (res.code == "success") {
          me.userInfoData = res.data;
          if (res.data.resourcePath) {
            me.userInfoData.resourcePath = res.data.resourcePath;
          } else {
            me.userInfoData.resourcePath = require("../../common/img/default-avatar.png");
          }
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    handleChange(value) {
      this.modifyUserForm.deptId = value.pop();
    },
    //编辑基本信息
    edit(id) {
      this.getAttendanceGroupCompany();
      this.getCycleRuleCompany();
      this.modifyUserModal = true;
      this.$refs["modifyUserForm"].resetFields();
      this.modifyUserId = id;
      this.tabName = "staffInfo";
      this.userInfoData = [];
      this.getPositionList();
      //获取基本信息
      ApiGetUserInfo(id).then(res=> {
        if (res.code == "success") {  
          this.modifyUserForm = res.data;   
           if(res.data.positionId !== null){
            this.getPosLevel(res.data.positionId);
          }        
          this.modifyLeadershipName = res.data.lineManageName;
          if (this.modifyUserForm.entryDate) {
            this.modifyUserForm.entryDate = moment(res.data.entryDate).format(
              "YYYY-MM-DD"
            );
          }
          if (this.modifyUserForm.birthday) {
            this.modifyUserForm.birthday = moment(res.data.birthday).format(
              "YYYY-MM-DD"
            );
          }
          
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //修改用户基本信息保存
    modifyUserSave(name) {
      this.$refs[name].validate(valid => {
        let me = this;
        let flag = true;
        if (valid) {
          //判断入职日期在出生日期之后
          if (me.modifyUserForm.entryDate && me.modifyUserForm.birthday) {
            if (
              moment(me.modifyUserForm.entryDate).isBefore(
                me.modifyUserForm.birthday
              )
            ) {
              flag = false;
              me.$Message.error("出生日期不能在入职日期之后");
            }
          }

          if (flag) {
            me.loading = true;
            //提交参数
            let params = {};
            params.deptId = me.modifyUserForm.deptIdList.pop();
            params.staffId = me.modifyUserForm.staffId;
            params.name = me.modifyUserForm.name;
            params.email = me.modifyUserForm.email;
            params.staffNumber = me.modifyUserForm.staffNumber;
            params.gender = me.modifyUserForm.gender;
            params.mobile = me.modifyUserForm.mobile;
            params.countryId = me.modifyUserForm.countryId;
            params.cityId = me.modifyUserForm.cityId;
            params.address = me.modifyUserForm.address;
            params.roleId = me.modifyUserForm.roleId;
            params.lineManager = me.modifyUserForm.lineManage;
            params.attendanceGroupId = me.modifyUserForm.attendanceGroupId;
            params.ruleId = me.modifyUserForm.ruleId;
            params.positionId = me.modifyUserForm.positionId;
            params.positionLevelId = me.modifyUserForm.positionLevelId;
            if (me.modifyUserForm.entryDate) {
              params.entryDate = moment(me.modifyUserForm.entryDate).format(
                "YYYY-MM-DD"
              );
            }
            if (me.modifyUserForm.birthday) {
              params.birthday = moment(me.modifyUserForm.birthday).format(
                "YYYY-MM-DD"
              );
            }
            ApiPutUserInfo(qs.stringify(params)).then(function(res) {
              me.loading = false;
              if (res.code == "success") {
                me.$Message.success("修改用户成功");
                me.getUserList();
                me.modifyUserModal = false;
              } else {
                if (resCode[res.code]) {
                  me.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        }
      });
    },
    /**
     * 修改用户假期余额保存
     * @param  {Number} staffId  当前员工 ID
     * @param  {Number} leaveStaffId
     * @param  {String} balanceValue 修改前 的假期余额
     * @param  {String} value 修改后 的假期余额
     */
    modifyLeaveSave(staffId, leaveStaffId, balanceValue, value) {
      // let reg = /^\d+(\.\d{1,2})?$/;  // 保留小数点后一位/两位
      let reg = /^([1-9]\d*|0)(\.\d{1})?$/;

      if (balanceValue == value) {
        return false;
      } else if (!reg.test(value)) {
        this.$Message.warning("小数点后面只能保留一位小数！");
      } else {
        let data = {
          staffId: staffId,
          leaveStaffId: leaveStaffId,
          balance: value
        };
        ApiPutLeaveStaff(qs.stringify(data)).then(res => {
          if (res.code == "success") {
            this.$Message.success("修改成功");
            this.tabChange("staffLeave");
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    // 获取假期信息
    tabChange(name) {
      let me = this;
      if (name == "staffLeave") {
        ApiGetLeaveStaff(me.modifyUserId).then(function(res) {
          if (res.code == "success") {
            me.leaveTableData = res.data;
          } else {
            if (resCode[res.code]) {
              me.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    // 获取左侧树
    getDepartmentTree() {
      let me = this;
      ApiGetDepartmentTree().then(function(res) {
        if (res.code == "success") {
          me.departmentTree = res.data;
          me.currentDept.deptId = res.data[0].deptId;
          me.currentDept.deptName = res.data[0].title;
          me.company = res.data[0].title;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取城市
    getCity(id) {
      let me = this;
      if (id) {
        ApiGetCity(id).then(function(res) {
          if (res.code == "success") {
            me.cityList = res.data;
          } else {
            if (resCode[res.code]) {
              me.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },

    // 获取直属领导
    DirectLeadership() {
      let _this = this;
      ApiGetManger(_this.leadership).then(function(res) {
        if (res.code == "success") {
          _this.leadershipData = res.data;
          _this.leadership.total = res.total;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //清除 信息
    resetLeadership() {
      this.leadership.staffNumber = "";
      this.leadership.name = "";
      this.DirectLeadership();
    },
    init() {
      let me = this;
      this.getUserList();
      this.getDepartmentTree();
      //获取三级菜单权限
      privilege(me.privilegeData).then(function(result) {
        me.privilegeData = result;
      });
      //获取性别list
      ApiGetDict("GENDER_CATEGORY").then(function(res) {
        if (res.code == "success") {
          me.genderList = res.data;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
      ///获取角色list
      ApiGetUserRoleList().then(function(res) {
        if (res.code == "success") {
          me.roleList = res.data;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
      //获取国家list
      ApiGetCountry().then(function(res) {
        me.countryList = [];
        if (res.code == "success") {
          me.countryList = res.data;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.init();
    }
  },
  computed: {
    // 上传文件
    actionSrc() {
      return axios.defaults.baseURL + "/report/staff/import";
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
@import "../../common/css/mixin";
@import "../../common/css/base";
@import "../../common/css/variable.scss";

.user-model,
.user-modify-model {
  .gender-radio {
    display: inline-block;
    padding: 1px 5px;
  }
  .ivu-date-picker {
    display: initial;
  }
  .el-cascader {
    width: 100%;
    font-size: 12px;
  }
  .ivu-input-number {
    width: 100%;
  }
}
.manager-staff {
  .ivu-form-item-label:before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}
.user-info-model {
  font-size: 13px;
  .wrap {
    padding: 5px 20px;
  }
  ul {
    li {
      padding: 3px 0;
      span {
        color: $font-dark-color;
      }
    }
  }
  .basic-msg {
    display: flex;
    justify-content: space-between;
    .img-wrap {
      flex-shrink: 0;
      img {
        width: 130px;
        height: 130px;
      }
    }
  }
}
</style>



