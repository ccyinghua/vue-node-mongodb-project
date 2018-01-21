## 购物车模块实现

### 一、渲染购物车列表页面

新建src/views/Cart.vue <br>
获取cartList购物车列表数据就可以在页面中渲染出该用户的购物车列表数据

```javascript
data(){
  return {
     cartList:[]  // 购物车商品列表
  }
},
mounted:function(){
  this.init();
},
methods:{
  init(){  // 初始化商品数据
    axios.get('/users/cartList').then((response)=>{
      let res = response.data;
      this.cartList = res.result;
    })
  }
}

```

购物车接口：server/routes/users.js

```javascript
// 查询当前用户的购物车数据
router.get('/cartList',function(req,res,next){
    var userId = req.cookies.userId;
    User.findOne({userId:userId},function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            });
        }else{
            if(doc){
                res.json({
                    status:'0',
                    msg:'',
                    result:doc.cartList
                })
            }
        }
    })
})

```
建立路由src/router/index.js

```javascript
import Cart from '@/views/Cart'  // 购物车列表
export default new Router({
  routes: [
    {
      path: '/cart',   // 购物车列表路由
      name: 'Cart',
      component: Cart
    }

  ]
})

```

### 二、购物车商品删除功能

购物车删除接口：server/routes/users.js

```javascript

// 购物车删除功能
router.post('/cartDel',function(req,res,next){
    var userId = req.cookies.userId,productId = req.body.productId;
    User.update({
        userId:userId
    },{
        $pull:{
            'cartList':{
                'productId':productId
            }
        }
    },function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:'suc'
            });
        }
    })
});

```

src/views/Cart.vue 

```html
点击删除图标模态框出现(导入模态Modal.vue子组件)
<!-- 删除图标 -->
<a href="javascript:;" class="item-edit-btn" @click="delCartConfirm(item.productId)">
    <svg class="icon icon-del">
        <use xlink:href="#icon-del"></use>
    </svg>
</a>

<!-- 模态框 -->
<Modal :mdShow="modalConfirm" @close="closeModal">
    <p slot="message">你确认要删除此条数据吗？</p>
    <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="delCart">确认</a>
        <a href="javascript:;" class="btn btn--m" @click="modalConfirm = false">关闭</a>
    </div>
</Modal>
```

```javascript
import Modal from '@/components/Modal.vue'  // 模态框
export default {
    data(){
        return {
          productId:'',
          modalConfirm:false   // 模态框是否显示
        }
    },
    components:{
      Modal
    },
    methods:{
      delCartConfirm(productId){   // 点击删除图标
        this.productId = productId;
        this.modalConfirm = true;  // 模态框显示
      },
      closeModal(){   // 关闭模态框
        this.modalConfirm = false;
      },
      delCart(){   // 确认删除此商品
        axios.post('/users/cartDel',{
          productId:this.productId
        }).then((response) => {
          let res = response.data;
          if(res.status = '0'){
            this.modalConfirm = false;  // 关闭模态框
            this.init();  // 重新初始化购物车数据
          }
        })
      }
    }
}

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/11/1.jpg?raw=true)


**** 在这里发现一个bug,在商品列表页点击“加入购物车”，购物车页面新添加的商品数量和总价格是未定义。
[mongoose添加属性问题](http://www.cnblogs.com/ccyinghua/p/8232842.html)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/11/2.jpg?raw=true)

这是后端接口处理的问题，在server/routes/goods.js的加入到购物车接口中，是从mongodb的数据库dumall的goods表根据商品id获取对应数据，再对此商品数据添加productNum和checked属性，之后再插入到users表的购物车列表中的。

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/11/3.jpg?raw=true)

属性没有添加成功，在Goods模型中添加属性，要去models/goods.js的Schema添加这两个属性。

```javascript

server/models/goods.js
// 定义一个Schema
var produtSchema = new Schema({
	'productId':String,  
	'productName':String,
	'salePrice':Number,
	'productImage':String,

    // 添加的属性
    "checked":String,
    "productNum":Number
})
module.exports = mongoose.model('good',produtSchema);
```

重新启动express(node server/bin/www)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/11/4.jpg?raw=true)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/11/5.jpg?raw=true)

### 三、购物车商品修改功能

> 商品加减和商品勾选

server/routes/users.js

```javascript

//修改商品数量接口
router.post("/cartEdit",function(req,res,next){
    var userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked;
    User.update({             // 查询条件
        "userId":userId,
        "cartList.productId":productId
    },{                      // 修改的数据
        "cartList.$.productNum":productNum,
        "cartList.$.checked":checked
    },function(err,doc){
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
          res.json({
            status:'0',
            msg:'',
            result:'suc'
          });
        }
    });
})

```
src/views/Cart.vue

```html
<!--选中图标-->
<a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked=='1'}" @click="editCart('checked',item)">
    <svg class="icon icon-ok">
        <use xlink:href="#icon-ok"></use>
    </svg>
