import axios from 'axios'

//检索项目员工的工单
export const ApiGetStaffTimeList = query => { return axios.get("/tsheet/line/cycles", { params: query }).then(res => res.data) };

//检索工单详情
export const ApiGetFormInfo = query => { return axios.get("/tsheet/cycle/forms/dailies", { params: query }).then(res => res.data) };
