import axios from 'axios'

//获取本公司日期范围
export const ApiGetCaleRange= query => { return axios.get("/cale/range", { params: query }).then(res => res.data) };


// 按星期几设置公司工作日
export const ApiPutWeekday = params => { return axios.put("/cale/weekday", params).then(res => res.data) };

//查看公司月历
export const ApiGetCalendar = (param1,param2)  => { return axios.get("/cale/month/" + param1 + "/" +  param2).then(res => res.data) };
//修改指定日期的工作类型
export const ApiPutSpecialDay = params => { return axios.put("/cale/specific", params).then(res => res.data) };
//重置公司工作日
export const ApiPutRestCalender = params => { return axios.put("/cale/reset", params).then(res => res.data) };

