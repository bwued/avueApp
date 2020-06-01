
<!-- todo 智能添加计划 --智慧金 hgwn 2020.1.7 测试环境-->
<template>
  <div class="intelligence-page">
    <top-msg header-name="智能添加计划" />
    <ul class="top-list">
      <li class="clear item" @click="showSelectCard=true">
        <span class="lt text">选择信用卡</span>
        <span class="rt intro">
          {{ bankMsg.bank_info&&bankMsg.bank_info.name }}{{ Object.keys(bankMsg).length === 0 && bankMsg.constructor === Object?'':'（尾号' }}{{ bankMsg && bankMsg.card_no }}{{ Object.keys(bankMsg).length === 0 && bankMsg.constructor === Object?'':'）' }}
          <van-icon name="arrow" />
        </span>
      </li>
      <li class="clear item">
        <span class="lt text">账单总金额</span>
        <span class="rt">
          <input v-model.number="repay_sum_amount" type="number" class="input-box">
        </span>
      </li>
      <li class="clear item" @click="showDateSelectFun">
        <span class="lt text">选择账单日期</span>
        <van-icon name="arrow" class="rt" />
        <span v-if="dates.length>0" class="rt repay-dates textEllipsis">
          <span v-for="(item,index) in dates" :key="index" class="text">{{ item.getDate() }}, </span>
        </span>
      </li>
      <li class="clear item">
        <span class="lt text">账单总笔数</span>
        <span class="calc-box rt">
          <img src="../../../static/img/calc-plus.png" class="img-btn" @click="value>1?value--:value=1">
          <input v-model="value" type="text" class="input">
          <img src="../../../static/img/calc-add.png" class="img-btn" @click="value++">
        </span>
      </li>
      <li class="clear item" @click="showSelectAddress=true">
        <span class="lt text">选择省市</span>
        <van-icon name="arrow" class="rt" />
        <span class="rt text">{{ selectedAreaList.all }}</span>
      </li>
    </ul>
    <div class="add-btn flex-vertical-centering" @click="addBill">
      <div class="flex-row-center">
        <i class="iconfont icon-jia" />
        <span>制定账单</span>
      </div>
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
          <div class="clear title">
            <span class="lt text">定制时间：{{ billMsg.time | timeToFormatDay }}</span>
            <span class="rt text">共{{ billMsg.repayNum }}笔</span>
          </div>
          <div class="clear dec">
            <span class="lt text">账单总金额：
              <span class="price">{{ billMsg.order_total_money }}元</span>
            </span>
            <span class="rt text">手续费：
              <span class="price">{{ billMsg.service_fee }}元</span>
            </span>
          </div>

          <div class="clear dec">
            <span class="lt text">费率：
              <span class="price">{{ (billMsg.consume_rate*100).toFixed(2) }}%，{{ (billMsg.big_money_user_rate*100).toFixed(2) }}%</span>
            </span>

            <!--todo 添加智慧金-->
            <span class="rt text">{{refundName}}：
              <span class="price">{{ (billMsg.fee_refund_money) }}元</span>
              <!--<span class="price">{{ (billMsg.plan_info.repay_plan_info.fee_refund_money) }}</span>-->
            </span>
          </div>


          <div class="clear remaining">
            <span class="lt text">提醒：本次计划信用卡余额不少于：
              <span class="price">{{ billMsg.marginAmount }}元</span>
            </span>
          </div>
        </div>
      </div>
      <ul class="list">
        <li v-for="(item,index) in billList" :key="index" class="item">
          <div class="title clear">
            <span class="lt text">
              <img src="../../../static/img/bell.png">
              账单¥{{ item.plan_bill_info&&item.plan_bill_info.amount }}
            </span>
            <span class="rt date">{{ item.json_execute_time|timeToFormatDay }}</span>
          </div>
          <ul class="item-list">
            <li v-for="(n,i) in item.consume_bills" :key="i" class="list-item clear">
              <span class="lt text">消费（¥{{ n.plan_bill_info&&n.plan_bill_info.amount }}）</span>
              <span class="lt text" style="padding-left: 20px">{{refundName}}（¥{{ n.plan_bill_info&&n.plan_bill_info.fee_refund_money  }}）</span>

              <span class="rt" style="padding-left: 5px"  @click="editTime(n.json_execute_time,index,i)">编辑</span>
              <span class="rt text">{{ n.json_execute_time|timeToFormatTime }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-if="billList.length>0" class="bottom-add-btn">
      <span class="btn" @click="submit">提交账单</span>
    </div>


    <!-- 选择时间 -->
    <van-popup v-model="showTimeSelect" class="date-select" position="bottom">
      <div class="title">
        请自定义消费时间
      </div>
<!--
      <van-datetime-picker
              v-model="Times"
              type="time"
      />-->

      <ul class="top-list">
        <li class="clear item">
          <span class="lt text">时</span>
          <span class="rt">
             <van-stepper v-model="hour" min="0" max="23" />
          </span>
        </li>
        <li class="clear item">
          <span class="lt text">分</span>
          <span class="rt">
             <van-stepper v-model="minute" min="0" max="59" />
          </span>
        </li>
        <li class="clear item">
          <span class="lt text">秒</span>
          <span class="rt">
             <van-stepper v-model="time" min="0" max="59" />
          </span>
        </li>


      </ul>

      <div class="confirm-btn" @click="closeTime">
        确定
      </div>
      <!--<div class="confirm-btn" @click="closeTime">
        取消
      </div>-->
    </van-popup>


    <!-- 选择银行卡 -->
    <select-card :show-select-card="showSelectCard" :hide-select-card="hideSelectCardFun" :show-add-card-flag="showAddCardFlag" :current-nav="1" @selectedCard="selectedCardFun" @showAddCard="showAddCardFun" />
    <!-- 选择储蓄卡 -->
    <select-card :show-select-card="showSelectDepositCard" :hide-select-card="hideSelectDepositCardFun" :show-add-card-flag="showAddDepositCardFlag" :current-nav="0" @selectedCard="selectedDepositCardFun" @showAddCard="showAddDepositCardFun" />
    <!-- 选择日期多选 -->
    <van-popup v-model="showDateSelect" class="date-select" position="bottom">
      <div class="title">
        请选择到期日期
      </div>
      <v-date-picker
        v-model="dates"
        title-position="center"
        class="date-picker"
        mode="multiple"
        :is-required="true"
        :min-date="minDate"
        :max-date="maxDate"
        :is-inline="true"
        :disabled-attribute="{
          contentStyle: {
            color: '#999999'
          },
        }"
        :select-attribute="{
          highlight: {
            color: '#000',
            backgroundColor: '#999999'
          }
        }"
      />
      <div class="confirm-btn" @click="getDate">
        确定
      </div>
    </van-popup>
    <!-- 地址 -->
    <van-popup v-model="showSelectAddress" position="bottom" class="picker">
      <van-area :area-list="areaList" :columns-num="2" title="选择地址" @confirm="determine($event)" @cancel="cancel" />
    </van-popup>
    <!-- 确认账单 -->
    <confirm-bill
      :bank-card-id="bankMsg.id"
      :min-date="fromDate"
      :max-date="endDate"
      :show-confirm-bill="showConfirmBill"
      :to-hide-confirm-bill="hideConfirmBillFun"
      :to-show-confirm-bill="showConfirmBillFun"
      :from-intelligence-page="true"
      :check-bill-list="billMsg"
      :confirm-msg-list="billList"
      :c-rate="z_user_rate"
      :list-data="ReplayBillModifyReq"
    />

    <div v-if="isbindCard" class="add-page">
      <template v-if="!isbindCardhk">
        <bind-card :from-intelligence-page="true" :hide-bind-card="hideBindCardFun" :c-id="bankMsg.id" :c-code="channel_code" @toSuccess="showConfirmBillFun" />
      </template>
      <!--    汇卡通道 h5 xml 签约页面 -->
      <template v-if="isbindCardhk">
        <bind-cardh :from-intelligence-page="true" :hide-bind-card="hideBindCardFun" :c-id="bankMsg.id" :c-code="channel_code" @toSuccess="showConfirmBillFun" />
      </template>
    </div>
  </div>
