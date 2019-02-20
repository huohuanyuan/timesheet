/*
 * @Author: liuhaosheng 
 * @Date: 2018-08-29 16:52:19 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-13 13:39:22
 * 员工考勤报表
 */
<template>
  <div>
    <Row :gutter="16">
      <Col :md="6" :sm="8" :lg="4">
      <Row :gutter="16">
        <Tree :data="deptsDataTree" @on-select-change="depSelect"></Tree>
      </Row>
      </Col>
      <Col :md="18" :sm="16" :lg="20">
      <Row :gutter="16">
        <div v-if="privilegeData.REP_ATT_DTL_VIEW_GEN">
          <Col :xs="24" :sm="12" :md="6">
          <Input v-model.trim="attendance.staffName">
          <span slot="prepend"> 姓名 </span>
          </Input>
          <split></split>
          </Col>
          <Col :xs="24" :sm="12" :md="6">
          <Input v-model.trim="attendance.staffNumber">
          <span slot="prepend"> 工号 </span>
          </Input>
          <split></split>
          </Col>
          <Col :sm="12" :md="6" :xs="24">
          <div class="s-input-wrapper">
            <label>
              时间
            </label>
            <DatePicker :editable='false' type="month" v-model="attendance.yearMonth" :clearable="false"></DatePicker>
          </div>
          <split></split>
          </Col>
        </div>
        <Col :xs="24" :sm="12" :md="6">
        <span v-if="privilegeData.REP_ATT_DTL_VIEW_GEN">
          <Button type="info" @click="getStaffAttendance"> 查询 </Button>
          <Button @click="resetStaffAttendance"> 重置 </Button>
        </span>
        <Button type="primary" v-if="privilegeData.REP_ATT_DTL_OUT_GEN" @click="downLoadFun"> 导出 </Button>
        </Col>
      </Row>
      <Row class="staff-wrap">
        <Col class="staff-title">
        <split></split>
        <h2>员工考勤报表</h2>
        <p>
          <span> 制作人：{{ userName }}</span>
          <span> 日期：{{ currentTime }}</span>
        </p>
        </Col>
        <Col span="24">
        <Table stripe :columns="columnsAttendance" :data="staffAttendanceData"></Table>
        </Col>
      </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
import {
  ApiGeteportDepts,
  ApiGetStaffTsheetAtt,
  ApiGetReportStaffAttExport
} from "@/api/report/report-api";
import moment from "moment";
import split from "components/unit/split";
import { resCode } from "@/api/code";
import { privilege } from "common/js/privilege";

