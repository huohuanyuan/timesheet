import axios from 'axios'

// 新建 申报周期
export const ApiPostCycleRule = params => { return axios.post("/cycle/rule", params).then(res => res.data) };
// 请求 申报周期列表
export const ApiGetCycleRulePage = query => { return axios.get("/cycle/rule/page", { params: query }).then(res => res.data) };
// 请求 申报周期详情
export const ApiGetCycleRuleCon = query => { return axios.get("/cycle/rule/"+ query ).then(res => res.data) };
// 编辑完成后，提交
export const ApiPutCycleRule = params => { return axios.put("/cycle/rule", params).then(res => res.data) };
// 删除 审核周期
export const ApiDeletCycleRule = params => { return axios.delete("/cycle/rule/" + params).then(res => res.data) };
// 请求 员工
export const ApiGetCycleStaff = query => { return axios.get("/cycle/staff", { params: query }).then(res => res.data) };
// 删除员工
export const ApiDeletCycleStaff = params => { return axios.delete("/cycle/delete/" + params).then(res => res.data) };
// 请求 未添加的员工
export const ApiGetStaffCyele = query => { return axios.get("/staff/cycle", { params: query }).then(res => res.data) };
// 点击添加未加油审核周期的员工
export const ApiPutCycleAddStaff = query => { return axios.put("/cycle/add/staff/", query ).then(res => res.data) };
// 请求 周期列表
export const ApiGetCycleRule = query => { return axios.get("/cycle/rule", { params: query }).then(res => res.data) };


// 生成审核周期
export const ApiPostCycleRuleGenerate = params => { return axios.post("/cycle/rule/generate", params).then(res => res.data) };
