/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:18:47 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-10-18 10:31:11
 * @instructions  超级管理员下面的公司
 */
<template>
  <div>
    <Row :gutter="16" v-if="privilegeData.COMP_ADD">
      <Col span="6">
      <Input v-model="companyName">
      <span slot="prepend"> 公司名称 </span>
      </Input>
      </Col>
      <Col span="6">
      <Input v-model="companyCode">
      <span slot="prepend"> 公司代码 </span>
      </Input>
      </Col>
      <Col span="6">
      <div class="s-input-wrapper">
        <label>
          是否激活
        </label>
        <Select v-model="activated">
          <Option value="all"> 全部 </Option>
          <Option value="true"> 是 </Option>
          <Option value="false">否</Option>
        </Select>
      </div>
      </Col>
      <Col span="6" class="btn-div">
      <Button type="info" @click="getCompany"> 查询 </Button>
      <Button @click="resetCompany"> 重置 </Button>
      </Col>
    </Row>
    <split></split>
    <split></split>
    <div class="company-wrap">
      <div v-if="privilegeData.COMP_ADD">
        <Button type="info" @click="newCompany('formNewCompany')" class="add-btn"> 新增 </Button>
      </div>
      <split></split>
      <Table stripe :columns="columnsCompany" :data="companyData"></Table>
      <div class="page">
        <Page :total="total" size="small" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
        </Page>
      </div>
    </div>
    <!-- 新建公司modal -->
    <Modal v-model="newCompanyModal" :title="title" :width="800" class="new-company" :mask-closable="false">
      <div class="new-company-wrap">
        <Form ref="formNewCompany" :model="formNewCompany" :rules="compamyInline" :label-width="90">
          <Row :gutter="16">
            <Col span="12">
            <FormItem prop="companyName" label="公司名称">
              <Input v-model.trim="formNewCompany.companyName"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="companyShortname" label="公司简称">
              <Input v-model.trim="formNewCompany.companyShortname"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="englishShortname" label="英文简称">
              <Input v-model.trim="formNewCompany.englishShortname" :disabled="englishDisabled"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="dictionaryId" label="公司分类">
              <Select v-model="formNewCompany.dictionaryId">
                <Option v-for="item in companyCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="地区">
              <Select v-model="formNewCompany.countryId" @on-change="countryChange">
                <Option v-for="item in countryList" :value="item.countryId" :key="item.countryId">{{ item.countryName }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="cityId" label="城市">
              <Select v-model.sync="formNewCompany.cityId" filterable>
                <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{ item.cityName }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="contact" label="联系人">
              <Input v-model.trim="formNewCompany.contact"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="contactEmail" label="联系人邮箱">
              <Input v-model.trim="formNewCompany.contactEmail"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="contactMobile" label="手机">
              <Input v-model.trim="formNewCompany.contactMobile"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="contactTel" label="电话">
              <Input v-model.trim="formNewCompany.contactTel"></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem prop="url" label="公司主页">
              <Input v-model.trim="formNewCompany.url"></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem prop="address" label="公司地址">
              <Input v-model.trim="formNewCompany.address"></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem prop="description" label="公司介绍">
              <Input v-model.trim="formNewCompany.description" type="textarea"></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="postCompany('formNewCompany')">保存</Button>
      </div>
    </Modal>

    <Modal v-model="companyInfoModal" title="公司信息" :width="800">
      <div class="company-view">
        <Row :gutter="16">
          <Col span="12">
          <Row :gutter="16">
            <Col span="6">
            <div>公司名称：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.companyName}}
            </div>
            </Col>
            <Col span="6">
            <div>公司简称：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.companyShortname}}
            </div>
            </Col>
            <Col span="6">
            <div>公司编号：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.companyCode}}
            </div>
            </Col>
            <Col span="6">
            <div>英文简称：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.englishShortname}}
            </div>
            </Col>
            <Col span="6">
            <div>类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.dictionaryName}}
            </div>
            </Col>
            <Col span="6">
            <div>联&nbsp;系&nbsp;人：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.contact}}
            </div>
            </Col>
            <Col span="6">
            <div>手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.contactMobile}}
            </div>
            </Col>
            <Col span="6">
            <div>国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.countryName}}
            </div>
            </Col>
            <Col span="6">
            <div>城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.cityName}}
            </div>
            </Col>
            <Col span="6">
            <div>公司地址：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.address}}
            </div>
            </Col>
            <Col span="6">
            <div>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.description == "" ? "暂无" : formNewCompany.description}}
            </div>
            </Col>
          </Row>
          </Col>
          <Col span="12">
          <Col span="24">
          <div class="div-logo">
            <img :src="companyLogoUrl" alt="">
          </div>
          </Col>
          <Row :gutter="16">
            <Col span="6">
            <div>是否激活：</div>
            </Col>
            <Col span="18">
            <div> {{formNewCompany.activated ? "是":"否"}}</div>
            </Col>
          </Row>
          <Row :gutter="16">
            <Col span="6">
            <div>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：</div>
            </Col>
            <Col span="18">
            <div> {{formNewCompany.contactTel == "" ? "暂无":formNewCompany.contactTel}}</div>
            </Col>
          </Row>

          <Row :gutter="16">
            <Col span="6">
            <div>公司主页：</div>
            </Col>
            <Col span="18">
            <div>
              {{formNewCompany.url == "" ? "暂无":formNewCompany.url}}
            </div>
            </Col>
          </Row>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="companyInfoModal=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
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
          vm.deletCompany(params.row.companyId);
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
//编辑按钮
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
          vm.$refs["formNewCompany"].resetFields();
          vm.getCompanyCon(params.row.companyId);
        }
      }
    },
    "编辑"
  );
};
// 激活/关闭
const activationButton = (vm, h, params) => {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title: params.row.activated
          ? "您确定要关闭这家公司吗?"
          : "您确定要激活这家公司吗?",
        transfer: true
      },
      on: {
        "on-ok": () => {
          vm.activationCompany(params.row.companyId, params.row.activated);
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
            type: params.row.activated ? "ghost" : "warning",
            placement: "top",
            size: "small"
          }
        },
        params.row.activated ? "关闭" : "激活"
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
        type: "success",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.getCompanyInfo(params.row.companyId);
        }
      }
    },
    "查看"
  );
};

