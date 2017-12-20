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
        userPwd:req.body.userPwd,
    }
})








module.exports = router;
