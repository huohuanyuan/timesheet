<template>
    <div>
        <Input size="large" type="text" v-model.trim="text" placeholder="账号"> </Input>
        <Button type="primary" @click="textLogin" long>确认</Button>
    
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from "js-cookie";
    import util from "common/js/util.js";

    export default {
        data() {
            return {
                text: ""
            };
        },
        methods: {
            textLogin() {
                let _this  = this;
                if (this.text != "") {
                    axios({
                        method: "post",
                        url: "/login/ipms",
                        headers: {
                            Authorization: _this.text
                        } //获取平台token
                    }).then(res => {
                        if (res.data.code == "success") {
                            //在cookie中保存用户id 公司id 部门id
                            Cookies.set("user", res.data.data.staff.name);
                            Cookies.set("staffId", res.data.data.staff.staffId);
                            Cookies.set("companyId", res.data.data.staff.companyId);
                            Cookies.set("deptId", res.data.data.staff.deptId);
                            sessionStorage.setItem("token", res.data.data.token); //交换后的token存出道localStorage中
                            axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("token");
    
                            //保存menuList
                            localStorage.setItem("menuList", JSON.stringify(res.data.data.menu));
                            //保存一级权限list
                            util.setPriList(res.data.data.menu);
                            if (res.data.data.company) {
                                localStorage.setItem("companyName", res.data.data.company.companyName);
                                localStorage.setItem(
                                    "companyLogoUrl",
                                    res.data.data.company.resourcePath
                                );
                                localStorage.setItem("url", res.data.data.company.url);
                            }
                            localStorage.setItem("email", res.data.data.staff.email);
                            localStorage.setItem("name", res.data.data.staff.name);
                            _this.$router.push({
                                name: "HOME"
                            });
                        }
                    });
                }
            }
        }
    };
</script>

