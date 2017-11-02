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

```
vue init webpack vue-node-mongodb-project

cnpm install
npm run dev

cnpm install vue-resource --save
cnpm install axios --save

cnpm install vue-lazyload --save   // 图片加载

```
> 文件夹列表

- resource文件夹：静态资源文件
- server文件夹：nodeJs基础
    - commonJs文件夹：commonJS规范-module.exports/exports 
    - http.server.js：创建一个http server
- test文件夹：vue-resource,axios,ES6,ES6-promise基础用法
- mock文件夹：放入json数据

> 拆分组件分布

- GoodList.vue
    - NavHeader.vue-头部组件
    - NavFooter.vue-底部组件
    - NavBread.vue-面包屑组件

> Markdown说明文件

GoodsList.md - 商品列表模块实现GoodsList.vue

未完待续......