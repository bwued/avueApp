<template>
  <div>
    <van-dialog
      v-model="channelDetail"
      :show-confirm-button="showFalse"
      :before-close="beforeClose"
      close-on-click-overlay
    >
      <div class="dialog_channel">
        <div class="textalign_right">
          <i class="icon_close" @click="closeDialog" />
        </div>
        <div class="dialog_content">
          <div class="dialog_title cen">
            <img v-if="cardDetailMsg.logo_image" :src="cardDetailMsg.logo_image.url">
            <p class="size36 color000">
              {{ cardDetailMsg.name }}
            </p>
          </div>
          <div class="dialog_msg size26 color000">
            <div>费率：{{ computeRate(cardDetailMsg) }}%</div>
            <div>结算：{{ computeFee(cardDetailMsg) }}元/笔</div>
            <div>单笔：{{ cardDetailMsg.channel_config.trade_config_data.min_amount_per_trade }}-{{ cardDetailMsg.channel_config.trade_config_data.max_amount_per_trade	}}元/卡</div>
            <div>时间：{{ cardDetailMsg.channel_config.trade_config_data.start_time }}-{{ cardDetailMsg.channel_config.trade_config_data.end_time }}</div>
            <div>当天：{{ cardDetailMsg.channel_config.trade_config_data.daily_max_amount_per_card }}万元/卡</div>
          </div>
          <div class="dialog_tip flex-row">
            <span>提示：</span>
            <p class="size22 color666" v-html="cardDetailMsg.description" />
          </div>
          <div class="flex-vertical-centering mt30">
            <button class="btn btn_submit" @click="closeDialog">
              确定
            </button>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: 'ChannelDetail',
  // 接受父组件的值
  props: {
    cardDetailMsg: {
      type: Object,
      default: () => {}
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  /* data必须是函数*/
  data: function() {
    return {
      channelDetail: true,
      showFalse: false
    }
  },
  computed: {
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
    console.log(this.cardDetailMsg)
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = this.STATIC_INFO.appName
    },
    /* 在弹框关闭前的函数*/
    beforeClose(action, done) {
      done()
      this.$emit('valueClose', false)
    },
    /* 点击关闭*/
    closeDialog() {
      console.log('11111111111111')
      this.$emit('valueClose', false)
    }
  }
}
</script>

<style lang="less" scoped>
.van-dialog{
    max-width: 100%;
    max-height: 100%;
    overflow: auto !important;
}
  .dialog_channel{
    min-height: 746px;
    padding: 28px 32px 28px 47px;
  }
  .dialog_content{
    padding-right: 24px;
  }
  .dialog_title >img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .dialog_title >p{
    margin-top: 10px;
  }
  .dialog_msg>div{
    margin-top: 40px;
  }
  .dialog_tip{
    font-size: 24px;
    margin-top: 40px;
    color: #999999;
  }
  .btn_submit{
    margin-top: 24px !important;
  }
</style>
