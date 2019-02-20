/*
 * @Author: liuhaosheng
 * @Date: 2018-07-02 09:17:21
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-02-18 10:11:22
 * @instructions 主页面
 */

<template>

  <div class="layout">
    <Layout>
      <Header :style="{padding: 0}" class="layout-header-bar">
        <div class="layout-logo">
          <img :src="companyLogoUrl" alt="" :onerror="defaultLogo">
        </div>
        <div class="header-avator-con">
          <ul>
            <li class="header-menu">
              <img class="avatar-img" :src="avatarUrl" :onerror="defaultAvatar">
            </li>
            <li class="header-menu">
              <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{name}}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace"> 个人中心 </DropdownItem>
                  <DropdownItem name="loginout" divided> 返回平台 </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>

            <li class="header-menu">
              <a :href="url" target="_blank">{{companyName}}</a>
            </li>
            <li class="header-menu">
              <a href="/help" target="_blank"> 帮助文档 </a>
            </li>
            <li class="header-menu">
              <a href="/down" target="_blank"> APP下载 </a>
            </li>
          </ul>
        </div>
      </Header>
      <Layout>
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="shrink">
          <shrinkable-menu :menu-list="menuList" :shrink="shrink" :open-names="openedSubmenuArr"></shrinkable-menu>
        </Sider>
        <Content>
          <div class="main-breadcrumb">
            <div class="nav-icon">
              <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="navicon-round" size="24"></Icon>
            </div>
            <!-- 面包屑导航 start-->
            <div class="header-middle-con">
              <div class="main-breadcrumb">
                <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
              </div>
              <div class="declare-btn">
                <Button type="primary" size="small" @click="toDeclarePage">工时申报</Button>
              </div>
            </div>
            <!-- 面包屑导航 end-->
          </div>
          <!-- tags  start-->
          <div class="tags-con">
            <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
          </div>
          <!-- tags start-->
          <div class="main-wrap">
            <router-view></router-view>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>


<script>
import axios from "axios";
import { getLogOut, ApiGetCompanyLogo, ApiGetStaffAvater } from "@/api/api";
import shrinkableMenu from "pages/main-components/shrinkable-menu.vue";
import breadcrumbNav from "pages/main-components/breadcrumb-nav.vue";
import tagsPageOpened from "pages/main-components/tags-page-opened.vue";

import Cookies from "js-cookie";
import util from "common/js/util.js";

import { DOMAIN_IPMS } from "common/js/constant.js";
export default {
  components: {
    shrinkableMenu,
    breadcrumbNav,
    tagsPageOpened
  },
  data() {
    return {
      defaultLogo: 'this.src="' + require("../common/img/d-logo.jpg") + '"',
      defaultAvatar: 'this.src="' + require("../common/img/d-avatar.jpg") + '"',
      shrink: false
    };
  },

  methods: {
    init() {
      //存储现在打开的menu
      this.$store.commit("addOpenSubmenu", this.$route.meta.parents);
      //面包屑导航
      let pathArr = util.setCurrentPath(this, this.$route.name);
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      // tags
      this.checkTag(this.$route.name);
    },
    // 请求公司logo
    getCompanyLogo() {
      let _data = {
        companyId: Cookies.get("companyId")
      };
      ApiGetCompanyLogo(_data)
        .then(res => {
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res).reduce(
                (res, byte) => res + String.fromCharCode(byte),
                ""
              )
            )
          );
        })
        .then(res => {
          if (res != "data:image/png;base64,") {
            this.$store.commit("setCompanyLogoUrl", res);
          }
        });
    },
    // 请求个人头像
    getStaffAvater() {
      let _data = {
        staffId: Cookies.get("staffId")
      };
      ApiGetStaffAvater(_data)
        .then(res => {
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res).reduce(
                (res, byte) => res + String.fromCharCode(byte),
                ""
              )
            )
          );
        })
        .then(res => {
          if (res != "data:image/png;base64,") {
            this.$store.commit("setAvatarUrl", res);
          }
        });
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    handleClickUserDropdown(name) {
      if (name === "ownSpace") {
        this.$router.push({ path: "/ownspace" });
      } else if (name === "loginout") {
        localStorage.removeItem("menuList");
        localStorage.removeItem("companyName");
        localStorage.removeItem("resourcePath");
        localStorage.removeItem("url");
        localStorage.removeItem("avatarPath");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        localStorage.removeItem("pageOpenedList");
        sessionStorage.removeItem("token");
        this.$store.commit("clearAllTags");
        Cookies.remove("user");

        this.$router.push({ name: "lOGIN" });
        window.location.href = DOMAIN_IPMS;
      }
    },
    // 点击 tag 时调用的方法
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    //跳转工时页面
    toDeclarePage: function() {
      this.$router.push({ name: "TS_DCL" });
    }
  },
  watch: {
    $route(to) {
      this.$store.commit("addOpenSubmenu", to.meta.parents);
      localStorage.setItem("currentPageName", to.name);
      // 点击侧边栏监听 router 变化
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      // 监听 tags 点击要跳转的页面
      this.checkTag(to.name);
    }
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.shrink ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.shrink ? "collapsed-menu" : ""];
    },
    openedSubmenuArr() {
      return this.$store.state.app.openedSubmenuArr;
    },
    menuList() {
      return JSON.parse(localStorage.getItem("menuList"));
    },
    companyName() {
      return localStorage.getItem("companyName");
    },
    companyLogoUrl() {
      let url = this.$store.state.app.companyLogoUrl;
      return url;
      //  ? url : this.defaultLogo; ? url : this.defaultAvatar;
    },
    url() {
      return "http://" + localStorage.getItem("url");
    },
    avatarUrl() {
      let url = this.$store.state.app.avatarUrl;
      return url;
    },
    name() {
      return localStorage.getItem("name");
    },
    // 当前面包屑数组
    currentPath() {
      return this.$store.state.app.currentPath;
    },
    // 打开的页面的页面对象  tags
    pageTagsList() {
      return this.$store.state.app.pageOpenedList;
    }
  },
  mounted() {
    this.getStaffAvater();
    this.init();
    this.getCompanyLogo();
  }
};
</script>
<style scoped lang="scss">
.ivu-layout-sider{
      overflow-y: scroll;
      width: 230px !important;
      min-width: 230px !important;
      max-width: 230px !important;
      flex: 0 0 230px !important;
}
.layout {
  background: #f5f7f9;
  position: relative;
  overflow: hidden;
  height: 100%;
}
.ivu-layout {
  height: 100%;
}
.layout-logo {
  width: 220px;
  height: 62px;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 1px;
  img {
    width: 100%;
    height: 100%;
  }
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  position: relative;
  line-height: 0;
  ul {
    list-style: none;
  }
}
.header-avator-con {
  position: absolute;
  right: 0;
  top: 15px;
  line-height: 40px;
  .header-menu {
    float: right;
    margin-right: 20px;
    cursor: pointer;
  }
  .ivu-tooltip-rel {
    height: 40px !important;
  }
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
<style lang="scss">
.avatar-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.main-breadcrumb {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  background: #fff;
  line-height: 50px;
  .nav-icon {
    padding-top: 5px;
  }
  .breadcrumb-nav {
    height: 50px;
  }
  .header-middle-con {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .declare-btn {
      padding: 0 20px;
    }
  }
}
.main-wrap {
  background: #fff;
  margin: 10px 20px 50px 20px;
  padding: 20px;

}
.tags-con {
  height: 40px;
  z-index: -1;
  overflow: hidden;
  background: #f0f0f0;
}
</style>
