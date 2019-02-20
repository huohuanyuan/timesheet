import axios from 'axios'
// 公司列表
export const ApiGetCompany = query => { return axios.get("/company/all", { params: query }).then(res => res.data) };
// 公司详情
export const ApiGetCompanyCon = query => { return axios.get("/company/" + query).then(res => res.data) };
// 上传logo
export const ApiPostCompanyLogo = params => { return axios.post("/company/logo", params).then(res => res.data) };
// 公司新建
export const ApiPostCompany = params => { return axios.post("/company", params).then(res => res.data) };
// 公司修改
export const ApiPutCompany = params => { return axios.put("/company", params).then(res => res.data) };
// 公司删除
export const ApiDeletCompany = params => { return axios.delete("/company/" + params).then(res => res.data) };
