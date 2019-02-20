/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:59:09 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-10-22 10:41:11
  * @instructions： 工时申报
 */

<template>
  <div class="declare-wrap">
    <div v-if="studyList.length>0">
      <div class="declare-header">
        <div class="h-cell"> 申报周期：{{recordStart}} ---- {{recordEnd}}</div>
        <div class="h-cell"> 申报日期：{{declareStartDate}} ---- {{declareEndDate}}</div>
      </div>
      <split></split>
      <div class="declare-table">
        <declare-table ref="declareTable" :study-list="studyList" :task-list="taskList" :record-start="recordStart" :record-end="recordEnd" :tcycle-id="tcycleId" :declare-end="declareEnd" :table-data="tableData" :type="type" :canSubmit="canSubmit">
        </declare-table>
      </div>
    </div>
    <div v-else>
      <Alert show-icon>
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc">目前没有项目可以申报</template>

      </Alert>
      <Button @click="closePage">关闭</Button>
    </div>
  </div>
</template>
<script>
import DeclareTable from "./table/declare-table";
import Split from "components/unit/split";
import moment from "moment";
import { resCode } from "@/api/code";
import { getdaysList } from "common/js/tsheetDays";

import { ApiGetDict } from "@/api/api";
import { privilege } from "common/js/privilege";
export default {
  components: {
    Split,
    DeclareTable
  },
  data() {
    return {
      // tableData:[]
      type: "newSheet" //标记为修改页面
    };
  },
  methods: {
    //关闭
    closePage() {
      this.$store.commit("showRegWrap", "regRecord");
    }
  },
  computed: {
    recordStart: function() {
      return moment(this.$store.state.timeSheet.newTsheet.recordStart).format(
        "YYYY-MM-DD"
      );
    },
    recordEnd: function() {
      return moment(this.$store.state.timeSheet.newTsheet.recordEnd).format(
        "YYYY-MM-DD"
      );
    },
    tcycleId: function() {
      return this.$store.state.timeSheet.newTsheet.tcycleId;
    },
    declareEndDate: function() {
      return moment(this.declareEnd).format("YYYY-MM-DD HH:mm:ss");
    },
    declareEnd: function() {
      return this.$store.state.timeSheet.newTsheet.declareEnd;
    },
    // 获取当前 选中周期的 审核开始时间
    declareStart:function(){
      return this.$store.state.timeSheet.newTsheet.declareStart;
    },
    declareStartDate:function(){
      return moment(this.declareStart).format("YYYY-MM-DD HH:mm:ss");
    },
    canSubmit:function(){//当前日期在申报开始日期之后，显示申报按钮，否则不显示
      return moment().isAfter(this.declareStartDate);
    },
    tableData: function() {
      return this.$store.state.timeSheet.newTsheetData;
    },
    studyList() {
      return this.$store.state.timeSheet.studyList;
    },
    taskList() {
      return this.$store.state.timeSheet.taskList;
    }
  }
};
</script>
<style lang="scss">
.declare-wrap {
  .declare-header {
    display: flex;
    .h-cell {
      padding: 0 10px;
    }
  }
}
</style>