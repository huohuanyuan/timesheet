/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:16:51 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-11-02 10:40:29
 * @instructions 登陆页面 
 */

<template>
  <div class="wrap-login">
    <div class="wrap">
      <div class="login-img">
        <img src="./../common/img/lg-bg2.png" alt="">
      </div>
      <transition name="fade">
        <div class="login" v-if="loginShow" @keydown.enter="postLogin('formLogin')">
          <h2>工 时 管 理 系 统</h2>
          <p>登 录 到 您 的 账 户</p>
          <Form ref="formLogin" :model="formLogin" :rules="ruleInline">
            <Form-item prop="username">
              <Input size="large" type="text" v-model.trim="formLogin.username" placeholder="账号">
              </Input>
            </Form-item>
            <Form-item prop="password">
              <Input size="large" type="password" v-model.trim="formLogin.password" placeholder="密码">
              </Input>
            </Form-item>
            <FormItem>
              <Button type="primary" @click="postLogin('formLogin')" long>登录</Button>
            </FormItem>
          </Form>
          <div @click="showLogin()">
            <Icon type="locked"></Icon>
            <a>忘记密码？</a>
          </div>
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div class="reset" v-if="resetShow" @keydown.enter="putResetPwd('formReset')">
          <h2> 重 置 密 码 </h2>
          <Form ref="formReset" :model="formReset" :rules="resetLine">
            <Form-item prop="username">
              <Input size="large" type="text" v-model.trim="formReset.username" placeholder="账号">
              </Input>
            </Form-item>
            <Form-item prop="verifyCode">
              <Input size="large" type="text" v-model.trim="formReset.verifyCode" placeholder="验证码">
              </Input>
              <Button type="primary" shape="circle" @click="postForgetPwd('formReset')">发送验证码</Button>
            </Form-item>
            <Form-item prop="password">
              <Input size="large" type="password" v-model.trim="formReset.password" placeholder="请输入您的新密码">
              </Input>
            </Form-item>
            <Form-item prop="resetPwd">
              <Input size="large" type="password" v-model.trim="formReset.resetPwd" placeholder="请再次输入您的新密码">
              </Input>
            </Form-item>
            <FormItem>
              <Button type="primary" @click="putResetPwd('formReset')" long>确认</Button>
              <Button type="text" @click="showReset('formReset')" long style="top: 40px">返回</Button>
            </FormItem>
          </Form>
        </div>
      </transition>

      <transition name="fade">
        <div class="one-login" v-if="oneLoginShow" @keydown.enter="putOnePwd('formOneLogin')">
          <h2>为了您的账号安全，请修改密码</h2>
          <Form ref="formOneLogin" :model="formOneLogin" :rules="ruleOneInline">
            <Form-item prop="oldPwd">
              <Input size="large" type="password" v-model.trim="formOneLogin.oldPwd" placeholder="请输入旧密码">
              </Input>
            </Form-item>
            <Form-item prop="newPwd">
              <Input size="large" type="password" v-model.trim="formOneLogin.newPwd" placeholder="请输入您的新密码">
              </Input>
            </Form-item>
            <Form-item prop="resetNewPwd">
              <Input size="large" type="password" v-model.trim="formOneLogin.resetNewPwd" placeholder="请再次输入您的新密码">
              </Input>
            </Form-item>
            <FormItem>
              <Button type="primary" @click="putOnePwd('formOneLogin')" long>确认</Button>
              <Button type="text" @click="showOneLogin('formOneLogin')" long style="top: 45px">返回</Button>
            </FormItem>
          </Form>
        </div>
      </transition>
    </div>
    <p  class="footer"> <a href="http://www.miitbeian.gov.cn"> 沪ICP备18012833号-3 </a></p>
  </div>