</a>
<!--加减图标-->
<a class="input-sub"  @click="editCart('minu',item)">-</a>
<a class="input-add" @click="editCart('add',item)">+</a>

```

```javascript

methods:{
    editCart(flag,item){
        if(flag == 'add'){    // 添加商品数量
          item.productNum++;
        }else if(flag = 'minu'){   // 减少商品数量
          if(item.productNum <= 1){
            return;
          }
          item.productNum--;
        }else{      // 商品控制选中
          item.checked = (item.checked=='1') ? '0' : '1';
        }
        axios.post('/users/cartEdit',{
          productId:item.productId,
          productNum:item.productNum,
          checked:item.checked
        }).then((response)=>{
          let res = response.data;
        })
      }
}

```
> 购物车全选和商品实时计算功能

- ###### 全选和取消全选

server/routes/users.js

```javascript
//全选和取消全选
router.post('/editCheckAll',function(req,res,next){
    var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0';
    User.findOne({userId:userId},function(err,user){
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
          if(user){
            user.cartList.forEach((item)=>{
              item.checked = checkAll;
            })
            user.save(function (err1,doc) {
                if(err1){
                  res.json({
                    status:'1',
                    msg:err1,message,
                    result:''
                  });
                }else{
                  res.json({
                    status:'0',
                    msg:'',
                    result:'suc'
                  });
                }
            })
          }
        }
    })
})
```
src/views/Cart.vue

```html
<a href="javascipt:;" @click="toggleCheckAll">
    <span class="checkbox-btn item-check-btn" v-bind:class="{'check':checkAllFlag}">
        <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
    </span>
    <span>Select all</span>
</a>
```

```javascript
export default {
    data(){
        return {
          checkAllFlag:false  // 控制全选
        }
    },
    methods:{
      toggleCheckAll(){   // 全选和取消全选
        this.checkAllFlag = !this.checkAllFlag;  // 取反
        this.cartList.forEach((item)=>{
          item.checked = this.checkAllFlag;
        })
        axios.post('/users/editCheckAll',{
          checkAll:this.checkAllFlag
        }).then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            console.log("update suc");
          }
        })
      }
    }
}
```
这里出现一个问题，在点击select All全选之后，显示正常，但是刷新页面之后全选的图标没有显示全选，因为全选的信息没有存储到数据库保存，所以刷新之后就没有了。

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/11/6.jpg?raw=true)

##### 【解决的办法】
用到了实时计算的`computed`功能，实时计算的是属性，只不过是函数的写法，data里面就不用在声明了。

src/views/Cart.vue

```javascript
export default {
    data(){
        return {
          // checkAllFlag:false   // 控制全选
        }
    },
    computed:{   // 实时计算的是属性，只不过是函数的写法，data里面就不用在声明了
      checkAllFlag(){    // 是否全选属性
        return this.checkedCount == this.cartList.length;  // 勾选的商品种数=购物车商品列表的商品种数时，返回true代表全选。
      },
      checkedCount(){   // 获取已勾选的商品种数(几种商品已勾选)
        var i = 0;
        this.cartList.forEach((item)=>{
          if(item.checked=='1')i++;
        });
        return i;
      }
    },
    methods:{
      toggleCheckAll(){    // 全选和取消全选
        // this.checkAllFlag = !this.checkAllFlag;  
        // 不能使用这种写法了，checkAllFlag是实时计算的属性，如果true取反变成false之后，还没来得及执行下面的所有商品取消勾选，就实时计算了检测到勾选的商品种数=购物车商品列表的商品种数,就又变成全选了。
        var flag = !this.checkAllFlag; // 声明变量取代
        this.cartList.forEach((item)=>{
          item.checked = flag ?'1':'0';
        })
        axios.post('/users/editCheckAll',{
          checkAll:flag
        }).then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            console.log("update suc");
          }
        })
      }
    }
}

```
页面一刷新就实时计算了

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/11/7.jpg?raw=true)

- ###### 商品实时计算功能实现

这里也要用到computed计算属性

```html

<div class="item-total">
  Item total: <span class="total-price">{{totalPrice}}</span>
</div>

computed:{
    totalPrice(){   // 总价格属性
        var money = 0;
        this.cartList.forEach((item)=>{
            if(item.checked=='1'){
                money += parseFloat(item.salePrice)*parseInt(item.productNum);
            }
        });
        return money;
    }
}

```
接下来要对价格进行格式化，vuex官网github有一个对购物车将格式化的函数 [https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/currency.js](https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/currency.js) 可以拿过来对价格格式化，在src/util/currency.js

格式化要用到过滤器：可以在src/views/Cart.vue导入使用局部过滤器，也可以在main.js使用全局过滤器

```
<span class="total-price">{{totalPrice | currency('$')}}</span>

// 局部过滤器
import {currency} from '@/util/currency.js'
filters:{ 
  currency:currency  // currency.js传过来的本就是函数
},

// 全局过滤器
import {currency} from './util/currency'
Vue.filter("currency",currency);
```

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/11/8.jpg?raw=true)





