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
              <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
              <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
            </div>
            <div class="accessory-result">
              <!-- filter -->
              <div class="filter stopPop" id="filter">
                <dl class="filter-price">
                  <dt>Price:</dt>
                  <dd><a href="javascript:void(0)">All</a></dd>
                  <dd>
                    <a href="javascript:void(0)">0 - 100</a>
                  </dd>
                  <dd>
                    <a href="javascript:void(0)">100 - 500</a>
                  </dd>
                  <dd>
                    <a href="javascript:void(0)">500 - 1000</a>
                  </dd>
                  <dd>
                    <a href="javascript:void(0)">1000 - 2000</a>
                  </dd>
                </dl>
              </div>

              <!-- search result accessories list -->
              <div class="accessory-list-wrap">
                <div class="accessory-list col-4">
                  <ul>
                    <li v-for="(item,index) in goodsList">
                      <div class="pic">
                        <a href="#"><img :src="'/static/'+item.prodcutImg" alt=""></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.prodcutPrice}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" class="btn btn--m">加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            goodsList:[]   // 商品列表
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
        getGoodsList(){
            axios.get("/goods").then((res)=>{
                var _res = res.data;
                this.goodsList = _res.result;
            })
        }
    }
}
</script>

<style scoped>

</style>
