/*
 * @Author: liuhaosheng 
 * @Date: 2018-09-10 09:44:46 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-09-28 14:29:53
 */
<template>
  <div>
    <Table :columns="columnsProcess" :data="processData"></Table>
    <!-- 编辑模态框 -->
    <Modal v-model="processModal" title="修改审批流程信息" :mask-closable="false" :width="800" class="from-client">
      <Form ref="formPrecess" :model="formPrecess" :rules="processInline" :label-width="110">
        <Row :gutter="16">
          <Col :md="12" :xs="24">
          <FormItem prop="dupRemoStgy" label="审批人去重策略">
            <Input v-model.trim="formPrecess.dupRemoStgy" disabled></Input>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem prop="noticeStgy" label="通知抄送人策略">
            <Input v-model.trim="formPrecess.noticeStgy" disabled></Input>
          </FormItem>
          </Col>
          <Col :md="24" :xs="24">
          <FormItem prop="procName" label="流程名称">
            <Input v-model.trim="formPrecess.procName"></Input>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem prop="groupId" label="流程组">
            <Select v-model="formPrecess.groupId">
              <Option v-for="item in groupNameList" :value="item.groupId" :key="item.groupId">{{ item.groupName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem label="状态" prop="status">
            <RadioGroup v-model="formPrecess.status">
              <Radio label="true"> 激活 </Radio>
              <Radio label="false"> 冻结 </Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :md="24" :sm="24">
          <FormItem prop="comment" label="流程描述">
            <Input v-model="formPrecess.comment" type="textarea" :rows="3"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="putApvProcess('formPrecess')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
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
          vm.edit(params);
        }
      }
    },
    "编辑"
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
          vm.isActive(params.row, true);
        }
      }
    },
    "激活"
  );
};
// 冻结按钮
const blockButton = (vm, h, params) => {
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
          vm.isActive(params.row, false);
        }
      }
    },
    "冻结"
  );
};

import qs from "qs";
import { resCode } from "@/api/code";
import {
  ApiGetApvProcess,
  ApiGetApvGroupAll,
  ApiPutApvProcess
} from "@/api/attendance/approval-process-api.js";
export default {
  data() {
    return {
      processModal: false,
      groupNameList: [], // 流程组
      formPrecess: {},
      processInline: {
        procName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ],
        groupId: [
          {
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }
        ]
      },
      columnsProcess: [
        {
          type: "index",
          title: "序号",
          width: 60,
          align: "center"
        },
        {
          title: "流程名称",
          key: "procName",
          align: "center"
        },
        {
          title: "审批人去重策略",
          key: "dupRemoStgy",
          align: "center"
        },
        {
          title: "通知抄送人策略",
          key: "noticeStgy",
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.status ? "激活" : "冻结";
              })(this)
            );
          }
        },
        {
          title: "流程组",
          key: "groupName",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 140,
          align: "center",
          render: (h, params) => {
            return h("div", [
              editButton(this, h, params),
              (function(vm) {
                if (params.row.status) {
                  return blockButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                if (!params.row.status) {
                  return activeButton(vm, h, params);
                }
              })(this)
            ]);
          }
        }
      ],
      processData: []
    };
  },
  methods: {
    edit(data) {
      this.processModal = true;
      this.formPrecess = this.shallowCopy(data.row);

      if (data.row.status) {
        this.formPrecess.status = "true";
      } else {
        this.formPrecess.status = "false";
      }
    },
    // 获取所有审批组信息
    getApvGroupAll() {
      ApiGetApvGroupAll().then(res => {
        if (res.code == "success") {
          this.groupNameList = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 请求列表信息
    getApvProcess() {
      ApiGetApvProcess().then(res => {
        if (res.code == "success") {
          this.processData = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 拷贝数据
    shallowCopy(obj) {
      if (typeof obj !== "object") {
        return;
      }
      var newObj = obj instanceof Array ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    },
    // 修改完成后提交
    putApvProcess(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPutApvProcess(qs.stringify(this.formPrecess)).then(res => {
            if (res.code == "success") {
              this.$Message.success("修改成功");
              this.processModal = false;
              this.getApvProcess();
            } else {
              if (resCode[res.code]) {
                this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    //激活or冻结
    isActive(data, activated) {
      data.status = activated;
      ApiPutApvProcess(qs.stringify(data)).then(res => {
        if ((res.code = "success")) {
          this.getApvProcess();
          this.$Message.success("成功");
        } else {
          if (resCode[res.code]) {
             this.$Message.error(resCode[res.code]);
          }
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.getApvProcess();
    }
  },
  mounted() {
    this.getApvProcess();
    this.getApvGroupAll();
  }
};
</script>

<style lang="scss">
</style>
