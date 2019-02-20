/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:11:03 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-11-02 10:07:16
 * @instructions 员工工时明细报表
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
        <div v-if="privilegeData.REP_TS_DTL_VIEW_GEN">
          <Col :xs="24" :sm="12" :md="8">
          <Input v-model.trim="report.staffName">
          <span slot="prepend"> 姓名 </span>
          </Input>
          <split></split>
          </Col>
          <Col :xs="24" :sm="12" :md="8">
          <Input v-model.trim="report.staffNumber">
          <span slot="prepend"> 工号 </span>
          </Input>
          <split></split>
          </Col>
          <Col :xs="24" :sm="12" :md="8">
          <div class="s-input-wrapper">
            <label>
              任务状态
            </label>
            <Select v-model="report.status" clearable>
              <Option v-for="item in statusList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
            </Select>
          </div>
          <split></split>
          </Col>
          <Col :xs="24" :sm="12" :md="8">
          <div class="s-input-wrapper">
            <label>
              开始时间
            </label>
            <DatePicker :editable='false' type="date" v-model="report.startTime" :clearable="false"></DatePicker>
          </div>
          <split></split>
          </Col>
          <Col :xs="24" :sm="12" :md="8">
          <div class="s-input-wrapper">
            <label>
              结束时间
            </label>
            <DatePicker :editable='false' type="date" v-model="report.endTime" :clearable="false"></DatePicker>
          </div>
          <split></split>
          </Col>
        </div>
        <Col :xs="24" :sm="12" :md="8">
        <span v-if="privilegeData.REP_TS_DTL_VIEW_GEN">
          <Button type="info" @click="geteportDepts"> 查询 </Button>
          <Button @click="resetStaffTsheet"> 重置 </Button>
        </span>
        <Button type="primary" v-if="privilegeData.REP_TS_DTL_OUT_GEN" @click="getReportStaffDetailExport"> 导出 </Button>
        </Col>
      </Row>
      <Row class="staff-wrap">
        <Col class="staff-title">
        <split></split>
        <h2>员工工时明细报表</h2>
        <p>
          <span> 制作人：{{ userName }}</span>
          <span> 日期：{{ currentTime }}</span>
        </p>
        </Col>
        <Col span="24">
        <Table stripe :columns="columnsStaff" :data="staffTsheetData"></Table>
        <div class="page">
          <Page :total="report.total" size="small" :current="report.pageNum" :page-size="report.size" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
          </Page>
        </div>
        </Col>
      </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
import axios from "axios";
import {
  ApiGeteportDepts,
  ApiGetStaffTsheet,
  ApiGetReportStaffDetailExport
} from "@/api/report/report-api";
import { ApiGetDict } from "@/api/api";
import moment from "moment";
import split from "components/unit/split";
import { privilege } from "common/js/privilege";
export default {
  components: {
    split
  },
  data() {
    return {
      privilegeData: {
        REP_TS_DTL_OUT_GEN: false, //导出
        REP_TS_DTL_VIEW_GEN: false //查询
      },
      deptsDataTree: [], // 组织树
      statusList: [], //字段list
      report: {
        deptId: "",
        staffName: "",
        staffNumber: "",
        startTime: moment()
          .subtract(1, "months")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD"),
        status: "",
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      staffTsheetData: [], // 获取员工工时明细表数据
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
                  (vm.report.pageNum - 1) * vm.report.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
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
          title: "部门",
          key: "deptName",
          align: "center"
        },
        {
          title: "职位",
          key: "job",
          align: "center"
        },
        {
          title: "合同编号",
          key: "contractCode",
          align: "center"
        },
        {
          title: "任务名称",
          key: "taskName",
          align: "center"
        },
        {
          title: "工时日期",
          key: "tsheetDate",
          align: "center",
          render: (h, params) => {
            return h("div", moment(params.row.tsheetDate).format("YYYY-MM-DD"));
          }
        },
        {
          title: "状态",
          key: "statusCode",
          align: "center"
        },
        {
          title: "工时",
          key: "workHours",
          align: "center"
        }
      ]
    };
  },
  methods: {
    init() {
      let me = this;
      this.geteportDepts();
      this.getDict();
      //获取三级菜单权限
      privilege(me.privilegeData).then(function(result) {
        me.privilegeData = result;
      });
    },
    // 分页
    handlePage(value) {
      this.report.pageNum = value;
      this.getStaffTsheet();
    },
    handlePageSize(value) {
      this.report.pageSize = value;
      this.getStaffTsheet();
    },
    // 字典请求
    getDict() {
      let _this = this;
      ApiGetDict("LABOR_HOUR_STATUS").then(function(res) {
        if (res.code == "success") {
          _this.statusList = res.data;
        }
      });
    },
    // 请求左侧 树形数据
    geteportDepts() {
      let _this = this;
      ApiGeteportDepts().then(function(res) {
        if (res.code == "success") {
          _this.deptsDataTree = res.data;
          if (_this.report.deptId == "") {
            _this.report.deptId = res.data[0].deptId;
          }
          if (_this.report.deptId != "") {
            _this.getStaffTsheet();
          }
        }
      });
    },
    seach() {
      this.report.pageNum = 1;
      this.geteportDepts();
    },
    // 请求员工工时明细报表数据
    getStaffTsheet() {
      let _this = this;
      _this.report.startTime = _this.report.startTime
        ? moment(_this.report.startTime).format("YYYY-MM-DD")
        : "";
      _this.report.endTime = _this.report.endTime
        ? moment(_this.report.endTime).format("YYYY-MM-DD")
        : "";
      ApiGetStaffTsheet(_this.report).then(function(res) {
        if (res.code == "success") {
          _this.staffTsheetData = res.data;
          _this.report.total = res.total;
        }
      });
    },
    //  重置
    resetStaffTsheet() {
      this.report.deptId = this.deptsDataTree[0].deptId;
      this.report.staffName = "";
      this.report.staffNumber = "";
      this.report.startTime = moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      this.report.endTime = moment().format("YYYY-MM-DD");
      this.report.status = "";
      this.geteportDepts();
    },
    //部门组织树上选中一个部门
    depSelect(msg) {
      this.report.deptId = msg[0].deptId;
      this.getStaffTsheet();
    },
    //导出
    getReportStaffDetailExport() {
      this.report.startTime = moment(this.report.startTime).format(
        "YYYY-MM-DD"
      );
      this.report.endTime = moment(this.report.endTime).format("YYYY-MM-DD");
      let _data = {
        deptId: this.report.deptId,
        staffNumber: this.report.staffNumber,
        staffName: this.report.staffName,
        status: this.report.status,
        startTime: this.report.startTime,
        endTime: this.report.endTime
      };
      ApiGetReportStaffDetailExport(_data).then(data => {
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `员工工时明细报表.xlsx`);
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
.s-input-wrapper {
  @include select-label();
  @include clear-both();
}

.staff-wrap {
  h2 {
    text-align: center;
  }
}
</style>
