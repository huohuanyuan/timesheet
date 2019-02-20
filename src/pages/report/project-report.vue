/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:09:11 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-10-18 11:47:50
 * @instructions 项目员工工时报表
 */
<template>
  <div>
    <Row :gutter="8">
      <div v-if="privilegeData.REP_TS_PROJ_VIEW_GEN">
        <Col :sm="8" :md="8" :xs="24">
        <div class="s-input-wrapper">
          <label>
            合同编号
          </label>
          <Select v-model="project.contractCodes" multiple filterable>
            <Option v-for="item in contractCodeList" :value="item.projectId" :key="item.projectId">{{ item.contractCode }}</Option>
          </Select>
        </div>
        <split></split>
        </Col>
        <Col :sm="8" :md="8" :xs="24">
        <div class="s-input-wrapper">
          <label>
            员工姓名
          </label>
          <Select v-model="project.staffIdList" multiple filterable>
            <Option v-for="item in userList" :value="item.staffId" :key="item.staffId">{{ item.name }}</Option>
          </Select>
        </div>
        <split></split>
        </Col>
        <Col :sm="8" :md="8" :xs="24">
        <div class="s-input-wrapper">
          <label>
            时间
          </label>
          <DatePicker :editable='false' type="year" v-model="project.year" :clearable="false"></DatePicker>
        </div>
        <split></split>
        </Col>
      </div>

    </Row>
    <p>
      <span v-if="privilegeData.REP_TS_PROJ_VIEW_GEN">
        <Button type="info" @click.native="getReportStaffProject"> 查询 </Button>
        <Button @click="resetProject"> 重置 </Button>
      </span>
      <Button type="primary" v-if="privilegeData.REP_TS_PROJ_OUT_GEN" @click="downLoadFun"> 导出 </Button>
      <split></split>
    </p>
    <div class="project-wrap" v-show="projectWrapShow">
      <split></split>
      <h2>
        项目员工工时报表
      </h2>
      <p>
        <span> 制作人： {{userName}}</span>
        <span> 日期： {{currentTime}}</span>
      </p>
      <el-table :data="tableReportData" stripe :span-method="objectSpanMethod" border>
        <el-table-column prop="contractCode" label="合同编号" width="180">
        </el-table-column>
        <el-table-column prop="staffName" label="员工名称">
        </el-table-column>
        <el-table-column prop="taskCategoryName" label="分类">
        </el-table-column>
        <el-table-column prop="janWorkHours" label="一月">
        </el-table-column>
        <el-table-column prop="febWorkHours" label="二月">
        </el-table-column>
        <el-table-column prop="marWorkHours" label="三月">
        </el-table-column>
        <el-table-column prop="aprWorkHours" label="四月">
        </el-table-column>
        <el-table-column prop="mayWorkHours" label="五月">
        </el-table-column>
        <el-table-column prop="junWorkHours" label="六月">
        </el-table-column>
        <el-table-column prop="julWorkHours" label="七月">
        </el-table-column>
        <el-table-column prop="augWorkHours" label="八月">
        </el-table-column>
        <el-table-column prop="sepWorkHours" label="九月">
        </el-table-column>
        <el-table-column prop="octWorkHours" label="十月">
        </el-table-column>
        <el-table-column prop="novWorkHours" label="十一月">
        </el-table-column>
        <el-table-column prop="decWorkHours" label="十二月">
        </el-table-column>
        <el-table-column prop="total" label="合计">
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
  ApiGetReportStaffProject,
  ApiGetDepartmentProj,
  ApiGetReportStaffExport
} from "@/api/report/report-api";
import { ApiGetUsers } from "@/api/competence/user-api";

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
        REP_TS_PROJ_OUT_GEN: false, //导出
        REP_TS_PROJ_VIEW_GEN: false //查询
      },
      user: {
        pageNum: 1,
        pageSize: 1000,
        name: "",
        staffNumber: "",
        deptId: "",
        lineManagerName: ""
      },
      contractCodeList: [],
      userList: [],
      project: {
        contractCodes: [],
        staffIdList: [],
        year: moment().format("YYYY")
      },
      tableReportData: [],
      letmap: ""
    };
  },
  methods: {
    init() {
      //获取三级菜单权限
      privilege(this.privilegeData).then(result => {
        this.privilegeData = result;
      });
      this.getDepartmentProj();
      this.getUserList();
    },
    // 请求合同编号
    getDepartmentProj() {
      ApiGetDepartmentProj().then(res => {
        if (res.code == "success") {
          this.contractCodeList = res.data;
        }
      });
    },
    //获取人员列表
    getUserList() {
      ApiGetUsers(this.user).then(res => {
        if (res.code == "success") {
          this.userList = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 导出方法
    downLoadFun() {
      if (
        this.project.contractCodes.length == 0 &&
        this.project.staffIdList.length == 0
      ) {
        this.$Message.warning("请选择合同编号或者员工姓名!");
        return false;
      }
      if (this.project.year) {
        this.project.year = moment(this.project.year).format("YYYY");
      }

      // 项目id list
      let projectIdStr = [];
      if (this.project.contractCodes.length > 0) {
        for (let i = 0; i < this.project.contractCodes.length; i++) {
          projectIdStr.push(this.project.contractCodes[i]);
        }
        projectIdStr = projectIdStr.toString();
      }
      // 人员id list
      let staffIdStr = [];
      if (this.project.staffIdList.length > 0) {
        for (let i = 0; i < this.project.staffIdList.length; i++) {
          staffIdStr.push(this.project.staffIdList[i]);
        }
        staffIdStr = staffIdStr.toString();
      }
      let _data = {
        staffIdStr: staffIdStr,
        year: this.project.year,
        projectIdStr: projectIdStr
      };
      ApiGetReportStaffExport(_data).then(data => {
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `项目员工工时报表.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    },
    // 点击查询方法
    getReportStaffProject() {
      let _this = this;
      _this.project.year = moment(_this.project.year).format("YYYY");
      if (
        _this.project.contractCodes.length == 0 &&
        _this.project.staffIdList.length == 0
      ) {
        _this.$Message.warning("请选择合同编号或者员工姓名!");
        return false;
      }
      // 项目id list
      let projectIdStr = [];
      if (_this.project.contractCodes.length > 0) {
        for (let i = 0; i < _this.project.contractCodes.length; i++) {
          projectIdStr.push(_this.project.contractCodes[i]);
        }
        projectIdStr = projectIdStr.toString();
      }
      // 人员id list
      let staffIdStr = [];
      if (_this.project.staffIdList.length > 0) {
        for (let i = 0; i < _this.project.staffIdList.length; i++) {
          staffIdStr.push(_this.project.staffIdList[i]);
        }
        staffIdStr = staffIdStr.toString();
      }
      let data = {
        staffIdStr: staffIdStr,
        year: _this.project.year,
        projectIdStr: projectIdStr
      };
      ApiGetReportStaffProject(data).then(function(res) {
        if ((res.code = "success")) {
          if (res.data == null) {
            _this.projectWrapShow = false;
            _this.tableReportData = [];
            _this.$Message.warning("该合同编号暂无报表!");
          } else {
            _this.tableReportData = res.data;
            _this.projectWrapShow = true;
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
        }
      });
    },
    // 合并单元格
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
    // 重置按钮
    resetProject() {
      this.project.contractCodes = [];
      this.project.staffIdList = [];
      this.project.year = moment().format("YYYY");
      this.projectWrapShow = false;
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
