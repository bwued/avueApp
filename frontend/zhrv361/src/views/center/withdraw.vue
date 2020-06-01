<template>
  <div>
    <top-msg header-name="提现" />
    <div class="con_body height90vh flex_column flex_sb">
      <div>
        <div class="userInfo_container">
          <div class="money_warp">
            <div class="userInfo_withdraw" @click="gotoWithdrawList">
              <span>提现记录</span>
            </div>
            <div class="money_msg cen">
              <span class="current-income">当前收益</span>
              <p class="current-income-money">
                {{ balance }}
              </p>
            </div>
          </div>
        </div>
        <div class="CashWithdrawal">
          <div class="flex-row-between">
            <span class="size28 color333">提现金额</span>
            <input v-model.trim="withdrawMoney" class="form_input" type="number" placeholder="请输入提现金额">
            <span>元</span>
          </div>
        </div>
        <div class="BankCard flex-row-between">
          <div class="flex-row flex1">
            <div class="size28 color333 mr100 BankCardMsg">
              银行卡号
            </div>
            <div class="size28 color666">
              <p v-if="debitCardMsg" class="flex-column BankCardMsg">
                <span>{{ debitCardMsg.bank_info.name }}</span>
                <span class="mt10">{{ debitCardMsg.card_info.card_no.replace(/\s/g, '').replace(/(.{4})(?=\d)/g, '$1 ') }}</span>
              </p>
              <p v-else class="BankCardMsg">
                <span class="size28 color999">请添加银行卡</span>
              </p>
            </div>
          </div>
          <div class="BankCardClick">
            <span v-if="!debitCardMsg" class="maincolor size28" @click="gotoAddCard">
              添加
            </span>
            <span v-else class="maincolor size28" @click="gotoEditCard">
              修改
            </span>
          </div>
        </div>
        <div class="tip size24 color999">
          <div v-html="msg" />
        </div>
      </div>
    </div>
    <!-- <div class="btn_footer" @click="confirmWithdraw">
      {{isWithdraw ? '提现中...' : '确认提现'}}
    </div> -->

    <div v-if="isWithdraw" class="btn_footer">
      提现中...
    </div>
    <div v-if="!isWithdraw" class="btn_footer" @click="confirmWithdraw">
      确认提现
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import { Toast } from 'vant'
export default {
  name: 'Withdraw',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      withdrawMoney: '', // 提现金额
      cardMsg: '', // 银行卡信息 列表形式
      debitCardMsg: '', //
      msg: '',
      isWithdraw: false,
      balance: 0
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    currentDebitCard() {
      return this.$store.state.currentDebitCard
    }
  },
  watch: {
    withdrawMoney(newValue, oldValue) {
      this.withdrawMoney = this.withdrawMoney.length > 20 ? this.withdrawMoney.substr(0, 20) : this.withdrawMoney // 控制输入的金额位数 最多20位
    }
  },
  created() {
    this.thisTitle()
    this.getBalance()
    if (this.currentDebitCard) {
      this.debitCardMsg = this.currentDebitCard
    } else {
      this.getCardListFun()
    }
    if (!this.$store.state.userInfo) {
      this.$store.commit('userInfoFun')
    }
    this.$api.richText
      .getText({
        type: 'withdrawal'
      })
      .then(res => {
        if (res.data.data) {
          this.msg = res.data.data.content
        }
      })
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '提现管理'
    },
    /* 返回上一页*/
    gotoFrontView() {
      this.$router.go(-1)
    },
    /* 点击去提现记录页面（实际就是去账单页面）*/
    gotoWithdrawList() {
      this.$router.push({ path: '/tixian', query: { current: '1' }})
    },
    /* 点击修改，修改储蓄卡*/
    gotoEditCard() {
      this.$router.push({ path: '/changeCard', query: { type: 'cashCard' }})
    },
    /* 点击新增，新增银行卡*/
    gotoAddCard() {
      this.$router.push({ path: '/addCard', query: { status: 'add' }})
    },
    /* 获取银行卡列表 储蓄卡*/
    getCardListFun() {
      const that = this
      that.$api.card.getCardList('DEBIT').then(res => {
        that.cardMsg = res.data.data
        if (that.cardMsg.length !== 0) {
          that.debitCardMsg = that.cardMsg[0]
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /* 刷新当前收益 */
    getBalance() {
      this.$api.center.getUserInfo().then(res => {
        this.balance = res.data.data.balance || '0'
      }).catch((err) => {
        console.log('刷新当前收益 err: ', err)
      })
    },

    /* 二次确定提现 */
    submit() {
      const that = this
      that
        .$dialog({
          title: '确定要提现吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          className: 'dialog',
          closeOnClickOverlay: true
        }).then(() => {
          that.isLoading = this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: '请稍候...'
          })

          that.isWithdraw = true
          const loading = that.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: '请稍候...'
          })
          that.$api.center.x_postWithdrawal({
            card_id: that.debitCardMsg.id,
            order_amount: (that.withdrawMoney * 100).toFixed(0) // 转化为分
          }).then(res => {
            console.log(res)
            setTimeout(() => {
              that.isWithdraw = false
              loading.clear()
            }, 2000)

            if (res.code === '200000') {
              that.$dialog({
                title: '提现处理中'
              }).then(() => {
                that.$router.push({ path: '/tixian', query: { current: 1 }})
              })
            }
            that.getBalance()
          }).catch(error => {
            setTimeout(() => {
              that.isWithdraw = false
              loading.clear()
            }, 2000)
            that.getBalance()
            console.log(error)
            Toast('数据处理中，请查看提现记录')
          })
        })
    },

    payment() {

    },
    /* 点击确认提现 */
    confirmWithdraw() {
      const that = this
      const tip = msg => {
        return that.$dialog({
          title: msg,
          showCancelButton: false,
          confirmButtonText: '确定',
          className: 'dialog',
          closeOnClickOverlay: true
        })
      }
      if (!that.withdrawMoney) {
        tip('请输入提现金额')
      } else {
        if (that.isWithdraw) {
          return
        }
        that.submit()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
  .bgefefef{
    background: #efefef;
  }
  .icon_back2{
    display: block;
    width: 20px;
    height: 35px;
    background: url("../../../static/img/icon_back.png") no-repeat;
    background-size: 20px 35px;
  }
  .userInfo_container {
    position: relative;
    width: 690px;
    height: 200px;
    margin: 39px auto 0;
    .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
    border-radius:10px;
  }
  .money_warp{
    position: absolute;
    top:0;
    width: 690px;
    height: 200px;
    background-image: url("../../../static/img/tixianbg.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .money_btn{
    position: absolute;
    top: 20px;
    right: 19px;
    width: 128px;
    height: 44px;
    text-align: center;
    border-radius: 22px;
    border: 0.01rem solid #ffffff;
  }
  .money_btn >button{
    line-height: 44px;
    font-size: 24px;
    color: #ffffff;
  }

  .money_msg{
    margin-top: 36px;
  }
  .current-income {
    font-size: 30px;
    color: #ffffff;
  }
  .current-income-money {
    color: #ffffff;
    font-size: 60px;
    margin-top: 20px;
  }
  .form_cell .form_cellHd{
    width: 180px;
  }
  .form_title{
    padding-left: 31px;
    line-height: 65px;
  }
  .form_cell .form_cellBd.form_msg{
    padding: 24px 0;
    line-height: 40px;
  }
  .form_cell .form_cellFt{
    align-self: center;
  }

  .withdraw_explain{
    padding: 0 43px 0 33px;
  }
  .explain_title{
    margin-top: 10px;
    line-height: 80px;
  }
  .height90vh{
    height: 90vh;
  }
  /*新ui*/
  .userInfo_withdraw {
    position: absolute;
    top: 24px;
    right: -33px;
    width: 153px;
    height: 54px;
    line-height: 54px;
    background-color: #ffffff;
    box-shadow: 0px 10px 20px 0px rgba(51, 51, 51, 0.1);
    border-radius: 24px 0 0 24px;
    font-size: 24px;
    color: #2e51ff;
    padding-left: 24px;
    box-sizing: border-box;
    span {
      color: #bf9761;
    }
  }
  .form_cells{
    margin: 0 24px;
  }
  .form_cells .form_cell{
    border-bottom: 1px solid #eeeeee;
  }
  .form_cell .form_cellBd {
    border-bottom:none;
  }
  .CashWithdrawal{
    margin: 24px;
    background:rgba(255,255,255,1);
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
    opacity:1;
    border-radius:10px;
  }
  .CashWithdrawal>div:nth-child(1){
    border-bottom: 1px solid #EEEEEE;
  }
  .CashWithdrawal>div{
    width: 100%;
    padding:24px;
    box-sizing: border-box;
  }
  .form_input{
    border: none;
    outline: 0;
    font-size: 28px;
    line-height: 40px;
    background: transparent;
    color: #999999;
  }
  .BankCard{
    margin: 24px;
    background:rgba(255,255,255,1);
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
    opacity:1;
    border-radius:10px;
    padding:24px;
    box-sizing: border-box;
  }
  .mr100{
    margin-right: 100px;
  }
  .BankCardMsg{
    height: 90px;
    line-height: 40px;
  }
  .tip{
    margin: 24px;
    padding:19px 30px 23px 24px;
    box-sizing: border-box;
    background:rgba(238,238,238,1);
    border-radius:10px;
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
  }
  .btn_footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: #bf9761;
    color: #ffffff;
    font-size: 30px;
    line-height: 100px;
    text-align: center;
    &:active {
      opacity: .7;
    }
  }
</style>
