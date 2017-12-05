<template>
    <div>
        <!-- 头部组件 -->
        <nav-header></nav-header>
        <!-- 面包屑组件 -->
        <nav-bread>
            <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
          <div class="container">
            <div class="filter-nav">
              <span class="sortby">Sort by:</span>
              <a href="javascript:void(0)" class="default cur">Default</a>
              <a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
              <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
            </div>
            <div class="accessory-result">
              <!-- filter -->
              <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
                <dl class="filter-price">
                  <dt>Price:</dt>
                  <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></dd>
                  <dd v-for="(price,index) in priceFilter">
                    <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                  </dd>
                </dl>
              </div>

              <!-- search result accessories list -->
              <div class="accessory-list-wrap">
                <div class="accessory-list col-4">
                  <ul>
                    <li v-for="(item,index) in goodsList">
                      <div class="pic">
                        <a href="#">
                            <!-- <img :src="'/static/'+item.productImage" alt=""> -->
                            <img v-lazy="'/static/'+item.productImage" alt="">
                        </a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" class="btn btn--m">加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <!-- 滚动加载插件 -->
                  <div  class="view-more-normal"
                        v-infinite-scroll="loadMore"
                        infinite-scroll-disabled="busy"
                        infinite-scroll-distance="20">
                    <!-- 加载中... -->
                    <img v-show="loading" src="/static/loading-svg/loading-spinning-bubbles.svg" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 遮罩 -->
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <!-- 底部组件 -->
        <nav-footer></nav-footer>
    </div>
</template>

<script type="text/ecmascript-6">
import NavHeader from '@/components/NavHeader.vue'  // 头部
import NavFooter from '@/components/NavFooter.vue'  // 底部
import NavBread from '@/components/NavBread.vue'  // 底部
import axios from 'axios'

export default {
    data(){
        return {
            goodsList:[],   // 商品列表
            priceFilter:[   // 价格区间数组
                {
                    startPrice:'0.00',
                    endPrice:'100.00'
                },
                {
                    startPrice:'100.00',
                    endPrice:'500.00'
                },
                {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                },
                {
                    startPrice:'1000.00',
                    endPrice:'5000.00'
                }
            ],
            priceChecked:'all',   // 选中的价格区间
            filterBy:false,     // 控制价格菜单的显示
            overLayFlag:false,   // 遮罩的显示

            sortFlag:true,     // 排序:默认升序
            page:1,            // 当前第一页
            pageSize:8,         // 一页有8条数据

            busy:true,    // 滚动加载插件默认禁用

            loading:false    // 往下滚动"加载图标"的出现效果
        }
    },
    components:{
        NavHeader,
        NavFooter,
        NavBread
    },
    mounted:function(){
        this.getGoodsList();
    },
    methods:{
        getGoodsList(flag){
            var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag ? 1 : -1 ,  // sortFlag为true升序
              priceLevel:this.priceChecked   // 点击的价格区间
            }
            this.loading = true;
            axios.get("/goods",{
              params:param    // 传参
            }).then((res)=>{
                var res = res.data;
                this.loading = false;
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
        sortGoods(){   // 点击排序商品
          this.sortFlag = !this.sortFlag;
          this.page = 1; // 点击价格排序后从第一页开始
          this.getGoodsList();  // 重新加载数据
        },
        setPriceFilter(index){   // 点击价格
            this.priceChecked = index;
            this.closePop();
            this.getGoodsList();
        },
        showFilterPop(){     // 点击filterBy出现价格菜单和遮罩
            this.filterBy = true;
            this.overLayFlag = true;
        },
        closePop(){    // 关闭价格菜单和遮罩
            this.filterBy = false;
            this.overLayFlag = false;
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
