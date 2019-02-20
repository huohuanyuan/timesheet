/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-16 11:47:43 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-01-31 13:42:44
 */
<template>
  <div class="dictionary">
    <Row :gutter="16">
      <Col :md="6" :sm="8" :lg="4">
      <Tree :data="dictionaryTree" @on-select-change="dictionarySelect"></Tree>
      <split></split>
      </Col>
      <Col :md="18" :sm="16" :lg="20">
      <Row :gutter="16">
        <div class="dictionary-wrap">
          <Col span="24">
          <Button type="info" @click="newDictionary('formNewDictionary')" v-if="privilegeData.DIC_ADD"> 新增 </Button>
          <split></split>
          <Table stripe :columns="columnsDictionary" :data="dictionaryData"></Table>
          </Col>
        </div>
      </Row>
      </Col>
    </Row>
    <!-- 新建  -->
    <Modal v-model="dictionaryModal" title="新建项目状态编码" :mask-closable="false" :width="600">
      <Form ref="formNewDictionary" :model="formNewDictionary" :rules="dictionaryInline" :label-width="80">
        <Row :gutter="16">
          <Col span="24">
          <FormItem label="系统类别">
            <Input v-model.trim="formNewDictionary.paName" disabled></Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem prop="dictionaryCode" label="编码">
            <Input v-model.trim="formNewDictionary.dictionaryCode"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="24">
          <FormItem prop="dictionaryName" label="名称">
            <Input v-model.trim="formNewDictionary.dictionaryName"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="newDictionarySave('formNewDictionary')" type="primary" long> 保存 </Button>
      </div>
    </Modal>
    <!-- 修改  -->
    <Modal v-model="editDictionaryModal" title="修改项目状态编码" :mask-closable="false" :width="600">
      <Form ref="editDictionary" :model="editDictionary" :rules="editDictionaryInline" :label-width="80">
        <Row :gutter="16">
          <Col span="24">
          <FormItem prop="dictionaryCode" label="编码">
            <Input v-model.trim="editDictionary.dictionaryCode" disabled></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="24">
          <FormItem prop="dictionaryName" label="名称">
            <Input v-model.trim="editDictionary.dictionaryName"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="putDict('editDictionary')" type="primary" long> 保存 </Button>
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
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.editDict(params.row.dictionaryId);
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
          vm.deletDict(params.row.dictionaryId);
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
import moment from "moment";
import split from "components/unit/split";
import { privilege } from "common/js/privilege";
import { resCode } from "@/api/code";
import qs from "qs";
import {
  ApiGetDict,
  getDictCon,
  ApiGetDictCon,
  ApiPostDict,
  ApiDeletDict,
  ApiGetDictDictionaryId,
  ApiPutDict
} from "@/api/system/dictionary-api.js";
export default {
  components: {
    split
  },
  data() {
    const validateenglish = (rule, value, callback) => {
      var reg = /^[a-zA-Z][0-9a-zA-Z_]+$/;
      if (!reg.test(value)) {
        callback(
          new Error(
            "编码必须是大小写字母、下划线或者数字，不能以数字和下划线开头"
          )
        );
      } else {
        callback();
      }
    };
    return {
      privilegeData: {
        DIC_ADD: false, //新增
        DIC_EDIT: false, //编辑
        DIC_DEL: false //删除
      },
      dictionaryModal: false,
      editDictionaryModal: false,
      formNewDictionary: {
        code: "",
        paName: "",
        dictionaryName: "",
        dictionaryCode: "",
        parentId: ""
      },
      editDictionary: {
        code: "",
        dictionaryName: "",
        dictionaryCode: "",
        parentId: ""
      },
      dictionaryInline: {
        dictionaryName: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 32,
            message: "名称不能超过32位",
            trigger: "blur"
          }
        ],
        dictionaryCode: [
          {
            validator: validateenglish,
            trigger: "blur",
            required: true
          },

          {
            type: "string",
            max: 128,
            message: "编码不能超过128位",
            trigger: "blur"
          }
        ]
      },
      editDictionaryInline: {
        dictionaryName: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            max: 32,
            message: "名称不能超过32位",
            trigger: "blur"
          }
        ]
      },
      dictionaryTree: [
        {
          title: "类别",
          expand: true,
          children: []
        }
      ], // 树形数据
      dictionaryData: [],
      columnsDictionary: [
        {
          title: "序号",
          width: 60,
          align: "center",
          type: "index"
        },
        {
          title: "编码",
          key: "dictionaryCode",
          align: "center"
        },
        {
          title: "名称",
          key: "dictionaryName",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createdtime",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function() {
                return moment(params.row.createdtime).format("YYYY-MM-DD");
              })(this)
            );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              (function(vm) {
                if (params.row.templateId == 0) {
                  return editButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                if (params.row.templateId == 0) {
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
      this.getDict();
      //获取三级菜单权限
      let _this = this;
      privilege(_this.privilegeData).then(function(result) {
        _this.privilegeData = result;
      });
    },
    // 请求左侧树型 数据
    getDict() {
      let _this = this;
      ApiGetDict().then(function(res) {
        if (res.code == "success") {
          _this.getTree(res.data);
          _this.getDictCon(res.data[0].dictionaryCode);
          _this.formNewDictionary.parentId = res.data[0].dictionaryId;
          _this.formNewDictionary.code = res.data[0].dictionaryCode;
          _this.formNewDictionary.paName = res.data[0].dictionaryName;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 处理树形 数据
    getTree(tree) {
      let arr = [];
      tree.map(item => {
        let obj = {};
        obj.title = item.dictionaryName;
        obj.code = item.dictionaryCode;
        obj.id = item.dictionaryId;
        obj.parentId = item.parentId;
        arr.push(obj);
      });
      this.dictionaryTree[0].children = arr;
      return arr;
    },
    // 点击数
    dictionarySelect(data) {
      if (data[0].code) {
        let dictionaryCode = data[0].code;
        this.formNewDictionary.parentId = data[0].id;
        this.formNewDictionary.code = data[0].code;
        this.formNewDictionary.paName = data[0].title;
        this.getDictCon(dictionaryCode);
      }
    },
    // 请求右侧table 数据
    getDictCon(dictionaryCode) {
      let _this = this;
      ApiGetDictCon(dictionaryCode).then(function(res) {
        if (res.code == "success") {
          _this.dictionaryData = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 点击新建按钮
    newDictionary(name) {
      this.dictionaryModal = true;
      this.$refs[name].resetFields();
    },

    // 新建保存
    newDictionarySave(name) {
      this.$refs[name].validate(valid => {
        let _this = this;
        if (valid) {
          ApiPostDict(qs.stringify(_this.formNewDictionary)).then(function(
            res
          ) {
            if (res.code == "success") {
              _this.$Message.success("添加成功");
              _this.dictionaryModal = false;
              _this.getDictCon(_this.formNewDictionary.code);
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    deletDict(dictionaryId) {
      let _this = this;
      ApiDeletDict(dictionaryId).then(function(res) {
        if (res.code == "success") {
          _this.$Message.success("删除成功");
          _this.getDictCon(_this.formNewDictionary.code);
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 点击编辑按钮
    editDict(dictionaryId) {
      let _this = this;
      ApiGetDictDictionaryId(dictionaryId).then(function(res) {
        if (res.code == "success") {
          _this.editDictionaryModal = true;
          _this.editDictionary = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 修改完成保存
    putDict(name) {
      this.$refs[name].validate(valid => {
        let _this = this;
        if (valid) {
          ApiPutDict(qs.stringify(_this.editDictionary)).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("修改成功");
              _this.editDictionaryModal = false;
              _this.getDictCon(_this.formNewDictionary.code);
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
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
