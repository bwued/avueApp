<template>
  <div class="mgb100">
    <top-msg header-name="选择银行卡" />
    <div class="con_body">
      <div class="channel-desc">
        <div>
          <div class="channel-desc-head">
            当前通道：
          </div>
          <div class="channel-desc-bottom">
            {{ channelName }}
          </div>
        </div>
        <div>
          <div class="channel-desc-head">
            手续费 (元) ：￥{{ (wrapTotalAmount - wrapPaybackAmount - computeFee).toFixed(2) }}
          </div>
          <div class="channel-desc-bottom">
            结算费 (元/笔) ：￥{{ computeFee }}
          </div>
        </div>
      </div>
      <div class="tongdaobg">
        <div class="flex-vertical-centering tongdao">
          <div class="pay-money-title">
            付款金额 (元)
          </div>
          <p class="colorfff">
            {{ wrapTotalAmount }}
          </p>
          <i class="iconfont icon-xia xia" />
          <div class="pay-money-title">
            实际到账金额 (元)
          </div>
          <p class="colorfff">
            {{ wrapPaybackAmount }}
          </p>
        </div>
      </div>
      <!--  -->
      <div class="select_content">
        <div class="select_make">
          <div v-if="chooseCity" class="form_cellBd clear" @click="areaPicker = true">
            <span class="select-city-label">选择交易城市</span>
            <span class="color999 rt size30">
              {{ cityVal.name }}
              <van-icon class="size24" name="arrow" />
            </span>
          </div>
          <div
            v-if="industryList&&industryList!=''"
            class="form_cellBd clear"
            @click="industryPicker = true"
          >
            <span class="select-industry-label">选择行业</span>
            <span class="color999 rt size30">
              {{ industryName }}
              <van-icon name="arrow" />
            </span>
          </div>
        </div>
        <div class="select_warp">
          <div class="select_title flex_sb">
            <div class="w100 flex-row-between">
              <span class="select-card">请选择信用卡</span>
              <span class="size28 maincolor" @click="gotoChangeCard('creditCard',creditCardMsg.id)">更换</span>
            </div>
          </div>
          <div v-if="creditCardMsgAdd" class="card_add">
            <router-link :to="{path:'/addCreditCard',query:{status: 'add'}}" class="btn2 flex-vertical-centering">
              <div class="flex-row-center">
                <img src="../../../static/img/gouwuche_jia_o.png" class="add-card-img">
                <span class="add-card-center-content">添加信用卡</span>
              </div>
            </router-link>
          </div>
          <div class="card_warp">
            <div
              v-if="!creditCardMsgAdd"
              class="select_card flex flex_alCen"
            >
              <div class="card_logo w25">
                <img
                  v-if="creditCardMsg.bank_info.bank_logo_image"
                  :src="creditCardMsg.bank_info.bank_logo_image.url"
                >
              </div>
              <div v-if="creditCardMsg" class="w75 lineheight70">
                <h5 class="colorfff size30">
                  {{ creditCardMsg.bank_info.name }}
                </h5>
                <p
                  class="colorfff size36"
                >
                  {{ '**** **** *** ' + creditCardMsg.card_info.card_no.substr(creditCardMsg.card_info.card_no.length-4) }}
                </p>
              </div>
              <div class="z_check">
                <p>账单日：{{ creditCardMsg.card_info.bill_date }}号</p>
                <p>到期日：{{ creditCardMsg.card_info.repayment_date }}号</p>
              </div>
            </div>
          </div>
        </div>
        <div class="select_warp">
          <div class="select_title flex_sb">
            <div class="w100 flex-row-between">
              <span class="select-card">请选择储蓄卡</span>
              <span class="size28 maincolor" @click="gotoChangeCard('cashCard',debitCardMsg.id)">更换</span>
            </div>
          </div>
          <div v-if="debitCardMsgAdd" class="card_add">
            <router-link :to="{path:'/addCard',query:{status: 'add'}}" class="btn2 flex-vertical-centering">
              <div class="flex-row-center">
                <img src="../../../static/img/gouwuche_jia_o.png" class="add-card-img">
                <span class="add-card-center-content">添加储蓄卡</span>
              </div>
            </router-link>
          </div>
          <div class="card_warp">
            <div
              v-if="!debitCardMsgAdd"
              class="select_card2 flex flex_alCen"
            >
              <div class="card_logo w25">
                <img
                  v-if="debitCardMsg.bank_info.bank_logo_image"
                  :src="debitCardMsg.bank_info.bank_logo_image.url"
                >
              </div>
              <div v-if="debitCardMsg" class="w75 lineheight70">
                <h5 class="colorfff size30">
                  {{ debitCardMsg.bank_info.name }}
                </h5>
                <p
                  class="colorfff size36"
                >
                  {{ '**** **** *** ' + debitCardMsg.card_info.card_no.substr(debitCardMsg.card_info.card_no.length-4) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isSubmit" class="btn_warp" @click="payFun">
      确定
    </div>
    <div v-if="isSubmit" class="btn_warp">
      已提交
    </div>

    <van-popup v-model="areaPicker" position="bottom">
      <!-- <van-area :area-list="areaList" :columns-num="2" @confirm="onAddrConfirm" @cancel="onAddrCancel" /> -->
      <area-search-picker class="select_city" @selectArea="selectArea" />
    </van-popup>
    <van-popup v-model="industryPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="industryList"
        @cancel="channelCodeCancel"
        @confirm="channelCodeConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import areaList from '../../assets/area.js'
import AreaSearchPicker from '@/components/AreaSearchPicker'
import { Toast } from 'vant'
export default {
  name: 'SelectCard',
  components: { topMsg, AreaSearchPicker },
  /* data必须是函数*/
  data: function() {
    return {
      channelCode: this.$util.getQueryVariable('code'), // 通道代码
      totalAmount: this.$util.getQueryVariable('amount') * 100, // 用户输入总金额
      channelName: decodeURIComponent(
        this.$util.getQueryVariable('channelName')
      ), // 通道名
      debitCardMsg: '', // 储蓄卡
      debitCardMsgList: '', // 储蓄卡
      debitCardMsgAdd: true, // 无储蓄卡的时候 true 表示显示 添加
      creditCardMsg: '', // 信用卡
      creditCardMsgList: '', // 信用卡
      creditCardMsgAdd: true, // 无信用卡的时候 添加
      isLoading: '', // 加载loading
      isSubmit: false, // 是否已经提交
      areaList: '',
      cityVal: '',
      areaPicker: false,
      cardType1: 'DEBIT', // cardType 银行卡类型  ：CREDIT 信用卡  DEBIT 储蓄卡
      cardId1: '', // 卡id
      cardType1: 'DEBIT',
      industryList: [
        { text: '杭州', texts: '杭州' },
        { texts: '杭州', text: '宁波' },
        { texts: '杭州', text: '温州' }
      ],
      industryPicker: false,
      industryVal: '',
      industryName: '',

      chooseCity: true
    }
  },
  computed: {
    currentDebitCard() {
      return this.$store.state.currentDebitCard
    },
    currentCreditCard() {
      return this.$store.state.currentCreditCard
    },
    computeRate() {
      return (this.settleMsg.rate * 100).toFixed(2)
    },
    computeFee() {
      return (this.settleMsg.fee / 100).toFixed(2)
    },
    settleMsg() {
      return this.$store.state.settleMsg
    },
    wrapTotalAmount() {
      return (this.settleMsg.total_amount / 100).toFixed(2)
    },
    wrapPaybackAmount() {
      return (this.settleMsg.payback_amount / 100).toFixed(2)
    },
    cityRecord: {
      get: function() {
        return JSON.parse(localStorage.getItem('selectCardArea'))
      },
      set: function(val) {
        localStorage.setItem('selectCardArea', JSON.stringify(val))
      }
    }
  },
  watch: {
    creditCardMsg: {
      handler(newVal, oldVal) {},
      deep: true
    }
  },
  created() {
    this.init()
    this.thisTitle()
    this.getIndustryListFun()
    if (!this.settleMsg) {
      this.isLoading = this.$toast('请重新下单')
      this.$router.push('/proceeds')
    }

    /* 如果之前有选择过银行卡的，默认先显示之前选择的银行卡 储蓄卡*/
    if (this.currentDebitCard) {
      console.log('如果之前有选择过银行卡的，默认先显示之前选择的银行卡 储蓄卡')
      console.log(this.currentDebitCard)
      this.cardId1 = this.currentDebitCard.id
      console.log(this.cardId1)
      this.debitCardMsg = this.currentDebitCard
      this.debitCardMsgAdd = false
    } else {
      this.getCardListFun()
    }
    /* 如果之前有选择过银行卡的，默认先显示之前选择的银行卡 信用卡*/
    if (this.currentCreditCard) {
      console.log('如果之前有选择过银行卡的，默认先显示之前选择的银行卡 信用卡')
      console.log(this.currentCreditCard)
      this.creditCardMsg = this.currentCreditCard
      this.creditCardMsgAdd = false
    } else {
      this.getCreditCardListFun()
    }
    /* 如果之前有选择过地址的，默认先显示之前选择的地址*/
    if (this.cityRecord) {
      this.cityVal = this.cityRecord
    }
    /* 判断通道是否能选择地址*/
    this.chooseCity = this.$store.state.chooseCity
  },
  methods: {
    /* 所选的地区 */
    selectArea(value) {
      this.cityVal = value
      this.cityRecord = value
      this.areaPicker = false
    },
    channelCodeConfirm(value, index) {
      var that = this
      that.industryVal = that.industryList[index].channel_industry_id
      that.industryName = value.name
      this.industryPicker = false
    },
    channelCodeCancel() {
      this.industryPicker = false
    },
    // 改变行业
    channelCodeChange(picker, value, index) {
      var that = this
      that.industryVal = that.industryList[index].channel_industry_id
      that.industryName = value.name
    },
    onAddrConfirm(val) {
      // 确定选择
      console.log(val)
      this.areaPicker = false
      this.cityVal = val[0].name + ' ' + val[1].name
      console.log(this.cityVal)
    },
    onAddrCancel() {
      // 取消选择
      this.areaPicker = false
    },
    init() {
      // 初始化地址选择器
      this.areaList = areaList // 初始化选择器数据
    },
    /* 设置标题*/
    thisTitle: function() {
      document.title = '选择银行卡'
    },
    /* 更换银行卡*/
    gotoChangeCard(type, id) {
      this.$router.push({ path: '/changeCard', query: { type: type, id: id }})
    },
    /* 获取行业列表*/
    getIndustryListFun() {
      const that = this
      that.$api.proceeds
        .getIndustryList({ channelCode: that.channelCode })
        .then(res => {
          res.data.data.forEach(function(element, index) {
            element.text = element.name
          })
          that.industryList = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    /* 获取储蓄卡银行卡列表*/
    getCardListFun() {
      const that = this
      that.$api.card.getCardList('DEBIT').then(res => {
        console.log(res)
        that.debitCardMsgList = res.data.data
        if (that.debitCardMsgList.length !== 0) {
          that.debitCardMsgAdd = false
          that.debitCardMsg = that.debitCardMsgList[0]
          that.$store.commit('SET_CURRENT_DEBIT_CARD', that.debitCardMsg)
        } else {
          that.debitCardMsgAdd = true
        }
      })
    },
    /* 获取信用卡银行卡列表*/
    getCreditCardListFun() {
      const that = this
      that.$api.card
        .getCardList('CREDIT')
        .then(res => {
          that.creditCardMsgList = res.data.data
          if (that.creditCardMsgList.length !== 0) {
            that.creditCardMsgAdd = false
            that.creditCardMsg = that.creditCardMsgList[0]
            that.$store.commit('SET_CURRENT_CREDIT_CARD', that.creditCardMsg)
          } else {
            that.creditCardMsgAdd = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    /* 支付*/
    payFun() {
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
      if (!that.creditCardMsg.id) {
        tip('请先添加信用卡！')
      } else if (!that.debitCardMsg.id) {
        tip('请先添加储蓄卡！')
      } else if (that.chooseCity && !that.cityVal.code) {
        tip('请先选择交易城市！')
      } else {
        const orderData = {
          channel_code: that.channelCode,
          deposit_bank_id: that.creditCardMsg.id,
          payback_bank_id: that.debitCardMsg.id,
          total_amount: that.totalAmount,
          industry_id: that.industryVal,
          settlement_id: that.settleMsg.settlement_id
        }

        // 不用选择城市时不传对应的城市编码给后端
        if (that.chooseCity) {
          orderData.city_code = that.cityVal.code
        }

        // 保存订单数据
        that.$store.commit('SET_ORDER_DATA', orderData)

        that
          .$dialog({
            title: '确认即发起交易',  // todo 套现询问
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            className: 'dialog',
            closeOnClickOverlay: true
          })
          .then(() => {
            that.isLoading = this.$toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              loadingType: 'spinner',
              message: '请稍候...'
            })
            // that.registjudge(that.channelCode) // 注册渠道信息判断

            setTimeout(function() {
              that.registjudge(that.channelCode) // 注册渠道信息判断
            },600)
            // that.checkCard(that.channelCode,that.creditCardMsg.id,'CREDIT')
            // that.payment()
          }).catch(() => {
            console.log('cancel')
          })
      }
    },

    // 注册渠道信息判断
    registjudge(channelCode) {
      const that = this
      that.$api.card.registjudge(channelCode).then(res => {
        console.log(res.data.data.state)
        const state = res.data.data.state
        if (state != 4) { //   3.未注册 4.已注册
          //  console.log('为44444444判断签约')
          //  that.regchannel(that.cardType1,that.cardId1,that.channelCode)   //调用注册接口
          that.$api.card.regchannel(that.cardType1, that.cardId1, that.channelCode).then(res => {
          //  console.log(res.data.data.isSign)
          // console.log(res.data.data.state)
            var isSign = res.data.data.isSign
            var state = res.data.data.state

            if (isSign == 't' && state == '000') {
              console.log('签约')
              that.checkCard(that.channelCode, that.creditCardMsg.id, 'CREDIT') // 判断签约
            }
          }).catch(error => {
            console.log(error)
            Toast('储蓄卡注册失败')
          })
        } else {
          // console.log('为44444444判断签约')
          that.checkCard(that.channelCode, that.creditCardMsg.id, 'CREDIT')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 注册渠道接口
    //   regchannel(channelCode, cardId, cardType){
    //     const that = this
    //       that.$api.card
    //     .regchannel(channelCode, cardId, cardType).then(res =>{
    //        console.log(res)

    //   }).catch(err =>{
    //      console.log(err)
    //   })
    // },

    // TODO 检测用户该通道是否已绑卡 hgwn 1008
    checkCard(channelCode, cardId, cardType) {
      const that = this
//      Toast.clear()
      //        that.$router.push({ path: '/bindCard', query: { channelCode: channelCode, cardId:cardId, cardType: 'CREDIT' }})
      that.$api.card
        .bbbindChannelCardtx(channelCode, cardId, cardType).then(res => {
          console.log('查询渠道绑卡状态成功')
          console.log(res.data.data.data.signature)
          const signature = res.data.data.data.signature
          const signType = res.data.data.data.signType
          if (signature !== 2) { //   1.未签约 2.已签约
            //                this.isbindCard=true
            //                that.$dialog({
            //                    title: "信用卡在该通道未绑定",
            //                    showCancelButton: false,
            //                    confirmButtonText: '确定',
            //                    className: 'dialog',
            //                    closeOnClickOverlay: true
            //                })

            that.$api.card.bindChannelCard('DEBIT', that.debitCardMsg.id, channelCode).then(res => {
                Toast.clear()

              const state = res.data.data.state
              const platformType = res.data.data.platformType || '' // TODO 定义 四方h5 标
              const isSign = res.data.data.isSign  // TODO 定义  isSign=t
              const _url = res.data.data.html  // TODO
                console.warn('platformType TODO 定义 四方h5 标:::'+ platformType)
                console.log(res.data.data.state)
              //                    const errorMsg=res.data.data.errorMsg
              if (state != '000') {
                Toast('储蓄卡在该通道无效，请重新选择或新增！')
              } else {

//                    const  _url = 'http://111.230.139.80/tanpay/agreementPage?reqstr=eydwMV9NZXJJZCc6JzIyJywncDJfT3JkZXJObyc6J2NiOWM4ODNkMmFmNDQ1NzM4YTBiYTkxNmRlMmM3NzI3JywncDNfSG1hYyc6J2MyZThmZWVlMmIxYzk3MmQzYzg0YmNhMTg0MjBiMDQwJ30='
                 if(platformType === 'sf'){

                     // isSign=t

                    if(isSign === 't'){
//                        this.getSettle()
                        that.payment() // 下单接口
                        return false
                    }
                    // TODO 定义 四方h5 储蓄卡绑卡签约 -啊兵 20200303
                     window.location.href =  _url
//                     this.$router.push({ path: '/iframetx', query: { title: '储蓄卡绑卡签约', url: _url }})
                     return false
                 }


            // TODO 套现TX 汇卡支付 --签约H5
                that.$router.push({ path: '/bindCardT', query: { channelCode: channelCode, cardId: cardId, cardType: 'CREDIT' }})



              }
            }).catch(() => {
                Toast.clear()

            })
          } else {
            // this.showConfirmBill = true



              if(signType == 4){ // if(signature == 2  & signType == 4) ==>套现验证码，
                  that.$router.push({ path: '/bindCardTX', query: { channelCode: channelCode, cardId: cardId, cardType: 'CREDIT' }})
              }else {
                  that.payment()
              }
          }
        }).catch(err => {
          console.log(err)
          this.$toast.fail('服务异常')
        })
    },
    openFrame() {
      api.openFrame({
        name: 'externalSecondUrlFrame',
        url: 'http://www.baidu.com',
        bgColor: '#fff',
        rect: {
          x: 0,
          y: 42,
          w: api.winWidth,
          h: api.winHeight - 42
        },
        animation: {
          type: 'none'

        }
      })
    },
    /* 判断渠道是否需要绑卡的情况 return false不需要 true需要*/
    judgeBindCard() {
      const that = this
      if (that.settleMsg.pay_provider_config.card_binding_type === 'NONE') {
        return false
      } else if (
        that.settleMsg.pay_provider_config.card_binding_type === 'INTERNAL_PAGE'
      ) {
        if (!that.demandChannelCardFun()) {
          that.$router.push({
            path: '/bindCard',
            query: {
              cardId: that.creditCardMsg.id,
              channelCode: that.channelCode
            }
          })
        } else {
          return false
        }
      } else if (
        that.settleMsg.pay_provider_config.card_binding_type === 'EXTERNAL_URL'
      ) {
        return true
      }
    },
    /* 获取渠道绑卡信息 查看该信用卡是否有在渠道绑卡*/
    demandChannelCardFun() {
      const that = this
      that.$api.card
        .demandChannelCard('CREDIT', that.creditCardMsg.id, that.channelCode)
        .then(res => {
          return !!res.data.data.has_succeeded
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
<style>
.mint-indexlist-navitem {
  padding: 0.02rem 0.11rem 0.02rem 65%;
}
</style>

<style lang="less" scoped>
*{
  color: #fff;
}
.select_make {
  line-height: 88px;
}
.select_make .form_cellBd {
  border-bottom: 0.01rem solid #eeeeee;
  padding: 0 24px;
}
.select_make .form_cellBd i {
  font-size: 36px;
  vertical-align: -10px;
  margin-left: 12px;
  color: @lightGrey;
}
.card_add {
  padding: 32px 23px;
  box-sizing: border-box;
}

.btn2 {
  /* display: block; */
  width: 100%;
  height: 200px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid #BF9761;
  border-radius: 15px;
  line-height: 200px;
  font-size: 36px;
  color: #999999;
}

.add_img {
  width: 36px;
  height: 36px;
  margin-right: 6px;
}

.channel_warp {
  position: relative;
  padding: 27px;
  background: #535353;
}

.channel_title {
  position: absolute;
  top: 27px;
  left: 27px;
  font-size: 24px;
  color: #ffffff;
  opacity: 0.8;
}

.channel_fee {
  position: absolute;
  top: 37px;
  right: 27px;
  font-size: 20px;
  color: #ffffff;
  opacity: 0.8;
}

.channel_money {
  text-align: center;
}

.channel_money:first-child {
  margin-top: 30px;
}

.channel_money:last-child {
  margin-bottom: 10px;
}

.channel_money > p {
  font-size: 72px;
}

.channel_money > h5 {
  color: #fff5f6;
  opacity: 0.8;
}

.channel_arrows {
  margin-bottom: 20px;
  text-align: center;
  font-size: 36px;
  color: #ffffff;
  opacity: 0.5;
}

.select_title {
  padding: 0 24px;
  line-height: 84px;
}

.select_card {
  width: 702px;
  height: 200px;
  margin: 0 auto;
  background:@mainColorB;
  background-image: url("../../../static/img/wodebg.png");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 15px;
  position: relative;
}

.select_card2 {
  width: 702px;
  height: 200px;
  margin: 0 auto;
  background-image: url("../../../static/img/wodebg.png"),linear-gradient(270deg,rgba(222,170,89,1) 0%,rgba(246,197,126,1) 100%);;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 15px;
}

.card_logo {
  text-align: center;
}

.card_logo > img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
}

.lineheight70 {
  line-height: 70px;
}

.select_warp {
  margin-top: 5px;
}

.btn_warp {
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

.mgb100 {
  margin-bottom: 100px;
}

.card_add {
  font-size: 60px;
  text-align: center;
  color: #2e51ff;
  opacity: 0.8;
}

.btn-unClick {
  background-image: linear-gradient(-90deg, #999999 0%, #999999 100%);
}
/* ui调整 */
.con_body{
  position: relative;
}
.header{
  z-index: 100;
  position: relative;
}
.tongdaobg{
  margin: 0 30px 25px 30px;
  height: 300px;
  background-image: linear-gradient(to right, #D4B988, #8A6333);
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  box-shadow:0px 10px 20px rgba(14,66,128,0.08);
  border-radius:10px;
}
.tongdao{
  padding-top: 34px;
}
.tongdao>span{
  font-size: 24px;
  color: #FFF5F6;
  margin-top: 5px;
}
.tongdao>p{
  font-size: 60px;
  color: #FFFFFF;
  line-height: 70px;
  margin-top: 5px;
}
.xia{
  /* width:18px;
  height: 32px; */
  font-size: 30px;
  margin-top: 5px;
  color: #FFCF81;
}
.select_content{
  background-color: white;
  margin: 0 30px;
}
.channel-desc {
  background-color: #ffffff;
  padding: 26px 30px;
  display: flex;
  justify-content: space-between;
}
.channel-desc-head,
.channel-desc-bottom {
  color: #666666;
  line-height: 30px;
  height: 30px;
  font-size: 24px;
}
.pay-money-title {
  color: #FFCF81;
  font-size: 24px;
  text-align: center;
  height: 33px;
  line-height: 33px;
}
.select-city-label,
.select-industry-label,
.select-card {
  font-size: 28px;
  color: #666666;
}
.add-card-center-content {
  color: #BF9761;
  font-size: 30px;
  line-height: 42px;
  height: 42px;
  display: inline-block;
}
.add-card-img {
  width: 36px;
  height: 36px;
  margin: 0 6px 0 0;
}
 .z_check{
     position:absolute;
    left: 16rem;
    top: 2.5rem;
    p{
      font-size:.8rem;
      color: white;
      height: 1.3rem;
      line-height: 1.3rem;
    }
  }
</style>
