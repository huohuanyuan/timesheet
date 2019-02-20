import axios from 'axios'

// 请求列表
export const ApiGetApvProcess = query => { return axios.get("/apv/process", { params: query }).then(res => res.data) };
// 获取所有审批组信息
export const ApiGetApvGroupAll = query => { return axios.get("/apv/group/all", { params: query }).then(res => res.data) };
// 修改完成后提交
export const ApiPutApvProcess = params => { return axios.put("/apv/process", params).then(res => res.data) };
