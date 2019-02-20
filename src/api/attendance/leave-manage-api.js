import axios from 'axios'
//获取公司所有假期类型
export const apiGetLeaveList = (params) => { return axios.get("/leave", { params: params }).then(res => res.data) };
//修改假期类型
export const apiPutLeave = (params) => { return axios.put("/leave", params).then(res => res.data) };
//启用or停用
export const apiPutLeaveActivation = (params) => { return axios.put("leave/activation", params).then(res => res.data) };

