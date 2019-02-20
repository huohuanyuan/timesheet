import Vue from 'vue'
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import Util from 'common/js/util';
import {
  routers,
  otherRouter,
  appRouter
} from './router';

Vue.use(VueRouter);


export const router = new VueRouter({
  mode: 'history',
  routes: routers
})
//全局导航钩子
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem("token")) {
    const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
    const priList = Cookies.get('priList') ? JSON.parse(Cookies.get('priList')) : [];
    if (curRouterObj && curRouterObj.meta.requireAuth) { //判断需要权限的路由
      //判断是否有权限跳转到此页面
      if (priList.includes(curRouterObj.name)) {
        Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
      } else {
        next({
          replace: true,
          name: 'error403'
        });
      }
    } else { //没有权限验证，直接通过    
      Util.toDefaultPage([...routers], to.name, router, next);
    }
    if (to.matched.length === 0) { //如果未匹配到路由
      from.name ? next({
        name: from.name
      }) : next('/'); //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
    }
  }
  else if (to.name == "testLogin") {
    next();
  }
})

router.afterEach((to) => {
  Util.openNewPage(router.app, to.name, to.params, to.query);
});
