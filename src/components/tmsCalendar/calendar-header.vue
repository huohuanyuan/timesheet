/*
 * @Author: chengshanshan 
 * @Date: 2018-07-04 16:24:38 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-22 10:51:54
 * @instraction: 日历header
 */

<template>
  <div class="full-calendar-header">
    <div class="header-left">
      <slot name="header-left">
      </slot>
    </div>
    <div class="header-center">
      <span class="prev-year" @click.stop="goPrevYear">
        <Icon type="chevron-left" style="margin-right:-4px"></Icon>
        <Icon type="chevron-left"></Icon>
      </span>
      <span class="prev-month" @click.stop="goPrevMon">
        <Icon type="chevron-left"></Icon>
      </span>
      <span class="title">{{titleYear}}年 {{titleMonth}}月</span>
      <span class="next-month" @click.stop="goNextMon">
        <Icon type="chevron-right"></Icon>
      </span>
      <span class="next-year" @click.stop="goNextYear">
        <Icon type="chevron-right" style="margin-right:-4px"></Icon>
        <Icon type="chevron-right"></Icon>
      </span>
    </div>
  </div>
</template>
<script type="text/babel">
import dateFunc from "common/js/dateFunc";
import moment from "moment";
export default {
  props: {
    currentDate: {},
    titleFormat: {},
    firstDay: {},
    monthNames: {},
    locale: {}
  },
  data() {
    return {
      leftArrow: "<<",
      rightArrow: ">>"
    };
  },
   methods: {
    goPrevMon() {
      let newDate = moment(this.currentDate)
        .subtract(1, "months")
        .startOf("month");
      this.$emit("changeDate", newDate);
    },
    goNextMon() {
      let newDate = moment(this.currentDate)
        .add(1, "months")
        .startOf("month");
      this.$emit("changeDate", newDate);
    },
    goPrevYear() {
      let newDate = moment(this.currentDate).subtract(1, "years");
      this.$emit("changeDate", newDate);
    },
    goNextYear() {
      let newDate = moment(this.currentDate).add(1, "years");
      this.$emit("changeDate", newDate);
    }
  },
  computed: {
    titleMonth() {
      if (!this.currentDate) return;
      return moment(this.currentDate).format("MM");
    },
    titleYear() {
      if (!this.currentDate) return;
      return moment(this.currentDate).format("YYYY");
    }
  },
 
};
</script>
<style lang="scss">
@import "../../common/css/mixin";
@import "../../common/css/base";
@import "../../common/css/variable";
.full-calendar-header {
  display: flex;
  align-items: center;
  border-left: 1px solid $border-dark-color;
  border-right: 1px solid $border-dark-color;
  border-top: 1px solid $border-dark-color;
  .header-left {
    flex: 2;
    padding: 10px 0;
    border-right: 1px solid $border-dark-color;
    cursor: pointer;
    transition: background-color 0.5s;
    &:hover{
      background-color: #f7f5f5;
    }
    .today {
      font-size: 45px;
      text-align: center;
      color: $calendar-green;
    }
    .today-week {
      color: $light-dark-color;
      text-align: center;
    }
  }
  .header-center {
    flex: 3;
    text-align: center;
    .title {
      font-size: 14px;
      margin: 0 10px;
      color: $calendar-green;
    }
    .prev-month,
    .next-month {
      cursor: pointer;
      padding: 0 6px;
      color: $light-dark-color;   
    }
    .prev-year,
    .next-year {
      cursor: pointer;
      padding: 0 6px;      
      color: $light-dark-color;
   
    }
  }
}
</style>
