<template>
  <div class="bgfff register-wrap">
    <div class="register-main">
      <top-msg :header-name="STATIC_INFO.appName" />
      <div class="con_body flex_column flex_sb">
        <div class="w100">
          <div class="form_cells">
            <div class="cells_title">
              欢迎来{{ STATIC_INFO.appName }}！
            </div>
            <div class="form_cell">
              <input
                v-model.trim="tel"
                type="number"
                class="form_input"
                placeholder="请输入手机号"
                maxlength="11">
            </div>
            <div class="form_cell">
              <input
                v-model.trim="code"
                class="form_input"
                placeholder="请输入验证码">
              <div class="get-code" @click="getCode">{{code_text}}</div>
            </div>
            <div class="form_cell">
              <input
                v-model.trim="password"
                type="password"
                class="form_input"
                placeholder="设置您的密码（6~12个数字或字母）">
            </div>
            <div class="form_cell">
              <input
                v-model.trim="repassword"
                type="password"
                class="form_input"
                placeholder="请再次输入密码">
            </div>
            <div class="form_cell">
              <input
                v-model.trim="referrer"
                type="number"
                class="form_input"
                placeholder="请输入推荐人手机号">
            </div>
            <button class="btn btn_submit" @click="registerFun">
              注册
            </button>
          </div>
          <div class="w100 agreement">
            已有账号？去
            <router-link to="/login" class="btn btn2 maincolor">
              登录
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="login_msg register-footer">
      <img src="../../../static/img/selected.png" alt="" class="agree-img">
      <!-- 我已阅读并同意<router-link to="/agreement" class="register_agreement maincolor"> -->
      我已阅读并同意<div class="register_agreement maincolor" @click="toAgreement">
        {{ STATIC_INFO.appName }}电子协议
      </div>
    </div>
    <!-- 关注页面 start -->
    <van-dialog
      v-model="concernDialog"
      :show-confirm-button="true"
    >
      <div class="concern_title">
        <h5>注册成功</h5>
      </div>
    </van-dialog>
    <!-- 关注页面 end -->
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import { Checkbox } from 'vant'
import 'vant/lib/checkbox/style'
import lodash from 'lodash'
export default {
  name: 'Register',
  components: { topMsg, [Checkbox.name]: Checkbox },
  data() {
    this.timer = null
    this.code_idx = 60
    return {
      lock: false,
      code_text: '获取验证码',
      tel: '', // 手机号
      code: '', // 验证码
      codeToken: '', // 验证码token
      password: '', // 密码
      repassword: '', // 重复密码
      referrer: this.$util.getQueryVariable('referrer') || '', // 推荐人手机号码
      qrcode: {},
      isSelect: true, // 电子协议是否选中
      showAgreementDialog: false, // 显示电子协议dialog
      showFalse: false,
      concernDialog: false // 扫码关注页面dialog
    }
  },
  created() {
    this.thisTitle()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = this.STATIC_INFO.appName
    },
    toAgreement() {
      this.$router.push({
        path: '/agreement'
      })
    },
    /* 获取验证码*/
    getCode() {
      if (this.timer) {
        return
      }
      const tip = (msg) => {
        return this.$dialog({
          title: msg,
          showCancelButton: false,
          confirmButtonText: '确定',
          className: 'dialog',
          closeOnClickOverlay: true
        })
      }
      if (this.tel === '') {
        tip('请输入手机号')
        return
      } else if (!this.$util.isPhone(this.tel)) {
        tip('请输入正确的手机号')
        return
      }
      this.code_idx--
      this.code_text = `${this.code_idx}秒后重发`
      this.timer = setInterval(() => {
        this.code_idx--
        if (this.code_idx < 0) {
          clearInterval(this.timer)
          this.timer = null
          this.code_text = '获取验证码'
          this.code_idx = 60
        } else {
          this.code_text = `${this.code_idx}秒后重发`
        }
      }, 1000)
      const data = {
        phone: this.tel
      }
      this.$api.login.getCode(data).then(res => {
        console.log(res)
        this.codeToken = res.data.data.token
      }).catch(error => {
        console.log(error)
      })
    },
    /* 点击注册*/
    registerFun: lodash.debounce(function() {
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

      const rxp = /^[a-zA-Z0-9_]{6,12}$/
      if (!that.tel) {
        tip('请输入您的手机号码')
      } else if (!that.$util.isPhone(that.tel)) {
        tip('请输入正确的手机号码')
      } else if (!that.code) {
        tip('请输入收到的验证码')
      } else if (!that.password) {
        tip('请输入您的密码')
      } else if (!rxp.test(that.password)) {
        tip('请输入6-12位密码(数字或字母)')
      } else if (that.password !== that.repassword) {
        tip('两次输入的密码不一致')
      } else if (!that.referrer) {
        tip('请输入推荐人手机号码')
      } else if (!that.isSelect) {
        tip('请阅读协议并同意协议后，再进行注册')
      } else {
        const datas = {
          code_input: that.code,
          code_token: that.codeToken,
          username: that.tel,
          password: that.password,
          reference_username: that.referrer
        }
        that.lock = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: '请稍候...'
        })
        that.$api.login.userRegister(datas).then(res => {
          console.log(res)
          that.lock.clear()
          this.$dialog.confirm({
            title: '注册成功',
            showCancelButton: true,
            confirmButtonText: '去下载App',
            cancelButtonText: '去登录'
          }).then(() => {
            window.location.href = this.STATIC_INFO.appDownloadUrl
          }).catch(() => {
            this.$router.replace('/login')
          })
        }).catch(error => {
          console.log(error)
        })
      }
    }, 500),
    /* 二维码弹框关闭前*/
    beforeCodeDialog(action, done) {
      done()
    },
    /* 点击关闭*/
    closeDialog() {
      this.showAgreementDialog = false
    }
  }
}
</script>

