/*
 * @Author: chengshanshan 
 * @Date: 2018-07-17 09:59:13 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-10-18 13:15:00
 * @instraction:假期类型管理
 */
<template>
  <div class="leave-manage">
    <Table :columns="leaveTableCol" :data="leaveTableData"></Table>
    <div class="page">
      <Page :total="pagetotal" :current="leaveListParams.pageNum" :page-size="leaveListParams.size" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-elevator show-sizer show-total></Page>

    </div>

    <!-- 修改假期类型Model -->
    <Modal v-model="modifyLeaveModal" title="修改假期信息" :width="800" :mask-closable="false">
      <Form ref="modifyLeaveForm" :model="modifyLeaveForm" :rules="modifyLeaveRule" :label-width="100">
        <Row :gutter="16">
          <Col :xs="24" :sm="12">
          <FormItem label="假期类型名称" prop="leaveName">
            <Input v-model="modifyLeaveForm.leaveName"> </Input>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="时长单位" prop="leaveUnitName">
            <Input v-model="modifyLeaveForm.leaveUnitName" disabled></Input>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="时长计算方式" prop="leaveWorkingDay">
            <Select v-model="modifyLeaveForm.leaveWorkingDay">
              <Option value="true">按工作日</Option>
              <Option value="false">按自然日</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Row>
          <Col span="24">
          <Button @click="modifyLeaveSave('modifyLeaveForm')" :loading="modifyLoading" long type="primary"> 保存 </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  </div>
</template>
<script>
import Split from "components/unit/split";
import qs from "qs";
import { resCode } from "@/api/code";

import {
  apiGetLeaveList,
  apiPutLeave,
  apiPutLeaveActivation
} from "@/api/attendance/leave-manage-api";

// 编辑按钮
const editButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.edit(params.row);
        }
      }
    },
    "编辑"
  );
};
// 冻结按钮
const clockButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "warning",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.clock(params);
        }
      }
    },
    "冻结"
  );
};
// 激活按钮
const activeButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "info",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.active(params);
        }
      }
    },
    "激活"
  );
};
export default {
  components: {
    Split
  },
  data() {
    return {
      modifyLeaveModal: false,
      modifyLoading: false,
      modifyLeaveRule: {
        leaveName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ],
        leaveUnit: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        leaveWorkingDay: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ]
      },
      modifyLeaveForm: {
        leaveId: "",
        leaveName: "",
        leaveUnit: "",
        leaveWorkingDay: "",
        leaveUnitName:""
      },
      leaveListParams: {
        pageNum: 1,
        pageSize: 10
      },
      pagetotal: 0,
      leaveTableCol: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.leaveListParams.pageNum - 1) *
                    vm.leaveListParams.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "假期类型名称",
          key: "leaveName",
          align: "center"
        },
        {
          title: "时长类型",
          key: "leaveUnit",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                switch (params.row.leaveUnit) {
                  case "DAY":
                    return "天";
                  case "HALF_DAY":
                    return "半天";
                  case "HOUR":
                    return "小时";
                }
              })(this)
            );
          }
        },
        {
          title: "时长计算方式",
          key: "leaveWorkingDay",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.leaveWorkingDay) {
                  return "工作日";
                } else {
                  return "自然日";
                }
              })(this)
            );
          }
        },
        {
          title: "状态",
          key: "deleted",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.deleted) {
                  return "停用";
                } else {
                  return "启用";
                }
              })(this)
            );
          }
        },
        {
          title: "操作",
          render: (h, params) => {
            return h("div", [
              editButton(this, h, params),
              (function(vm) {
                if (params.row.deleted) {
                  return activeButton(vm, h, params);
                } else {
                  return clockButton(vm, h, params);
                }
              })(this)
            ]);
          }
        }
      ],
      leaveTableData: []
    };
  },
  methods: {
    init() {
      this.getLeaveList();
    },
    //获取假期列表
    getLeaveList() {
      let me = this;
      apiGetLeaveList(me.leaveListParams).then(function(res) {
        if (res.code == "success") {
          me.leaveTableData = res.data;
          me.pagetotal = res.total;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    changePage(value) {
      this.leaveListParams.pageNum = value;
      this.getLeaveList();
    },
    changePageSize(value) {
      this.leaveListParams.pageSize = value;
      this.getLeaveList();
    },
    //编辑
    edit(data) {
      this.modifyLeaveModal = true;
      this.$refs["modifyLeaveForm"].resetFields();
      this.modifyLeaveForm.leaveId = data.leaveId;
      this.modifyLeaveForm.leaveName = data.leaveName;
      this.modifyLeaveForm.leaveUnit = data.leaveUnit;
      if (data.leaveUnit == "DAY") {
        this.modifyLeaveForm.leaveUnitName = "天";
      } else if (data.leaveUnit == "HOUR") {
        this.modifyLeaveForm.leaveUnitName = "小时";
      } else if (data.leaveUnit == "HALF_DAY") {
        this.modifyLeaveForm.leaveUnitName = "半天";
      }
      this.modifyLeaveForm.leaveWorkingDay = String(data.leaveWorkingDay);
    },
    //编辑保存
    modifyLeaveSave(name) {
      let me = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          me.modifyLoading = true;
          apiPutLeave(qs.stringify(me.modifyLeaveForm)).then(function(res) {
            if (res.code == "success") {
              me.modifyLeaveModal = false;
              me.modifyLoading = false;
              me.$Message.success("修改成功");
              me.getLeaveList();
            } else {
              if (resCode[res.code]) {
                me.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    //启用
    active(params) {
      let me = this;
      apiPutLeaveActivation(
        qs.stringify({
          leaveId: params.row.leaveId,
          deleted: false
        })
      ).then(function(res) {
        if (res.code == "success") {
          me.$Message.success("假期已启用");
          me.leaveTableData[params.index].deleted = false;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //停用
    clock(params) {
      let me = this;
      apiPutLeaveActivation(
        qs.stringify({
          leaveId: params.row.leaveId,
          deleted: true
        })
      ).then(function(res) {
        if (res.code == "success") {
          me.$Message.success("假期已停用");
          me.leaveTableData[params.index].deleted = true;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss">
</style>

