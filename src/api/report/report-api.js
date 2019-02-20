import axios from 'axios'

// 报表中心
export const ApiGeteportDepts = query => { return axios.get("/report/depts", { params: query }).then(res => res.data) };
// 获取员工工时明细
export const ApiGetStaffTsheet = query => { return axios.get("/report/staff/tsheet/detail", { params: query }).then(res => res.data) };
// 获取员工工时利用率表
export const ApiGetStaffTsheetUtilization = query => { return axios.get("/report/staff/tsheet/utilization", { params: query }).then(res => res.data) };
//获取员工项目工时月报表
export const ApiGetReportStaffProject = query => { return axios.get("/report/project/staff/task_category/work_hours/month", { params: query }).then(res => res.data) };
// 获取项目任务工时报表
export const ApiGetReportTaskProject = query => { return axios.get("/report/task/project/tsheet", { params: query }).then(res => res.data) };
// 请求筛选合同列表
export const ApiGetDepartmentProj = query => { return axios.get("/department/proj", { params: query }).then(res => res.data) };

// 获取员工考勤报表  ApiGetStaffTsheet
export const ApiGetStaffTsheetAtt = query => { return axios.get("/report/staff/att", { params: query }).then(res => res.data) };

// 部门员工项目月工时报表
export const ApiGetStaffMonthTsheet = query => { return axios.get("/report/dept/staff/proj/month/tsheet", { params: query }).then(res => res.data) };


// 员工工时明细报表 第一个
export const ApiGetReportStaffDetailExport = params => {
  return axios({
    method: "get",
    url: `report/staff/tsheet/detail/export?deptId=${
            params.deptId
            }&staffNumber=${params.staffNumber}
            &staffName=${params.staffName}
            &status=${params.status}
            &startTime=${params.startTime}
            &endTime=${params.endTime}`,
    responseType: "blob"
  }).then(res => res.data)
};

//导出员工工时利用率表 第二个
export const ApiGetReportStaffTsheetExport = params => {
  return axios({
    method: "get",
    url: `/report/staff/tsheet/utilization/export?deptId=${
            params.deptId
            }&staffNumber=${params.staffNumber}
            &staffName=${params.staffName}
            &startTime=${params.startTime}
            &endTime=${params.endTime}`,
    responseType: "blob"
  }).then(res => res.data)
};

// 导出项目员工工时报表 第三个
export const ApiGetReportStaffExport = params => {
  return axios({
    method: "get",
    url: `/report/staff/project/tsheet/excel?staffIdStr=${
            params.staffIdStr
            }&year=${params.year}
            &projectIdStr=${params.projectIdStr}`,
    responseType: "blob"
  }).then(res => res.data)
};

// 员工工时利用率报表 第四个
export const ApiGetReportTsheetExport = params => {
  return axios({
    method: "get",
    url: `/report/task/project/tsheet/excel?${
            params.contractCodes
            }&year=${params.year}`,
    responseType: "blob"
  }).then(res => res.data)
};

// 导出员工考勤报表 第五个
export const ApiGetReportStaffAttExport = params => {
  return axios({
    method: "get",
    url: `/report/staff/att/export?deptId=${
            params.deptId
            }&staffNumber=${params.staffNumber}
            &staffName=${params.staffName}
            &yearMonth=${params.yearMonth}`,
    responseType: "blob"
  }).then(res => res.data)
};

// 导出部门员工项目月工时报表 第六个
export const ApiGetReportStaffMonth = params => {
  return axios({
    method: "get",
    url: `/report/dept/staff/proj/month/tsheet/export?deptId=${
            params.deptId
            }&staffNumber=${params.staffNumber}
            &staffName=${params.staffName}
            &yearMonth=${params.yearMonth}`,
    responseType: "blob"
  }).then(res => res.data)
};
