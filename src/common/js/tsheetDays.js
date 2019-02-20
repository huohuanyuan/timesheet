/*
 * @Author: chengshanshan 
 * @Date: 2018-07-03 15:41:35 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-02-19 17:32:06
 */

import moment from 'moment';

/**
 * 传入起始时间，计算工时申报表格表头日期数组
 * @param { Date } start 开始日期
 * @param { Date } end 结束日期
 * @return { Array } 日期数组 [2018-03-07,2018-03-09.....]
 */
export function getdaysList(start, end) {
  //计算周期天数   
  let dayArr = [];
  let startNext = start;
  let endDay = moment(end).add("1", "days"); //业务要求时间段为含头含尾，所以结束日期加一天计算天数
  let daysNum = moment(endDay).diff(
    moment(start),
    "days"
  );
  for (let i = 0; i < daysNum; i++) {
    if (
      moment(startNext).isBefore(endDay, "day") ||
      moment(start).isSame(end, "day")
    ) {
      dayArr.push(moment(startNext).format("YYYY-MM-DD"));
      startNext = moment(startNext).add("1", "days");
    } else {
      break;
    }
  }
  return dayArr;
}

/**
 * 数据格式化为iview table 需要的数据格式
 * @param { Array } datas [{taskId:2,tsheetDate:2018-03-01,workHours:3,workComment:""},{taskId:2,tsheetDate:2018-03-02,workHours:10}]
 * @returns { Array }  [{taskId:2,times:{2018-03-01:3,2018-03-02:10},workComment:{},issueComment:{}}]
 */

export function exportTabelData(datas) {
  let arr = [];
  let nextId = "";
  let _obj = {};
  let _cellClassName = {};
  for (
    let index = 0, len = datas.length; index < len; index++
  ) {
    let elem = datas[index];
    if (index == 0) {
      nextId = datas[index].projTaskId;
      _obj = {
        times: {},
        workComment: {},
        issueComment: {},
        tsheetDailyId: {}
      };
    }

    if (nextId != datas[index].projTaskId) {
      nextId = datas[index].projTaskId;
      arr.push(_obj)
      _obj = {
        times: {},
        workComment: {},
        issueComment: {},
        tsheetDailyId: {}
      };
      _cellClassName = {};

    }
    if (nextId == datas[index].projTaskId) {
      _obj.formId = elem.formId;
      _obj.staffId = elem.staffId;
      _obj.study = elem.projectId;
      _obj.task = elem.projTaskId;
      _obj.projectName = elem.projContName;
      _obj.projContName = elem.projContName;
      _obj.taskName = elem.taskName;
      _obj.flag = "modify"; //标志是修改数据，任务列表不需要绘制select框
      _obj.isTotal = false;//标记不是合并行，行合计时不需要计算
      let _date = moment(elem.tsheetDate).format("YYYY-MM-DD");
      _obj.workComment[_date] = elem.workComment;
      _obj.times[_date] = elem.workHours;
      _obj.issueComment[_date] = elem.issueComment;
      _obj.tsheetDailyId[_date] = elem.tsheetDailyId;

      if (elem.workComment || elem.issueComment) {
        _cellClassName[_date] = "comment"
        _obj.cellClassName = _cellClassName;

      }

    }

    if (index == datas.length - 1) {
      arr.push(_obj);
      _cellClassName = {};

    }
  }

  return arr;
}


