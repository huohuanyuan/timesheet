
import {
  otherRouter,
  appRouter
} from '@/router/router';


const app = {
  state: {
    cachePage: [],
    openedSubmenuArr: [], // 要展开的菜单数组
    currentPath: [ //面包屑数组
      {
        title: '首页',
        path: '',
        name: 'HOME'
      }
    ],
    // 已经打开的所有 标签
    pageOpenedList: [{
      title: '首页',
      path: '',
      name: 'HOME'
    }],
    currentPageName: '',
    routers: [
      otherRouter,
      ...appRouter
    ],
    // tags 数组
    tagsList: [...otherRouter.children],
    //公司log地址
    companyLogoUrl:"",
    //个人头像地址
    avatarUrl:"",
  },
  mutations: {
    // 面包屑导航
    setCurrentPath(state, pathArr) {
      state.currentPath = pathArr;
    },
    addOpenSubmenu(state, name) {
      
      state.openedSubmenuArr = new Array(name)
    },
    // tags 
    setTagsList(state, list) {
      state.tagsList.push(...list);
    },
    pageOpenedList(state, get) {
      let openedPage = state.pageOpenedList[get.index];
      if (get.argu) {
        openedPage.argu = get.argu;
      }
      if (get.query) {
        openedPage.query = get.query;
      }
      state.pageOpenedList.splice(get.index, 1, openedPage);
      // 把已经打开过的 标签存到 localStorage 下的 pageOpenedList
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    setCurrentPageName(state, name) {
      state.currentPageName = name;
    },
    increateTag(state, tagObj) {
      state.pageOpenedList.push(tagObj);
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    // 关闭当前的  tag 
    removeTag(state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenedList.splice(index, 1);
        }
      });
    },
    // 关闭所有的 tags 
    clearAllTags(state) {
      state.pageOpenedList.splice(1);
      state.cachePage.length = 0;
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    // 关闭其他的 tags
    clearOtherTags(state, vm) {
      let currentName = vm.$route.name;
      let currentIndex = 0;
      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index;
        }
      });
      if (currentIndex === 0) {
        state.pageOpenedList.splice(1);
      } else {
        state.pageOpenedList.splice(currentIndex + 1);
        state.pageOpenedList.splice(1, currentIndex - 1);
      }
      let newCachepage = state.cachePage.filter(item => {
        return item === currentName;
      });
      state.cachePage = newCachepage;
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    //设置公司logo地址
    
    setCompanyLogoUrl(state,url){
      state.companyLogoUrl = url;
    },
    //设置头像地址
    setAvatarUrl(state,url){
      state.avatarUrl = url;
    }
  },
  actions: {
  },
  modules: {
  }
};
export default app;
