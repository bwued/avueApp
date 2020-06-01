<!--代还计划-列表 todo hgwn 2012.1.7-->
<template>
  <div class="plan-list-page">
    <!-- <top-msg header-name="计划列表" /> -->
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/home')">
      <div class="text">
        {{ text }}
      </div>
    </div>
    <van-tabs v-model="active" :swipe-threshold="5" @click="changeTab">
      <van-tab v-for="(item, index) in tabList" :key="index" :title="item.text" />
    </van-tabs>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="已加载完毕"
      @load="userRepayPlanListFun"
    >
      <ul class="list">
        <li v-for="(item,index) in checkPlanList" :key="index" class="item clear" @click="$router.push('/planDetails?id='+item.json_trade_no)">
          <!--  execute_state:等WAITING, 执行EXECUTING, 例外EXCEPTION, 失败FAILED, 成功SUCCESS -->
          <div class="clear title">
            <i class="iconfont icon-dingdan maincolor lt" />
            <span class="lt text">订单号：{{ item.json_trade_no }}</span>
            <span :class="{'rt status':true,'status1':item.repay_plan_info.execute_state==='EXECUTING','status2':item.repay_plan_info.execute_state==='SUCCESS','status3':item.repay_plan_info.execute_state==='FAILED'}">
              {{
                item.repay_plan_info.execute_state==='WAITING'?'等待执行':item.repay_plan_info.execute_state==='EXECUTING'?'执行中':item.repay_plan_info.execute_state==='SUCCESS'?'执行成功':'失败'
              }}
            </span>
          </div>
          <ul class="item-list">
            <li class="list-item clear">
              <span class="lt text">{{ item.repay_plan_info.channel_code }}</span>
            </li>
            <li class="list-item clear">
              <img class="lt" :src="item.bank.bank_logo_image&&item.bank.bank_logo_image.url">
              <span class="lt text">{{ item.bank.name }}（尾号{{ item.repay_plan_info.bank_card_no.substr(-4,4) }}）</span>
              <span class="rt text">{{ item.create_time | timeToFormatDate }}</span>
            </li>

            <li class="list-item dec clear">
              <!-- 账单总金额+消费手续费+账单手续费=消费金额 -->
              <!-- <span class="lt dec-text">订单总金额：¥{{ (parseFloat(item.repay_plan_info.repay_sum_amount)+parseFloat(item.repay_plan_info.consume_service_fee)+parseFloat(item.repay_plan_info.repay_service_fee)).toFixed(2) }}</span> -->
              <span class="lt dec-text">订单总金额：¥{{ item.repay_plan_info.order_total_money }}</span>
              <span class="rt dec-text">账单金额：¥{{ item.repay_plan_info.repay_sum_amount }}</span>
            </li>
            <li class="list-item dec clear">
              <span class="lt dec-text">费率：{{ (item.repay_plan_info.consume_rate *100 ).toFixed(2) }}%,{{ (item.repay_plan_info.big_money_user_rate *100 ).toFixed(2) }}%</span>
              <span class="rt dec-text">账单手续费：¥{{ item.repay_plan_info.consume_service_fee }}</span>
            </li>
            <li class="list-item dec clear">
              <span class="lt dec-text">单笔费用：¥{{ item.repay_plan_info.repay_fee }}/笔</span>
              <span class="rt dec-text">账单笔数费：¥{{ item.repay_plan_info.repay_service_fee }}</span>
            </li>

            <li class="list-item dec clear">
              <span v-if="zhjShow" class="lt dec-text">{{ refundName }}：¥{{ item.repay_plan_info.fee_refund_money }}</span>
              <!-- <span class="rt dec-text">总手续费：¥{{ Number(item.repay_plan_info.consume_service_fee) +Number( item.repay_plan_info.repay_service_fee) }}</span> -->
              <span class="rt dec-text">总手续费：¥{{ item.repay_plan_info.order_total_fee }}</span>
            </li>
            <li v-if="item.repay_plan_info.execute_state==='FAILED' && item.repay_plan_info.fail_info" class="reason">
              {{ item.repay_plan_info.fail_info }}
            </li>
          </ul>
        </li>
      </ul>
    </van-list>
    <div v-if="pflag" class="add-btn">
      <span class="pl" @click="showSelectChannel=true"><img src="../../../static/img/gouwuche_jia_o.png" alt="">添加智能计划</span>
      <!-- v2懒人计划 ok -->
      <!-- <span class="pr" @click="gotoPage"><img src="../../../static/img/gouwuche_jia2.png" alt="">添加懒鬼计划</span> -->

      <!-- v3懒鬼计划 dev 先选择信用卡，在选择通道，最后走懒人v2代还计划 20200601 -->
      <span class="pr" @click="gotoPageV3"><img src="../../../static/img/gouwuche_jia2.png" alt="">添加懒鬼计划V3</span>
    </div>

    <div v-else class="add-btn">
      <span class="pl pc" @click="showSelectChannel=true"><img src="../../../static/img/gouwuche_jia_o.png" alt="">添加智能计划</span>
    </div>

    <van-popup v-model="showSelectChannel" position="bottom" class="select-channel">
      <select-channel />
    </van-popup>
  </div>
