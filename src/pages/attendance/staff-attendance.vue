<template>
  <div class="staff-sttrendance">
    <!-- 员工考勤000 -->
    <Row :gutter="16">
      <Col :md="6" :sm="8">
      <Tree :data="data1" @on-select-change='selectTree'></Tree>
      <split></split>
      </Col>
      <Col :md="18" :sm="16">
      <Row :gutter="16">
        <div>
          <Col :md="8" :sm="24">
          <Input v-model.trim="staffName" :maxlength='30'>
          <span slot="prepend">员工名称</span>
          </Input>
          <split></split>
          </Col>
          <Col :md="8" :sm="24">
          <Input v-model.trim="staffNumber" :maxlength='30'>
          <span slot="prepend">员工工号</span>
          </Input>
          <split></split>
          </Col>
          <Col :md="8" :sm="24">
          <!--<div class="s-select-wrapper">
                        <label>状态</label>
                        <Select v-model="formItem.select">
                            <Option v-for='(item, i) in selectList' :key='i' :value="item.dictionaryCode">{{item.dictionaryName}}</Option>
                        </Select>
                    </div>
                    <split></split>-->
          </Col>
          <Col :md="8" :sm="24">
          <div class="s-input-wrapper">
            <label>
              开始时间
            </label>
            <DatePicker type="date" :clearable='false' v-model="tsheetListParams.recordStart"></DatePicker>
          </div>
          <split></split>
          </Col>
          <Col :md="8" :sm="24">
          <div class="s-input-wrapper">
            <label>
              结束时间
            </label>
            <DatePicker type="date" :clearable='false' v-model="tsheetListParams.recordEnd"></DatePicker>
          </div>

          <split></split>
          </Col>
          <Col :md="8" :sm="24">
          <Button type='info' @click='search'>查询</Button>
          <Button @click='seachReaset'>重置</Button>
          <split></split>
          </Col>
        </div>
        <div class="department-wrap">
          <Col span="24">
          <split></split>
          <Table :columns="columns7" :data="dataSource"></Table>
          <div class="page">
            <Page :total="total" show-total size="small" @on-change="pagesChange" @on-page-size-change='pagesizechange' show-elevator show-sizer></Page>
          </div>
          </Col>
        </div>
      </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import { resCode } from "@/api/code";
