/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:57:04 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-07-05 11:32:38
 * @instruction：超级管理员日历
 */

<template>
  <div class="admin-calendar">
    <div>
      <div v-show="!isSetView">
        <p class="text-right">
          <Button size="small" type="info" @click="isSetView=true"> 设置 </Button>
        </p>
        <split></split>
        <tms-calendar @showSetView="isSetView=true" @changeDate="emitChangeDate" @goTody="goTody" :min-date="minDate" :max-date="maxDate"></full-calendar>
        </tms-calendar>
          <split></split>
        <Button type="primary" @click="ayncCalender">同步日历给所有公司</Button>
      </div>
      <div v-show="isSetView">
        <div>            
          <Card>
            <p slot="title">节假日设置</p>
               <split></split>
                <split></split>
            <Form :label-width="80" v-model="setCalender">           
              <FormItem label="年份">
                <DatePicker :editable='false'  type="year" v-model="setCalender.year" style="width: 100%" :clearable=false></DatePicker>
              </FormItem>
              <FormItem label="节假日">
                <DatePicker :editable='false' :confirm='false' type="date"  :options="holidayOptions" multiple v-model="setCalender.holidays" style="width: 100%"></DatePicker>
              </FormItem>
              <FormItem label="调班日">
                <DatePicker :editable='false' :confirm='false' type="date" :options="workdayOptions" multiple v-model="setCalender.workDays" style="width: 100%"></DatePicker>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="setHolidaySave">保存</Button>
              </FormItem>
            </Form>
            <split></split>
          </Card>
        </div>
        <split></split>
        <p>
          <Button @click="isSetView=false">关闭</Button>
        </p>
      </div>
      <Modal v-model="addRestDateModel" title="添加节假日" :mask-closable="false">

        </Form>
        <p slot="footer">
          <Button long type="primary" @click="addHolidaySave('addHoliday')">保存</Button>
        </p>
      </Modal>
    </div>
  </div>
</template>
<script>
import Split from "components/unit/split";
import TmsCalendar from "components/tmsCalendar/tms-calendar";
import moment from "moment";
import qs from "qs";
import { resCode } from "@/api/code";
import { privilege } from "common/js/privilege";
import {
  ApiPostCalender,
  ApiPostCalenderToCom
} from "@/api/system/admin-calendar-api";
import {
  ApiGetCaleRange
} from "@/api/system/calendar-api";
import Cookies from "js-cookie";
import dateFunc from "common/js/dateFunc";
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
        "on-ok": () => {}
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
        click: () => {}
      }
    },
    "编辑"
  );
};

export default {
    components: {
    Split,
    TmsCalendar
  },
  data() {
    return {
      minDate: "", //日历的开始日期
      maxDate: "", //日历的结束日期
      setCalender: {
        year: moment().format("YYYY"),
        holidays: [],
        workDays: []
      },
      holidayOptions: {
        disabledDate: date => {
          return !moment(date).isSame(this.setCalender.year, "year");
        }
      },
      workdayOptions: {
        disabledDate: date => {
          return !moment(date).isSame(this.setCalender.year, "year");
        }
      },
      addRestDateModel: false,
      isSetView: false
    };
  }, 
  methods: {
    emitChangeDate(newdate) {
      this.$store.commit("setCurrentDate", newdate);
      this.$store.commit("getTempCalendar");
    },
    setHolidaySave() {
      let me = this;
      let params = { holidays: [], workDays: [], year: "" };
      for (let elem of this.setCalender.holidays.values()) {
        params.holidays.push(moment(elem).format("YYYY-MM-DD"));
      }
      for (let elem of this.setCalender.workDays.values()) {
        params.workDays.push(moment(elem).format("YYYY-MM-DD"));
      }
      params.year = moment(this.setCalender.year).format("YYYY");
      ApiPostCalender(params).then(function(res) {
        if (res.code == "success") {
          me.$Message.success("设置成功");
          me.isSetView = false;
          me.$store.commit(
            "setCurrentDate",
            moment(me.setCalender.year).format("YYYY-MM-DD")
          );
          me.$store.commit("getTempCalendar");
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },

    ayncCalender() {
      let me = this;
      //同步日历给所有公司
      ApiPostCalenderToCom({
        year: Number(moment(this.setCalender.year).format("YYYY"))
      }).then(function(res) {
        if (res.code == "success") {
          me.$Message.success("同步成功");
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    goTody() {
      this.$store.commit("setCurrentDate", moment());
    },
       getCompanyRange() {
      let me = this;
      return new Promise((resolve, reject) => {        
        ApiGetCaleRange(me.modifyDate).then(function(res) {
          if (res.code == "success") {
            me.maxDate = res.data.maxDate;
            me.minDate = res.data.minDate;
             resolve(me.maxDate,me.minDate)
          } else {
            if (resCode[res.code]) {
              me.$Message.error(resCode[res.code]);
            }
          }
         
        });
      });
    },
    init() {
       this.$store.commit("setCurrentDate", moment());
       //查询公司日历范围
      this.getCompanyRange();
      this.$store.commit("getTempCalendar");
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
.admin-calendar {
  overflow: visible; 
  .text-right {
    text-align: right;
  }
}
</style>