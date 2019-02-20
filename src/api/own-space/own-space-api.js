import axios from 'axios'

// 修改密码
export const ApiStaffPwd = params => { return axios.put("/staff/pwd", params).then(res => res.data) };
// 单个员工的信息
export const ApiGetStaff = query => { return axios.get("/staff", { params: query }).then(res => res.data) };
// 上传员工头像
export const ApiPostStaffAvatar = params => { return axios.post("/staff/avatar", params).then(res => res.data) };
// 获取员工所有的项目信息
export const ApiGetStaffProject = query => { return axios.get("/staff/project",{ params: query }).then(res => res.data) };
// 获取员工所有的工时信息
export const ApiGetStaffTimesheet= query => { return axios.get("/staff/timesheet",{ params: query }).then(res => res.data) };

//获取员工考勤信息列表
export const ApiGetAttendance = query => {return axios.get("/attendance/staff",{params:query}).then(res => res.data)};

//检索本人工单周期
export const ApiGetSelfCycles = query => {return axios.get("/tsheet/self/cycles",{params:query}).then(res => res.data)};
