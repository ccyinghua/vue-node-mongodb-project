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
                // req.session.user = doc;   要安装express session插件的
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


// 校验是否登录接口
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


// 查询当前用户的购物车数据
router.get('/cartList',function(req,res,next){
    var userId = req.cookies.userId;   // 获取用户Id
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


module.exports = router;


