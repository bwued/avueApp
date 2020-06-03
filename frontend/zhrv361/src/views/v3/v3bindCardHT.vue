<template>
  <!-- 汇卡 小额 代还  -->
  <div>
   <top-msg header-name="银行卡签约" />
    <!-- <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/planList')">
      <div class="text">
        银行卡签约
      </div>
    </div> -->
    <div class="con_body" v-if="boxShow">
      <div class="form_cells form_cells_form bgfff">
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">银行卡号</label>
          </div>
          <div class="form_cellBd">
            <span class="size30">{{ creditCardId }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">所属银行</label>
          </div>
          <div class="form_cellBd">
            <span class="size30">{{ cardName }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">CVN2</label>
          </div>
          <div class="form_cellBd">
            <span>{{ CVN2 }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">有效期</label>
          </div>
          <div class="form_cellBd">
            <span class="size30 inline_block w30">{{ validityMonth }}</span>
            <span>月</span>
            <span class="w10 inline_block cen" style="color: #BEBEBE;"> / </span>
            <span class=" size30 inline_block w30">{{ validityYear}}</span>
            <span>年</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">预留手机号</label>
          </div>
          <div class="form_cellBd">
            <span>{{ tel }}</span>
          </div>
        </div>
        <div v-if="false" class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">验证码</label>
          </div>
          <div class="form_cellBd">
            <input v-model="code" class="form_input" type="number" placeholder="请输入验证码" @keyup="()=>{if(code.length>2)code=code.slice(0,6)}">
          </div>
          <div v-if="false" class="form_cellFt">
            <button v-if="!isGetCode" class="btn_getCode" @click="getCodeFun">
              获取验证码
            </button>
            <button v-else class="btn_stay">
              {{ num }}s后重发
            </button>
          </div>
        </div>
      </div>
      <div class="btn_warp">
        <button class="btn btn_add" @click="gotoBindCardHK">
          签 约
        </button>
      </div>
    </div>

    <template v-if="!boxShow">
      <iframe  ref="iframe"  id="bdIframe" scrolling="no" frameborder="no"  style="width: 100%; height: 600px;"  :src="htmlurl" > </iframe>
    </template>

  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import { Picker } from 'vant'
import 'vant/lib/picker/style'
import Vue from 'vue'
import { Toast } from 'vant'
import { Dialog } from 'vant'
import router from '../../router'
// import router from 'router'

Vue.use(Toast)
export default {
  name: 'BindCardHT',
  components: { topMsg, [Picker.name]: Picker },
  props: ['fromIntelligencePage', 'hideBindCard', 'cId', 'cCode'],
  /* data必须是函数*/
  data: function() {
    return {
      boxShow: true,
      // htmlurl:'https://mcashiermd.95516.com/mobile/zh_CN/authPayIndex.action?sign=098a125deea943812d9d85040bb5903b&transNumber=320633b56bfd4a93870b5433ede5115a&internalLogId=AC1019120919153442a50025703017&locale=zh_CN#!cardOpen?r=0.6532483552479222',
      htmlurl: '',
      cardId: this.$util.getQueryVariable('cardId'), // 银行卡id
      channelCode: this.$util.getQueryVariable('code'), // 渠道代码
      creditCardId: '', // 银行卡号
      cardName: '', // 所属银行
      CVN2: '', // CVN2
      validity: '', // 有效期
      validityMonth: '', // 有效期
      validityYear: '', // 有效期
      tel: '', // 预留手机号
      code: '', // 验证码
      isGetCode: false, // 是否有获取验证码 true 已获取
      num: 60, // 验证码num
      timer: '', // setInterval
      bankSelect: {}, // 选择的银行卡
      bankListArr: [], // 银行卡列表
      validityMonthList: [], // 有效期月份选择器
      validityMonthSelect: '', // 有效期月份选择器
      validityYearList: [], // 有效期月份选择器
      validityYearSelect: '', // 有效期月份选择器
      bizOrderNumber: '' // 渠道绑卡订单号
    }
  },
  computed: {
    currentCreditCard() {
      return this.$store.state.currentCreditCard
    },
    settleMsg() {
      return this.$store.state.settleMsg
    },
    orderData() {
      return this.$store.state.orderData
    },
    bankList() {
      return this.$store.state.bankList
    }
  },
  created() {
    if (this.fromIntelligencePage) {
      this.cardId = this.cId
      this.channelCode = this.cCode
    }
    for (let i = 1; i < 13; i++) {
      if (i < 10) {
        this.validityMonthList.push('0' + i)
      } else {
        this.validityMonthList.push(i)
      }
    }
    for (let i = 18; i < 100; i++) {
      this.validityYearList.push('20' + i)
    }
    this.thisTitle()
    this.getBankListFun()
    this.getCreditCardMsg()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '获取验证码'
    },
    /* 获取验证码 渠道绑卡过程，会发送验证码到用户手机*/
    getCodeFun1() {
      const that = this
      if (!that.isGetCode) {
        console.log('获取验证码')
        that.isGetCode = true
        that.timer = setInterval(() => {
          if (that.num !== 0) {
            that.num--
          } else {
            that.isGetCode = false
            that.num = 60
            clearInterval(that.timer)
          }
        }, 1000)
      }
      const data = {
        creditCardId: that.creditCardId,
        tel: that.tel
      }
      that.$api.card.getVerificationCode('CREDIT', data).then(res => {
        console.log('进入渠道绑卡')
        // alert(222222222222)
        that.codeToken = res.data.token
        console.log(res)
        console.log(that.codeToken)
      }).catch(() => {
        that.isGetCode = false
        that.num = 60
        clearInterval(that.timer)
      })
    },

    open(url, title) {
      const that = this
      that.url = url
      that.title = title
      if (url === '#') {
        Dialog({
          title: '提示',
          message: '即将上线，敬请期待！',
          confirmButtonText: '确定'
        })
      } else {
        // that.htmlurl = url
        // that.boxShow = false
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        if (isAndroid) {
          var _url = title + '###' + url + '###http://www.zhsc198.com/'
          baiwangxinxi.OpenWechat(_url) // 安卓微信支付
        }
        if (isiOS) {
          var message = {
            title: title,
            url: url,
            referer: 'http://www.zhsc198.com/'
          }
          window.webkit.messageHandlers.OpenWechat.postMessage(message) // TODO
        }
        
      }
    },
    /* 获取验证码 渠道绑卡过程，会发送验证码到用户手机 -- 汇卡签约*/
    submit() {
      const that = this
      that.$api.card.bindChannelCard('CREDIT', that.cardId, that.channelCode).then(res => {
        console.log(res.data.data.state)
        const url = res.data.data.html
        if (url) {
          // that.$router.push({ path: '/iframe', query: { url: url, title: '签约' }})
          that.open(url, '银行卡签约')
          that.isLoading.clear()
        } else {
          that.$router.go(-1)
          that.isLoading.clear()
        }
      }).catch((error) => {
        console.log(error)
        that.isLoading.clear()
        that.$router.go(-1)
      })
    },
    gotoBindCardHK() {
      const that = this
      that
        .$dialog({
          title: '确定即发起银行卡签约',
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
          that.submit()
        }).catch(() => {
          console.log('cancel')
        })
    },
    /* 获取信用卡信息*/
    getCreditCardMsg() {
     const that = this
      that.$api.card
        .getCredItInfo(that.$util.getQueryVariable('cardId')).then(res => {
				  that.cardName = res.data.data.bank_info.name
				  that.creditCardId = res.data.data.card_no
				  that.CVN2 = res.data.data.lass_three_cvn2
          that.tel = res.data.data.card_phone_number
          //获取有效期
					that.validityMonth = res.data.data.valid_date.substr(0, 2);
					that.validityYear = '20' + res.data.data.valid_date.substr(2);
      
          
        }).catch(err => {
          console.log(err)
          // Toast('获取信用卡信息失败')
        })
     
    },
    // 点击保存确认状态，确定绑卡，绑卡后成功后直接运行进行弹窗
    confirmBindCard() {
      const that = this
      if (!that.code) {
        that.$dialog({
          title: '请输入收到的验证码',
          showCancelButton: false,
          confirmButtonText: '确定',
          className: 'dialog',
          closeOnClickOverlay: true
        })
      } else {
        const data = {
          captcha_code: that.code
        }
        that.isLoading = this.$toast.loading({
          duration: 3000, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: '请稍候...'
        })
        // 保存确认，调用渠道绑卡确认api
        that.$api.card.bindChannelCardConfirm('CREDIT', that.cardId, that.channelCode, that.bizOrderNumber, data).then(res => {
          const state = res.data.data.state
          const errorMsg = res.data.data.errorMsg
          if (state != '000') {
            Toast(errorMsg)
          } else {
            Toast(errorMsg)
            that.hideBindCard()
            that.$emit('toSuccess')
            that.isLoading.clear()
          }
        })
      }
    },
    /* 点击确认，确定绑卡，绑卡后成功后直接运行 支付 函数进行下一步操作，不需要跳回结算页*/
    // async confirmBindCard1() {
    //   const that = this
    //   if (!that.code) {
    //     that.$dialog({
    //       title: '请输入收到的验证码',
    //       showCancelButton: false,
    //       confirmButtonText: '确定',
    //       className: 'dialog',
    //       closeOnClickOverlay: true
    //     })
    //   } else {
    //     const data = {
    //       captcha_code: that.code
    //     }

    //     that.isLoading = this.$toast.loading({
    //       duration: 3000, // 持续展示 toast
    //       forbidClick: true, // 禁用背景点击
    //       loadingType: 'spinner',
    //       message: '请稍候...'
    //     })

    //     await that.$api.card.bindChannelCardConfirm('CREDIT', that.cardId, that.channelCode,that.bizOrderNumber, data)
    //      const state=res.data.data.state
    //     if(state !="000"){
    //          console.log(errorMsg)
    //       }
    //     if (that.fromIntelligencePage) {
    //       that.hideBindCard()
    //       that.$emit('toSuccess')
    //       that.isLoading.clear()
    //     } else {
    //       await that.payFun()
    //     }
    //   }
    // },
    /* 支付*/
    payFun() {
      const that = this
      return that.$api.proceeds.tradePay(that.orderData).then(res => {
        that.isLoading.clear()
        res = res.data
        if (res.code === '200000') {
          if (that.settleMsg.pay_provider_config.param_type === 'INTERNAL_PAGE') {
            // 内部页面 目前先弹框提示
            that.$dialog({
              title: '交易完成',
              showCancelButton: false,
              confirmButtonText: '确定',
              className: 'dialog',
              closeOnClickOverlay: true
            })
          } else if (that.settleMsg.pay_provider_config.param_type === 'EXTERNAL_URL') {
            // 跳转到外部页面
            window.location.href = res.data.url // 跳到支付外链
          }
        }
      }).then(() => {
        that.isLoading.clear()
        that.$router.push('/proceeds')
      }, () => {
        that.isLoading.clear()
        that.$router.push('/proceeds')
      })
    },
    /* 点击确认 关闭状态picker*/
    closeStatusPicker(value) {
      this.bankSelect = value
      this.bankPicker = false
      this.openTouch()
    },
    /* 点击确定 关闭有效期月份picker */
    closeValidityMonth(value) {
      this.validityMonthSelect = value
      this.validityMonthPicker = false
      this.openTouch()
    },
    /* 点击确定 关闭有效期年份picker */
    closeValidityYear(value) {
      this.validityYearSelect = value
      this.validityYearPicker = false
      this.openTouch()
    },
    /* 获取银行列表*/
    getBankListFun() {
      const that = this
      that.$store.dispatch('GetBankList').then(() => {
        for (const i in that.bankList) {
          that.bankListArr.push({
            bankNo: i,
            text: that.bankList[i]
          })
        }
      })
    },
    /* 所选的银行 */
    selectCard(value) {
      this.bankSelect = value
      this.bankPicker = false
    }
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById('bdIframe');
    const deviceWidth = document.documentElement.clientWidth;
    const deviceHeight = document.documentElement.clientHeight;
    // oIframe.style.width = (Number(deviceWidth)-220) + 'px'; //数字是页面布局宽度差值
    oIframe.style.height = Number(deviceHeight)+ 'px'; //数字是页面布局高度差
  }
}
</script>

<style lang="less" scoped>
  //头部返回
  .top {
    display: flex;
    flex-flow: row;
    background: white;
    padding-bottom: 0.8rem;
    // position: fixed;
    width: 100%;
    img {
      width: 1rem;
      height: 1.5rem;
      margin-top: 0.8rem;
      margin-left: 1rem;
    }
    .text {
      color: #000000ff;
      font-size: 1.3rem;
      margin-top: 0.6rem;
      margin-left: 8rem;
    }
  }
  #bdIframe{
    width: 100%;
    height: 100%;
  }
  .form_cellHd{
    width: 223px;
  }
  .btn_getCode,
  .btn_stay{
    padding: 5px 11px;
    font-size: .8rem;
    line-height: normal;
    color: #2E51FF;
    background: transparent;
    border-radius: 15px;
    border: 1px solid #2E51FF;
  }
  // .btn_stay{
  //   padding: 5px 11px;
  //    font-size: .8rem;
  //   line-height: normal;
  //   color: #999999;
  //   background: transparent;
  //   border-radius: 15px;
  //   border: 1px solid #999999;
  // }
  .form_tip{
    padding: 20px 22px 0 22px;
  }
  .btn_add{
    width: 400px;
    height: 74px;
  }

  .delete_warp{
    position: fixed;
    bottom: 55px;
    left: 50%;
    margin-left: -75px;
  }
  .delete_warp >button{
    font-size: 30px;
    color: #ff0000;
  }
  .z_color{
    color: #bf9761;
    margin-right: 1rem;
    font-size: .9rem;
  }
</style>
