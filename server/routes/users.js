var express = require('express');
var router = express.Router();

require('./../util/util');  // 引入时间格式化函数工具

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

// 查询购物车商品数量
router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userId){
    console.log("userId:"+req.cookies.userId);
    var userId = req.cookies.userId;
    User.findOne({"userId":userId}, function (err,doc) {
      if(err){
        res.json({
          status:"0",
          msg:err.message
        });
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status:"0",
          msg:"",
          result:cartCount
        });
      }
    });
  }else{
    res.json({
      status:"0",
      msg:"当前用户不存在"
    });
  }
});


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


// 商品修改
// 修改商品数量和勾选接口
router.post("/cartEdit",function(req,res,next){
    var userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked;
    User.update({             // 查询条件
        "userId":userId,
        "cartList.productId":productId
    },{                      // 修改的数据
        "cartList.$.productNum":productNum,
        "cartList.$.checked":checked
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
    });
})
//全选和取消全选
router.post('/editCheckAll',function(req,res,next){
    var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0';
    User.findOne({userId:userId},function(err,user){
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
          if(user){
            user.cartList.forEach((item)=>{
              item.checked = checkAll;
            })
            user.save(function (err1,doc) {
                if(err1){
                  res.json({
                    status:'1',
                    msg:err1,message,
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
          }
        }
    })
})


// 地址列表页面 **********************************************
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


// 创建订单页面 **********************************************
// 创建订单功能
router.post('/payMent', function(req,res,next){
    // 前端传参：订单的地址id;订单最终的总金额
    var userId = req.cookies.userId,
        addressId = req.body.addressId,
        orderTotal = req.body.orderTotal;
    User.findOne({userId:userId}, function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            var address = '',goodsList = [];
            // 获取当前用户的地址信息
            doc.addressList.forEach((item)=>{
                if(addressId == item.addressId){
                    address = item;
                }
            })
            // 获取当前用户的购物车的购买商品
            doc.cartList.filter((item)=>{
                if(item.checked == '1'){
                    goodsList.push(item);
                }
            })

            //创建订单Id
            var platform = '622'; // 平台系统架构码
            var r1 = Math.floor(Math.random()*10);
            var r2 = Math.floor(Math.random()*10);

            var sysDate = new Date().Format('yyyyMMddhhmmss');  // 系统时间：年月日时分秒
            var orderId = platform+r1+sysDate+r2;  // 21位

            // 订单创建时间
            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

            // 生成订单
            var order = {
                orderId:orderId,           // 订单id
                orderTotal:orderTotal,     // 订单总金额(直接拿前端传过来的参数)
                addressInfo:address,       // 地址信息
                goodsList:goodsList,       // 购买的商品信息
                orderStatus:'1',           // 订单状态，1成功
                createDate:createDate      // 订单创建时间
            }

            // 订单信息存储到数据库
            doc.orderList.push(order);

            doc.save(function (err1,doc1) {
                if(err1){
                    res.json({
                        status:"1",
                        msg:err.message,
                        result:''
                    });
                }else{
                    // 返回订单的id和订单的总金额给前端，下一个页面要用到
                    res.json({
                        status:"0",
                        msg:'',
                        result:{
                            orderId:order.orderId,
                            orderTotal:order.orderTotal
                        }
                    });
                }
            });
        }
    })
})

// 订单成功页面 **********************************************
//根据订单Id查询订单信息
router.get("/orderDetail", function (req,res,next) {
    var userId = req.cookies.userId,
        orderId = req.param("orderId");   // 前端传过来的订单id
    User.findOne({userId:userId}, function (err,userInfo) {
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            });
        }else{
            var orderList = userInfo.orderList;  // orderList订单列表
            if(orderList.length>0){  // 说明有订单
                var orderTotal = 0;
                // 遍历订单列表，根据订单id得到该订单总金额orderTotal
                orderList.forEach((item)=>{
                    if(item.orderId == orderId){
                        orderTotal = item.orderTotal;
                    }
                });
                if(orderTotal>0){
                    res.json({
                        status:'0',
                        msg:'',
                        result:{
                            orderId:orderId,
                            orderTotal:orderTotal
                        }
                    })
                }else{
                    res.json({
                        status:'120002',
                        msg:'无此订单',
                        result:''
                    });
                }
            }else{
                res.json({
                    status:'120001',
                    msg:'当前用户未创建订单',
                    result:''
                });
            }
        }
    })
});


module.exports = router;