<style lang="less" scoped>
  .register-wrap {
    height: 100%;
  }
  .register-main {
    min-height: 100%;
    margin-bottom: -93px;
  }
  .register-footer {
    height: 33px;
    line-height: 35px;
    padding-bottom: 60px;
    color: #666666;
  }
  .agree-img {
    width: 34px;
    height: 34px;
    margin-right: 9px;
  }
  .cells_title{
    margin: 85px 0 56px 0;
    line-height: 84px;
    height: 84px;
    color: #333333;
    font-size: 60px;
  }
  .login_msg{
    text-align: center;
    font-size: 30px;
    width: 100%;
    background-color: #ffffff;
  }
  .login_msg button{
    font-size: 30px;
    color: @mainColorB;
  }
  .register_agreement{
    color: @mainColorB;
    display: inline-block;
    margin-left: 9px;
    &:active {
      opacity: .6;
    }
  }

  .btn_warp{
    margin-top: 46px;
  }
  .btn_getCode{
    padding: 10px 15px;
    font-size: 24px !important;
    line-height: normal;
    color: @mainColorB;
    background: transparent;
    border-radius: 10px;
    border: 1px solid @mainColorB;
  }
  .btn_stay{
    padding: 10px 15px;
    font-size: 24px !important;
    line-height: normal;
    color: #999999;
    background: transparent;
    border-radius: 10px;
    border: 0.01rem solid #999999;
  }

  /*dialog start*/
  .dialog_channel{
    height: 620px;
    padding: 30px 28px;
  }
  .dialog_title{
    margin-bottom: 36px;
  }
  .dialog_title >p{
    margin-top: 15px;
    opacity: .8;
  }
  .dialog_code{
    width: 154px;
    height: 154px;
    margin: 0 auto 20px;
  }
  .dialog_code >img{
    width: 100%;
  }
  /*dialog end*/

  .concern_title{
    padding: 50px 0 40px;
    text-align: center;
    font-size: 36px;
    color: #333333;
  }
  .concern_warp{
    width: 300px;
    margin: 0 auto;
    padding-bottom: 50px;
  }
  .concern_warp >img{
    width: 100%;
  }
  .agreementMsg{
    margin-top:20px;
  }
  .form_input {
    width: 100%;
    border-bottom: 1px solid #CCCCCC;
    margin-bottom: 20px;
    font-size: 30px;
  }
  .get-code {
    display: inline-block;
    border: 1px solid @mainFontColor;
    border-radius: 10px;
    white-space: nowrap;
    padding: 9px 15px;
    height: 33px;
    line-height: 33px;
    font-size: 24px;
    margin: 35px 0 0 23px;
    color: @mainFontColor;
  }
  .btn_submit {
    letter-spacing: 5px;
    margin-top: 56px;
    height: 80px;
    border-radius: 4px;
    font-size: 30px;
    &:active {
      opacity: .7;
    }
  }
  .agreement {
    text-align: center;
    margin-top: 13px;
    height: 42px;
    line-height: 42px;
    color: #757A85;
    color: 30px;
  }
  /deep/ .van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon {
    color: #ffffff !important;
  }
  /deep/ .van-checkbox__label--disabled {
    color: #323233 !important;
  }
  .form_cells {
    padding: 0 36px;
  }
</style>
