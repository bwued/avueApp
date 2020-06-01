<template>
  <div>
    <top-msg header-name="收款记录" />
    <div class="con_body">
      <div class="con_bills">
        <div class="bills_head flex_sb">
          <div class="flex1">
            <div class="box">
              <span
                class="size26 bills_select"
                @click="openMonthPicker"
              >{{ monthSelect ? monthSelect : '全部' }}</span>
              <i class="iconfont icon-shouqi" />
            </div>
          </div>
          <div class="flex1">
            <div class="box">
              <span
                class="size26 bills_select"
                @click="statusPicker = true; closeTouch()"
              >{{ statusSelect ? statusSelect : stateType }}</span>
              <i class="iconfont icon-shouqi" />
            </div>
          </div>
          <div class="amount_all textalign_right">
            <p v-if="currentNav===4" class="size26 color999">
              获得：
              <span class="colorED0">{{ sumGainPointsAmount | parseAmount }} </span>
              消费：
              <span class="colorED0">{{ Math.abs(sumConsumeProfitsAmount) | parseAmount }}</span>
            </p>
            <p v-else class="size26 color999">
              总计：
              <span class="colorED0">¥{{ sumTotalAmount | parseAmount }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="bills_items">
        <template v-show="currentNav === 0">
          <van-list
            v-model="orderLoading"
            :finished="orderFinished"
            :error.sync="orderError"
            finished-text="已加载完毕"
            error-text="请求失败，点击重新加载"
            @load="getOrderListFun"
          >
            <template v-if="haveContent">
              <van-collapse v-model="activeNames" accordion>
                <van-collapse-item
                  v-for="(item,index) in (orderList)"
                  :key="item.id"
                  :name="index+1"
                  class="mgb20"
                >
                  <div slot="title" class="bills_item flex_sb bgfff">
                    <div class="w100 flex-column">
                      <p
                        :class="['size26', 'tradeState',item.trade_state=='UNSETTLED'?'weijiesuan':'yijiesuan']"
                      >
                        {{ item.trade_state | tradeState }}
                      </p>
                      <div class="w100 flex-row-between item_top">
                        <p class="size26 color333">
                          订单编号：{{ item.trade_no }}
                        </p>
                        <p class="size28 colorED0 bold">
                          ¥ {{ item.total_amount | parseAmount }}
                        </p>
                      </div>
                      <div class="w100 flex-row-between">
                        <p
                          class="size26 lineheight60"
                        >
                          时间：{{ item.gmt_create | timeToFormatDate }}
                        </p>
                        <p
                          class="size26 color999"
                        >
                          {{ '总手续费：¥' }}{{ item.total_amount - item.actual_amount | parseAmount }}
                        </p>
                      </div>
                      <div class="w100 flex-row-between">
                        <p class="size26">
                          通道: {{ item.channel_name }}
                        </p>
                        <p
                          class="size24 color999 flex-row-center"
                          @click="getOrderDetailFun(item.trade_no)"
                        >
                          <span>详情</span>
                          <i v-if="activeNames===index+1" class="iconfont icon-zhankai xiala" />
                          <i v-else class="iconfont icon-shouqi xiala" />
                        </p>
                      </div>
                    </div>
                  </div>
                  <template v-if="!orderDetail">
                    <van-loading class="list_loading" />
                  </template>
                  <template v-else>
                    <div class>
                      <div class="detail_msg detail_moreMsg flex">
                        <p>
                          收款金额：
                          <span>¥{{ orderDetail.payment_amount | parseAmount }}</span>
                        </p>
                        <p>
                          费率：
                          <span>{{ (orderDetail.rate*100).toFixed(2) }}%</span>
                        </p>
                        <p>
                          结算费：
                          <span>¥{{ orderDetail.fee | parseAmount }}/笔</span>
                        </p>
                      </div>
                      <div class="detail_msg detail_moreMsg flex">
                        <p>
                          结算金额：
                          <span>¥{{ orderDetail.actual_amount | parseAmount }}</span>
                        </p>
                        <p>
                          手续费：
                          <span>¥{{ orderDetail.payment_amount - orderDetail.actual_amount - orderDetail.fee | parseAmount }}</span>
                        </p>
                      </div>
                      <div v-if="orderDetail" class="detail_msg flex">
                        <p>付款信用卡：{{ orderDetail.deposit.credit_card.bank_name }} **** **** **** {{ orderDetail.deposit.credit_card.card_no.substr(orderDetail.deposit.credit_card.card_no.length-4) }}</p>
                      </div>
                      <div v-if="orderDetail" class="detail_msg flex">
                        <p>结算储蓄卡：{{ orderDetail.payback[0].debit_card.bank_name }} **** **** **** {{ orderDetail.payback[0].debit_card.card_no.substr(orderDetail.payback[0].debit_card.card_no.length-4) }}</p>
                      </div>
                    </div>
                  </template>
                </van-collapse-item>
              </van-collapse>
            </template>
            <template v-else>
              <div class="unContent">
                <div class="unContent_img">
                  <img src="../../../static/img/pic_nonelike.png">
                </div>
                <div>
                  <span>没有相关记录</span>
                </div>
              </div>
            </template>
          </van-list>
        </template>
        <!--订单 列表 end -->
      </div>
    </div>

    <!--点击 全部 弹出picker（月份选择器）start-->
    <van-popup v-model="monthPicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        cancel-button-text="当月全部"
        @confirm="closeMonthPicker"
        @cancel="wholeMonth"
      />
    </van-popup>
    <!--点击 全部 弹出picker（月份选择器）end-->

    <!--点击 状态 弹出picker（状态选择器） start-->
    <van-popup v-model="statusPicker" position="bottom">
      <van-picker
        v-model="statusSelect"
        :columns="statusColumns"
        show-toolbar
        @confirm="closeStatusPicker"
        @cancel="statusPicker = false; openTouch()"
      />
    </van-popup>
    <!--点击 状态 弹出picker（状态选择器） end-->
  </div>
</template>

<script>
import { formatDate, timeToFormatDate } from '@/utils/date'
import { parseAmount } from '@/utils/amount'
import { Collapse } from 'vant'
import 'vant/lib/collapse/style'
import { CollapseItem } from 'vant'
import 'vant/lib/collapse-item/style'
import { DatetimePicker } from 'vant'
import 'vant/lib/datetime-picker/style'
import { Picker } from 'vant'
import 'vant/lib/picker/style'
import topMsg from '@/components/topMsg'
export default {
  name: 'Receipt',
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [DatetimePicker.name]: DatetimePicker,
    [Picker.name]: Picker,
    topMsg
  },
  filters: {
    timeToFormatDate,
    parseAmount,
    tradeState(state) {
      return {
        UNPAID: '未支付',
        UNSETTLED: '待结算',
        SETTLED: '已结算',
        FAILED_PAY: '支付失败',
        FAILED_SETTLE: '结算失败',
        PROCESSING: '处理中'
      }[state]
    },
    profitsType(type) {
      return {
        PAYMENT: '消费',
        REMISSION: '还款',
        THIRD_LEVEL: '三级分润',
        DIRECT_PARENT: '直推分润',
        RANKING_PARENT: '平推分润',
        RANK_RATE_DIFF: '费率差分润'
      }[type] || type
    }
  },
  /* data必须是函数*/
  data: function() {
    return {
      navList: ['订单', '分润', '提现'],
      currentNav: 0, // 当前nav
      activeNames: '', // 折叠面板的当前index
      monthSelect: '', // 选择的月份，默认显示全部,此变量在tabbar中展示
      monthPicker: false, // 月份选择器picker 显示
      currentDate: null, // 当前选择的月份
      postCurrentDate: null, // 当前选择的月份(提交)
      minDate: new Date(2019, 0, 1), // 当前选择的月份,可选最小值
      statusSelect: '', // 选择的状态，默认显示全部状态，此变量在tabbar中展示
      statusPicker: false, // 状态选择器picker 显示
      currentStatus: '', // 当前选择的状态
      statusColumns: '', // 状态列表

      isOnMonth: false, // 是否按月

      profitsList: [],
      profitsLoading: false, // 分润列表的loading
      profitsFinished: false, // 分润列表的finished
      profitsError: false, // 分润列表的error
      profitsPage: 0, // 分润列表的页数

      withdrawList: [],
      withdrawLoading: false, // 提现列表的loading
      withdrawFinished: false, // 提现列表的finished
      withdrawError: false, // 提现列表的error
      withdrawPage: 0, // 提现列表的页数

      orderList: [],
      orderLoading: false, // 订单列表的loading
      orderFinished: false, // 订单列表的finished
      orderError: false, // 订单列表的error
      orderPage: 0, // 订单列表的页数

      bonusList: [],
      bonusLoading: false, // 订单列表的loading
      bonusFinished: false, // 订单列表的finished
      bonusError: false, // 订单列表的error
      bonusPage: 0, // 订单列表的页数

      pointsList: [],
      pointsLoading: false, // 积分的loading
      pointsFinished: false, // 积分列表的finished
      pointsError: false, // 积分列表的error
      pointsPage: 0, // 积分列表的页数

      upgradeList: [],
      upgradeLoading: false, // 佣金列表的loading
      upgradeFinished: false, // 佣金列表的finished
      upgradeError: false, // 佣金列表的error
      upgradePage: 0, // 佣金列表的页数

      haveContent: false, // 是否有内容
      isLoading: '', // 加载图标'
      orderDetail: '', // 订单详情
      sumTotalAmount: 0, // 总计金额
      // 积分总计金额
      sumGainPointsAmount: 0,
      sumConsumeProfitsAmount: 0,

      state: {
        // 提现状态 REMITTED：成功 FAIL：失败 PENDING：提现中
        REMITTED: 'color999',
        FAIL: 'fail',
        PENDING: 'success'
      },

      statusSelects: {
        'FINANCIAL_LEVERAGE_GROUP': '收款',
        'FINANCIAL_REPAYMENT_GROUP': '代还',
        'MANAGER': '管理奖'
      }
    }
  },
  computed: {
    stateType() {
      return this.currentNav === 0 || this.currentNav === 2 ? '状态' : '类型'
    }
  },
  created() {
    if (this.$route.query.type) {
      this.currentStatus = this.$route.query.type
      this.statusSelect = this.statusSelects[this.currentStatus]
    }
    if (this.$route.query.time) {
      this.currentDate = new Date(this.$route.query.time)
      this.postCurrentDate = this.currentDate
      const value = this.$route.query.time
      const year = new Date(value).getFullYear()
      const day = new Date(value).getDate()
      let month = new Date(value).getMonth() + 1
      month = String(month).length < 2 ? '0' + month : month
      this.monthSelect = year + '年' + month + '月' + day + '日'
    }
    this.currentNav = Number(this.currentNav)
    this.thisTitle()
    // this.statusColumns =
    //   this.currentNav === 0
    //     ? ['未支付', '未结算', '已结算']
    //     : ['已申请', '处理中', '已到账', '失败']
    this.statusColumnsList()
  },
  destroyed() {},
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '账单'
    },
    /* 返回上一页*/
    gotoFrontView() {
      this.$router.go(-1)
    },
    /* 点击当月全部 选择月份，关闭月份picker*/
    wholeMonth() {
      const value = this.currentDate
      const year = new Date(value).getFullYear()
      let month = new Date(value).getMonth() + 1
      month = String(month).length < 2 ? '0' + month : month
      this.monthSelect = year + '年' + month + '月'
      this.monthPicker = false
      this.openTouch()
      this.currentDate = new Date(year, month - 1)
      this.postCurrentDate = this.currentDate
      this.isOnMonth = true
      this.fetchData(this.currentNav)
    },
    /* 点击打开月份picker*/
    openMonthPicker() {
      if (!this.postCurrentDate) {
        this.currentDate = new Date()
      }
      this.monthPicker = true
      this.closeTouch()
    },
    /* 点击确认 关闭月份picker*/
    closeMonthPicker(value) {
      // console.log(value)
      const year = new Date(value).getFullYear()
      let month = new Date(value).getMonth() + 1
      const day = new Date(value).getDate()
      month = String(month).length < 2 ? '0' + month : month
      this.monthSelect = year + '年' + month + '月' + day + '日'
      this.monthPicker = false
      this.openTouch()
      this.currentDate = new Date(year, month - 1, day)
      this.postCurrentDate = this.currentDate
      this.isOnMonth = false
      this.fetchData(this.currentNav)
    },
    fetchData(activeNav) {
      switch (activeNav) {
        case 0:
          this.orderList = []
          this.orderLoading = true // 订单列表的loading
          this.orderFinished = false // 订单列表的finished
          this.orderError = false // 订单列表的error
          this.orderPage = 0 // 订单列表的页数
          return this.getOrderListFun()
        case 1:
          this.profitsList = []
          this.profitsLoading = true // 分润列表的loading
          this.profitsFinished = false // 分润列表的finished
          this.profitsError = false // 分润列表的error
          this.profitsPage = 0 // 分润列表的页数
          return this.getProfitsListFun()

        case 2:
          this.withdrawList = []
          this.withdrawLoading = true // 提现列表的loading
          this.withdrawFinished = false // 提现列表的finished
          this.withdrawError = false // 提现列表的error
          this.withdrawPage = 0 // 提现列表的页数
          return this.getWithdrawListFun()

        case 3:
          this.bonusList = []
          this.bonusLoading = true // 提现列表的loading
          this.bonusFinished = false // 提现列表的finished
          this.bonusError = false // 提现列表的error
          this.bonusPage = 0 // 提现列表的页数
          return this.getBonusListFun()

        case 4:
          this.pointsList = []
          this.pointsLoading = true // 提现列表的loading
          this.pointsFinished = false // 提现列表的finished
          this.pointsError = false // 提现列表的error
          this.pointsPage = 0 // 提现列表的页数
          return this.getPointsListFun()

        case 5:
          this.upgradeList = []
          this.upgradeLoading = true // 佣金列表的loading
          this.upgradeFinished = false // 佣金列表的finished
          this.upgradeError = false // 佣金列表的error
          this.upgradePage = 0 // 佣金列表的页数
          return this.getUpgradeListFun()
      }
    },
    /* 点击确认 关闭状态picker*/
    closeStatusPicker(value) {
      console.log(value)
      this.statusPicker = false
      this.openTouch()
      this.statusSelect = value
      this.statusChange(value)
    },
    /* 状态类型转换，根据不同文字转换为不同的枚举类型*/
    statusChange(value) {
      switch (value) {
        // 0 收款
        case '未支付':
          this.currentStatus = 'UNPAID'
          break
        case '未结算':
          this.currentStatus = 'UNSETTLED'
          break
        case '已结算':
          this.currentStatus = 'SETTLED'
          break
        // 1 分润
        case '收款':
          this.currentStatus = 'FINANCIAL_LEVERAGE_GROUP'
          break
        case '代还':
          this.currentStatus = 'FINANCIAL_REPAYMENT_GROUP'
          break
        // 2 提现
        case '已申请':
          this.currentStatus = 'PENDING'
          break
        case '处理中':
          this.currentStatus = 'PROCESSING'
          break
        case '失败':
          this.currentStatus = 'FAIL'
          break
        case '已到账':
          this.currentStatus = 'REMITTED'
          break
        // 3 奖金
        case '注册补贴':
          this.currentStatus = ['REGISTER', 'AUTHENTICATION', 'FIRST_TRADE_SUCCESS']
          break
        case '实名认证补贴':
          this.currentStatus = ['REGISTER', 'AUTHENTICATION', 'FIRST_TRADE_SUCCESS']
          break
        case '首次交易成功补贴':
          this.currentStatus = ['REGISTER', 'AUTHENTICATION', 'FIRST_TRADE_SUCCESS']
          break
        case '积分抵扣':
          this.currentStatus = 'POINTS'
          break
        case '管理奖':
          this.currentStatus = 'MANAGER'
          break
        // 4 积分
        case '注册':
          this.currentStatus = 'REGISTER'
          break
        case '实名认证':
          this.currentStatus = 'AUTHENTICATION'
          break
        case '首次交易成功':
          this.currentStatus = 'FIRST_TRADE_SUCCESS'
          break
        case '升级消耗':
          this.currentStatus = 'UPGRADE_CONSUME'
          break
        case '交易成功积分抵扣':
          this.currentStatus = 'TRADE_SUCCESS_DEDUCT'
          break
        case '手续费转化':
          this.currentStatus = 'FEE'
          break
        case '手动奖励':
          this.currentStatus = 'MANUAL_AWARD'
          break
        case '手动扣除':
          this.currentStatus = 'MANUAL_CONSUME'
          break
        // 5 佣金
        case '三级分润':
          this.currentStatus = 'THIRD_LEVEL'
          break
        case '直推分润':
          this.currentStatus = 'DIRECT_PARENT'
          break
        case '平推分润':
          this.currentStatus = 'RANKING_PARENT'
          break
        case '费率差分润':
          this.currentStatus = 'RANK_RATE_DIFF'
          break
      }
      this.fetchData(this.currentNav)
    },
    /* 状态类型文字列表*/
    statusColumnsList() {
      switch (this.currentNav) {
        case 0:
          this.statusColumns = ['未支付', '未结算', '已结算']
          break
        case 1:
          this.statusColumns = ['收款', '代还']
          this.statusSelect = this.statusSelect || '收款'
          this.currentStatus = 'FINANCIAL_LEVERAGE_GROUP'
          break
        case 2:
          this.statusColumns = ['已申请', '处理中', '已到账', '失败']
          break
        case 3:
          this.statusColumns = ['注册补贴', '实名认证补贴', '首次交易成功补贴', '积分抵扣', '管理奖']
          break
        case 4:
          this.statusColumns = ['注册', '实名认证', '首次交易成功', '升级消耗', '交易成功积分抵扣', '手续费转化', '手动奖励', '手动扣除']
          break
        case 5:
          this.statusColumns = ['三级分润', '直推分润', '平推分润', '费率差分润']
          break
      }
    },
    /* 获取分润列表*/
    getProfitsListFun() {
      const that = this
      return that.$api.center
        .getProfitsList({
          page: that.profitsPage,
          size: 10,
          searchDate: this.postCurrentDate && formatDate(this.postCurrentDate, 'yyyy-MM-dd'),
          type: this.currentStatus,
          isOnMonth: this.isOnMonth
        })
        .then(res => {
          // console.log(res)
          that.sumTotalAmount = res.data.data.aggregation.sumProfitsAmount
          if (res.data.data.has_content) {
            // 有内容
            that.profitsList = that.profitsList.concat(res.data.data.content)
            that.haveContent = true
            if (res.data.data.has_next) {
              // 有下一页
              that.profitsPage++
              that.profitsLoading = false
            } else {
              // 无下一页
              that.profitsLoading = false
              that.profitsFinished = true
            }
          } else {
            // 无内容
            that.haveContent = false
            that.profitsLoading = false
            that.profitsFinished = true
          }
        })
        .catch(error => {
          console.log(error)
          // that.isLoading.clear();
          that.profitsLoading = false
          that.profitsError = true
        })
    },
    /* 获取提现列表*/
    getWithdrawListFun() {
      const that = this
      return that.$api.center
        .getWithdrawList({
          page: that.withdrawPage,
          size: 10,
          searchDate: this.postCurrentDate && formatDate(this.postCurrentDate, 'yyyy-MM-dd'),
          tradeState: this.currentStatus,
          isOnMonth: this.isOnMonth
        })
        .then(res => {
          // console.log(res);
          that.sumTotalAmount = res.data.data.aggregation.sumActualAmount
          if (res.data.data.has_content) {
            // 有内容
            that.withdrawList = that.withdrawList.concat(res.data.data.content)
            that.haveContent = true
            if (res.data.data.has_next) {
              // 有下一页
              that.withdrawPage++
              that.withdrawLoading = false
            } else {
              // 无下一页
              that.withdrawLoading = false
              that.withdrawFinished = true
            }
          } else {
            // 无内容
            that.haveContent = false
            that.withdrawLoading = false
            that.withdrawFinished = true
          }
        })
        .catch(error => {
          console.log(error)
          // that.isLoading.clear();
          that.withdrawLoading = false
          that.withdrawError = true
        })
    },
    /* 获取订单列表*/
    getOrderListFun() {
      const that = this
      console.log('currentNav: ', this.currentNav)
      return that.$api.center
        .getTradeList({
          page: that.orderPage,
          size: 10,
          searchDate: this.postCurrentDate && formatDate(this.postCurrentDate, 'yyyy-MM-dd'),
          tradeState: this.currentStatus,
          isOnMonth: this.isOnMonth
        })
        .then(res => {
          // console.log(res)
          that.sumTotalAmount = res.data.data.aggregation.sumTotalAmount
          if (res.data.data.has_content) {
            // 有内容
            that.orderList = that.orderList.concat(res.data.data.content)
            that.haveContent = true
            if (res.data.data.has_next) {
              // 有下一页
              that.orderPage++
              that.orderLoading = false
            } else {
              // 无下一页
              that.orderLoading = false
              that.orderFinished = true
            }
          } else {
            // 无内容
            that.haveContent = false
            that.orderLoading = false
            that.orderFinished = true
          }
        })
        .catch(error => {
          console.log(error)
          that.orderLoading = false
          that.orderError = true
        })
    },
    /* 获取奖金列表*/
    getBonusListFun() {
      const that = this
      return that.$api.center
        .getBonusList({
          page: that.bonusPage,
          size: 10,
          searchDate: this.postCurrentDate && formatDate(this.postCurrentDate, 'yyyy-MM-dd'),
          type: this.currentStatus,
          isOnMonth: this.isOnMonth
        })
        .then(res => {
          // console.log(res);
          that.sumTotalAmount = res.data.data.aggregation.sumBonusAmount
          if (res.data.data.has_content) {
            // 有内容
            that.bonusList = that.bonusList.concat(res.data.data.content)
            that.haveContent = true
            if (res.data.data.has_next) {
              // 有下一页
              that.bonusPage++
              that.bonusLoading = false
            } else {
              // 无下一页
              that.bonusLoading = false
              that.bonusFinished = true
            }
          } else {
            // 无内容
            that.haveContent = false
            that.bonusLoading = false
            that.bonusFinished = true
          }
        })
    },
    /* 获取积分列表*/
    getPointsListFun() {
      const that = this
      return that.$api.center
        .getPointsList({
          page: that.pointsPage,
          size: 10,
          searchDate: this.postCurrentDate && formatDate(this.postCurrentDate, 'yyyy-MM-dd'),
          type: this.currentStatus,
          isOnMonth: this.isOnMonth
        })
        .then(res => {
          // console.log(res);
          // that.sumTotalAmount = res.data.data.aggregation.sumPointsAmount
          that.sumGainPointsAmount = res.data.data.aggregation.sumGainPointsAmount
          that.sumConsumeProfitsAmount = res.data.data.aggregation.sumConsumeProfitsAmount
          if (res.data.data.has_content) {
            // 有内容
            that.pointsList = that.pointsList.concat(res.data.data.content)
            that.haveContent = true
            if (res.data.data.has_next) {
              // 有下一页
              that.pointsPage++
              that.pointsLoading = false
            } else {
              // 无下一页
              that.pointsLoading = false
              that.pointsFinished = true
            }
          } else {
            // 无内容
            that.haveContent = false
            that.pointsLoading = false
            that.pointsFinished = true
          }
        })
    },
    /* 获取佣金列表*/
    getUpgradeListFun() {
      const that = this
      return that.$api.center
        .getUpgradeList({
          page: that.upgradePage,
          size: 10,
          searchDate: this.postCurrentDate && formatDate(this.postCurrentDate, 'yyyy-MM-dd'),
          type: this.currentStatus,
          isOnMonth: this.isOnMonth
        })
        .then(res => {
          // console.log(res)
          that.sumTotalAmount = res.data.data.aggregation.sumProfitsAmount
          if (res.data.data.has_content) {
            // 有内容
            that.upgradeList = that.upgradeList.concat(res.data.data.content)
            that.haveContent = true
            if (res.data.data.has_next) {
              // 有下一页
              that.upgradePage++
              that.upgradeLoading = false
            } else {
              // 无下一页
              that.upgradeLoading = false
              that.upgradeFinished = true
            }
          } else {
            // 无内容
            that.haveContent = false
            that.upgradeLoading = false
            that.upgradeFinished = true
          }
        })
        .catch(error => {
          console.log(error)
          // that.isLoading.clear();
          that.upgradeLoading = false
          that.upgradeError = true
        })
    },
    /* 获取订单详情*/
    getOrderDetailFun(id) {
      const that = this
      that.$api.center
        .getOrderDetail(id)
        .then(res => {
          // console.log(res);
          that.orderDetail = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    /* 点击导航栏 将导航栏下的分类选项置空*/
    toggleNav() {
      this.monthSelect = ''
      this.currentDate = null
      this.postCurrentDate = null
      this.statusSelect = ''
      this.currentStatus = ''
      this.statusColumnsList()
      this.fetchData(this.currentNav)
    },
    /* 解决iphone页面层级相互影响滑动的问题*/
    closeTouch: function() {
      document
        .getElementsByTagName('body')[0]
        .addEventListener('touchmove', this.handler, { passive: false }) // 阻止默认事件
      console.log('closeTouch haved happened.')
    },
    openTouch: function() {
      document
        .getElementsByTagName('body')[0]
        .removeEventListener('touchmove', this.handler, { passive: false }) // 打开默认事件
      console.log('openTouch haved happened.')
    }
  }
}
</script>

<style lang="less" scoped>
.van-collapse-item{
  margin: 24px 24px 0;
}
.unContent{
  text-align: center;
  padding: 24px 0 ;
  .unContent_img{
    width: 100%;
    text-align: center;
    overflow: hidden;
    img{
      width: auto;
      height: 100%;
    }
  }
}
/deep/.van-tab--active{
  .van-ellipsis{
    color: @mainColorB;
  }
}
.success {
  color: @mainColorB;
}
.fail {
  color: #ED0202;
}
.nav_item {
  position: relative;
  width: 33.33%;
  padding: 34px 0 14px;
  text-align: center;
  font-size: 30px;
  color: #999999;
}
.nav_item-on::after {
  position: absolute;
  display: inline-block;
  left: 50%;
  bottom: 0;
  width: 60px;
  margin-left: -30px;
  color: @mainColorB;
  border-bottom: 4px solid @mainColorB;
  content: "";
}
.bills_head {
  padding: 35px 23px 10px 25px;
  // line-height: 63px;
  .box{
    background-color: white;
    border-radius: 10px;
    padding: 2px 36px 2px 20px;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    span{
      display: inline-block;
      max-width: 84px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    i{
      position: absolute;
      top: 10px;
      right: 8px;
      font-size: 16px;
      color: #999999;
    }
  }
}
.bills_head .amount_all {
  min-width: 35%;
}

.bills_select {
  // position: relative;
  // background-color: white;
  // border-radius: 10px;
  // padding: 2px 30px 2px 20px;
  // box-sizing: border-box;
}
// .bills_select:before {
//   position: absolute;
//   display: inline-block;
//   top: 40%;
//   right: 12px;
//   width: 0;
//   height: 0;
//   border-width: 9px 7px 0;
//   border-style: solid;
//   border-color: #666666 transparent transparent; /*灰 透明 透明 */
//   content: "";
// }

.bills_item {
  margin: 24px 24px 0;
  padding:0 25px 18px 25px;
}
.bills_item .tuijian {
  width: 64px;
  height: 34px;
}
.lineheight60 {
  line-height: 60px;
}
.lineheight44 {
  line-height: 44px;
}
.detail_msg p {
  font-size: 24px;
  color: #666666;
}
.detail_moreMsg p:first-child {
  width: 220px;
}
.detail_moreMsg p:nth-child(2) {
  width: 220px;
}
.detail_msg span {
  font-size: 24px;
  color: #666666;
}
.list_loading {
  margin: 0 auto;
}
.bonus_item {
  margin: 24px 24px 0;
  padding: 13px 26px 13px;
  border-top: 0.01rem solid #e5e5e5;
  border-bottom: 0.01rem solid #e5e5e5;
  border-radius: 5px;
}
.lineheight70 {
  line-height: 70px;
}
/*新ui*/
.item_top {
  padding: 18px 0;
  box-sizing: border-box;
  border-bottom: 1px dashed #ccc;
}
.item_top i {
  font-size: 32px;
  margin-right: 10px;
  color: @mainColorB
}
.TXfail {
  margin-top: 24px;
  background-color: #eee;
  padding: 20px 24px;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 24px;
}
.icon_zhitui {
  font-size: 20px;
  color: white;
  background-color: @mainColorB;
  padding: 3px 12px;
  box-sizing: border-box;
  border: 1px solid @mainColorB;
  border-radius: 10px;
  margin-right: 10px;
  font-weight: bold;
}
.icon_jiantui {
  font-size: 20px;
  color: @mainColorB;
  background-color: white;
  padding: 3px 12px;
  box-sizing: border-box;
  border: 1px solid @mainColorB;
  border-radius: 10px;
  margin-right: 10px;
  font-weight: bold;
}
.tradeState {
  position: absolute;
  top: 48px;
  left: 0;
  width: 44px;
  padding: 10px;
  box-sizing: border-box;
  color: white;
  border-radius: 0 10px 10px 0;
}
.yijiesuan {
  background-color: #cccccc;
}
.weijiesuan {
  background-color: @mainColorB;
}
.xiala {
  color: #999999;
  font-size: 16px;
  margin-top: 5px;
  margin-left: 5px;
}
.colorED0{
  color: #ED0202;
}
</style>

<style lang="less" scoped>
/* vant 样式修改 */
.van-tab {
  font-size: 30px;
  line-height: 110px;
}
.van-cell {
  color: #666666;
  background-color: #f8f8f8 !important;
}
.van-collapse-item__content {
  margin: 0 24px;
  padding: 24px !important;
  line-height: 5.6vw;
  background: #dddddd !important;
}

/deep/ .van-tabs__nav .van-tabs__line{
  background-color: @mainColorB !important;
}
.van-tabs--line .van-tabs__wrap {
  height: 88px;
}
.van-hairline--top-bottom:after{
  border: none;
}
</style>

