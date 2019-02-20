/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:59:17 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-19 17:36:34
 * @instructions： 工时填报list 
 */

<template>
  <div>
    <div class="reg-record">
      <Row :gutter="16">
        <Col :md='6' :sm='12'>
        <Input v-model="tsheetListParams.formCode">
        <span slot="prepend">工时单号</span>
        </Input>
        <split></split>
        </Col>
        <Col :md='6' :sm='12'>
        <div class="s-input-wrapper">
          <label>
            周期开始时间
          </label>
          <DatePicker :editable='false' type="date" v-model="tsheetListParams.recordStart"></DatePicker>
        </div>
        <split></split>
        </Col>
        <Col :md='6' :sm='12'>
        <div class="s-input-wrapper">
          <label>
            周期结束时间
          </label>
          <DatePicker :editable='false' type="date" v-model="tsheetListParams.recordEnd"></DatePicker>
        </div>
        <split></split>
        </Col>
        <Col :md='6' :sm='12'>
        <div>
          <Button type="info" @click="seach">查询</Button>
          <Button @click="reset">重置</Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <Row>
        <Button type="info" @click="getPeriodList" :loading="loading">新增</Button>
        <split></split>
      </Row>
      <Table :columns="recordCol" :data="declareTableData"></Table>
      <div class="page">
        <Page :total="declareTableTotal" size="small" :current="tsheetListParams.pageNum" :page-size="tsheetListParams.pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
        </Page>
      </div>
      <!-- 新增选择周期modal -->
      <Modal v-model="periodModal" title="选择周期" class="period-modal" :mask-closable=false>
        <div v-if="periodList.length>0" class="s-select-wrapper">
          <label>申报周期</label>
          <Select v-model="tcycleId" :label-in-value="labelInValue" @on-change="selectCycle">
            <Option v-for="item in periodList" :value="item.value" :key="item.value" :label="item.text">{{item.text}}</Option>
          </Select>
        </div>
        <div v-else>
          <p>您当前没有可申报工时，请按时申报！</p>
        </div>
        <split></split>
        <p slot="footer">
          <Button v-if="periodList.length>0" type="primary" @click="reportedTime">填报</Button>
          <Button @click="periodModal=false">关闭</Button>
        </p>
      </Modal>
      <!-- 审批轨迹 -->
      <Modal v-model="checkPathModal" title="审批轨迹" width="800">
        <Row type="flex" :gutter="16" align="top">
          <Col :sm='12'> 工时单号：{{checkPathData.tsheetCode}}
          </Col>
          <Col :sm='12'> 申报人：{{checkPathData.declareStaff}}
          </Col>
        </Row>
        <split></split>
        <Row type="flex" :gutter="16" align="top">
          <Col :sm='12'> 申报周期：{{checkPathData.declareCycle}}
          </Col>
          <Col :sm='12'> 申报日期：{{checkPathData.formDate}}
          </Col>
        </Row>
        <split></split>
        <Table :columns="checkPathCol" :data="checkPathTableData"></Table>
        <p slot="footer">
          <Button @click="checkPathModal=false">关闭</Button>
        </p>
      </Modal>
    </div>
    <div></div>
  </div>
