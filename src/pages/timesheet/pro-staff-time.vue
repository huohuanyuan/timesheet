/*
 * @Author: chengshanshan 
 * @Date: 2019-01-22 10:24:55 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-23 16:54:19
 * @instruction：项目员工工时
 */
<template>
  <div>
    <pro-staff-time-list ref="timeList" v-show="showWrap == 'LIST'" @timeView="timeView"></pro-staff-time-list>
    <pro-staff-time-info ref="timeInfo" :tcycleId="tcycleId" :staffId="staffId" v-show="showWrap == 'INFO'" @close="infoClose"></pro-staff-time-info>

  </div>
</template>
<script>
import ProStaffTimeList from "./components/pro-staff-time-list";
import ProStaffTimeInfo from "./components/pro-staff-time-info";
export default {
  components: {
    ProStaffTimeList,
    ProStaffTimeInfo
  },
  data() {
    return {
      showWrap: "LIST", //显示list还是info
      tcycleId: "",
      staffId: ""
    };
  },
  methods: {
    timeView(obj) {
      this.showWrap = "INFO";
      this.$refs.timeInfo.getInfo(obj.tcycleId, obj.staffId);
    },
    infoClose() {
      this.showWrap = "LIST";
    }
  },
  mounted() {
    this.showWrap = "LIST";
    this.$refs.timeList.init();
  }
};
</script>
</script>
