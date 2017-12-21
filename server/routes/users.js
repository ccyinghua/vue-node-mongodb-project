var express = require('express');
var router = express.Router();

var User = require('./../models/users.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


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








module.exports = router;
