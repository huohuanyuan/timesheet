import axios from './https'
import qs from 'qs';
import Cookies from "js-cookie";
// 交换token
export const changeToken = params => {
	return axios({
		method: "post",
		url: "/login/ipms",
		headers:{Authorization:Cookies.get("token")},//获取平台token
	  }).then(res => res.data)
}

// 字典方法
export const ApiGetDict = query => { return axios.get("/dict/" + query).then(res => res.data) };
//国家信息
export const ApiGetCountry = query => { return axios.get("/region/country/all",{ params: query }).then(res => res.data) };
//城市信息
export const ApiGetCity = query => { return axios.get("/region/city/all/" + query).then(res => res.data) };
//查找权限
export const ApiGetPrivilege = params => { return axios.get("/role/operation/privileges/"+params).then(res => res.data) };

// 请求logo
export const ApiGetCompanyLogo = params => {
  return axios({
    method: "get",
    url: `company/pc/logo/${ params.companyId}`,
    responseType: "arraybuffer"
  }).then(res => res.data)
};
export const ApiGetStaffAvater = params => {
  return axios({
    method: "get",
    url: `staff/avatar/pc/${ params.staffId}`,
    responseType: "arraybuffer"
  }).then(res => res.data)
};


// 登录
export const postLogin = params => { return axios.post("/login", params).then(res => res.data) };
// 登出
export const getLogOut = query => { return axios.get("/logout", { params: query }).then(res => res.data) };
// 获取验证码
export const postForgetPwd = params => { return axios.post("/pwd", params).then(res => res.data) };
// 重置密码
export const putResetPwd = params => { return axios.put("/pwd", params).then(res => res.data) };
// 第一次登陆修改密码
export const putOnePwd = params => { return axios.put("/staff/pwd", params).then(res => res.data) };


export default  Request =  {
	POST(url, data){
		return new Promise((resolve, reject)=>{
			axios({
				method:'POST',
				url:url,
				data:qs.stringify(data),
			}).then((res)=>{
				resolve(res.data);
			}).catch((err)=>{
				reject(err);
			})
		})
	},
	GET(url){
		return new Promise((resolve, reject)=>{
			axios({
				methods:'GET',
				url:url,
			}).then((res)=>{
				resolve(res.data);
			}).catch((err)=>{
				reject(err)
			});
		})
	},
	PUT(url, data){
		return new Promise((resolve, reject)=>{
			axios({
				method:'PUT',
				url:url,
				// headers: { 'content-type': 'application/x-www-form-urlencoded' },
				data:qs.stringify(data),
			}).then((res)=>{
				resolve(res.data)
			}).catch((err)=>{
        reject(err)
			})
		})
	},
	DELETE(url, data){
		return new Promise((resolve, reject)=>{
			axios({
				method:'DELETE',
				url:url,
				data:qs.stringify(data),
			}).then((res)=>{
				resolve(res.data)
			}).catch((err)=>{
				reject(err)
			})
		})
	},
}


// Request;
