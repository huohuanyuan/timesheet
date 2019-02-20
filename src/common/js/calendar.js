/*
 * @Author: chengshanshan 
 * @Date: 2018-07-03 15:41:16 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-22 11:02:42
 */

import moment from 'moment';
/** 
* 日期数据格式化（0:工作日；1：周末；2：节假日;3:倒班日）
* @param { Array } data  后台返回的数据 [{caleDate: "2018-06-19",caleCategory: 0},{caleDate: "2018-06-20",caleCategory: 2}]
* @return { Object } 返回对象{2018-06-19:0，2018-06-20:2}
*/
export function calendarData(data) {
    let cale = {};
    if (data && data.length > 0) {
        for (let elem of data.values()) {
            let key = moment(elem.caleDate).format("YYYY-MM-DD");
            cale[key] = elem.caleCategory
        }
        return cale;
    } else {
        return cale;
    }
}
/**
* 判断当前日期是否在公司日历范围内
* @param { Date } day当前时间
* @param { Date } minDate 公司日历范围起始时间
* @param { Date } maxDate 公司日历范围截止时间
* @return { Boolean } true:是 false 否
 */
export function isBetweenCompanyRange(day, minDate, maxDate) {
    if (day && minDate && maxDate) {
        let _start = moment(minDate).subtract(1, "days");
        let _end = moment(maxDate).add(1, "days");
        if (moment(day).isBetween(_start, _end)) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}