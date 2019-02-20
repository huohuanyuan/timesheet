import axios from 'axios'
import Cookies from "js-cookie";import {
  DOMAIN_IPMS
} from "common/js/constant.js";

axios.defaults.baseURL = 'http://192.168.1.48:8086/st'; 
// axios.defaults.baseURL = 'https://gateway.m-clinical.cn/time/st';
axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("token")
/**
 * 拦截响应response，并做一些错误处理
 */
axios.interceptors.response.use((response) => {
  let varData = response.data;
  if (varData) {
    switch (varData.code) {
      case 'success':
        //处理相关业务
        return response;
      case 'offline':
        //写相关需要登录的代码
        //replace() 方法不会在 History 对象中生成一个新的记录。当使用该方法时，新的 URL 将覆盖 History 对象中的当前记录。
        Cookies.remove("user");
        sessionStorage.removeItem("token");
        localStorage.removeItem("menuList");
        localStorage.removeItem("companyName");
        localStorage.removeItem("resourcePath");
        localStorage.removeItem("url");
        localStorage.removeItem("avatarPath");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        localStorage.removeItem("pageOpenedList");    
        window.location.href = DOMAIN_IPMS;  
        break
      default:
    }
    return response;
  }
  // else {
  //   const err = new Error("未知错误，请重试")
  //   err.varData = varData
  //   err.response = response
  //   throw err
  // }
  // 根据返回的code值来做不同的处理（和后端约定）
}, (err) => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求参数错误'
        break
      case 401:
        // Cookies.remove("user");
        // sessionStorage.removeItem("token");
        // window.location.href = DOMAIN_IPMS;       
        break;
      case 403:
        err.message = '跨域拒绝访问'
        break

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器内部错误'
        break

      case 501:
        err.message = '服务未实现'
        break

      case 502:
        err.message = '网关错误'
        break

      case 503:
        err.message = '服务不可用'
        break

      case 504:
        err.message = '网关超时'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break

      default:
    }
  }
  return Promise.reject(err)
})

export default axios
