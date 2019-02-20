/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:16:06 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-11 14:10:37
 * @instructions 个人中心
 */
<template>
  <div class="own-div">
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        个人中心
      </p>
      <div class="user-div">
        <p>{{userForm.name}}({{userForm.genderCode == null? "保密" :userForm.genderCode}})</p>
        <p>{{userForm.staffCode}}</p>
        <p>{{userForm.deptParentName}}</p>
        <p>{{userForm.roleName}}</p>
      </div>
      <Tabs type="card" @on-click="onClickTabs">
        <TabPane label="基本信息">
          <div class="basic-info">
            <div class="user-img" @click="showStaffAvatar">
              <img alt="" :src="avatarUrl" :onerror="defaultAvatar">
              <div class="upload-cover">
                <Icon type="camera"></Icon>
              </div>
            </div>
            <Form class="basic-form" ref="userForm" :model="userForm" :label-width="80" label-position="left">
              <FormItem label="邮箱：">
                <span>{{ userForm.email }}</span>
              </FormItem>
              <FormItem label="直属领导：">
                <span>{{ userForm.lineManageName }}</span>
              </FormItem>
                <FormItem label="职位：">
                <span>{{ userForm.positionName }}</span>
              </FormItem>
                <FormItem label="级别：">
                <span>{{ userForm.positionLevelName }}</span>
              </FormItem>
              <FormItem label="申报周期：">
                <span>{{ userForm.ruleName }}</span>
              </FormItem>
              <FormItem label="考勤组：">
                <span>{{ userForm.attendanceGroupName }}</span>
              </FormItem>
              <FormItem label="入职日期：">
                <span>{{ userForm.entryDate | moment}}</span>
              </FormItem>
              <FormItem label="生日：">
                <span>{{ userForm.birthday | moment }}</span>
              </FormItem>
              <FormItem label="手机：">
                <span>{{ userForm.mobile }}</span>
              </FormItem>
              <FormItem label="住址：">
                <span>{{ userForm.address }}</span>
              </FormItem>
              <FormItem label="登录密码：">
                <a type="text" size="small" @click="showEditPassword">修改密码</a>
              </FormItem>
            </Form>
          </div>

        </TabPane>
        <TabPane label="项目">
          <Row :gutter="16">
            <Col :md="6" :sm="12" :xs="24">
            <Input v-model.trim="proj.contractCode">
            <span slot="prepend"> 合同编号 </span>
            </Input>
            <split></split>
            </Col>
            <Col :md="6" :sm="12" :xs="24">
            <Input v-model.trim="proj.projectName">
            <span slot="prepend"> 项目名称 </span>
            </Input>
            <split></split>
            </Col>
            <Col :md="6" :sm="12" :xs="24">
            <div class="s-input-wrapper">
              <label>
                状态
              </label>
              <Select v-model="proj.projStatus" clearable>
                <Option v-for="item in projStatusList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
              </Select>
            </div>
            <split></split>
            </Col>
            <Col :md="6" :sm="12" :xs="24" class="btn-div">
            <Button type="info" @click="getStaffProject"> 查询 </Button>
            <Button @click="handleResetpor"> 重置 </Button>
            </Col>
          </Row>
          <div class="proj-div">
            <Table stripe :columns="columnsProj" :data="projData"></Table>
            <div class="page">
              <Page :total="total" size="small" :current="proj.pageNum" :page-size="proj.pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
              </Page>
            </div>
            <split></split>
          </div>
        </TabPane>
        <TabPane label="工时">
          <!-- 周期list -->
          <div v-show="hourShow == 1">
            <Row :gutter="16">
              <Col :md="5" :sm="12" :xs="24">
              <div class="s-datepicker">
                <label>
                  开始日期
                </label>
                <DatePicker :editable='false' :clearable='false' type="date" v-model="hour.recordStart"></DatePicker>
              </div>
              <split></split>
              </Col>
              <Col :md="5" :sm="12" :xs="24">
              <div class="s-datepicker">
                <label>
                  结束日期
                </label>
                <DatePicker :editable='false' :clearable='false' type="date" v-model="hour.recordEnd"></DatePicker>
              </div>
              <split></split>
              </Col>
              <Col :md="4" :sm="12" :xs="24" class="btn-div">
              <Button type="info" @click="getSelfCycles"> 查询 </Button>
              <Button @click="resetHour"> 重置 </Button>
              </Col>
            </Row>
            <div class="proj-div">
              <Table stripe :columns="columnsHour" :data="hourData"></Table>

              <split></split>
            </div>

          </div>
          <!-- 周期内工单list -->
          <div v-show="hourShow == 2">
            <staff-time-info ref="timeInfo"  @close="hourShow = 1"></staff-time-info>

          </div>

        </TabPane>
        <TabPane label="考勤">
          <div class="attendance-tab">
            <Row :gutter="16">
              <Col :md="8" :sm="10" :xs="24">
              <div class="s-datepicker">
                <label>
                  开始日期
                </label>
                <DatePicker :editable='false' :clearable='false' type="date" v-model="attendanceParams.startTime"></DatePicker>
              </div>
              <split></split>
              </Col>
              <Col :md="8" :sm="10" :xs="24">
              <div class="s-datepicker">
                <label>
                  结束日期
                </label>
                <DatePicker :editable='false' :clearable='false' type="date" v-model="attendanceParams.endTime"></DatePicker>
              </div>
              <split></split>
              </Col>
              <Col :md="8" :sm="4" :xs="24">
              <div>
                <Button type="info" @click="getAttendanceList"> 查询 </Button>
                <Button @click="resetAttendance"> 重置 </Button>
              </div>
              </Col>
            </Row>

            <Table :columns="attendanceCol" :data="attendanceData"></Table>
            <div class="page">
              <Page :total="attendancePageTotal" size="small" :current="attendanceParams.pageNum" :page-size="attendanceParams.pageSize" show-elevator show-sizer show-total @on-change="handleAttendancePage" @on-page-size-change='handleAttendancePageSize'>
              </Page>
            </div>
            <split></split>
          </div>

        </TabPane>
        <TabPane label="假期信息">
          <Table :columns="leaveTableCol" :data="leaveTableData"></Table>

        </TabPane>
      </Tabs>

    </Card>
    <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
      <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
        <FormItem label="原密码" prop="oldPass">
          <Input v-model.trim="editPasswordForm.oldPass" type="password" placeholder="请输入现在使用的密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPass">
          <Input v-model.trim="editPasswordForm.newPass" type="password" placeholder="请输入新密码"></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="rePass">
          <Input v-model.trim="editPasswordForm.rePass" type="password" placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="primary" @click="staffPass('editPasswordForm')">保存</Button>
      </div>
    </Modal>
    <Modal v-model="userAvatarModal" title="上传头像" :width="800" class="company-logo">
      <div class="image-editor">
        <Row :gutter="16">
          <Col span="14" class="image-editor-con1">
          <div class="cropper">
            <img id="cropimg" alt="">
          </div>
          </Col>
          <Col span="10" class="image-editor-con1">
          <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
            <div id="preview1"></div>
          </Row>
          <div class="image-editor-con1-btn-con">
            <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" id="fileinput1" class="fileinput" />
            <label class="filelabel" for="fileinput1">
              <Icon type="image"></Icon>&nbsp;选择图片
            </label>
            <span>
              <Button @click="postStaffAvatar" type="primary" icon="ios-cloud-upload"> 上传 </Button>
            </span>
          </div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="userAvatarModal=false">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="taskModal" title="项目任务" :width="800">
      <Table stripe :columns="columnsTask" :data="taskData" class="task-table"></Table>
      <div class="page">
        <Page :total="taskTotal" size="small" :current="task.pageNum" :page-size="task.pageSize" show-elevator show-sizer show-total @on-change="handleTaskPage" @on-page-size-change='handleTaskPageSize'>
        </Page>
      </div>
      <div slot="footer">
      </div>
    </Modal>
    <Modal v-model="projectModal" title="项目详情" :mask-closable="false" :width="800">
      <div class="proj-content">
        <Row :gutter="16">
          <Col span="4">
          <div>项目名称</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.projectName}}</div>
          </Col>
          <Col span="4">
          <div>合同编号</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.contractCode}}</div>
          </Col>
          <Col span="4">
          <div>级别</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.priorityName}}</div>
          </Col>
          <Col span="4">
          <div>分类</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.projCategoryName}}</div>
          </Col>
          <Col span="4">
          <div>计划开始日期</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.planStart | moment}}</div>
          </Col>
          <Col span="4">
          <div>计划完成日期</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.planFinish | moment }}</div>
          </Col>
          <Col span="4">
          <div>实际开始日期</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.actualStart | moment}}</div>
          </Col>
          <Col span="4">
          <div>实际完成日期</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.actualFinish | moment}}</div>
          </Col>
          <Col span="4">
          <div>基准工时</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.standardHour}}</div>
          </Col>
          <Col span="4">
          <div>控制工时</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.controlHour}}</div>
          </Col>
          <Col span="4">
          <div>立项时间</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.establishDate | moment}}</div>
          </Col>
          <Col span="4">
          <div>关闭时间</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.closeDate | moment }}</div>
          </Col>
          <!-- <Col :xs="8" :sm="4">
          <div>审核类型</div>
          </Col> -->
          <!-- <Col :xs="16" :sm="8">
          <div class="font-color">{{project.apvCategoryCode}}</div>
          </Col> -->
          <Col span="4">
          <div>状态</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.projStatusName}}</div>
          </Col>
          <Col span="4">
          <div>是否模板</div>
          </Col>
          <Col span="8">
          <div class="font-color">{{project.template ? "是" :"否" }}</div>
          </Col>
          
          <Col span="4">
          <div>项目描述</div>
          </Col>
          <Col span="20">
          <div class="font-color">{{project.description == "" ? "暂无" :project.description}}</div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="projectModal=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ApiGetDict, ApiGetStaffAvater } from "@/api/api";
