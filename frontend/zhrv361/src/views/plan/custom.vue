<template>
  <div class="intelligence-page">
    <top-msg header-name="自定义添加计划" />
    <ul class="top-list">
      <li class="clear item" @click="showSelectCard=true">
        <span class="lt text">选择信用卡</span>
        <span class="rt intro">
          <!-- 需判断对象是否为空 -->
          {{ bankMsg.bank_info&&bankMsg.bank_info.name }}{{ Object.keys(bankMsg).length === 0 && bankMsg.constructor === Object?'':'（尾号' }}{{ bankMsg && bankMsg.card_no }}{{ Object.keys(bankMsg).length === 0 && bankMsg.constructor === Object?'':'）' }}
          <van-icon name="arrow" />
        </span>
      </li>
      <li class="clear item" @click="showSelectAddress=true">
        <span class="lt text">选择省市</span>
        <van-icon name="arrow" class="rt" />
        <span class="rt text">{{ selectedAreaList.all }}</span>
      </li>
    </ul>
    <div class="add-btn" @click="showAddBillFun">
      <i class="iconfont icon-jia" />
      添加账单
    </div>
    <!-- 账单信息 -->
    <div v-if="billList.length>0" class="msg-box">
      <div class="situation">
        <div class="reset-btn" @click="toResetFun">
          <div class="text">
            账单
          </div>
          <div class="text">
            重置
          </div>
        </div>
        <div class="item">
          <div class="text">
            消费{{ checkBillList.useNum }}笔
          </div>
          <div class="price">
            {{ checkBillList.usePrice }}元
          </div>
        </div>
        <div class="item">
          <div class="text">
            还款{{ checkBillList.repayNum }}笔
          </div>
          <div class="price">
            {{ checkBillList.repayPrice }}元
          </div>
        </div>
      </div>
      <ul class="list">
        <li v-for="(item,index) in billList" :key="index" class="item">
          <div class="box">
            <div class="title">
              {{ item.bill_type==='CONSUME'?'消费':'还款' }}时间
            </div>
            <div class="text">
              {{ item.selectedDate }}
            </div>
          </div>
          <div class="box">
            <div class="title">
              {{ item.bill_type==='CONSUME'?'消费':'还款' }}金额
            </div>
            <div class="text">
              {{ item.amount }}元
            </div>
          </div>
        </li>
        <li class="item btn-box">
          <!-- 判断消费的总金额是否等于还款总金额 -->
          <div class="submit-btn" @click="submit()">
            提交账单
          </div>
        </li>
      </ul>
    </div>
    <!-- 添加账单 -->
    <van-popup v-model="showAddBill" class="add-bill" position="center">
      <div class="title">
        添加账单
        <img src="../../../static/img/exit.png" @click="showAddBill=false">
      </div>
      <ul class="list">
        <li class="clear item" @click="showDatetimePicker=true">
          <span class="lt text">日期</span>
          <input v-model="addList.selectedDate" type="text" :class="{'rt input':true,'on':addList.selectedDate}" placeholder="请选择日期">
        </li>
        <li class="clear item" @click="showDatetimePicker1=true">
          <span class="lt text">消费时间</span>
          <input v-model="currentTime1" type="text" :class="{'rt input':true,'on':addList.consumptionTime}" placeholder="消费时间">
        </li>
        <li class="clear item" @click="showDatetimePicker2=true">
          <span class="lt text">还款时间</span>
          <input v-model="currentTime2" type="text" :class="{'rt input':true,'on':addList.repaymentTime}" placeholder="还款时间">
        </li>
        <li class="clear item">
          <span class="lt text">金额</span>
          <span :class="{'rt input': true,'red':addList.amount}">
            <input v-model.number="addList.amount" type="number" class="input red" placeholder="0">
            元
          </span>
        </li>
      </ul>
      <div class="save-btn" @click="toSave">
        保存
      </div>
    </van-popup>
    <!-- DatetimePicker -->
    <van-popup v-model="showDatetimePicker" class="picker-box" position="bottom" :overlay="false">
      <van-datetime-picker
        v-model="currentValue"
        class="picker"
        type="date"
        :max-date="maxDate"
        :min-date="minDate"
        style="z-index:99999"
        title="选择日期"
        @confirm="confirmFun"
        @cancel="cancelFun"
      />
    </van-popup>
    <van-popup v-model="showDatetimePicker1" class="picker-box" position="bottom" :overlay="false">
      <van-datetime-picker
        v-model="currentTime1"
        class="picker"
        type="time"
        :min-hour="10"
        :max-hour="20"
        style="z-index:99999"
        title="选择时间"
        @confirm="confirmFun1"
        @cancel="cancelFun1"
      />
    </van-popup>
    <van-popup v-model="showDatetimePicker2" class="picker-box" position="bottom" :overlay="false">
      <van-datetime-picker
        v-model="currentTime2"
        class="picker"
        type="time"
        :min-hour="10"
        :max-hour="20"
        style="z-index:99999"
        title="选择时间"
        @confirm="confirmFun2"
        @cancel="cancelFun2"
      />
    </van-popup>
    <!-- 确认账单 -->
    <confirm-bill
      :bank-card-id="bankMsg.id"
      :min-date="minDate"
      :max-date="maxDate"
      :show-confirm-bill="showConfirmBill"
      :to-hide-confirm-bill="hideConfirmBillFun"
      :to-show-confirm-bill="showConfirmBillFun"
      :from-intelligence-page="false"
      :check-bill-list="checkBillList"
      :confirm-msg-list="confirmMsgList"
    />
    <!-- 地址 -->
    <van-popup v-model="showSelectAddress" position="bottom" class="picker">
      <van-area :area-list="areaList" :columns-num="2" title="选择地址" @confirm="determine($event)" @cancel="cancel" />
    </van-popup>
    <!-- 选择银行卡 -->
    <select-card :show-select-card="showSelectCard" :hide-select-card="hideSelectCardFun" :show-add-card-flag="showAddCardFlag" :current-nav="1" @selectedCard="selectedCardFun" @showAddCard="showAddCardFun" />
    <!-- 选择储蓄卡 -->
    <select-card :show-select-card="showSelectDepositCard" :hide-select-card="hideSelectDepositCardFun" :show-add-card-flag="showAddDepositCardFlag" :current-nav="0" @selectedCard="selectedDepositCardFun" @showAddCard="showAddDepositCardFun" />
    <div v-if="isbindCard" class="add-page">
      <bind-card :from-intelligence-page="true" :hide-bind-card="hideBindCardFun" :c-id="bankMsg.id" :c-code="channel_code" @toSuccess="showConfirmBillFun" />
    </div>
  </div>
