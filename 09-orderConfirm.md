## 订单确认模块

### 一、订单列表渲染

新建OrderConfirm.vue订单确认页面，添加路由

src/router/index.js添加路由

```javascript
import OrderConfirm from '@/views/OrderConfirm'  // 订单确认页面

export default new Router({
  routes: [
    {
      path: '/orderConfirm',   // 订单确认页面路由
      name: 'OrderConfirm',
      component: OrderConfirm
    }
  ]
})

```
src/views/OrderConfirm.vue <br>
要获取订单列表，不需要再重新写接口，只需要使用查询购物车列表的接口，提取出购物车列表。在渲染时页面时，判断选中的商品才显示`v-if="item.checked=='1'"`。<br>
对于一些价格数字不要忘记格式化，使用过滤器对价格进行格式化。

```html
<!--列表渲染-->
<ul class="cart-item-list">
    <li v-for="item in cartList" v-if="item.checked=='1'">
        <!-- 商品图片和商品名称 -->
        <div class="cart-tab-1">
            <div class="cart-item-pic">
                <img :src="'/static/'+item.productImage" :alt="item.productName">
            </div>
            <div class="cart-item-title">
                <div class="item-name">{{item.productName}}</div>
            </div>
        </div>
        <!-- 商品单价 -->
        <div class="cart-tab-2">
            <div class="item-price">{{item.salePrice | currency('$')}}</div>
        </div>
        <!-- 商品数量 -->
        <div class="cart-tab-3">
            <div class="item-quantity">
                <div class="select-self">
                    <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                    </div>
                </div>
                <div class="item-stock item-stock-no">In Stock</div>
            </div>
        </div>
        <!-- 商品总金额 -->
        <div class="cart-tab-4">
            <div class="item-price-total">{{(item.salePrice*item.productNum) | currency('$')}}</div>
        </div>
    </li>
</ul>


<!-- Price count -->
<div class="price-count-wrap">
    <div class="price-count">
      <ul>
        <li>
          <span>Item subtotal:</span>  <!-- 订单总金额 -->
          <span>{{subTotal | currency('$')}}</span>
        </li>
        <li>
          <span>Shipping:</span>  <!-- 配送费 -->
          <span>{{shipping | currency('$')}}</span>
        </li>
        <li>
          <span>Discount:</span>  <!-- 折扣 -->
          <span>{{discount | currency('$')}}</span>
        </li>
        <li>
          <span>Tax:</span>   <!-- 税费 -->
          <span>{{tax | currency('$')}}</span>
        </li>
        <li class="order-total-price">
          <span>Order total:</span>   <!-- 用户支付总金额 -->
          <span>{{orderTotal | currency('$')}}</span>
        </li>
      </ul>
    </div>
</div>

```

```javascript
import axios from 'axios'
import {currency} from '@/util/currency.js'  // 对价格格式化的通用方法

export default {
    data(){
      return {
        shipping: 100, // 配送费
        discount:200,  // 折扣
        tax:400,   // 扣税

        subTotal:0,  // 订单总金额(是购物车选中商品的总金额)

        orderTotal:0,  // 总金额+配送费-折扣+税费 = orderTotal用户需要支付的金额,默认为0

        cartList:[]  // 购物车列表
      }
    },
    mounted(){
      this.init();
    },
    filters:{   // 定义局部过滤器
      currency:currency  // currency.js传过来的本就是函数
    },
    methods:{
      init(){
        axios.get('/users/cartList').then((response)=>{  // 订单确认列表不需要再写接口，直接用购物车列表的接口，渲染页面时选取选中的商品作为订单确认的商品
          let res= response.data;
          this.cartList = res.result;

          this.cartList.forEach((item)=>{  // 遍历购物车商品，获取选中商品的总金额
            if(item.checked == '1'){
              this.subTotal += item.salePrice*item.productNum;
            }
          })

          this.orderTotal = this.subTotal+this.shipping-this.discount+this.tax;  // 获取用户最终支付的金额，(总金额+配送费-折扣+税费)
        })
      }
    }
}

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/13/1.jpg?raw=true)


### 二、创建订单功能实现

点击支付跳转到支付页面，支付是由第三方做的集成的支付，没办法模拟复杂的支付场景，现在只做点击支付创建订单和跳转到成功页面，支付功能省略掉。























