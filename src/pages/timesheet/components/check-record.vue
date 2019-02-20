/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:58:50 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-19 17:37:23
 * @instructions： 工时审核list
 */

<template>
  <div class="check-record">
    <Row type="flex" :gutter="16" align="top">
      <Col :md='5' :sm='12'>
      <Input v-model="tsheetListParams.formCode">
      <span slot="prepend">工时单号</span>
      </Input>
      <split></split>
      </Col>
      <Col :md='5' :sm='12'>
      <div class="s-input-wrapper">
        <label>
          周期开始时间
        </label>
        <DatePicker :editable='false' type="date" v-model="tsheetListParams.recordStart"></DatePicker>
      </div>
      <split></split>
      </Col>
      <Col :md='5' :sm='12'>
      <div class="s-input-wrapper">
        <label>
          周期结束时间
        </label>
        <DatePicker :editable='false' type="date" v-model="tsheetListParams.recordEnd"></DatePicker>
      </div>
      <split></split>
      </Col>
      <Col :md='4' :sm='12'>
      <div>
        <Button type="info" @click="seach">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
      <split></split>
      </Col>
    </Row>
    <Table :columns="listCol" :data="checkTableData"></Table>
    <div class="page">
      <Page :total="checkListTotal" size="small" :current="tsheetListParams.pageNum" :page-size="tsheetListParams.pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
      </Page>
    </div>
    <!-- 审批轨迹 -->
    <Modal v-model="checkPathModal" title="审批轨迹" width="800">
      <Row type="flex" :gutter="16" align="top">
        <Col :sm='12'> 工时单号：{{checkPathData.tsheetCode}}
        </Col>
        <Col :sm='12'> 申报人：{{checkPathData.declareStaff}}
        </Col>
      </Row>
      <split></split>
      <Row type="flex" :gutter="16" align="top">
        <Col :sm='12'> 申报周期：{{checkPathData.declareCycle}}
        </Col>
        <Col :sm='12'> 申报日期：{{checkPathData.formDate}}
        </Col>
      </Row>
      <split></split>
      <Table :columns="checkPathCol" :data="checkPathTableData"></Table>
      <p slot="footer">
        <Button @click="checkPathModal=false">关闭</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import Split from "components/unit/split";
import moment from "moment";

