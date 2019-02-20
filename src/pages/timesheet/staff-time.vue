/*
 * @Author: chengshanshan 
 * @Date: 2019-01-22 10:24:55 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-23 11:43:02
 * @instruction：员工工时
 */
 <template>
  <div>
    <staff-time-list ref="timeList" v-show="showWrap == 'LIST'" @timeView="timeView"></staff-time-list>
    <staff-time-info ref="timeInfo"  v-show="showWrap == 'INFO'" @close="infoClose"></staff-time-info>
  </div>
</template>
<script>
import StaffTimeList from "./components/staff-time-list";
import StaffTimeInfo from "./components/staff-time-info";
export default {
  components: {
    StaffTimeList,
    StaffTimeInfo
  },
  data() {
    return {
      showWrap: "LIST", //显示list还是info
    
    };
  },
  methods: {
    timeView(obj) {
      this.showWrap = "INFO";    
      this.$refs.timeInfo.getInfo(obj.tcycleId,obj.staffId);
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




