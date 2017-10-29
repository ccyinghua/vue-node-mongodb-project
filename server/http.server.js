let http = require('http');
let url = require('url');
let util = require('util');

let server = http.createServer((req,res) => {  // 创建一个http服务器
    res.statusCode = 200;  // 状态码

    res.setHeader("Content-Type","text/plain;charset=utf-8");  // 响应头设置值

    url.parse(req.url);  // 返回浏览器返回的url地址
    console.log('url:'+req.url);  // 字符串 /index.html?123
    console.log('parse:'+ url.parse(req.url));  // [object]

    util.inspect(url.parse(req.url));  // inspect调试模式,将一个对象转换成字符串进行输出
    console.log('inspect:'+ util.inspect(url.parse(req.url)));  // 展开object

    res.end(util.inspect(url.parse(req.url)));  // 输出结果
    //res.end(util.inspect(url.parse("http://localhost:3000/demo.html?a=123#tag")));  // 对完整的url进行解析
})

server.listen(3000, '127.0.0.1' , () =>{   // 监听端口
    console.log("服务器已经运行，请打开浏览器，输入：http://127.0.0.1:3000/ 来进行访问(localhost:3000也行)")
})












