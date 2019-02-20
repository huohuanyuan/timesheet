/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:56:41 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-02-18 10:07:13
 */
<template>
    <div>
        <template>
            <div style="text-align: center;">
                <Dropdown transfer placement="right-start" @on-click="changeMenu">
                    <Button @click="changeMenu('HOME')" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="24" :type="menuIcon.HOME" color="#fff"></Icon>
                    </Button>
                </Dropdown>
            </div>

        </template>
        <template v-for="(menu, index) in menuList">
            <div style="text-align: center;">
                <Dropdown transfer v-if="menu.children.length !== 1" placement="right-start" :key="menu.menuId" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="24" :type="menuIcon[menu.menuPriv]" color="#fff"></Icon>
                    </Button>
                    <DropdownMenu style="width: 220px;" slot="list">
                        <template v-for="(item, i) in menu.children">
                            <DropdownItem :key="item.menuId" :name="item.menuPriv">
                                <Icon :type="menuIcon[item.menuPriv]"></Icon>
                                <span style="padding-left:10px;">{{ item.title }}</span>
                            </DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu">
                    <Button @click="changeMenu(menu.children[0].name)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="24" :type="menuIcon[menu.children[0].menuPriv]" color="#fff"></Icon>
                    </Button>                 
                </Dropdown>
            </div>
        </template>
    </div>
</template>
<script>
import { menuIcon } from "@/api/code";
export default {
  props: {
    menuList: {
      type: Array,
      required: true
    }
  },
  computed: {
    menuIcon() {
      return menuIcon;
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
    
  }
};
</script>
<style>

</style>


