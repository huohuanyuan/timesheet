/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-05 11:05:44 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-12-26 14:12:27
 */
import Cookies from 'js-cookie';

let util = {};

//保存一级权限
util.setPriList = function (menuList) {
  let priList = [];
  if (Array.isArray(menuList)) {
    for (let i = 0; i < menuList.length; i++) {
      priList.push(menuList[i].menuPriv);
      if (menuList[i].children && menuList[i].children.length > 0) {
        let child = menuList[i].children;
        for (let k = 0; k < child.length; k++) {
          priList.push(child[k].menuPriv);
        }
      }
    }
  }
  Cookies.set("priList", priList)
}
/**
 * @method 返回每一个router的title
 * @param  { Object }  vm   VueComponent 对象
 * @param  { Object } name   当前路由的 name
 */
util.handleTitle = function (vm, item) {
  return item.title;
};

/**
 * @method 点击路由触发,返回当前router对象
 * @param  { Array }  routers 获取到所有的 router
 * @param  { String } name     当前路由的 name
 */
util.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null;
  }
  let routerObj = null;
  for (let item of routers) {
    if (item.name === name) {
      return item;
    }
    routerObj = util.getRouterObjByName(item.children, name);
    if (routerObj) {
      return routerObj;
    }
  }
  return null;
};

/**
 * @method 点击router触发，如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
 * @param  { Array } routers  获取到所有的 router
 * @param  { String }  name   当前路由的 name
 * @param  { Object } router  VueRouter 实例对象
 * @param  { Fun }    next    vue-router 里面的方法
 * 
 */
util.toDefaultPage = function (routers, name, route, next) {
  let len = routers.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    next();
  }
};

/**
 *  @method 面包屑导航 
 *  @param  {Object}   vm 当前的Vue 实例对象
 *  @param  {string}   name当前 router的 name 属性
 */
util.setCurrentPath = function (vm, name) {
  let title = '';
  let isOtherRouter = false;
  vm.$store.state.app.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === 'otherRouter') {
          isOtherRouter = true;
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === 'otherRouter') {
            isOtherRouter = true;
          }
        }
      });
    }
  });
  let currentPathArr = [];
  if (name === 'HOME') {
    currentPathArr = [{
      title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'HOME')),
      path: '',
      name: 'HOME'
    }];
  } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'HOME') {
    currentPathArr = [{
        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'HOME')),
        path: '/home',
        name: 'HOME'
      },
      {
        title: title,
        path: '',
        name: name
      }
    ];
  } else {
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name;
      } else {
        let i = 0;
        let childArr = item.children;
        let len = childArr.length;
        while (i < len) {
          if (childArr[i].name === name) {
            return true;
          }
          i++;
        }
        return false;
      }
    })[0];
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [{
        title: '首页',
        path: '',
        name: 'HOME'
      }];
    } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
      currentPathArr = [{
          title: '首页',
          path: '/home',
          name: 'HOME'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: name
        }
      ];
    } else {
      let childObj = currentPathObj.children.filter((child) => {
        return child.name === name;
      })[0];
      currentPathArr = [{
          title: '首页',
          path: '/home',
          name: 'HOME'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name
        },
        {
          title: childObj.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: name
        }
      ];
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr);
  return currentPathArr;
};

/**
 * @method 打开新的标签页调用，返回当前已经打开所有的tags标签
 * @param   {Object}    vm 当前的Vue 实例对象
 * @param   {string}    name 当前打开 router的 name 属性
 * @param   {Object}    argu
 * @param   {Object}    query
 * */
util.openNewPage = function (vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList;
  let openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) { // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter((item) => {
      if (item.children) {
        return name === item.children[0].name;
      } else {
        return name === item.name;
      }
    });
    tag = tag[0];
    if (tag) {
      tag = tag.children ? tag.children[0] : tag;
      if (argu) {
        tag.argu = argu;
      }
      if (query) {
        tag.query = query;
      }
      vm.$store.commit('increateTag', tag);
    }
  }
  vm.$store.commit('setCurrentPageName', name);
};

export default util;
