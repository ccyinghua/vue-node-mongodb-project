## 地址模块实现

### 一、地址列表渲染

购物车列表页中点击checkout结账，若已勾选的商品为0，则不可以点击。

src/views/Cart.vue

```
<a class="btn btn--red" v-bind:class="{'btn--dis':checkedCount==0}" @click="checkOut">Checkout</a>

methods:{
    checkOut(){    // 结账
        if(this.checkedCount>0){   // 已勾选的商品种数>0时才可以跳转到地址列表页
            this.$router.push(  // 跳转到地址列表页
                {path:"/address"}
            );
        }
    }
}

```
未勾选时状态：<br>
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/1.jpg?raw=true) <br>
勾选时状态：<br>
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/2.jpg?raw=true)

新建地址列表组件src/views/Address.vue,添加路由配置src/router/index.js

```javascript
import Address from '@/views/Address'  // 地址列表
export default new Router({
  routes: [
    {
      path: '/address',   // 地址列表路由
      name: 'Address',
      component: Address
    }
  ]
})

```
















