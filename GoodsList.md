### GoodsList.vue-商品列表

> ##### 面包屑子组件NavBread.vue

slot插槽使用

因为每个页面的名字不一样，所以面包屑不是固定的，在名字的位置留一个插槽，由父组件提供内容。


```html
子组件NavBread.vue：
<template>
    <div class="nav-breadcrumb-wrap">
      <div class="container">
        <nav class="nav-breadcrumb">
          <a href="/">Home</a>
          <!-- <span>Goods</span> -->
          <slot></slot> <!-- 插槽 -->
        </nav>
      </div>
    </div>
</template>

父组件goodsList.vue
import NavBread from '@/components/NavBread.vue'
<nav-bread>
    <span>Goods</span>
</nav-bread>

```
> ##### mock模拟json数据

```
//dev-server.js
为什么可以用localhost：8080访问？
vue内置的一套express框架，基于nodejs的服务。

var app = express()后面
var router=express.Router();    // 拿到服务端的路由
var goodsData = require('../mock/goods.json');
router.get("/goods",function(req,res,next){   //定义了一个goods路由，req拿到请求的参数，res是response输出的一些东西，next
  res.json(goodsData);
})
app.use(router); // 用路由

```

```
// goodsList.vue
data(){
    return {
        goodsList:[]
    }
},
mounted:function(){
    this.getGoodsList();
},
methods:{
    getGoodsList(){
        axios.get("/goods").then((res)=>{
            var _res = res.data;
            this.goodsList = _res.result;
        })
    }
}

```













