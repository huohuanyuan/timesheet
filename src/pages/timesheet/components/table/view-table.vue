/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:59:58 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-11 14:04:11
 * @instructions： 工时申报单查看的table组件
 */

<template>
  <div>
    <Table class="tsheet-view" :columns="tsheetCol" :data="tableData" :row-class-name="rowClassName" border :disabled-hover="disabledHover">

    </Table>
    <Modal class="comment-modal" v-model="commentModal.show" :title="commentModal.date+'工时登记'">
      <Form :label-width="80">
        <Row>
          <Col span="24">
          <FormItem label="项目">
            <span>{{commentModal.studyTitle}}</span>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="任务">
            <span>{{commentModal.taskTitle}}</span>
          </FormItem>
          </Col>
        </Row>
        <FormItem label="工作汇报" v-show="commentModal.workComment">
          <span>{{commentModal.workComment}}</span>
        </FormItem>
        <FormItem label="问题总结" v-show="commentModal.issueComment">
          <span>{{commentModal.issueComment}}</span>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button @click="commentModal.show=false">关闭</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { getdaysList, exportTabelData } from "common/js/tsheetDays";
import moment from "moment";
import Split from "components/unit/split";
import qs from "qs";
export default {
  components: {
    Split
  },
  props: {
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    recordStart: {
      type: String,
      default: ""
    },
    recordEnd: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      disabledHover: true,
      commentModal: {
        show: false,
        studyTitle: "",
        taskTitle: "",
        workComment: "",
        issueComment: ""
      }
    };
  },
  methods: {
    rowClassName(row, index) {    
      if (row.isTotal) {
        return "total-row";
      }
      return "";
    }
  },
  computed: {
    tsheetCol() {
      let start = this.recordStart;
      let end = this.recordEnd;
      let days = getdaysList(start, end);
      let daysArr = [];
      for (let [index, elem] of days.entries()) {
        daysArr.push({
          key: elem,
          minWidth: 80,
          renderHeader: (h, params) => {
            return h("div", [
              h("p", `${moment(elem).format("YYYY-MM-DD")}`),
              h(
                "p",
                {
                  style: {
                    "font-weight": "normal"
                  }
                },
                moment(elem)
                  .locale("zh-cn")
                  .format("dddd")
              )
            ]);
          },

          align: "center",
          render: (h, params) => {
            if (!params.row.isTotal) {
              //不是最后的合计行
              if (
                params.row.workComment[elem] ||
                params.row.issueComment[elem]
              ) {
                //有备注信息
                return h(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "center"
                    },
                    on: {
                      click: () => {
                        this.commentModal.show = true;
                        let key = params.column.key;
                        this.commentModal.date = key;
                        this.commentModal.studyTitle = params.row.projContName;
                        this.commentModal.taskTitle = params.row.taskName;
                        this.commentModal.issueComment =
                          params.row.issueComment[key];
                        this.commentModal.workComment =
                          params.row.workComment[key];
                      }
                    }
                  },
                  params.row.times[elem] ? params.row.times[elem] : 0
                );
              } else {
                //没有备注信息
                return h(
                  "span",
                  params.row.times[elem] ? params.row.times[elem] : 0
                );
              }
            } else {
              //最后的合计行
              return h(
                "span",
                params.row.times[elem] ? params.row.times[elem].toFixed(2) : 0
              );
            }
          }
        });
      }
      return [
        {
          title: "序号",
          align: "center",
          key: "index",
          width: 60,
          fixed: "left",
          render: (h, params) => {
            if (params.row.isTotal) {
              return h("div", {}, "");
            } else {
              return h("div", params.index + 1);
            }
          }
        },
        {
          title: "项目",
          key: "projContName",
          width: 150,
          align: "center",
          fixed: "left",
          render: (h, params) => {
            if (!params.row.isTotal) {
              return h(
                "Tooltip",
                {
                  props: {
                    type: "text",
                    className: "tooltip-hover"
                  }
                },
                [
                  h(
                    "p",
                    {
                      style: {
                        width: "110px",
                        "text-overflow": "ellipsis",
                        "white-space": "nowrap",
                        overflow: "hidden"
                      }
                    },
                    params.row.projContName
                  ),
                  h(
                    "div",
                    {
                      slot: "content",
                      style: {
                        "white-space": "normal",
                        width: "120px"
                      }
                    },
                    params.row.projContName
                  )
                ]
              );
            } else {
              return h("div", {}, "");
            }
          }
        },
        {
          title: "任务",
          key: "taskName",
          width: 150,
          fixed: "left",
          align: "center",
          render: (h, params) => {
            if (!params.row.isTotal) {
              return h(
                "Tooltip",
                {
                  props: {
                    type: "text",
                    className: "tooltip-hover"
                  }
                },
                [
                  h(
                    "p",
                    {
                      style: {
                        width: "110px",
                        "text-overflow": "ellipsis",
                        "white-space": "nowrap",
                        overflow: "hidden"
                      }
                    },
                    params.row.taskName
                  ),
                  h(
                    "div",
                    {
                      slot: "content",
                      style: {
                        "white-space": "normal",
                        width: "120px"
                      }
                    },
                    params.row.taskName
                  )
                ]
              );
            } else {
              return h("div", {}, params.row.taskName);
            }
          }
        },
        ...daysArr,
        {
          title: "合计",
          key: "total",
          width: 70,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            //获取每个日期对应的值，保存到数组中
            let arr = Object.values(params.row.times);
            return h("strong", {}, eval(arr.join("+")).toFixed(2));
          }
        }
      ];
    }
  }
};
</script>
<style lang="scss">
@import "../../../../common/css/variable";
.tsheet-view {
  .total-row {
    td {
      background-color: #f8f8f9;
    }
  }
  tbody {
    td {
      &.comment {
        position: relative;
        &:hover {
          background-color: #ebf7ff;
        }
        &:before {
          position: absolute;
          top: 0;
          right: 0;
          content: "";
          display: inline-block;
          width: 10px;
          height: 10px;
          border-width: 5px;
          border-style: solid;
          border-color: brown brown transparent transparent;
        }
      }
    }
  }
}
.comment-modal {
  .ivu-form-item {
    margin-bottom: 0;
  }
}
</style>