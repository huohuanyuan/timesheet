import axios from 'axios'

//获取公司系统配置参数信息
export const ApiGetCompanySystemData = query => { return axios.get("/company/system_data", { params: query }).then(res => res.data) };
// 修改公司系统配置参数信息
export const ApiPutCompanySystemData = params => { return axios.put("/company/system_data", params).then(res => res.data) };
