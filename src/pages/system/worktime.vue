<template id="styles-style">
  <div class="worktime">
    <!--工时配置页面-->
    <div>
      <Row :gutter="12">
        <Col :sm="8" :xs="24">
        <Card>
          <p slot="title">手动获取钉钉员工考勤信息</p>
          <div class="layflex">
            <div class="start">开始日期:</div>
            <div>
              <Row>
                <Col span="12">
                <DatePicker :editable='false' :clearable='false' v-model='workDateFrom' type="date" placeholder="Select date" style="width: 200px"></DatePicker>
                </Col>
              </Row>
            </div>
          </div>
          <div class="layflex">
            <div class="start">结束日期:</div>
            <div>
              <Row>
                <Col span="12">
                <DatePicker :editable='false' :clearable='false' v-model='workDateTo' type="date" placeholder="Select date" style="width: 200px"></DatePicker>
                </Col>
              </Row>
            </div>
          </div>
          <div class="btn-group-start">
            <Button type="primary" @click='attendanceInformation'>执行</Button>
            <Button @click='attenReset'>重置</Button>
          </div>
        </Card>
        </Col>
        <Col :sm="8" :xs="24">
        <Card>
          <p slot="title">同步钉钉员工信息</p>
          <Button type="info" long @click='getDingUser'>同步钉钉员工信息</Button>
        </Card>
        </Col>
        <Col :sm="8" :xs="24">
        <Card>
          <p slot="title">初始化用户请假类型</p>
          <Button type="info" long @click='getDingUserInitLeaveType'>初始化用户请假类型</Button>
        </Card>
        </Col>
      </Row>
    </div>

  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { resCode } from "@/api/code";
import {
  ApiGetDingAttendance,
  ApiGetDingUser,
  ApiGetDingUserInitLeaveType
} from "@/api/system/worktime-api.js";

import qs from "qs";
export default {
  data() {
    return {
      workDateFrom: moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD"),
      workDateTo: moment().format("YYYY-MM-DD")
    };
  },
  methods: {
    attendanceInformation() {
      if (this.workDateFrom > this.workDateTo) {
        this.$Message.error("开始日期不能大于结束日期");
      } else {
        this.handleSpinCustom();
        this.getDingAttendance();
      }
    },
    // 手动获取钉钉员工考勤信息
    getDingAttendance() {
      let data = {
        workDateFrom: moment(this.workDateFrom).format("YYYY-MM-DD"),
        workDateTo: moment(this.workDateTo).format("YYYY-MM-DD")
      };
      let _this = this;
      ApiGetDingAttendance(data).then(function(res) {
        _this.$Spin.hide();
        if (res.code == "success") {
          _this.$Message.success("数据同步成功");
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    getDingUser() {
      //自动同步钉钉数据
      this.handleSpinCustom();
      let _this = this;
      ApiGetDingUser().then(function(res) {
        _this.$Spin.hide();
        if (res.code == "success") {
          _this.$Message.success("数据同步成功");
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    getDingUserInitLeaveType() {
      this.handleSpinCustom();
      ApiGetDingUserInitLeaveType().then(res => {
        this.$Spin.hide();
        if (res.code == "success") {
          this.$Message.success("初始化成功！");
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    attenReset() {
      this.workDateFrom = moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      this.workDateTo = moment().format("YYYY-MM-DD");
    },
    handleSpinCustom() {
      //loading动画
      this.$Spin.show({
        render: h => {
          return h("div", [
            h("Icon", {
              class: "spin-icon-load",
              props: {
                type: "load-c",
                size: 30
              }
            }),
            h("div", "正在同步请稍候")
          ]);
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.layflex {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.start {
  line-height: 32px;
  font-size: 13px;
  margin-right: 10px;
}
.btn-group-start {
  text-align: center;
  margin-top: 20px;
}
</style>
<style>
/* scope 模式下 动画不能生效 */
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
</style>