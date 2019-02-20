/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:56:35 
 * @Last Modified by:   chengshanshan 
 * @Last Modified time: 2018-07-02 09:56:35 
 */
<template>
  <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" theme="dark" width="auto" @on-select="changeMenu" accordion>
    <MenuItem name="HOME">
    <Icon :type="menuIcon.HOME" :size="17"></Icon>
    <span> 首页</span>
    </MenuItem>
    <Submenu :name="menu.menuPriv" v-for="menu in menuList" :key="menu.menuId">
      <template slot="title">
        <Icon :type="menuIcon[menu.menuPriv]" :size="16"></Icon> {{menu.title}}
      </template>
      <MenuItem :name="item.menuPriv" v-for="item in menu.children" :key="item.menuId">
      <Icon :type="menuIcon[item.menuPriv]" :size="15"></Icon>{{item.title}}</MenuItem>
    </Submenu>
  </Menu>
</template>
<script>
import { menuIcon } from "@/api/code";
export default {
  data() {
    return {};
  },
  computed: {
    menuIcon() {
      return menuIcon;
    }
  },
  props: {
    menuList: {
      type: Array,
      required: true
    },
    openNames: {
      type: Array
    }
  },
  methods: {
    changeMenu(name) {
      this.$router.push({
        name: name,
        query: {
          t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
        }
      });
      if (name == "TS_APV") {
        this.$store.commit("setCheckFilterStatus", "");
      } else if (name == "TS_DCL") {
        this.$store.commit("setDeclareFilterStatus", "");
      }
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  }
};
</script>

