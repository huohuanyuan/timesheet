import axios from 'axios'

// 获取所有的版本控制信息
export const ApiGetAppVersion = query => { return axios.get("/app/version", { params: query }).then(res => res.data) };

// 获取指定的版本控制信息详情
export const ApiGetAppVersionCon = query => { return axios.get("/app/version/" + query).then(res => res.data) };

// 修改 信息保存提交
export const ApiPutAppVersion = query => { return axios.put("/app/version", query ).then(res => res.data) };
