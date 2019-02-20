/*
 * @Author: chengshanshan 
 * @Date: 2018-07-17 16:25:35 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-09-10 09:48:25
 * @instranction:审批流程组管理
 */
<template>

  <div class="apv-group">
    <div>
      <Button type="info" @click="newApvGroup">新增</Button>
    </div>
    <split></split>
    <Table :columns="apvGroupCol" :data="apvGroupData"></Table>
    <!-- 新增审批流程组Model -->
    <Modal v-model="newApvGroupModal" title="新增审批流程组" :width="800" :mask-closable="false">
      <Form ref="newApvGroupForm" :model="newApvGroupForm" :rules="newApvGroupRule" :label-width="120">
        <Row :gutter="16">
          <Col :xs="24" :sm="24">
          <split></split>
          <split></split>
          <FormItem label="考勤流程组名称" prop="groupName">
            <Input v-model="newApvGroupForm.groupName">
            </Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Row>
          <Col span="24">
          <Button @click="newApvGroupSave('newApvGroupForm')" long type="primary"> 保存 </Button>
          </Col>
        </Row>
      </div>
    </Modal>
    <!-- 修改审批流程组Model -->
    <Modal v-model="modifyApvGroupModal" title="修改审批流程组" :width="800" :mask-closable="false">
      <Form ref="modifyApvGroupForm" :model="modifyApvGroupForm" :rules="modifyApvGroupRule" :label-width="120">
        <Row :gutter="16">
          <Col :xs="24" :sm="24">
          <split></split>
          <FormItem label="考勤流程组名称" prop="groupName">
            <Input v-model="modifyApvGroupForm.groupName">
            </Input>
          </FormItem>
          </Col>

        </Row>
      </Form>
      <div slot="footer">
        <Row>
          <Col span="24">
          <Button @click="modifyApvGroupSave('modifyApvGroupForm')" long type="primary"> 保存 </Button>
          </Col>
        </Row>
      </div>
    </Modal>
    <!-- 查看审批流程组 -->
    <Modal v-model="apvGroupInfoModal" title="查看审批流程组" :width="800">
      <Table :columns="groupInfoCol" :data="groupInfoData"></Table>
      <div slot="footer"> </div>
    </Modal>

  </div>
</template>
<script>
import Split from "components/unit/split";
import qs from "qs";
import { resCode } from "@/api/code";

import {
  apiGetApvGroupList,
  ApiPostApvGroup,
  ApiPutApvGroup,
  ApiDeleteApvGroup,
  ApiGetApvProcess
} from "@/api/attendance/apv-group-api";
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
// 删除按钮
const deleteButton = (vm, h, params) => {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title: "您确定要删除这条数据吗?",
        transfer: true
      },
      on: {
        "on-ok": () => {
          vm.remove(params.row.groupId);
        }
      }
    },
    [
      h(
        "Button",
        {
          style: {
            margin: "3px 2px"
          },
          props: {
            type: "error",
            placement: "top",
            size: "small"
          }
        },
        "删除"
      )
    ]
  );
};
// 查看按钮
const viewButton = (vm, h, params) => {
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
          vm.view(params.row.groupId);
        }
      }
    },
    "查看"
  );
};
export default {
  components: {
    Split
  },
  data() {
    return {
      //新建考勤组
      newApvGroupModal: false,
      newApvGroupForm: {
        groupName: ""
      },
      newApvGroupRule: {
        groupName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ]
      },
      //修改考勤组
      modifyApvGroupModal: false,
      modifyApvGroupForm: {
        groupId: "",
        groupName: ""
      },
      modifyApvGroupRule: {
        groupName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ]
      },
      apvGroupCol: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.apvGroupListParams.pageNum - 1) *
                    vm.apvGroupListParams.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "审批流程组名称",
          key: "groupName",
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              viewButton(this, h, params),
              editButton(this, h, params),
              deleteButton(this, h, params)
            ]);
          }
        }
      ],
      apvGroupData: [],
      apvGroupListParams: {
        pageNum: 1,
        pageSize: 10
      },
      pagetotal: 0,
      //查看考勤组
      apvGroupInfoModal: false,
      groupInfoCol: [
        {
          title: "序号",
          width: 60,
          align: "center",
          type: "index"
        },
        {
          title: "流程名称",
          key: "procName"
        },
        {
          title: "审批人去重策略",
          key: "dupRemoStgy"
        },
        {
          title: "通知抄送人策略",
          key: "noticeStgy"
        }
      ],
      groupInfoData: []
    };
  },
  methods: {
    init() {
      this.apiGetApvGroupList();
    },
    newApvGroup() {
      this.newApvGroupModal = true;
      this.$refs["newApvGroupForm"].resetFields();
    },
    newApvGroupSave(name) {
      let me = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPostApvGroup(qs.stringify(me.newApvGroupForm)).then(function(res) {
            if (res.code == "success") {
              me.newApvGroupModal = false;
              me.apiGetApvGroupList();
              me.$Message.success("新建成功");
            } else {
              if (resCode[res.code]) {
                me.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    apiGetApvGroupList() {
      let me = this;
      apiGetApvGroupList().then(function(res) {
        if (res.code == "success") {
          me.apvGroupData = res.data;
          me.pagetotal = res.total;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    view(groupId) {
      this.apvGroupInfoModal = true;
      ApiGetApvProcess(groupId).then(res => {
        if (res.code == "success") {
          this.groupInfoData = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    edit(params) {
      this.modifyApvGroupModal = true;
      this.$refs["modifyApvGroupForm"].resetFields();
      this.modifyApvGroupForm.groupName = params.groupName;
      this.modifyApvGroupForm.groupId = params.groupId;
    },
    modifyApvGroupSave(name) {
      let me = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPutApvGroup(qs.stringify(me.modifyApvGroupForm)).then(function(
            res
          ) {
            if (res.code == "success") {
              me.modifyApvGroupModal = false;
              me.apiGetApvGroupList();
              me.$Message.success("修改成功");
            } else {
              if (resCode[res.code]) {
                me.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    remove(id) {
      let me = this;
      ApiDeleteApvGroup(id).then(function(res) {
        if (res.code == "success") {
          me.apiGetApvGroupList();
          me.$Message.success("删除成功");
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    }
  },
  watch: {
    $router(to, from) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
</style>

