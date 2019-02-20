/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:58:32 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-24 15:14:28
 * @instructions： 工时审核
 */

<template>
  <div>
    <check-record v-show="showCheckRecord"></check-record>
    <check-view v-show="showCheckView" @viewFormInfo="viewFormInfo" @showOpinion="showOpinion"></check-view>
    <check-modal v-show="showCheckModal" @viewFormInfo="viewFormInfo" @showOpinion="showOpinion"></check-modal>
    <!-- 查看所有的审批单 -->
    <staff-time-info v-show="allCheckInfo" ref="timeInfo" @close="infoClose"></staff-time-info>
    <!-- 项目经理意见 -->
    <check-opinion  v-show="checkOpinion" ref="checkOpinion" @close="infoClose"></check-opinion>
  
  </div>
</template>
<script>
import CheckRecord from "./components/check-record";
import CheckView from "./components/check-view";
import CheckModal from "./components/check-modal";
import StaffTimeInfo from "./components/staff-time-info";
import CheckOpinion from "./components/check-opinion";
import qs from "qs";
import Split from "components/unit/split";
import moment from "moment";
export default {
  components: {
    Split,
    CheckRecord,
    CheckView,
    CheckModal,
    StaffTimeInfo,
    CheckOpinion
  },
  data() {
    return {
      showWrap: "",
      perPage:"",//上一个显示的页面
    };
  },
  watch: {
    $route(to, from) {
      this.$store.commit("showCheckWrap", "checkRecord");
      //请求工单列表
      this.$store.commit("getTimeCheckList");
    }
  },
  computed: {
    showCheckRecord() {
      return this.$store.state.timeSheet.showCheckWrap.checkRecord;
    },
    showCheckView() {
      return this.$store.state.timeSheet.showCheckWrap.checkView;
    },
    showCheckModal() {
      return this.$store.state.timeSheet.showCheckWrap.checkModal;
    },
    allCheckInfo() {
      return this.$store.state.timeSheet.showCheckWrap.allCheckInfo;
    },
    checkOpinion() {
      return this.$store.state.timeSheet.showCheckWrap.checkOpinion;
    },
    filterStatus() {
      return this.$store.state.timeSheet.checkFilterStatus;
    }
  },
  methods: {
    viewFormInfo(obj) {
      this.$store.commit("showCheckWrap", "allCheckInfo");
      this.$refs.timeInfo.getInfo(obj.tcycleId, obj.staffId);
      this.perPage = obj.perPage;
    },
    infoClose() {
      this.$store.commit("showCheckWrap", this.perPage);
    },
    showOpinion(obj) {
      this.$store.commit("showCheckWrap", "checkOpinion");
      this.$refs.checkOpinion.getOpinionList(obj.formId);
      this.perPage = obj.perPage;
    }
  },
  created() {
    this.$store.commit("showCheckWrap", "checkRecord");
    //请求工单列表
    this.$store.commit("getTimeCheckList", { status: this.filterStatus });
  }
};
</script>