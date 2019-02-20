/*
 * @Author: chengshanshan 
 * @Date: 2019-01-22 14:45:15 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-11 16:45:14
 * @instruction:项目员工工时周期详情查看
 */
 <template>
  <div style="position:relative;min-height:500px">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div v-else>
      <p>
        申报人:{{staffName}} 工时周期：{{recordStart}} ---- {{recordEnd}}
      </p>
      <split></split>
      <div v-for="(item,index) in infoList" :key="item.formId">
        <p>
          审批人：{{item.approverName}} 状态：{{item.statusName}} </p>
        <view-table :table-data="item.dailies" :recordEnd="item.recordEnd" :recordStart="item.recordStart"></view-table>
        <split></split>
        <!-- 处于审核中的工单 显示意见填写框 -->
        <div v-if="item.statusCode == 'AUDIT_LABOR_HOUR'">
          项目经理意见：
          <div class="msg-outer">
            <Input v-model.trim="item.common" type="textarea" style="margin-right:5px"></Input>
            <!-- 修改按钮 -->
            <Button type="primary" v-if="item.hasCommon" @click="optionEditSave(item.formOpinionId,index)">保存</Button>
            <!-- 新建按钮 -->
            <Button type="primary" v-else @click="optionSave(item.formId,index)">保存</Button>
          </div>
        </div>
        <div v-else>
          <div v-show="item.common">
            项目经理意见：
            <p>
              {{item.common}}
            </p>
          </div>
        </div>      
      </div>
      <split></split>
      <Button @click="close">关闭</Button>
    </div>
  </div>
</template>
 <script>
import {
  ApiGetFormInfoOpinion,
  ApiPostOption,
  ApiPutOption
} from "@/api/timesheet/pro-staff-time-api";
import ViewTable from "./table/view-table";
import { resCode } from "@/api/code";
import { exportTabelData } from "common/js/tsheetDays";
import moment from "moment";
import Split from "components/unit/split";
import qs from "qs";
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
      ApiGetFormInfoOpinion({ tcycleId: tcycleId, staffId: staffId }).then(
        res => {
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
                _obj.formId = elem.formId;
                _obj.staffName = elem.staffName;
                _obj.approverName = elem.approverName;
                _obj.formCode = elem.formCode;
                _obj.recordEnd = moment(elem.recordEnd).format("YYYY-MM-DD");
                _obj.recordStart = moment(elem.recordStart).format(
                  "YYYY-MM-DD"
                );
                _obj.declareEnd = moment(elem.declareEnd).format("YYYY-MM-DD");
                _obj.declareStart = moment(elem.declareStart).format(
                  "YYYY-MM-DD"
                );
                _obj.statusCode = elem.statusCode;
                _obj.statusName = elem.statusName;
                if (elem.tsheetFormOpinionVO) {
                  _obj.common = elem.tsheetFormOpinionVO.common;
                  _obj.formOpinionId = elem.tsheetFormOpinionVO.formOpinionId;
                  _obj.hasCommon = true;
                } else {
                  _obj.common = "";
                  _obj.hasCommon = false;
                }

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
        }
      );
    },
    //审批意见新建保存
    optionSave(formId, index) {
      let _common = this.infoList[index].common;
      let flag = true;
      if (!_common) {
        flag = false;
      } else if (_common.length > 512) {
        this.$Message.error("意见长度不能超过512个字符");
        flag = false;
      } else {
        flag = true;
      }
      if (flag) {
        ApiPostOption({ formId: formId, common: _common }).then(res => {
          if (res.code == "success") {
            this.$Message.success("意见添加成功");
            this.infoList[index].hasCommon = true;
            this.infoList[index].formOpinionId = res.data;
            this.infoList[index].common = _common;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    //审批意见修改保存
    optionEditSave(formOpinionId, index) {
      let _common = this.infoList[index].common;
      let flag = true;
      if (_common.length > 512) {
        this.$Message.error("意见长度不能超过512个字符");
        flag = false;
      } else {
        flag = true;
      }
      if (flag) {
        ApiPutOption({ formOpinionId: formOpinionId, common: _common }).then(
          res => {
            if (res.code == "success") {
              this.$Message.success("意见添加成功");
              this.infoList[index].common = _common;
            } else {
              if (resCode[res.code]) {
                this.$Message.error(resCode[res.code]);
              }
            }
          }
        );
      }
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
.msg-outer {
  display: flex;
}
</style>

 
 
 