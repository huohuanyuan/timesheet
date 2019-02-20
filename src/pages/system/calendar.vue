/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:57:58 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-22 10:52:59
 * @instruction：日历管理
 */

<template>
  <div class="calendar">
    <div>
      <div v-show="!isSetView">
        <p class="text-right">
          <Button size="small" type="info" @click="isSetView=true"> 设置 </Button>
        </p>
        <split></split>
        <tms-calendar @dayClick="dayClick" :first-day="firstDay" @changeDate="emitChangeDate" @goToday="goToday" :min-date="minDate" :max-date="maxDate">
        </tms-calendar>
      </div>
      <div v-show="isSetView">
        <Card>
          <p slot="title">工作日/休息日设置</p>
          <split></split>
          <split></split>
          <Form :label-width="80" ref="setRestDayForm" :model="setRestDayForm" :rules="setRestDayRule">
            <FormItem label="工作日" prop="workday">
              <CheckboxGroup v-model="setRestDayForm.workday">
                <Checkbox label="0">星期日</Checkbox>
                <Checkbox label="1">星期一</Checkbox>
                <Checkbox label="2">星期二</Checkbox>
                <Checkbox label="3">星期三</Checkbox>
                <Checkbox label="4">星期四</Checkbox>
                <Checkbox label="5">星期五</Checkbox>
                <Checkbox label="6">星期六</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="生效日期" prop="startDate">
              <DatePicker :editable='false' type="date" :options="options" :clearable="false" v-model="setRestDayForm.startDate" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="节日覆盖">
              <RadioGroup v-model="setRestDayForm.passHoliday">
                <Radio label="true">跳过节假日</Radio>
                <Radio label="false">覆盖节假日</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="setRestDaySave('setRestDayForm')">保存</Button>
              <Button @click="resetCalenderModelFun">重置日历</Button>
            </FormItem>
          </Form>
        </Card>
        <split></split>
        <p>
          <Button @click="isSetView=false">关闭</Button>
        </p>
      </div>

      <!-- 修改指定日期的工作类型 -->
      <Modal v-model="modifyDateModel" :title="modifyDate.caleDate" :mask-closable="false">
        <split></split>
        <split></split>
        <split></split>
        <Form :model="modifyDate" :label-width="100">
          <FormItem label="日期类型">
            <RadioGroup v-model="modifyDate.caleCategory">
              <Radio label="0">工作日</Radio>
              <Radio label="1">休息日</Radio>
              <Radio label="2">节假日</Radio>
              <Radio label="3">调班日</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <p slot="footer">
          <Button long type="primary" @click="modifyDateSave">保存</Button>
        </p>
      </Modal>
      <!-- 重置日历 -->
      <Modal v-model="resetCalenderModel" title="提示" :mask-closable="false">
        <Alert type="warning" show-icon>
          注意
          <template slot="desc">
            重置日历会清除对应时间段的所有设置
          </template>
        </Alert>
        <split></split>
        <split></split>
        <Form ref="resetCalenderForm" :model="resetCalenderForm" :label-width="100" :rules="resetCalenderRules">
          <FormItem label="开始日期" prop="startDate">
            <DatePicker :editable='false' type="date" :options="options" v-model="resetCalenderForm.startDate" style="width: 100%" :clearable=false></DatePicker>
          </FormItem>
          <FormItem label="结束日期" prop="endDate">
            <DatePicker :editable='false' type="date" :options="options" v-model="resetCalenderForm.endDate" style="width: 100%" :clearable=false></DatePicker>
          </FormItem>
        </Form>

        <p slot="footer">
          <Button long type="primary" @click="resetCalender('resetCalenderForm')">保存</Button>
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
  ApiGetCaleRange,
  ApiPutWeekday,
  ApiGetCalendar,
  ApiPutSpecialDay,
  ApiPutRestCalender
} from "@/api/system/calendar-api";
import Cookies from "js-cookie";
import dateFunc from "common/js/dateFunc";

