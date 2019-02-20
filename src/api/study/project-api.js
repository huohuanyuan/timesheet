import axios from 'axios'

//项目管理
// 项目列表
export const ApiGetProj = query => { return axios.get("/proj", { params: query }).then(res => res.data) };
// 新建项目
export const ApiPostProj = params => { return axios.post("/proj", params).then(res => res.data) };
// 项目模板
export const ApiGetProjTemplate = query => { return axios.get("/proj/template", { params: query }).then(res => res.data) };
// 修改项目
export const ApiPutProj = params => { return axios.put("/proj", params).then(res => res.data) };
// 删除项目
export const ApiDeletProj = params =>{return axios.delete("/proj/"+ params).then(res=>res.data)};
// 下拉列表角色检索
export const ApiGetRoleCategory = query => { return axios.get("/role/category/study", { params: query }).then(res => res.data) }
//项目经理
export const ApiGetProjManagers = query => { return axios.get("/proj/managers", { params: query }).then(res => res.data) };


// 项目详情
export const ApiGetProjCon = query => { return axios.get("/proj/"+query).then(res => res.data) };
// 项目下的责任部门
export const ApiGetProjDept = query => { return axios.get("/proj/dept",{ params: query } ).then(res => res.data) };
// 项目下添加部门
export const ApiPostProjDept = params =>{return axios.post("/proj/dept",params).then(res=>res.data)};
// 项目删除部门
export const ApiDeletProjDept = params =>{return axios.delete("/proj/dept/"+ params).then(res=>res.data)};

// 项目下的客户
export const ApiGetProjCli = query => { return axios.get("/proj/cli",{ params: query }).then(res => res.data) };
// 项目下的员工
export const ApiGetProjStaff = query => { return axios.get("/proj/staff",{ params: query } ).then(res => res.data) };

//项目中添加客户
export const ApiPostProjCli = params =>{return axios.post("/proj/cli",params).then(res=>res.data)};
// 项目中删除客户
export const ApiDeletProjCli = params =>{return axios.delete("/proj/cli/"+ params).then(res=>res.data)};

//项目中删除员工
export const ApiDeletProjStaff = params =>{return axios.delete("/proj/staff/"+ params).then(res=>res.data)};
// 项目下可选择添加的员工
export const ApiGetProjStaffUnallocated = query => { return axios.get("/proj/staff/unallocated",{ params: query } ).then(res => res.data) };
// 项目添加员工
export const ApiPostProjStaff = params =>{return axios.post("/proj/staff",params).then(res=>res.data)};
// 修改员工信息
export const ApiPutPorjStaff = params => { return axios.put("/proj/staff", params).then(res => res.data) };

// 新增项目任务
export const ApiPostProjTask = params =>{return axios.post("/proj/task",params).then(res=>res.data)};

// 导出
export const ApiGetReportProjectExport = params => {
  return axios({
    method: "get",
    url: `/report/project/export?projectName=${
            params.projectName
            }&contractCode=${params.contractCode}
            &projManagerName=${params.projManagerName}
            &projInspectorName=${params.projInspectorName}`,
    responseType: "blob"
  }).then(res => res.data)
};