import { ApiGetProjTaskList } from "@/api/study/task-api";
import {
  ApiStaffPwd,
  ApiGetStaff,
  ApiPostStaffAvatar,
  ApiGetStaffProject,
  ApiGetStaffTimesheet,
  ApiGetAttendance,
  ApiGetSelfCycles
} from "@/api/own-space/own-space-api";
import { ApiGetProjCon } from "@/api/study/project-api";
import { ApiGetLeaveStaff } from "@/api/competence/user-api";
import qs from "qs";
import md5 from "js-md5";
import moment from "moment";
import Cropper from "cropperjs";
import "../../common/css/cropper.min.css";
import { resCode } from "@/api/code";
import Cookies from "js-cookie";
import Split from "components/unit/split";
import axios from "axios";
import pwdValidate from "common/js/pwdValidate";
import StaffTimeInfo from "pages/timesheet/components/staff-time-info";
const taskButton = (vm, h, params) => {
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
          vm.getProjTaskList(params.row.projectId);
        }
      }
    },
    "任务"
  );
};
const viewButton = (vm, h, params) => {
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
          vm.getProjCon(params.row.projectId);
        }
      }
    },
    "详情"
  );
};
export default {
  name: "image-editor",
  components: {
    Split,
    StaffTimeInfo
  },
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      avatarUrl: "",
      defaultAvatar:
        'this.src="' + require("../../common/img/d-avatar.jpg") + '"',
      total: 0, // staff  总数
      taskTotal: 0,
      hourTotal: 0,
      userForm: {
        name: "",
        staffCode: "",
        deptParentName: "",
        birthday: "",
        mobile: "",
        address: "",
        roleName: "",
        entryDate: "",
        email: "",
        genderCode: ""
      },
      editPasswordModal: false,
      editPasswordForm: {
        oldPass: "",
        newPass: "",
        rePass: ""
      },
      proj: {
        projectName: "",
        contractCode: "",
        projStatus: "",
        pageNum: 1,
        pageSize: 10
      },
      passwordValidate: {
        oldPass: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ],
        newPass: [...pwdValidate],
        rePass: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            validator: valideRePassword,
            trigger: "blur"
          }
        ]
      },
      userAvatarModal: false,
      projStatusList: [], //  项目状态
      cropperImg: {}, // 头像对象
      staffAvatar: {
        resourcePath: "", // 后天返回的图片路径
        staffAvatar: "",
        file: ""
      },
      projData: [],
      columnsProj: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.proj.pageNum - 1) * vm.proj.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },

        {
          title: "合同编号",
          key: "contractCode"
        },
        {
          title: "项目名称",
          key: "projectName",
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                return params.row.projectName ? params.row.projectName : "暂无";
              })(this)
            );
          }
        },
        {
          title: "状态",
          key: "projStatusName"
        },
        {
          title: "级别",
          key: "priorityName"
        },
        {
          title: "基准工时",
          key: "standardHour"
        },
        {
          title: "操作",
          key: "action",
          width: 140,
          align: "center",
          render: (h, params) => {
            return h("div", [
              taskButton(this, h, params),
              viewButton(this, h, params)
            ]);
          }
        }
      ],
      projectModal: false,
      project: {
        projectName: "",
        projectShortname: "",
        planStart: "",
        planFinish: "",
        actualStart: "",
        actualFinish: "",
        establishDate: "",
        closeDate: "",
        priority: "",
        projCategory: "",
        projStatus: "",
        template: "false",
        standardHour: "",
        controlHour: "",
        description: ""
      },
      task: {
        pageNum: 1,
        pageSize: 10,
        projectId: ""
      },
      taskModal: false,
      taskData: [], // 任务data
      columnsTask: [
        {
          title: "任务编号",
          key: "taskCode"
        },
        {
          title: "任务名称",
          key: "taskName"
        },

        {
          title: "状态",
          key: "statusName"
        },
        {
          title: "紧急度",
          key: "priorityName"
        },
        {
          title: "基准工时",
          key: "standardHour"
        },
        {
          title: "任务序号",
          key: "taskStep",
          align: "center"
        }
      ],
      hour: {
        recordStart: moment(moment().subtract(1, "months")).format(
          "YYYY-MM-DD"
        ),
        recordEnd: moment().format("YYYY-MM-DD")
      },
 
      hourShow: 1,
      columnsHour: [
        {
          title: "序号",
          width: 60,
          type:"index",
          align: "center"   
        },
        {
          title: "工时周期",
          key: "formCode",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let start = moment(params.row.recordStart).format("YYYY-MM-DD");
                let end = moment(params.row.recordEnd).format("YYYY-MM-DD");
                return start + "--" + end;
              })(this)
            );
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", {}, [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.hourShow = 2;
                       this.$refs.timeInfo.getInfo(params.row.tcycleId, params.row.staffId);
                   
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      hourData: [],
      attendanceParams: {
        //请求个人考勤列表参数
        pageNum: 1,
        pageSize: 10,
        startTime: moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD"),
        staffId: Cookies.get("staffId")
      },
      attendanceCol: [
        //个人考勤信息列
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.attendanceParams.pageNum - 1) *
                    vm.attendanceParams.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "考勤日期",
          key: "workDate",
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.workDate).format("YYYY-MM-DD");
              })(this)
            );
          }
        },
        {
          title: "打卡时间",
          key: "userCheckTime",
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.userCheckTime).format("HH:mm:ss");
              })(this)
            );
          }
        },
        {
          title: "类型",
          key: "checkType",
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                return params.row.checkType ? "上班" : "下班";
              })(this)
            );
          }
        },
        {
          title: "考勤结果",
          key: "timeResult",
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                switch (params.row.timeResult) {
                  case "NORMAL":
                    return "正常";
                  case "EARLY":
                    return "早退";
                  case "LATE":
                    return "迟到";
                  case "SERIOUS_LATE":
                    return "严重迟到";
                  case "ABSENTEEISM":
                    return "旷工";
                  case "NOT_SIGNED":
                    return "未打卡";
                  case "NOT_SIGNED_APV":
                    return "补卡审批";
                }
              })(this)
            );
          }
        },
        {
          title: "位置结果",
          key: "locationResult",
          render: function(h, params) {
            return h(
              "div",
              // (function(vm) {
              //   return params.row.locationResult ? "范围内" : "范围外";
              // })(this)
              (function(vm) {
                switch (params.row.locationResult) {
                  case "INSIDE":
                    return "范围内";
                  case "OUTSIDE":
                    return "范围外";
                  case "NOT_SIGN":
                    return "未打卡";
                }
              })(this)
            );
          }
        }
      ],
      attendanceData: [], //个人考勤数据,
      attendancePageTotal: 0, //个人考勤列表总条数
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
          title: "时长类型",
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
          title: "时长计算方式",
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
          align: "center"
        }
      ],

      //用户假期table数据
      leaveTableData: []
    };
  },
  methods: {
    // 项目分页
    handlePage(value) {
      this.proj.pageNum = value;
      this.getStaffProject();
    },
    handlePageSize(value) {
      this.proj.pageSize = value;
      this.getStaffProject();
    },
    // 任务分页
    handleTaskPage(value) {
      this.task.pageNum = value;
      this.getStaffTask(projectId);
    },
    handleTaskPageSize(value) {
      this.task.pageSize = value;
      this.getStaffTask(projectId);
    },
    // 考勤分页
    handleAttendancePage(value) {
      this.attendanceParams.pageNum = value;
      this.getAttendanceList();
    },
    handleAttendancePageSize(value) {
      this.attendanceParams.pageSize = value;
      this.getAttendanceList();
    },
    // 限制上传图片的大小
    handleChange(e) {
      let file = e.target.files[0];
      if (file.size / 1024 > 600) {
        this.$Message.error({
          content: "上传图片大小超出限制！",
          duration: 10
        });
        return false;
      }
      let reader = new FileReader();
      reader.onload = () => {
        this.cropperImg.replace(reader.result);
        reader.onload = null;
      };
      reader.readAsDataURL(file);
    },
    // 点击出现上传图片模态框
    showStaffAvatar() {
      this.userAvatarModal = true;
    },
    // 上传图片
    postStaffAvatar() {
      if (this.cropperImg.url) {
        let avatarNew = this.cropperImg.getCroppedCanvas().toDataURL();
        this.staffAvatar.avatar = this.cropperImg
          .getCroppedCanvas()
          .toDataURL()
          .substr(22);
        this.staffAvatar.staffId = Cookies.get("staffId");
        ApiPostStaffAvatar(qs.stringify(this.staffAvatar)).then(res => {
          if (res.code == "success") {
            this.$Message.success("上传成功!");
            this.userAvatarModal = false;
            this.getStaffAvater();
            this.$store.commit("setAvatarUrl", avatarNew);
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    // 修改密码模态框
    showEditPassword() {
      this.editPasswordModal = true;
    },
    // 点击关闭修改密码模态框
    cancelEditPass() {
      this.handleReset("editPasswordForm");
      this.editPasswordModal = false;
    },
    // 获取 个人信息
    getStaff() {
      ApiGetStaff().then(res => {
        if (res.code == "success") {
          this.userForm = res.data;
          this.userForm.mobile = this.userForm.mobile
            ? this.userForm.mobile
            : "--";
          this.userForm.address = this.userForm.address
            ? this.userForm.address
            : "--";
          this.imgSrc = res.data.resourcePath;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 修改密码点击保存
    staffPass(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var data = {
            oldPwd: md5(this.editPasswordForm.oldPass),
            pwd: md5(this.editPasswordForm.newPass)
          };
          ApiStaffPwd(qs.stringify(data)).then(res => {
            if (res.code == "success") {
              this.$Message.success("成功!");
              this.$router.push({ name: "lOGIN" });
            } else {
              if (resCode[res.code]) {
                this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    //点击切换 tabs
    onClickTabs(index) {
      if (index == 1) {
        // 项目部门
        this.getStaffProject();
      } else if (index == 2) {
        this.getSelfCycles();
        this.hourShow = 1;
      } else if (index == 3) {
        //考勤
        this.getAttendanceList();
      } else if (index == 4) {
        //假期信息
        this.getLeaveList();
      }
    },
    // 获取项目列表
    getStaffProject() {
      ApiGetStaffProject(this.proj).then(res => {
        if (res.code == "success") {
          this.projData = res.data;
          this.total = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //获取项目详情
    getProjCon(projectId) {
      ApiGetProjCon(projectId).then(res => {
        if (res.code == "success") {
          this.projectModal = true;
          this.project = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取工时列表
    getSelfCycles() {
      this.hour.recordStart = moment(this.hour.recordStart).format(
        "YYYY-MM-DD"
      );
      this.hour.recordEnd = moment(this.hour.recordEnd).format("YYYY-MM-DD");
      ApiGetSelfCycles(this.hour).then(res => {
        if (res.code == "success") {
          this.hourData = res.data;
          this.hourTotal = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },

    // 获取项目状态
    getDictProjStatus() {
      let dictCode = "PROJ_STATUS";
      ApiGetDict(dictCode).then(res => {
        if (res.code == "success") {
          this.projStatusList = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    /**
     * 获取项目下的任务
     * @param  { Number } projectId  当前项目 id
     * */
    getProjTaskList(projectId) {
      this.task.projectId = projectId;
      ApiGetProjTaskList(this.task).then(res => {
        if (res.code == "success") {
          this.taskModal = true;
          this.taskData = res.data;
          this.taskTotal = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 重置工时筛选条件
    resetHour() {
      (this.hour.recordStart = moment(moment().subtract(1, "months")).format(
        "YYYY-MM-DD"
      )),
        (this.hour.recordEnd = moment().format("YYYY-MM-DD"));
      this.getSelfCycles();
    },
    // 清除修改密码的form 表单
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //获取考勤信息list
    getAttendanceList(params) {
      this.attendanceParams.startTime = moment(
        this.attendanceParams.startTime
      ).format("YYYY-MM-DD");
      this.attendanceParams.endTime = moment(
        this.attendanceParams.endTime
      ).format("YYYY-MM-DD");
      ApiGetAttendance(this.attendanceParams).then(res => {
        if (res.code == "success") {
          this.attendancePageTotal = res.total;
          this.attendanceData = res.data;
        }
      });
    },
    // 重置考勤
    resetAttendance() {
      this.attendanceParams.startTime = moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      this.attendanceParams.endTime = moment().format("YYYY-MM-DD");
      this.getAttendanceList();
    },
    // 重置项目
    handleResetpor() {
      this.proj.projectName = "";
      this.proj.contractCode = "";
      this.proj.projStatus = "";
      this.getStaffProject();
    },
    //获取假期信息
    getLeaveList() {
      ApiGetLeaveStaff(Cookies.get("staffId")).then(res => {
        if (res.code == "success") {
          this.leaveTableData = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 请求个人头像
    getStaffAvater() {
      let _data = {
        staffId: Cookies.get("staffId")
      };
      ApiGetStaffAvater(_data)
        .then(res => {
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res).reduce(
                (res, byte) => res + String.fromCharCode(byte),
                ""
              )
            )
          );
        })
        .then(res => {
          if (res != "data:image/png;base64,") {
            this.avatarUrl = res;
          }
        });
    }
  },
  mounted() {
    this.getStaff();
    this.getStaffAvater();
    this.getDictProjStatus();
    let img = document.getElementById("cropimg");
    this.cropperImg = new Cropper(img, {
      dragMode: "move",
      preview: "#preview1",
      restore: false,
      center: false,
      highlight: false,
      cropBoxMovable: false,
      toggleDragModeOnDblclick: false
    });
  }
};
</script>

<style lang="scss">
@import "../../common/css/mixin";
@import "../../common/css/base";
@import "../../common/css/image-editor";
@import "../../common/css/variable.scss";
.own-div {
  .s-input-wrapper {
    @include select-label();
    @include clear-both();
    label {
      padding: 8px 7px;
    }
  }
  .s-datepicker {
    @include datapick-label();
    @include clear-both();
    label {
      font-size: 12px;
    }
  }
  .basic-info {
    display: flex;
    justify-content: space-between;
    .basic-form {
      flex: 1;
      .ivu-form-item {
        margin-bottom: 0;
      }
    }
  }
  .user-div {
    margin-bottom: 20px;
    p {
      display: inline-block;
      margin-right: 20px;
    }
  }

  .attendance-tab {
    min-height: 400px;
  }
}

.comment-column {
  .ivu-tooltip-rel {
    width: 60px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ivu-tooltip-inner {
    white-space: inherit;
  }
}

.proj-content {
  .ivu-col {
    margin-bottom: 10px;
  }
  .ivu-alert {
    margin-top: 10px;
    margin-bottom: 0;
  }
}
.font-color {
  color: $font-dark-color;
}
</style>
