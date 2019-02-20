/*
 * @Author: chengshanshan 
 * @Date: 2018-07-04 16:26:22 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-22 10:56:34
 * @instraction: 日历组件
 */

<template>

  <div class="comp-full-calendar">
    <!-- header pick month -->
    <calendar-header :current-date="currentDate" :first-day="firstDay" :locale="locale" @changeDate="emitChangeDate">
      <div slot="header-left" @click="goToday">
        <slot name="header-left">
          <p class="today">{{today}}</p>
          <p class="today-week">{{ todayWeek | localeWeekDay(firstDay, locale) }}</p>
        </slot>
      </div>
      <div slot="header-right">
        <slot name="header-right">
        </slot>
      </div>
    </calendar-header>
    <!-- body display date day and events -->
    <div class="full-calendar-body">
      <div class="weeks">
        <strong class="week" v-for="dayIndex in 7">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</strong>
      </div>
      <div class="dates" ref="dates">
        <div class="dates-bg">
          <div class="week-row" v-for="week in currentDates">
            <div class="day-cell" v-for="day in week" :class="{'today': day.isToday, 'not-cur-month':!day.isCurMonth,'today-after':day.isTodayAfter,'restday':day.isRestday,'not-company-range':!day.isBetweenCompanyRange}" @click.stop="dayClick(day.date,day.dayType, $event)">
              <div class="day-title day-number" @click.stop="dayClick(day.date,day.dayType, $event)">
                <span>{{day.monthDay}}</span>
              </div>
              <div v-if="day.isTakeWorkday" class="day-title take-work">
                <span>班</span>
              </div>
              <div v-else-if="day.isHoliday" class="day-title holiday">
                <span>节</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dateFunc from "common/js/dateFunc";
import moment from "moment";
import CalendarHeader from "components/tmsCalendar/calendar-header";
import { ApiGetCalendar } from "@/api/system/calendar-api";
import { resCode } from "@/api/code";
import { isBetweenCompanyRange } from "common/js/calendar";

export default {
  components: {
    CalendarHeader
  },
  props: {
    events: {
      type: Array,
      default: () => []
    },
    locale: {
      type: String,
      default: "zh-cn"
    },
    firstDay: {
      type: Number | String,
      validator(val) {
        let res = parseInt(val);
        return res >= 0 && res <= 6;
      },
      default: 0
    },
    minDate: {
      type: String,
      default: ""
    },
    maxDate: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      isLismit: true,
      eventLimit: 3,
      showMore: false,
      morePos: {
        top: 0,
        left: 0
      },
      selectDay: {},
      today: moment().format("DD"),
      todayWeek: moment().weekday()
    };
  },
  methods: {
    init() {},
    emitChangeDate(newDate) {
      this.$emit("changeDate", newDate);
    },
    restday: function(date) {
      //休息日
      if (
        this.comCalendarData.hasOwnProperty(date) &&
        this.comCalendarData[date] == 1
      ) {
        return true;
      } else {
        return false;
      }
    },
    takeworkday: function(date) {
      //倒班日
      if (
        this.comCalendarData.hasOwnProperty(date) &&
        this.comCalendarData[date] == 3
      ) {
        return true;
      } else {
        return false;
      }
    },
    holiday: function(date) {
      //节假日
      if (
        this.comCalendarData.hasOwnProperty(date) &&
        this.comCalendarData[date] == 2
      ) {
        return true;
      } else {
        return false;
      }
    },

    getCalendar() {
      // calculate 2d-array of each month
      let monthViewStartDate = dateFunc.getMonthViewStartDate(
        this.currentDate,
        this.firstDay
      );
      let calendar = [];
      for (let perWeek = 0; perWeek < 6; perWeek++) {
        let week = [];
        for (let perDay = 0; perDay < 7; perDay++) {
          let dayFormat = moment(monthViewStartDate).format("YYYY-MM-DD");
          week.push({
            monthDay: monthViewStartDate.date(),
            isToday: monthViewStartDate.isSame(moment(), "day"),
            isCurMonth: monthViewStartDate.isSame(this.currentDate, "month"),
            isTodayAfter: monthViewStartDate.isAfter(moment(), "day"),
            weekDay: perDay,
            date: moment(monthViewStartDate),
            dayType: this.comCalendarData.hasOwnProperty(dayFormat)
              ? this.comCalendarData[dayFormat]
              : "",
            isRestday: this.restday(dayFormat),
            isHoliday: this.holiday(dayFormat),
            isTakeWorkday: this.takeworkday(dayFormat),
            isBetweenCompanyRange: isBetweenCompanyRange(
              dayFormat,
              this.minDate,
              this.maxDate
            )
          });
          monthViewStartDate.add(1, "day");
        }
        calendar.push(week);
      }
      return calendar;
    },
    dayClick(day, jsEvent) {
      this.$emit("dayClick", day, jsEvent);
    },
    goToday() {
      this.$emit("goToday");
    }
  },
  watch: {
    $route(to, from) {
      this.init();
    }
  },
  computed: {
    currentDates() {
      return this.getCalendar();
    },

    currentDate() {
      return this.$store.state.calendar.currentDate;
    },
    comCalendarData() {
      //公司月历数据0:工作日；1：周末；2：节假日;3:倒班日
      return this.$store.state.calendar.comCalendarData;
    }
  },
  mounted() {
    this.init();
  },

  filters: {
    localeWeekDay(weekday, firstDay, locale) {
      firstDay = parseInt(firstDay);
      const localMoment = moment().locale(locale);
      return localMoment.localeData().weekdays()[(weekday + firstDay) % 7];
    }
  }
};
</script>
<style lang="scss">
@import "../../common/css/variable";
@import "../../common/css/mixin";
@import "../../common/css/base";
.comp-full-calendar {
  // font-family: "elvetica neue", tahoma, "hiragino sans gb";

  background: #fff;
  margin: 0 auto;
  ul,
  p {
    margin: 0;
    padding: 0;
  }
}

.full-calendar-body {
  .weeks {
    display: flex;
    border: 1px solid $border-dark-color;
    .week {
      flex: 1;
      text-align: center;

      padding: 10px 0;
    }
  }
  .dates {
    position: relative;
    border-left: 1px solid $border-dark-color;
    border-right: 1px solid $border-dark-color;
    border-bottom: 1px solid $border-dark-color;
    .week-row {
      display: flex;
      .day-cell {
        flex: 1;
        display: flex;
        align-items: center;

        flex-direction: column;
        min-height: 70px;
        padding-top: 10px;
        .day-title {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          margin: 0 auto;
          border-radius: 50%;
        }
        &.restday {
          .day-number {
            background-color: #e0e6e2;
            border-radius: 50%;
          }
        }
        .day-number {
          color: $dark-color;
          cursor: pointer;
        }
        .take-work {
          background-color: $primary-color;
          color: #fff;
        }
        .holiday {
          background-color: $warning-color;
          color: #fff;
        }
        &.today {
          .day-number {
            border: 2px solid $calendar-green;
            border-radius: 50%;
          }
        }
        &.not-cur-month {
          .day-number {
            color: $light-dark-color;
          }
        }
        &.not-company-range {
          background-color: #f7f7f7;
        }
      }
    }
  }
}
</style>
