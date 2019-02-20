/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:10:33 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-01-31 14:27:55
 * @instructions 员工工时利用率表
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
        <div v-if="privilegeData.REP_TS_UR_VIEW_GEN">
          <Col :xs="24" :sm="12" :md="6">
          <Input v-model.trim="report.staffName">
          <span slot="prepend"> 姓名 </span>
          </Input>
          <split></split>
          </Col>
          <Col :xs="24" :sm="12" :md="6">
          <Input v-model.trim="report.staffNumber">
          <span slot="prepend"> 工号 </span>
          </Input>
          <split></split>
          </Col>
          <Col :xs="24" :sm="12" :md="6">
          <div class="s-input-wrapper">
            <label>
                  开始时间
                </label>
            <DatePicker :editable='false' type="date" v-model="report.startTime" :clearable="false"></DatePicker>
  
          </div>
          <split></split>
  
          </Col>
          <Col :xs="24" :sm="12" :md="6">
          <div class="s-input-wrapper">
            <label>
                  结束时间
                </label>
            <DatePicker :editable='false' type="date" v-model="report.endTime" :clearable="false"></DatePicker>
  
          </div>
          <split></split>
          </Col>
        </div>
        <Col :xs="24">
        <span v-if="privilegeData.REP_TS_UR_VIEW_GEN">
              <Button type="info" @click="geteportDepts"> 查询 </Button>
              <Button @click="resetStaffTsheet"> 重置 </Button>
            </span>
        <Button type="primary" v-if="privilegeData.REP_TS_UR_OUT_GEN" @click="getReportStaffTsheetExport"> 导出 </Button>
        </Col>
      </Row>
      <Row>
        <Col span="24" class="staff-title">
        <split></split>
        <h2>员工工时利用率报表</h2>
        <p>
          <span> 制作人：{{ userName }}</span>
          <span> 日期：{{ currentTime }}</span>
        </p>
        </Col>
        <Col span="24">
        <Table stripe :columns="columnsStaff" :data="staffTsheetData"></Table>
        </Col>
      </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
  const tarSpan = (vm, h, params) => {
    return h(
      "span", {
        style: {
          color: 'red'
        },
      },
      params.row.paidUtilizationRate
    );
  };
  import axios from "axios";
  import {
    ApiGeteportDepts,
    ApiGetStaffTsheetUtilization,
    ApiGetReportStaffTsheetExport
  } from "@/api/report/report-api";
  import moment from "moment";
  import split from "components/unit/split";
  import {
    privilege
  } from "common/js/privilege";
  export default {
    components: {
      split
    },
    data() {
      return {
        privilegeData: {
          REP_TS_UR_OUT_GEN: false, //导出
          REP_TS_UR_VIEW_GEN: false //查询
        },
        deptsDataTree: [], // 组织树
        statusList: [], //字段list
        report: {
          deptId: "",
          staffName: "",
          staffNumber: "",
          startTime: moment()
            .subtract(7, "days")
            .format("YYYY-MM-DD"),
          endTime: moment().format("YYYY-MM-DD")
        },
        staffTsheetData: [], // 获取员工工时利用率表数据
        columnsStaff: [{
            type: "index",
            title: "序号",
            width: 60,
            align: "center"
          },
          {
            title: "工号",
            key: "staffNumber",
            align: "center"
          },
          {
            title: "姓名",
            key: "staffName",
            align: "center"
          },
           {
            title: "职位",
            key: "positionName",
            align: "center"
          },
          {
            title: "入职日期",
            key: "entryDate",
            align: "center"
          },
          {
            title: "级别",
            key: "positionLevelName",
            align: "center"
          },
          {
            title: "项目有偿工时",
            key: "paidWorkHours",
            align: "center"
          },
          {
            title: "项目无偿工时",
            key: "freeWorkHours",
            align: "center"
          },
          {
            title: "非项目",
            key: "nonProjectWorkHours",
            align: "center"
          },
          {
            title: "请假",
            key: "vacationWorkHours",
            align: "center"
          },
          {
            title: "应出勤时间",
            key: "attendanceWorkHours",
            align: "center"
          },
          {
            title: "工时利用率",
            key: "utilizationRate",
            align: "center"
          },
          {
            title: "有偿工时利用率",
            key: "paidUtilizationRate",
            align: "center",
            render: (h, params) => {
              return h("div", [
                (function(vm) {
                  let paid = parseFloat(params.row.paidUtilizationRate) ;
                  let targ = parseFloat(params.row.targetUtilizationRate);
                  if (targ <=  paid) {
                    return params.row.paidUtilizationRate;
                  } else {
                    return tarSpan(vm, h, params);
                  }
                })(this),
              ]);
            }
          },
          {
            title: "目标工时利用率",
            key: "targetUtilizationRate",
            align: "center"
          }
        ]
      };
    },
    methods: {
      init() {
        let me = this;
        this.geteportDepts();
        //获取三级菜单权限
        privilege(me.privilegeData).then(function(result) {
          me.privilegeData = result;
        });
      },
      // 请求左侧树形结构数据
      geteportDepts() {
        let _this = this;
        ApiGeteportDepts().then(function(res) {
          if (res.code == "success") {
            _this.deptsDataTree = res.data;
            if (_this.report.deptId == "") {
              _this.report.deptId = res.data[0].deptId;
            }
            _this.getStaffTsheetUtilization();
          }
        });
      },
      // 请求 员工工时利用率报表
      getStaffTsheetUtilization() {
        let _this = this;
        _this.report.startTime = _this.report.startTime ?
          moment(_this.report.startTime).format("YYYY-MM-DD") :
          "";
        _this.report.endTime = _this.report.endTime ?
          moment(_this.report.endTime).format("YYYY-MM-DD") :
          "";
        ApiGetStaffTsheetUtilization(_this.report).then(function(res) {
          if (res.code == "success") {
            if (res.data) {
              _this.staffTsheetData = res.data;
            } else {
              _this.staffTsheetData = [];
            }
          }
        });
      },
      //  重置
      resetStaffTsheet() {
        this.report.deptId = this.deptsDataTree[0].deptId;
        this.report.staffName = "";
        this.report.staffNumber = "";
        this.startTime = moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD");
        this.endTime = moment().format("YYYY-MM-DD");
        this.geteportDepts();
      },
      //部门组织树上选中一个部门
      depSelect(msg) {
        this.report.deptId = msg[0].deptId;
        this.getStaffTsheetUtilization();
      },
      // 导出
      getReportStaffTsheetExport() {
        let _data = {
          deptId: this.report.deptId,
          staffNumber: this.report.staffNumber,
          staffName: this.report.staffName,
          startTime: this.report.startTime,
          endTime: this.report.endTime
        };
        ApiGetReportStaffTsheetExport(_data).then(data => {
          if (!data) {
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `员工工时利用率表.xlsx`);
          document.body.appendChild(link);
          link.click();
        });
      }
    },
    watch: {
      $route(to, from) {
        this.init();
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
      this.init();
    }
  };
</script>

<style lang="scss">
  @import "../../common/css/mixin";
  @import "../../common/css/base";
  .s-input-wrapper {
    @include datapick-label();
    @include clear-both();
  }
  
  .staff-title {
    h2 {
      text-align: center;
    }
  }
</style>
