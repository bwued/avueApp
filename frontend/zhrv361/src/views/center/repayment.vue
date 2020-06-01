<template>
  <div class="repayment-page">
    <top-msg header-name="智能账单金额" />
    <div class="top">
      <div class="box-bg">
        <img src="../../../static/img/img_background_huankuanjin.png">
      </div>
      <div class="box">
        <div class="title">
         智能账单余额（元）
        </div>
        <div class="price">
          {{ total_amount }}
        </div>
      </div>
    </div>
    <div class="list-title">
      <i class="iconfont icon-jilu" />
      智能账单金额记录
    </div>
    <van-tabs v-model="active" :swipe-threshold="5" @click="changeTab">
      <van-tab v-for="(item, index) in tabList" :key="index" :title="item.text" />
    </van-tabs>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      @load="getListFailPlans"
    >
      <ul class="list">
        <li v-for="(item,index) in checkPlanList" :key="index" class="item" @click="$router.push('/planDetails?id='+item.plan_trade_no)">
          <div class="box">
            <div class="title flex-row-between">
              <span class="lt time flex-row-center">
                <i class="iconfont icon-jihua" />
                <span>{{ item.state_time | timeToFormatDay }}</span>
              </span>
              <!-- PENDING,PROCESSING,FAIL,REMITTED -->
              <!-- 未提取、处理中、失败、已提取 -->
              <span :class="{'rt text':true,'noget':item.repay_state==='PENDING','doning':item.repay_state==='PROCESSING','fail':item.repay_state==='FAIL'}">{{ item.repay_state==='PENDING'?'未提取':item.repay_state==='PROCESSING'?'处理中':item.repay_state==='FAIL'?'失败':'已提取' }}</span>
            </div>
            <div class="clear msg">
              <span class="lt text">计划编号：{{ item.plan_trade_no }}</span>
              <span class="rt text">{{ item.amount }}元</span>
            </div>
          </div>
          <i class="iconfont icon-gengduo icon" />
        </li>
      </ul>
    </van-list>
  </div>
</template>
<script>
import { timeToFormatDay } from '@/utils/date'
import topMsg from '@/components/topMsg'
export default {
  name: 'Repayment',
  components: { topMsg },
  filters: {
    timeToFormatDay
  },
  data() {
    return {
      active: 0,
      state: '',
      tabList: [
        {
          id: 0,
          text: '全部'
        },
        {
          id: 1,
          text: '未提取'
        },
        {
          id: 2,
          text: '处理中'
        },
        {
          id: 3,
          text: '已提取'
        },
        {
          id: 4,
          text: '失败'
        }
      ],
      loading: false,
      finished: false,
      currPage: 0,
      list: [],
      total_amount: ''
    }
  },
  computed: {
    checkPlanList() {
      const list = this.list
      // <!--       PENDING,PROCESSING,REMITTED,FAIL -->
      // <!-- 0全部 1未提取、2处理中、3已提取、4失败 -->
      var arr = []
      for (const i of list) {
        if (this.active === 0) {
          arr.push(i)
        } else if (this.active === 1 && i.repay_state === 'PENDING') {
          arr.push(i)
        } else if (this.active === 2 && i.repay_state === 'PROCESSING') {
          arr.push(i)
        } else if (this.active === 3 && i.repay_state === 'REMITTED') {
          arr.push(i)
        } else if (this.active === 4 && i.repay_state === 'FAIL') {
          arr.push(i)
        }
      }
      return arr
    }
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '智能账单金额'
    },
    changeTab(index, title) {
      this.active = index
      this.loading = false
      this.finished = false
      this.list = []
      this.currPage = 0
      this.getListFailPlans()
    },
    getListFailPlans() {
      this.loading = true
      //  PENDING, PROCESSING, REMITTED, FAIL
      if (this.active === 0) {
        this.state = ''
      } else if (this.active === 1) {
        this.state = 'PENDING'
      } else if (this.active === 2) {
        this.state = 'PROCESSING'
      } else if (this.active === 3) {
        this.state = 'REMITTED'
      } else if (this.active === 4) {
        this.state = 'FAIL'
      }
      this.$api.repay.listFailPlans({ size: 10, page: this.currPage, state: this.state }).then(res => {
        console.log(res.data.data)
        this.loading = false
        if (res.data.data.repay_bills.length === 0) {
          this.finished = true
        } else {
          this.currPage++
        }
        this.total_amount = res.data.data.total_amount
        for (const i of res.data.data.repay_bills) {
          this.list.push(i)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.repayment-page{
  .top{
    position: relative;
    margin-bottom: 19px;
    width: 100%;
    height: 259px;
    overflow: hidden;
    .box-bg{
      height: 100%;
      margin: 24px 24px 0 24px;
      img {
        width: 100%;
      }
    }
    .img{
      width: 100%;
      height: 240px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%,0);
    }
    .box{
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translate(-50%,0);
      padding: 37px 0;
      text-align: center;
      border-radius: 10px;
      width: 702px;
      height: 200px;
      box-sizing: border-box;
      overflow: hidden;
      z-index: 99;
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left:50%;
        transform: translate(-50%,0);
      }
      .title{
        font-size: 28px;
        font-weight: bold;
        color: #ffffff;
      }
      .price{
        margin-top: 24px;
        font-size: 60px;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
  .list-title{
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin: 0 0 10px 0;
    color: #dbdbdb;
    .iconfont{
      font-size: 31px;
      margin-right: 4px;
      color: #dbdbdb;
    }
  }
  /deep/ .van-tabs--line .van-tabs__wrap{
    .van-tabs__nav .van-tabs__line{
      background-color: @mainColorB;
      height: 4px;
    }
    .van-tab{
      color: @lightGrey;
      font-size: 30px;
      &.van-tab--active{
        color: @mainColorB;
      }
    }
  }
  .list{
    padding: 112px 24px 0px;
    box-sizing: border-box;
    .item{
      padding: 24px 24px 24px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      background:#fff;
      box-shadow:0px 10px 20px rgba(14,66,128,0.05);
      border-radius: 10px;
      align-items: center;
      .box{
        width: 100%;
        .title{
          border-bottom: 3px dashed @moreLightGrey;
          padding: 0 0 21px 24px;
          box-sizing: border-box;
          .time{
            font-size: 26px;
            font-weight: bold;
          }
          .text{
            font-size: 26px;
            color: @green;
            &.noget{
              color: @yellow;
            }
            &.doning{
              color: @mainColorB;
            }
            &.fail{
              color: @red;
            }
          }
        }
        i{
          font-size: 48px;
          color: @mainColorB;
          margin-right: 10px;
        }
        .msg{
          padding: 22px 0 0 24px;
          box-sizing: border-box;
          .text{
            font-size: 28px;
            color: @subTextColor;
          }
        }
      }
      .icon{
        font-size: 16px;
        margin-left: 40px;
        color: @lightGrey;
        color:#999999;
      }
    }
  }
}
</style>

