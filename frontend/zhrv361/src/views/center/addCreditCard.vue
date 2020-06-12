<template>
  <div>
    <top-msg v-if="status === 'add' || fromSelectCardPage" header-name="添加信用卡" />
    <top-msg v-if="status === 'edit'" header-name="编辑信用卡" />
    <div class="con_body">
      <div class="form_cells form_cells_form bgfff">
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">银行卡号</label>
          </div>
          <div class="form_cellBd">
            <fun-components-input v-if="auth" v-model="creditCardNoShow" :disabled="true" :num-type="'cardNo'" :placeholder="'请输入信用卡号'" @onRawValue="(rawValue) => {creditCardNo = rawValue}" />
            <fun-components-input v-else v-model="creditCardNoShow" :disabled="false" :num-type="'cardNo'" :placeholder="'请输入信用卡号'" @onRawValue="(rawValue) => {creditCardNo = rawValue}" />
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">所属银行</label>
          </div>
          <div class="form_cellBd" @click="auth?'':bankPicker = true">
            <span v-if="!bankSelect.name" class="size30" style="color: #BEBEBE;">请选择所属银行</span>
            <span v-else class="size30">{{ bankSelect.name }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">卡额度</label>
          </div>
          <div class="form_cellBd">
            <input v-model="credit_amount" class="form_input" type="number" placeholder="请输入信用卡额度">
          </div>
        </div>
        <!--目前下面两个cell 先不显示 -->
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">CVN2</label>
          </div>
          <div class="form_cellBd">
            <input v-if="auth" v-model="CVN2" class="form_input" disabled placeholder="信用卡背后三位数字">
            <input v-else v-model="CVN2" class="form_input" type="number" placeholder="信用卡背后三位数字">
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">有效期</label>
          </div>
          <div class="form_cellBd">
            <input
              v-if="auth"
              v-model="validityMonthSelect"
              :class=" validityMonthSelect ? 'form_input form_input-small2 size30 inline_block' : 'form_input form_input-small size30 inline_block'"
              placeholder="请输入月份"
              disabled
            >
            <input
              v-else
              v-model="validityMonthSelect"
              :class=" validityMonthSelect ? 'form_input form_input-small2 size30 inline_block' : 'form_input form_input-small size30 inline_block'"
              type="number"
              placeholder="请输入月份"
            >
            <span v-if="validityMonthSelect">月</span>
            <span class="w10 inline_block cen" style="color: #BEBEBE;"> / </span>
            <input
              v-if="auth"
              v-model="validityYearSelect"
              :class=" validityYearSelect ? 'form_input form_input-small2 size30 inline_block' : 'form_input form_input-small size30 inline_block'"
              placeholder="请输入年份"
              disabled
            >
            <input
              v-else
              v-model="validityYearSelect"
              :class=" validityYearSelect ? 'form_input form_input-small2 size30 inline_block' : 'form_input form_input-small size30 inline_block'"
              type="number"
              placeholder="请输入年份"
            >
            <span v-if="validityYearSelect">年</span>
          </div>
        </div>
        <!-- fromSelectCardPage -->
        <!-- <template v-if="fromSelectCardPage"> -->
        <template>
          <div class="form_cell clear" @click="showDatetimePicker=true;isUse=true">
            <div class="form_cellHd">
              <label class="form_label">账单日</label>
            </div>
            <div class="form_cellBd">
              <input v-if="!useDateList.selectedDate" class="form_input" type="number" placeholder="请设置账单日">
              <span v-if="useDateList.selectedDate" class="form_input">{{ useDateList.selectedDate }}</span>
            </div>
            <van-icon name="arrow" class="rt" />
          </div>
          <div class="form_cell clear" @click="showDatetimePicker=true;isUse=false">
            <div class="form_cellHd">
              <label class="form_label">到期日</label>
            </div>
            <div class="form_cellBd">
              <input v-if="!repayDateList.selectedDate" class="form_input" type="number" placeholder="请设置到期日">
              <span v-if="repayDateList.selectedDate" class="form_input">{{ repayDateList.selectedDate }}</span>
            </div>
            <van-icon name="arrow" class="rt" />
          </div>
          <!-- Picker -->
          <van-popup v-model="showDatetimePicker" class="picker-box" position="bottom" :overlay="true">
            <van-picker show-toolbar :title="isUse?'请设置账单日':'请选择到期日期'" :columns="columns" @confirm="confirmFun" @cancel="cancelFun" />
          </van-popup>
        </template>
        <!-- end -->
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">预留手机号</label>
          </div>
          <div class="form_cellBd">
            <input v-if="auth" v-model="tel" class="form_input" type="number" placeholder="请输入预留手机号" disabled>
            <input v-else v-model="tel" class="form_input" type="number" placeholder="请输入预留手机号">
          </div>
        </div>
        <!-- <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">验证码</label>
          </div>
          <div class="form_cellBd">
            <input v-model="sms_code" class="form_input" type="number" placeholder="请输入验证码">
          </div>
          <div class="form_cellFt">
            <button v-if="!isGetCode" class="btn_getCode" @click="getCodeFun">
              获取验证码
            </button>
            <button v-else class="btn_stay">
              {{ num }}s后重发
            </button>
          </div>
        </div> -->
      </div>
      <!-- <div class="form_tip"><p class="size26 color999">验证码将发到预留手机号中</p></div> -->
      <div v-if="status === 'add' || fromSelectCardPage" :class="[fromSelectCardPage?'btn-add bottom-btn':'btn_warp']">
        <button class="btn btn_add" @click="addCreditCardFun">
          {{ fromSelectCardPage?'确认添加':'保  存' }}
        </button>
      </div>
      <div v-else-if="status === 'edit'" class="btn_warp">
        <button class="btn btn_add" @click="editCardFUn">
          保  存
        </button>
      </div>
    </div>

    <!--点击 状态 弹出picker（银行卡选择器） start-->
    <van-popup v-model="bankPicker" position="bottom">
      <choose-card @selectCard="selectCard" />
    </van-popup>
    <!--点击 状态 弹出picker（银行卡选择器） end-->
    <div v-if="bgShow" style="width:100%; height:100%; position:fixed; top:0; left:0; bottom:0; background:#000; opacity: 0.5;" />
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import { Picker } from 'vant'
import 'vant/lib/picker/style'
import chooseCard from '@/components/chooseCard'
import FunComponentsInput from '@/components/FunComponentsInput'
import { DatetimePicker } from 'vant'
/* import { Picker } from 'mint-ui'
import 'mint-ui/lib/picker/style.css'*/

export default {
  name: 'AddCreditCard',
  components: { topMsg, [Picker.name]: Picker, chooseCard, [DatetimePicker.name]: DatetimePicker, FunComponentsInput },
  props: ['fromSelectCardPage', 'hideAddCard'],
  /* data必须是函数*/
  data: function() {
    return {
      // DatetimePicker
      bgShow: false,
      columns: [],
      isUse: true,
      minDate: new Date(),
      currentDate: new Date(),
      showDatetimePicker: false,
      useDateList: {
        num: '1',
        selectedDate: '每月1号'
      },
      repayDateList: {
        num: '31',
        selectedDate: '每月31号'
      },
      // DatetimePicker
      status: this.$util.getQueryVariable('status'), // 银行卡的状态
      cardUser: '', // 持卡人
      creditCardNo: '', // 银行卡号
      creditCardNoShow: '', // 银行卡四位一空显示
      cardName: '', // 所属银行
      CVN2: '', // CVN2
      validity: '', // 有效期
      tel: '', // 预留手机号
      credit_amount: '', // 信用卡额度
      sms_code: '', // 验证码
      isGetCode: false, // 是否有获取验证码 true 已获取
      num: 60, // 验证码num
      timer: '', // setInterval
      cardId: this.$util.getQueryVariable('cardId'), // 当前信用卡id
      bankSelect: {}, // 选择的银行卡
      bankPicker: false, // 银行卡列表选择器
      bankListArr: [], // 银行卡列表
      validityMonthPicker: false, // 有效期月份选择器
      validityMonthList: [], // 有效期月份选择器
      validityMonthSelect: '', // 有效期月份选择器
      validityYearPicker: false, // 有效期年份选择器
      validityYearList: [], // 有效期月份选择器
      validityYearSelect: '', // 有效期月份选择器
      /* ---------监听函数--------------*/
      handler: function(e) { e.preventDefault() },
      auth: false
    }
  },
  computed: {
    bankList() {
      return this.$store.state.bankList
    }
  },
  watch: {
    CVN2() {
      if (this.CVN2.length > 3) {
        this.CVN2 = this.CVN2.substr(0, 3)
      }
    },
    validityMonthSelect() {
      if (this.validityMonthSelect.length > 2) {
        this.validityMonthSelect = this.validityMonthSelect.substr(0, 2)
      }
    },
    validityYearSelect() {
      if (this.validityYearSelect.length > 2) {
        this.validityYearSelect = this.validityYearSelect.substr(0, 2)
      }
    },
    tel() {
      if (this.tel.length > 11) {
        this.tel = this.tel.substr(0, 11)
      }
    }
  },
  created() {
    this.thisTitle()
    this.getBankListFun()
    for (let i = 1; i < 13; i++) {
      if (i < 10) {
        this.validityMonthList.push('0' + i)
      } else {
        this.validityMonthList.push(i)
      }
    }
    for (let i = 18; i < 100; i++) {
      this.validityYearList.push(i)
    }
    // 组装columns
    for (let i = 0; i < 31; i++) {
      this.columns.push('每月' + (i + 1) + '号')
    }
    if (this.status === 'edit') {
      this.getCardMsg()
    }
    if (this.$route.query.auth) {
      this.auth = this.$route.query.auth
      this.validityMonthSelect = '**'
      this.validityYearSelect = '**'
    }
  },
  methods: {
    // DatetimePicker
    confirmFun(value, index) {
      this.showDatetimePicker = false
      // console.log(value, index)
      const dateList = {}
      dateList.num = index + 1
      dateList.selectedDate = value
      if (this.isUse) Object.assign(this.useDateList, dateList)
      else Object.assign(this.repayDateList, dateList)
    },
    cancelFun() {
      this.showDatetimePicker = false
    },
    // DatetimePicker end
    /* 设置标题*/
    thisTitle: function() {
      if (this.status === 'add') {
        document.title = '添加信用卡'
      } else {
        document.title = this.fromSelectCardPage ? '添加信用卡' : '编辑信用卡'
      }
    },
    /* 获取验证码*/
    getCodeFun() {
      const that = this
      const tip = (msg) => {
        return that.$dialog({
          title: msg,
          showCancelButton: false,
          confirmButtonText: '确定',
          cancelButtonText: '确定',
          className: 'dialog',
          closeOnClickOverlay: true
        })
      }
      if (!that.cardUser) {
        tip('请输入持卡人姓名')
      } else if (!that.creditCardNo) {
        tip('请输入您的信用卡号')
      } else if (!that.tel) {
        tip('请输入您的手机号码')
      } else if (!that.$util.isPhone(that.tel)) {
        tip('请输入正确的手机号码')
      } else {
        const data = {
          bank_card_account_name: that.cardUser,
          card_no: that.creditCardNo,
          card_phone_number: that.tel
        }
        if (!that.isGetCode) {
          that.isGetCode = true
          that.$api.card.getVerificationCode('CREDIT', data).then(res => {
            console.log(res)
            that.$toast({
              message: '短信发送成功',
              position: 'middle'
            })
          })
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
      }
    },
    /* 新增信用卡*/
    addCreditCardFun() {
      const that = this
      const tip = (msg) => {
        return that.$dialog({
          title: msg,
          showCancelButton: false,
          confirmButtonText: '确定',
          className: 'dialog',
          closeOnClickOverlay: true
        })
      }
      const rxp = /^(1[0-2]|[1-9]|0[1-9])$/
      const rxp2 = /^(19|[2-9][0-9])$/
      if (!that.creditCardNo) {
        tip('请输入您的信用卡号')
      } else if (that.creditCardNo.length > 19) {
        tip('输入信用卡号长度过长')
      } else if (!that.bankSelect) {
        tip('请选择所属银行')
      } else if (!that.tel) {
        tip('请输入预留手机号码')
      } else if (!that.$util.isPhone(that.tel)) {
        tip('请输入正确的手机号码')
      } else if (!that.CVN2 || that.CVN2.length !== 3) {
        tip('请输入信用卡背后三位数字')
      } else if (!that.validityMonthSelect && !that.validityYearSelect) {
        tip('请输入有效期')
      } else if (!rxp.test(that.validityMonthSelect)) {
        tip('请输入正确的有效期月份（01-12）')
      } else if (!rxp2.test(that.validityYearSelect)) {
        tip('请输入正确的有效期年份（输入年份后两位）')
      } else if (!that.useDateList.num) {
        tip('请设置账单日') // 计划订单才需要
      } else if (!that.repayDateList.num) {
        tip('请设置到期日') // 计划订单才需要
      } else if (Math.abs(parseInt(that.useDateList.num) - parseInt(that.repayDateList.num)) < 2) {
        tip('账单日和到期日间隔必须大于等于一天')
      } else {
        if (that.validityMonthSelect < 10 && String(that.validityMonthSelect).length < 2) {
          that.validityMonthSelect = 0 + '' + that.validityMonthSelect
        }
        const data = {
          bank_no: that.bankSelect.bank_no,
          card_no: that.creditCardNo,
          card_phone_number: that.tel,
          lass_three_cvn2: that.CVN2,
          valid_date: (that.validityMonthSelect + '').concat(that.validityYearSelect),
          bill_date: that.useDateList.num,
          repayment_date: that.repayDateList.num,
          credit_amount: that.credit_amount
        }
        that.bgShow = true
        that.$api.card.bindCard('CREDIT', data).then(res => {
          if (this.fromSelectCardPage) {
            this.hideAddCard()
            this.$emit('toReflesh')
          } else {
            tip('添加信用卡成功').then(res => {
              that.$router.go(-1)
            })
          }
        }).catch(error => {
          console.log(error)
          that.bgShow = false
        })
      }
    },
    /* 获取银行卡信息*/
    getCardMsg() {
      const that = this
      that.$api.card.getCard('CREDIT', this.cardId).then(res => {
        console.log(res)
        res = res.data
        that.creditCardNo = res.data.card_no
        that.creditCardNoShow = res.data.card_no
        that.$set(that.bankSelect, 'name', res.data.bank_info.name)
        that.$set(that.bankSelect, 'bank_no', res.data.bank_info.bank_no)
        that.tel = res.data.card_phone_number
        that.useDateList = { num: res.data.bill_date || 1, selectedDate: that.columns[(res.data.bill_date - 1) || 0] }
        that.repayDateList = { num: res.data.repayment_date || 31, selectedDate: that.columns[(res.data.repayment_date - 1) || 30] }
        that.CVN2 = res.data.lass_three_cvn2
      }).catch(error => {
        console.log(error)
      })
    },
    /* 编辑银行卡*/
    editCardFUn() {
      const that = this
      const tip = (msg) => {
        return that.$dialog({
          title: msg,
          showCancelButton: false,
          confirmButtonText: '确定',
          className: 'dialog',
          closeOnClickOverlay: true
        })
      }
      if (!that.creditCardNo) {
        tip('请输入您的信用卡号')
      } else if (!that.bankSelect) {
        tip('请选择所属银行')
      } else if (!that.tel) {
        tip('请输入预留手机号码')
      } else if (!that.CVN2) {
        tip('请输入信用卡背后三位数字')
      } else if (!that.validityMonthSelect && !that.validityYearSelect && !that.auth) {
        tip('请输入请输入有效期')
      } else {
        if (that.auth) {
          const data = {
            bill_date: that.useDateList.num,
            repayment_date: that.repayDateList.num
          }
          that.$api.card.partEditCard(that.cardId, 'CREDIT', data).then(res => {
            tip('编辑信用卡成功').then(res => {
              that.$router.go(-1)
            })
          })
        } else {
          const data = {
            bank_no: that.bankSelect.bank_no,
            card_no: that.creditCardNo,
            card_phone_number: that.tel,
            lass_three_cvn2: that.CVN2,
            valid_date: (that.validityMonthSelect + '').concat(that.validityYearSelect),
            bill_date: that.useDateList.num,
            repayment_date: that.repayDateList.num
          }
          that.$api.card.editCard(that.cardId, 'CREDIT', data).then(res => {
            tip('编辑信用卡成功').then(res => {
              that.$router.go(-1)
            })
          })
        }
      }
    },
    /* 点击确认 关闭状态picker */
    closeStatusPicker(value) {
      this.bankSelect = value
      this.bankPicker = false
      // this.openTouch()
    },
    /* 点击确定 关闭有效期月份picker */
    closeValidityMonth(value) {
      this.validityMonthSelect = value
      this.validityMonthPicker = false
      // this.openTouch()
    },
    /* 点击确定 关闭有效期年份picker */
    closeValidityYear(value) {
      this.validityYearSelect = value
      this.validityYearPicker = false
      // this.openTouch()
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
    /* 解决iphone页面层级相互影响滑动的问题*/
    closeTouch: function() {
      document.getElementsByTagName('body')[0].addEventListener('touchmove',
        this.handler, { passive: false })// 阻止默认事件
      console.log('closeTouch haved happened.')
    },
    openTouch: function() {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove',
        this.handler, { passive: false })// 打开默认事件
      console.log('openTouch haved happened.')
    },
    /* 所选的银行 */
    selectCard(value) {
      this.bankSelect = value
      this.bankPicker = false
    },
    validityMonthChange(index) {
      console.log(index)
      this.validityMonthSelect = index
    },
    validityYearChange(index) {
      console.log(index)
      this.validityYearSelect = index
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.form_cell{
  .form_cellHd{
    width: 223px;
  }
  .van-icon{
    margin-top: 24px;
    color: @lightGrey;
  }
}
.picker-box{
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
.btn-add{
  width: 100%;
  height:100px;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 6px rgba(0,0,0,0.12);
  line-height: 100px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%,0);
  padding: 0;
  .btn_add{
    margin: 0 !important;
    line-height: normal;
  }
}
  .btn_getCode{
    padding: 5px 11px;
    font-size: 24px !important;
    line-height: normal;
    color: @mainColorB;
    background: transparent;
    border-radius: 15px;
    border: 1px solid @mainColorB;
  }
  .btn_stay{
    padding: 5px 11px;
    font-size: 24px !important;
    line-height: normal;
    color: #999999;
    background: transparent;
    border-radius: 15px;
    border: 1px solid #999999;
  }
  .form_tip{
    padding: 20px 0 0 22px;
  }
  .btn_add{
    margin-top: 61px !important;
    width: 750px;
    height: 74px;
    color: #fff !important;
    font-size: 30px !important;
    position:fixed;
    bottom:0;
    left: 0;
    border-radius: 0px;
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
  .colorbebe{
    color: #BEBEBE;
  }
  .form_cell .form_cellBd .form_input{
    color: @mainTextColor !important;
  }
  .form_cell .form_cellBd .form_input.form_input-small{
    width: 40%;
  }
  .form_cell .form_cellBd .form_input.form_input-small2{
    width: 27%;
  }
  .con_body{
    width:690px;
    height:622px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px rgba(0,0,0,0.1);
    opacity:1;
    margin-top:20px;
    margin-left:30px;
    border-radius:40;
  }
</style>
