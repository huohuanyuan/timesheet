<template>
  <div class="auditcycle">
    <div class="auditcycle-top">
      <Button type="info" @click="addAuditcycleFun"> 新增 </Button>
    </div>
    <div>
      <split></split>
      <Table stripe :columns="columnsAuditcycle" :data="auditcycleData"></Table>
      <div class="page">
        <Page :total="auditcycle.total" size="small" :current="auditcycle.pageNum" :page-size="auditcycle.pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
        </Page>
      </div>
    </div>
    <!-- 新建申报周期信息 -->
    <Modal v-model="addAuditcycleModal" title="添加申报周期信息" :width="600" :mask-closable="false">
      <Form ref="formNewAuditcycle" :model="formNewAuditcycle" :rules="roleInline" class="from-role" :label-width="80">
        <Row :gutter="16">
          <Col span="24">
          <FormItem label="周期名称" prop="ruleName">
            <Input v-model.trim="formNewAuditcycle.ruleName"></Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem prop="declareCategory" label="申报周期">
            <Select v-model="formNewAuditcycle.declareCategory">
              <Option v-for="item in projCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem prop="declareDelay" label="申报日期">
            <Select v-model="formNewAuditcycle.declareDelay">
              <Option v-for="item in declareDelayList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <div class="title"> (审批驳回后只能{{formNewAuditcycle.declareDelay == 0 ? 0 : formNewAuditcycle.declareDelay}}天内申报) </div>
          </Col>
          <Col span="12">
          <FormItem prop="reDeclareDelay" label="重报日期">
            <Select v-model="formNewAuditcycle.reDeclareDelay">
              <Option v-for="item in reDeclareDelayList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <div class="title"> (审批驳回后只能{{formNewAuditcycle.reDeclareDelay == 0 ? 0 : formNewAuditcycle.reDeclareDelay}}天内申报) </div>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="postCycleRule('formNewAuditcycle')">保存</Button>
      </div>
    </Modal>
    <!--  修改申报周期  -->
    <Modal v-model="editAuditcycleModal" title="修改申报周期信息" :width="600" :mask-closable="false">
      <Form ref="formEditAuditcycle" :model="formEditAuditcycle" :rules="editRoleInline" class="from-role" :label-width="80">
        <Row :gutter="16">
          <Col span="24">
          <FormItem label="周期名称" prop="ruleName">
            <Input v-model.trim="formEditAuditcycle.ruleName"></Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem prop="declareCategory" label="申报周期">
            <Select v-model="formEditAuditcycle.declareCategoryId">
              <Option v-for="item in projCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem prop="declareDelay" label="申报日期">
            <Select v-model="formEditAuditcycle.declareDelay">
              <Option v-for="item in declareDelayList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <div class="title"> (审批驳回后只能{{formEditAuditcycle.declareDelay == 0 ? 0 : formEditAuditcycle.declareDelay}}天内申报) </div>
          </Col>
          <Col span="12">
          <FormItem prop="reDeclareDelay" label="重报日期">
            <Select v-model="formEditAuditcycle.reDeclareDelay">
              <Option v-for="item in reDeclareDelayList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <div class="title"> (审批驳回后只能{{formEditAuditcycle.reDeclareDelay == 0 ? 0 : formEditAuditcycle.reDeclareDelay}}天内申报) </div>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="putCycleRule('formEditAuditcycle')">保存</Button>
      </div>
    </Modal>
    <!-- 审核周期 员工 -->
    <Modal v-model="staffModal" title="员工列表" :mask-closable="false" :width="800">
      <Row :gutter="10">
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="staff.deptName">
        <span slot="prepend"> 部门名称 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="staff.staffName">
        <span slot="prepend"> 员工姓名 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="staff.staffNumber">
        <span slot="prepend"> 员工工号 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <div>
          <Button type="info" @click="getCycleStaff"> 查询 </Button>
          <Button @click="resetStaff"> 重置 </Button>
          <Button type="primary" @click="addStaffFun"> 新增 </Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <div>
        <Table stripe :columns="columnsStaff" :data="staffData"></Table>
        <div class="page">
          <Page :total="staff.total" size="small" :current="staff.pageNum" :page-size="staff.pageSize" show-elevator show-sizer show-total @on-change="handleStaffPage" @on-page-size-change='handleStaffPageSize'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button @click="staffModal=false">关闭</Button>
      </div>
    </Modal>
    <!-- 生成考勤周期 -->
    <Modal v-model="cycleModel" title="生成考勤周期" :mask-closable="false" :width="600">
      <Form ref="cycleForm" :model="cycleForm" :rules="cycleRules" :label-width="80">
        <Row :gutter="16">
          <Col span="24">
          <FormItem label="部门编号">
            <Input v-model="cycleForm.ruleName" disabled>
            </Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="周期时间" prop="month">
            <DatePicker :editable='false' :clearable='false' type="month" v-model="cycleForm.month"></DatePicker>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="cycleSave('cycleForm')" type="primary" long>保存</Button>
      </div>
    </Modal>
    <!-- 添加员工 -->
    <Modal v-model="addStaffModal" title="添加员工" :mask-closable="false" :width="800">
      <Row :gutter="10">
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="addStaff.deptName">
        <span slot="prepend"> 部门名称 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="addStaff.staffName">
        <span slot="prepend"> 员工姓名 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="addStaff.staffNumber">
        <span slot="prepend"> 员工工号 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <div>
          <Button type="info" @click="getStaffCyele"> 查询 </Button>
          <Button @click="resetAddStaff"> 重置 </Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <div>
        <Table stripe :columns="columnsAddStaff" :data="addStaffData" @on-select="onSelectProjCli" @on-select-all="onSelectProjCli" @on-select-cancel="onSelectProjCli"></Table>
        <div class="page">
          <Page :total="addStaff.total" size="small" :current="addStaff.pageNum" :page-size="addStaff.pageSize" show-elevator show-sizer show-total @on-change="handlePageAddStaff" @on-page-size-change='handlePageSizeAddStaff'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="putCycleAddStaff">保存</Button>
      </div>
    </Modal>
    <!-- 查看详情 -->
    <Modal v-model="cycleConModal" title="详细信息" :mask-closable="false" :width="800">
      <div class="cycle-content">
        <Row :gutter="16">
          <Col :xs="8" :sm="4">
          <div>申报周期名称：</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formEditAuditcycle.ruleName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>申报周期：</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formEditAuditcycle.declareCategory}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>申报截止日期：</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formEditAuditcycle.declareDelay}} 天 </div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>驳回重报日期：</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formEditAuditcycle.reDeclareDelay }} 天 </div>
          </Col>
        </Row>
        <Alert> 员工列表 </Alert>
        <Table stripe :columns="columnsStaffCon" :data="staffConData" :disabled-hover="true"></Table>
        <div class="page">
          <Page :total="staffCon.total" size="small" :current="staffCon.pageNum" :page-size="staffCon.pageSize" show-elevator show-sizer show-total @on-change="handleStaffConPage" @on-page-size-change='handleStaffConPageSize'>
          </Page>
        </div>
        <Alert type="success"> 周期列表 </Alert>
        <div>
          <Row :gutter="10">
            <Col :md="6" :sm="12" :xs="24">
            <div class="s-input-wrapper">
              <label>
                开始时间
              </label>
              <DatePicker :editable='false' type="date" v-model="sycle.startDate" :clearable="false"></DatePicker>
            </div>
            <split></split>
            </Col>
            <Col :md="6" :sm="12" :xs="24">
            <div class="s-input-wrapper">
              <label>
                结束时间
              </label>
              <DatePicker :editable='false' type="date" v-model="sycle.endDate" :clearable="false"></DatePicker>
            </div>
            <split></split>
            </Col>
            <Col :md="6" :sm="12" :xs="24">
            <div>
              <Button type="info" @click="getCycleRule"> 查询 </Button>
              <Button @click="resetSyeleList"> 重置 </Button>
            </div>
            <split></split>
            </Col>
          </Row>
          <Table stripe :columns="columnsClyceCon" :data="clyceConData" :disabled-hover="true"></Table>
          <div class="page">
            <Page :total="sycle.total" size="small" :current="sycle.pageNum" :page-size="sycle.pageSize" show-elevator show-sizer show-total @on-change="handleSyclePage" @on-page-size-change='handleSyclePageSize'>
            </Page>
          </div>
        </div>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import qs from "qs";