export default {
  components: {
    Split,
    TmsCalendar
  },
  data() {
    //自定义日期输入框验证
    const validatePass = (rule, value, callback) => {
      if (value[0] === "" || value[1] === "") {
        callback(new Error(" "));
      } else {
        callback();
      }
    };
    return {
      firstDay: 0, //月历显示星期的顺序，为0时星期日在第一列
      modifyDateModel: false, //修改日期类型modal

      modifyDate: { caleDate: "", caleCategory: "" },
      isSetView: false,
      minDate: "", //日历的开始日期
      maxDate: "", //日历的结束日期
      options: {
        //只能选择本公司日期范围内的日期
        disabledDate: date => {
          return (
            date < new Date(this.minDate) - 86400000 ||
            date > new Date(this.maxDate)
          );
        }
      },

      //工作日、休息日设置验证规则
      setRestDayRule: {
        workday: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一项",
            trigger: "change"
          }
        ],
        startDate: [
          {
            required: true,
            type: "date",
            message: "",
            trigger: "change"
          }
        ]
      },
      //工作日、休息日添加
      setRestDayForm: {
        workday: ["1", "2", "3", "4", "5"],
        startDate: moment().format("YYYY-MM-DD"),
        passHoliday: "true"
      },
      //节假日输入验证规则
      addHolidayInline: {
        title: [{ required: true, message: " ", trigger: "blur" }],
        date: [
          {
            required: true,
            validator: validatePass,
            trigger: "change"
          }
        ]
      },
      resetCalenderModel: false, //重置日历提示model
      //重置日历
      resetCalenderForm: {
        startDate: "",
        endDate: ""
      },
      //重置日历校验
      resetCalenderRules: {
        startDate: [
          {
            required: true,
            type: "date",
            message: " ",
            trigger: "change"
          }
        ],
        endDate: [
          {
            required: true,
            type: "date",
            message: " ",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    emitChangeDate(newdate) {
      this.$store.commit("setCurrentDate", newdate);
      this.$store.commit("getCompanyCalendar");
    },
    dayClick(day, dayType, jsEvent) {
      let _start = moment(this.minDate).subtract(1, "days");
      let _end = moment(this.maxDate).add(1, "days");
      if (moment(day).isBetween(_start, _end)) {
        //判断当前日期是否在公司日历范围内
        this.modifyDateModel = true;
        this.modifyDate.caleCategory = String(dayType);
        this.modifyDate.caleDate = moment(day).format("YYYY-MM-DD");
      }
    },
    modifyDateSave() {
      let me = this;
      ApiPutSpecialDay(qs.stringify(me.modifyDate)).then(function(res) {
        if (res.code == "success") {
          me.modifyDateModel = false;
          me.$store.commit("getCompanyCalendar");
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //工作日休息日保存
    setRestDaySave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          //整理日期数据1-0-0-0-0-1 从周天开始设定工作日,0是工作日,1是休息日
          let _weekdayType = [];
          for (let i = 0; i < 7; i++) {
            if (this.setRestDayForm.workday.includes(String(i))) {
              _weekdayType.push(0);
            } else {
              _weekdayType.push(1);
            }
          }
          //passHoliday 转换为boolean
          let _passHoliday =
            this.setRestDayForm.passHoliday === "true" ? true : false;
          let params = {
            startDate: moment(this.setRestDayForm.startDate).format(
              "YYYY-MM-DD"
            ),
            endDate: this.maxDate,
            weekdayType: _weekdayType.join("-"),
            passHoliday: _passHoliday
          };
          let me = this;
          //校验通过,发送请求
          ApiPutWeekday(qs.stringify(params)).then(function(res) {
            if (res.code == "success") {
              me.$Message.success("设置成功");
              me.isSetView = false;
              me.$store.commit("getCompanyCalendar");
            } else {
              if (resCode[res.code]) {
                me.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    //重置日历
    resetCalender(name) {
      let me = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            !moment(me.resetCalenderForm.startDate).isBefore(
              me.resetCalenderForm.endDate
            )
          ) {
            me.$Message.error("开始日期晚于结束日期");
          } else {
            //格式化数据发送请求
            me.resetCalenderForm.startDate = moment(
              me.resetCalenderForm.startDate
            ).format("YYYY-MM-DD");
            me.resetCalenderForm.endDate = moment(
              me.resetCalenderForm.endDate
            ).format("YYYY-MM-DD");
            ApiPutRestCalender(qs.stringify(me.resetCalenderForm)).then(
              function(res) {
                if (res.code == "success") {
                  me.$Message.success("重置成功");
                  me.resetCalenderModel = false;
                  me.isSetView = false;
                  me.$store.commit("getCompanyCalendar");
                } else {
                  if (resCode[res.code]) {
                    me.$Message.error(resCode[res.code]);
                  }
                }
              }
            );
          }
        }
      });
    },
    goToday() {
      this.$store.commit("setCurrentDate", moment());
    },
    // 点击重置
    resetCalenderModelFun() {
      this.resetCalenderModel = true;
       this.$refs['resetCalenderForm'].resetFields();
    },
    getCompanyRange() {
      let me = this;
      return new Promise((resolve, reject) => {
        ApiGetCaleRange(me.modifyDate).then(function(res) {
          if (res.code == "success") {
            me.maxDate = res.data.maxDate;
            me.minDate = res.data.minDate;
            resolve(me.maxDate, me.minDate);
          } else {
            if (resCode[res.code]) {
              me.$Message.error(resCode[res.code]);
            }
          }
        });
      });
    },
    init() {
      let me = this;
      //日历回到当前月
      this.$store.commit("setCurrentDate", moment());
      //查询公司日历范围
      this.getCompanyRange();
      //查询公司日历
      this.$store.commit("getCompanyCalendar");
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
.calendar {
  .text-right {
    text-align: right;
  }
}
</style>