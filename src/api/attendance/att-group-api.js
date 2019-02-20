import axios from 'axios'

//添加考勤组
export const apiAddAttendanceGroup = params => { return axios.post("/attendance/group", params).then(res => res.data) };
//获取公司考勤表list
export const apiGetAttGroupList= (query, params) => { return axios.get("/attendance/group/company/"+query, { params: params }  ).then(res => res.data) };
// 获取考勤组详情
export const apiGetAttGroupDetail= query => { return axios.get("/attendance/group/detail/"+ query ).then(res => res.data) };
// 修改考勤组信息
export const ApiPutAttendanceGroup = params => { return axios.put("/attendance/group", params).then(res => res.data) };
// 删除考勤组项目
export const ApiDeletAttendanceGroup = params =>{return axios.delete("/attendance/group/"+ params).then(res=>res.data)};
// 获取考勤组员工
export const ApiGetAttendanceGroupSatff = query => { return axios.get("/attendance/group/staff",{ params: query } ).then(res => res.data) };
// 获取所有非考勤组员工
export const ApiGetAttendanceGroupNoSatff = query => { return axios.get("attendance/group/no/staff",{ params: query } ).then(res => res.data) };
// 增加考勤组员工
export const ApiPutAttendanceGroupAddStaff = params => { return axios.put("/attendance/group/add/staff", params).then(res => res.data) };
// 删除考勤组员工
export const ApiDeletAttendanceGroupStaff = params =>{return axios.delete("/attendance/group/delete/"+ params).then(res=>res.data)};

// 添加考勤点
export const ApiPostAttendanceGroup = params => { return axios.post("/attendance/group/location", params).then(res => res.data) };

// 根据考勤组获取考勤点列表
export const ApiGetAttendanceLocationList = query => { return axios.get("/attendance/group/location/list",{ params: query } ).then(res => res.data) };

// 删除考勤点
export const ApiDeletAttendanceLocation = params =>{return axios.delete("/attendance/group/location/"+ params).then(res=>res.data)};

// 获取考勤点详细
export const ApiGetGroupLocation = params => { return axios.get("/attendance/group/location/" + params).then(res => res.data) };

// 修改考勤点提交
export const ApiPutAttendanceLocation = params => { return axios.put("/attendance/group/location", params).then(res => res.data) };
