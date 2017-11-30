## 商品列表页分页和排序功能


> #### 一、后台实现分页排序功能
server/routes/goods.js

```javascript
// 二级路由
/* GET goods page. */
router.get('/', function(req, res, next) {
    // res.send('hello,goods list');  // 测试路由，连接成功页面出现'hello,goods list'
    
    // express获取请求参数
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let sort = req.param("sort");
    let skip = (page-1)*pageSize; // 跳过的数据条数，(分页的公式).
    let params = {};
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize); // 先查询所有，skip(skip)跳过skip条数据，limit(pageSize)一页多少条数据.
    goodsModel.sort({'salePrice':sort}); // 对价格排序
    
    goodsModel.exec(function(err, doc){
    	if(err) {
    		res.json({
    			status:'1',
    			msg:err.message
    		})
    	}else{
    		res.json({
    			status:'0',
    			msg:'',
    			result:{
    				count:doc.length,
    				list:doc
    			}
    		})
    	}
    })

});

```
启动express,在server文件夹 node bin/www , 浏览器 http://localhost:3000/goods?page=1&pageSize=5&sort=1 (page=1第一页;pageSize=5一页显示5条;sort=1升序),数据库一共17条，第四页是最后一页，只显示2条。

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/09/6.jpg?raw=true)

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/09/7.jpg?raw=true)

<br>

> #### 二、前端实现分页排序

###### 2.1 分页排序

src/views/GoodsList.vue

```javascript

export default {
    data(){
        return {
            sortFlag:true,     // 排序:默认升序
            page:1,            // 当前第一页
            pageSize:8         // 一页有8条数据
        }
    },
    mounted:function(){
        this.getGoodsList();
    },
    methods:{
        getGoodsList(){
            var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag ? 1 : -1   // sortFlag为true升序
            }
            axios.get("/goods",{
              params:param    // 传参
            }).then((res)=>{
                var res = res.data;
                if(res.status == "0"){
                  this.goodsList = res.result.list;
                }else{
                  this.goodsList = [];
                }
            })
        },
        sortGoods(){   // 点击页面右上角"price"排序商品
          this.sortFlag = !this.sortFlag;
          this.page = 1; // 点击价格排序后从第一页开始
          this.getGoodsList();  // 重新加载数据
        },
    }
}

```
列表页只显示8条，默认升序

![image](https://github.com/ccyinghua/vue-node-mongodb-project/blob/master/resource/readme/09/8.jpg?raw=true)

###### 2.2滚动加载插件 vue-infinite-scroll &nbsp;&nbsp; [https://www.npmjs.com/package/vue-infinite-scroll](https://www.npmjs.com/package/vue-infinite-scroll)


```javascript
cnpm install vue-infinite-scroll --save  // 安装

Usage:
<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
  ...
</div>

v-infinite-scroll="loadMore"      // 滚动的时候加载的方法
infinite-scroll-disabled="busy"   // 是否禁用此方法，busy为true就失效不滚动
infinite-scroll-distance="10"     // 滚动的距离，滚定条距离底部多远就触发加载

```

main.js导入插件

```javascript
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
```
GoodsList.vue

```javascript

<!-- 滚动加载插件 -->
<div class="view-more-normal" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    加载中...
</div>
<script>
export default {
    data(){
        return {
            busy:true    // 滚动加载插件默认禁用
        }
    },
    mounted:function(){
        this.getGoodsList();
    },
    methods:{
        getGoodsList(flag){
            var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag ? 1 : -1   // sortFlag为true升序
            }
            axios.get("/goods",{
              params:param    // 传参
            }).then((res)=>{
                var res = res.data;
                if(res.status == "0"){
                  if(flag){   // true.商品数据累加
                    this.goodsList = this.goodsList.concat(res.result.list);

                    if(res.result.count == 0){  // 0条数据了，就不加载滚动加载方法了
                      this.busy = true; // 禁用
                    }else{
                      this.busy = false; // 启用
                    }

                  }else{  // 只加载一页
                    this.goodsList = res.result.list;
                    this.busy = false;
                  }
                }else{
                  this.goodsList = [];
                }
            })
        },
        loadMore(){   // 滚动加载插件方法
            this.busy = true; // 滚动就禁用，防止下一个滚动
            setTimeout(() => {   // 一个滚动完成之后再滚动加载下一个
                this.page++;
                this.getGoodsList(true);  // 滚动加载是累加数据，并不是只显示一页数据，so需要传参去请求数据的地方判断一下
            }, 500);
        }
    }
}
</script>



```











