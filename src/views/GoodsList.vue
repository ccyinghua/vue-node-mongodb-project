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
            overLayFlag:false   // 遮罩的显示
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
                var res = res.data;
                if(res.status == "0"){
                  this.goodsList = res.result.list;
                }else{
                  this.goodsList = [];
                }
            })
        },
        setPriceFilter(index){   // 点击价格
            this.priceChecked = index;
            closePop();
        },
        showFilterPop(){     // 点击filterBy出现价格菜单和遮罩
            this.filterBy = true;
            this.overLayFlag = true;
        },
        closePop(){    // 关闭价格菜单和遮罩
            this.filterBy = false;
            this.overLayFlag = false;
        }
    }
}
</script>

<style scoped>

</style>
