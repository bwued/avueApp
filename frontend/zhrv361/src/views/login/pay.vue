<template>
  <div class="bgfff forget-pwd-wrap">
    <div class="con_body">
      <top-msg header-name="支付验证码" />
      <div class="form_cells">
        <div class="form_cell">
          <input
            v-model.trim="tel"
            type="tel"
            class="form_input"
            placeholder="请输入注册的手机号"
            maxlength="11"
          >
        </div>

        <button class="btn btn_submit" @click="submitReset">
          提交
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import axios from 'axios'
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
      document.title = '支付验证码'
    },
    getRequest() {
      var url = location.search
      url = decodeURI(url)
      var theRequest = new Object()

      if (url.indexOf('?') != -1) {
        var str = url.substr(1)
        strs = str.split('&')

        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }

      return theRequest
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
        tip('请输入短信验证码')
      } else {
        // const data = {
        //   order_no: that.getRequest()['orderNo'],
        //   sms_code: that.tel
        // }
        const token = that.getRequest()['token']
        axios.post('http://192.168.1.148:8082/api/trade/smsConfirmPay', {
					    sms_code:that.tel,
					    order_no:that.getRequest()['orderNo']
					  },
					  {
					          headers: {'Authorization':'Bearer '+token }
					      }
					  )
					  .then(function (response) {
					    console.log(response);
						
					  })
					  .catch(function (error) {
					    console.log(error);
						// alert(JSON.stringify(error))
					  });
        that.$api.login.smsConfirmPay(data).then(() => {
          // that.$dialog({
          //   title: '密码重置成功',
          //   showCancelButton: false,
          //   confirmButtonText: '去登录',
          //   className: 'dialog',
          //   closeOnClickOverlay: true
          // }).then(res => {
          //   that.$router.push('/login')
          // })

        }).catch(() => {
          // error = error.data
          // that.$dialog({
          //   title: '密码重置失败',
          //   message: error.msg,
          //   confirmButtonText: '返回',
          //   className: 'dialog',
          //   closeOnClickOverlay: false
          // })

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
