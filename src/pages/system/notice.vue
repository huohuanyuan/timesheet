/*
 * @Author: chengshanshan 
 * @Date: 2018-07-06 09:49:38 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-10-18 13:55:57
 * @instraction: 公告管理
 */

<template>
  <div class="notice-wrap">
    <!-- 公告标题的header start-->
    <Row :gutter="16">
      <Col :xs="24" :sm="12" :md="6" :lg="5">
      <Input v-model.trim="noticeListParams.title" :maxlength='30'>
      <span slot="prepend">公告标题</span>
      </Input>
      <split></split>
      </Col>
      <Col :xs="24" :sm="12" :md="6" :lg="5">
      <div class="s-select-wrapper">
        <label>状态</label>
        <Select v-model="noticeListParams.status" clearable>
          <Option value="false">关闭</Option>
          <Option value="true">发布</Option>
        </Select>
      </div>
      <split></split>
      </Col>
      <Col :xs="24" :sm='24' :md="12" :lg="14">
      <div>
        <Button @click='seach' type="info">查询</Button>
        <Button @click='reset'>重置</Button>
      </div>
      <split></split>
      </Col>
    </Row>
    <!-- 公告标题的header end-->
    <div>
      <Button @click="newNotice('newNoticeForm')" type="info">新增</Button>
    </div>
    <split></split>
    <!-- 点击新增的模态框start -->
    <Modal v-model="addNoticeModel" title="添加公告信息" class="notice-model" :width="600">
      <Form ref="newNoticeForm" :model="newNoticeForm" :rules="newNoticeRule" :label-width="80">
        <FormItem label="标题" prop="title">
          <Input v-model.trim="newNoticeForm.title" :maxlength="30"></Input>
        </FormItem>
        <FormItem prop="dateStart" label="开始时间">
          <DatePicker type="datetime" v-model='newNoticeForm.dateStart' :clearable='false'></DatePicker>
        </FormItem>
        <FormItem prop="dateEnd" label="结束时间">
          <DatePicker v-model='newNoticeForm.dateEnd' type="datetime" :clearable='false'></DatePicker>
        </FormItem>
        <FormItem prop="status" label="状态">
          <Select v-model="newNoticeForm.status">
            <Option value="false">关闭</Option>
            <Option value="true">发布</Option>
          </Select>
        </FormItem>
        <FormItem label="内容" prop="content">
          <div ref="editor" style="text-align:left">
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="info" long @click="newNoticeSave('newNoticeForm')">保存</Button>
      </div>
    </Modal>
    <!-- 点击新增的模态框end -->
    <!-- 编辑资料使用的弹窗start -->
    <Modal v-model="editNoticeModel" title="编辑公告信息" class="notice-model" :width="600">
      <Form ref="editNoticeForm" :model="editNoticeForm" :rules="editNoticeRule" :label-width="80">
        <FormItem label="标题" prop="title" style="width: 487px">
          <Input v-model="editNoticeForm.title" :maxlength="30"></Input>
        </FormItem>
        <FormItem prop="dateStart" label="开始时间">
          <DatePicker v-model='editNoticeForm.dateStart' type="datetime" :clearable='false'></DatePicker>
        </FormItem>
        <FormItem prop="dateEnd" label="结束时间">
          <DatePicker v-model='editNoticeForm.dateEnd' type="datetime" :clearable='false'></DatePicker>
        </FormItem>
        <FormItem prop="status" label="状态">
          <Select v-model="editNoticeForm.status" :clearable='false'>
            <Option value='false'>关闭</Option>
            <Option value='true'>发布</Option>
          </Select>
        </FormItem>
        <FormItem prop="content" label="内容">
          <div ref="editor1" style="text-align:left">
          </div>
          <!-- <Input v-model="editNoticeForm.content" type="textarea" :maxlength="700" :rows="2" :autosize="{minRows: 2,maxRows: 5}"></Input> -->
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="info" long @click="editNoticeSave('editNoticeForm')">保存</Button>
      </div>
    </Modal>
    <!-- 编辑资料使用的弹窗end -->
    <!--内容部分start-->
    <Table :columns="noticeCol" :data="noticeList"></Table>
    <!--内容部分end-->
    <div class="page">
      <Page :total="pageTotal" :current="noticeListParams.pageNum" :size="noticeListParams.pageSize" show-total size="small" @on-change="pageChange" show-elevator show-sizer @on-page-size-change='pageSizeChange'>
      </Page>
    </div>
  </div>
  </div>