</template>
<script>
import selectCard from '@/components/selectCard'
import list from '../../assets/area.js'
import confirmBill from './confirmBill' // todo 智能账单 弹窗  智慧金 总
import { timeToFormatDay, timeToFormatDate, timeToFormatTime } from '@/utils/date'
import topMsg from '@/components/topMsg'
import bindCard from '@/views/proceeds/bindCard'
import bindCardh from '@/views/proceeds/bindCardHT' // 汇卡通道 12月 lhwsoft
import { Toast } from 'vant'

export default {
  name: 'Intelligence',
  components: { selectCard, confirmBill, topMsg, bindCard, bindCardh },
  filters: {
    timeToFormatDay,
    timeToFormatDate,
    timeToFormatTime
  },
  data() {
    return {
      showTimeSelect: false, // 选择时间
      Times: '',// 时间 时分秒
      date:'',
      hour:'',
      minute:'',
      time:'',
      index:'', // 标记 billList数组 索引
      i:'',  // 标记 consume_bills 索引
      timestamp:'', // 当前时间戳
      ReplayBillModifyReq: [],
      isbindCard: false,
      isbindCardhk: false, // 汇卡 是否签约标识
      showSelectDepositCard: false, // 储蓄卡选择框
      showAddDepositCardFlag: false,

      showSelectCard: false,
      // 选择到期日
      showDateSelect: false,
      dates: [],
      repay_days: [],
      maxDate: new Date(new Date().setDate(31)),
      minDate: new Date(new Date().setDate(1)),
      currentDate: new Date(),
      currentValue: new Date(),
      // end
      value: 1,
      repay_sum_amount: '',
      // address
      showSelectAddress: false,
      areaList: {},
      selectedAreaList: {},
      // end
      showConfirmBill: false,
      bankMsg: {}, // 银行卡信息
      repayConstraint: {},
      billList: [],
      refundName:'智慧金',
      billMsg: {
        time: '',
        service_fee: '',
        usePrice: '',
        repayPrice: '',
        useNum: 0,
        repayNum: 0,
        consume_rate: '',
        repay_service_fee: '',
        json_trade_no: '',
        fee_refund_money:'', // 智慧金（返回客户，去元后小数分)
        order_total_money:''// 订单总金额
      },
      channel_code: this.$route.query.code, // 渠道代码
      z_user_rate: this.$route.query.z_user_rate || '', // 大额费率
      cardId: '', // 卡id
      cardType: 'CREDIT', // cardType 银行卡类型  ：CREDIT 信用卡  DEBIT 储蓄卡
      cardId1: '', // 卡id
      cardType1: 'DEBIT',

      showAddCardFlag: false,
      
      min_count: null, //
      max_count: null//
    }
  },
  computed: {
    cityRecord: {
      get: function() {
        return JSON.parse(localStorage.getItem('intelligenceArea'))
      },
      set: function(val) {
        localStorage.setItem('intelligenceArea', JSON.stringify(val))
      }
    },
    fromDate() {
      return this.repay_days.length > 0 ? new Date(this.repay_days[0]) : new Date()
    },
    endDate() {
      return this.repay_days.length > 0 ? new Date(this.repay_days[this.repay_days.length - 1]) : new Date()
    }
  },
  watch: {
    dates(newValue, oldValue) {
      this.repay_days = []
      for (const i of newValue) {
        this.repay_days.push(i.getTime())
        this.value = this.repay_days.length
      }
    },
    billList(newValue, oldValue) {
      let price = 0; let use = 0
      for (const i of newValue) {
        price += parseFloat(i.plan_bill_info.amount)
        for (const n of i.consume_bills) {
          use += parseFloat(n.plan_bill_info.amount)
        }
      }
      this.billMsg.repayPrice = price.toFixed(2)
      this.billMsg.usePrice = use.toFixed(2)
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
      this.isbindCard = false
      next(false)
    } else {
      next()
    }
  },
  created() {

    document.title = '智能账单'
    this.areaList = list
    this.getRepayConstraint()
//    this.getRefundName() // 获取智慧金 todo
    /* 如果之前有选择过地址的，默认先显示之前选择的地址*/
    if (this.cityRecord) {
      this.selectedAreaList = this.cityRecord
    }
  },
  methods: {

    // 新的接口
    bbbindChannelCard(channelCode, cardId, cardType) {
      const that = this
      that.$api.card
        .bbbindChannelCard(channelCode, cardId, cardType).then(res => {
          console.log('查询渠道绑卡状态成功')
          console.log(res.data.data.data.signature)
          const signature = res.data.data.data.signature
          const signType = res.data.data.data.signType
          // alert("汇卡Dh::" + signType)
          if (signature != 2) { //   1.未签约 2.已签约
            this.isbindCard = true
            if (signType == 3) { // 汇卡通道 信用卡未签约
              this.isbindCardhk = true
            }
          } else {
            this.showConfirmBill = true
          }
        }).catch(err => {
          console.log(err)
          Toast('服务异常')
        })
    },

    /* 获取验证码 渠道绑卡过程，会发送验证码到用户手机 = 汇卡 小额代还 银行卡签约 12月*/
    getCodeFun(cardId, channelCode) {
      const that = this
      that.$api.card.bindChannelCard('CREDIT', cardId, channelCode).then(res => {
        console.log(res.data.data.state)
        // console.log(res.data.data.bizOrderNumber)
        const url = res.data.data.html
        if (url) {
          // window.location.href = url
          that.$router.push({ path: '/iframe', query: { url: url, title: '签约' }})

          return
        }
      }).catch((error) => {
        console.log(error)

      })
    },

    // 注册渠道接口判断
    registjudge(channelCode) {
      const that = this
      that.$api.card.registjudge(channelCode).then(res => {
        console.log(res.data.data.state)
        const state = res.data.data.state
        if (state != 4) { //   3.未注册 4.已注册
          that.showSelectDepositCard = true
          //  that.regchannel(this.cardType1,this.cardId1, this.channel_code) //注册接口
        } else {
          that.bbbindChannelCard(this.channel_code, this.cardId, this.cardType) // 判断签约接口
        }
      }).catch(err => {
        console.log(err)
      })
    },

    /* 获取借记卡列表*/
    getCardListFun() {
      // 注册渠道信息判断

      // this.registjudge(this.channel_code)

      // this.bbbindChannelCard(this.channel_code,this.cardId, this.cardType1) 注册
      // this.bbbindChannelCard(this.channel_code,this.cardId, this.cardType)  签约
      // this.demandChannelCard(this.cardType,this.cardId,this.channel_code)
      return
      this.isbindCard = true
      const that = this
      const cardType = 'DEBIT'
      that.$api.card.getCardList(cardType).then(res => {
        const cardLists = res.data.data
        let debit_card_id = cardLists.map(item => {
          if (item.card_info.auth === true) {
            // return item.id
          }
        })
        debit_card_id = debit_card_id.join('')
        if (debit_card_id === '') {
          console.log('选择储蓄卡')
          that.showSelectDepositCard = true
          this.isbindCard = true
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
        console.log('注册渠道信息')
        console.log(registrationData)
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

    selectedDepositCardFun(data) {
      const that = this
      console.log('选择的储蓄卡')
      console.log(data)
      that.depositbankMsg = data
      that.cardId1 = this.depositbankMsg.id
      console.log(that.cardId1)

      // 选择储蓄卡进行注册
      that.$api.card.regchannel(that.cardType1, that.cardId1, that.channel_code).then(res => {
        console.log(res.data.data.isSign)
        console.log(res.data.data.state)
        var isSign = res.data.data.isSign
        var state = res.data.data.state

        console.log(isSign)
        console.log(state)
        if (isSign == 't' && state == '000') {
          console.log('签约')
          that.bbbindChannelCard(this.channel_code, this.cardId, this.cardType) // 判断签约
        }
      }).catch(error => {
        console.log(error)
        Toast('储蓄卡注册失败')
      })
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

    // TODO 消费 选择时分秒
    editTime(time,index,i) {
        console.warn(time)
        this.datetime = time
        this.timestamp = time
        this.date =  timeToFormatDay(time)
        timeToFormatTime(time)
//       alert( timeToFormatTime(time))
//        alert(index)
//        alert(i)
        var  editTime  = this.billList[index].consume_bills[i].json_execute_time
       /* console.log(editTime)
        console.log(editTime == time)
        console.log(timeToFormatDate(time))*/
        var arr = timeToFormatTime(time).split(":")
        this.hour = arr[0]
        this.minute = arr[1]
        this.time = arr[2]
        this.showTimeSelect = true
        this.index = index
        this.i = i

    },
    closeTime() {

        if(parseInt(this.hour) < 10) {
            this.hour = '0'+ this.hour
        }
        if(parseInt(this.minute) < 10) {
            this.minute = '0'+ this.minute
        }
        if(parseInt(this.time) < 10) {
            this.time = '0'+ this.time
        }
        var s = this.hour + ":" + this.minute + ":" + this.time

        console.warn(this.date)
        var stringTime = this.date + " " + s
        console.log(stringTime)
        var timestamp2 = Date.parse(new Date(stringTime));
        console.log(timestamp2)
//        timestamp2 = timestamp2 / 1000;

        this.billList[this.index].consume_bills[this.i].json_execute_time = timestamp2
        this.showTimeSelect = false

    },

    /* 获取数字字典 */
    getRefundName() {
      this.$api.plan.getRefundName(null).then(res => {
          /*if(res.data){
              this.refundName = res.data.data
          }*/
      }).catch(err =>{
          console.log(err)
          Toast('服务异常')
      })
    },

     getRepayConstraint(){

     },
    toResetFun() {
      this.$dialog({
        title: '提示',
        message: '是否要重置账单？',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.resetFun()
      })
    },
    resetFun() {
      this.billMsg = {
        time: '',
        service_fee: '',
        usePrice: '',
        repayPrice: '',
        useNum: 0,
        repayNum: 0,
        consume_rate: '',
        repay_service_fee: '',
        fee_refund_money:'',
        order_total_money:''
      }
      this.billList = []
    },
    addBill() {
      if (this.billList.length === 0) {
        this.toAddBill()
        return false
      }
      this.$dialog({
        title: '提示',
        message: '是否要重置账单？',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.toAddBill()
      })
    },
    async toAddBill() {
      var data = {
        bank_card_id: this.bankMsg.id,
        channel_code: this.channel_code,
        city_code: this.selectedAreaList.region,
        repay_days: this.repay_days,
        repay_sum_amount: this.repay_sum_amount * 100,
        repay_sum_count: this.value
      }
      if (!data.bank_card_id) {
        this.$toast.fail('请选择银行卡')
        return false
      } else if (!data.city_code) {
        this.$toast.fail('请选择城市')
        return false
      } else if (data.repay_days.length === 0) {
        this.$toast.fail('请选择到期日')
        return false
      } else if (!data.repay_sum_amount) {
        this.$toast.fail('请输入账单金额')
        return false
      }
      /* 渠道代还限制*/
      await this.$api.plan.repayChannelConstraint(this.repay_sum_amount * 100, this.channel_code).then(res => {
        console.log(res)
        this.min_count = res.data.data.min_count
        this.max_count = res.data.data.max_count
      })
      if (this.max_count === 0 && this.min_count === 0) {
        this.$toast('账单金额过小')
        return false
      } else if (data.repay_sum_count > this.max_count) {
        // this.$toast('最大账单笔数不大于' + this.max_count + '笔')
        // return false
      } else if (data.repay_sum_count < this.min_count) {
        this.$toast('最小账单笔数不小于' + this.min_count + '笔')
        return false
      }
      this.$api.plan.genIntelligent(data).then(res => {
        const billList = []
        if (res.data.code === '200000') {
          console.log('智能生成代还计划')
          console.log(res.data.data)
		  this.z_user_rate = res.data.data.plan_info.repay_plan_info.big_money_user_rate
          this.billMsg.time = res.data.data.plan_info.create_time
          this.billMsg.useNum = parseInt(res.data.data.consume_count)
          this.billMsg.repayNum = parseInt(res.data.data.repay_count)
          this.billMsg.service_fee = res.data.data.service_fee
          this.billMsg.marginAmount = res.data.data.margin_amount
          this.billMsg.big_money_user_rate = res.data.data.plan_info.repay_plan_info.big_money_user_rate
          this.billMsg.consume_rate = res.data.data.plan_info.repay_plan_info.consume_rate
          this.billMsg.repay_service_fee = res.data.data.plan_info.repay_plan_info.repay_service_fee
          this.billMsg.repayFee = res.data.data.plan_info.repay_plan_info.repay_fee
          this.billMsg.fee_refund_money = res.data.data.plan_info.repay_plan_info.fee_refund_money
          this.billMsg.json_trade_no = res.data.data.plan_info.json_trade_no
          this.billMsg.order_total_money = res.data.data.plan_info.repay_plan_info.order_total_money

          for (const i of res.data.data.bills) {
            billList.push(i)
          }
          this.billList = billList
        } else {
          this.$toast(res.data.msg)
        }
      })
    },
    // 显示到期日期页面
    showDateSelectFun() {
      if (Object.keys(this.bankMsg).length === 0 && this.bankMsg.constructor === Object) {
        this.$toast('请先选择银行卡')
        return false
      }
      this.showDateSelect = true
    },
    // 城市联动框
    cityChoice: function() {
      this.show = true
    },
    determine(val) {
      // console.log(val)
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
    getDate() {
      this.showDateSelect = false
    },
    submit() {
      //  content.methods.demandChannelCardFun()
      // this.getCardListFun() // TODO  2019/10/11
      // this.showConfirmBill = true
      // this.isbindCard=true

      var arr = []
      for(var i = 0; i< this.billList.length; i++){
          for(var j = 0; j < this.billList[i].consume_bills.length; j++) {
              var   planExecutedTime = this.billList[i].consume_bills[j].json_execute_time
              var   billNo = this.billList[i].consume_bills[j].json_bill_no
              arr.push({plan_executed_time:planExecutedTime,bill_no:billNo})
          }
      }

      console.log(arr)
       this.ReplayBillModifyReq = arr

      this.registjudge(this.channel_code) // 调用查询注册接口 2019/12/2




    },
    hideConfirmBillFun() {
      this.showConfirmBill = false
    },
    showConfirmBillFun() {
      this.showConfirmBill = true
    },
    judeRange(useDay, repayDay) {
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
      // ！！！账单日和到期日不做还款安排
      // use < repay:
      // 1,18 当天前 - 下月1-18   repay < nowDate
      // 1,25 当天内 - 当月24-25  repay > nowDate && use < nowDate
      // 1,24 截止日当天 - 下月1-24 repay = nowDate && use < nowDate
      // 25,31 当天后 - 当月25-31 repay > nowDate && use > nowDate
      // use > repay:
      // 18, 下月1 - 下月18-下下月1  use < nowDate
      // 25，下月1 - 当月25-下月1    use > nowDate
          if (use < repay) {
        // 当前日期比到期日期要大  12/17
        // if (nowDate >= repay) {
        //   this.minDate = new Date(now.setMonth(setNextMonth, use + 1))
        //   this.maxDate = new Date(now.setMonth(setNextMonth, repay - 1))
        // }
        if (nowDate >= repay) {
          this.minDate = new Date(now.setMonth(nowMonth + 1, use + 1))
          this.maxDate = new Date(now.setMonth(setNextMonth, repay))
        }

        // 当前日期比账单日期要小
        if (nowDate <= use) {
          this.minDate = new Date(now.setMonth(nowMonth, use + 1))
          this.maxDate = new Date(now.setMonth(nowMonth, repay))
        }

        // 当前日期比账单日期大、比到期日小
        if (nowDate > use && nowDate < repay) {
          this.minDate = new Date(now.setMonth(nowMonth, nowDate + 1))
          this.maxDate = new Date(now.setMonth(nowMonth, repay))
        }
      } else if (use > repay) {
        // 当前日期比账单日期要大     12/12 屏蔽下面
        // if (nowDate > use) {
        //   alert(222)
        //   this.minDate = new Date(now.setMonth(nowMonth, nowDate + 1))
        //   this.maxDate = new Date(now.setMonth(setNextMonth, repay - 1))
        // }
        // 当前日期比账单日期要大（当前日期比到期日期要大）   12/12
        if (nowDate >= repayDay && nowDate >= use) {
          this.minDate = new Date(now.setMonth(nowMonth, nowDate + 1))
          this.maxDate = new Date(now.setMonth(nowMonth + 1, repay))
        }

        // 当前日期比账单日期要小（比到期日小的已排除）
        if (nowDate > repayDay && nowDate < use) {
          this.minDate = new Date(now.setMonth(nowMonth, use + 1))
          this.maxDate = new Date(now.setMonth(nowMonth + 1, repay))
        }

        // 当前日期比到期日期要小
        if (nowDate < repayDay) {
          this.minDate = new Date(now.setMonth(nowMonth, nowDate + 1))
          this.maxDate = new Date(now.setMonth(nowMonth, repay))
        }
      }
      this.currentValue = this.minDate
    },
    // 选择银行卡
    selectedCardFun(data) {
      console.log('选择银行卡....')
      console.log(data)
      this.bankMsg = data
      this.bankMsg.card_no = this.bankMsg.card_info.card_no.substr(-4, 4)
      this.cardId = data.id
      this.$api.card.getCard('CREDIT', this.bankMsg.id).then(res => {
        console.log('获取信用卡')
        console.log(res)
        const card = { id: res.data.data.id, card_info: { ...res.data.data }, bank_info: res.data.data.bank_info }
        // debugger
        this.$store.commit('SET_CURRENT_CREDIT_CARD', card)
      })

      // range
      this.judeRange(data.card_info.bill_date, data.card_info.repayment_date)
      this.dates = []
      this.resetFun()
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
      overflow: unset;
      .repay-dates{
        display: inline-block;
        width: 440px;
        text-align: right;
      }
      .input-box{
        text-align: right !important;
      }
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
    // color: @btnBlue;
    width:460px;
    height:74px;
    line-height: 74px;
    text-align: center;
    border:3px solid #BF9761;
    .borderBtn;
    border-radius:10px;
    margin: 24px auto;
    img{
      width: 36px;
      height: 36px;
      margin-right: 8px;
      vertical-align: text-bottom;
    }
    i{
      font-size: 40px;
      .fontColor;
      margin-right: 8px;
      vertical-align: text-bottom;
    }
    span{
      .fontColor;
    }
  }
  .msg-box{
    padding: 24px;
    box-sizing: border-box;
    margin-bottom: 10px;
    .situation{
      width:100%;
      height:260px;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 20px rgba(14,66,128,0.05);
      border-radius:10px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      .reset-btn{
        flex-shrink: 0;
        width:140px;
        height:250px;
        background:@mainColorB;
        border-radius:10px 0px 0px 10px;
        text-align: center;
        padding-top: 50px;
        .text{
          width: 100%;
          color: #fff;
          font-size: 28px;
          margin-top: 32px;
        }
      }
      .item{
        width: 100%;
        padding: 28px 24px;
        box-sizing: border-box;
        .title{
          .text{
            font-size: 28px;
            font-weight: bold;
          }
        }
        .dec{
          margin-top: 30px;
          .text{
            font-size: 24px;
            color: @lightGrey;
            .price{
              color: @red;
            }
          }
        }
      }
    }
    .list{
      .item{
        margin-top: 24px;
        box-shadow:0px 10px 20px rgba(14,66,128,0.05);
        border-radius: 10px;
        overflow: hidden;
        .title{
          background: @opacityBtnBlue;
          padding: 29px 24px;
          box-sizing: border-box;
          .text{
            font-size: 28px;
            font-weight: bold;
            .date{
              font-size: 28px;
              font-weight: bold;
            }
            img{
              width: 26px;
              height: 30px;
              margin-right: 8px;
            }
          }
        }
        .item-list{
          padding: 13px 0;
          box-sizing: border-box;
          background: #fff;
          .list-item{
            padding: 13px 24px;
            box-sizing: border-box;
            .text{
              font-size: 28px;
              color: @lightGrey;
            }
          }
        }
      }
    }
  }
  .bottom-add-btn{
    width:750px;
    height:100px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 6px rgba(0,0,0,0.12);
    position: relative;
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
    }
  }
  .date-select{
    height: 700px;
    /deep/ .date-picker{
      width: 100%;
      .c-weekday{
        color: @mainTextColor;
      }
    }
    .title{
      font-size: 28px;
      padding: 24px;
      box-sizing: border-box;
    }
    .confirm-btn{
      width:460px;
      height:74px;
      background: #BF9761;
      // .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
      border-radius:10px;
      color: #fff;
      text-align: center;
      line-height: 74px;
      position: absolute;
      bottom: 13px;
      left: 50%;
      transform: translate(-50%,0);
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
      // .van-picker__title{
      //   font-weight: bold;
      // }
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

.remaining{
.text{
  font-size: .8rem;
  color:#999;
  margin-top: 1rem;
  .price{
    color: #ed0202;
  }
}
}
</style>

