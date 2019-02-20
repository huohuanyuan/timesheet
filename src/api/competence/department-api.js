import axios from 'axios'

// 部门管理
// 部门树
export const ApiGetDepartmentTree = query => { return axios.get("/department/tree", { params: query }).then(res => res.data) };
//新建部门
export const ApiPostDept = params => { return axios.post("/department", params).then(res => res.data) };
//部门列表
export const ApiGetDeptList = query => { return axios.get("/department/all", { params: query }).then(res => res.data) }
//刪除部門
export const ApiDeletDept = params => { return axios.delete("/department/" + params).then(res => res.data) };
//查看部门信息
export const ApiGetDept = query => { return axios.get("/department/" + query).then(res => res.data) };
//获取部门下的员工信息
export const ApiGetDeptStaff = query => { return axios.get("/staff/dept",{ params: query }).then(res => res.data)}
//修改部门信息
export const ApiPutDept = params => { return axios.put("/department", params).then(res => res.data) };
