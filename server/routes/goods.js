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
	// res.send('hello,goods list');  // 测试路由，连接成功页面出现'hello,goods list'

	// express获取请求参数
	let page = parseInt(req.param("page"));
	let pageSize = parseInt(req.param("pageSize"));
	let priceLevel = req.param("priceLevel");  // 传过来的价格区间
	let sort = req.param("sort");
	let skip = (page-1)*pageSize; // 跳过的数据条数，(分页的公式).
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
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize); // 先查询所有，skip(skip)跳过skip条数据，limit(pageSize)一页多少条数据.即分页功能实现
	goodsModel.sort({'salePrice':sort}); // 对价格排序功能

	goodsModel.exec(function(err, doc){
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


// 启动express
// node server/bin/www 或 pm2方式 或 webstorm 等
// localhost:3000/goods/    // '/goods'是app.js中的一级路由，'/'是本页的二级路由