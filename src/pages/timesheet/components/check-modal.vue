/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:58:43 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-31 16:06:20
 * @instructions： 工时申报单审核组件
 */

<template>

  <div>
    <Row>
      <Col :lg="18" :md="16" :sm="24">
      <Row>
        <Col :lg="8" :md="8" :sm="12">工时单号:{{tsheetForm.formCode}}</Col>
        <Col :lg="4" :md="4" :sm="12" v-show="tsheetForm.staffName">申报人：{{tsheetForm.staffName}}</Col>
        <Col :lg="6" :md="6" :sm="12">申报周期：{{tsheetForm.recordStart}}----{{tsheetForm.recordEnd}}</Col>
        <Col :lg="6" :md="6" :sm="12" v-show="tsheetForm.declareDate">填报时间：{{tsheetForm.declareDate}}</Col>
      </Row>
      </Col>
      <Col :lg="6" :md="8" :sm="24">
      <Button size="small" type="primary" @click="showOpinion">项目经理意见</Button>
      <Button size="small" type="primary" @click="viewFormInfo">查看所有审批单</Button>
      </Col>
    </Row>
    <split></split>
    <view-table :table-data="tableData" :recordStart="tsheetForm.recordStart" :recordEnd="tsheetForm.recordEnd"></view-table>
    <split></split>
    <Card>
      <p slot="title">
        审核
      </p>

      <div>
        <Form :rules="signRule" :model="signForm" ref="signForm" :label-width="80">
          <!-- 需要电子签名 -->
          <div v-if="isElectSignature">
            <Row>
              <Col :lg="6" :md="8" :sm="12" :xs="24">
              <FormItem label="账号">
                <span>{{account}}</span>
              </FormItem>
              </Col>
              <Col :lg="6" :md="8" :sm="12" :xs="24">
              <FormItem label="密码" prop="signPwd">
                <Input type="password" v-model="signForm.signPwd"></Input>
              </FormItem>
              </Col>
            </Row>
            <FormItem prop="sign">
              <CheckboxGroup v-model="signForm.sign">
                <Checkbox value="checked">
                  我理解此文档的电子签署意味着我已阅读、同意并批准本文档的内容，以及电子签名与签字者手写签名具有同等的法律效力。
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </div>
          <!-- 不需要电子签名 -->

          <FormItem label="备注">
            <Input type="textarea" v-model="signForm.comment"></Input>
          </FormItem>

          <FormItem>
            <Button @click="checkConfirm(true)" :loading="passLoading" type="info">批准</Button>
            <Button @click="checkConfirm(false)" :loading="refuseLoading" type="warning">拒绝</Button>
            <Button @click="closePage">关闭</Button>
          </FormItem>
        </Form>
      </div>
    </Card>

  </div>
