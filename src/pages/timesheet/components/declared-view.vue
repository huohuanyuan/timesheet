/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:59:03 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-31 15:37:38
 * @instructions： 工时填报list单个查看
 */

<template>
  <div>
    <Row :gutter="16">
      <Col :lg="8" :md="8" :sm="12">工时单号：{{tsheetForm.formCode}}</Col>
      <Col :lg="8" :md="8" :sm="12" v-show="tsheetForm.staffName">申报人：{{tsheetForm.staffName}}</Col>
      <Col :lg="8" :md="8" :sm="12">申报周期：{{tsheetForm.recordStart}}----{{tsheetForm.recordEnd}}</Col>
      <Col :lg="8" :md="8" :sm="12" v-show="tsheetForm.declareDate">填报日期：{{tsheetForm.declareDate}}</Col>
      <Col :lg="8" :md="8" :sm="12" v-show="tsheetForm.declareEnd">申报日期：{{tsheetForm.declareStart}}----{{tsheetForm.declareEnd}}</Col>
      <Col :lg="8" :md="8" :sm="12">审核状态: {{tsheetForm.statusName}}</Col>
    </Row>
    <split></split>
    <view-table :table-data="tableData" :recordStart="tsheetForm.recordStart" :recordEnd="tsheetForm.recordEnd"></view-table>
    <split></split>
    <Button @click="closePage">关闭</Button>
    <div>
      <!-- <Button type="primary" @click="declareSheet" :loading="loading" v-show="declareBtn">申报</Button> -->
    </div>

  </div>

</template>
<script>
import { getdaysList, exportTabelData } from "common/js/tsheetDays";
import moment from "moment";
import Split from "components/unit/split";
import { ApiPutTsheetDeclare } from "@/api/timesheet/timedeclare-api";
import ViewTable from "./table/view-table";
import qs from "qs";
import { resCode } from "@/api/code";
export default {
  components: {
    Split,
    ViewTable
  },
  data() {
    return {
      loading: false, //按钮加载标志
      disabledHover: true,
      commentModal: {
        show: false,
        studyTitle: "",
        taskTitle: "",
        workComment: "",
        issueComment: ""
      },
      declareBtn: false //是否显示申报按钮
    };
  },
  methods: {
    declareSheet() {
      let me = this;
      me.loading = true;
      ApiPutTsheetDeclare(qs.stringify({ formId: me.tsheetForm.formId })).then(
        function(res) {
          me.loading = false;
          if (res.code == "success") {
            me.$Message.success("申报成功");
            me.$store.commit("showRegWrap", "regRecord");
          } else {
            if (resCode[res.code]) {
              me.$Message.error(resCode[res.code]);
            }
          }
        }
      );
    },
    //关闭
    closePage() {
      this.$store.commit("showRegWrap", "regRecord");
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
        ? moment(datas.declareEnd).format("YYYY-MM-DD HH:mm:ss")
        : "";
      obj.declareStart = datas.declareStart
        ? moment(datas.declareStart).format("YYYY-MM-DD HH:mm:ss")
        : "";
      obj.staffName = datas.staffName;
      obj.statusName = datas.statusName;
      //未提交 与 审核失败 的状态下显示审核按钮
      if (
        datas.statusCode == "UNSUBMIT_LABOR_HOUR" ||
        datas.statusCode == "FAIL_LABOR_HOUR"
      ) {
        this.declareBtn = true;
      } else {
        this.declareBtn = false;
      }
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
    }
  }
};
</script>