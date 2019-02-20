/*
 * @Author: chengshanshan 
 * @Date: 2019-01-24 15:01:44 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-24 15:55:12
 * @instruction：项目经理意见
 */

 <template>
  <div>
    <Table :columns="listCol" :data="tableData"></Table>
    <split></split>
    <Button @click="opinionClose">关闭</Button>
  </div>
</template>
 <script>
import { ApiGetOpinionList } from "@/api/timesheet/pro-staff-time-api";
import moment from "moment";
import Split from "components/unit/split";
import { resCode } from "@/api/code";
export default {
  components: {
    Split
  },
  data() {
    return {
      listCol: [
        {
          type: "index",
          title: "序号",
          width: 80
        },

        {
          title: "意见",
          align: "center",
          key: "common"
        },
        {
          title: "项目经理",
          align: "center",
          key: "createdbyName",
          width: 100
        }
      ],
      tableData: []
    };
  },
  methods: {
    getOpinionList(formId) {
      ApiGetOpinionList(formId).then(res => {
        if (res.code == "success") {
          this.tableData = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    opinionClose() {
      this.$emit("close");
    }
  }
};
</script>
 <style lang="scss" scoped>
</style>
 
 
 
