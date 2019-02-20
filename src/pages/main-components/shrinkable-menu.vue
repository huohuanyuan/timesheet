/*
 * @Author: chengshanshan 
 * @Date: 2018-07-05 11:29:55 
 * @Last Modified by:   chengshanshan 
 * @Last Modified time: 2018-07-05 11:29:55 
 */

<template>
  <div>
    <sidebar-menu :menu-list="menuList" :open-names="openNames" v-show="!shrink"></sidebar-menu>
    <sidebar-menu-shrink :menu-list="menuList" v-show="shrink"></sidebar-menu-shrink>
  </div>
</template>
<script>
import sidebarMenu from "./components/sidebar-menu";
import sidebarMenuShrink from "./components/sidebar-menu-shrink";
export default {
  props: {
    menuList: {
      type: Array,
      required: true
    },
    shrink: {
      type: Boolean,
      default: false
    },
    openNames: {
      type: Array
    }
  },
  components: {
    sidebarMenu,
    sidebarMenuShrink
  }
};
</script>

