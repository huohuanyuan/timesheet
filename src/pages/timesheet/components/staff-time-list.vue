/*
 * @Author: chengshanshan 
 * @Date: 2019-01-22 14:05:25 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-13 10:26:57
 * @instruction:员工工时列表
 */

  <template>
  <Row>
    <Col :md="6" :sm="8" :lg="4">
    <Tree :data="departmentTree" @on-select-change="depSelect"></Tree>
    <split></split>
    </Col>
    <Col :md="18" :sm="16" :lg="20">
    <Row type="flex" :gutter="16" align="top">
      <Col :md='6' :sm='12'>
      <Input v-model="tsheetListParams.staffName">
      <span slot="prepend">申报人</span>
      </Input>
      <split></split>
      </Col>
      <Col :md='6' :sm='12'>
      <div class="s-input-wrapper">
        <label>
          周期开始时间
        </label>
        <DatePicker :clearable="false" type="date" v-model="tsheetListParams.recordStart"></DatePicker>
      </div>
      <split></split>
      </Col>
      <Col :md='6' :sm='12'>
      <div class="s-input-wrapper">
        <label>
          周期结束时间
        </label>
        <DatePicker :clearable="false" type="date" v-model="tsheetListParams.recordEnd"></DatePicker>
      </div>
      <split></split>
      </Col>
      <Col :md='6' :sm='12'>
      <div>
        <Button type="info" @click="seach">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
      <split></split>
      </Col>
    </Row>
    <Table :columns="listCol" :data="tableData"></Table>
    <div class="page">
      <Page :total="listTotal" size="small" :current="tsheetListParams.pageNum" :page-size="tsheetListParams.pageSize" :page-size-opts="[10,20,30,50]" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
      </Page>
    </div>

    </Col>

  </Row>
</template>
<script>
import Split from "components/unit/split";
import moment from "moment";
import qs from "qs";
import { resCode } from "@/api/code";
import { ApiGetDepartmentTree } from "@/api/competence/department-api";
import { ApiGetStaffTimeList } from "@/api/timesheet/staff-time-api";
export default {
  components: {
    Split
  },
  data() {
    return {
      departmentTree: [],
      // 检索表格的参数
      tsheetListParams: {
        staffName: "",     
        deptId: "",
        recordStart: moment(moment().subtract(1, "months")).format(
          "YYYY-MM-DD"
        ),
        recordEnd: moment().format("YYYY-MM-DD"),
        pageNum: 1,
        pageSize: 50
      },
      //表格列
      listCol: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.tsheetListParams.pageNum - 1) *
                    vm.tsheetListParams.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },

        {
          title: "工时周期",
          key: "formCode",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let start = moment(params.row.recordStart).format("YYYY-MM-DD");
                let end = moment(params.row.recordEnd).format("YYYY-MM-DD");
                return start + "--" + end;
              })(this)
            );
          }
        },

        {
          title: "申报人",
          align: "center",
          key: "staffName",
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", {}, [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$emit("timeView", {
                        tcycleId: params.row.tcycleId,
                        staffId: params.row.staffId
                      });
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      tableData: [],

      listTotal: 0
    };
  },
  methods: {
    init() {
      this.getDepartmentTree();
    },
    // 获取左侧树
    getDepartmentTree() {
      ApiGetDepartmentTree().then(res => {
        if (res.code == "success") {
          this.departmentTree = res.data;
          if (this.departmentTree.length > 0) {
            this.tsheetListParams.deptId = this.departmentTree[0].deptId;
            this.getTimeTableList();
          }
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    /**
     * @param  {Arr} msg 当前选中的树形 数据
     */
    depSelect(msg) {
      this.tsheetListParams.deptId = msg[0].deptId;
      this.getTimeTableList();
    },

    getTimeTableList() {
      this.tsheetListParams.recordStart = moment(
        this.tsheetListParams.recordStart
      ).format("YYYY-MM-DD");
      this.tsheetListParams.recordEnd = moment(
        this.tsheetListParams.recordEnd
      ).format("YYYY-MM-DD");
      ApiGetStaffTimeList(this.tsheetListParams).then(res => {
        if (res.code == "success") {
          this.tableData = res.data;
          this.listTotal = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //分页跳转页面
    handlePage(value) {
      this.tsheetListParams.pageNum = value;
      this.getTimeTableList();
    },
    //改变页面size
    handlePageSize(value) {
      this.tsheetListParams.pageSize = value;
      this.getTimeTableList();
    },
    seach() {
      this.getTimeTableList();
    },
    reset() {
      this.tsheetListParams.staffName = "";
      this.tsheetListParams.deptId = this.departmentTree[0].deptId;;
      this.tsheetListParams.recordStart = moment(
        moment().subtract(1, "months")
      ).format("YYYY-MM-DD");
      this.tsheetListParams.recordEnd = moment().format("YYYY-MM-DD");
      this.getTimeTableList();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../common/css/mixin";
@import "../../../common/css/base";
.s-input-wrapper {
  @include datapick-label();
  label {
    width: 100px;
  }
  .ivu-date-picker {
    width: calc(100% - 100px);
  }
  &:after {
    content: "";
    display: block;
    clear: both;
  }
}
.s-select-wrapper {
  height: 32px;
  @include select-label();
}
</style>




