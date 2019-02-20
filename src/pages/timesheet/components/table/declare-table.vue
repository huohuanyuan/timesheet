/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:59:47 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-10-22 11:30:58
 * @instructions： 工时填报的表格组件
 */

<template>
  <div class="time-table">
    <Table :columns="mainCol" :data="tsheetTableData" border :row-class-name="rowClassName">
    </Table>
    <split></split>
    <div>
      <Button @click="saveSheet" :loading="saveLoading" type="info">保存</Button>
      <!-- <Button @click="declareSheet" :loading="declareLoading" type="primary" v-if="canSubmit">申报</Button> -->
      <Button @click="confirm" type="primary" v-if="canSubmit">申报</Button>
      <Button @click="closePage">关闭</Button>
    </div>
    <div>
      <Modal v-model="commentModal.show" :title="commentModal.date+'工时登记'" :mask-closable="false" @on-cancel="cancel">
        <Form :label-width="80" :rules="commentRule" ref="comment" :model="comment">
          <Row>
            <Col span="24" v-show="commentModal.studyTitle">
            <FormItem label="项目">
              <span>{{commentModal.studyTitle}}</span>
            </FormItem>
            </Col>
            <Col span="24" v-show="commentModal.taskTitle">
            <FormItem label="任务">
              <span>{{commentModal.taskTitle}}</span>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="工作汇报" prop="workComment">
            <Input v-model="comment.workComment" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          <FormItem label="问题总结" prop="issueComment">
            <Input v-model="comment.issueComment" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" long @click="commentSave('comment')">保存</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import moment from "moment";
import Split from "components/unit/split";
import { getdaysList } from "common/js/tsheetDays";