import {
  ApiGetCompany,
  ApiGetCompanyCon,
  ApiPostCompany,
  ApiDeletCompany,
  ApiPutCompany
} from "@/api/system/company-api";
import { ApiGetDict, ApiGetCountry, ApiGetCity } from "@/api/api";
import qs from "qs";

import split from "components/unit/split";
import { privilege } from "common/js/privilege";
import { resCode } from "@/api/code";
import axios from "axios";
export default {
  components: {
    split
  },
  data() {
    const validateenglishShortname = (rule, value, callback) => {
      var reg = /^[A-Z]+$/g;
      if (!reg.test(value)) {
        callback(new Error("英文简称只能输入大写英文!"));
      } else {
        callback();
      }
    };
    return {
      privilegeData: {
        COMP_ADD: false,
        COMP_EDIT: false,
        COMP_DEL: false,
        COMP_VIEW: false
      },
      englishDisabled: false, // 禁止修改
      countryList: [],
      cityList: [],
      title: "",
      companyId: "",
      companyLogoUrl: "",
      companyName: "",
      companyCode: "",
      activated: "",
      newCompanyModal: false,
      companyLogoModal: false,
      companyInfoModal: false,
      companyData: [],
      englishShortname: "",
      logoId: "",

      resourcePath: "",
      total: 0,
      pageNum: 1,
      pageSize: 10,
      formNewCompany: {
        companyName: "",
        companyShortname: "",
        englishShortname: "",
        dictionaryId: "",
        countryId: "",
        cityId: "",
        contact: "",
        url: "",
        contactEmail: "",
        contactMobile: "",
        contactTel: "",
        address: "",
        description: ""
      },
      companyCategoryList: [],
      compamyInline: {
        companyName: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 64,
            message: "公司名称不能超过64位",
            trigger: "blur"
          }
        ],
        companyShortname: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 16,
            message: "公司简称不能超过16位",
            trigger: "blur"
          }
        ],
        englishShortname: [
          {
            validator: validateenglishShortname,
            trigger: "blur",
            required: true
          },
          {
            type: "string",
            max: 16,
            message: "英文简称不能超过16位",
            trigger: "blur"
          }
        ],
        dictionaryId: [
          { required: true, message: " ", type: "number", trigger: "change" }
        ],
        contact: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 20,
            message: "联系人不能超过20位",
            trigger: "blur"
          }
        ],
        contactEmail: [
          { required: true, message: " ", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        contactMobile: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
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
        address: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 64,
            message: "公司地址不能超过64位",
            trigger: "blur"
          }
        ],
        url: [
          { required: false, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 64,
            message: "公司地址不能超过512位",
            trigger: "blur"
          }
        ],
        description: [
          { required: false, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 64,
            message: "公司地址不能超过512位",
            trigger: "blur"
          }
        ]
      },
      columnsCompany: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "公司名称",
          key: "companyName"
        },
        {
          title: "公司简称",
          key: "companyShortname"
        },
        {
          title: "公司代码",
          key: "companyCode"
        },
        {
          title: "公司分类",
          key: "dictionaryName"
        },
        {
          title: "联系人",
          key: "contact"
        },
        {
          title: "是否激活",
          key: "activated",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.activated ? "已激活" : "未激活";
              })(this)
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 280,
          align: "center",
          render: (h, params) => {
            return h("div", [
              viewButton(this, h, params),
              editButton(this, h, params),
              deleteButton(this, h, params),
              activationButton(this, h, params)
            ]);
          }
        }
      ]
    };
  },
  methods: {
    init() {
      let me = this;
      this.getCountry();
      this.getCompany();
      this.getDict();
      //获取页面权限
      privilege(me.privilegeData).then(function(result) {
        me.privilegeData = result;
      });
    },
    // 获取公司 列表
    getCompany() {
      let _this = this;
      let isActivated;
      if (_this.activated == "all") {
        isActivated = "";
      } else {
        isActivated = _this.activated;
      }
      ApiGetCompany({
        companyName: _this.companyName,
        companyCode: _this.companyCode,
        activated: isActivated,
        pageNum: _this.pageNum,
        pageSize: _this.pageSize
      }).then(function(res) {
        if (res.code == "success") {
          _this.total = res.total;
          _this.companyData = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //重置
    resetCompany() {
      this.companyName = "";
      this.companyCode = "";
      this.activated = "";
      this.getCompany();
    },
    /**
     * 激活/关闭公司
     * @param  {Number} companyId 公司Id
     * @param  { Boolean }  activated 公司状态
     */
    activationCompany(companyId, activated) {
      let _this = this;
      let isActivated;
      if (activated) {
        isActivated = false;
      } else {
        isActivated = true;
      }
      let data = {
        companyId: companyId,
        activated: isActivated
      };
      ApiPutCompany(qs.stringify(data)).then(function(res) {
        if (res.code == "success") {
          if (isActivated) {
            _this.$Message.success("激活成功!");
          } else {
            _this.$Message.success("关闭成功!");
          }
          _this.getCompany();
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //分页
    handlePage(value) {
      this.pageNum = value;
      this.getCompany();
    },
    handlePageSize(value) {
      this.pageSize = value;
      this.getCompany();
    },
    // 添加新公司
    newCompany() {
      this.title = "添加公司信息";
      this.newCompanyModal = true;
      this.$refs["formNewCompany"].resetFields();
      this.companyId = "";
      this.englishDisabled = false;
    },
    //添加公司 保存提交 / 修改公司提交保存
    postCompany(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let _this = this;
          let data = {
            companyName: _this.formNewCompany.companyName,
            companyShortname: _this.formNewCompany.companyShortname,
            englishShortname: _this.formNewCompany.englishShortname,
            dictionaryId: _this.formNewCompany.dictionaryId,
            countryId: _this.formNewCompany.countryId,
            cityId: _this.formNewCompany.cityId,
            contact: _this.formNewCompany.contact,
            url: _this.formNewCompany.url,
            contactEmail: _this.formNewCompany.contactEmail,
            contactMobile: _this.formNewCompany.contactMobile,
            contactTel: _this.formNewCompany.contactTel,
            address: _this.formNewCompany.address,
            description: _this.formNewCompany.description
          };
          if (_this.companyId !== "") {
            data.companyId = _this.companyId;
            ApiPutCompany(qs.stringify(data)).then(function(res) {
              if (res.code == "success") {
                _this.$Message.success("修改成功!");
                _this.newCompanyModal = false;
                _this.getCompany();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          } else if (_this.companyId === "") {
            ApiPostCompany(qs.stringify(data)).then(function(res) {
              if (res.code == "success") {
                _this.$Message.success("添加成功!");
                _this.newCompanyModal = false;
                _this.getCompany();
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
    // 修改公司请求 公司详情
    getCompanyCon(companyId) {
      let _this = this;
      _this.title = "修改公司信息";
      this.englishDisabled = true;

      ApiGetCompanyCon(companyId).then(function(res) {
        if (res.code == "success") {
          _this.formNewCompany = res.data;
          _this.companyId = companyId;
          _this.newCompanyModal = true;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 查看 获取公司详情
    getCompanyInfo(companyId) {
      let _this = this;
      ApiGetCompanyCon(companyId).then(function(res) {
        if (res.code == "success") {
          _this.formNewCompany = res.data;
          _this.companyInfoModal = true;
          _this.companyLogoUrl = `${
            axios.defaults.baseURL
          }/company/logo/${companyId}`;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 删除公司
    deletCompany(companyId) {
      let _this = this;
      ApiDeletCompany(companyId).then(function(res) {
        if (res.code == "success") {
          _this.getCompany();
          _this.$Message.success("删除成功!");
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取公司分类
    getDict() {
      let dictCode = "COMP_CATEGORY";
      let _this = this;
      ApiGetDict(dictCode).then(function(res) {
        if (res.code == "success") {
          _this.companyCategoryList = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取地区
    getCountry() {
      let _this = this;
      ApiGetCountry().then(function(res) {
        if (res.code == "success") {
          _this.countryList = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取 地区对应的城市
    countryChange(id) {
      let _this = this;
      ApiGetCity(id).then(function(res) {
        if (res.code == "success") {
          _this.cityList = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
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
@import "../../common/css/mixin";
@import "../../common/css/base";
@import "../../common/css/image-editor";
.s-input-wrapper {
  @include select-label();
}
.company-view {
  .div-logo {
    height: 160px;
    width: 300px;
    border: 1px solid #c3c3c3;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .ivu-col {
    margin-bottom: 10px;
  }
}
.new-company {
  .new-company-wrap {
    padding: 0 20px;
  }
  .declare-wrap {
    position: relative;
    height: 100%;
    padding-bottom: 40px;
    button {
      position: absolute;
      bottom: 0;
    }
  }
}
</style>