</template>
<script>
import Split from "components/unit/split";
import moment from "moment";
import { mapState } from "vuex";
import qs from "qs";
import { resCode } from "@/api/code";
import Cookies from "js-cookie";
import {
  ApiGetTsheetCycle,
  ApiTsheetDeclare,
  ApiGetTsheetDaily,
  ApiRepealTsheet,
  ApiDeleteTsheetForm
} from "@/api/timesheet/timedeclare-api";
import { ApiGetCheckPath } from "@/api/timesheet/timecheck-api";
import { privilege } from "common/js/privilege";
const viewButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "success"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          let formId = params.row.formId;
          vm.viewTsheet(formId);
        }
      }
    },
    "查看"
  );
};
const editButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "primary"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.modifyTsheet(params);
        }
      }
    },
    "编辑"
  );
};
const declareButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "warning"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.declareSheet(params.row.formId);
        }
      }
    },
    "申报"
  );
};
const repealButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "error"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.repealSheet(params);
        }
      }
    },
    "撤销"
  );
};
const checkRecordButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "info"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.chekcRecord(params.row);
        }
      }
    },
    "审批轨迹"
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
          vm.remove(params.row.formId);
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
export default {
  components: {
    Split
  },
  data() {
    return {
      periodModal: false,
      labelInValue: true,
      loading: false, //新增按钮loading
      periodList: [],
      tcycleId: "",
      selectedLabel: "",
      declareEnd: "", // 申报结束时间
      declareStart: "", // 申报开始时间
      canSubmit: Boolean, // 是否显示申报按钮
      checkPathModal: false,
      checkPathCol: [
        //审批轨迹列数据
        {
          type: "index",
          title: "序号",
          width: 80,
          align: "center"
        },
        {
          title: "审批状态",
          key: "apvResult",
          align: "center",
          width: 100,
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                let str = "";
                if (params.row.apvResult) {
                  str = "通过";
                } else {
                  str = "驳回";
                }
                return str;
              })(this)
            );
          }
        },
        {
          title: "审批人",
          key: "approverName",
          align: "center",
          width: 100
        },
        {
          title: "审批时间",
          key: "apvDate",
          align: "center",
          width: 150,
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.apvDate).format("YYYY-MM-DD  HH:mm:ss");
              })(this)
            );
          }
        },
        {
          title: "备注",
          key: "apvComment",
          render: function(h, params) {
            return h(
              "div",
              params.row.apvComment ? params.row.apvComment : "--"
            );
          }
        }
      ],
      checkPathTableData: [], //审批轨迹表格数据
      checkPathData: {
        //审批轨迹数据
        tsheetCode: "", ///工时单号
        declareCycle: "", //申报周期
        declareStaff: "", //申报人
        formDate: "" //填报日期
      },
      recordCol: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.tsheetListParams.pageNum - 1) *
                    vm.tsheetListParams.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "审批单号",
          key: "formCode",
          align: "center"
        },
        {
          title: "工时周期",
          key: "formCode",
          align: "center",
          render: (h, params) => {
            let start = moment(params.row.recordStart).format("YYYY-MM-DD");
            let end = moment(params.row.recordEnd).format("YYYY-MM-DD");
            return h("div", start + "--" + end);
          }
        },
        {
          title: "申报截止日期",
          key: "declareEnd",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              moment(params.row.declareEnd).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "申报日期",
          key: "declareDate",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.declareDate) {
                  return moment(params.row.declareDate).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                } else {
                  return "--";
                }
              })(this)
            );
          }
        },
        {
          title: "状态",
          align: "center",
          key: "statusName",
          filters: [
            {
              label: "未提交",
              value: 52
            },
            {
              label: "审核中",
              value: 54
            },
            {
              label: "审核通过",
              value: 55
            },
            {
              label: "审核失败",
              value: 56
            },
            {
              label: "过期锁定",
              value: 53
            }
          ],
          filterMultiple: false,
          filterRemote(value, row) {
            this.tsheetListParams.status = value[0];
            this.tsheetListParams.pageNum = 1;
            this.$store.commit("getTsheetList", this.tsheetListParams);
          }
        },
        {
          title: "审批人",
          align: "center",
          key: "approverName",
          sortable: true
        },
        {
          title: "操作",
          align: "center",

          render: (h, params) => {
            return h("div", {}, [
              viewButton(this, h, params),

              (function(vm) {
                if (
                  params.row.statusCode == "UNSUBMIT_LABOR_HOUR" ||
                  params.row.statusCode == "FAIL_LABOR_HOUR"
                ) {
                  //未提交或者审核失败
                  return h("span", [
                    editButton(vm, h, params),
                    deleteButton(vm, h, params) // 删除按钮
                  ]);
                }
              })(this),
              (function(vm) {
                //未提交或者审核失败且提交截止日期大于当前时间
                // let now = moment();
                // let declareEnd = params.row.declareEnd;
                //工时申报是否已经截止
                // let isEnd = false;
                // if (moment(now).isAfter(declareEnd, "day")) {
                //   isEnd = true;
                // }
                if (
                  (params.row.statusCode == "UNSUBMIT_LABOR_HOUR" ||
                    params.row.statusCode == "FAIL_LABOR_HOUR") &&
                  // !isEnd &&
                  params.row.canSubmit
                ) {
                  return declareButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                //审核中
                if (params.row.statusCode == "AUDIT_LABOR_HOUR") {
                  return repealButton(vm, h, params);
                }
              })(this),
              checkRecordButton(this, h, params)
            ]);
          }
        }
      ],
      tsheetListParams: {
        formCode: "",
        recordStart: "",
        recordEnd: "",
        status: "",
        approverId: "",
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    seach() {
      this.tsheetListParams.pageNum = 1;
      this.$store.commit("getTsheetList", this.tsheetListParams);
    },
    getPeriodList: function() {
      //获取填报周期
      this.loading = true;
      this.tcycleId = "";
      ApiGetTsheetCycle()
        .then(res => {
          this.periodList = [];
          if ((res.code = "success")) {
            this.periodModal = true;
            this.loading = false;
            if (res.data && res.data.length > 0) {
              for (let i = 0, len = res.data.length; i < len; i++) {
                let now = moment();
                let declareEnd = res.data[i].declareEnd;
                //工时申报是否已经截止
                if (
                  moment(now).isBefore(declareEnd, "day") ||
                  moment(now).isSame(declareEnd, "day")
                ) {
                  let recordStart = moment(res.data[i].recordStart).format(
                    "YYYY-MM-DD"
                  );
                  let recordEnd = moment(res.data[i].recordEnd).format(
                    "YYYY-MM-DD"
                  );
                  this.periodList.push({
                    text: recordStart + "----" + recordEnd,
                    value: res.data[i].tcycleId,
                    declareEnd: res.data[i].declareEnd,
                    declareStart: res.data[i].declareStart,
                    canSubmit: res.data[i].canSubmit
                  });
                }
              }
            }
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        })
        .catch(function() {
          this.periodList = [];
        });
    },
    //新建工时
    reportedTime: function() {
      if (this.tcycleId) {
        this.periodModal = false;
        this.$store.commit("showRegWrap", "regForm");
        this.recordStart = this.selectedLabel.split("----")[0];
        this.recordEnd = this.selectedLabel.split("----")[1];
        this.$store.commit("getStudyTaskList", {
          recordStart: this.recordStart,
          recordEnd: this.recordEnd
        });

        let staffId = Cookies.get("staffId");
        let params = {
          tcycleId: this.tcycleId,
          recordStart: this.recordStart,
          recordEnd: this.recordEnd,
          declareEnd: this.declareEnd,
          declareStart: this.declareStart,
          canSubmit: this.canSubmit
        };
        //设置新建工时是table的初始值
        this.$store.commit("setNewTsheetData", params);
        //获取个人有效工时
        this.$store.commit("getStaffValidTime", {
          staffId: staffId,
          startWorkDate: this.recordStart,
          endWorkDate: this.recordEnd
        });
      }
    },
    selectCycle: function(data) {
      this.tcycleId = data.value;
      this.selectedLabel = data.label;
      for (let i = 0, len = this.periodList.length; i < len; i++) {
        if (this.tcycleId == this.periodList[i].value) {
          this.declareEnd = this.periodList[i].declareEnd;
          this.declareStart = this.periodList[i].declareStart;
          this.canSubmit = this.periodList[i].canSubmit;
        }
      }
    },
    //查看
    viewTsheet: function(formId) {
      ApiGetTsheetDaily({ formId: formId }).then(res => {
        if (res.code == "success") {
          this.$store.commit("showRegWrap", "regView");
          this.$store.commit("setTsheetViewData", res.data);
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //编辑
    modifyTsheet: function(params) {
      let formId = params.row.formId;
      let staffId = Cookies.get("staffId");
      let recordStart = moment(params.row.recordStart).format("YYYY-MM-DD");
      let recordEnd = moment(params.row.recordEnd).format("YYYY-MM-DD");
      let approverId = params.row.approver;
      ApiGetTsheetDaily({ formId: formId }).then(res => {
        if (res.code == "success") {
          this.$store.commit("showRegWrap", "regModify");
          this.$store.commit("setTsheetViewData", res.data);
          this.$store.commit("getStaffValidTime", {
            staffId: staffId,
            startWorkDate: recordStart,
            endWorkDate: recordEnd
          });
          //保存列表请求参数
          this.$store.commit("setDeclareListParams", this.tsheetListParams);
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });

      this.$store.commit("getStudyTaskList", {
        recordStart: recordStart,
        recordEnd: recordEnd,
        approver: approverId,
        formId: formId
      });
    },
    //审核轨迹
    chekcRecord: function(params) {    
      ApiGetCheckPath(params.formId).then(res => {
        if (res.code == "success") {
          this.checkPathModal = true;
          this.checkPathData.tsheetCode = params.formCode;
          this.checkPathData.declareStaff = params.staffName;
          this.checkPathData.formDate = params.declareDate
            ? moment(params.declareDate).format("YYYY-MM-DD HH:mm:ss")
            : "--";

          let start = moment(params.recordStart).format("YYYY-MM-DD");
          let end = moment(params.recordEnd).format("YYYY-MM-DD");
          this.checkPathData.declareCycle = start + "--" + end;
          this.checkPathTableData = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //分页跳转页面
    handlePage(value) {
      this.tsheetListParams.pageNum = value;
      this.$store.commit("getTsheetList", this.tsheetListParams);
    },
    //改变页面size
    handlePageSize(value) {
      this.tsheetListParams.pageSize = value;
      this.$store.commit("getTsheetList", this.tsheetListParams);
    },
    //表格过滤
    dataFilter: function(data) {
      this.tsheetListParams.status = data._filterChecked[0];
      this.$store.commit("getTsheetList", this.tsheetListParams);
    },
    //申报
    declareSheet: function(formId) {
      ApiTsheetDeclare(qs.stringify({ formId: formId })).then(res => {
        if (res.code == "success") {
          this.$Message.success("申报成功");
          this.$store.commit("getTsheetList", this.tsheetListParams);
        } else if (res.code == "lock_tsheet") {
          this.$Message.error("工单已锁定!");
          this.$store.commit("getTsheetList", this.tsheetListParams);
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //撤销
    repealSheet: function(params) {
      let formId = params.row.formId;
      ApiRepealTsheet(qs.stringify({ formId: formId })).then(res => {
        if (res.code == "success") {
          this.$Message.success("撤销成功");
          this.$store.commit("getTsheetList", this.tsheetListParams);
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 删除
    remove(formId) {
      ApiDeleteTsheetForm(formId).then(res => {
        if (res.code == "success") {
          this.$Message.success("删除成功");
          if (
            this.declareTableTotal == 1 &&
            this.tsheetListParams.pageNum > 1
          ) {
            this.tsheetListParams.pageNum--;
          }
          this.$store.commit("getTsheetList", this.tsheetListParams);
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //检索工单列表
    getTsheetList: function() {
      //检索时周期开始时间必须在周期结束时间之前
      if (
        this.tsheetListParams.recordStart &&
        this.tsheetListParams.recordEnd &&
        moment(this.tsheetListParams.recordStart).isAfter(
          this.tsheetListParams.recordEnd
        )
      ) {
        this.$Message.error("周期开始时间在周期结束时间之后，请检查");
      } else {
        this.$store.commit("getTsheetList", this.tsheetListParams);
      }
    },
    //重置
    reset: function() {
      (this.tsheetListParams.formCode = ""),
        (this.tsheetListParams.recordStart = ""),
        (this.tsheetListParams.recordEnd = ""),
        (this.tsheetListParams.pageNum = 1),
        this.$store.commit("getTsheetList");
    }
  },
  computed: mapState({
    declareTableData: function(state) {
      return this.$store.state.timeSheet.declareTableData;
    },
    declareTableTotal: function(state) {
      return this.$store.state.timeSheet.declareTableTotal;
    }
  })
};
</script>
<style lang="scss">
@import "../../../common/css/mixin";
@import "../../../common/css/base";
.reg-record {
  .s-input-wrapper {
    @include datapick-label();
    label {
      width: 100px;
    }
    .ivu-date-picker {
      width: calc(100% - 100px);
    }
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
}
.period-modal {
  .s-select-wrapper {
    height: 32px;
    @include select-label();
  }
}
</style>