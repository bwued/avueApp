<template>
  <div class="bgfff forget-pwd-wrap">
    <div class="con_body">
      <top-msg header-name="忘记密码" />
      <div class="form_cells">
        <div class="cells_title">
          找回密码
        </div>
        <div class="form_cell">
          <input
            v-model.trim="tel"
            type="tel"
            class="form_input"
            placeholder="请输入注册的手机号"
            maxlength="11"
          >
        </div>
        <div class="form_cell">
          <input
            v-model.trim="code"
            type="tel"
            maxlength="6"
            class="form_input"
            placeholder="请输入验证码"
          >
          <div class="get-code" @click="getCode">
            {{ code_text }}
          </div>
        </div>
        <div class="form_cell">
          <input
            v-model.trim="password"
            maxlength="18"
            type="password"
            class="form_input"
            placeholder="请设置新的密码（6~12个数字或字母）"
          >
        </div>
        <div class="form_cell">
          <input
            v-model.trim="repassword"
            maxlength="18"
            type="password"
            class="form_input"
            placeholder="请再次设置新的密码"
          >
        </div>
        <button class="btn btn_submit" @click="submitReset">
          提交
        </button>
      </div>
      <!--弹窗-->
      <div v-if="bg==1?true:false" class="bg" />
      <div v-if="Popover==1?true:false" id="Popover" class="flex-column-center">
        <i :class="['iconfont',judge==1?'icon-gou maincolor':'icon-guanbi color999']" />
        <span>{{ judge==1?'密码重置成功':'密码重置失败' }}</span>
        <div class="btn btn_submit pbtn" @click="judge==1?successgo():popoverhide()">
          {{ judge==1?'去登录':'返回' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'ForgetPassword',
  components: { topMsg },
  data() {
    this.timer = null
    this.code_idx = 60
    return {
      tel: '', // 手机号
      code: '', // 验证码
      code_text: '获取验证码',
      codeToken: '', // 验证码token
      password: '', // 密码
      repassword: '', // 重复密码
      bg: 0, // 遮罩层
      Popover: 0, // 弹窗
      judge: 1 // 判断密码成功或失败 0失败 1成功
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '找回密码'
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
    /* 点击提交*/
    submitReset() {
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
      } else if (!that.code) {
        tip('请输入收到的验证码')
      } else if (!that.password || !that.repassword) {
        tip('请输入您的新密码')
      } else if (that.password.length < 6) {
        tip('密码最短为 6 个字符')
      } else if (that.password !== that.repassword) {
        tip('两次输入的密码不一致，请重新输入')
      } else {
        const data = {
          code_input: that.code,
          code_token: that.codeToken,
          password: that.password,
          phone: that.tel
        }
        that.$api.login.retrievePassword(data).then(() => {
          // that.$dialog({
          //   title: '密码重置成功',
          //   showCancelButton: false,
          //   confirmButtonText: '去登录',
          //   className: 'dialog',
          //   closeOnClickOverlay: true
          // }).then(res => {
          //   that.$router.push('/login')
          // })
          that.judge = 1
          that.popovershow()
        }).catch(() => {
          // error = error.data
          // that.$dialog({
          //   title: '密码重置失败',
          //   message: error.msg,
          //   confirmButtonText: '返回',
          //   className: 'dialog',
          //   closeOnClickOverlay: false
          // })
          that.judge = 0
          that.popovershow()
        })
      }
    },
    // 弹窗显示与隐藏
    popovershow() {
      this.bg = 1
      this.Popover = 1
    },
    popoverhide() {
      this.bg = 0
      this.Popover = 0
    },
    successgo() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
  .forget-pwd-wrap {
    height: 100%;
  }
  .form_cells {
    padding: 0 36px;
  }
  .cells_title {
    margin: 104px 0 56px 0;
    line-height: 84px;
    color: #333333;
    font-size: 60px;
    height: 84px;
  }
  .login_msg{
    margin: 36px 24px 0 0;
    text-align: right;
  }
  .login_msg button{
    font-size: 30px;
    color: #2e51ff;
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
  .btn_warp{
    margin-top: 51px;
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
  /*遮罩层*/
  .bg{
    /*display: none;*/
    position: absolute;
    top: 0%; left: 0%; width: 100%; height: 100%;
    background-color: black;
    z-index:10;
    -moz-opacity: 0.7;
    opacity:.50;
    filter: alpha(opacity=50);
  }
  /*弹窗*/
  #Popover{
    /*display: none;*/
    width: 76%;
    position: fixed;
    z-index: 20;
    top: 25%;
    left: 12%;
    background-color: white;
    border-radius: 20px;
    overflow: hidden;
    padding: 50px;
    box-sizing: border-box;
  }
  #Popover i{
    font-size:180px;
  }
  #Popover span{
    color:black;
    padding:40px 0;
    box-sizing: border-box;
  }
  #Popover div{
    text-align:center;
    line-height:70px;
  }
</style>
