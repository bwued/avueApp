<template>
  <div class="con_body flex_column flex_sb login-wrap">
    <div class="cells_title">
      <!-- <img src="../../../static/img/logobeji.png"> -->
      <!-- <img src="../../../static/img/login_bg_demo.jpg"> -->
      <img :src="login_bg">

      <div v-if="true">
        <img class="z_logo2" src="../../../static/img/108.png">
        <!--<img class="z_logo2" id="logo"  src="http://forex.baiwang168.com.cn/img/zhr/img/108.png">-->
      </div>

      <p>登录</p>
    </div>
    <div class="w100 login-main">
      <div class="form_cells overflowHidden">
        <div class="form_cell">
          <p class="z_zh">
            <img src="../../../static/img/icon_phone@3x.png">
          </p>
          <input
            v-model.trim="tel"
            type="tel"
            class="form_input"
            placeholder="请输入手机号"
            maxlength="11"
          >
          <div v-if="!!tel" class="input-btn clear-tel" @click="clearAccount" />
        </div>
        <div class="form_cell">
          <p class="z_zh">
            <img src="../../../static/img/icon_password@3x.png">
          </p>
          <input
            v-model.trim="password"
            :type="type"
            maxlength="18"
            class="form_input"
            placeholder="请输入密码"
          >
          <div v-if="type === 'text'" class="input-btn open-eyes" @click="changeType" />
          <div v-else class="input-btn close-eyes" @click="changeType" />
        </div>
        <!-- <input v-model="checked" type="checkbox" class="B_zc">记住密码
        <router-link to="/forgetPassword" class="z_wj" tag="div">
          忘记密码 ?
        </router-link> -->
        <button type="button" class="btn btn_submit" @click="submit">
          登录
        </button>

        <!-- <van-checkbox v-model="isSelect" class="z_agreement">
              我已阅读并同意<router-link to="/agreement" class="login_agreement">
                {{ STATIC_INFO.appName }}电子协议
              </router-link>
        </van-checkbox>-->
        <!-- <div class="z_agreement">
        <div v-if="gouxuan" class="z_xz" @click="select(1)">
           <img src="../../../static/img/gx.png" />
           我已阅读并同意<router-link to="/agreement" class="login_agreement">
                {{ STATIC_INFO.appName }}电子协议
              </router-link>
        </div>
        <div v-else class="z_bxz" @click="select(-1)">
          <img src="../../../static/img/bgx.png" />
          我已阅读并同意<router-link to="/agreement" class="login_agreement">
                {{ STATIC_INFO.appName }}电子协议
              </router-link>
        </div>
        </div>-->

        <div class="z_btnBox">
          <div class="z_btn" :class="{isActive:isChecked==1}" @click="isChoose" />我已阅读并同意
          <router-link to="/agreement" class="login_agreement">
            {{ STATIC_INFO.appName }}电子协议
          </router-link>
          <p v-if="isBeta" style="text-align: center; color: #bf9761; position: fixed; top: 2px; left: 10px;">
            Beta版
          </p>
        </div>

        <div class="clear">
          <router-link to="/forgetPassword" class="forget-btn" style=" display: none;">
            忘记密码
          </router-link>
          <router-link to="/register" class="register-btn" style=" display: none;">
            新用户注册
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="isBeta" style=" color: red; position:fixed; top: 35rem; left: 10px;">
      {{ loginTip }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Checkbox, CheckboxGroup } from 'vant'

