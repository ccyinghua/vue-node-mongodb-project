## 登录模块实现

### 一、登录功能

后端server/routes/users.js

```javascript

var User = require('./../models/users.js');

// 二级路由
// 登录接口
router.post("/login",function(req, res, next){
    // 获取参数
    var param = {
        userName:req.body.userName,
        userPwd:req.body.userPwd
    }
    User.findOne(param, function(err,doc){  // 根据用户名密码查找数据库
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            if(doc){
                res.cookie("userId",doc.userId,{
                    path:'/',
                    maxAge:100*60*60
                });
                // res.cookie("userName",doc.userName,{
                //    path:'/',
                //    maxAge:1000*60*60
                // });
                // req.session.user = doc;
                res.json({
                    status:"0",
                    msg:'',
                    result:{
                        userName:doc.userName
                    }
                })
            }
        }
    })
})

```

添加代理config/index.js

```javascript
proxyTable: {    
    '/users/*':{    // users/路由的下一级路由
        target:'http://localhost:3000'
    }
},

说明：如果是有三级路由，例'/users/cart/del'，需要配置'/users/**';否则请求时会出现404错误。

```
前端NavHeader.vue

```javascript
methods:{
    login(){     // 点击登录
      console.log("userName:"+this.userName)
      if(!this.userName || !this.userPwd){
        this.errorTip = true;
        return
      }
      axios.post("/users/login",{
        userName:this.userName,
        userPwd:this.userPwd
      }).then((response)=>{
        let res = response.data;
        if(res.status == "0"){
          this.errorTip = false;
          this.loginModalFlag = false;
          this.nickName = res.result.userName;
        }else{
          this.errorTip = true;
        }
      })
    }
}
```

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/1.jpg?raw=true)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/2.jpg?raw=true)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/3.jpg?raw=true)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/4.jpg?raw=true)

### 二、登出功能

后端server/routes/users.js

```javascript
// 登出接口
router.post("/logout",function(req,res,next){
    res.cookie("userId","",{
        path:"/",
        maxAge:-1  // 生命周期
    })
    res.json({
        status:"0",
        msg:'',
        result:''
    })
})
```

前端NavHeader.vue

```javascript
methods:{
    logOut(){    // 点击logout登出
      axios.post("/users/logout").then((response)=>{
        let res = response.data;
        if(res.status== "0"){
          this.nickName = '';
        }
      })
    }
}

```

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/5.jpg?raw=true)


### 三、登录拦截功能

server/app.js

```javascript

// 捕获登录状态
app.use(function(req,res,next){   // 进入路由之前优先进入function
    if(req.cookies.userId){  // 有cookies,说明已经登录
        next();
    }else{
        console.log("url:"+req.originalUrl);
        if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.originalUrl == '/goods'){  // 未登录时可以点击登录login登出logout和查看商品列表
            next();
        }else{
            res.json({
                status:'1001',
                msg:'当前未登录',
                result:''
            })
        }
    }
})
```
这时重新启动express,node server/bin/www查看前端页面

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/6.jpg?raw=true)

商品数据没有显示，因为originalUrl是当前接口的地址，'/goods'只是当前的路径，页面的请求地址后面还有页码等参数。所以可以用indexOf形式


```javascript
if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods')>-1){

```
这样会出现另一个问题，没有登录时点击加入购物车却成功了。因为加入购物车时，请求的地址是'/goods/addCart'二级路由,跟查询商品列表路由'/goods'一级路由共用了路由

```javascript
=>server/routes/goods.js
// 查询商品列表数据
router.get('/', function(req, res, next) {})

// 加入到购物车
router.post("/addCart",function(req, res, next){})

改成

// 查询商品列表数据
router.get('/list', function(req, res, next) {})

同时src/views/GoodsList.vue请求商品列表的url
axios.get("/goods/list",{...})

```
结果server/app.js

```javascript
// 捕获登录状态
app.use(function(req,res,next){   // 进入路由之前优先进入function
    if(req.cookies.userId){  // 有cookies,说明已经登录
        next();
    }else{
        console.log("url:"+req.originalUrl);
        if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){  // 未登录时可以点击登录login登出logout和查看商品列表
            next();
        }else{
            res.json({
                status:'1001',
                msg:'当前未登录',
                result:''
            })
        }
    }
})
```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/7.png?raw=true)

