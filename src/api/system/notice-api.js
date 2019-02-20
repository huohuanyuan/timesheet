import axios from 'axios'

//公告列表
export const ApiGetNoticeList = query => { return axios.get("/anno/admin/list", { params: query }).then(res => res.data) };

//新建公告
export const ApiPostNotice = params => { return axios.post("/anno", params).then(res => res.data) };
//获取单个公告信息
export const ApiGetNotice = query => { return axios.get("/anno/"+query).then(res => res.data) };
//修改公告
export const ApiPutNotice = query => { return axios.put("/anno", query ).then(res => res.data) };
//发布公告
export const ApiPublishNotice = query => { return axios.put("/anno/publish",query ).then(res => res.data) };
//关闭公告
export const ApiCloseNotice = query => { return axios.put("/anno/off",query ).then(res => res.data) };
//删除公告
export const ApiDeleteNotice = params => { return axios.delete("/anno/" + params).then(res => res.data) };
