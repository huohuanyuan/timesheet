import axios from 'axios'

// 手动获取钉钉员工考勤信息
export const ApiGetDingAttendance = query => { return axios.get("/ding/attendance/record", { params: query }).then(res => res.data) };
// 同步钉钉员工信息
export const ApiGetDingUser = query => { return axios.get("/ding/user/synchronize", { params: query }).then(res => res.data) };

// 初始化用户请假类型
export const ApiGetDingUserInitLeaveType = query => { return axios.get("/ding/user/initLeaveType", { params: query }).then(res => res.data) };
