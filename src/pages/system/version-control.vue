/*
 * @Author: liuhaosheng 
 * @Date: 2018-09-12 11:07:33 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-09-12 17:07:41
 * 控制 安卓和ios 版本页面
 */
<template>
    <div>
        <Table stripe :columns="columns" :data="data"></Table>

        <Modal v-model="versionModal" title="修改版本信息" :mask-closable="false" :width="800">
            <Form ref="versionEdit" :model="versionEdit" :rules="versionEditInline" :label-width="80">
                <Row :gutter="16">
                    <Col span="24">
                    <FormItem label="移动端名称">
                        <Input v-model.trim="versionEdit.sysType" disabled></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem prop="ctrlVer" label="控制版本">
                        <Input v-model.trim="versionEdit.ctrlVer"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem prop="currentVer" label="当前版本">
                        <Input v-model.trim="versionEdit.currentVer"></Input>
                    </FormItem>
                    </Col>
                    </Col>
                    <Col span="24">
                    <FormItem prop="downloadUrl" label="下载地址">
                        <Input v-model.trim="versionEdit.downloadUrl"></Input>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem label="是否模板" prop="status">
                        <RadioGroup v-model="versionEdit.status">
                            <Radio label="true"> 可用 </Radio>
                            <Radio label="false"> 关闭 </Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem prop="verDesc" label="升级内容">
                        <div ref="editor" style="text-align:left">
                        </div>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button @click="putAppVersion('versionEdit')" type="primary" long> 保存 </Button>
            </div>
        </Modal>
    </div>
</template>


<script>
import { resCode } from "@/api/code";
import {
  ApiGetAppVersion,
  ApiGetAppVersionCon,
  ApiPutAppVersion
} from "@/api/system/version-api";
import E from "wangeditor";
import qs from "qs";

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
          vm.getAppVersionCon(params.row.appVerId);
        }
      }
    },
    "编辑"
  );
};
export default {
  data() {
    return {
      versionModal: false,
      versionEdit: {
        sysType: "",
        verDesc: "",
        ctrlVer: "",
        currentVer: "",
        downloadUrl: "",
        status: ""
      },
      versionEditInline: {
        downloadUrl: [{ required: true, message: " ", trigger: "blur" }],
        ctrlVer: [{ required: true, message: " ", trigger: "blur" }],
        currentVer: [{ required: true, message: " ", trigger: "blur" }],
        status: [{ required: true, message: " ", trigger: "change" }]
      },
      columns: [
        {
          title: "序号",
          width: 60,
          align: "center",
          type: "index"
        },
        {
          title: "客户端名称",
          key: "sysType",
          align: "center"
        },
        {
          title: "内容",
          key: "verDesc",
          align: "center",
          render: (h, params) => {
            return h("div", {
              domProps: {
                innerHTML: params.row.verDesc
              }
            });
          }
        },
        {
          title: "控制版本",
          key: "ctrlVer",
          align: "center"
        },
        {
          title: "当前版本",
          key: "currentVer",
          align: "center"
        },
        {
          title: "下载地址",
          key: "downloadUrl",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              (function(vm) {
                return editButton(vm, h, params);
              })(this)
            ]);
          }
        }
      ],
      data: []
    };
  },
  methods: {
    initEditer() {
      //富文本编辑器初始化
      let editor = new E(this.$refs.editor);
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
        //   "emoticon", // 表情
        //   "image", // 插入图片
        //   "table", // 表格
        //   "video", // 插入视频
        //   "code", // 插入代码
        //   "undo", // 撤销
        //   "redo" // 重复
      ];
      editor.customConfig.onchange = html => {
        this.versionEdit.verDesc = html;
      };
      editor.create();
      editor.txt.html(this.versionEdit.verDesc);
    },
    getAppVersion() {
      ApiGetAppVersion().then(res => {
        if (res.code == "success") {
          this.data = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取详情
    getAppVersionCon(appVerId) {
      this.versionModal = true;

      ApiGetAppVersionCon(appVerId).then(res => {
        if (res.code == "success") {
          this.versionEdit = res.data;
          this.initEditer();

          if (this.versionEdit.status) {
            this.versionEdit.status = "true";
          } else {
            this.versionEdit.status = "false";
          }
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 修改保存提交
    putAppVersion(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPutAppVersion(qs.stringify(this.versionEdit)).then(res => {
            if (res.code == "success") {
              this.$Message.success("修改成功");
              this.versionModal = false;
              this.getAppVersion();
            } else {
              if (resCode[res.code]) {
                this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    }
  },
  mounted() {
    this.getAppVersion();
  }
};
</script>

<style>
</style>

