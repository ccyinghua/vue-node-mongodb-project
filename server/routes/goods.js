var express = require('express');
var router = express.Router(); // 拿到express框架的路由
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// 链接MongoDB数据库,数据库的名称叫dumall
mongoose.connect('mongodb://127.0.0.1:27017/dumall');  // 若是带账号密码的：'mongodb://root:123456@127.0.0.1:27017/dumall'

// 连接成功操作
mongoose.connection.on("connected",function(){
	console.log("MongoDB connected success.")
})

// 连接失败操作
mongoose.connection.on("error",function(){
	console.log("MongoDB connected fail.")
})

// 连接断开操作
mongoose.connection.on("disconnected",function(){
	console.log("MongoDB connected disconnected.")
})


// 二级路由
/* GET goods page. */
router.get('/', function(req, res, next) {
	res.send('hello,goods list');  // 测试，连接成功页面出现'hello,goods list'
  
	Goods.find({},function(err, doc){  // Goods来自models/goods.js;导出的是mongoose的商品模型，可使用mongoose的API方法
		if(err) {
			res.json({
				status:'1',
				msg:err.message
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			})
		}
	})

});

module.exports = router;


// 启动express，检查是否链接数据库成功
// node server/bin/www 或 pm2方式 或 webstorm 等
// localhost:3000/goods/    // '/goods'是app.js中的一级路由，'/'是本页的二级路由