/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:58:56 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-31 15:37:10
 * @instructions： 工时审核list单个查看
 */

<template>

  <div>
    <Row>
      <Col :lg="18" :md="16" :sm="24">
      <Row>
        <Col :lg="4" :md="8" :sm="12" v-show="tsheetForm.staffName">申报人：{{tsheetForm.staffName}}</Col>
        <Col :lg="6" :md="8" :sm="12">申报周期：{{tsheetForm.recordStart}}----{{tsheetForm.recordEnd}}</Col>
        <Col :lg="5" :md="8" :sm="12" v-show="tsheetForm.declareDate">填报日期：{{tsheetForm.declareDate}}</Col>
      </Row>
      </Col>
      <Col :lg="6" :md="8" :sm="24">
      <Button size="small" type="primary" @click="showOpinion">项目经理意见</Button>
      <Button size="small" type="primary" @click="viewFormInfo">查看所有审批单</Button>
      </Col>
    </Row>
    <split></split>
    <view-table :table-data="tableData" :recordStart="tsheetForm.recordStart" :recordEnd="tsheetForm.recordEnd"></view-table>
    <split></split>
    <Button @click="closePage">关闭</Button>

  </div>
</template>
<script>
import { getdaysList, exportTabelData } from "common/js/tsheetDays";
import { ApiPostTsheetApproval } from "@/api/timesheet/timecheck-api";
import moment from "moment";
import Split from "components/unit/split";
import ViewTable from "./table/view-table";

import { resCode } from "@/api/code";
export default {
  components: {
    ViewTable,
    Split
  },
  data() {
    return {
      loading: false, //加载中按钮标记
      signRule: {
        signPwd: [
          {
            required: true,
            message: "请输入密码进行数字签名",
            trigger: "blur"
          }
        ],
        sign: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请确认进行电子签名",
            trigger: "change"
          }
        ]
      },
      signForm: {
        //数字签名
        signPwd: "",
        sign: [],
        comment: ""
      }
    };
  },
  methods: {
    checkSave(apvResult) {
      // apvResult:true 审核通过，false 审核拒绝
      let flag = true;
      //审核通过时验证是否进行了数字签名
      if (apvResult) {
        this.$refs["signForm"].validate(valid => {
          if (!valid) {
            flag = false;
          }
        });
      }
      if (flag) {
        let me = this;
        let data = {};
        data.formId = me.tsheetForm.formId;
        data.staffId = me.tsheetForm.staffId;
        data.apvResult = apvResult;
        data.elcSignature = true;
        data.apvComment = me.signForm.comment;
        data.password = me.signForm.password;
        me.loading = true;
        ApiPostTsheetApproval(data).then(function(res) {
          me.loading = false;
          if (res.code == "success") {
            //请求工单列表
            this.$store.commit("getTimeCheckList");
            this.$store.commit("showCheckWrap", "checkRecord");
          } else {
            if (resCode[res.code]) {
              me.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    //关闭
    closePage() {
      this.$store.commit("showCheckWrap", "checkRecord");
    },
    viewFormInfo() {
      this.$emit("viewFormInfo", {
        tcycleId: this.tsheetForm.tcycleId,
        staffId: this.tsheetForm.staffId,
        perPage:"checkView",
      });
    },
    showOpinion() {
      this.$emit("showOpinion", {
        formId: this.tsheetForm.formId,
        perPage:"checkView",
      });
    }
  },
  computed: {
    tsheetForm() {
      let obj = {};
      let datas = this.$store.state.timeSheet.tsheetView.form;
      obj.formId = datas.formId;
      obj.formCode = datas.formCode;
      obj.approverName = datas.approverName;
      obj.recordStart = moment(datas.recordStart).format("YYYY-MM-DD");
      obj.recordEnd = moment(datas.recordEnd).format("YYYY-MM-DD");
      obj.declareDate = datas.declareDate
        ? moment(datas.declareDate).format("YYYY-MM-DD HH:mm:ss")
        : "";
      obj.declareEnd = datas.declareEnd
        ? moment(datas.declareEnd).format("YYYY-MM-DD")
        : "";
      obj.staffName = datas.staffName;
      obj.statusName = datas.statusName;
      obj.staffId = datas.staffId;
      obj.tcycleId = datas.tcycleId;
      return obj;
    },
    tableDailies() {
      return this.$store.state.timeSheet.tsheetView.dailies;
    },
    sheetTotal() {
      //一个申报周期的所有工单总计数据
      return this.$store.state.timeSheet.tsheetView.total;
    },
    tableData() {
      let mainData = exportTabelData(this.tableDailies);
      if (mainData.length > 0) {
        //列合计
        let arr = [];
        let cols = {
          projectShortName: "",
          taskName: "小计",
          isTotal: true,
          times: {},
          total: 0
        };
        for (let i = 0, len = mainData.length; i < len; i++) {
          for (let k in mainData[i].times) {
            cols.times[k] = cols.times[k] ? cols.times[k] : 0;
            cols.times[k] += mainData[i].times[k];
          }
        }
        mainData.push(cols);
        //工单总合计
        if (this.sheetTotal) {
          let _total = {
            projectShortName: "",
            taskName: "已申报工时合计",
            isTotal: true,
            times: this.sheetTotal,
            total: 0
          };
          mainData.push(_total);
        }
      }
      return mainData;
    },
    account() {
      return localStorage.getItem("email");
    },
    checkResult() {
      //审核通过 或者失败时显示审核结果
      if (
        this.tsheetForm.statusCode == "APPROVE_LABOR_HOUR" ||
        this.tsheetForm.statusCode == "FAIL_LABOR_HOUR"
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>