<!--todo 智能账单 代还计划 2020/hgwn-->

<!-- http://localhost:8077/#/intelligence?code=BW_CT_DH_X_001 todo -->
<template>
  <van-popup v-model="isShowConfirmBill" class="confirm-bill-page">
    <div class="title">
      {{ fromIntelligencePage?'智能账单':'自定义账单' }}
    </div>
    <ul class="list">
      <li class="item clear">
        <span class="lt text">计划时间段</span>
        <span class="rt text">{{ minDate.getTime() | timeToFormatDay }}至{{ maxDate.getTime() | timeToFormatDay }}</span>
      </li>
      <li class="item clear">
        <span class="lt text">订单总金额</span>
        <span class="rt text price">{{ checkBillList&&checkBillList.usePrice }}元</span>
      </li>
      <li class="item clear">
        <span class="lt text">账单金额</span>
        <span class="rt text price">{{ checkBillList&&checkBillList.repayPrice }}元</span>
      </li>
      <li class="item clear">
        <span class="lt text">订单手续费</span>
        <span class="rt text price">{{ serviceCharge }}元</span>
      </li>
      <li class="item clear">
        <span class="lt text">智慧金:</span>
        <span class="rt text price">{{ fee_refund_money }}元</span>
      </li>
      <li class="item clear">
        <span class="lt text">消费笔数：{{ checkBillList&&checkBillList.useNum }}笔</span>
        <span class="rt text">费率：{{ (consumptionRate*100 ).toFixed(2) }}%，{{ (cRate*100 ).toFixed(2) }}%</span>
      </li>

      <li class="item clear">
        <span class="lt text">账单笔数：{{ checkBillList&&checkBillList.repayNum }}笔</span>
        <span class="rt text">单笔费用：{{ paymentHandlingFee }}元/笔
        </span>
      </li>
    </ul>
    <div class="dec">
      提醒：本次计划信用卡余额不少于：<span class="margin-amount">{{ checkBillList&&checkBillList.marginAmount }}元</span>
    </div>
    <div class="clear act-btn">
      <span class="lt btn-box cancel" @click="cancel">取消账单</span>
      <span class="rt btn-box confirm" @click="confirm">确认账单</span>
    </div>
  </van-popup>
</template>
<script>
import { timeToFormatDay } from '@/utils/date'
export default {
  name: 'ConfirmBill',
  filters: {
    timeToFormatDay
  },
  props: ['cRate', 'showConfirmBill', 'toHideConfirmBill', 'toShowConfirmBill', 'fromIntelligencePage', 'checkBillList', 'minDate', 'maxDate', 'confirmMsgList', 'bankCardId'],
  data() {
    return {
      isShowConfirmBill: false
    }
  },
  computed: {
    //   user_rate() {
    //   return this.$store.state.user_rate
    // },
    serviceCharge() {
      if (this.isShowConfirmBill) {
        return this.fromIntelligencePage ? this.checkBillList.service_fee : this.confirmMsgList && this.confirmMsgList.plan_info && this.confirmMsgList.plan_info.repay_plan_info.repay_service_fee + this.confirmMsgList && this.confirmMsgList.plan_info && this.confirmMsgList.plan_info.repay_plan_info.consume_service_fee
      } else {
        return null
      }
    },
    consumptionRate() {
      if (this.isShowConfirmBill) {
        return this.fromIntelligencePage ? this.checkBillList.consume_rate : this.confirmMsgList && this.confirmMsgList.plan_info && this.confirmMsgList.plan_info.repay_plan_info.consume_rate
      } else {
        return null
      }
    },
    paymentHandlingFee() {
      if (this.isShowConfirmBill) {
        return this.fromIntelligencePage ? this.checkBillList.repayFee : this.confirmMsgList && this.confirmMsgList.plan_info.repay_plan_info.repay_fee
      } else {
        return null
      }
    }
  },
  watch: {
    showConfirmBill(newValue, oldValue) {
      // 把父组件传来的变量赋值给子组件的变量，避免van-popup关闭后影响父组件的值
      this.isShowConfirmBill = newValue
      if (!newValue) {
        this.toHideConfirmBill()
      }
    },
    isShowConfirmBill(newV, oldV) {
      // 检测子组件的变量变化，实时更新父组件的变量
      if (!newV) {
        this.toHideConfirmBill()
      }
    }
  },
  created() {
    console.log(this.created)
  },
  methods: {
    cancel() {
      this.toHideConfirmBill()
    },
    confirm() {
      console.log('888888888')
      console.log(this.cRate)
      // this.$store.commit('SET_RATE', cRate)
      this.$api.plan.addRepayPlan({ bank_card_id: this.bankCardId, trade_no: this.fromIntelligencePage ? this.checkBillList.json_trade_no : this.confirmMsgList.plan_info.json_trade_no }).then(res => {
        console.log(res.data)
        if (res.data.code === '200000') {
          this.$toast.success('添加计划成功')
          this.$router.push('/planList')
        } else {
          this.$toast(res.data.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.confirm-bill-page{
  padding: 40px 24px;
  box-sizing: border-box;
  width: 560px;
  height: 830px;
  border-radius:10px;
  .title{
    font-size: 36px;
    text-align: center;
    margin-bottom: 40px;
    font-weight: bold;
  }
  .list{
    .item{
      padding: 18px 0;
      box-sizing: border-box;
      border-bottom: 1px solid @moreLightGrey;
      .text{
        font-size: 26px;
      }
      .price{
        color: @red;
      }
    }
  }
  .dec{
    font-size: 24px;
    color: @lightGrey;
    margin: 24px 0;
    .margin-amount {
      color: @red
    }
  }
  .act-btn{
    margin-top: 36px;
    .btn-box{
      display: inline-block;
      width:210px;
      height:74px;
      border:2px solid @mainColorB;
      border-radius:10px;
      text-align: center;
      line-height: 74px;
      font-size: 28px;
      &.cancel{
        color: @mainColorB;
      }
      &.confirm{
        .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
        color: #fff;
      }
    }
  }
}
</style>

