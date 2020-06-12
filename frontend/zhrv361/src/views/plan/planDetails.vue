<template>
  <div class="plan-details-page">
    <top-msg header-name="计划详情" />
    <div class="page-box">
      <div class="top">
        <ul class="list">
          <li class="item">
            <div class="title">
              已消费总金额
            </div>
            <div class="price">
              {{ details.consumed_amount }}元
            </div>
          </li>
          <li class="item">
            <div class="title">
              已完成总金额
            </div>
            <div class="price">
              {{ details.paid_amount }}元
            </div>
          </li>
          <li class="item">
            <div class="title">
              智能账单金额
            </div>
            <div class="price">
              {{ details.remained_amount }}元
            </div>
          </li>
        </ul>
        <div class="tips" v-if="details.repay_plan_info.repay_plan_info.execute_state =='FAILED'">
          <!--温馨提示：点击继续执行可以在原来的基础上继续执行此智能
          计划，你必须在计划中断4小时以内才可以点继续执行-->
         失败原因： {{details.repay_plan_info.repay_plan_info.reason_of_failing || '--'}}
        </div>
      </div>
      <ul class="list-box">
        <li v-for="(item,index) in details.bills" :key="index" class="item">
          <div class="title clear">
            <span class="date lt">日期: {{ item.plan_bill_info.plan_executed_time.substring(0,4) + "/" }}{{ item.plan_bill_info.plan_executed_time.substring(4,6) + "/" }}{{ item.plan_bill_info.plan_executed_time.substring(6,8) }}
              {{ item.plan_bill_info.plan_executed_time.substring(8,10)+ ":" }}{{ item.plan_bill_info.plan_executed_time.substring(10,12)+ ":" }}{{ item.plan_bill_info.plan_executed_time.substring(12,14) }}

            </span>
            <!-- <span class="date lt">日期: {{ item.plan_bill_info.plan_executed_time}}</span> -->
            <span :class="{'rt status':true,'status1':item.plan_bill_info.execute_state==='WAITING'}">{{ item.plan_bill_info.execute_state | executeStateFilter }}</span>
          </div>
          <div class="intro flex-row-between">
            <span class="lt text flex-row-center">
              <i :class="['iconfont',item.plan_bill_info.bill_type==='CONSUME'?'icon-xiaofei colorED0':'icon-huankuan maincolor']" />
              {{ item.plan_bill_info.bill_type==='CONSUME'?'消费账单':'智能账单' }}
            </span>
            <span class="rt price">{{ item.plan_bill_info.sum_amount }}元</span>
          </div>
        </li>
        <!-- <li v-for="(item,index) in details.bills" :key="index" class="item">
           <div class="title clear">
             <span class="date lt">日期 </span>
           </div>
         </li> -->
      </ul>
      <div v-if="details.repay_plan_info && ['SUCCESS','EXECUTING', 'WAITING', 'EXCEPTION', 'FAILED'].indexOf(details.repay_plan_info.repay_plan_info.execute_state) >= 0" class="add-btn">
        <!-- details.repay_plan_info.repay_plan_info.execute_state = WAITING SUCCESS - 无按钮  -->
        <!-- EXECUTING WAITING- 执行中 -->
        <span v-if="details.repay_plan_info && ['EXECUTING', 'WAITING'].indexOf(details.repay_plan_info.repay_plan_info.execute_state) >= 0 " class="btn" @click="termination">终止执行</span>
        <!-- EXCEPTION - 手动执行 -->
        <span v-if="details.repay_plan_info&&details.repay_plan_info.repay_plan_info.execute_state==='EXCEPTION'" class="btn continue" @click="continueFun">继续执行</span>
        <!-- FAILED - 提出还款金 第二个接口未提取状态才可以提取TODO:-->
        <!-- PENDING,PROCESSING,FAIL,REMITTED -->
        <!-- 未提取、处理中、失败、已提取 -->
        <span v-if="details.repay_plan_info&&details.repay_plan_info.repay_plan_info.execute_state==='FAILED'&&showConfirmMsg.repay_state==='PENDING'" class="btn" @click="propose">提出智能账单金额</span>
        <!-- EXECUTING FAILED- 软删除 -->
        <span v-else-if="details.repay_plan_info && ['SUCCESS', 'FAILED'].indexOf(details.repay_plan_info.repay_plan_info.execute_state) >= 0 " class="btn" @click="confirmDel">删除计划</span>
      </div>
      <van-popup v-model="showConfirm" class="confirm-pop">
        <div class="title">
          提示
        </div>
        <ul class="list">
          <li class="clear item">
            <span class="lt text">账单金额</span>
            <span class="rt text dec">{{ showConfirmMsg.amount }}元</span>
          </li>
          <li class="clear item">
            <span class="lt text">手续费</span>
            <span class="rt text dec">{{ showConfirmMsg.single_repay_fee }}元/笔</span>
          </li>
          <li class="clear item">
            <span class="lt text">提取到</span>
            <span class="rt text dec">{{ details.repay_plan_info&&details.repay_plan_info.bank_name }}（{{ details.repay_plan_info&&details.repay_plan_info.repay_plan_info.bank_card_no.substr(-4,4) }}）</span>
          </li>
        </ul>
        <div class="btn-box clear">
          <span class="btn lt" @click="showConfirm=false">返回</span>
          <span class="btn rt confirm" @click="confirmRepay">确定提取</span>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'PlanDetails',
  components: { topMsg },
  filters: {
    executeStateFilter(state) {
      return { 'WAITING': '等待执行', 'EXECUTING': '执行中', 'EXCEPTION': '执行异常', 'SUCCESS': '执行成功', 'FAILED': '执行失败' }[state]
    }
  },
  data() {
    return {
      id: this.$route.query.id,
      details: {},
      showConfirm: false,
      showConfirmMsg: {}
    }
  },
  created() {
    document.title = '计划详情'
    // console.log(this.id)
    this.planDetailFun()
  },
  methods: {
    getSinglePlanFun() {
      this.$api.repay.getSinglePlan({ planTradeNo: this.id }).then(res => {
        console.log(res)
        this.showConfirmMsg = res.data.data
      })
    },
    planDetailFun() {
      this.$api.plan.planDetail(this.id).then(res => {
        console.log(res.data.data)
        this.details = res.data.data
        if (this.details.repay_plan_info.repay_plan_info.execute_state === 'FAILED') {
          this.getSinglePlanFun()
        }
      })
    },
    continueFun() {

    },
    propose() {
      this.showConfirm = true
    },
    termination() {
      this.$dialog({
        title: '提示',
        message: '账单将终止执行',
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消'
      }).then(() => {
        this.$api.plan.stopRepayPlan(this.id).then(res => {
          // console.log(res)
          if (res.data.code === '200000') {
            this.$toast.success('终止成功')
            this.planDetailFun()
          }
        })
      })
    },
    confirmRepay() {
      this.$api.repay.manualRepay({ payback_bank_id: this.details.repay_plan_info.repay_plan_info.bank_card_id, plan_trade_no: this.id }).then(res => {
        // console.log(res)
        if (res.data.code === '200000') {
          this.showConfirm = false
          this.planDetailFun()
        }
      })
    },
    confirmDel() {
      this.$dialog({
        title: '提示',
        message: '计划将删除',
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消'
      }).then(() => {
        this.$api.plan.deleteRepayPlan(this.id).then(res => {
          this.$toast.success('删除成功')
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.plan-details-page{
  .page-box{
    padding: 24px;
    box-sizing: border-box;
    .top{
      padding: 34px 24px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 10px;
      box-shadow:0px 10px 20px rgba(14,66,128,0.05);
      .list{
        display: flex;
        justify-content: space-between;
        .item{
          text-align: center;
          .title{
            font-size: 26px;
            font-weight: bold;
          }
          .price{
            font-size: 30px;
            margin: 9px 0 28px;
            color: @red;
          }
        }
      }
      .tips{
        color: @lightGrey;
        font-size: 24px;
      }
    }
    .list-box{
        padding-bottom: 100px;
        box-sizing: border-box;
      .item{
        background:rgba(255,255,255,1);
        box-shadow:0px 10px 20px rgba(14,66,128,0.05);
        border-radius:10px;
        margin-top: 24px;
        .title{
          padding: 18px;
          box-sizing: border-box;
          border-bottom: 1px dashed rgba(204,204,204,1);
          .date{
            font-size: 26px;
            font-weight: bold;
          }
          .status{
            color: @red;
            font-size: 26px;
            &.status1{
              color: @green;
            }
          }
        }
        .intro{
          padding: 24px;
          box-sizing: border-box;
          .text{
            i{
              font-size: 40px;
              margin-right: 8px;
            }
            .colorED0{
              color:#ED0202;
            }
            .maincolor{
              color:@mainColorB;
            }
            font-size: 28px;
          }
          .price{
            color: @lightGrey;
            font-size: 28px;
          }
        }
      }
    }
    .add-btn{
      width:750px;
      height:100px;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 6px rgba(0,0,0,0.12);
      position: fixed;
      bottom: 0;
      text-align: center;
      line-height: 100px;
      left: 50%;
      transform: translate(-50%,0);
      .btn{
        display: inline-block;
        width:460px;
        height:74px;
        .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
        border-radius:10px;
        color: #fff;
        font-size: 30px;
        line-height: 74px;
        &.continue{
          width: 210px;
          margin-right: 34px;
          border:2px solid @mainColorB;
          color: @mainColorB;
          background: none;
        }
        &.propose{
          width: 210px;
          margin-left: 34px;
        }
      }
    }
    .confirm-pop{
      width:560px;
      height:auto;
      border-radius:10px;
      padding: 46px 36px 36px;
      box-sizing: border-box;
      .title{
        font-size: 36px;
        text-align: center;
      }
      .list{
        .item{
          border-bottom: 1px solid @moreLightGrey;
          padding: 18px 0;
          box-sizing: border-box;
          .text{
            font-size: 26px;
            &.dec{
              color: @subTextColor;
            }
          }
        }
      }
      .delTip{
        margin-top: 16px;
        text-align: center;
      }
      .btn-box{
        margin-top: 40px;
        .btn{
          width:210px;
          height:74px;
          border:2px solid #bf9761;
          border-radius:10px;
          display: inline-block;
          text-align: center;
          color: @mainColorB;
          line-height: 74px;
          background: none;
          &.confirm{
            .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
            color: #fff;
          }
        }
      }
    }
  }
}
</style>

