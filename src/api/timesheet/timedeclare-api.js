import axios from 'axios'

//工时登记
//查看工单列表
export const ApiGetDeclareSheetList = query => {return axios.get("/tsheet/forms/staff",{params:query}).then(res => res.data)};
//获取申报周期列表
export const ApiGetTsheetCycle = query => { return axios.get("/tsheet/cycles", { params: query }).then(res => res.data) };
//获取个人有效工时
export const ApiGetStaffValidTime = query => { return axios.get("/tsheet/form/eff_hour", { params: query }).then(res => res.data) };
//获取项目任务列表
export const ApiGetProTaskList = query => { return axios.get("/proj/task/staff/approver", { params: query }).then(res => res.data) };

//新增保存工时信息
export const ApiPostTsheetSave = params => { return axios.post("/tsheet/form/dailies", params).then(res => res.data) };
//修改保存工时信息
export const ApiPutTsheetSave = params => { return axios.post("/tsheet/update/form/dailies", params).then(res => res.data) };

//新增工时申报
export const ApiPostTsheetDeclare = params => { return axios.post("/tsheet/form/dailies/declare", params).then(res => res.data) };
//修改工时并申报
export const ApiPutTsheetDeclare = params => { return axios.post("/tsheet/update/form/dailies/declare", params).then(res => res.data) };

//已经保存的工时申报
export const ApiTsheetDeclare = params => { return axios.put("/tsheet/declare", params).then(res => res.data) };

//查看工单信息
export const ApiGetTsheetDaily = query => { return axios.get("/tsheet/form/dailies", { params: query }).then(res => res.data) };

//撤销申报
export const ApiRepealTsheet = params => { return axios.put("/tsheet/declare/recall",  params).then(res => res.data) };

// 删除申报
export const ApiDeleteTsheetForm = params =>{return axios.delete("/tsheet/form/"+ params).then(res=>res.data)};
