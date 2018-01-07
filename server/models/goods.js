// 对应数据库商品列表数据在resource文件夹的dumall-goods
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义一个Schema
var produtSchema = new Schema({
	'productId':String,   // 或者 'productId':{type:String}
	'productName':String,
	'salePrice':Number,
	'productImage':String,

    // 在列表页点击“加入购物车时”，会获取对应goods商品数据，然后给该商品添加checked和productNum属性，再将该商品添加到购物车列表中，Schema中不定义属性的话是添加不了的。
    "checked":String,
    "productNum":Number
})

// 输出(导出)
module.exports = mongoose.model('good',produtSchema); // 定义一个good商品模型，可以根据这个商品模型调用其API方法。
// 这个模型定义的是数据库dumall的goods集合数据，所以这个model取名good是对应这个集合，连接数据库之后，这个模型会根据名字的复数形式"goods"来查找数据集合。
// module.exports = mongoose.model('good',produtSchema,'goods'); 也可以后面注明链接的是数据库的goods集合













