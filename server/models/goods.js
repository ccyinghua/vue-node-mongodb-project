var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var produtSchema = new Schema({
	'productId':String,   // 或者 'productId':{type:String}
	'productName':String,
	'salePrice':Number,
	'productImage':String
})

// 输出(导出)
module.exports = mongoose.model('Good',produtSchema); // 定义一个Good商品模型，可以根据这个商品模型调用其API方法














