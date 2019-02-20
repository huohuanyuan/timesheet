/*
 * @Author: chengshanshan 
 * @Date: 2019-01-22 14:45:15 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-11 16:48:06
 * @instruction:员工工时周期详情查看
 */
 <template>
  <div style="position:relative;min-height:500px">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div v-else>
      <p>
        申报人:{{staffName}} 申报周期：{{recordStart}} ---- {{recordEnd}}
      </p>
      <split></split>
      <div v-for="item in infoList" :key="item.formId">
        <p>
          工时单号：{{item.formCode}} 审批人：{{item.approverName}} 状态：{{item.statusName}} </p>
        <view-table :table-data="item.dailies" :recordEnd="item.recordEnd" :recordStart="item.recordStart"></view-table>
        <split></split>
        <ul v-if="item.tsheetFormOpinionVOList.length>0">
          <li>
            项目经理意见：
          </li>
          <li class="poinion-list" v-for="elem in item.tsheetFormOpinionVOList">
            {{elem.createdbyName}} :{{elem.common}}
          </li>
        </ul>          
      </div> 
        <split></split>  
      <Button @click="close">关闭</Button>
    </div>
  </div>
</template>
 <script>
import { ApiGetFormInfo } from "@/api/timesheet/staff-time-api";
import ViewTable from "./table/view-table";
import { resCode } from "@/api/code";
import { exportTabelData } from "common/js/tsheetDays";
import moment from "moment";
import Split from "components/unit/split";
export default {
  components: {
    ViewTable,
    Split
  },

  data() {
    return {
      spinShow: true,
      infoList: [],
      staffName: "",
      recordStart: "",
      recordEnd: ""
    };
  },
  methods: {
    getInfo(tcycleId, staffId) {
      this.infoList = [];
      this.spinShow = true;
      ApiGetFormInfo({ tcycleId: tcycleId, staffId: staffId }).then(res => {
        if (res.code == "success") {
          let _infoData = res.data.dailies;
          let _listTotal = res.data.total;
          if (_infoData.length > 0) {
            this.staffName = _infoData[0].staffName;
            this.recordStart = moment(_infoData[0].recordStart).format(
              "YYYY-MM-DD"
            );
            this.recordEnd = moment(_infoData[0].recordEnd).format(
              "YYYY-MM-DD"
            );
            for (let [index, elem] of _infoData.entries()) {
              let _obj = {
                dailies: []
              };
              _obj.staffName = elem.staffName;
              _obj.approverName = elem.approverName;
              _obj.formCode = elem.formCode;
              _obj.recordEnd = moment(elem.recordEnd).format("YYYY-MM-DD");
              _obj.recordStart = moment(elem.recordStart).format("YYYY-MM-DD");
              _obj.declareEnd = moment(elem.declareStart).format("YYYY-MM-DD");
              _obj.declareStart = moment(elem.declareStart).format(
                "YYYY-MM-DD"
              );
              _obj.statusName = elem.statusName;
              _obj.tsheetFormOpinionVOList = elem.tsheetFormOpinionVOList;

              _obj.dailies = exportTabelData(elem.tsheetDailyVOList);

              //列合计
              if (_obj.dailies.length > 0) {
                let arr = [];
                let cols = {
                  projectShortName: "",
                  taskName: "小计",
                  isTotal: true,
                  times: {},
                  total: 0
                };
                for (let i = 0, len = _obj.dailies.length; i < len; i++) {
                  for (let k in _obj.dailies[i].times) {
                    cols.times[k] = cols.times[k] ? cols.times[k] : 0;
                    cols.times[k] += _obj.dailies[i].times[k];
                  }
                }
                _obj.dailies.push(cols);
                //如果是最后个审批单，则加入已申报工时合计的数据
                if (index == _infoData.length - 1 && _listTotal) {
                  let _total = {
                    projectShortName: "",
                    taskName: "已申报工时合计",
                    isTotal: true,
                    times: _listTotal,
                    total: 0
                  };
                  _obj.dailies.push(_total);
                }
              }
              this.infoList.push(_obj);
            }
          }
          this.spinShow = false;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
.poinion-list {
  background-color: #f8f8f9;
  padding: 10px;
  margin: 5px 0;
}
</style>

 
 