import Split from "components/unit/split";
import moment from "moment";
import { ApiGetDict } from "@/api/api";
import { resCode } from "@/api/code";
import {
  ApiPostCycleRule,
  ApiGetCycleRulePage,
  ApiGetCycleRuleCon,
  ApiPutCycleRule,
  ApiDeletCycleRule,
  ApiGetCycleStaff,
  ApiDeletCycleStaff,
  ApiPostCycleRuleGenerate,
  ApiGetStaffCyele,
  ApiPutCycleAddStaff,
  ApiGetCycleRule
} from "@/api/system/auditcycle-api";
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
          vm.$refs["formEditAuditcycle"].resetFields();
          vm.editFun(params.row.ruleId);
        }
      }
    },
    "编辑"
  );
};
//  查看 按钮
const iviewButton = (vm, h, params) => {
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
          vm.iviewButtonFun(params.row.ruleId);
        }
      }
    },
    "查看"
  );
};
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
          vm.deleteRule(params.row.ruleId);
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
// 生成周期
const cycleButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "warning",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.$refs["cycleForm"].resetFields();
          vm.cycleButtonFun(params.row);
        }
      }
    },
    "生成周期"
  );
};
const staffButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "info",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.staffBtnFun(params.row.ruleId);
        }
      }
    },
    "员工"
  );
};
// 员工删除
const deleteStaffButton = (vm, h, params) => {
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
          vm.deletCycleStaff(params.row.staff_id);
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
export default {
  components: {
    Split
  },
  data() {
    return {
      // 申报日期
      declareDelayList: [
        {
          id: 0,
          title: "0"
        },
        {
          id: 1,
          title: "1"
        },
        {
          id: 2,
          title: "2"
        },
        {
          id: 3,
          title: "3"
        },
         {
          id: 4,
          title: "4"
        },
         {
          id: 5,
          title: "5"
        }
      ],
      reDeclareDelayList: [
        {
          id: 0,
          title: "0"
        },
        {
          id: 1,
          title: "1"
        },
        {
          id: 2,
          title: "2"
        },
          {
          id: 3,
          title: "3"
        },
         {
          id: 4,
          title: "4"
        },
         {
          id: 5,
          title: "5"
        }
      ],
      addAuditcycleModal: false, // 新建申报周期模态框
      editAuditcycleModal: false, // 修改申报周期模态框
      staffModal: false, // 员工信息模态框
      cycleModel: false, // 生成考勤周期模态框
      addStaffModal: false, // 添加员工模态框
      cycleConModal: false, // 详情模态框
      projCategoryList: [], //申报周期类型
      auditcycle: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      staff: {
        // 员工data
        total: 0,
        pageNum: 1,
        pageSize: 10,
        deptName: "",
        staffName: "",
        staffNumber: ""
      },
      staffCon: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      addStaff: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        deptName: "",
        staffName: "",
        staffNumber: ""
      },
      sycle: {
        ruleId: "",
        total: 0,
        pageNum: 1,
        pageSize: 10,
        startDate: "",
        endDate: ""
      },
      formNewAuditcycle: {
        ruleName: "",
        declareCategory: "",
        declareDelay: "",
        reDeclareDelay: ""
      },
      formEditAuditcycle: {
        ruleName: "",
        declareCategoryId: "",
        declareDelay: "",
        reDeclareDelay: ""
      },
      auditcycleData: [],
      columnsAuditcycle: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.auditcycle.pageNum - 1) * vm.auditcycle.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "周期名称",
          key: "ruleName",
          align: "center"
        },
        {
          title: "周期类型",
          key: "declareCategory",
          align: "center"
        },
        {
          title: "申报截止时间",
          key: "declareDelay",
          align: "center"
        },
        {
          title: "驳回重报时间",
          key: "reDeclareDelay",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 300,
          align: "center",
          render: (h, params) => {
            return h("div", [
              editButton(this, h, params),
              iviewButton(this, h, params),
              staffButton(this, h, params),
              cycleButton(this, h, params),
              deleteButton(this, h, params)
            ]);
          }
        }
      ],
      roleInline: {
        ruleName: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 64,
            message: "周期名称不能超过64位",
            trigger: "blur"
          }
        ],
        declareCategory: [
          {
            required: true,
            type: "number",
            message: " ",
            trigger: "change"
          }
        ],
        declareDelay: [
          {
            required: true,
            type: "number",
            message: " ",
            trigger: "change"
          }
        ],
        reDeclareDelay: [
          {
            required: true,
            type: "number",
            message: " ",
            trigger: "change"
          }
        ]
      },
      editRoleInline: {
        ruleName: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 64,
            message: "周期名称不能超过64位",
            trigger: "blur"
          }
        ],
        declareCategoryId: [
          {
            required: true,
            type: "number",
            message: " ",
            trigger: "change"
          }
        ],
        declareDelay: [
          {
            required: true,
            type: "number",
            message: " ",
            trigger: "change"
          }
        ],
        reDeclareDelay: [
          {
            required: true,
            type: "number",
            message: " ",
            trigger: "change"
          }
        ]
      },
      staffData: [], // 员工data
      columnsStaff: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.staff.pageNum - 1) * vm.staff.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "员工工号",
          key: "staff_number",
          align: "center"
        },
        {
          title: "员工名字",
          key: "name",
          align: "center"
        },
        {
          title: "部门名称",
          key: "dept_name",
          align: "center"
        },
        {
          title: "部门职位",
          key: "role_name",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [deleteStaffButton(this, h, params)]);
          }
        }
      ],
      // 生成审核 周期的
      cycleForm: {
        ruleId: "",
        ruleName: "",
        month: ""
      },
      cycleRules: {
        month: [
          {
            required: true,
            message: " ",
            type: "date",
            trigger: "change"
          }
        ]
      },
      columnsAddStaff: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "员工工号",
          key: "staff_number"
        },
        {
          title: "部门",
          key: "dept_name"
        }
      ], // 添加员工
      addStaffData: [],
      selectionProjCli: [],
      columnsStaffCon: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.auditcycle.pageNum - 1) * vm.auditcycle.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "员工工号",
          key: "staff_code",
          align: "center"
        },
        {
          title: "员工名称",
          key: "name",
          align: "center"
        },
        {
          title: "部门名称",
          key: "dept_name",
          align: "center"
        },
        {
          title: "职位",
          key: "role_name",
          align: "center"
        }
      ],
      staffConData: [],
      columnsClyceCon: [
        {
          title: "序号",
          align: "center",
          width: 60,
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.sycle.pageNum - 1) * vm.sycle.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "周期开始时间",
          key: "recordStart",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.recordStart).format("YYYY-MM-DD");
              })(this)
            );
          }
        },
        {
          title: "周期结束时间",
          key: "recordEnd",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.recordEnd).format("YYYY-MM-DD");
              })(this)
            );
          }
        },
        {
          title: "申报开始时间",
          key: "declareStart",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.declareStart).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              })(this)
            );
          }
        },
        {
          title: "申报结束时间",
          key: "declareEnd",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.declareEnd).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              })(this)
            );
          }
        }
      ],
      clyceConData: []
    };
  },
  methods: {
    // 分页
    handlePage(value) {
      this.auditcycle.pageNum = value;
      this.getCycleRulePage();
    },
    handlePageSize(value) {
      this.auditcycle.pageSize = value;
      this.getCycleRulePage();
    },
    // 员工分页
    handleStaffPage(value) {
      this.staff.pageNum = value;
      this.getCycleStaff();
    },
    handleStaffPageSize(value) {
      this.staff.pageSize = value;
      this.getCycleStaff();
    },
    // 添加员工分页
    handlePageAddStaff(value) {
      this.addStaff.pageNum = value;
      this.getStaffCyele();
    },
    handlePageSizeAddStaff(value) {
      this.addStaff.pageSize = value;
      this.getStaffCyele();
    },
    // 周期列表分页
    handleSyclePage(value) {
      this.sycle.pageNum = value;
      this.getCycleRule();
    },
    handleSyclePageSize(value) {
      this.sycle.pageSize = value;
      this.getCycleRule();
    },
    // 员工详情分页
    handleStaffConPage(value) {
      this.staffCon.pageNum = value;
      this.getCycleStaffCon();
    },
    handleStaffConPageSize(value) {
      this.staffCon.pageSize = value;
      this.getCycleStaffCon();
    },
    // 获取 申报周期列表
    getCycleRulePage() {
      let _this = this;
      ApiGetCycleRulePage(_this.auditcycle).then(function(res) {
        if (res.code == "success") {
          _this.auditcycleData = res.data;
          _this.auditcycle.total = res.total;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 新建方法
    addAuditcycleFun() {
      this.addAuditcycleModal = true;
      this.getDictProjCategory();
      this.handleReset("formNewAuditcycle");
    },
    //请求申报周期类型
    getDictProjCategory() {
      let dictCode = "REPORTING_CYCLE_CATEGORY";
      let _this = this;
      ApiGetDict(dictCode).then(function(res) {
        if (res.code == "success") {
          _this.projCategoryList = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 新建申报周期，保存方法
    postCycleRule(name) {
      let _this = this;
      _this.$refs[name].validate(valid => {
        if (valid) {
          ApiPostCycleRule(qs.stringify(_this.formNewAuditcycle)).then(function(
            res
          ) {
            if (res.code == "success") {
              _this.$Message.success("保存成功!");
              _this.addAuditcycleModal = false;
              _this.getCycleRulePage();
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    // 点击编辑按钮，请求详情
    editFun(ruleId) {
      this.getDictProjCategory();
      this.getCycleRuleCon(ruleId);
      this.editAuditcycleModal = true;
    },
    // 点击查看，请求详情
    iviewButtonFun(ruleId) {
      this.getCycleRuleCon(ruleId);
      this.staffCon.ruleId = ruleId;
      this.getCycleStaffCon();
      this.sycle.ruleId = ruleId;
      this.getCycleRule();
      this.cycleConModal = true;
    },
    // 请求详情的员工
    getCycleStaffCon() {
      let _this = this;
      ApiGetCycleStaff(_this.staffCon).then(function(res) {
        if (res.code == "success") {
          _this.staffConData = res.data;
          _this.staffCon.total = res.total;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 请求详情 周期列表liet
    getCycleRule() {
      let _this = this;
      if (_this.sycle.startDate) {
        _this.sycle.startDate = moment(_this.sycle.startDate).format(
          "YYYY-MM-DD"
        );
      } else {
        delete _this.sycle.startDate;
      }
      if (_this.sycle.endDate) {
        _this.sycle.endDate = moment(_this.sycle.endDate).format("YYYY-MM-DD");
      } else {
        delete _this.sycle.endDate;
      }

      ApiGetCycleRule(_this.sycle).then(function(res) {
        if (res.code == "success") {
          _this.clyceConData = res.data;
          _this.sycle.total = res.total;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 点击编辑，请求详细信息
    getCycleRuleCon(ruleId) {
      let _this = this;
      ApiGetCycleRuleCon(ruleId).then(function(res) {
        if (res.code == "success") {
          _this.formEditAuditcycle = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 编辑完成，提交
    putCycleRule(name) {
      let _this = this;
      _this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            ruleId: _this.formEditAuditcycle.ruleId,
            ruleName: _this.formEditAuditcycle.ruleName,
            declareCategory: _this.formEditAuditcycle.declareCategoryId,
            declareDelay: _this.formEditAuditcycle.declareDelay,
            reDeclareDelay: _this.formEditAuditcycle.reDeclareDelay
          };
          ApiPutCycleRule(qs.stringify(data)).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("修改成功!");
              _this.editAuditcycleModal = false;
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    // 点击 生成周期按钮
    cycleButtonFun(data) {
      this.cycleModel = true;
      this.cycleForm.ruleId = data.ruleId;
      this.cycleForm.ruleName = data.ruleName;
    },
    // 生成周期 点击保存
    cycleSave(name) {
      this.$refs[name].validate(valid => {
        let _this = this;
        if (valid) {
          //提交参数
          _this.cycleForm.month = moment(_this.cycleForm.month).format(
            "YYYY-MM"
          );
          ApiPostCycleRuleGenerate(qs.stringify(_this.cycleForm)).then(function(
            res
          ) {
            if (res.code == "success") {
              _this.$Message.success("执行成功");
              _this.cycleModel = false;
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    // 删除 审核周期
    deleteRule(ruleId) {
      let _this = this;
      ApiDeletCycleRule(ruleId).then(function(res) {
        if (res.code == "success") {
          _this.$Message.success("删除成功!");
          _this.getCycleRulePage();
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 点击员工方法
    staffBtnFun(ruleId) {
      this.staff.total = 0;
      this.staff.pageNum = 1;
      this.staff.pageSize = 10;
      this.staffModal = true;
      this.staff.ruleId = ruleId;
      this.getCycleStaff();
    },
    // 请求员工列表
    getCycleStaff() {
      let _this = this;
      ApiGetCycleStaff(_this.staff).then(function(res) {
        if (res.code == "success") {
          _this.staffData = res.data;
          _this.staff.total = res.total;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 员工删除
    deletCycleStaff(staffId) {
      let _this = this;
      ApiDeletCycleStaff(staffId).then(function(res) {
        if (res.code == "success") {
          _this.$Message.success("删除成功!");
          _this.getCycleStaff();
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //点击新增 员工
    addStaffFun() {
      this.addStaff.total = 0;
      this.addStaff.pageNum = 1;
      this.addStaff.pageSize = 10;
      this.addStaffModal = true;
      this.getStaffCyele();
    },
    // 请求 未添加的员工list
    getStaffCyele() {
      let _this = this;
      _this.selectionProjCli = [];
      ApiGetStaffCyele(_this.addStaff).then(function(res) {
        if (res.code == "success") {
          _this.addStaffData = res.data;
          _this.addStaff.total = res.total;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    /**
     * 获取选中的数据
     * @param { Arr} selection 返回所有选中的data
     * @param { Object} row 返回当前选中data
     */
    onSelectProjCli(selection, row) {
      this.selectionProjCli = selection;
    },
    // 选择未添加的人员 ，点击添加
    putCycleAddStaff() {
      if (this.selectionProjCli.length <= 0) {
        this.$Message.warning("请选择要添加的人员!");
      } else {
        let projCliList = [];
        for (let i = 0; i < this.selectionProjCli.length; i++) {
          projCliList.push(this.selectionProjCli[i].staff_id);
        }
        let data = {
          ruleId: this.staff.ruleId,
          staffIds: projCliList
        };
        let _this = this;
        ApiPutCycleAddStaff(
          qs.stringify(data, { arrayFormat: "brackets" })
        ).then(function(res) {
          if (res.code == "success") {
            _this.$Message.success("添加成功!");
            _this.addStaffModal = false;
            _this.getCycleStaff(_this.staff.ruleId);
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    //清除form表单
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 清除 员工
    resetStaff() {
      this.staff.deptName = "";
      this.staff.staffName = "";
      this.staff.staffNumber = "";
      this.getCycleStaff();
    },
    // 清除 未添加的人员
    resetAddStaff() {
      this.addStaff.deptName = "";
      this.addStaff.staffName = "";
      this.addStaff.staffNumber = "";
      this.getStaffCyele();
    },
    // 重置 详情下的 周期列表
    resetSyeleList() {
      this.sycle.startDate = "";
      this.sycle.endDate = "";
      this.getCycleRule();
    }
  },
  mounted() {
    this.getCycleRulePage();
  }
};
</script>
<style lang="scss">
@import "../../common/css/variable.scss";
@import "../../common/css/mixin";
@import "../../common/css/base";

.s-input-wrapper {
  @include datapick-label();
  @include clear-both();
}
.title {
  height: 57px;
  padding-top: 8px;
}
.ivu-date-picker {
  width: 100%;
}
.font-color {
  color: $font-dark-color;
}
.cycle-content {
  .ivu-col {
    margin-top: 10px;
  }
  .ivu-alert {
    margin-bottom: 0;
    margin-top: 20px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .ivu-alert-success{
    margin-bottom: -10px;
  }
}
</style>
