<template>
  <div>
    <top-msg header-name="个人实名认证" />
    <div class="con_body">
      <div class="form_cells form_cells_form bgfff mgb20">
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">姓名</label>
          </div>
          <div class="form_cellBd">
            <input v-model="name" class="form_input" type="text" placeholder="请输入您的名字">
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">身份证</label>
          </div>
          <div class="form_cellBd">
            <fun-components-input v-model="identifyShow" :num-type="'identifyNo'" :placeholder="'请输入您的身份证件号码'" @onRawValue="(rawValue) => {identify = rawValue}" />
          </div>
        </div>
      </div>
      <div class="form_cells form_cells_form bgfff">
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">储蓄卡号</label>
          </div>
          <div class="form_cellBd">
            <fun-components-input v-model="cardIdShow" :num-type="'cardNo'" :placeholder="'请输入您的储蓄卡号码'" @onRawValue="(rawValue) => {cardId = rawValue}" />
          </div>
        </div>
        <div class="form_cell" style="display:none;">
          <div class="form_cellHd">
            <label class="form_label">所属银行</label>
          </div>
          <div class="form_cellBd" @click="bankPicker = true">
            <span v-if="!bankSelect.name" class="size30" style="color: #BEBEBE;">请选择所属银行</span>
            <span v-else class="size30" style="color: #666666;">{{ bankSelect.name }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">预留手机号</label>
          </div>
          <div class="form_cellBd">
            <input v-model="cardTel" class="form_input" type="number" maxlength="11" placeholder="请输入预留手机号">
          </div>
        </div>
      </div>
      <div class="btn_warp">
        <button class="btn btn_submit" @click="confirmAuth">
          确认提交
        </button>
      </div>
    </div>

    <!--点击 状态 弹出picker（银行卡选择器） start-->
    <van-popup v-model="bankPicker" position="bottom">
      <choose-card @selectCard="selectCard" />
    </van-popup>
    <!--点击 状态 弹出picker（银行卡选择器） end-->
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import chooseCard from '@/components/chooseCard'
import FunComponentsInput from '@/components/FunComponentsInput'
import { Picker } from 'vant'
import { Toast } from 'vant'
import 'vant/lib/picker/style'
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'Authentication',
  components: { topMsg, [Picker.name]: Picker, chooseCard, FunComponentsInput },
  /* data必须是函数*/
  data: function() {
    return {
      auth_url: '', // 人脸识别地址
      auth_token: '', // 用户tokenID
      tel: '', // 手机号码
      code: '', // 验证码
      isGetCode: false, // 是否有获取验证码 true 已获取
      num: 60, // 验证码num
      timer: '', // setInterval
      name: '', // 姓名
      identify: '', // 身份证
      identifyShow: '', // 身份证显示
      isAutoUpload: '', // 是否自动上传
      cardId: '', // 银行卡号
      cardIdShow: '', // 银行卡四位一空显示
      cardTel: '', // 银行卡预留的手机号
      bankSelect: {}, // 选择的银行卡
      bankPicker: false, // 银行卡列表选择器
      bankListArr: [], // 银行卡列表
      items: {} // 认证失败传参
    }
  },
  computed: {
    token() {
      return this.$store.state.token
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    bankList() {
      return this.$store.state.bankList
    }
  },
  watch: {

  },
  created() {
    this.auth_url = this.STATIC_INFO.cfcaAuthUrl
    this.auth_token = getToken()
    //    console.log(`Bearer ${getToken()}` )
    console.log(this.auth_token)
    this.thisTitle()
    this.getBankListFun()
    this.$store.dispatch('GetBankList').then(() => {
      this.judgeUserAuth()
    })
    this.$store.dispatch('GetUserInfo').then(() => {
    })
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '个人实名认证'
    },
    /* 获取验证码*/
    getCodeFun() {
      const that = this
      const tip = msg => {
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
    /* 实名认证 提交表单 2019/12/16*/
    submitAuthenticationBw() {
      const that = this

      const loading = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '请稍候...'
      })

      const params = {
        name: that.name,
        identificationNumber: that.identify,
        accountNumber: that.cardId,
        phoneNumber: that.cardTel
      }
      that.$api.center
        .authenticationBw(params)
        .then(res => {
          loading.clear()

          that.$dialog({
            title: '认证成功',
            showCancelButton: false,
            confirmButtonText: '确定',
            className: 'dialog',
            closeOnClickOverlay: false
          })
            .then(() => {
              that.$router.replace('/center')
            })
        })
    },
    /* 实名认证 点击确认提交*/
    confirmAuth() {
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
      if (!that.name) {
        tip('请输入您的姓名')
      } else if (!that.identify) {
        tip('请输入您的身份证')
      } else if (!that.cardId) {
        tip('请输入您的储蓄卡号')
      } else if (!that.bankSelect) {
        tip('请选择储蓄卡所属银行')
      } else if (!that.cardTel) {
        tip('请输入您的预留手机号码')
      } else if (!this.$util.isPhone(that.cardTel)) {
        tip('请输入正确的手机号')
      } else {
        that.submitAuthenticationBw()
        return

        // - 调用人脸识别  --hgwnli 11/10
        //        var _url = that.name+'##@'+that.cardTel+'##@'+that.cardId+'##@'+that.identify  ok 正常
        //       that.auth_url = 'http://120.79.74.34:6065/auth/auth/all'
        var _url = that.name + '##@' + that.cardTel + '##@' + that.cardId + '##@' + that.identify + '##@' + that.auth_url + '##@' + that.auth_token
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        console.log('--start 调用人脸识别--')
        console.log(_url)

        if (isAndroid) {
          baiwangxinxi.showFace(_url)
        }
        if (isiOS) {
          var message = {
            name: that.name,
            carNO: that.cardId,
            phone: that.cardTel,
            idNO: that.identify,
            authUrl: that.auth_url,
            authToken: that.auth_token
          }
          window.webkit.messageHandlers.showFace.postMessage(message)
        }
        console.log('--- 调用人脸识别 end---')
      }
    },

    /* 调用人脸识别*/
    showFace(_url) {
      // baiwangxinxi.showFace("我是XX##@13800138000##@622500000000000000##@440000000000000000");
    },
    /* 实名认证 提交表单*/
    submitAuthentication() {
      const that = this

      const loading = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '请稍候...'
      })

      // const data = {
      //   id_card_name: that.name,
      //   id_card_no: that.identify,
      //   bank_card_no: that.cardId,
      //   bank_code: that.bankSelect.bank_no,
      //   bank_name: that.bankSelect.name,
      //   bank_card_phone_num: that.cardTel
      // }
      const data = {
        agentId: '10000',
        bankCard: that.cardId,
        idCard: that.identify,
        name: that.name,
        mobile: that.cardTel
      }
      axios.post(process.env.VUE_APP_BASE_API + '/auth/bank4Needs/hkj/auth', data).then(res => {
        loading.clear()
        const data = res.data.data
        console.log('黑科四要素......')
        console.log(data)
        if (data.verification == '20') {
          that.$api.center.saveYskAuth({
            id_card_no: that.identify,
            id_card_name: that.name,
            is_auth: 1,
            auth_msg: ''
          }).then(() => {
            Toast.success('认证完成')
            that.$router.replace('/center')
          })
        } else {
          Toast(data.message)
        }
      }).catch(err => {
        console.log(err)
        Toast('服务异常')
      })

      // that.$api.center
      //   .authentication(data)
      //   .then(res => {
      //     console.log(res)
      //     loading.clear()
      //     that.$dialog({
      //       title: '认证资料已提交，请等待审核',
      //       showCancelButton: false,
      //       confirmButtonText: '确定',
      //       className: 'dialog',
      //       closeOnClickOverlay: false
      //     }).then(() => {
      //       that.$router.replace('/center')
      //     })
      //       return false;
      //       that.$api.center.saveYskAuth({
      //         id_card_no: that.identify,
      //         id_card_name: that.name,
      //         is_auth:1,
      //         auth_msg: ''
      //       }).then(() => {
      //        Toast.success('认证完成')
      //     })
      //   })
    },
    /* 判断用户是否有提交认证，是否有认证信息*/
    judgeUserAuth() {
      const that = this
      that.getAuthenticationFun()
    },
    /* 获取用户实名认证的信息 getAuthentication*/
    getAuthenticationFun() {
      const that = this
      that.$api.center
        .getAuthentication()
        .then(res => {
          that.name = res.data.data.id_card_name
          that.identify = res.data.data.id_card_no
          that.identifyShow = that.identify.replace(/(\d{6})(?=\d)/, '$1 ').replace(/(\d{8})(?=\d)/, '$1 ')
          that.cardId = res.data.data.bank_card_no
          that.cardIdShow = that.cardId.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
          that.cardTel = res.data.data.bank_card_phone_num
          that.$set(
            that.bankSelect,
            'bank_no',
            res.data.data.bank_code
          )
          that.$set(
            that.bankSelect,
            'name',
            that.bankList[that.bankSelect.bank_no]
          )
        })
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
      console.log(value)
      this.bankSelect = value
      this.bankPicker = false
    }
  }
}
</script>

<style lang="less" scoped>
  .form_cells {
    border-top: 0.01rem solid #eeeeee;
  }
  .form_cell .form_cellHd {
    width: 223px;
  }
  .btn_getCode {
    padding: 5px 11px;
    font-size: 28px;
    line-height: normal;
    color: #2e51ff;
    background: transparent;
    border-radius: 15px;
    border: 0.01rem solid #2e51ff;
  }
  .btn_stay {
    padding: 5px 11px;
    font-size: 28px;
    line-height: normal;
    color: #999999;
    background: transparent;
    border-radius: 15px;
    border: 0.01rem solid #999999;
  }
  .btn_warp > .btn_submit {
    width: 400px;
    height: 74px;
  }
  .form_cell .form_cellBd .form_input {
    color: #666666;
  }
</style>

