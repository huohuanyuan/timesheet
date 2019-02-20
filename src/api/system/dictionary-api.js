import axios from 'axios'

// 请求左侧列表树
export const ApiGetDict = query => { return axios.get("/dict", { params: query }).then(res => res.data) };
// 请求 右侧table
export const ApiGetDictCon = query => { return axios.get("/dict/"+ query ).then(res => res.data) };
// 新建
export const ApiPostDict = params => { return axios.post("/dict", params).then(res => res.data) };
// 删除
export const ApiDeletDict = params => { return axios.delete("/dict/" + params).then(res => res.data) };
// 请求详情
export const ApiGetDictDictionaryId = query => { return axios.get("/dict/dictionaryId/"+ query ).then(res => res.data) };
// 修改完成，保存信息
export const ApiPutDict = params => { return axios.put("/dict", params).then(res => res.data) };
