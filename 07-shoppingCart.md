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






















