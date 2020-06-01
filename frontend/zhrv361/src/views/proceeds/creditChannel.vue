<template>
  <div class="mgb100">
    <top-msg header-name="收款通道" />
    <div class="con_body">
      <div class="form_cells bgfff">
        <div class="form_cell">
          <div class="form_cellHd">
            <span class="size28 color333">交易金额</span>
          </div>
          <div class="form_cellBd textalign_right">
            <span class="transaction-money">¥{{ proceedsAmount }}</span>
          </div>
        </div>
      </div>
      <div class="channel_warp">
        <div class="channel_title">
          <span class="color999 size28">请选择通道</span>
        </div>
        <div class="channel_body">
          <van-list
            v-model="channelLoading"
            :finished="channelFinished"
            :error.sync="channelError"
            finished-text="已加载完毕"
            error-text="请求失败，点击重新加载"
            @load="getChannelFun"
          >
            <template v-if="haveContent">
              <div v-for="(item,index) in channelList" :key="item.channel_no" :class="currentSelect === index ? 'card_item card_item-on' : 'card_item'" @click="toggle(index)">
                <!-- <i v-show="currentSelect === index" class="icon_select" /> -->
                <div class="flex flex_alCen">
                  <div class="item_left w20">
                    <div class="item_logo">
                      <img v-if="item.logo_image" :src="item.logo_image.url">
                    </div>
                  </div>
                  <div class="item_right w80">
                    <div class="item_link flex-row-center flex_end">
                      <span :class="currentSelect === index ? '' : 'color999'" @click.stop="gotoChannelDetail(index)">通道详情</span>
                      <img v-if="currentSelect === index" class="icon_you" src="../../../static/img/youbai.png">
                      <img v-else class="icon_you" src="../../../static/img/youhui.png">
                    </div>
                    <div class="item_title">
                      <h5 class="size34 bold">
                        {{ item.name }}
                      </h5>
                    </div>
                    <div class="item_msg">
                      <div class="flex_sb size24">
                        <p>费率：{{ computeRate(item) }}% 结算：{{ computeFee(item) }}元/笔</p>
                        <p>时间：{{ item.channel_config.trade_config_data.start_time }}-{{ item.channel_config.trade_config_data.end_time }}</p>
                      </div>
                      <div class="flex_sb size24 mt5">
                        <p>单笔：{{ item.channel_config.trade_config_data.min_amount_per_trade }}-{{ item.channel_config.trade_config_data.max_amount_per_trade	}}元/卡</p>
                        <p>当天：{{ item.channel_config.trade_config_data.daily_max_amount_per_card }}万元/人</p>
                      </div>
                    </div>
                    <div class="item_tip">
                      <p :class="['size20','textEllipsis',currentSelect === index ? 'colorF8' : 'color999']">
                        {{ item.intro }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div v-if="!haveContent" class="unContent">
              <div class="unContent_img">
                <img src="../../../static/img/pic_nonelike.png">
              </div>
              <div><span>没有相关记录</span></div>
            </div>
          </van-list>
        </div>
      </div>
      <div class="btn_warp" @click="confirmNext">
        确认支付
      </div>
    </div>
    <channelDetail v-if="showDialog" :card-detail-msg="cardDetailMsg" @valueClose="valueClose" />
    <van-dialog
      v-model="confirmPopover"
      :show-confirm-button="showFalse"
      close-on-click-overlay
    >
      <div class="flex-column-center">
        <i class="iconfont icon-gou maincolor gouImg" />
        <span class="size34 color000 mt20">订单已提交</span>
        <span class="size48 colorED0 mt20">{{ proceedsAmount }} 元</span>
        <span class="size26 color888 mt20">当前会员等级：黄金会员</span>
        <div class="btn btn_submit mt30">
          确定
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import channelDetail from '@/components/channelDetail.vue'
import topMsg from '@/components/topMsg'
export default {
  name: 'CreditChannel',
  components: { channelDetail, topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      currentSelect: 0, // 当前选中的银行卡
      showDialog: false, // 通道详情dialog
      page: 0,
      channelList: [], // 通道列表 List
      channelLoading: false, // 通道列表的loading
      channelFinished: false, // 通道列表的finished
      channelError: false, // 通道列表的error
      haveContent: false, // 判断获取的通道列表是否为空
      isLoading: '', // 加载图标
      cardDetailMsg: '', // 传给子组件，通道详情的信息
      showFalse: false, // 支付成功弹窗vant默认按钮
      confirmPopover: false, // 支付成功弹窗
      debitCardMsgList: '', // 储蓄卡列表
      tx_type: 1, // // tx_type Tx类型 :1 信用卡默认值 ，2 : 花呗
      debitCardMsg: ''

    }
  },
  computed: {
    proceedsAmount() {
      return this.$route.query.proceedsAmount
    },
    rankOrder() {
      return this.$store.state.userInfo.rank_order
    },
    computeRate() {
      return item => (item.financial_rule.rate * 100).toFixed(2)
    },
    computeFee() {
      return item => ((item.financial_rule.fee) / 100).toFixed(2)
    }
  },
  created() {
    this.thisTitle()
    this.getCreditCardListFun()
  },
  destroyed() {
  },
  methods: {
    /* 获取储蓄卡银行卡列表*/
    getCreditCardListFun() {
      const that = this
      console.log('获取储蓄卡银行卡列表')
      that.$api.card.getCardList('DEBIT').then(res => {
        that.debitCardMsgList = res.data.data
        if (that.debitCardMsgList.length != 0) {
          that.debitCardMsg = that.debitCardMsgList[0]
          that.$store.commit('SET_CURRENT_DEBIT_CARD', that.debitCardMsg)
        }
      }).catch(error => {
      })
    },
    /* 设置标题*/
    thisTitle: function() {
      document.title = '收款通道'
    },
    /* 银行卡切换*/
    toggle(i) {
      this.currentSelect = i
      this.gotoChannelDetail(i)
    },
    /* 去通道详情*/
    gotoChannelDetail(i) {
      this.currentSelect = i
      this.cardDetailMsg = this.channelList[i]
      // this.param_type = this.channelList[i].channel_config.pay_provider_config_data.param_type // TODO 是否花呗分期标识 HBFQ
      // alert(this.param_type)
      this.showDialog = true
    },
    /* 子组件dialog 传递关闭dialog过来*/
    valueClose(value) {
      this.showDialog = value
    },
    /* 获取通道*/
    getChannelFun() { // 列表
      const that = this
      that.$api.proceeds.getChannel({
        page: this.page,
        pay_provider_code: 'newCode',
        size: '10'
      }).then(res => {
        const lastPage = res.data.data.total_pages
        if (that.page < lastPage) {
          if (res.data.data.content.length === 0) {
            that.haveContent = false
            that.channelLoading = false
            that.channelFinished = true
          } else {
            that.channelList = that.channelList.concat(res.data.data.content)
            that.page++
            that.haveContent = true
            that.channelLoading = false
          }
        } else if (that.page === lastPage) {
          that.channelLoading = false
          that.channelFinished = true
          that.channelList = that.channelList.concat(res.data.data.content)
          that.page++
        } else {
          that.channelLoading = false
          that.channelFinished = true
        }
      }).catch(() => {
        that.channelLoading = false
        that.channelError = true
        that.haveContent = true
      })
    },
    /* 点击确认支付 去到下一页*/
    confirmNext() {
      const that = this
      const channelCode = that.channelList[that.currentSelect].code
      const channelName = that.channelList[that.currentSelect].name
      const on_sale = that.channelList[that.currentSelect].on_sale
      const txType = that.channelList[that.currentSelect].tx_type || that.tx_type // tx_type Tx类型 :1 信用卡 ，2 : 花呗
	  if (on_sale == '1') { // on_sale 1待上架， 2已上架，3下架
		  this.gotoChannelDetail(that.currentSelect)
		   return
	  }

      const chooseCity = that.channelList[that.currentSelect].channel_config.trade_config_data.support_choose_city
      if (this.channelList[that.currentSelect].channel_config.pay_provider_config_data) {
        this.param_type = this.channelList[that.currentSelect].channel_config.pay_provider_config_data.param_type // TODO 是否花呗分期标识 HBFQ
      } else {
        this.param_type = ''
      }

      this.$store.commit('SET_CHOOSE_CITY', chooseCity)

      const loading = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '请稍候...'
      })
      that.$api.proceeds
        .getSettle({
          channel_code: channelCode,
          total_amount: that.proceedsAmount * 100
        })
        .then(res => {
          loading.clear()
          that.$store.commit('SET_SETTLE_MSG', res.data.data)
          // if (channelCode === 'ZMF_JK_HB_001') { // todo 花呗同名进出
          if ( txType === 2) { // todo 花呗
            that.$router.push({ path: '/huabeiPay', query: { code: channelCode, amount: that.proceedsAmount, channelName: channelName, param_type: that.param_type }})
          } else {
            that.$router.push({ path: '/selectCard', query: { code: channelCode, amount: that.proceedsAmount, channelName: channelName, param_type: that.param_type }})
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
  /*银行卡模块 银行卡的样式*/
  .channel_body {
    .card_item{
      position: relative;
      width: 702px;
      /*height: 250px;*/
      margin: 0 auto 20px;
      background:rgba(255,255,255,1);
      border: 2px solid #1D2132;
      border-radius: 10px;
      color: #333;
    }
    .card_item-on {
      .item_right *{
        color:#ffffff;
      }
      width: 702px;
      background-color: #D2AB76;
      border-color: #D2AB76;
      background-image: url("../../../static/img/receipt-bg.png");
      background-repeat: no-repeat;
      background-size: cover;
      border: none;
    }
  }
  .form_cells .form_cell{
    padding: 0 5px 0 23px;
  }

  .channel_title{
    padding: 25px 0 20px 23px;
  }
  .icon_select{
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    background: url("../../../static/img/choose.png") no-repeat ;
    background-size: 50px;
  }
  .item_logo{
    width: 66px;
    height: 66px;
    margin: 0 auto;
  }
  .item_logo >img{
    width: 100%;
    border-radius: 50%;
  }

  .item_right{
    padding: 16px 22px 0 0;
  }
  .item_link{
    font-size: 24px;
  }
  .item_link .icon_path{
    margin-left: 11px;
    transform: translateY(4px);
  }
  .item_title{
    margin-bottom: 16px;
    line-height: 35px;
  }
  .item_msg{
    margin-bottom: 20px;
  }
  .item_tip{
    margin-bottom: 36px;
  }
  .btn_warp{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: #BF9761;
    color: #ffffff;
    font-size: 30px;
    &:active {
      opacity: .6;
    }
  }
  .btn_pay{
    width: 460px;
    height: 74px;
    margin: 13px 0;
    .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
  }

  .mgb100{
    margin-bottom: 100px;
  }
  .colorF8{
    color: #f8f8f8;
  }
  .icon_you{
    margin-left: 10px;
    width: 10px;
    height: 16px;
  }
  .colorED0{
    color: #ED0202;
  }
  .color888{
    color: #888888;
  }
  .btn_submit{
    text-align: center;
    line-height: 70px;
  }
  .gouImg{
    font-size: 180px;
  }
  .transaction-money {
    color: #FA4559;
    font-size: 48px;
  }
</style>
