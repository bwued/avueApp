<template>
  <div class="recommend-page">
    <top-msg header-name="我的佣金" />
    <div class="con_body">
      <div class="box">
        <router-link class="item flex-row-between" to="/bill">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wodezhangdan" />
            </svg>
            <span>我的账单</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <div class="item flex-row-between" @click="goto(1,'FINANCIAL_LEVERAGE_GROUP')">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoukuan" />
            </svg>
            <span>收款分润</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <div class="item flex-row-between" @click="goto(1,'FINANCIAL_REPAYMENT_GROUP')">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-daihuan" />
            </svg>
            <span>代还分润</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <div class="item flex-row-between" @click="goto(3,'REGISTER,AUTHENTICATION,FIRST_TRADE_SUCCESS')">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tuijianjiangjin" />
            </svg>
            <span>推广奖金</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <div class="item flex-row-between" @click="goto(5,'')">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tuiguang" />
            </svg>
            <span>推广佣金</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <div class="item flex-row-between" @click="goto(3,'MANAGER')">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-guanli" />
            </svg>
            <span>管理奖</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <div class="item flex-row-between" @click="goto(4,'')">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jifen" />
            </svg>
            <span>积分记录</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <div class="item flex-row-between" @click="$router.push('/withdraw')">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tixian" />
            </svg>
            <span>提现</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <div class="item flex-row-between" @click="toMall">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-banka" />
            </svg>
            <span>办卡佣金</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <div class="item flex-row-between" @click="toMall">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-daikuan" />
            </svg>
            <span>贷款佣金</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'MyWallet',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true //
    }
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '我的钱包'
    },
    goto(currentNav, type) {
      const billMsg = {
        currentNav: currentNav,
        type: type
      }
      this.$store.commit('SET_BILL', billMsg)
      this.$router.push('/dailyEarnings')
    },
    toMall() {
      this.$dialog({
        title: '提示',
        message: '敬请期待',
        confirmButtonText: '确定'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-page{
  .con_body{
    padding: 24px;
    box-sizing: border-box;
    .box{
      width: 100%;
      padding: 40px 24px 1px 24px;
      box-sizing: border-box;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 20px rgba(14,66,128,0.08);
      border-radius:10px;
      .item{
        margin-bottom: 40px;
        svg{
          width: 68px;
          height: 68px;
          margin-right: 24px;
        }
        span{
          font-size: 28px;
        }
        i{
          font-size: 24px;
          color: #cccccc;
        }
      }
    }
  }
}

</style>
