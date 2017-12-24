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
                res.cookie("userName",doc.userName,{
                    path:'/',
                    maxAge:1000*60*60
                });
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
    '/users/*':{
        target:'http://localhost:3000'
    }
},

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





