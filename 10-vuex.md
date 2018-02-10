## 基于Vuex改造登录和购物车数量功能


Vuex官网： [https://vuex.vuejs.org/zh-cn/](https://vuex.vuejs.org/zh-cn/) <br>
Vuex基础总结： [http://www.cnblogs.com/ccyinghua/p/7865804.html](http://www.cnblogs.com/ccyinghua/p/7865804.html)
<br><br>
Vuex用来集中管理数据，哪些组件被页面重复使用，哪些组件被多个页面嵌套，而且组件之间有数据交互，就比较适合用vuex。
<br><br>
在这个项目中，头部和底部组件是用的最多的，底部没有数据交互，所以头部中我们可以对登录和购物车数量使用vuex交互。

### 一、使用vuex

安装

```javascript
cnpm install vuex --save

```
src/main.js

```javascript

import Vuex from 'vuex'
Vue.use(Vuex);

// 建立store对象
const store = new Vuex.Store({
  state: {
    nickName:'',  // 用户名
    cartCount:0  // 购物车数量
  },
  mutations: {  // 更改状态
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  store, // 使用store
})

```

### 二、用户名使用vuex交互

src/components/NavHeader.vue
<br>
若用户名使用数据管理，data里面nickName用户名就不用定义，而是使用`this.$store.state.nickName`在computed计算属性获取vuex的state.nickName用户名数据。
另外，methods方法的里面的`this.nickName`赋值需要改成`this.$store.commit("updateUserInfo",赋值的用户名);`形式以达到提交store对象的mutations触发赋值事件。

```javascript
export default {
  data(){
    return {
      // nickName:''  // 用了vuex这个data数据就不用了
    }
  },
  computed:{
    nickName(){
      return this.$store.state.nickName;
    }
  },
  methods:{
    checkLogin(){   // 检查是否登录
        ......
        // this.nickName = res.result;
        this.$store.commit("updateUserInfo",res.result);
        ......
      })
    },
    login(){     // 点击登录
        ......
        // this.nickName = res.result.userName;
        this.$store.commit("updateUserInfo",res.result.userName);
        ......
    },
    logOut(){   // 点击logout登出
        ......
        // this.nickName = '';
        this.$store.commit("updateUserInfo",res.result.userName);
        ......
    }
  }
}

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/15/1.jpg?raw=true)

### 三、购物车数量使用vuex交互

server/routes/users.js查询购物车商品数量接口

```javascript
// 查询购物车商品数量
router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userId){
    console.log("userId:"+req.cookies.userId);
    var userId = req.cookies.userId;
    User.findOne({"userId":userId}, function (err,doc) {
      if(err){
        res.json({
          status:"0",
          msg:err.message
        });
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status:"0",
          msg:"",
          result:cartCount
        });
      }
    });
  }else{
    res.json({
      status:"0",
      msg:"当前用户不存在"
    });
  }
});
```
src/components/NavHeader.vue

```html
<!--显示购物车商品数量-->
<span class="navbar-cart-count" v-text="cartCount" v-if="cartCount"></span>
```

```javascript
export default {
  computed:{
    cartCount(){
      return this.$store.state.cartCount;
    }
  },
  methods:{
    checkLogin(){   // 检查是否登录
        ......
        if(res.status == '0'){ // 如果已登录购物车商品数量更新
          ......
          this.getCartCount();  // 查询购物车商品数量
        }
        ......
    },
    login(){     // 点击登录
        ......
        if(res.status == "0"){ // 登录成功后购物车商品数量更新
          ......
          this.getCartCount();  // 查询购物车商品数量
        }
        ......
    },
    getCartCount(){  // 查询购物车商品数量
      axios.get("/users/getCartCount").then(res=>{
        var res = res.data;
        this.$store.commit("updateCartCount",res.result);
      });
    }
  }
}

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/15/2.jpg?raw=true)


