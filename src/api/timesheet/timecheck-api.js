import axios from 'axios'

//查看审批工单列表
export const ApiGetCheckList = query => {return axios.get("/tsheet/forms/approver",{params:query}).then(res => res.data)};
//审批工单
export const ApiPostTsheetApproval = params => { return axios.post("/tsheet/form/apv", params).then(res => res.data) };
//查看审批轨迹
export const ApiGetCheckPath= query => { return axios.get("/tsheet/form/apv/" + query).then(res => res.data) };
//解锁工单
export const ApiUnlockTsheet = params => { return axios.put("/tsheet/form/apv", params).then(res => res.data) };