import { resCode } from "@/api/code";
import {
  ApiPostTsheetSave,
  ApiPutTsheetSave,
  ApiPostTsheetDeclare,
  ApiPutTsheetDeclare
} from "@/api/timesheet/timedeclare-api";
export default {
  components: {
    Split
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    studyList: {
      type: Array,
      default: function() {
        let _obj = {};
        _obj.study = "";
        _obj.task = "";
        _obj.times = {};
        _obj.workComment = {};
        _obj.issueComment = {};
        _obj.flag = "new"; //标志是新建数据，任务列表绘制select框
        let daysList = getdaysList(this.recordStart, this.recordEnd);
        for (let [index, elem] of daysList.entries()) {
          _obj.times[elem] = 0;
        }
        return new Array(_obj);
      }
    },
    taskList: {
      type: Object,
      default: function() {
        return new Object();
      }
    },
    recordStart: {
      type: String,
      default: ""
    },
    recordEnd: {
      type: String,
      default: ""
    },
    declareEnd: {
      type: Number,
      default: 0
    },
    tcycleId: {
      type: Number,
      default: 0
    },
    canSubmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      saveLoading: false, //保存按钮加载中标记
      // declareLoading: false, //申报按钮加载中标记
      tableFooter: {
        isShowHeader: false,
        disabledHover: true
      },
      commentRule: {
        workComment: [
          {
            max: 512,
            message: "工作汇报长度不能超过512位",
            trigger: "blur"
          }
        ],
        issueComment: [
          {
            max: 512,
            message: "问题总结长度不能超过512位",
            trigger: "blur"
          }
        ]
      },
      commentModal: {
        show: false,
        studyTitle: "",
        taskTitle: "",
        date: "",
        index: "" //标志当前的comment是mainData的第几条数据
      },
      mainData: this.tableData, //props tableData保存到本地
      comment: {
        workComment: "",
        issueComment: ""
      }
    };
  },
  methods: {
    // 申报提示框
    confirm() {
      this.$Modal.confirm({
        title: "申报提示",
        content: "<p> 是否确认申报？ </p>",
        onOk: () => {
          this.declareSheet();
        }
      });
    },
    // 清楚 input
    cancel() {
      this.$refs["comment"].resetFields();
    },
    addRow: function(params) {
      let index = params.index;
      if (!params.row.study || !params.row.task) {
        //当前行已经选择了工时和任务后才允许添加新的一行
        this.$Message.warning("请选择当前行的项目和任务");
      } else {
        if (params.row.flag == "new") {
          let studyId = params.row.study;
          let taskList = this.taskList[studyId];
          params.row.flag = "modify";
          this.mainData[index].flag = "modify";
          for (let [index, elem] of taskList.entries()) {
            if (params.row.task == elem.projTaskId) {
              taskList.splice(index, 1);
            }
          }
        }
        this.$Message.destroy();
        let times = {};
        for (let i = 0; i < this.daysList.length; i++) {
          times[this.daysList[i]] = 0;
        }
        this.mainData.push({
          study: "",
          task: "",
          times: times,
          flag: "new",
          workComment: {},
          issueComment: {}
        });
      }
    },
    deleteRow: function(params) {
      if (params.row.flag == "modify") {
        let studyId = params.row.study;
        let taskId = params.row.task;
        let taskName = params.row.taskName;
        if (this.taskList[studyId]) {
          this.taskList[studyId].push({
            projTaskId: taskId,
            projectId: studyId,
            taskName: taskName
          });
        } else {
          this.taskList[studyId] = [];
          this.taskList[studyId].push({
            projTaskId: taskId,
            projectId: studyId,
            taskName: taskName
          });
        }
      }
      this.mainData.splice(params.index, 1);
    },
    showCommentModal: function(params) {
      this.commentModal.show = true;
      let index = params.index;
      let date = params.column.key;
      let _work = this.mainData[index].workComment
        ? this.mainData[index].workComment[date]
        : "";
      let _issue = this.mainData[index].issueComment
        ? this.mainData[index].issueComment[date]
        : "";
      this.comment.workComment = _work ? _work : "";
      this.comment.issueComment = _issue ? _issue : "";
    },
    commentSave: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let index = this.commentModal.index;
          let date = this.commentModal.date;
          let _work = {};
          let _issue = {};
          this.$set(
            this.mainData[index].workComment,
            date,
            this.comment.workComment
          );
          this.$set(
            this.mainData[index].issueComment,
            date,
            this.comment.issueComment
          );
          this.commentModal.show = false;
        }
      });
    },
    //整理提交数据
    createSubmitData: function() {
      let me = this;
      let data = {};
      if (me.type == "newSheet") {
        data.tcycleId = me.tcycleId;
        data.declareEnd = me.declareEnd;
      }
      data.tsheetDailyList = [];
      for (let [index, elem] of me.mainData.entries()) {
        if (elem.task) {
          for (let [key, day] of me.daysList.entries()) {
            let _obj = {};
            //工时不为0，或者备注信息不为空时保存数据  
            if (
              (elem.times[day] && elem.times[day] != 0) ||
              (elem.workComment[day] && elem.workComment[day] != "") ||
              (elem.workComment[day] && elem.issueComment[day] != "")
            ) {
              _obj.tsheetDate = day;
              _obj.workHours = elem.times[day] ? elem.times[day] : 0;
              _obj.workComment = elem.workComment[day]
                ? elem.workComment[day]
                : "";
              _obj.issueComment = elem.issueComment[day]
                ? elem.issueComment[day]
                : "";
              _obj.projectId = elem.study;
              _obj.projTaskId = elem.task;
              if (elem.tsheetDailyId) {
                _obj.tsheetDailyId = elem.tsheetDailyId[day]
                  ? elem.tsheetDailyId[day]
                  : "";
              }
              if (me.type == "modifySheet") {
                let formId = me.$store.state.timeSheet.tsheetView.form.formId;
                _obj.formId = formId;
              }
              data.tsheetDailyList.push(_obj);
            } else {
              continue;
            }
          }
        }
      }
      return data;
    },
    //保存工时信息
    saveSheet: function() {
      let me = this;
      if (!this.mainData[0].task) {
        this.$Message.error("未选择任务");
      } else {
        let data = this.createSubmitData();
        if (data.tsheetDailyList.length == 0) {
          this.$Message.error("工时信息为空，请填写后保存");
        } else {
          switch (this.type) {
            case "newSheet": //新建
              me.saveLoading = true;
              ApiPostTsheetSave(data).then(function(res) {
                me.saveLoading = false;
                if (res.code == "success") {
                  me.$Message.success("保存成功");
                  me.$store.commit("showRegWrap", "regRecord");
                  me.$store.commit("getTsheetList");
                } else {
                  if (resCode[res.code]) {
                    me.$Message.error(resCode[res.code]);
                  }
                }
              });
              break;
            case "modifySheet": //修改
              ApiPutTsheetSave(data.tsheetDailyList).then(function(res) {
                if (res.code == "success") {
                  me.$Message.success("保存成功");
                  me.$store.commit("showRegWrap", "regRecord");
                  //获取请求参数，请求列表
                  let _params = me.$store.state.timeSheet.declareListParams;
                  me.$store.commit("getTsheetList", _params);
                } else {
                  if (resCode[res.code]) {
                    me.$Message.error(resCode[res.code]);
                  }
                }
              });
          }
        }
      }
    },
    //申报工时信息
    declareSheet: function() {
      let me = this;
      if (!this.mainData[0].task) {
        this.$Message.error("未选择任务");
      } else {
        let data = this.createSubmitData();
        if (data.tsheetDailyList.length == 0) {
          this.$Message.error("工时信息为空，请填写后申报");
        } else {
          switch (this.type) {
            case "newSheet": //新建
              ApiPostTsheetDeclare(data).then(function(res) {
                if (res.code == "success") {
                  me.$Message.success("申报成功");
                  me.$store.commit("showRegWrap", "regRecord");
                  me.$store.commit("getTsheetList");
                } else {
                  if (resCode[res.code]) {
                    me.$Message.error(resCode[res.code]);
                  }
                }
              });
              break;
            case "modifySheet": //修改
              ApiPutTsheetDeclare(data.tsheetDailyList).then(function(res) {
                if (res.code == "success") {
                  me.$Message.success("申报成功");
                  me.$store.commit("showRegWrap", "regRecord");
                  me.$store.commit("getTsheetList");
                } else if (res.code == "lock_tsheet") {
                  me.$Message.error("工单已锁定!");
                  me.$store.commit("showRegWrap", "regRecord");
                  me.$store.commit("getTsheetList");
                } else {
                  if (resCode[res.code]) {
                    me.$Message.error(resCode[res.code]);
                  }
                }
              });
          }
        }
      }
    },
    rowClassName(row, index) {
      if (row.flag == "total") {
        return "total-row";
      } else if (row.flag == "validTime") {
        return "valid-time-row";
      }
      return "";
    },
    //关闭
    closePage() {
      this.$store.commit("showRegWrap", "regRecord");
    }
  },
  watch: {
    $route(to, from) {},
    tableData: {
      //监听父组件传回的tableData,并保存到mainData
      handler(curVal, oldVal) {
        this.mainData = curVal;
      },
      deep: true
    },

    footerData: {
      handler(curVal, oldVal) {},
      deep: true
    }
  },
  computed: {
    // table 列
    mainCol: function(params) {
      const studySelect = (vm, h, params) => {
        return h(
          "Select",
          {
            props: {
              size: "small",
              value: params.row.study,
              "label-in-value": true
            },
            style: {
              width: "100px"
            },

            on: {
              "on-change": function(v) {
                vm.mainData[params.index].study = v.value;
                vm.mainData[params.index].projContName = v.label;
              }
            }
          },
          [
            (function(vm) {
              let options = [];
              for (let i = 0; i < vm.studyList.length; i++) {
                options.push(
                  h(
                    "Option",
                    {
                      props: {
                        value: vm.studyList[i].projectId
                      }
                    },
                    vm.studyList[i].projContName
                  )
                );
              }
              return options;
            })(vm)
          ]
        );
      };
      const taskSelect = (vm, h, params) => {
        return h(
          "Select",
          {
            props: {
              size: "small",
              value: params.row.task,
              "label-in-value": true
            },
            style: {
              width: "100px"
            },
            on: {
              "on-change": function(v) {
                vm.mainData[params.index].task = v.value;
                vm.mainData[params.index].taskName = v.label;
              }
            }
          },
          [
            (function(vm, params) {
              let options = [];

              let studyId = params.row.study;
              if (studyId) {
                let taskList = vm.taskList[studyId];

                for (let i = 0; i < taskList.length; i++) {
                  options.push(
                    h(
                      "Option",
                      {
                        props: {
                          value: taskList[i].projTaskId
                        }
                      },
                      taskList[i].taskName
                    )
                  );
                }
              }

              return options;
            })(vm, params)
          ]
        );
      };
      //绘制填写工时区域表头
      let arr = []; //输入框render数组
      let timeTitle = this.daysList; //工时区域表头数组
      for (let k = 0, len = timeTitle.length; k < len; k++) {
        arr.push({
          renderHeader: (h, params) => {
            return h("div", [
              h("p", `${moment(timeTitle[k]).format("YYYY-MM-DD")}`),
              h(
                "p",
                {
                  style: {
                    "font-weight": "normal"
                  }
                },
                moment(timeTitle[k])
                  .locale("zh-cn")
                  .format("dddd")
              )
            ]);
          },
          key: timeTitle[k],
          align: "center",
          width: 100,
          render: (h, params) => {
            if (params.row.flag == "total") {
              if (params.row.times[timeTitle[k]]) {
                return h("div", params.row.times[timeTitle[k]].toFixed(2));
              } else {
                return h("div", 0);
              }
            } else if (params.row.flag == "validTime") {
              return h("div", params.row.times[timeTitle[k]]);
            } else {
              return h(
                "div",
                {
                  class: "td-cell",
                  on: {
                    click: function() {}
                  }
                },
                [
                  h("input", {
                    style: {
                      width: "50px",
                      "text-align": "center",
                      border: "1px solid #dddee1",
                      "border-radius": "4px",
                      height: "24px"
                    },
                    attrs: {
                      value: (function() {
                        return params.row.times[timeTitle[k]]
                          ? params.row.times[timeTitle[k]]
                          : 0;
                      })(params)
                    },
                    on: {
                      change: event => {
                        event.stopPropagation();
                        if (!event.target.value) {
                          event.target.value = 0;
                        } else {
                          event.target.value = Number(event.target.value);
                        }
                        //保存input输入的值
                        let key = params.column.key;
                        params.row.times[key] = Number(event.target.value);
                        let _data = this.mainData; //table的数据
                        _data[params.index].times[key] = Number(
                          event.target.value
                        );
                        this.footerData[0].times[key] = 0;
                        for (let i = 0, len = _data.length; i < len; i++) {
                          this.footerData[0].times[key] = Number(
                            this.footerData[0].times[key]
                          )
                            ? Number(this.footerData[0].times[key])
                            : 0;
                          this.footerData[0].times[key] += Number(
                            _data[i].times[key]
                          );
                        }
                      },
                      keyup: function(event) {
                        //清除"数字"和"."以外的字符
                        event.target.value = event.target.value.replace(
                          /[^\d.]/g,
                          ""
                        );
                        //验证第一个字符是数字而不是.
                        event.target.value = event.target.value.replace(
                          /^\./g,
                          ""
                        );
                        //只保留第一个. 清除多余的.
                        event.target.value = event.target.value.replace(
                          /\.{2,}/g,
                          ".",
                          "."
                        );
                        event.target.value = event.target.value
                          .replace(".", "$#$")
                          .replace(/\./g, "")
                          .replace("$#$", ".");
                        //只能输入两个小数
                        event.target.value = event.target.value.replace(
                          /^(\-)*(\d+)\.(\d\d).*$/,
                          "$1$2.$3"
                        );
                        if (event.target.value < 0) {
                          event.target.value = 0;
                        } else if (event.target.value > 24) {
                          event.target.value = 24;
                        }
                      },
                      click: function(event) {
                        event.stopPropagation();
                      }
                    }
                  }),
                  h(
                    "span",
                    {
                      on: {
                        click: () => {
                          this.commentModal.studyTitle =
                            params.row.projContName;
                          this.commentModal.taskTitle = params.row.taskName;
                          this.commentModal.date = params.column.key;
                          this.commentModal.index = params.index;
                          this.showCommentModal(params);
                        }
                      }
                    },
                    [
                      h("Icon", {
                        props: {
                          type: "clipboard",
                          size: 15,
                          color: (function(params) {
                            let _work = "";
                            let _issue = "";
                            if (params.row.workComment) {
                              _work = params.row.workComment;
                            }
                            if (params.row.issueComment) {
                              _issue = params.row.issueComment;
                            }
                            let date = params.column.key;
                            if (
                              (_work && _work[date]) ||
                              (_issue && _issue[date])
                            ) {
                              //如果填写了工作汇报或者问题总结
                              return "#19be6b";
                            } else {
                              return "";
                            }
                          })(params)
                        },
                        style: {
                          margin: "10px",
                          cursor: "pointer"
                        }
                      })
                    ]
                  )
                ]
              );
            }
          }
        });
      }
      return [
        {
          title: "序号",
          align: "center",
          width: 80,
          render: (h, params) => {
            if (params.row.flag == "total" || params.row.flag == "validTime") {
              return "";
            } else {
              return h("div", params.index + 1);
            }
          }
        },
        {
          title: " ",
          align: "left",
          key: "operate",
          width: 110,
          render: (h, params) => {
            if (params.row.flag == "total" || params.row.flag == "validTime") {
              return "";
            } else {
              return h("div", {}, [
                (function(vm) {
                  //第一行不需要有减号按钮'
                  //mainData长度大于1时可以有减号按钮
                  if (params.index != 0 || vm.mainData.length != 1) {
                    return h("Icon", {
                      props: {
                        type: "minus-circled",
                        size: 18
                      },
                      style: {
                        margin: "10px",
                        cursor: "pointer"
                      },
                      on: {
                        click: event => {
                          event.stopPropagation();
                          vm.deleteRow(params);
                        }
                      }
                    });
                  }
                })(this),
                (function(vm) {
                  if (params.index == vm.mainData.length - 1) {
                    return h("Icon", {
                      props: {
                        type: "plus-circled",
                        size: 18
                      },
                      style: {
                        margin: "10px",
                        cursor: "pointer"
                      },
                      on: {
                        click: event => {
                          event.stopPropagation();
                          vm.addRow(params);
                        }
                      }
                    });
                  }
                })(this)
              ]);
            }
          }
        },
        {
          title: "项目",
          width: 120,
          align: "center",
          key: "study",
          render: (h, params) => {
            if (params.row.flag == "total") {
              return h("div", "合计");
            } else if (params.row.flag == "validTime") {
              return h("div", "有效工时");
            } else {
              if (params.row.flag == "new") {
                //新建时绘制select框
                return h("div", [studySelect(this, h, params)]);
              } else if (params.row.flag == "modify") {
                return h("span", {}, params.row.projContName);
              }
            }
          }
        },
        {
          title: "任务",
          width: 120,
          align: "center",
          key: "task",
          render: (h, params) => {
            if (params.row.flag == "total" || params.row.flag == "validTime") {
              return "";
            } else {
              if (params.row.flag == "new") {
                //新建时绘制select框
                return h("div", [taskSelect(this, h, params)]);
              } else if (params.row.flag == "modify") {
                return h("span", {}, params.row.taskName);
              }
            }
          }
        },
        ...arr,
        {
          title: "合计",
          align: "center",
          key: "total",
          width: 80,
          render: (h, params) => {
            if (params.row.flag != "validTime") {
              //获取每个日期对应的值，保存到数组中
              let arr = Object.values(params.row.times);
              if (arr.length > 0) {
                return h("strong", {}, eval(arr.join("+")).toFixed(2));
              } else {
                return h("strong", {}, 0);
              }
            } else {
              return "";
            }
          }
        }
      ];
    },
    staffVaildTime: function() {
      //个人有效工时，展示用，不做和计算
      return this.$store.state.timeSheet.staffVaildTime;
    },
    footerData: function() {
      let cols = [
        {
          operate: "合计",
          study: "",
          task: "",
          times: {},
          total: 0,
          flag: "total" //标记合计行
        }
      ];
      //列合计
      let _data = this.mainData; //table的数据

      for (let i = 0, len = _data.length; i < len; i++) {
        for (let k in _data[i].times) {
          cols[0].times[k] = cols[0].times[k] ? cols[0].times[k] : 0;
          cols[0].times[k] += _data[i].times[k];
        }
      }

      return cols;
    },
    daysList: function() {
      return getdaysList(this.recordStart, this.recordEnd);
    },
    tsheetTableData: function() {
      let arr = [...this.mainData, ...this.footerData, ...this.staffVaildTime];
      return arr;
    }
  }
};
</script>
<style lang="scss">
@import "../../../../common/css/variable";
.time-table {
  .total-row {
    td {
      background-color: #f8f8f9;
    }
  }
  .valid-time-row {
    td {
      background-color: #fff;
      font-weight: bold;
      color: #24262b;
    }
  }
  .ivu-table {
    .ivu-table-tbody {
      .ivu-table-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .td-cell {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ivu-select {
          &.error {
            .ivu-select-selection {
              border: 1px solid $error-color;
            }
          }
          .ivu-select-dropdown {
            width: auto !important;
            left: auto !important;
            .ivu-select-item {
              text-align: left !important;
            }
          }
        }
      }
    }
    .ivu-input-number {
      width: 50px;
      .ivu-input-number-handler-wrap {
        display: none;
      }
    }
  }
  .table-wrap {
    overflow-x: auto;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
}
</style>