import axios from 'axios'

// 项目任务列表
export const ApiGetProjTaskList = query => { return axios.get("/proj/task/list",{ params: query } ).then(res => res.data) };
// 项目任务修改
export const ApiPutPorjTask = params => { return axios.put("/proj/task", params).then(res => res.data) };
// 项目删除任务
export const ApiDeletProjTask = params =>{return axios.delete("/proj/task/"+ params).then(res=>res.data)};
// 项目任务模板
export const ApiGetProjTaskTemplate = query => { return axios.get("/proj/task/template",{ params: query }).then(res => res.data) };
// 项目任务详情
export const ApiGetProjTaskTemplateCon = query => { return axios.get("/proj/task/"+ query ).then(res => res.data) };

// 下载模版
export const ApiGetReportTemplateTask = params => {
  return axios({
    method: "get",
    url: `/report/template/projectTaskTemplete`,
    responseType: "blob"
  }).then(res => res.data)
};

// 导出
export const ApiGetReportTaskExport = params => {
  return axios({
    method: "get",
    url: `/report/task/export?taskName=${
            params.taskName
            }&taskCode=${params.taskCode}
            &taskStatus=${params.taskStatus}
            &projectName=${params.projectName}`,
    responseType: "blob"
  }).then(res => res.data)
};