export default {
  components: {
    split
  },
  data() {
    return {
      privilegeData: {
        REP_ATT_DTL_OUT_GEN: false, //导出
        REP_ATT_DTL_VIEW_GEN: false //查询
      },
      deptsDataTree: [], // 组织树
      attendance: {
        deptId: "",
        staffName: "",
        staffNumber: "",
        yearMonth: moment()
          .subtract(1, "months")
          .format("YYYY-MM")
      },
      staffAttendanceData: [],
      columnsAttendance: [
        {
          title: "工号",
          key: "staffNumber",
          align: "center",
          width: 100
        },
        {
          title: "姓名",
          key: "name",
          width: 100,
          align: "center"
        },
        {
          title: "迟到早退(次)",
          key: "laterEarlyTimes",
          width: 110,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.laterEarlyTimes ? params.row.laterEarlyTimes : 0
            );
          }
        },
        {
          title: "未刷卡(次)",
          key: "notSignedTimes",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.notSignedTimes ? params.row.notSignedTimes : 0
            );
          }
        },
        {
          title: "出差(天)",
          key: "travelDays",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.travelDays ? params.row.travelDays : 0
            );
          }
        },
        {
          title: "外出",
          key: "egressHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.egressHours ? params.row.egressHours : 0
            );
          }
        },
        {
          title: "产检",
          key: "antenatalCareHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.antenatalCareHours ? params.row.antenatalCareHours : 0
            );
          }
        },
        {
          title: "陪产假(天)",
          key: "paternityLeaveDays",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.paternityLeaveDays ? params.row.paternityLeaveDays : 0
            );
          }
        },
        {
          title: "病假",
          key: "sickLeaveHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.sickLeaveHours ? params.row.sickLeaveHours : 0
            );
          }
        },
        {
          title: "事假",
          key: "compassionateLeaveHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.compassionateLeaveHours
                ? params.row.compassionateLeaveHours
                : 0
            );
          }
        },
        {
          title: "例假(天)",
          key: "officialLeaveDays",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.officialLeaveDays ? params.row.officialLeaveDays : 0
            );
          }
        },
        {
          title: "哺乳假",
          key: "lactationLeaveHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.lactationLeaveHours
                ? params.row.lactationLeaveHours
                : 0
            );
          }
        },
        {
          title: "婚假(天)",
          key: "marriageHolidayDays",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.marriageHolidayDays
                ? params.row.marriageHolidayDays
                : 0
            );
          }
        },
        {
          title: "慰唁假(天)",
          key: "condolencesDays",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.condolencesDays ? params.row.condolencesDays : 0
            );
          }
        },
        {
          title: "产假(天)",
          key: "maternityLeaveDays",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.maternityLeaveDays ? params.row.maternityLeaveDays : 0
            );
          }
        },
        {
          title: "年假(天)",
          key: "annualLeaveDays",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.annualLeaveDays ? params.row.annualLeaveDays : 0
            );
          }
        },
        {
          title: "周末加班",
          key: "weekendOvertimeHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.weekendOvertimeHours
                ? params.row.weekendOvertimeHours
                : 0
            );
          }
        },
        {
          title: "工作日加班",
          key: "weekdayOvertimeHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.weekdayOvertimeHours
                ? params.row.weekdayOvertimeHours
                : 0
            );
          }
        },
        {
          title: "节假日加班",
          key: "vacationOvertimeHours",
          width: 110,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.vacationOvertimeHours
                ? params.row.vacationOvertimeHours
                : 0
            );
          }
        },
        {
          title: "倒休",
          key: "vacationsHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.vacationsHours ? params.row.vacationsHours : 0
            );
          }
        },
        {
          title: "特别休假",
          key: "specialLeaveHours",
             width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.specialLeaveHours ? params.row.specialLeaveHours : 0
            );
          }
        },
        {
          title: "剩余年假(天)",
          key: "surAnnualLeaveDays",
          width: 110,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.surAnnualLeaveDays ? params.row.surAnnualLeaveDays : 0
            );
          }
        },
        {
          title: "剩余休假",
          key: "surVacationsBalanceHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.surVacationsBalanceHours
                ? params.row.surVacationsBalanceHours
                : 0
            );
          }
        },
        {
          title: "剩余调休",
          key: "surSpecialBalanceHours",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.surSpecialBalanceHours
                ? params.row.surSpecialBalanceHours
                : 0
            );
          }
        }
      ]
    };
  },
  methods: {
    //部门组织树上选中一个部门
    depSelect(msg) {
      this.attendance.deptId = msg[0].deptId;
      this.getStaffAttendance();
    },
    // 请求左侧 树形数据
    geteportDepts() {
      ApiGeteportDepts().then(res => {
        if (res.code == "success") {
          this.deptsDataTree = res.data;
          if (this.attendance.deptId == "") {
            this.attendance.deptId = res.data[0].deptId;
          }
          this.getStaffAttendance();
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 导出文件方法
    downLoadFun() {
      if (this.attendance.deptId == "") {
        this.$Message.warning("请选择部门!");
        return false;
      }
      this.attendance.yearMonth = moment(this.attendance.yearMonth).format(
        "YYYY-MM"
      );

      let _data = {
        staffName: this.attendance.staffName,
        staffNumber: this.attendance.staffNumber,
        yearMonth: this.attendance.yearMonth,
        deptId: this.attendance.deptId
      };
      ApiGetReportStaffAttExport(_data).then(data => {
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `员工考勤报表.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    },
    getStaffAttendance() {
      this.attendance.yearMonth = moment(this.attendance.yearMonth).format(
        "YYYY-MM"
      );
      ApiGetStaffTsheetAtt(this.attendance).then(res => {
        if (res.code == "success") {
          if (res.data) {
            this.staffAttendanceData = res.data;
          }
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    resetStaffAttendance() {
      this.attendance.staffName = "";
      this.attendance.staffNumber = "";
      this.attendance.yearMonth = moment()
        .subtract(1, "months")
        .format("YYYY-MM");
      this.geteportDepts();
    }
  },
  computed: {
    userName() {
      return localStorage.getItem("name");
    },
    currentTime() {
      return moment(new Date().getTime()).format("YYYY-MM-DD");
    }
  },
  mounted() {
    this.geteportDepts();
    privilege(this.privilegeData).then(res => {
      this.privilegeData = res;
    });
  }
};
</script>

<style lang="scss">
@import "../../common/css/mixin";
@import "../../common/css/base";
.s-input-wrapper {
  @include datapick-label();
  @include select-label();
  @include clear-both();
}
.staff-wrap {
  h2 {
    text-align: center;
  }
}
</style>
