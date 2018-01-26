import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from '@/views/GoodsList'  // 商品列表
import Cart from '@/views/Cart'  // 购物车列表
import Address from '@/views/Address'  // 地址列表
import OrderConfirm from '@/views/OrderConfirm'  // 订单确认页面
import OrderSuccess from '@/views/OrderSuccess'  //  订单成功页面

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',   // 购物车列表路由
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',   // 地址列表路由
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfirm',   // 订单确认页面路由
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',   // 订单成功頁面
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
