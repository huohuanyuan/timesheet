import axios from 'axios'

// 角色
//检索权限配置模板
export const ApiGetRoleTemplate = query => { return axios.get("/role/template", { params: query }).then(res => res.data) };
// 新增角色
export const ApiPostRole = params => { return axios.post("/role", params).then(res => res.data) };
// 角色列表
export const ApiGetRoles = query => { return axios.get("/role/list", { params: query }).then(res => res.data) };
// 角色删除
export const ApiDeletRole = params => { return axios.delete("/role/" + params).then(res => res.data) };
// 角色修改
export const ApiPutRole = params => { return axios.put("/role", params).then(res => res.data) };
// 角色详情
export const ApiGetRoleCon = query => { return axios.get("/role/" + query).then(res => res.data) };
//权限分配
export const ApiGetRolePrivilege = query => { return axios.get("/role/privilege/" + query).then(res => res.data) };
// 修改权限
export const ApiPutPrivilege = params => { return axios.put("/role/privilege", params).then(res => res.data) };

