<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {
    changeToken
  } from "@/api/api";
  import Cookies from "js-cookie";
  import util from "common/js/util.js";
  import axios from "axios";
  export default {
    name: "app",
    created() {
      //交换token
      var name = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
      if (name == "testLogin") {
        return false;
      }
      if (sessionStorage.getItem("token") == null) {
        //如果本地taken不存在则重新向后台请求
        changeToken().then(res => {
          if (res.code == "success") {
            //在cookie中保存用户id 公司id 部门id
            Cookies.set("user", res.data.staff.name);
            Cookies.set("staffId", res.data.staff.staffId);
            Cookies.set("companyId", res.data.staff.companyId);
            Cookies.set("deptId", res.data.staff.deptId);
            sessionStorage.setItem("token", res.data.token); //交换后的token存出道localStorage中
            axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("token");
  
            //保存menuList
            localStorage.setItem("menuList", JSON.stringify(res.data.menu));
            //保存一级权限list
            util.setPriList(res.data.menu);
            if (res.data.company) {
              localStorage.setItem("companyName", res.data.company.companyName);
              localStorage.setItem(
                "companyLogoUrl",
                res.data.company.resourcePath
              );
              localStorage.setItem("url", res.data.company.url);
            }
            localStorage.setItem("email", res.data.staff.email);
            localStorage.setItem("name", res.data.staff.name);
            this.$router.push({
              name: "HOME"
            });
          }
        });
      }
    },
  };
</script>

<style>
  html {
    height: 100%;
  }
  
  body {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }
  
  ul {
    list-style: none;
  }
  
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
</style>