</template>
<script>
import { postLogin, postForgetPwd, putResetPwd, putOnePwd } from "@/api/api";
import qs from "qs";
import axios from "axios";
import Cookies from "js-cookie";
import md5 from "js-md5";
import util from "common/js/util.js";
import pwdValidate from "common/js/pwdValidate";
import { resCode } from "@/api/code";
export default {
  data() { 
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入您的密码!"));
      } else if (value !== this.formReset.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    const validateOnePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入您的密码!"));
      } else if (value !== this.formOneLogin.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginShow: true,
      resetShow: false,
      oneLoginShow: false,
      formLogin: {
        username: "",
        password: ""
      },
      formReset: {
        username: "",
        verifyCode: "",
        password: "",
        resetPwd: ""
      },
      formOneLogin: {
        oldPwd: "",
        newPwd: "",
        resetNewPwd: ""
      },
      ruleInline: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      },
      resetLine: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        verifyCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ],
        password: [
          ...pwdValidate
       
        ],
        resetPwd: [{ validator: validatePassCheck, trigger: "blur" }]
      },
      ruleOneInline: {
        oldPwd: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        newPwd: [
          ...pwdValidate      
        ],
        resetNewPwd: [{ validator: validateOnePassCheck, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 登陆
    postLogin(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          var data = {
            email: this.formLogin.username,
            pwd: md5(this.formLogin.password)
          };
          postLogin(qs.stringify(data)).then(function(res) {
            if (res.code == "success") {
              //在cookie中保存用户id 公司id 部门id
              Cookies.set("user", res.data.staff.name);
              Cookies.set("staffId", res.data.staff.staffId);
              Cookies.set("companyId", res.data.staff.companyId);
              Cookies.set("deptId", res.data.staff.deptId);
              _this.$router.push({ name: "HOME" });
              _this.$Message.success("成功!");
              //保存menuList
              localStorage.setItem("menuList", JSON.stringify(res.data.menu));
              //保存一级权限list
              util.setPriList(res.data.menu);
              if (res.data.company) {
                localStorage.setItem(
                  "companyName",
                  res.data.company.companyName
                );
                localStorage.setItem(
                  "companyLogoUrl",
                  res.data.company.resourcePath
                );
                localStorage.setItem("url", res.data.company.url);
              }
              // localStorage.setItem("avatarUrl", res.data.staff.avatarPath);
              localStorage.setItem("email", res.data.staff.email);
              localStorage.setItem("name", res.data.staff.name);
              localStorage.setItem("token", res.data.token);
            } else if (res.code == "expired") {
              _this.showOneLogin(name);
              localStorage.setItem("token", res.data.token);
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    // 忘记密码
    postForgetPwd(name) {
      if (this.formReset.username === "") {
        this.$Message.error("请填写账号，用于接收验证码!");
        return false;
      } else {
        var data = {
          email: this.formReset.username
        };
        let _this = this;
        postForgetPwd(qs.stringify(data)).then(function(res) {
          if (res.code == "success") {
            _this.$Message.success("验证码已发送至邮箱,请注意接收!");
          } else if (res.code == "fail") {
            _this.$Message.error("验证码发送失败!");
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    // 修改密码
    putResetPwd(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var data = {
            email: this.formReset.username,
            pwd: md5(this.formReset.password),
            verifyCode: this.formReset.verifyCode
          };
          let _this = this;
          putResetPwd(qs.stringify(data)).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("修改成功!");
              _this.showReset(name);
            } else if (res.code == "fail") {
              _this.$Message.error("修改失败!");
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    // 第一次修改密码
    putOnePwd(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var data = {
            oldPwd: md5(this.formOneLogin.oldPwd),
            pwd: md5(this.formOneLogin.newPwd)
          };
          let _this = this;
          putOnePwd(qs.stringify(data)).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("修改成功!");
              _this.showOneLogin(name);
            } else if (res.code == "fail") {
              _this.$Message.error("修改失败!");
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    },
    showLogin() {
      this.loginShow = !this.loginShow;
      this.resetShow = !this.resetShow;
    },
    showReset(name) {
      this.loginShow = !this.loginShow;
      this.resetShow = !this.resetShow;
      this.$refs[name].resetFields();
    },
    showOneLogin(name) {
      this.loginShow = !this.loginShow;
      this.oneLoginShow = !this.oneLoginShow;
      this.$refs[name].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.wrap-login {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url("./../common/img/lg-bg1.png") no-repeat;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
  .footer{
    width: 100%;
    position: fixed;
    bottom: 0;
    text-align: center;
    padding: 10px;
    font-size: 14px;
    a{
      color: #495060;
    }
  }
}
.wrap {
  width: 70%;
  margin: 120px auto;
  position: relative;
}
.login-img {
  width: 65%;
  height: 370px;
  display: inline-block;
}
.login-img img {
  width: 100%;
  height: 100%;
}
.login,
.reset,
.one-login {
  width: 33%;
  height: 370px;
  display: inline-block;
  background: #fff;
  padding: 15px;
  text-align: center;
  position: absolute;
  top: 0%;
  left: 67%;
  h2 {
    margin-top: 25px;
  }
  p {
    margin-bottom: 20px;
  }
}
.reset {
  h2 {
    margin: 5px 0;
  }
  .ivu-form-item-content {
    .ivu-btn {
      padding: 4px 15px;
      position: absolute;
      top: 4px;
      right: 5px;
    }
  }
}
.one-login {
  h2 {
    margin-bottom: 20px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>