</template>
<script>
import { exportTabelData } from "common/js/tsheetDays";
import { ApiPostTsheetApproval } from "@/api/timesheet/timecheck-api";
import moment from "moment";
import Split from "components/unit/split";
import ViewTable from "./table/view-table";
import { resCode } from "@/api/code";
import md5 from "js-md5";
export default {
  components: {
    ViewTable,
    Split
  },
  data() {
    return {
      passLoading: false, //通过按钮加载中标记
      refuseLoading: false, //拒绝按钮加载中标记
      signRule: {
        signPwd: [
          {
            required: true,
            message: "请输入密码进行数字签名",
            trigger: "blur"
          }
        ],
        sign: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请确认进行电子签名",
            trigger: "change"
          }
        ]
      },
      signForm: {
        //数字签名
        signPwd: "",
        sign: [],
        comment: ""
      },
      apvResult: false // apvResult:true 审核通过，false 审核拒绝
    };
  },
  methods: {
    checkConfirm(val) {
      this.apvResult = val;
      let _str = this.apvResult ? "批准" : "拒绝";
      this.$Modal.confirm({
        title: "提示",
        content: `您确定要${_str}这条数据吗?`,
        onOk: () => {
          this.checkSave();
        },
        onCancel: () => {}
      });
    },
    checkSave() {
      // apvResult:true 审核通过，false 审核拒绝
      let flag = true;
      //需要进行电子签名 并且 审核通过 时 需要进行表单验证
      if (this.isElectSignature && this.apvResult) {
        this.$refs["signForm"].validate(valid => {
          if (!valid) {
            flag = false;
          }
        });
      }
      if (flag) {
        let me = this;
        let data = {};
        data.formId = this.tsheetForm.formId;
        data.staffId = this.tsheetForm.staffId;
        data.apvResult = this.apvResult;
        data.elcSignature = this.isElectSignature;
        data.apvComment = this.signForm.comment;
        if (this.isElectSignature && apvResult) {
          //审核通过，传密码
          data.password = md5(this.signForm.signPwd);
        }
        if (this.apvResult) {
          this.passLoading = true;
        } else {
          this.refuseLoading = true;
        }
        ApiPostTsheetApproval(data).then(res => {
          if (this.apvResult) {
            this.passLoading = false;
          } else {
            this.refuseLoading = false;
          }
          if (res.code == "success") {
            //请求工单列表
            let _params = this.$store.state.timeSheet.checkListParams;
            this.$store.commit("getTimeCheckList", _params);
            this.$store.commit("showCheckWrap", "checkRecord");
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    //关闭
    closePage() {
      this.$store.commit("showCheckWrap", "checkRecord");
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.signForm.signPwd = "";
      this.signForm.sign = [];
      this.signForm.comment = "";
    },
    viewFormInfo() {
      this.$emit("viewFormInfo", {
        tcycleId: this.tsheetForm.tcycleId,
        staffId: this.tsheetForm.staffId,
        perPage: "checkModal"
      });
    },
    showOpinion() {
      this.$emit("showOpinion", {
        formId: this.tsheetForm.formId,
        perPage: "checkModal"
      });
    }
  },
  watch: {
    isHandleReset: {
      handler(curVal, oldVal) {
        this.handleReset("signForm");
      },
      deep: true
    }
  },
  computed: {
    tsheetForm() {
      let obj = {};
      let datas = this.$store.state.timeSheet.tsheetView.form;
      obj.formId = datas.formId;
      obj.formCode = datas.formCode;
      obj.approverName = datas.approverName;
      obj.recordStart = moment(datas.recordStart).format("YYYY-MM-DD");
      obj.recordEnd = moment(datas.recordEnd).format("YYYY-MM-DD");
      obj.declareDate = datas.declareDate
        ? moment(datas.declareDate).format("YYYY-MM-DD hh:mm:ss")
        : "";
      obj.declareEnd = datas.declareEnd
        ? moment(datas.declareEnd).format("YYYY-MM-DD")
        : "";
      obj.staffName = datas.staffName;
      obj.statusName = datas.statusName;
      obj.staffId = datas.staffId;
      obj.tcycleId = datas.tcycleId;
      return obj;
    },
    isElectSignature() {
      //是否电子签名：1代表true；0代表false
      return this.$store.state.timeSheet.tsheetView.form.isElectSignature == "1"
        ? true
        : false;
    },
    tableDailies() {
      return this.$store.state.timeSheet.tsheetView.dailies;
    },
    sheetTotal() {
      //一个申报周期的所有工单总计数据
      return this.$store.state.timeSheet.tsheetView.total;
    },
    tableData() {
      let mainData = exportTabelData(this.tableDailies);
      if (mainData.length > 0) {
        //列合计
        let arr = [];
        let cols = {
          projectShortName: "",
          taskName: "小计",
          isTotal: true,
          times: {},
          total: 0
        };
        for (let i = 0, len = mainData.length; i < len; i++) {
          for (let k in mainData[i].times) {
            cols.times[k] = cols.times[k] ? cols.times[k] : 0;
            cols.times[k] += mainData[i].times[k];
          }
        }
        mainData.push(cols);

        //工单总合计
        if (this.sheetTotal) {
          let _total = {
            projectShortName: "",
            taskName: "已申报工时合计",
            isTotal: true,
            times: this.sheetTotal,
            total: 0
          };
          mainData.push(_total);
        }
      }
      return mainData;
    },
    account() {
      return localStorage.getItem("email");
    },
    isHandleReset() {
      return this.$store.state.timeSheet.isHandleReset;
    }
  },
  filters: {
    resultFilter(val) {
      return val ? "批准" : "拒绝";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
