<template>
  <div>
    <top-msg header-name="提现记录" />
    <div class="con_body">
      <van-tabs v-model="currentNav" title-active-color="#0086F2" @click="toggleNav">
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
              <p v-if="currentNav===3" class="size26 color999">
                获得：
                <span class="colorED0">{{ sumGainPointsAmount | parseAmount }} </span>
                消费：
                <span class="colorED0">{{ Math.abs(sumConsumeProfitsAmount) | parseAmount }}</span>
              </p>
              <p v-else class="total">
                总计：
                <span class="colorED0">¥{{ sumTotalAmount | parseAmount }}</span>
              </p>
            </div>
          </div>
        </div>

        <van-tab title="查看全部">
          <!--提现 列表 start -->
          <div class="bills_items">
            <template v-show="currentNav === 1">
              <van-list
                v-model="withdrawLoading"
                :finished="withdrawFinished"
                :error.sync="withdrawError"
                finished-text="已加载完毕"
                error-text="请求失败，点击重新加载"
                @load="getWithdrawListFun"
              >
                <template v-if="haveContent">
                  <div
                    v-for="item in withdrawList"
                    :key="item.id"
                    class="bills_item flex_sb bgfff mgb20"
                  >
                    <div class="w100 flex-vertical-centering">
                      <div class="w100 flex-row-between item_top">
                        <div class="flex-row-center">
                          <i class="iconfont icon-dingdan" />
                          <p class="size26 color333">
                            订单号：{{ item.remission_no }}
                          </p>
                        </div>
                        <p
                          :class="['size26' ,state[item.state]]"
                        >
                          {{ item.state == ('PENDING' || 'PROCESSING') ? '提现中' : item.state == 'FAIL' ? '提现失败' : '提现成功' }}
                        </p>
                      </div>
                      <div class="w100 flex-row-between mt20">
                        <p class="size28 color666">
                          时间：{{ item.gmt_create | timeToFormatDate }}
                        </p>
                        <p class="size28 colorED0 bold">
                          ¥ {{ item.actual_amount | parseAmount }}
                        </p>
                      </div>
                      <div v-if="item.state == 'FAIL'" class="w100 flex-row-center TXfail">
                        失败原因：账户异常
                      </div>
                    </div>
                  </div>
                  <div>
                    <!-- <ul>rte r</ul> -->
                  </div>
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
            <!--提现 列表 end -->
          </div>
        </van-tab>
      </van-tabs>
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
  name: 'Bill',
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
    remissionState(state) {
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
      currentNav: this.$util.getQueryVariable('current')
        ? this.$util.getQueryVariable('current')
        : 0, // 当前nav
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

      //   profitsList: [],
      //   profitsLoading: false, // 分润列表的loading
      //   profitsFinished: false, // 分润列表的finished
      //   profitsError: false, // 分润列表的error
      //   profitsPage: 0, // 分润列表的页数

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
      return this.currentNav === 0 ? '状态' : '类型'
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
    console.log('this.currentNav: ', this.currentNav)
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
        case -1:
          this.orderList = []
          this.orderLoading = true // 订单列表的loading
          this.orderFinished = false // 订单列表的finished
          this.orderError = false // 订单列表的error
          this.orderPage = 0 // 订单列表的页数
          return this.getOrderListFun()

        case 0:
          this.withdrawList = []
          this.withdrawLoading = true // 提现列表的loading
          this.withdrawFinished = false // 提现列表的finished
          this.withdrawError = false // 提现列表的error
          this.withdrawPage = 0 // 提现列表的页数
          return this.getWithdrawListFun()

        case 1:
          this.bonusList = []
          this.bonusLoading = true // 提现列表的loading
          this.bonusFinished = false // 提现列表的finished
          this.bonusError = false // 提现列表的error
          this.bonusPage = 0 // 提现列表的页数
          return this.getBonusListFun()

        case 2:
          this.pointsList = []
          this.pointsLoading = true // 提现列表的loading
          this.pointsFinished = false // 提现列表的finished
          this.pointsError = false // 提现列表的error
          this.pointsPage = 0 // 提现列表的页数
          return this.getPointsListFun()
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
        // case '已申请':
        //   this.currentStatus = 'PENDING'
        //   break
        // case '处理中':
        //   this.currentStatus = 'PROCESSING'
        //   break
        case '失败':
          this.currentStatus = 'FAIL'
          break
        case '已到账':
          this.currentStatus = 'REMITTED'
          break
      }
      this.fetchData(this.currentNav)
    },
    /* 状态类型文字列表*/
    statusColumnsList() {
      switch (this.currentNav) {
        case -1:
          this.statusColumns = ['未支付', '未结算', '已结算']
          break
        case 1:
          this.statusColumns = ['已到账', '失败']
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
          remissionState: this.currentStatus,
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
      return that.$api.center
        .getTradeList({
          page: that.orderPage,
          size: 10,
          searchDate: this.postCurrentDate && formatDate(this.postCurrentDate, 'yyyy-MM-dd'),
          remissionState: this.currentStatus,
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
/deep/.van-tab{
  span{
    color: #999999;
  }
}
/deep/.van-tab--active{
  .van-ellipsis{
       color: #ad8147;
       margin-right: 19rem;
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
  padding: 100px 23px 10px 25px;
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
  background-color: white;
}
.van-tabs--line .van-tabs__wrap {
  height: 88px;
}
.van-hairline--top-bottom:after{
  border: none;
}
.total {
  font-size: 26px;
  color: #666666;
  span {
    color: #FA4559;
  }
}
</style>