</template>
<script>
const closeButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "warning",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.closeNotice(params);
        }
      }
    },
    "关闭"
  );
};
const publishButton = (vm, h, params) => {
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
          vm.publishNotice(params);
        }
      }
    },
    "发布"
  );
};
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
          vm.deleteNotice(params.row.annoId);
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

import E from "wangeditor";

import moment from "moment";
import axios from "axios";
import { resCode } from "@/api/code";
import qs from "qs";
import Split from "components/unit/split";
import {
  ApiGetNoticeList,
  ApiPostNotice,
  ApiGetNotice,
  ApiPutNotice,
  ApiPublishNotice,
  ApiCloseNotice,
  ApiDeleteNotice
} from "@/api/system/notice-api";
export default {
  components: {
    Split
  },
  data() {
    return {
      editor: "",
      newNoticeForm: {
        title: "",
        dateStart: "",
        dateEnd: "",
        status: "",
        content: ""
      },
      editNoticeForm: {
        title: "",
        dateStart: "",
        dateEnd: "",
        status: "",
        content: ""
      },
      newNoticeRule: {
        title: [{ required: true, message: " ", trigger: "blur" }],
        dateStart: [
          { required: true, message: " ", trigger: "change", type: "date" }
        ],
        dateEnd: [
          { required: true, message: " ", trigger: "change", type: "date" }
        ],
        status: [{ required: true, message: " ", trigger: "change" }],
        content: [{ required: true, message: " ", trigger: "blur" }]
      },
      editNoticeRule: {
        title: [{ required: true, message: " ", trigger: "blur" }],
        dateStart: [
          { required: true, message: " ", trigger: "change", type: "date" }
        ],
        dateEnd: [
          { required: true, message: " ", trigger: "change", type: "date" }
        ],
        status: [
          { required: true, message: " ", trigger: "blur", type: "string" }
        ],
        content: [{ required: true, message: " ", trigger: "blur" }]
      },

      noticeCol: [
        {
          title: "序号",
          key: "index",
          type: "index",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.userListPrames.pageNum - 1) * vm.userListPrames.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "标题",
          key: "title"
        },
        {
          title: "开始时间",
          key: "dateStart",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.dateStart).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              })(this)
            );
          }
        },
        {
          title: "结束时间",
          key: "dateEnd",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return moment(params.row.dateEnd).format("YYYY-MM-DD HH:mm:ss");
              })(this)
            );
          }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.status == true ? "发布" : "关闭";
              })(this)
            );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
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
                      this.editNotice(params.row.annoId);
                    }
                  }
                },
                "编辑"
              ),
              (function(vm) {
                if (params.row.status) {
                  return closeButton(vm, h, params);
                } else {
                  return publishButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                return deleteButton(vm, h, params);
              })(this)
            ]);
          }
        }
      ],
      addNoticeModel: false, //点击新增之后的模态框
      editNoticeModel: false, //点击点击之后的模态框
      noticeList: [],
      pageTotal: 0,
      noticeListParams: {
        //参数
        pageNum: 1,
        pageSize: 10,
        status: "",
        title: ""
      },

      editstatus: "" //编辑中是否发布状态
    };
  },
  methods: {
    init() {
      this.getNoticeList();
      this.initEditer();
    },
    initEditer() {
      //富文本编辑器初始化
      this.editor = new E(this.$refs.editor);
      // 自定义菜单配置
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote" // 引用
      ];
      this.editor.customConfig.onchange = html => {
        this.newNoticeForm.content = html;
      };
      this.editor.create();
      this.editor.txt.html(this.newNoticeForm.content);
    },
    initEditEditer() {
      //富文本编辑器初始化
      let editor = new E(this.$refs.editor1);
      // 自定义菜单配置
      editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote" // 引用
      ];
      editor.customConfig.onchange = html => {
        this.editNoticeForm.content = html;
      };
      editor.create();
      editor.txt.html(this.editNoticeForm.content);
    },
    // 新建公告
    newNotice(name) {
      this.initEditer();
      this.editor.txt.html(""); // 清空内容
      this.addNoticeModel = true;
      this.$refs[name].resetFields();
    },
    //新建公告保存
    newNoticeSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let flag = true;
          //判断时间
          if (this.newNoticeForm.dateStart && this.newNoticeForm.dateEnd) {
            if (
              moment(this.newNoticeForm.dateEnd).isBefore(
                this.newNoticeForm.dateStart
              )
            ) {
              flag = false;
              this.$Message.error("结束不能在开始时间之后");
            }
          }
          if (flag) {
            let _params = {
              title: this.newNoticeForm.title,
              content: this.newNoticeForm.content,
              dateEnd: moment(this.newNoticeForm.dateEnd).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              dateStart: moment(this.newNoticeForm.dateStart).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              status: this.newNoticeForm.status,
              content: this.newNoticeForm.content
            };
            ApiPostNotice(qs.stringify(_params)).then(res => {
              if (res.code == "success") {
                this.$Message.success("添加公告成功");
                this.getNoticeList();
                this.addNoticeModel = false;
              } else {
                if (resCode[res.code]) {
                  this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        }
      });
    },
    //编辑公告
    editNotice(id) {
      //点击编辑请求数据514
      let me = this;
      me.noticeId = id;
      this.$refs["editNoticeForm"].resetFields();
      ApiGetNotice(id).then(function(res) {
        if (res.code == "success") {
          me.editNoticeModel = true;
          me.editNoticeForm.title = res.data.title;
          me.editNoticeForm.content = res.data.content;
          me.initEditEditer();

          me.editNoticeForm.dateStart = moment(res.data.dateStart).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          me.editNoticeForm.dateEnd = moment(res.data.dateEnd).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          me.editNoticeForm.status = String(res.data.status);
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //编辑公告保存
    editNoticeSave(name) {
      let me = this;
      me.$refs[name].validate(valid => {
        if (valid) {
          let flag = true;
          //判断时间
          if (me.editNoticeForm.dateStart && me.editNoticeForm.dateEnd) {
            if (
              moment(me.editNoticeForm.dateEnd).isBefore(
                me.editNoticeForm.dateStart
              )
            ) {
              flag = false;
              me.$Message.error("结束不能在开始时间之后");
            }
          }
          if (flag) {
            let _params = {
              annoId: me.noticeId,
              title: me.editNoticeForm.title,
              content: me.editNoticeForm.content,
              dateEnd: moment(me.editNoticeForm.dateEnd).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              dateStart: moment(me.editNoticeForm.dateStart).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              status: me.editNoticeForm.status,
              content: me.editNoticeForm.content
            };
            ApiPutNotice(qs.stringify(_params)).then(function(res) {
              if (res.code == "success") {
                me.$Message.success("修改成功");
                me.editNoticeModel = false;
                me.getNoticeList();
              } else {
                if (resCode[res.code]) {
                  me.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        }
      });
    },

    /**
     * 发布公告
     * @param { Object } params iview table 组件行数据
     */
    publishNotice(params) {
      let me = this;
      ApiPublishNotice(qs.stringify({ annoId: params.row.annoId })).then(
        function(res) {
          if (res.code == "success") {
            me.$Message.success("公告已发布");
            //取到对应列数据，修改status值
            me.noticeList[params.index].status = true;
          } else {
            if (resCode[res.code]) {
              me.$Message.error(resCode[res.code]);
            }
          }
        }
      );
    },
    /**
     * 关闭公告
     * @param { Object } params iview table 组件行数据
     */
    closeNotice(params) {
      let me = this;
      ApiCloseNotice(qs.stringify({ annoId: params.row.annoId })).then(function(
        res
      ) {
        if (res.code == "success") {
          me.$Message.success("公告已关闭");
          me.noticeList[params.index].status = false;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //删除公告
    deleteNotice(id) {
      let me = this;
      ApiDeleteNotice(id).then(function(res) {
        if (res.code == "success") {
          //如果当前表格数据只有一条，则请求上一页
          if (me.noticeList.length == 1) {
            me.noticeListParams.pageNum =
              me.noticeListParams.pageNum > 1
                ? --me.noticeListParams.pageNum
                : 1;
          }
          me.getNoticeList();
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //获取公告列表
    getNoticeList() {
      let me = this;
      ApiGetNoticeList(me.noticeListParams).then(function(res) {
        if (res.code == "success") {
          me.noticeList = res.data;
          me.pageTotal = res.total;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    seach() {
      this.noticeListParams.pageNum = 1;
      this.getNoticeList();
    },
    pageSizeChange(value) {
      this.noticeListParams.pageSize = value;
      this.getNoticeList();
    },
    pageChange(value) {
      this.noticeListParams.pageNum = value;
      this.getNoticeList();
    },
    reset() {
      //重置为空
      this.noticeListParams.title = "";
      this.noticeListParams.status = "";
      this.noticeListParams.pageNum = 1;
      this.getNoticeList();
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to, from) {
      this.init();
    }
  }
};
</script>
<style  lang='scss'>
@import "../../common/css/mixin";
@import "../../common/css/base";
.notice-wrap {
  .s-select-wrapper {
    @include select-label();
    @include clear-both();
  }
}
.notice-model {
  .ivu-date-picker {
    width: 100%;
  }
  .ivu-date-picker,
  .ivu-select-dropdown {
    z-index: 10008 !important;
  }
}
</style>