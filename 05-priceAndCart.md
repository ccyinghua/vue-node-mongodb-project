## 商品列表价格过滤和加入购物车功能

### 一、价格过滤功能

GoodsList.vue

```javascript
>>点击价格区间时发送请求

methods:{
    getGoodsList(flag){
        var param = {
            // 请求时传点击的价格区间数据给后台
            priceLevel:this.priceChecked   // 点击的价格区间
        }
        ......
    },
    setPriceFilter(index){   // 点击价格
        this.priceChecked = index;
        this.closePop();
        this.getGoodsList(); // 发送请求
    },
}

```
server/routes/goods.js <br>
获取传过来的参数，对价格参数进行处理，查询价格区间内的数据库数据

```javascript

// 二级路由
/* GET goods page. */
router.get('/', function(req, res, next) {
	// express获取请求参数
	let priceLevel = req.param("priceLevel");  // 传过来的价格区间
	var priceGt = '',priceLte = '';
	let params = {};
	if(priceLevel != 'all'){   // 价格区间过滤功能
		switch (priceLevel){
			case '0':priceGt=0;priceLte =100;break;
			case '1':priceGt=100;priceLte =500;break;
			case '2':priceGt=500;priceLte =1000;break;
			case '3':priceGt=1000;priceLte =5000;break;
		}
		params = {
			salePrice:{
				$gt:priceGt,
				$lte:priceLte
			}
		}
	}
	......
});

#重新启动express, node server/bin/www
#浏览器输入 http://localhost:3000/goods?page=1&pageSize=8&sort=1&priceLevel=2 测试价格区间500-1000的数据能否显示

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/09/9.jpg?raw=true)


> #### 往下滚动分页加载图标效果

```javascript
<!-- 加载中... -->
<img v-show="loading" src="/static/loading-svg/loading-spinning-bubbles.svg" alt="">

export default {
    data(){
        return {
            loading:false    // 往下滚动"加载图标"的出现效果:默认不出现
        }
    },
    methods:{
        getGoodsList(flag){
            this.loading = true;  // 请求前出现
            axios.get("/goods",{
              params:param    // 传参
            }).then((res)=>{
                var res = res.data;
                this.loading = false;  // 请求到数据图标消失
                if(res.status == "0"){
                    ......
                }  
            })
        }
    }
}
```
### 二、加入购物车功能

dumall数据库建立users集合导入resource文件夹的dumall-users <br>
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/09/10.jpg?raw=true)


与商品列表接口一样，先建立用户数据的模型 <br>
server/models/users.js

```javascript

// 对应数据库用户数据在resource文件夹的dumall-users
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义一个Schema
var userSchema = new Schema({
	'userId':String,   // 或者 'userId':{type:String}
	'userName':String,
	'userPwd':String,
	'orderList':Array,
    'cartList':[           // 购物车列表
        {
            "productId":String,
            "productName":String,
            "salePrice":Number,
            "productImage":String,
            "checked":String,     // 是否选中
            "productNum":String  // 商品数量
        }
    ],
    "addressList":Array
})

// 输出(导出)
module.exports = mongoose.model('user',userSchema); // 定义一个user模型，可以根据这个模型调用其API方法。
// 这个模型定义的是数据库dumall的users集合数据，所以这个model取名user是对应这个集合，连接数据库之后，这个模型会根据名字的复数形式"users"来查找数据集合。
// module.exports = mongoose.model('user',userSchema,'users'); 也可以后面注明链接的是数据库的goods集合

```

数据库链接(之前商品列表页已连接)，查询操作用户数据，建立接口，实现加入购物车功能
server/routes/goods.js

```javascript

// 加入到购物车
// 是二级路由，一级路由在app.js
router.post("/addCart",function(req, res, next){
  var userId = '100000077',
    productId = req.body.productId;  // post请求拿到res参数：req.body
  var User = require('../models/users.js');  // 引入user模型

  // 查询第一条:拿到用户信息
  User.findOne({
    userId:userId   // 查询条件
  },function(err,userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      console.log("userDoc"+userDoc);  // 用户数据
      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach(function(item){    // 遍历用户购物车，判断加入购物车的商品是否已经存在
          if(item.productId == productId){
            goodsItem = item;
            item.productNum++; // 购物车这件商品数量+1
          }
        })
        if(goodsItem){  // 若购物车商品已存在
          userDoc.save(function (err2,doc2) {
            if(err2){
                res.json({
                    status:"1",
                    msg:err2.message
                })
            }else{
                res.json({
                    status:'0',
                    msg:'',
                    result:'suc'
                })
            }
          })
        }else{   // 若购物车商品不存在，就添加进去
          Goods.findOne({productId:productId},function(err1,doc){  // 从商品列表页Goods查询点击加入购物车的那件商品信息
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);  // 添加信息到用户购物车列表中
                userDoc.save(function(err2,doc2){  // 保存数据库
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:"0",
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

```

页面实现加入购物车请求实现
GoodsList.vue

```javascript

<!--传入商品id参数-->
<a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>

methods:{
    addCart(productId){  // 点击加入购物车
        axios.post("/goods/addCart",{   // 接口设置在server/routes/goods.js
            productId:productId
        }).then((res)=>{
            var res = res.data;
            if(res.status==0){
                alert("加入成功")
            }else{
                alert("msg:"+res.msg)
            }
        })
    }
}

```
运行项目，点击购物车，请求成功，数据库购物车列表变化

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/09/11.jpg?raw=true)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/09/12.jpg?raw=true)




