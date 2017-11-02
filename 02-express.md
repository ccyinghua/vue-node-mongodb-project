### express-project

> ##### 搭建基于Express框架运行环境


    * 安装express generator生成器
    * 通过生成器自动创建项目
    * 配置分析

###### 安装

```javascript
cnpm i -g express-generator
express --version        // 查看版本
express server  // 创建项目

```
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/07/image01.png?raw=true)

正常是前后端分离，建立两个项目。此项目为了测试前后端未分离，将package.json的dependencies合并到根目录的package.json。

```javascript
cnpm install   // 安装依赖
cd server
node bin/www   // 运行

```
浏览器输入localhost:3000

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/07/image02.png?raw=true)

#####  更换html模板引擎

express项目views文件夹内文件格式是.jade格式，若要改成HTML文件。 


```
cnpm install ejs --save   //安装ejs  

```

```
app.js

var ejs = require('ejs');
app.engine('.html',ejs.__express);  // 设置html后缀模板引擎
app.set('view engine', 'jade'); 改成 app.set('view engine', 'html');


在views文件夹内建立index.html文件，重新启动express

node bin/www

```
localhost:3000

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/07/image03.png?raw=true)