import { ApiGetTsheetDaily } from "@/api/timesheet/timedeclare-api";
import qs from "qs";
import {
  ApiGetCheckPath,
  ApiUnlockTsheet
} from "@/api/timesheet/timecheck-api";
import { resCode } from "@/api/code";
const viewButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "success"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          let formId = params.row.formId;
          vm.viewTsheet(formId);
        }
      }
    },
    "查看"
  );
};
const checkButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "primary"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          let formId = params.row.formId;
          vm.checkTsheet(formId);
        }
      }
    },
    "审核"
  );
};
const unlockButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "warning"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.unlockTsheet(params.row);
        }
      }
    },
    "解锁"
  );
};
const checkRecordButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "info"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.chekcRecord(params.row);
        }
      }
    },
    "审批轨迹"
  );
};
export default {
  components: {
    Split
  },
  data() {
    return {
      checkPathModal: false,
      checkPathCol: [
        //审批轨迹列数据
        {
          type: "index",
          title: "序号",
          width: 80,
          align: "center"
        },
        {
          title: "审批状态",
          key: "apvResult",
          align: "center",
          width: 100,
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                let str = "";
                if (params.row.apvResult) {
                  str = "通过";
                } else {
                  str = "驳回";
                }
                return str;
              })(this)
            );
          }
        },
        {
          title: "审批人",
          key: "approverName",
          align: "center",
          width: 100
        },
        {
          title: "审批时间",
          key: "apvDate",
          align: "center",
          width: 150,
          render: function(h, params) {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.apvDate).format("YYYY-MM-DD HH:mm:ss");
              })(this)
            );
          }
        },
        {
          title: "备注",
          key: "apvComment",
          render: function(h, params) {
            return h(
              "div",
              params.row.apvComment ? params.row.apvComment : "--"
            );
          }
        }
      ],
      checkPathTableData: [], //审批轨迹表格数据
      checkPathData: {
        //审批轨迹数据
        tsheetCode: "", ///工时单号
        declareCycle: "", //申报周期
        declareStaff: "", //申报人
        formDate: "" //填报日期
      },
      // 检索表格的参数
      tsheetListParams: {
        formCode: "",
        recordStart: "",
        recordEnd: "",
        pageNum: 1,
        pageSize: 10
      },

      //表格列
      listCol: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.tsheetListParams.pageNum - 1) *
                    vm.tsheetListParams.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "审批单号",
          key: "formCode",
          align: "center"
        },
        {
          title: "工时周期",
          key: "formCode",

          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let start = moment(params.row.recordStart).format("YYYY-MM-DD");
                let end = moment(params.row.recordEnd).format("YYYY-MM-DD");
                return start + "--" + end;
              })(this)
            );
          }
        },
        {
          title: "提交日期",
          key: "declareDate",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.declareDate) {
                  return moment(params.row.declareDate).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                } else {
                  return "--";
                }
              })(this)
            );
          }
        },
        {
          title: "状态",
          align: "center",
          key: "statusName",
          filters: [
            {
              label: "审核中",
              value: 54
            },
            {
              label: "审核通过",
              value: 55
            },
            {
              label: "审核失败",
              value: 56
            },
            {
              label: "过期锁定",
              value: 53
            }
          ],
          filterMultiple: false,
          filterRemote(value, row) {
            this.tsheetListParams.status = value[0];
            this.tsheetListParams.pageNum = 1;
            this.$store.commit("getTimeCheckList", this.tsheetListParams);
          }
        },
        {
          title: "申报人",
          align: "center",
          key: "staffName",
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", {}, [
              (function(vm) {
                return viewButton(vm, h, params);
              })(this),
              (function(vm) {
                if (params.row.statusCode == "AUDIT_LABOR_HOUR") {
                  return checkButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                if (params.row.statusCode == "LOCK_LABOR_HOUR") {
                  return unlockButton(vm, h, params);
                }
              })(this),
              checkRecordButton(this, h, params)
            ]);
          }
        }
      ]
    };
  },
  methods: {
    seach() {
      this.tsheetListParams.pageNum = 1;
      this.$store.commit("getTimeCheckList", this.tsheetListParams);
    },
    //检索工单列表
    getTsheetList: function() {
      if (
        this.tsheetListParams.recordStart &&
        this.tsheetListParams.recordEnd &&
        moment(this.tsheetListParams.recordStart).isAfter(
          this.tsheetListParams.recordEnd
        )
      ) {
        this.$Message.error("周期开始时间在周期结束时间之后，请检查");
      } else {
        this.$store.commit("getTimeCheckList", this.tsheetListParams);
      }
    },
    //检索重置
    reset: function() {
      (this.tsheetListParams.formCode = ""),
        (this.tsheetListParams.recordStart = ""),
        (this.tsheetListParams.recordEnd = ""),
        (this.tsheetListParams.pageNum = 1),
        this.$store.commit("getTimeCheckList");
    },
    //分页跳转页面
    handlePage(value) {
      this.tsheetListParams.pageNum = value;
      this.$store.commit("getTimeCheckList", this.tsheetListParams);
    },
    //改变页面size
    handlePageSize(value) {
      this.tsheetListParams.pageSize = value;
      this.$store.commit("getTimeCheckList", this.tsheetListParams);
    },

    //查看
    viewTsheet: function(formId) {
      let me = this;
      ApiGetTsheetDaily({ formId: formId }).then(function(res) {
        if (res.code == "success") {
          me.$store.commit("showCheckWrap", "checkView");
          me.$store.commit("setTsheetViewData", res.data);
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //审核
    checkTsheet: function(formId) {
      let me = this;
      me.$store.commit("handleReset");
      ApiGetTsheetDaily({ formId: formId }).then(function(res) {
        if (res.code == "success") {
          me.$store.commit("showCheckWrap", "checkModal");
          me.$store.commit("setTsheetViewData", res.data);
          me.$store.commit("setCheckListParams", me.tsheetListParams);
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },

    //解锁
    unlockTsheet: function(param) {
      let me = this;
      ApiUnlockTsheet(
        qs.stringify({ formId: param.formId, staffId: param.staffId })
      ).then(function(res) {
        if (res.code == "success") {
          me.$store.commit("getTimeCheckList", me.tsheetListParams);
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //审核轨迹
    chekcRecord: function(params) {
      let me = this;
      ApiGetCheckPath(params.formId).then(function(res) {
        if (res.code == "success") {
          me.checkPathModal = true;
          me.checkPathData.tsheetCode = params.formCode;
          me.checkPathData.declareStaff = params.staffName;
          me.checkPathData.formDate = params.declareDate
            ? moment(params.declareDate).format("YYYY-MM-DD HH:mm:ss")
            : "--";
          let start = moment(params.recordStart).format("YYYY-MM-DD");
          let end = moment(params.recordEnd).format("YYYY-MM-DD");
          me.checkPathData.declareCycle = start + "--" + end;
          me.checkPathTableData = res.data;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    }
  },
  computed: {
    checkTableData: function(state) {
      return this.$store.state.timeSheet.checkTableData;
    },
    checkListTotal: function(state) {
      return this.$store.state.timeSheet.checkListTotal;
    }
  }
};
</script>
<style lang="scss">
@import "../../../common/css/mixin";
@import "../../../common/css/base";
.check-record {
  .s-input-wrapper {
    @include datapick-label();
    label {
      width: 100px;
    }
    .ivu-date-picker {
      width: calc(100% - 100px);
    }
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
}
</style>