### GoodsList.vue-商品列表页模块实现

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

```javascript
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

```javascript
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
> ##### 价格区间菜单实现

```javascript
data(){
    return {
        priceFilter:[   // 价格区间数组
            {
                startPrice:'0.00',
                endPrice:'100.00'
            },
            {
                startPrice:'100.00',
                endPrice:'500.00'
            },
            {
                startPrice:'500.00',
                endPrice:'1000.00'
            },
            {
                startPrice:'1000.00',
                endPrice:'5000.00'
            }
        ],
        priceChecked:'all'   // 选中的价格区间
    }
},
<div class="filter stopPop" id="filter">
    <dl class="filter-price">
        <dt>Price:</dt>
        <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="priceChecked='all'">All</a></dd>
        <dd v-for="(price,index) in priceFilter">
            <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="priceChecked=index">{{price.startPrice}} - {{price.endPrice}}</a>
        </dd>
    </dl>
</div>

```
考虑到是响应式布局，移动端时点击 Filter by 价格菜单切换，类名"filterby-show"控制价格区间菜单的显示

```html
<a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
<!-- 价格box -->
<div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
    <dl class="filter-price">
        <dt>Price:</dt>
        <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></dd>
        <dd v-for="(price,index) in priceFilter">
            <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
        </dd>
    </dl>
</div>

<!-- 遮罩 -->
<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
```

```javascript
data(){
    return {
        priceFilter:[   // 价格区间数组
            {
                startPrice:'0.00',
                endPrice:'100.00'
            },
            {
                startPrice:'100.00',
                endPrice:'500.00'
            },
            {
                startPrice:'500.00',
                endPrice:'1000.00'
            },
            {
                startPrice:'1000.00',
                endPrice:'5000.00'
            }
        ],
        priceChecked:'all',   // 选中的价格区间
        filterBy:false,     // 控制价格菜单的显示
        overLayFlag:false   // 遮罩的显示
    }
},
methods:{
    setPriceFilter(index){   // 点击价格
        this.priceChecked = index;
        this.closePop();
    },
    showFilterPop(){     // 点击filterBy出现价格菜单和遮罩
        this.filterBy = true;
        this.overLayFlag = true;
    },
    closePop(){   // 关闭价格菜单和遮罩
        this.filterBy = false;
        this.overLayFlag = false;
    }
}
```
> ##### 图片懒加载  https://www.npmjs.com/package/vue-lazyload


```
npm install vue-lazyload --save

// main.js
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
    loading:"/static/loading-svg/loading-bars.svg"
})

```









