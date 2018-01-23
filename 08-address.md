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

> #### 渲染地址列表

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/3.jpg?raw=true)

地址列表后端接口：server/routes/users.js

```javascript
// 查询用户地址接口
router.get("/addressList",function(req,res,next){
    var userId = req.cookies.userId;
    User.findOne({userId:userId},function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:doc.addressList
            })
        }
    })
})

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/4.jpg?raw=true)

地址列表前端调用：src/views/Address.vue

```html
<li v-for="item in addressList">
    <dl>
        <dt>{{item.userName}}</dt>
        <dd class="address">{{item.streetName}}</dd>
        <dd class="tel">{{item.tel}}</dd>
    </dl>
    <div class="addr-opration addr-del">
        <a href="javascript:;" class="addr-del-btn">
            <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
        </a>
    </div>
    <div class="addr-opration addr-set-default">
        <a href="javascript:;" class="addr-set-default-btn"><i>Set default</i></a>
    </div>
    <div class="addr-opration addr-default">Default address</div>
</li>

```

```javascript
export default {
    data(){
        return {
          addressList:[]   // 地址列表
        }
    },
    mounted(){
      this.init();
    },
    methods:{
      init(){
        axios.get('/users/addressList').then((response) => {
          let res = response.data;
          this.addressList = res.result;
        })
      }
    }
}

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/5.jpg?raw=true)

### 二、地址列表切换和展开

> #### 限制地址显示3个

用计算属性computed对地址列表数据进行处理

```javascript

<li v-for="item in addressListFilter">

export default {
    data(){
        return {
          addressList:[],   // 地址列表
          limit:3   // 限制默认显示3个地址
        }
    },
    computed:{
      addressListFilter(){
        return this.addressList.slice(0,this.limit);
      }
    }
}

```
> #### 地址展开与收起

展开与收起控制的是显示地址的个数limit，同时图标发生变化

```html
<a class="addr-more-btn up-down-btn" href="javascript:;"  @click="expand" v-bind:class="{'open':limit>3}">
  more
  <i class="i-up-down">
    <i class="i-up-down-l"></i>
    <i class="i-up-down-r"></i>
  </i>
</a>

```

```javascript
export default{
    expand(){  //  点击more更多
        if(this.limit ==3){
          this.limit = this.addressList.length;
        }else{
          this.limit =3;
        }
    }  
}
```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/6.jpg?raw=true) <br>
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/7.jpg?raw=true)

> #### 地址选中切换

定义一个地址选中的索引数据checkIndex，当checkIndex等于所在li索引时，类名check加上；点击地址的时候将点击的li索引赋值给checkIndex。

```
<li v-for="(item,index) in addressListFilter" v-bind:class="{'check':checkIndex == index}" @click="checkIndex=index"></li>

export default {
    data(){
        return {
          checkIndex:0   // 选中的地址索引
        }
    }
}
```
### 三、设置默认地址

server/models/users.js 先补充地址列表addressList的数据模型

```javascript
"addressList":[
    {
        "addressId": String,
        "userName": String,
        "streetName": String,
        "postCode": Number,
        "tel": Number,
        "isDefault": Boolean
    }
]
```
server/routes/users.js设置默认地址接口，前端传要设置的地址的addressId给后端，后端设置isDefault的值

```javascript
//设置默认地址接口
router.post("/setDefault", function (req,res,next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    });
  }else{
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId ==addressId){
             item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });

        doc.save(function (err1,doc1) {
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
                result:''
              });
          }
        })
      }
    });
  }
});

```
src/views/Address.vue前端

```html
<div class="addr-opration addr-set-default">
    <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault" @click="setDefault(item.addressId)"><i>Set default</i></a>
</div>
<div class="addr-opration addr-default" v-if="item.isDefault">Default address</div>
```

```javascript
methods:{
    setDefault(addressId){  // 设置默认地址
        axios.post('/users/setDefault',{
          addressId:addressId
        }).then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            console.log("set default");
            this.init();  // 重新渲染地址列表
          }
        })
      }
}
```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/8.jpg?raw=true)

### 四、地址删除功能

server/routes/users.js后端删除地址接口

```
//删除地址接口
router.post("/delAddress", function (req,res,next) {
  var userId = req.cookies.userId,addressId = req.body.addressId;
  User.update({
    userId:userId
  },{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  }, function (err,doc) {
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
          result:''
        });
      }
  });
});

```

点击删除图标会出现一个模态框，点击模态框的确定按钮，发送要删除的地址的id给后端，请求删除，然后重新渲染地址列表，删除的数据不会再出现。

src/views/Address.vue

```html
<!--删除图标-->
<a href="javascript:;" class="addr-del-btn" @click="delAddressConfirm(item.addressId)">
    <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
</a>

<!-- 模态框 -->
<modal :mdShow="isMdShow" @close="closeModal">
    <p slot="message">
        您是否确认要删除此地址?
    </p>
    <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="delAddress">确认</a>
        <a class="btn btn--m btn--red" href="javascript:;" @click="isMdShow=false">取消</a>
    </div>
</modal>
```

```javascript
export default {
    data(){
        return {
          isMdShow:false,   // 模态框的显示设置
          addressId:''     // 地址id的存储，用于请求传参
        }
    }
    methods:{
      closeModal(){   // 关闭模态窗
        this.isMdShow = false;
      },
      delAddressConfirm(addressId){   // 点击删除图标，模态框出现
        this.isMdShow = true;
        this.addressId = addressId; // 地址id赋值
      },
      delAddress(){
        axios.post("/users/delAddress",{
          addressId:this.addressId  // 传参
        }).then((response)=>{
            let res = response.data;
            if(res.status=="0"){
              console.log("del suc");
              this.isMdShow = false;  // 告诉模态框组件，设置模态框消失
              this.init();  // 重新渲染地址
            }
        })
      }
    }
}

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/9.jpg?raw=true)
<br>
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/10.jpg?raw=true)
<br>
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/11.jpg?raw=true)

> #### 点击Next跳转到订单确认页面

跳转要传选择的地址id传过去

src/views/Address.vue

```html
<!--选择地址的时候将地址id赋值给selectedAddrId-->
<li v-for="(item,index) in addressListFilter" v-bind:class="{'check':checkIndex == index}" @click="checkIndex=index;selectedAddrId=item.addressId"></li>

<!--动态跳转，传参传入地址id-->
<router-link class="btn btn--m btn--red" v-bind:to="{path:'/orderConfirm',query:{'addressId':selectedAddrId}}">Next</router-link>

```

```javascript
export default {
    data(){
        return {
          selectedAddrId:''  // 选中的地址id存储,用于点击Next跳转到订单确认页面传参
        }
    }
}
```
点击Next跳转，跳转到订单确认页面，url带了选择的地址id参数

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/12/12.jpg?raw=true)

















