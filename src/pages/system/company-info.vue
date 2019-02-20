/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:19:46 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-11-01 17:18:46
 * @instructions 公司管理 
 */
<template>
  <div class="company-info">
    <div class="tr">
      <Button type="primary" size="small" @click="editCompanyModalShow"> 编辑 </Button>
    </div>
    <Row :gutter="16">
      <Col :md="8" :sm="10" :xs="24" :lg="4">
      <div class="user-img" @click="companyLogoModalShow">
        <img alt="" :src="companyLogoUrl" :onerror="defaultImg">
        <div class="upload-cover">
          <Icon type="camera"></Icon>
        </div>
      </div>
      <split></split>
      </Col>
      <Col :md="16" :sm="14" :xs="24" :lg="20">
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">公司名称：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.companyName}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">公司简称：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.companyShortname}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">公司编号：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.companyCode}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">英文简称：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.englishShortname}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">类别：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.dictionaryName}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">联系人：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.contact}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">手机：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.contactMobile}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">地区：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.countryName==null ? "暂无" :company.countryName}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">城市：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.cityName==null ? "暂无" :company.cityName}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">公司地址：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.address}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">是否激活：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div> {{company.activated ? "是":"否"}}</div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">电话：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div> {{company.contactTel == "" ? "暂无":company.contactTel}}</div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">公司主页：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.url == "" ? "暂无":company.url}}
        </div>
        </Col>
      </Row>
      <split></split>
      <Row :gutter="16">
        <Col :md="4" :sm="6" :xs="10">
        <div class="tr">备注：</div>
        </Col>
        <Col :md="20" :sm="18" :xs="12">
        <div>
          {{company.description == "" ? "暂无" : company.description}}
        </div>
        </Col>
      </Row>
      </Col>
    </Row>
    <div>
    </div>
    <!-- 上传公司logo -->
    <Modal v-model="companyLogoModal" title="添加公司Logo" :width="800" class="company-logo">
      <div class="image-editor">
        <Row :gutter="16">
          <Col span="14" class="image-editor-con1">
          <div class="cropper">
            <img id="cropimg1" alt="" src="">
          </div>
          </Col>
          <Col span="10" class="image-editor-con1">
          <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
            <div id="preview1"></div>
          </Row>
          <div class="image-editor-con1-btn-con">
            <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" id="fileinput1" class="fileinput" />
            <label class="filelabel" for="fileinput1">
              <Icon type="image"></Icon>&nbsp;选择图片</label>
            <span>
              <Button @click="postCompanyLogo" type="primary" icon="ios-cloud-upload"> 上传 </Button>
            </span>
          </div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="companyLogoModal=false">关闭</Button>
      </div>
    </Modal>
    <!--  修改公司信息 -->
    <Modal v-model="editCompanyModal" title="修改公司信息" :width="800" class="new-company" :mask-closable="false">
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
              <Input v-model.trim="formNewCompany.englishShortname" disabled></Input>
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
              <Input v-model.trim="formNewCompany.contactEmail" disabled></Input>
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
              <Input type="textarea" v-model.trim="formNewCompany.description"></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <p slot="footer">
        <Button type="primary" long @click="postCompany('formNewCompany')">保存</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import Cookies from "js-cookie";
import { resCode } from "@/api/code";
import Cropper from "cropperjs";
import "../../common/css/cropper.min.css";
import split from "components/unit/split";
import {
  ApiGetCompanyCon,
  ApiPostCompanyLogo,
  ApiPutCompany
} from "@/api/system/company-api";
import {
  ApiGetDict,
  ApiGetCountry,
  ApiGetCity,
  ApiGetCompanyLogo
} from "@/api/api";

