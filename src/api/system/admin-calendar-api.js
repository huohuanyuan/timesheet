import axios from 'axios'

// 管理员根据年份创建日历模板
export const ApiPostCalender = params => { return axios.post("/cale", params).then(res => res.data) };
//查看模板月历
export const ApiGetTempCalender = (param1,param2)  => { return axios.get("/cale/temp/month/" + param1 + "/" +  param2).then(res => res.data) };
//同步日历给所有公司
export const ApiPostCalenderToCom = params  => { return axios.post("/cale/company", params).then(res => res.data) };
