/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:59:24 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-12-02 19:39:34
 * @instructions： 工时修改
 */

<template>
  <div class="modify-declare-wrap">
    <div class="declare-header">
      <div class="h-cell"> 申报周期：{{recordStart}}----{{recordEnd}}</div>
      <div class="h-cell"> 申报日期：{{declareStartDate}}----{{declareEndDate}}</div>
    </div>
    <split></split>
    <div class="declare-table">
      <declare-table :study-list="studyList" :task-list="taskList" :record-start="recordStart" :record-end="recordEnd" :tcycle-id="tcycleId" :declare-end="declareEnd" :table-data="tabelData" :type="type" :canSubmit="canSubmit"></declare-table>
    </div>
  </div>
</template>

<script>
import { exportTabelData } from "common/js/tsheetDays";
import moment from "moment";
import DeclareTable from "./table/declare-table";
import Split from "components/unit/split";
export default {
  components: {
    DeclareTable,
    Split
  },
  data() {
    return {
      type: "modifySheet" //标记为修改页面
    };
  },
  computed: {
    recordStart() {
      return moment(
        this.$store.state.timeSheet.tsheetView.form.recordStart
      ).format("YYYY-MM-DD");
    },
    recordEnd() {
      return moment(
        this.$store.state.timeSheet.tsheetView.form.recordEnd
      ).format("YYYY-MM-DD");
    },
    studyList() {
      return this.$store.state.timeSheet.studyList;
    },
    taskList() {
      //修改页面过滤task列表
      let _filledTaskIds = this.tableDailies.map((value, index) => {
        //保存已经填写的taskId
        return value.projTaskId;
      });
      let _arr = [];
      let _allTaskList = this.$store.state.timeSheet.taskList;     
      let _taskList = {};
      for (let key in _allTaskList) {       
        _taskList[key] = _allTaskList[key].filter((currVal, index) => {
          return !_filledTaskIds.includes(currVal.projTaskId);
        });
      }
      return _taskList;
    },
    tcycleId() {
      return this.$store.state.timeSheet.tsheetView.form.tcycleId;
    },
    declareEnd() {
      return this.$store.state.timeSheet.tsheetView.form.declareEnd;
    },
    declareEndDate() {
      return moment(this.declareEnd).format("YYYY-MM-DD HH:mm:ss");
    },
    // 获取当前 选中周期的 审核开始时间
    declareStart: function() {
      return this.$store.state.timeSheet.tsheetView.form.declareStart;
    },
    declareStartDate: function() {
      return moment(this.declareStart).format("YYYY-MM-DD HH:mm:ss");
    },
    tableDailies() {
      return this.$store.state.timeSheet.tsheetView.dailies;
    },
    tabelData() {
      let tabelData = exportTabelData(this.tableDailies);
      return tabelData;
    },
    canSubmit() {
      //当前日期在申报开始日期之后，显示申报按钮，否则不显示
      return moment().isAfter(this.declareStartDate);
    }
  }
};
</script>

<style lang="scss">
.modify-declare-wrap {
  .declare-header {
    display: flex;
    .h-cell {
      padding: 0 10px;
    }
  }
}
</style>