</template>
<script>
import { DatetimePicker } from 'vant'
import confirmBill from './confirmBill'
import list from '../../assets/area.js'
import selectCard from '@/components/selectCard'
import { timeToFormatDate } from '@/utils/date'
import topMsg from '@/components/topMsg'
import bindCard from '@/views/proceeds/bindCard'
export default {
  name: 'Intelligence',
  components: {
    [DatetimePicker.name]: DatetimePicker,
    confirmBill,
    selectCard,
    topMsg,
    bindCard
  },
  filters: {
    timeToFormatDate
  },
  data() {
    return {
      isbindCard: false,

      showSelectDepositCard: false, // 储蓄卡选择框
      showAddDepositCardFlag: false,

      showAddBill: false,
      showSelectCard: false,
      addList: {
        bill_type: 'CONSUME', // 0消费 1还款 CONSUME, REPAY
        amount: '',
        plan_executed_time: '',
        selectedDate: '',
        consumption_time: '',
        repayment_time: ''
      },
      // DatetimePicker
      maxDate: new Date(new Date().setDate(31)),
      minDate: new Date(new Date().setDate(1)),
      currentDate: new Date(),
      currentValue: new Date(),
      currentTime1: '12:00',
      currentTime2: '12:00',
      showDatetimePicker: false,
      showDatetimePicker1: false,
      showDatetimePicker2: false,
      dateList: {
        year: '',
        month: '',
        date: '',
        hour: '',
        minute: '',
        timeStamp: ''
      },
      // DatetimePicker
      billList: [],
      showConfirmBill: false,
      areaPicker: false,
      // address
      showSelectAddress: false,
      areaList: {},
      selectedAreaList: {},
      // end
      bankMsg: {}, // 银行卡信息
      confirmMsgList: {},
      repayConstraint: {},
      channel_code: this.$route.query.code,
      showAddCardFlag: false,

      amount: null,
      sum_amount: null
    }
  },
  beforeRouteLeave(to, from, next) {
    // 离开守卫
    if (this.showAddCardFlag) {
      this.showAddCardFlag = false
      next(false)
    } else if (this.showAddDepositCardFlag) {
      this.showAddDepositCardFlag = false
      next(false)
    } else if (this.isbindCard) {
      // this.isbindCard = false
      next(false)
    } else {
      next()
    }
  },
  computed: {
    checkBillList() {
      const list = this.billList
      var usePrice = 0; var repayPrice = 0; var useNum = 0; var repayNum = 0
      for (const i of list) {
        if (i.bill_type === 'CONSUME') {
          // 消费
          usePrice += i.amount
          useNum++
        } else {
          // 还款
          repayPrice += i.amount
          repayNum++
        }
      }
      const msg = { usePrice: usePrice.toFixed(2), repayPrice: repayPrice.toFixed(2), useNum: useNum, repayNum: repayNum, marginAmount: this.confirmMsgList.repay_plan_margin_amount }
      return msg
    },
    cityRecord: {
      get: function() {
        return JSON.parse(localStorage.getItem('intelligenceArea'))
      },
      set: function(val) {
        localStorage.setItem('intelligenceArea', JSON.stringify(val))
      }
    },
    consumeTimeStamp() {
      return new Date(this.addList.selectedDate + ' ' + this.currentTime1).getTime()
    },
    repayTimeStamp() {
      return new Date(this.addList.selectedDate + ' ' + this.currentTime2).getTime()
    }
  },
  watch: {
    showAddBill(newValue, oldValue) {
      if (!newValue) {
        this.showDatetimePicker = false
      }
    }
  },
  created() {
    document.title = '自定义还款'
    this.areaList = list
    this.getRepayConstraint()
    /* 如果之前有选择过地址的，默认先显示之前选择的地址*/
    if (this.cityRecord) {
      this.selectedAreaList = this.cityRecord
    }
  },
  activated() {
    this.channel_code = this.$route.query.code
  },
  methods: {
    /* 注册渠道信息流程 */
    /* 获取储蓄卡列表*/
    getCardListFun() {
      const that = this
      const cardType = 'DEBIT'
      that.$api.card.getCardList(cardType).then(res => {
        console.log(res)
        const cardLists = res.data.data
        let debit_card_id = cardLists.map(item => {
          if (item.card_info.auth === true) {
            return item.id
          }
        })
        debit_card_id = debit_card_id.join('')
        if (debit_card_id === '') {
          console.log('选择储蓄卡')
          that.showSelectDepositCard = true
        } else {
          that.registrationChannels(debit_card_id)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    registrationChannels(debit_card_id) {
      const that = this
      const registrationData = {
        channel_code: that.channel_code,
        credit_card_id: that.bankMsg.id,
        debit_card_id: debit_card_id
      }
      that.$api.card.registrationChannels(registrationData).then(res => {
        console.log(res)
        if (res.data.code === '200000') {
          that.showConfirmBill = true
        }
      }).catch(error => {
        console.log(error)
        const res = error.data
        // 未绑卡
        if (res.code === '921006' || res.code === '921010') {
          that.isbindCard = true
        }
      })
    },
    hideSelectDepositCardFun() {
      this.showSelectDepositCard = false
    },
    // 选择储蓄卡
    selectedDepositCardFun(data) {
      // console.log(data)
      this.depositbankMsg = data
      this.registrationChannels(this.depositbankMsg.id)
    },
    showAddDepositCardFun(flag) {
      this.showAddDepositCardFlag = flag
    },
    hideBindCardFun() {
      this.isbindCard = false
    },
    /* 注册渠道信息流程end */
    showAddCardFun(flag) {
      this.showAddCardFlag = flag
    },
    toResetFun() {
      this.$dialog({
        title: '提示',
        message: '是否要重置账单？',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.billList = []
      })
    },
    getRepayConstraint() {
      this.$api.plan.repayConstraint().then(res => {
        this.repayConstraint = res.data.data
      })
    },
    // 显示添加账单页面
    showAddBillFun() {
      if (Object.keys(this.bankMsg).length === 0 && this.bankMsg.constructor === Object) {
        this.$toast('请先选择银行卡')
        return false
      }
      this.showAddBill = true
    },
    // 城市联动框
    cityChoice: function() {
      this.show = true
    },
    determine(val) {
      const area = {}
      area.all = val[0].name + ' ' + val[1].name
      area.province = val[0].name
      area.city = val[1].name
      area.region = val[1].code
      Object.assign(this.selectedAreaList, area)
      this.showSelectAddress = false
      this.cityRecord = this.selectedAreaList
    },
    cancel: function() {
      this.showSelectAddress = false
    },
    // 地址end
    hideSelectCardFun() {
      this.showSelectCard = false
    },
    judeRange(useDay, repayDay) {
      // TODO:
      if (!useDay && !repayDay) {
        this.minDate = new Date(new Date().setDate(1))
        this.maxDate = new Date(new Date().setDate(31))
        return false
      } else if (!useDay) {
        this.minDate = new Date(new Date().setDate(1))
        return false
      } else if (!repayDay) {
        this.maxDate = new Date(new Date().setDate(31))
        return false
      }
      const use = parseInt(useDay)
      const repay = parseInt(repayDay)
      const currentDate = new Date()
      const now = currentDate
      const nowDate = currentDate.getDate()
      const nowMonth = currentDate.getMonth()
      let setNextMonth = 0
      if (nowMonth < 11) {
        setNextMonth = nowMonth + 1
      } else {
        setNextMonth = 0
      }
      // 例：当天24
      // use < repay:
      // 1,18 当天前 - 下月1-18   repay < nowDate
      // 1,25 当天内 - 当月24-25  repay > nowDate && use < nowDate
      // 1,24 截止日当天 - 下月1-24 repay = nowDate && use < nowDate
      // 25,31 当天后 - 当月25-31 repay > nowDate && use > nowDate
      // use > repay:
      // 18, 下月1 - 下月18-下下月1  use < nowDate
      // 25，下月1 - 当月25-下月1    use > nowDate
      if (use < repay) {
        // 当前日期比到期日期要大
        if (nowDate >= repay) {
          this.minDate = new Date(now.setMonth(setNextMonth, use + 1))
          this.maxDate = new Date(now.setMonth(setNextMonth, repay - 1))
        }

        // 当前日期比账单日期要小
        if (nowDate <= use) {
          this.minDate = new Date(now.setMonth(nowMonth, use + 1))
          this.maxDate = new Date(now.setMonth(nowMonth, repay - 1))
        }

        // 当前日期比账单日期大、比到期日小
        if (nowDate > use && nowDate < repay) {
          this.minDate = new Date(now.setMonth(nowMonth, nowDate + 1))
          this.maxDate = new Date(now.setMonth(nowMonth, repay - 1))
        }
      } else if (use > repay) {
        // 当前日期比账单日期要大
        if (nowDate > use) {
          this.minDate = new Date(now.setMonth(nowMonth, nowDate + 1))
          this.maxDate = new Date(now.setMonth(setNextMonth, repay - 1))
        }

        // 当前日期比账单日期要小（比到期日小的已排除）
        if (nowDate >= repayDay && nowDate <= use) {
          this.minDate = new Date(now.setMonth(nowMonth, use + 1))
          this.maxDate = new Date(now.setMonth(setNextMonth, repay - 1))
        }

        // 当前日期比到期日期要小
        if (nowDate < repayDay) {
          this.minDate = new Date(now.setMonth(nowMonth, nowDate + 1))
          this.maxDate = new Date(now.setMonth(nowMonth, repay - 1))
        }
      }
      this.currentValue = this.minDate
    },
    // 选择银行卡
    selectedCardFun(data) {
      // console.log(data)
      this.bankMsg = data
      this.bankMsg.card_no = this.bankMsg.card_info.card_no.substr(-4, 4)

      this.$api.card.getCard('CREDIT', this.bankMsg.id).then(res => {
        const card = { id: res.data.data.id, card_info: { ...res.data.data }, bank_info: res.data.data.bank_info }
        this.$store.commit('SET_CURRENT_CREDIT_CARD', card)
      })

      // range
      this.judeRange(data.card_info.bill_date, data.card_info.repayment_date)
      this.billList = []
    },
    hideConfirmBillFun() {
      this.showConfirmBill = false
    },
    showConfirmBillFun() {
      this.showConfirmBill = true
    },
    submit() {
      const arr = []
      for (const i of this.billList) {
        const obj = {
          bill_type: i.bill_type,
          amount: (i.post_amount * 100).toFixed(0),
          plan_executed_time: i.plan_executed_time,
          sum_amount: (i.sum_amount * 100).toFixed(0)
        }
        arr.push(obj)
      }
      const data = {
        bills: arr,
        card_id: this.bankMsg.id,
        city_code: this.selectedAreaList.region,
        channel_code: this.channel_code,
        amount: this.amount
      }
      this.$api.plan.genCustom(data).then(res => {
        console.log(res)
        if (res.data.code === '200000') {
          this.confirmMsgList = res.data.data
          // this.showConfirmBill = true
          this.getCardListFun()
          console.log(1)
        } else {
          this.$toast(res.data.msg)
        }
      })
    },
    confirmFun(value) {
      this.showDatetimePicker = false
      this.dateList.year = new Date(value).getFullYear()
      const month = new Date(value).getMonth() + 1
      this.dateList.month = String(month).length < 2 ? '0' + month : month
      this.dateList.date = new Date(value).getDate()
      this.dateList.hour = new Date(value).getHours()
      this.dateList.minute = new Date(value).getMinutes()
      this.addList.selectedDate = this.dateList.year + '-' + this.dateList.month + '-' + this.dateList.date
      this.addList.plan_executed_time = value.getTime()
      // console.log(this.addList.selectedDate)
    },
    cancelFun() {
      this.showDatetimePicker = false
    },
    confirmFun1(value) {
      this.showDatetimePicker1 = false
    },
    cancelFun1() {
      this.showDatetimePicker1 = false
    },
    confirmFun2(value) {
      this.showDatetimePicker2 = false
    },
    cancelFun2() {
      this.showDatetimePicker2 = false
    },
    reFlesh() {
      this.addList = {
        bill_type: 'CONSUME', // 0消费 1还款 CONSUME, REPAY
        amount: '',
        plan_executed_time: '',
        selectedDate: ''
      }
    },
    async toSave() {
      if (!this.addList.selectedDate) {
        this.$toast('请选择日期')
        return false
      } else if (!this.currentTime1) {
        this.$toast('请选择消费时间')
        return false
      } else if (!this.currentTime2) {
        this.$toast('请选择还款时间')
        return false
      }
      if (!this.addList.amount) {
        this.$toast('请输入金额')
        return false
      } else if (isNaN(this.addList.amount)) {
        this.$toast('请输入的金额必须是数字')
        return false
      }
      const data = {
        card_id: this.bankMsg.id,
        channel_code: this.channel_code,
        city_code: this.selectedAreaList.region,
        consume_time: this.consumeTimeStamp,
        repay_amount: this.addList.amount * 100,
        repay_time: this.repayTimeStamp
      }
      await this.$api.plan.genCustomItem(data).then(res => {
        this.sum_amount = res.data.data.sum_amount
        this.amount = res.data.data.amount
        const { amount, sum_amount, consume_time, repay_amount, repay_time, repay_sum_amount } = res.data.data
        this.billList.push({
          bill_type: 'CONSUME', // 0消费 1还款 CONSUME, REPAY
          amount: parseFloat(sum_amount),
          plan_executed_time: consume_time,
          selectedDate: timeToFormatDate(this.consumeTimeStamp),
          sum_amount: sum_amount,
          post_amount: amount
        },
        {
          bill_type: 'REPAY', // 0消费 1还款 CONSUME, REPAY
          amount: parseFloat(repay_amount),
          plan_executed_time: repay_time,
          selectedDate: timeToFormatDate(this.repayTimeStamp),
          sum_amount: repay_sum_amount,
          post_amount: parseFloat(repay_amount)
        })

        // 账单列表的计划时间顺序增加 start
        this.minDate = new Date(new Date(this.addList.selectedDate).getTime() + 60 * 1000)
        this.currentValue = this.minDate
        this.reFlesh()
        // end
        this.showAddBill = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.intelligence-page{
  .top-list{
    background: #fff;
    .item{
      padding: 24px;
      box-sizing: border-box;
      border-bottom: 1px solid @moreLightGrey;
      &.title{
        font-size: 28px;
        .num{
          color: @mainColorB;
        }
      }
      .text{
        font-size: 28px;
      }
      .intro{
        font-size: 28px;
        color: @lightGrey;
      }
      /deep/ .van-icon{
        color: @lightGrey;
        font-size: 30px;
        vertical-align: sub;
      }
    }
  }
  .add-btn{
    font-size: 30px;
    color: @mainColorB;
    width:460px;
    height:74px;
    line-height: 74px;
    text-align: center;
    border:3px solid @mainColorB;
    border-radius:10px;
    margin: 24px auto;
    .iconfont{
      font-size: 36px;
      margin-right: 8px;
      color: @mainColorB;
    }
  }
  .msg-box{
    padding: 24px;
    box-sizing: border-box;
    margin-bottom: 100px;
    .situation{
      width:100%;
      height:160px;
      background:@blueBg;
      box-shadow:0px 10px 20px rgba(14,66,128,0.05);
      border-radius:10px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      .reset-btn{
        flex-shrink: 0;
        width:140px;
        height:160px;
        background:@mainColorB;
        border-radius:10px 0px 0px 10px;
        text-align: center;
        padding-top: 35px;
        .text{
          width: 100%;
          color: #fff;
          font-size: 28px;
        }
      }
      .item{
        width: 100%;
        padding: 28px 24px;
        box-sizing: border-box;
        text-align: center;
        .text{
          font-size: 28px;
          font-weight: bold;
        }
        .price{
          margin-top: 18px;
          font-size: 34px;
          font-weight: bold;
          color: @red;
        }
      }
    }
    .list{
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 20px rgba(14,66,128,0.05);
      border-radius:0px 0px 10px 10px;
      padding-bottom: 35px;
      box-sizing: border-box;
      .item{
        padding: 33px 24px 15px;
        box-sizing: border-box;
        border-bottom: 1px solid @moreLightGrey;
        display: flex;
        justify-content: space-around;
        &:last-child{
          border-bottom: none;
        }
        .box{
          text-align: center;
          .title{
            font-size: 30px;
            font-weight: bold;
          }
          .text{
            font-size: 28px;
            margin-top: 8px;
            color: @lightGrey;
          }
        }
        &.btn-box{
          display: block;
          .submit-btn{
            width:460px;
            height:74px;
            .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
            border-radius:10px;
            text-align: center;
            color: #fff;
            font-size: 30px;
            line-height: 74px;
            margin: 7px auto 19px;
            &.no-submit{
              background: @lightGrey;
            }
          }
          .intro{
            font-size: 24px;
            color: @lightGrey;
            text-align: center;
          }
        }
      }
    }
  }
  .add-bill{
    padding: 40px 36px;
    box-sizing: border-box;
    border-radius: 10px;
    top: 41%;
    .title{
      position: relative;
      text-align: center;
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 22px;
      img{
        position: absolute;
        width: 36px;
        height: 36px;
        top: -16px;
        right: -12px;
      }
    }
    .list{
      .item{
        padding: 18px 0;
        box-sizing: border-box;
        border-bottom: 1px solid @moreLightGrey;
        .text{
          font-size: 26px;
        }
        .input{
          font-size: 26px;
          color: @lightGrey;
          text-align: right;
          &.red{
            color: @red;
          }
          &.on{
            color: @mainTextColor;
          }
        }
      }
    }
    .save-btn{
      width:460px;
      height:74px;
      .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
      border-radius:10px;
      text-align: center;
      line-height: 74px;
      color: #fff;
      margin: 40px auto 0;
      font-size: 28px;
    }
  }
  .picker{
    width: 100%;
    /deep/ .van-picker__toolbar{
      padding: 24px;
      box-sizing: border-box;
      height: auto;;
      .van-picker__title,.van-picker__cancel, .van-picker__confirm{
        font-size: 28px;
        color: @mainColorB;
      }
      .van-picker__title{
        font-weight: bold;
      }
    }
  }
  .add-page{
    position: fixed;
    top: 0;
    left: 50%;
    transform: translate(-50%,0);
    width: 100%;
    height: 100%;
    background: @bg;
  }
}
</style>

