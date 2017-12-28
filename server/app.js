var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ejs = require('ejs');

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);  // 设置html后缀
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 捕获登录状态
app.use(function(req,res,next){   // 进入路由之前优先进入function
    if(req.cookies.userId){  // 有cookies,说明已经登录
        next();
    }else{
        console.log(`path:${req.path},originalUrl:${req.originalUrl}`);
        // 结果例 => path:/goods/list,originalUrl:/goods/list?page=1&pageSize=8&sort=1&priceLevel=all
        if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){  // 未登录时可以点击登录login登出logout和查看商品列表
        // if(req.originalUrl =='/users/login' || req.originalUrl == '/users/logout' || req.path == '/goods/list'){   // 第二种方法
            next();
        }else{
            res.json({
                status:'1001',
                msg:'当前未登录',
                result:''
            })
        }
    }
})


// 一级路由
app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler 捕获404的
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler  捕获500状态的
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
