
import axios from 'axios'


//用户管理
//角色列表
export const ApiGetUserRoleList = query => { return axios.get("/role/category/management", { params: query }).then(res => res.data) }
//添加用户
export const ApiPostUser = params => { return axios.post("/staff", params).then(res => res.data) };
//用户列表
export const ApiGetUsers = query => { return axios.get("/staff/all", { params: query }).then(res => res.data) }
//激活用户
export const ApiPutActiveUser = params => { return axios.put("/staff/activated", params).then(res => res.data) };
//用户详情
export const ApiGetUserInfo = query => { return axios.get("/staff/" + query).then(res => res.data) }
//修改用户信息
export const ApiPutUserInfo = params => { return axios.put("/staff", params).then(res => res.data) };
//删除用户
export const ApiDeleteUser = params => { return axios.delete("/staff/deleted/" + params).then(res => res.data) };
// 检索公司考勤组信息
export const ApiGetAttendanceGroupCompany = query => { return axios.get("/attendance/group/company", { params: query }).then(res => res.data) }
//检索公司申报周期规则信息
export const ApiGetCycleRuleCompany = query => { return axios.get("/cycle/rule/company", { params: query }).then(res => res.data) }
//获取直线领导

export const ApiGetManger = query => { return axios.get("/staff/line/managers", { params: query }).then(res => res.data) }
//获取单个员工假期余额
export const ApiGetLeaveStaff = params => { return axios.get("/leave/staff/" + params).then(res => res.data) }
//修改员工假期余额
export const ApiPutLeaveStaff = params => { return axios.put("/leave/staff", params ).then(res => res.data) }

// 查询公司职位下拉列表
export const ApiGetPositionList = query => { return axios.get("/position/list", { params: query }).then(res => res.data) }

// 获取职级信息
export const ApiGetPosLevel = params => { return axios.get("/position/" + params +"/level/list").then(res => res.data) }


// 导出
export const ApiGetReportStaffExport = params => {
  return axios({
    method: "get",
    url: `/report/staff/export?name=${params.name}&staffNumber=${params.staffNumber}
            &deptId=${params.deptId}&lineManagerName=${params.lineManagerName}`,
    responseType: "blob"
  }).then(res => res.data)
};

// 下载模版
export const ApiGetReportTemplate = params => {
  return axios({
    method: "get",
    url: `/report/template/userTemplete`,
    responseType: "blob"
  }).then(res => res.data)
};