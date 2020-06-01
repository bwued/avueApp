<template>
  <div>
    <top-msg v-if="status === 'add' || fromSelectCardPage" header-name="添加储蓄卡" />
    <top-msg v-if="status === 'edit'" header-name="编辑储蓄卡" />
    <div class="con_body">
      <div class="form_cells form_cells_form bgfff">
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">储蓄卡号</label>
          </div>
          <div class="form_cellBd">
            <fun-components-input v-model="cardNoShow" :num-type="'cardNo'" :placeholder="'请输入您的储蓄卡号'" @onRawValue="(rawValue) => {cardNo = rawValue}" />
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">所属银行</label>
          </div>
          <div class="form_cellBd" @click="bankPicker = true">
            <span v-if="!bankSelect.name" class="size30" style="color: #BEBEBE;">请选择所属银行</span>
            <span v-else class="size30">{{ bankSelect.name }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">预留手机号</label>
          </div>
          <div class="form_cellBd">
            <input v-model="tel" class="form_input" type="number" placeholder="请输入预留手机号">
          </div>
        </div>
      </div>
      <!-- <div v-if="status === 'add' || fromSelectCardPage" :class="[fromSelectCardPage?'btn-add':'btn_warp']">
        <button class="btn btn_add" @click="addCardFun">
          {{ fromSelectCardPage?'确认添加':'保  存' }}
        </button>
      </div>
      <div v-else-if="status === 'edit'" class="btn_warp">
        <button class="btn btn_add" @click="editCardFUn">
          保&nbsp;&nbsp;存
        </button>
      </div> -->

      <!-- 代付 -->
      <!-- <div class="agent-pay-title">银行卡详细信息</div> -->
      <div class="form_cells form_cells_form bgfff">
          <div class="form_cell" @click="showSelectAddress = true">
          <div class="form_cellHd">
            <label class="form_label">省 / 市</label>
          </div>
          <div class="form_cellBd" style="color: #a9a9a9;">
            {{extraData.province ? extraData.province + '-' + extraData.city : '请选择省/市'}}
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">支行名</label>
          </div>
          <div class="form_cellBd">
            <input v-model.trim="extraData.branch_name" class="form_input" type="text" placeholder="请输入支行名">
          </div>
        </div>

      </div>
        <div v-if="status === 'add' || fromSelectCardPage" :class="[fromSelectCardPage?'btn-add':'btn_warp']">
        <button class="btn btn_add" @click="addCardFun">
          {{ fromSelectCardPage?'确认添加':'保  存' }}
        </button>
      </div>
      <div v-else-if="status === 'edit'" class="btn_warp">
        <button class="btn btn_add" @click="editCardFUn">
          保&nbsp;&nbsp;存
        </button>
      </div>
      <!-- <div class="btn_warp">
        <button class="btn btn_add" @click="saveExtraData">
          保&nbsp;&nbsp;存
        </button>
      </div> -->
    </div>

    <!--点击 状态 弹出picker（银行卡选择器） start-->
    <van-popup v-model="bankPicker" position="bottom">
      <choose-card @selectCard="selectCard" />
    </van-popup>
    <!--点击 状态 弹出picker（银行卡选择器） end-->
    <!-- 省市 start -->
    <van-popup v-model="showSelectAddress" position="bottom" class="picker">
      <van-area :area-list="areaList" :columns-num="2" title="选择省市" @confirm="confirmArea" @cancel="concalArea" />
    </van-popup>
    <!-- 省市 end -->
     <div style="width:100%; height:100%; position:fixed; top:0; left:0; bottom:0; background:#000; opacity: 0.5;" v-if="bgShow"></div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import { Picker } from 'vant'
import 'vant/lib/picker/style'
import chooseCard from '@/components/chooseCard'
import FunComponentsInput from '@/components/FunComponentsInput'
import areaList from '@/assets/area'
export default {
  name: 'AddCard',
  components: { topMsg, [Picker.name]: Picker, chooseCard, FunComponentsInput },
  props: ['fromSelectCardPage', 'hideAddCard'],
  /* data必须是函数*/
  data: function() {
    return {
      bgShow:false,
      status: this.$util.getQueryVariable('status'), // 银行卡的状态
      cardUser: '', // 持卡人
      cardNo: '', // 银行卡号 银行卡-传给后台去空格
      cardNoShow: '', // 银行卡四位一空显示
      tel: '', // 预留手机号
      code: '', // 验证码
      isGetCode: false, // 是否有获取验证码 true 已获取
      num: 60, // 验证码num
      timer: '', // setInterval
      cardId: this.$util.getQueryVariable('cardId'), // 银行卡id
      bankNo: '', // 银行英文代码
      bankSelect: {}, // 选择的银行卡
      bankPicker: false, // 银行卡列表选择器
      bankListArr: [], // 银行卡列表
      extraData: {
        branch_name: '',
        card_no: '',
        province: '',
        city: '',
      },
      showSelectAddress: false,
      areaList: Object.freeze(areaList)
    }
  },
  computed: {
    token() {
      return this.$store.state.token
    },
    bankList() {
      return this.$store.state.bankList
    }
  },
  created() {
    this.thisTitle()
    this.getBankListFun()
    if (this.status === 'edit') {
      this.getCardMsg()
      this.x_getCardMsg()
    }
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      if (this.static === 'add') {
        document.title = '添加储蓄卡'
      } else {
        document.title = this.fromSelectCardPage ? '添加储蓄卡' : '编辑储蓄卡'
      }
    },
    input(no) {
      this.cardNo = no
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
      if (!that.tel) {
        tip('请输入您的手机号码')
      } else if (!that.$util.isPhone(that.tel)) {
        tip('请输入正确的手机号码')
      } else {
        if (!that.isGetCode) {
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
      }
    },
    /* 新增银行卡*/
    addCardFun() {
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

      if (!that.cardNo) {
        tip('请输入储蓄卡号')
      } else if (!that.bankSelect) {
        tip('请输入所属银行')
      } else if (!that.tel) {
        tip('请输入预留手机号码')
      } else if (!that.extraData.province) {
        tip('请选择省 / 市')
      } else if (!that.extraData.branch_name) {
        tip('请输入支行名称')
      }else {
        console.log('====打印银行卡......')
        console.log(that.extraData)
        const data = {
          bank_no: that.bankSelect.bank_no,
          card_no: that.cardNo,
          card_phone_number: that.tel,
          province: that.extraData.province,
          city: that.extraData.city,
          branch_name: that.extraData.branch_name
        }
        that.bgShow = true;
        that.$api.card.bindCard('DEBIT', data).then(res => {
          // console.log(res)
          if (this.fromSelectCardPage) {
            this.hideAddCard()
            this.$emit('toReflesh')
          } else {
            tip('添加储蓄卡成功').then(res => {
              that.$router.go(-1)
            })
          }
          that.bgShow = false;
        }).catch(error => {
          console.log(error)
           that.bgShow = false;
        })
      }
    },
    /* 获取银行卡信息*/
    getCardMsg() {
      const that = this
      that.$api.card.getCard('DEBIT', this.cardId).then(res => {
        res = res.data
        that.cardNo = res.data.card_no
        that.cardNoShow = res.data.card_no
        that.$set(that.bankSelect, 'name', res.data.bank_info.name)
        that.$set(that.bankSelect, 'bank_no', res.data.bank_info.bank_no)
        that.tel = res.data.card_phone_number
      })
    },
    x_getCardMsg() {
      const that = this
      that.$api.card.x_getCard('DEBIT', this.cardId).then(res => {
        console.log('x_getCard res: ', res)
        const data = res.data.data
        Object.keys(this.extraData)
          .forEach((key) => {
            if (data.hasOwnProperty(key)) {
              this.extraData[key] = data[key]
            }
          })
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

      if (!that.cardNo) {
        tip('请输入储蓄卡号')
      } else if (!that.bankSelect) {
        tip('请输入所属银行')
      } else if (!that.tel) {
        tip('请输入预留手机号码')
      } else {
        const data = {
          bank_no: that.bankSelect.bank_no,
          card_no: that.cardNo,
          card_phone_number: that.tel
        }
        that.$api.card.editCard(that.cardId, 'DEBIT', data).then(res => {
          tip('编辑储蓄卡成功').then(res => {
            that.$router.go(-1)
          })
        })
      }
    },
    /* 点击确认 关闭状态picker*/
    closeStatusPicker(value) {
      console.log(value)
      this.bankSelect = value
      this.bankPicker = false
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
    },
    // 代付
    saveExtraData() {
      console.log('this.extraData: ', this.extraData)
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

      if (!that.cardNo) {
        tip('请输入储蓄卡号')
      } else if (!that.extraData.branch_name) {
        tip('请输入支行名')
      } else if (!that.extraData.province) {
        tip('请输入省份')
      } else if (!that.extraData.city) {
        tip('请输入市')
      } else {
        that.extraData.card_no = that.cardNo
        if (that.status === 'add') {
          that.$api.card.x_bindCard('DEBIT', that.extraData).then(res => {
            // console.log(res)
            if (this.fromSelectCardPage) {
              this.hideAddCard()
              this.$emit('toReflesh')
            } else {
              tip('添加代付信息成功').then(res => {
                that.$router.go(-1)
              })
            }
          }).catch(error => {
            console.log(error)
          })
        } else if (that.status === 'edit') {
          that.$api.card.x_editCard(that.cardId, 'DEBIT', that.extraData).then(res => {
            tip('编辑代付信息成功').then(res => {
              that.$router.go(-1)
            })
          })
        }
      }
    },
    confirmArea(data) {
      console.log('confirmArea data: ', data)
      this.showSelectAddress = false
      if (data) {
        this.extraData.province = data[0].name
        this.extraData.city = data[1].name
        console.log('this.extraData: ', this.extraData)
      }
    },
    concalArea() {
      this.showSelectAddress = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
  .form_cellHd{
    width: 223px;
  }
  .btn_getCode{
    padding: 5px 11px;
    font-size: 28px;
    line-height: normal;
    color: #2E51FF;
    background: transparent;
    border-radius: 15px;
    border: 0.01rem solid #2E51FF;
  }
  .btn_stay{
    padding: 5px 11px;
    font-size: 28px;
    line-height: normal;
    color: #999999;
    background: transparent;
    border-radius: 15px;
    border: 0.01rem solid #999999;
  }
  .form_tip{
    padding: 20px 0 0 22px;
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
.agent-pay-title {
  margin-top: 50px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
</style>
