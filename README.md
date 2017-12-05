# vue-node-mongodb-project

> A Vue.js project

### Build Setup

```javascript
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

```
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
[05-priceFilter.md - 列表页价格过滤功能](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/05-priceFilter.md)

未完待续......