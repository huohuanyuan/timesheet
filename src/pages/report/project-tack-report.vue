/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:09:57 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-09-04 11:03:52
 * @instructions 项目任务工时报表
 */
<template>
  <div>
    <Row :gutter="8">
      <div v-if="privilegeData.REP_TS_TASK_OUT_GEN">
        <Col :sm="12" :md="12" :xs="24">
        <div class="s-input-wrapper">
          <label>
            合同编号
          </label>
          <Select v-model="project.contractCodes" multiple filterable>
            <Option v-for="item in contractCodeList" :value="item.contractCode" :key="item.contractCode">{{ item.contractCode }}</Option>
          </Select>
        </div>
        <split></split>
        </Col>
        <Col :sm="12" :md="6" :xs="24">
        <div class="s-input-wrapper">
          <label>
            时间
          </label>
          <DatePicker :editable='false' type="year" v-model="project.year" :clearable="false"></DatePicker>
        </div>
        <split></split>
        </Col>
      </div>
      <Col :sm="12" :md="6" :xs="24">
      <span v-if="privilegeData.REP_TS_TASK_OUT_GEN">
        <Button type="info" @click.native="getReportStaffProject"> 查询 </Button>
        <Button @click="resetProject"> 重置 </Button>
      </span>
      <Button type="primary" @click="downLoadFun" v-if="privilegeData.REP_TS_TASK_VIEW_GEN"> 导出
      </Button>
      <split></split>
      </Col>
    </Row>
    <div class="project-wrap" v-show="projectWrapShow">
      <split></split>
      <h2>
        项目任务工时报表
      </h2>
      <p>
        <span> 制作人： {{userName}}</span>
        <span> 日期： {{currentTime}}</span>
      </p>
      <el-table :data="tableReportData" stripe :span-method="objectSpanMethod" border>
        <el-table-column prop="contractCode" label="合同编号" width="180">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" width="140">
        </el-table-column>
        <el-table-column prop="janTime" label="一月">

        </el-table-column>
        <el-table-column prop="febTime" label="二月">
        </el-table-column>
        <el-table-column prop="marTime" label="三月">
        </el-table-column>
        <el-table-column prop="aprTime" label="四月">
        </el-table-column>
        <el-table-column prop="mayTime" label="五月">
        </el-table-column>
        <el-table-column prop="junTime" label="六月">
        </el-table-column>
        <el-table-column prop="julTime" label="七月">
        </el-table-column>
        <el-table-column prop="augTime" label="八月">
        </el-table-column>
        <el-table-column prop="sepTime" label="九月">
        </el-table-column>
        <el-table-column prop="octTime" label="十月">
        </el-table-column>
        <el-table-column prop="novTime" label="十一月">
        </el-table-column>
        <el-table-column prop="decTime" label="十二月">
        </el-table-column>
        <el-table-column prop="sumTime" label="合计">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import qs from "qs";

import axios from "axios";
import moment from "moment";
import {
  ApiGetReportTaskProject,
  ApiGetDepartmentProj,
  ApiGetReportTsheetExport
} from "@/api/report/report-api";
import split from "components/unit/split";
import { privilege } from "common/js/privilege";
export default {
  components: {
    split
  },
  data() {
    return {
      projectWrapShow: false,
      privilegeData: {
        REP_TS_TASK_OUT_GEN: false, //导出
        REP_TS_TASK_VIEW_GEN: false //查询
      },
      contractCodeList: [],
      project: {
        contractCodes: [],
        year: moment().format("YYYY")
      },
      tableReportData: [],
      letmap: ""
    };
  },
  methods: {
    init() {
      let me = this;
      //获取三级菜单权限
      privilege(me.privilegeData).then(function(result) {
        me.privilegeData = result;
      });
      this.getDepartmentProj();
    },
    // 请求下拉列表的 合同编号
    getDepartmentProj() {
      let _this = this;
      ApiGetDepartmentProj().then(function(res) {
        if (res.code == "success") {
          _this.contractCodeList = res.data;
        }
      });
    },
    // 导出文件方法
    downLoadFun() {
      if (this.project.contractCodes.length == 0 || this.project.year == "") {
        this.$Message.warning("请选择合同编号!");
        return false;
      }
      if (this.project.year) {
        this.project.year = moment(this.project.year).format("YYYY");
      }
      let contractCodesList = "";
      for (let i = 0; i < this.project.contractCodes.length; i++) {
        contractCodesList +=
          "contractCodes[]=" + this.project.contractCodes[i] + "&";
      }
      let _data = {
        contractCodes: contractCodesList,
        year: this.project.year
      };
      ApiGetReportTsheetExport(_data).then(data => {
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `员工工时利用率报表.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    },
    // 点击查询
    getReportStaffProject() {
      let _this = this;
      if (_this.project.year) {
        _this.project.year = moment(_this.project.year).format("YYYY");
      }
      if (_this.project.contractCodes.length == 0 || _this.project.year == "") {
        _this.$Message.warning("请选择合同编号!");
        return false;
      }
      ApiGetReportTaskProject(_this.project).then(function(res) {
        if ((res.code = "success")) {
          if (res.data.length <= 1) {
            _this.projectWrapShow = false;
            _this.$Message.warning("该合同编号暂无报表!");
          } else {
            _this.tableReportData = res.data;
            _this.projectWrapShow = true;
          }
          let map = new Map();
          let num = 1;
          for (let i = 1; i < res.data.length; i++) {
            if (i != res.data.length - 1) {
              //不是最后一行
              if (res.data[i].projectId == res.data[i - 1].projectId) {
                num += 1;
              } else {
                map.set(i - num, num);
                num = 1;
              }
            } else {
              //最后一行
              if (res.data[i].projectId == res.data[i - 1].projectId) {
                num += 1;
                map.set(i + 1 - num, num);
              } else {
                map.set(i - num, num);
                map.set(i, 1);
                num = 1;
              }
            }
          }
          _this.letmap = map;
        }
      });
    },
    /**
     * 合并单元格方法
     * @param  {Object} row 横向数据
     * @param  {Object} column 纵向数据
     * @param  {Number} rowIndex 当前横向下标
     * @param  {Number} columnIndex 当前纵行下标
     * */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.tableReportData.length <= 1) {
        return false;
      } else {
        if (columnIndex === 0) {
          if (this.letmap.has(rowIndex)) {
            return {
              rowspan: this.letmap.get(rowIndex),
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    },
    // 重置方法
    resetProject() {
      this.project.contractCodes = [];
      this.project.year = moment().format("YYYY");
      this.getReportStaffProject();
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
// scoped
@import "../../common/css/mixin";
@import "../../common/css/base";
.s-input-wrapper {
  @include datapick-label();
  @include select-label();
  @include clear-both();
}

.project-wrap {
  h2 {
    text-align: center;
  }
}
</style>
