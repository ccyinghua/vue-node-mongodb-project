// 对应数据库用户数据在resource文件夹的dumall-users
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义一个Schema
var userSchema = new Schema({
	'userId':String,   // 或者 'userId':{type:String}
	'userName':String,
	'userPwd':String,
	'orderList':Array,
    'cartList':[           // 购物车列表
        {
            "productId":String,
            "productName":String,
            "salePrice":Number,
            "productImage":String,
            "checked":String,     // 是否选中
            "productNum":String  // 商品数量
        }
    ],
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
})

// 输出(导出)
module.exports = mongoose.model('user',userSchema); // 定义一个user模型，可以根据这个模型调用其API方法。
// 这个模型定义的是数据库dumall的users集合数据，所以这个model取名user是对应这个集合，连接数据库之后，这个模型会根据名字的复数形式"users"来查找数据集合。
// module.exports = mongoose.model('user',userSchema,'users'); 也可以后面注明链接的是数据库的goods集合













