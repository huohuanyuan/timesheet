import axios from 'axios'

// home页面
//首页获取公告列表
export const ApiGetAnnoList = query => { return axios.get("/anno/staff/list", { params: query }).then(res => res.data) };
//获取公告信息
export const ApiGetAnno = query => { return axios.get("/anno/" + query).then(res => res.data) };
//检索待办任务
export const ApiGetUpcomingList = query => { return axios.get("/upcoming", { params: query }).then(res => res.data) };
