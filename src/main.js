// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'  // 懒加载
import infiniteScroll from 'vue-infinite-scroll'  // 滚动加载
Vue.use(infiniteScroll)

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.config.productionTip = false

Vue.use(VueLazyLoad,{
    loading:"/static/loading-svg/loading-bars.svg"
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
