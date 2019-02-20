import axios from 'axios'

//检索项目员工的工单
export const ApiGetProStaffTimeList = query => { return axios.get("/tsheet/project/cycles", { params: query }).then(res => res.data) };

//检索当前用户作为项目经理的所有项目
export const ApiGetProList = query => { return axios.get("/proj/belong/manager", { params: query }).then(res => res.data) };
//检索周期下的员工有效工单详细(含有审批意见)
export const ApiGetFormInfoOpinion = query => { return axios.get("/tsheet/cycle/forms/dailies/opinion", { params: query }).then(res => res.data) };

//新增审批意见
export const ApiPostOption = query => { return axios.post("/tsheet/opinion", query ).then(res => res.data) };
//修改 删除审批意见
export const ApiPutOption = query => { return axios.put("/tsheet/opinion",  query ).then(res => res.data) };

//获取工单的所有意见
export const ApiGetOpinionList = query => { return axios.get("/tsheet/opinion/"+ query ).then(res => res.data) };