import moment from "moment";
import Request from "../../api/api.js";
import split from "components/unit/split";
import { privilege } from "common/js/privilege";
export default {
  data() {
    return {
      searchPageNum: 1,
      searchPageSize: 10,
      searchInent: false, //员工考勤查询的分页
      columns7: [
        {
          title: "序号",
          // type: "index",
          align: "center",
          width: 60,
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code = (vm.pageNum - 1) * vm.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "员工工号",
          key: "staffNumber",
          align: "center",
          width: 100
        },
        {
          title: "名称",
          key: "staffName",
          align: "center",
          width: 100
        },
        {
          title: "考勤日期",
          key: "workDate",
          align: "center"
        },
        {
          title: "打卡时间",
          key: "userCheckTime",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              moment(params.row.userCheckTime).format("YYYY-MM-DD hh:mm:ss")
            );
          }
        },
        {
          title: "类型",
          key: "checkType",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.checkType ? "上班" : "下班");
          }
        },
        {
          title: "时间结果",
          key: "timeResult",
          align: "center",
          render: (h, params) => {
            //NORMAL  NOT_SIGNED NORMAL
            // return params.row.timeResult

            return h(
              "div",
              (function(vm) {
                if (params.row.timeResult == "NORMAL") {
                  return "正常";
                } else if (params.row.timeResult == "NOT_SIGNED") {
                  return "未打卡";
                } else if (params.row.timeResult == "EARLY") {
                  return "早退";
                } else if (params.row.timeResult == "LATE") {
                  return "迟到";
                } else if (params.row.timeResult == "SERIOUS_LATE") {
                  return "严重迟到";
                } else if (params.row.timeResult == "ABSENTEEISM") {
                  return "旷工";
                }
              })(this)
            );
          }
        },
        {
          title: "位置结果",
          key: "locationResult",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.locationResult == "INSIDE") {
                  return "范围内";
                } else if (params.row.locationResult == "OUTSIDE") {
                  return "范围外";
                } else if (params.row.locationResult == "NOT_SIGN") {
                  return "未打卡";
                }
              })(this)
            );
          }
        },
        {
          title: "来源",
          key: "sourceType",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.sourceType == "ATM") {
                  return "考勤机";
                } else if (params.row.sourceType == "BEACON") {
                  return "IBeacon";
                } else if (params.row.sourceType == "DING_ATM") {
                  return "钉钉考勤机";
                } else if (params.row.sourceType == "APP_USER") {
                  return "用户打卡";
                } else if (params.row.sourceType == "APP_BOSS") {
                  return "老板改签";
                } else if (params.row.sourceType == "APP_APPROVE") {
                  return "审批系统";
                } else if (params.row.sourceType == "SYSTEM") {
                  return "考勤系统";
                } else if (params.row.sourceType == "DING_ATT_DATA") {
                  return "钉钉数据";
                }
              })(this)
            );
          }
        }
      ],
      dataSource: [], //数据列表
      total: 0,
      getFocusLeftTree: "", //点击最边列表项的id
      LeftTree: [], //最边的数列表
      pageNum: 1,
      pageSize: 10,
      selectList: [], //列表选择条件
      tsheetListParams: {
        recordStart: "",
        recordEnd: ""
      },
      staffName: "", //员工名称
      staffNumber: "", //员工编号
      formItem: {
        select: ""
      },
      data1: [
        {
          title: "公司",
          expand: true,
          children: []
        }
      ],
      Transed: "" //日期暂存
    };
  },
  mounted() {
    this.getTime();
    // this.getCondition();
    this.getLeftLoadData();
  },
  watch: {
    $route(to, from) {
      this.getTime();
      // this.getCondition();
      this.getLeftLoadData();
    }
  },
  watch: {
    $route(to, from) {
      this.getTime();
      // this.getCondition();
      this.getLeftLoadData();
    }
  },
  methods: {
    getTime() {
      //首页默认时间start
      let data = new Date();
      let year = data.getFullYear();
      let month = data.getMonth();
      let day = data.getDate();
      var date = new Date();
      var time = date.getTime() + 1000 * 60 * 60 * 24 * -7;
      var newDate = new Date(time);
      this.tsheetListParams.recordStart = newDate;
      this.tsheetListParams.recordEnd = year + "-" + (month + 1) + "-" + day;
    },
    /*getCondition() {//获取select条件
      const url = "/dict/ATM_RESULT";
      Request.GET(url).then((res)=>{
        if (res.code == "success") {
          this.selectList = res.data;
        } else {
          this.errCode(res.code);
        }
      }).catch();
    },*/
    getLeftLoadData() {
      //获取左边的树列表
      const url = "/attendance/group/company";
      Request.GET(url)
        .then(res => {
          if (res.code == "success") {
            this.data1.children = res.data;
            this.getTree(res.data);
            this.firstLoadTreeId();
          } else {
            this.errCode(res.code);
          }
        })
        .catch();
    },
    getTree(tree) {
      //封装的tree列表
      if (tree != "") {
        let arr = [];
        tree.map(item => {
          let obj = {};
          obj.listId = item.attendanceGroupId;
          obj.title = item.attendanceGroupName;
          arr.push(obj);
        });
        this.data1[0].children = arr;
        this.getFocusLeftTree = this.data1[0].children[0].listId;
        return arr;
      } else {
      }
    },
    selectTree(id) {
      //点击tree切换id
      this.getFocusLeftTree = id[0].listId;
      this.getRightDataSource();
    },
    firstLoadTreeId() {
      //页面加载时获取tree里边第一个id
      this.getRightDataSource();
    },
    getRightDataSource() {
      //获取页面右边的数据
      let Transed = moment(this.tsheetListParams.recordEnd)
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      let url =
        "/attendance/staff?attendanceGroupId=" +
        this.getFocusLeftTree +
        "&pageNum=" +
        this.pageNum +
        "&pageSize=" +
        this.pageSize +
        "&startTime=" +
        Transed +
        "&endTime=" +
        moment(this.tsheetListParams.recordEnd).format("YYYY-MM-DD");
      Request.GET(url)
        .then(res => {
          if (res.code == "success") {
            this.dataSource = res.data;
            this.total = res.total;
          } else {
            this.errCode(res.code);
          }
        })
        .catch();
    },
    search() {
      //检索信息
      let url =
        "/attendance/staff?attendanceGroupId=" +
        this.getFocusLeftTree +
        "&pageNum=" +
        this.searchPageNum +
        "&pageSize=" +
        this.searchPageSize +
        "&startTime=" +
        moment(this.tsheetListParams.recordStart).format("YYYY-MM-DD") +
        "&endTime=" +
        moment(this.tsheetListParams.recordEnd).format("YYYY-MM-DD") +
        "&staffName=" +
        this.staffName +
        "&staffNumber=" +
        this.staffNumber +
        "&timeResult=" +
        this.formItem.select;
      Request.GET(url)
        .then(res => {
          if (res.code == "success") {
            this.dataSource = res.data;
            this.total = res.total;
            this.searchInent = true;
          } else {
            this.errCode(res.code);
          }
        })
        .catch();
    },
    pagesChange(e) {
      //查询之后的的分页
      if (this.searchInent) {
        this.searchPageNum = e;
        this.search();
      } else {
        this.pageNum = e;
        this.getRightDataSource();
      }
    },
    pagesizechange(e) {
      if (this.searchInent) {
        this.searchPageSize = e;
        this.search();
      } else {
        this.pageSize = e;
        this.getRightDataSource();
      }
    },
    seachReaset() {
      //页面上的重置按钮
      this.staffName = this.staffNumber = "";
      this.searchInent = false;
      this.getRightDataSource();
    },
    errCode(code) {
      //错误处理
      this.$Message.error(resCode[code]);
    }
  },
  components: {
    split
  }
};
</script>
<style  lang='scss'>
@import "../../common/css/mixin";
@import "../../common/css/base";
.staff-sttrendance {
  .s-input-wrapper {
    @include datapick-label();
    @include clear-both();
  }
  .s-select-wrapper {
    @include select-label();
    @include clear-both();
  }
}
</style>