还有第二种方法，区分express框架的获取url的`req.path`和`req.originalUrl`    
[http://www.expressjs.com.cn/4x/api.html#req.path](http://www.expressjs.com.cn/4x/api.html#req.path)

```javascript

// 捕获登录状态
app.use(function(req,res,next){   // 进入路由之前优先进入function
    if(req.cookies.userId){  // 有cookies,说明已经登录
        next();
    }else{
        console.log(`path:${req.path},originalUrl:${req.originalUrl}`);
        // 结果例 => path:/goods/list,originalUrl:/goods/list?page=1&pageSize=8&sort=1&priceLevel=all
        // if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){  // 未登录时可以点击登录login登出logout和查看商品列表
        if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.path == '/goods/list'){   // 第二种方法
            next();
        }else{
            res.json({
                status:'1001',
                msg:'当前未登录',
                result:''
            })
        }
    }
})

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/8.png?raw=true)


### 四、校验登录

server/routes/users.js

```
登录接口添加userName的cookie
res.cookie("userName",doc.userName,{
    path:'/',
    maxAge:1000*60*60
});

// 校验是否登录
router.get("/checkLogin",function(req,res,next){
    if(req.cookies.userId){
        res.json({
            status:'0',
            msg:'',
            result:req.cookies.userName || ''
        });
    }else{
        res.json({
            status:'1',
            msg:'未登录',
            result:''
        })
    }
})

```

src/components/NavHeader.vue

```
mounted(){
    this.checkLogin();
},
methods:{
    checkLogin(){   // 检查是否登录
      axios.get("/users/checkLogin").then((response)=>{
        let res = response.data;
        if(res.status == '0'){
          this.nickName = res.result;
        }
      })
    }
}
```
重新启动express服务，刷新页面，登录

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/9.jpg?raw=true)

重新刷新页面之后，页面还是登录状态。


### 五、全局模态框组件实现

知识点父子组件通信： [http://www.cnblogs.com/ccyinghua/p/7874651.html](http://www.cnblogs.com/ccyinghua/p/7874651.html)

建立一个模态框组件：src/components/Modal.vue

```javascript
子组件：
// mdShow是父组件传过来的数据，控制模态框是否显示
// 关闭模态框时，触发close方法，与父组件进行通信，告诉它要关闭模态框
export default {
    props:["mdShow"],   // 接收父组件传过来的mdShow
    data(){
        return {

        }
    },
    methods:{
        closeModal(){   // 关闭模态框
            this.$emit("close");  // 触发close方法
        }
    }
}

```
src/views/GoodsList.vue

```html
父组件：

<!-- 模态框 -->
  <!-- 说明：父组件传mdShow数据给子组件，监听子组件触发的close事件，然后调用closeModal方法 -->
<!-- 未登录状态 -->
<Modal v-bind:mdShow="mdShow" @close="closeModal">
  <p slot="message">
    请先登录,否则无法加入到购物车中!
  </p>
  <div slot="btnGroup">
    <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
  </div>
</Modal>
<!-- 登陆了 -->
<Modal v-bind:mdShow="mdShowCart" @close="closeModal">
  <p slot="message">
    <svg class="icon-status-ok">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
    </svg>
    <span>加入购物车成功!</span>
  </p>
  <div slot="btnGroup">
    <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
    <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
  </div>
</Modal>

```

```javascript
import Modal from '@/components/Modal.vue'  // 模态框

export default {
    data(){
        return {
            mdShow:false,    // 未登录的模态框是否显示
            mdShowCart:false    // 已登录的模态框是否显示
        }
    },
    components:{
        Modal
    },
    methods:{
        addCart(productId){  // 点击加入购物车
          axios.post("/goods/addCart",{   // 接口设置在server/routes/goods.js
            productId:productId
          }).then((res)=>{
            var res = res.data;
            if(res.status==0){
              //alert("加入成功")
              this.mdShowCart = true; // 加入购物车成功，成功的模态框显示
            }else{
              // alert("msg:"+res.msg)
              this.mdShow = true;   // 未登录模态框显示
            }
          })
        },
        closeModal(){    // 关闭模态框
            this.mdShow = false;   // 未登录模态框消失
            this.mdShowCart = false;   // 未登录模态框消失
        }
    }
}

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/10.jpg?raw=true)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/10/11.jpg?raw=true)











