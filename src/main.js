// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueLazyLoad from 'vue-lazyload'  // 懒加载
import infiniteScroll from 'vue-infinite-scroll'  // 滚动加载
Vue.use(infiniteScroll)

import Vuex from 'vuex'
Vue.use(Vuex);

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.config.productionTip = false

Vue.use(VueLazyLoad,{
    loading:"/static/loading-svg/loading-bars.svg"
})

// import {currency} from './util/currency'
// Vue.filter("currency",currency);  // 定义全局过滤器


// 建立store对象
const store = new Vuex.Store({
  state: {
    nickName:'',  // 用户名
    cartCount:0  // 购物车数量
  },
  mutations: {  // 更改状态
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
        state.cartCount = cartCount;
    }
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store, // 使用store
  router,
  template: '<App/>',
  components: { App }
})
