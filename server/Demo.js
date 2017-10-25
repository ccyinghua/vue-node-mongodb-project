let user = require('./User.js');

console.log(`userName:${user.userName}`);

console.log(`I am ${user.userName},I say ${user.sayHello()}`);



let http = require('http');

let server = http.createServer((req,res) => {  // 创建一个http服务器
    res.statusCode = 200;  // 状态码
    res.setHeader("Content-Type","text/plain;charset=utf-8");  // 响应头设置值
    res.end("Hello,Node.js");
})

server.listen(3000, '127.0.0.1' , () =>{   // 监听端口
    console.log("服务器已经运行，请打开浏览器，输入：http://127.0.0.1:3000/ 来进行访问(localhost:3000也行)")
})


