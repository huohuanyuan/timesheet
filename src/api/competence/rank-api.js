import axios from 'axios'

// 查询公司所有职位
export const ApiGetPosition = query => { return axios.get("/position", { params: query }).then(res => res.data) }

// 增加职位
export const ApiPostPosition = params => { return axios.post("/position", params).then(res => res.data) };

// 修改职位
export const ApiPutPosition = params => { return axios.put("/position", params).then(res => res.data) };

// 删除职位
export const ApiDeletePosition = params => { return axios.delete("/position/" + params).then(res => res.data) };

// 查询职位下所有职级
export const ApiGetPositionLevel = (query1,query2) => { return axios.get("/position/" + query1 +"/level", { params: query2 }).then(res => res.data) };

// 增加职级
export const ApiPostPositionLe = params => { return axios.post("/position/level", params).then(res => res.data) };

// 修改职级
export const ApiPutPositionLe = params => { return axios.put("/position/level", params).then(res => res.data) };

// 获取职级信息
export const ApiGetLevel = params => { return axios.get("/position/level/" + params).then(res => res.data) }

// 删除职级
export const ApiDeletePositionLe = params => { return axios.delete("/position/level/" + params).then(res => res.data) };
