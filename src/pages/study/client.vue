/*
 * @Author: liuhaosheng 
 * @Date: 2018-06-29 17:40:18 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-11-01 17:18:08
 * @instructions  项目下的 客户管理
 */
<template>
  <div>
    <Row :gutter="16">
      <Col :md="8" :sm="12" :xs="24">
      <Input v-model.trim="clientName">
      <span slot="prepend"> 客户名称 </span>
      </Input>
      </Col>
      <Col :md="16" :sm="12" :xs="24">
      <div>
        <Button type="info" @click="getClient"> 查询 </Button>
        <Button @click="resetClient"> 重置 </Button>
        <Button type="info" class="add-btn" @click="newClient" v-if="privilegeData.CLI_ADD"> 新增 </Button>
      </div>
      </Col>
    </Row>
    <div class="client-wrap">
      <split></split>
      <Table stripe :columns="columnsClient" :data="clientData"></Table>
      <div class="page">
        <Page :total="total" size="small" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
        </Page>
      </div>
    </div>
    <!--  新建 / 修改 客户 -->
    <Modal v-model="clientModal" :title="clientTitle" :mask-closable="false" :width="800" class="from-client">
      <Form ref="formNewClient" :model="formNewClient" :rules="clientInline" :label-width="80">
        <Row :gutter="16">
          <Col :md="24" :xs="24" v-show="codeShow">
          <FormItem prop="clientCode" label="客户编号">
            <Input v-model.trim="formNewClient.clientCode" disabled></Input>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem prop="clientName" label="客户名称">
            <Input v-model.trim="formNewClient.clientName"></Input>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem label="客户类别" prop="clientCategory">
            <Select v-model="formNewClient.clientCategory">
              <Option v-for="item in clientCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem prop="contact" label="联系人">
            <Input v-model.trim="formNewClient.contact"></Input>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem prop="contactEmail" label="邮箱">
            <Input v-model.trim="formNewClient.contactEmail"></Input>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem prop="contactMobile" label="手机">
            <Input v-model.trim="formNewClient.contactMobile"></Input>
          </FormItem>
          </Col>
          <Col :md="12" :xs="24">
          <FormItem prop="contactTel" label="电话">
            <Input v-model.trim="formNewClient.contactTel"></Input>
          </FormItem>
          </Col>
          <Col :md="24" :xs="24">
          <FormItem prop="address" label="地址">
            <Input v-model.trim="formNewClient.address"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col :md="24" :sm="24">
          <FormItem prop="description" label="客户描述">
            <Input v-model="formNewClient.description" type="textarea" :rows="2"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="postClient('formNewClient')">保存</Button>
      </div>
    </Modal>
    <!--  客户基本信息模态框 -->
    <Modal v-model="clientInfoModal" title="客户基本信息" :width="800">
      <div class="client-info">
        <Row :gutter="16">
          <Col :xs="8" :sm="4">
          <div>客户编号</div>
          </Col>
          <Col :xs="16" :sm="20">
          <div class="font-color">{{formNewClient.clientCode}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>客户名称</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formNewClient.clientName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>客户类别</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formNewClient.clientCategoryName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>联系人</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formNewClient.contact == "" ? "暂无" :formNewClient.contact}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>邮箱</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formNewClient.contactEmail == "" ? "暂无" :formNewClient.contactEmail}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>手机</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formNewClient.contactMobile == "" ? "暂无" :formNewClient.contactMobile}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>电话</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formNewClient.contactTel == "" ? "暂无" :formNewClient.contactTel}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>地址</div>
          </Col>
          <Col :xs="16" :sm="20">
          <div class="font-color">{{formNewClient.address == "" ? "暂无" :formNewClient.address}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>客户介绍</div>
          </Col>
          <Col :xs="16" :sm="20">
          <div class="font-color">{{formNewClient.description == "" ? "暂无" :formNewClient.description}}</div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  ApiGetClient,
  ApiPostClient,
  ApiDeletClient,
  ApiGetClientCon,
  ApiPutClient
} from "@/api/study/client-api";
import { ApiGetProjCon } from "@/api/study/project-api";
import { ApiGetDict } from "@/api/api";
import { resCode } from "@/api/code";
import split from "components/unit/split";
import qs from "qs";
import { privilege } from "common/js/privilege";
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
          vm.deleteClient(params.row.clientId);
        }
      }
    },
    [
      h(
        "Button",
        {
          style: {
            marginRight: "5px"
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
// 修改按钮
const editButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.getClientCon(params.row.clientId);
        }
      }
    },
    "编辑"
  );
};
// 查看按钮
const viewButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "success",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.getClientInfo(params.row.clientId);
        }
      }
    },
    "查看"
  );
};
export default {
  components: {
    split
  },
  data() {
    return {
      privilegeData: {
        CLI_ADD: false,
        CLI_VIEW: false,
        CLI_EDIT: false,
        CLI_DEL: false
      },
      clientTitle: "",
      clientName: "",
      clientId: "",
      clientCategoryList: [],
      formNewClient: {
        clientName: "",
        clientCategory: "",
        contact: "",
        contactEmail: "",
        contactTel: "",
        contactMobile: "",
        description: "",
        address: ""
      },
      clientInline: {
        clientName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            max: 32,
            message: "客户名称不能超过32位",
            trigger: "blur"
          }
        ],
        contact: [
          {
            type: "string",
            max: 32,
            message: "联系人名称不能超过32位",
            trigger: "blur"
          }
        ],
        contactEmail: [
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          },
          {
            max: 64,
            message: "邮箱长度不能超过64位",
            trigger: "blur"
          }
        ],
        contactMobile: [
          {
            len: 11,
            message: "手机号格式不正确",
            trigger: "blur"
          },
          {
            type: "number",
            trigger: "blur",
            message: "手机号格式不正确",
            transform(value) {
              return Number(value);
            }
          }
        ],
        clientCategory: [
          {
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }
        ],
        description: [
          {
            type: "string",
            max: 512,
            message: "客户描述不能超过512位",
            trigger: "blur"
          }
        ],
        address: [
          {
            type: "string",
            max: 128,
            message: "客户地址不能超过128位",
            trigger: "blur"
          }
        ]
      },
      total: 0,
      pageNum: 1,
      pageSize: 10,
      clientModal: false,
      clientInfoModal: false,
      codeShow: false,
      clientData: [],
      columnsClient: [
        {
          title: " ",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code = (vm.pageNum - 1) * vm.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "客户名称",
          key: "clientName"
        },
        {
          title: "客户编号",
          key: "clientCode"
        },
        {
          title: "客户分类",
          key: "clientCategoryName"
        },
        {
          title: "联系人",
          key: "contact"
        },
        {
          title: "操作",
          key: "action",
          width: 280,
          align: "center",
          render: (h, params) => {
            return h("div", [
              (function(vm) {
                if (params.row.allowView) {
                  return viewButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                if (params.row.allowEdit) {
                  return editButton(vm, h, params);
                }
              })(this),

              (function(vm) {
                if (params.row.allowDel) {
                  return deleteButton(vm, h, params);
                }
              })(this)
            ]);
          }
        }
      ]
    };
  },
  methods: {
    init() {
      let me = this;
      this.getClient();
      //获取三级菜单权限
      privilege(me.privilegeData).then(function(result) {
        me.privilegeData = result;
      });
    },
    // 分页
    handlePage(value) {
      this.pageNum = value;
      this.getClient();
    },
    handlePageSize(value) {
      this.pageSize = value;
      this.getClient();
    },
    // 客户类别
    getDict() {
      let dictCode = "CLIENT_CATEGORY";
      let _this = this;
      ApiGetDict(dictCode).then(function(res) {
        if (res.code == "success") {
          _this.clientCategoryList = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取客户列表
    getClient() {
      let _this = this;
      ApiGetClient({
        pageNum: _this.pageNum,
        pageSize: _this.pageSize,
        clientName: _this.clientName
      }).then(function(res) {
        if (res.code == "success") {
          _this.clientData = res.data;
          _this.total = res.total;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 新建 客户
    newClient() {
      this.clientTitle = "添加客户信息";
      this.codeShow = false;
      this.clientModal = true;
      this.clientId = "";
      this.getDict();
      this.handleReset("formNewClient");
    },
    postClient(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let _this = this;
          if (_this.clientId !== "") {
            ApiPutClient(qs.stringify(_this.formNewClient)).then(function(res) {
              if (res.code == "success") {
                _this.$Message.success("修改成功!");
                _this.clientModal = false;
                _this.getClient();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          } else {
            delete _this.formNewClient.clientId;
            ApiPostClient(qs.stringify(_this.formNewClient)).then(function(
              res
            ) {
              if (res.code == "success") {
                _this.$Message.success("添加成功!");
                _this.clientModal = false;
                _this.getClient();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        }
      });
    },
    /**
     * 修改当前客户信息
     * @param  {Number} clientId 当前客户的Id
     */
    getClientCon(clientId) {
      this.handleReset("formNewClient");
      this.clientTitle = "修改客户信息";
      let _this = this;
      _this.getDict();
      ApiGetClientCon(clientId).then(function(res) {
        if (res.code == "success") {
          _this.codeShow = true;
          _this.clientModal = true;
          _this.formNewClient = res.data;
          _this.clientId = clientId;

          // 判断 字典客户分类 是否 存在当前客户分类
          let priorityListArr = [];
          for (let i = 0; i < _this.clientCategoryList.length; i++) {
            priorityListArr.push(_this.clientCategoryList[i].dictionaryId);
          }
          if (!priorityListArr.includes(_this.formNewClient.clientCategory)) {
            _this.formNewClient.clientCategory = "";
            _this.formNewClient.clientCategoryName = "";
          }
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    /**
     * 当前客户详情
     * @param  { Number } clientId 当前客户的Id
     */
    getClientInfo(clientId) {
      let _this = this;
      ApiGetClientCon(clientId).then(function(res) {
        if (res.code == "success") {
          _this.clientInfoModal = true;
          _this.formNewClient = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    /**
     * 删除当前客户
     * @param  { Number } clientId 当前客户的Id
     */
    deleteClient(clientId) {
      let _this = this;
      ApiDeletClient(clientId).then(function(res) {
        if (res.code == "success") {
          //如果当前表格数据只有一条，则请求上一页
          if (_this.clientData.length == 1) {
            _this.pageNum = _this.pageNum > 1 ? --_this.pageNum : 1;
          }
          _this.getClient();
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 重置方法
    resetClient() {
      this.clientName = "";
      this.getClient();
    },
    // 请求form 表单
    handleReset(name) {
      this.$refs[name].resetFields();
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
@import "../../common/css/base";
@import "../../common/css/variable.scss";
.from-client {
  .ivu-input-group-prepend {
    width: 65px !important;
  }
}
.client-info {
  .ivu-col {
    margin-bottom: 10px;
  }
}
.font-color {
  color: $font-dark-color;
}
</style>