Vue.use(Checkbox).use(CheckboxGroup)
import { Toast } from 'vant'
export default {
  name: 'Login',
  data() {
    this.timer = null
    this.code_idx = 60
    return {
      isSelect: false, // 电子协议是否选中
      login_type: 'fast_login',
      login_bg: require('../../../static/img/logobeji.png'),
      isBeta: false,
      fast_tel: '',
      fast_code: '',
      code_text: '获取验证码',
      tel: '',
      password: '',
      type: 'password',
      loginTip: '【Beta版】 仅供内部测试员工使用，禁止推送市场',
      isChecked: 0, // 电子协议是否选中
      checked: true
    }
  },
  created() {
    const token = this.$util.getQueryVariable('token')
    if (token) {
      this.$store.dispatch('SetToken', token)
      this.$router.push('/credit')
    }
    // this.thisTitle()
    this.getCookie() // coolie保存数据方法
    this.$store.commit('CLEAR_KEEP_ALIVE_ARR')
    this.$api.login.getclientTextShowConfig({ name: 'APP登录背景图' }).then(res => {
      // console.log(res.data.data['APP登录背景图'])
      if (res.data.data && res.data.data['APP登录背景图']) {
        this.login_bg = res.data.data['APP登录背景图']
      }
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {
    const tip = msg => {
      Toast({
        message: msg,
        duration: 3000,
        forbidClick: false
      })
    }
    // 判断是否连接网络
    const connectionType = api.connectionType
    console.log('connectionType: ', connectionType)
    if (connectionType === 'none') {
      tip('请连接网络')
    }
    console.log('当前版本: ', api.version)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {

    /* 设置标题*/
    // thisTitle: function() {
    //   document.title = this.STATIC_INFO.appName
    // },
    getCode() {
      if (this.timer) {
        return
      }
      const tip = msg => {
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
    },
    fastSubmit() {},
    /* 点击提交*/
    submit() {
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
      if (!that.tel) {
        tip('请输入您的手机号码')
      } else if (!that.password) {
        tip('请输入您的登录密码')
      } else if (that.password.length < 6) {
        tip('密码最短为 6 个字符')
      } else if (that.isChecked === 0) {
        tip('请阅读协议并同意协议后，再进行登录')
      } else {
        const datas = {
          username: that.tel,
          password: that.password
        }
        that.$api.login
          .loginFun(datas)
          .then(res => {
            this.$store.commit('SET_KEEP_ALIVE_ARR')
            that.$store
              .dispatch('SetToken', res.headers.authorization)
              .then(() => {
                const phone = that.tel
                console.log('that.tel: ', that.tel)
                STORE.set('phone', that.tel)
                // that.$router.push('/home')
                that.$router.push('/credit')
              })
          })
          .catch(res => {
            const data = res.data
            var msg = '用户名或密码错误，请重新输入'
            if (data.code === '401001') {
              // if(data.msg) {
              //     msg = data.msg  // TODO 接口返回提示 待优化
              // }
              that.$toast({
                message: msg,
                duration: 2500,
                forbidClick: false
              })
            } else {
              console.log('login err: ', res)
            }
          })
      }
      // 判断是否勾选记住密码按钮
      if (that.checked == true) {
        that.setCookie(that.tel, that.password, 7)
      } else {
        that.clearCookie()
      }
    },
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
              'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
              'userPwd' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
    },
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] == 'userName') {
            this.tel = arr2[1] // 保存到保存数据的地方
          } else if (arr2[0] == 'userPwd') {
            this.password = arr2[1]
          }
        }
      }
    },
    // 清除cookie
    clearCookie: function() {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    },
    clearAccount() {
      this.tel = ''
    },
    clearFastTel() {
      this.fast_tel = ''
    },
    changeType() {
      this.type = this.type === 'text' ? 'password' : 'text'
    },
    isChoose(index) {
      console.log(index)

      if (this.isChecked == 1) {
        // 改变原来的状态，就是为选中的状态，当点击的时候就取消掉选中的状态
        this.isChecked = 0
      } else {
        this.isChecked = 1
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.z_btn {
  width: 45px;
  height: 45px;
 background-image: url(../../../static/img/bgx.png) ;
  background-repeat: no-repeat;
 background-size: 1.5rem 1.5rem;
  display: inline-block;
  margin-left: 2.5rem;
  margin-right: .5rem;
  position: relative;
  top: 0.4rem;
}
.isActive {
  background-image: url(../../../static/img/gx.png) ;
 background-size: 1.5rem 1.5rem;
}

.con_body .van-checkbox__icon .van-icon {
  border: 2px solid #a52e2e;
}
.cells_title {
  img {
    position: absolute;
    top: 0;
    width: 100%;
    height: 9rem;
  }
  .z_logo {
    position: relative;
    left: 50%;
    top: 10%;
    margin-left: -3rem;
    display: inline-block;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    background: white;
    border: 0.5px solid gainsboro;
    img {
      margin-left: 1rem;
      margin-top: 1rem;
      width: 4rem;
      height: 4rem;
    }
  }

  .z_logo2 {
    position: relative;
    left: 50%;
    top: 10%;
    margin-left: -3rem;
    display: inline-block;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    background: white;
    border: 0.5px solid #fff;

  }

  p {
    text-align: center;
    font-size: 1.5rem;
  }
}
.z_wj {
  font-size: 1rem;
  line-height: 0.5rem;
  position: relative;
  left: 75%;
  top: -1.6rem;
  color: #666;
}
.z_zh {
  position: absolute;
  top: 0.6rem;
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.login-wrap {
  height: 100%;
  background-color: #ffffff;
}
.login-main {
  position: absolute;
  top: 17rem;
  // min-height: 100%;
  // margin-bottom: -80px;
  // background: url(../../../static/img/login.png) no-repeat;
}
.login-footer {
  height: 80px;
}
.cells_title {
  margin: 144px 0 56px 0;
  font-size: 60px;
  line-height: 1.2;
}
.login_msg {
  text-align: center;
  font-size: 30px;
  width: 100%;
}
.login_msg button {
  font-size: 30px;
  color: #2e51ff;
}
/*UI更新*/
.form_cells {
  margin-bottom: 14px;
  padding: 0 36px;
  // margin-top: 10rem;
}
.forgetPassword {
  margin-left: 190px;
  background: transparent;
  border: none;
  color: #ed0202;
  font-size: 24px;
}
.color008 {
  color: @mainColorB;
}
.height90vh {
  height: 90vh;
}
.form_input {
  width: 100%;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
  font-size: 30px;
  padding-left: 2rem;
}
.btn_submit {
  letter-spacing: 5px;
  margin-top: 20px;
  height: 80px;
  border-radius: 4px;
  font-size: 30px;
  &:active {
    opacity: 0.7;
  }
}
.login-types {
  margin-bottom: 54px;
}
.login-type {
  display: inline-block;
  line-height: 45px;
  font-size: 36px;
  padding-bottom: 10px;
  border-bottom: 1px solid transparent;
}
.login-type.selected {
  color: @mainFontColor;
  border-bottom-color: @mainFontColor;
}
.login-type + .login-type {
  margin-left: 50px;
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
.forget-btn,
.register-btn {
  color: @mainFontColor;
  font-size: 30px;
  &:active {
    color: @yellow;
  }
}
.forget-btn {
  position: relative;
}
.register-btn {
  float: right;
}
.clear-tel {
  background: url(../../../static/img/close.png) no-repeat;
  background-size: cover;
}
.open-eyes {
  background: url(../../../static/img/openeyes.png) no-repeat;
  background-size: cover;
}
.close-eyes {
  background: url(../../../static/img/closeeyes.png) no-repeat;
  background-size: cover;
}
.input-btn {
  position: absolute;
  bottom: 20px;
  right: 0;
  width: 28px;
  height: 28px;
  padding: 20px 10px;
  background-origin: content-box;
}
.login-type {
  font-size: 3rem;
}

.login_agreement {
  color: #bf9761;
}
.z_agreement {
  text-align: center;
  img {
    position: relative;
    top: 0.6rem;
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
