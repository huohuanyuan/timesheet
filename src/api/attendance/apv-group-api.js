import axios from 'axios'

//获取审批组list
export const apiGetApvGroupList = (params) => { return axios.get("/apv/group/all", { params: params }).then(res => res.data) };
//新建审批组
export const ApiPostApvGroup = params => { return axios.post("/apv/group", params).then(res => res.data) };

//修改审批组
export const ApiPutApvGroup = params => { return axios.put("/apv/group", params).then(res => res.data) };
//删除审批组
export const ApiDeleteApvGroup = params => { return axios.delete("/apv/group/" + params).then(res => res.data) };

// 获取指定审批项的审批流程
export const ApiGetApvProcess = params => { return axios.get("/apv/process/" + params).then(res => res.data) };
