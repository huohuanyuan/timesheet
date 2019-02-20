import axios from 'axios'

//客户管理
// 客户列表
export const ApiGetClient = query => { return axios.get("/client", { params: query }).then(res => res.data) };
// 新建客户
export const ApiPostClient = params => { return axios.post("/client", params).then(res => res.data) };
// 删除
export const ApiDeletClient = params => { return axios.delete("/client/" + params).then(res => res.data) };
// 客户详情
export const ApiGetClientCon = query => { return axios.get("/client/" + query).then(res => res.data) };
//修改提交
export const ApiPutClient = params => { return axios.put("/client", params).then(res => res.data) };
