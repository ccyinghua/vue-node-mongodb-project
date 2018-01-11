# vue-node-mongodb-project

> A Vue.js project

### 运行项目

1、先安装mongodb和环境搭建： [http://www.cnblogs.com/ccyinghua/p/7887713.html](http://www.cnblogs.com/ccyinghua/p/7887713.html)

2、安装mongovue,建立dumall数据库，增加goods和users集合，插入数据(数据在resource/dumall-goods和resource/dumall-users) <br>
![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/1.jpg?raw=true)

3、npm install<br>
4、node server/bin/www  // 启动express后端服务<br>
5、npm run dev


### 构建项目

```javascript
vue init webpack vue-node-mongodb-project

cnpm install
npm run dev

cnpm install vue-resource --save
cnpm install axios --save

cnpm install vue-lazyload --save   // 图片加载

* 构建express的一些安装 // 参考 02-express.md
* 安装mongoose // 参考03-GoodsListInterface.md

* cnpm install vue-infinite-scroll --save  // 安装滚动加载插件  04-pagingAndSort.md

```
> 文件夹列表

- resource文件夹：静态资源文件
- server文件夹：Express框架
- test文件夹：vue-resource,axios,ES6,ES6-promise基础用法
- mock文件夹：放入json数据

> 拆分组件分布

- GoodList.vue
    - NavHeader.vue-头部组件
    - NavFooter.vue-底部组件
    - NavBread.vue-面包屑组件

> Markdown说明文件

[01-GoodsList.md - 商品列表模块实现GoodsList.vue](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/01-GoodsList.md)
 <br/>
[02-express.md - 搭建基于express框架运行环境](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/02-express.md)
 <br/>
[03-GoodsListInterface.md - 基于Node.js开发商品列表接口](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/03-GoodsListInterface.md)
<br>
[04-pagingAndSort.md - 商品列表页分页和排序功能](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/04-pagingAndSort.md)
<br>
[05-priceAndCart.md - 商品列表价格过滤和加入购物车功能](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/05-priceAndCart.md)
<br>
[06-login.md - 登录模块(登录功能/登出功能/登录拦截功能/校验登录/全局模态框组件实现)](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/06-login.md)
<br>
[07-shoppingCart.md - 购物车模块实现(渲染购物车列表页面/购物车列表删除功能/购物车商品修改功能)](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/07-shoppingCart.md)




未完待续......