export default {
  name: "image-editor",
  components: {
    split
  },
  data() {
    return {
      companyLogoUrl: "",
      defaultImg:
        'this.src="' + require("../../common/img/d-company.jpg") + '"',
      companyLogoModal: false,
      editCompanyModal: false,
      countryList: [],
      cityList: [],
      companyCategoryList: [],
      company: {
        companyName: "",
        companyShortname: "",
        englishShortname: "",
        dictionaryId: 0,
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
      formNewCompany: {
        companyName: "",
        companyShortname: "",
        englishShortname: "",
        dictionaryId: 0,
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
            message: "联系人地址不能超过64位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 初始化上传图片的插件
    init() {
      let img1 = document.getElementById("cropimg1");
      this.cropper1 = new Cropper(img1, {
        dragMode: "move",
        preview: "#preview1",
        restore: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        toggleDragModeOnDblclick: false
      });
      this.getCompanyCon();
    },
    //获取公司分类
    getDict() {
      let dictCode = "COMP_CATEGORY";
      ApiGetDict(dictCode).then(res => {
        if (res.code == "success") {
          this.companyCategoryList = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取地区
    getCountry() {
      ApiGetCountry().then(res => {
        if (res.code == "success") {
          this.countryList = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    /**
     * 获取城市
     * @param {Number} id 当前地区Id
     * */

    countryChange(id) {
      ApiGetCity(id).then(res => {
        if (res.code == "success") {
          this.cityList = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取公司详情
    getCompanyCon() {
      let companyId = Cookies.get("companyId");
      ApiGetCompanyCon(companyId).then(res => {
        if (res.code == "success") {
          this.company = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 店家 公司Logo
    companyLogoModalShow() {
      this.companyLogoModal = true;
    },
    // 上传图片验证
    handleChange(e) {
      let file = e.target.files[0];
      if (file.size / 1024 > 600) {
        this.$Message.error({
          content: "上传图片大小超出限制！",
          duration: 10
        });
        return false;
      }
      let reader = new FileReader();
      reader.onload = () => {
        this.cropper1.replace(reader.result);
        reader.onload = null;
      };
      reader.readAsDataURL(file);
    },
    // 添加 公司logo
    postCompanyLogo() {
      let avatarNew = this.cropper1.getCroppedCanvas().toDataURL();
      let file = this.cropper1
        .getCroppedCanvas()
        .toDataURL()
        .substr(22);
      let data = {
        logo: file,
        companyId: this.company.companyId
      };
      ApiPostCompanyLogo(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.companyLogoModal = false;
          this.$Message.success("上传成功!");
          this.getCompanyLogo();
          this.$store.commit("setCompanyLogoUrl", avatarNew);
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 编辑 公司信息
    editCompanyModalShow() {
      this.editCompanyModal = true;
      this.getDict();
      this.getCountry();
      let companyId = Cookies.get("companyId");
      ApiGetCompanyCon(companyId).then(res => {
        if (res.code == "success") {
          this.formNewCompany = res.data;
          this.countryChange(res.data.countryId);
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 保存提交信息
    postCompany(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPutCompany(qs.stringify(this.formNewCompany)).then(res => {
            if (res.code == "success") {
              this.$Message.success("修改成功!");
              this.editCompanyModal = false;
              this.getCompanyCon();
            } else {
              if (resCode[res.code]) {
                this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    // 请求公司logo
    getCompanyLogo() {
      let _data = {
        companyId: Cookies.get("companyId")
      };
      ApiGetCompanyLogo(_data)
        .then(res => {
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res).reduce(
                (res, byte) => res + String.fromCharCode(byte),
                ""
              )
            )
          );
        })
        .then(res => {
          if (res != "data:image/png;base64,") {
            this.companyLogoUrl = res;
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
    this.getCompanyLogo();
  }
};
</script>

<style lang="scss">
@import "../../common/css/base";
@import "../../common/css/image-editor";

.company-info {
  .user-img {
    width: 200px;
    margin: 0 auto;
  }
  .tr {
    text-align: right;
  }
  .tl {
    text-align: left;
  }
}
</style>

