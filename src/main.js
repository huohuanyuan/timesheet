import Vue from 'vue'
import App from './App'

import 'common/css/index.scss';


import {router} from './router/index'
import {appRouter}from './router/router'

import store from './store';
import moment from "moment";
import BaiduMap from 'vue-baidu-map';

//导入 iview
import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView);

// 导入 element 的table 组件
import {
  Table,
  TableColumn,
  Cascader
} from 'element-ui';
Vue.use(Table);
Vue.use(TableColumn);
//导入 element 的 Carousel组件
Vue.use(Cascader);


// 百度地图
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'TFGUKfDjqficY27C7P9v496z9TTt2Vig'
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  },
  // 组件实例创建完成，属性已经绑定，但是 DOM还没有生成，$el 属性还不存在
  created() {
    let tagsList = [];
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }
})

//过滤器
/**
 * 时间过滤函数
 * @param { Date } value：需要过滤的时间
 * @param { String }formatString：过滤后的格式，默认“YYYY-MM-DD”
 * @return 格式化后的时间，当value为空时返回的字段，默认返回"--"
 */
Vue.filter('moment', function (value, formatString, nullMsg) {
  formatString = formatString || 'YYYY-MM-DD';
  nullMsg = nullMsg || "--";
  if (value) {
    return moment(value).format(formatString);
  } else {
    return nullMsg
  }

})
