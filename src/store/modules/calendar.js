import dateFunc from "common/js/dateFunc";
import moment from "moment";

import { ApiGetCalendar } from "@/api/system/calendar-api";
import { ApiGetTempCalender } from "@/api/system/admin-calendar-api";
import { calendarData } from "common/js/calendar";



const calendar = {
    state: {
        //保存公司日历信息
        comCalendarData: {},
        currentDate: moment(),//月历当前日期
        firstDay: 0,//月历显示星期的顺序，为0时星期日在第一列

    },
    mutations: {
        //公司管理员获取公司月历
        getCompanyCalendar(state) {
            //计算月历第一天
            let _viewStartDate = dateFunc.getMonthViewStartDate(
                state.currentDate,
                state.firstDay
            );
            let viewStartDate = moment(_viewStartDate).format("YYYY-MM-DD");
            //计算月历最后一天
            let _viewEndDate = dateFunc.getMonthViewEndDate(
                state.currentDate,
                state.firstDay
            );
            let viewEndDate = moment(_viewEndDate).subtract(1, 'days').format("YYYY-MM-DD");
            ApiGetCalendar(viewStartDate, viewEndDate).then(function (res) {
                if (res.code == "success") {
                    state.comCalendarData = calendarData(res.data);

                } else {
                    state.comCalendarData = {};
                    if (resCode[res.code]) {
                        iview.$Message.error(resCode[res.code]);
                    }
                }
            }).catch(function () {
                state.comCalendarData = {};
            });
        },
        setCurrentDate(state, date) {//设置常用时间变量    
            state.currentDate = date;
        },
        //超级管理员获取模板月历
        getTempCalendar(state) {
            //计算月历第一天
            let _viewStartDate = dateFunc.getMonthViewStartDate(
                state.currentDate,
                state.firstDay
            );
            let viewStartDate = moment(_viewStartDate).format("YYYY-MM-DD");
            //计算月历最后一天
            let _viewEndDate = dateFunc.getMonthViewEndDate(
                state.currentDate,
                state.firstDay
            );
            let viewEndDate = moment(_viewEndDate).subtract(1, 'days').format("YYYY-MM-DD");
            ApiGetTempCalender(viewStartDate, viewEndDate).then(function (res) {
                if (res.code == "success") {
                    state.comCalendarData = calendarData(res.data);

                } else {
                    state.comCalendarData = {};
                    if (resCode[res.code]) {
                        iview.$Message.error(resCode[res.code]);
                    }
                }
            }).catch(function () {
                state.comCalendarData = {};
            });
        },
    }
}

export default calendar;