</template>
<script>
import { timeToFormatDate } from '@/utils/date'
import selectChannel from '@/components/selectChannel'
import topMsg from '@/components/topMsg'
export default {
  name: 'PlanList',
  filters: {
    timeToFormatDate
  },
  components: { selectChannel, topMsg },
  data() {
    return {
      pflag: true, // 是否启用懒鬼模式
      zhjShow: true, // 智慧金是否显示
      refundName: '智慧金',
      text: '计划列表',
      showSelectChannel: false,
      active: -1,
      z_sum: '',
      tabList: [
        {
          id: 0,
          text: '全部'
        },
        {
          id: 1,
          text: '等待执行'
        },
        {
          id: 2,
          text: '执行中'
        },
        {
          id: 3,
          text: '执行成功'
        },
        {
          id: 4,
          text: '失败'
        }
      ],
      planList: [],
      loading: false,
      finished: false,
      currPage: 0,
      userate: ''
    }
  },
  computed: {
    cRate() {
      return this.$store.state.cRate
    },
    checkPlanList() {
      const list = this.planList
      // <!--  execute_state:等 WAITING, 执行 EXECUTING, 例外 EXCEPTION, 失败 FAILED, 成功 SUCCESS -->
      // 0全部 1等待执行 2执行中 3执行成功 4失败
      var arr = []
      for (const i of list) {
        if (this.active === 0) {
          arr.push(i)
        } else if (this.active === 1 && i.repay_plan_info.execute_state === 'WAITING') {
          arr.push(i)
        } else if (this.active === 2 && i.repay_plan_info.execute_state === 'EXECUTING') {
          arr.push(i)
        } else if (this.active === 3 && i.repay_plan_info.execute_state === 'SUCCESS') {
          arr.push(i)
        } else if (this.active === 4 && i.repay_plan_info.execute_state === 'FAILED') {
          arr.push(i)
        }
      }
      return arr
    }
  },
  created() {
    console.log('计划列表')
    document.title = '计划列表        '
    this.search()
  },
  mounted() {
    // this.getshow() // todo 暂时不调用v2懒鬼计划配置项 20200601
  },
  methods: {
    getshow() {
      const that = this
      this.$api.plan.getFunction({ groupName: '添加计划', functionName: '懒鬼计划' }).then(res => {
        console.log(res)
        if (res.data.data[0].enable === 'on') {
          that.pflag = true
        } else {
          that.pflag = false
        }
      })
    },
    gotoPage() {
      this.$router.push({ path: '/intelligenceV3', query: { url: 'intelligenceV3', title: '懒鬼计划' }})
    },
    gotoPageV3() {
      this.$router.push({ path: '/credit', query: { url: 'credit', title: '懒鬼计划' }})
    },
    search() {
      this.z_sum = this.repay_plan_info.consume_service_fee + this.repay_plan_info.repay_fee
      console.log(this.z_sum)
    },
    changeTab(index, title, value) {
      this.active = index
      this.reflesh()
      this.userRepayPlanListFun()
    },
    reflesh() {
      this.planList = []
      this.currPage = 0
      this.finished = false
    },
    userRepayPlanListFun() {
      this.loading = true
      var data = {}
      if (this.active === 0) {
        data = { page: this.currPage, size: 7 }
      } else if (this.active === 1) {
        data = { page: this.currPage, size: 10, state: 'WAITING' }
      } else if (this.active === 2) {
        data = { page: this.currPage, size: 10, state: 'EXECUTING' }
      } else if (this.active === 3) {
        data = { page: this.currPage, size: 10, state: 'SUCCESS' }
      } else if (this.active === 4) {
        data = { page: this.currPage, size: 10, state: 'FAILED' }
      }
      this.$api.plan.userRepayPlanList(data).then(res => {
        this.loading = false
        console.log(res.data.data)
        const list = res.data.data.repay_plans
        for (const i of list) {
          this.planList.push(i)
        }
        if (list.length === 0) {
          this.finished = true
        } else {
          this.finished = false
          this.currPage++
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
//头部返回
.top {
  display: flex;
  flex-flow: row;
  background: white;
  padding-bottom: 0.8rem;
  // position: fixed;
  width: 100%;
  img {
    width: 1rem;
    height: 1.5rem;
    margin-top: 0.8rem;
    margin-left: 1rem;
  }
  .text {
    color: #000000ff;
    font-size: 1.3rem;
    margin-top: 0.6rem;
    margin-left: 8rem;
  }
}
.plan-list-page{
  /deep/ .van-tabs--line .van-tabs__wrap{
    height: 88px !important;
    .van-tabs__nav .van-tabs__line{
      background-color: #bf9761;
      height: 4px;
    }
    .van-tab{
      line-height: 88px;
      padding: 0;
      font-size: 30px;
      &.van-tab--active{
        color: #bf9761;
      }
    }
  }
  .list{
    padding: 88px 24px 64px;
    box-sizing: border-box;
    .item{
      background: #fff;
      border-radius: 15px;
      margin: 24px 0 ;
      box-shadow:0px 10px 20px rgba(14,66,128,0.05);
      .title{
        padding: 18px 24px;
        box-sizing: border-box;
        border-bottom:1px dashed rgba(204,204,204,1);
        i{
          font-size: 30px;
          margin-right: 8px;
          position: relative;
          top: 2px;
          color:@mainColorB;
        }
        .text{
          font-size: 26px;
          font-weight: bold;
        }
        .status{
          font-size: 26px;
          color: @yellow;
          &.status1{
            color: @green;
          }
          &.status2{
            color: @mainColorB;
          }
          &.status3{
            color: @red;
          }
        }
      }
      .item-list{
        padding: 0 24px 24px;
        box-sizing: border-box;
        .list-item{
          padding-top: 18px;
          img{
            width: 34px;
            height: 34px;
            margin-right: 8px;
          }
          .text{
            font-size: 26px;
          }
          &.dec{
            padding: 0;
            .dec-text{
              margin-top: 13px;
              font-size: 24px;
              color: @lightGrey;
            }
          }
        }
        .reason{
          margin-top: 13px;
          padding: 15px;
          box-sizing: border-box;
          background: @moreLightGrey;
          color: @lightGrey;
          font-size: 20px;
        }
      }
    }
  }
  .add-btn{
    width:750px;
    height:100px;
    background:#fff;
    position: fixed;
    bottom: 0;
    text-align: center;
    line-height: 100px;
    color: #FFFFFF;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:active {
      opacity: .6;
    }
    span{ color: #fff; margin-right: 40px; display: inline-block;
      height: 80px;
      line-height: 80px;
      border-radius: 12px;
      border: 1px solid #fff;
      width: 42.5%;
      margin: 0 auto;
      img {
      width: 36px;
      height: 36px;
      margin-right: 3px;
      margin-top: 20px;
    }
    }
    .pl{border-color:#BF9761; color:#BF9761; margin-left: 5%;}
    .pr{background:#BF9761; margin-right: 5%;}
    .pc{width: 60%; margin: 0 auto;}
    img {
      width: 36px;
      height: 36px;
      margin-right: 3px;
    }
  }
  .add-btn2{
    bottom: 100px;
    border-bottom: 1px dashed #f5f5f5;
    //  background:#3c8add;
  }
  .select-channel{
    height: 85%;
    width: 100%;
    overflow: hidden;
  }
}
</style>

