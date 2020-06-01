<template>
  <div>
    <top-msg header-name="修改密码" />
    <div class="con_body">
      <div class="form_cells form_cells_form bgfff">
        <div class="form_cell">
          <div class="form_cellHd flex flex_align">
            <label class="form_label">手机号码</label>
          </div>
          <div class="form_cellBd">
            <input v-model="tel" type="tel" class="form_input" placeholder="输入您绑定的手机号码" maxlength="11">
          </div>
        </div>
        <!-- <div class="form_cell">
          <div class="form_cellHd flex flex_align">
            <label class="form_label">验证码</label>
          </div>
          <div class="form_cellBd">
            <input v-model="code" type="number" class="form_input" placeholder="输入验证码">
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
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">原密码</label>
          </div>
          <div class="form_cellBd">
            <input v-model="oldPassword" maxlength="18" class="form_input" type="password" placeholder="请输入您的原密码">
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">新密码</label>
          </div>
          <div class="form_cellBd">
            <input v-model="newPassword" maxlength="18" class="form_input" type="password" placeholder="6~12位数字或字母">
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">确认密码</label>
          </div>
          <div class="form_cellBd">
            <input v-model="newRePassword" maxlength="18" class="form_input" type="password" placeholder="重复输入新密码">
          </div>
        </div>
      </div>
      <div class="btn_warp bottom-btn">
        <button class="btn btn_save" @click="submit">
          保  存
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'EditPassword',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      tel: '', // 手机号
      // code: '', // 验证码
      // codeToken: '', // 验证码token
      isGetCode: false, // 是否有获取验证码 true 已获取
      num: 60, // 验证码num
      timer: '', // setInterval
      oldPassword: '', // 旧密码
      newPassword: '', // 新密码
      newRePassword: ''// 重复新密码
    }
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '修改密码'
    },
    /* 获取验证码*/
    // getCodeFun() {
    //   const that = this
    //   const tip = (msg) => {
    //     return that.$dialog({
    //       title: msg,
    //       showCancelButton: false,
    //       confirmButtonText: '确定',
    //       cancelButtonText: '确定',
    //       className: 'dialog',
    //       closeOnClickOverlay: true
    //     })
    //   }
    //   if (!that.tel) {
    //     tip('请输入您的手机号码')
    //   } else if (!that.$util.isPhone(that.tel)) {
    //     tip('请输入正确的手机号码')
    //   } else {
    //     if (!that.isGetCode) {
    //       that.isGetCode = true
    //       that.timer = setInterval(() => {
    //         if (that.num !== 0) {
    //           that.num--
    //         } else {
    //           that.isGetCode = false
    //           that.num = 60
    //           clearInterval(that.timer)
    //         }
    //       }, 1000)
    //     }
    //     const data = {
    //       phone: that.tel
    //     }
    //     that.$api.login.getCode(data).then(res => {
    //       console.log(res)
    //       that.codeToken = res.data.data.token
    //     }).catch(error => {
    //       console.log(error)
    //       that.isGetCode = false
    //       that.num = 60
    //       clearInterval(that.timer)
    //     })
    //   }
    // },
    /* 点击保存，修改密码*/
    submit() {
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
      } else if (!that.oldPassword) {
        tip('请输入您的旧密码')
      } else if (!that.newPassword || !that.newRePassword) {
        tip('请输入您的新密码')
      } else if (that.newPassword.length < 6) {
        tip('密码最短为 6 个字符')
      } else if (that.newPassword !== that.newRePassword) {
        tip('两次输入的密码不一致，请重新输入')
      } else {
        const data = {
          // code_input: that.code,
          // code_token: that.codeToken,
          new_password: that.newPassword,
          old_password: that.oldPassword
        }
        that.$api.center.editPassword(data).then(res => {
          that.$dialog({
            title: '修改密码成功',
            showCancelButton: false,
            confirmButtonText: '确定',
            className: 'dialog',
            closeOnClickOverlay: true
          }).then(() => {
            that.$router.push('/login')
          })
        }).catch(error => {
          error = error.data
          that.$dialog({
            title: '密码重置失败',
            message: error.msg,
            confirmButtonText: '返回',
            className: 'dialog',
            closeOnClickOverlay: false
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .form_cells{
    margin-top: 21px;
    border-top: 0.01rem solid #eeeeee;
  }
  .form_cell .form_cellHd{
    width: 183px;
  }
  .btn_warp >.btn_save{
    width: 750px;
    height: 100px;
    border-radius: 5px;
  }
  .btn_warp{
    margin-top: 51px;
  }
  .btn_getCode{
    padding: 5px 24px;
    font-size: 28px;
    line-height: normal;
    color: #2E51FF;
    background: transparent;
    border-radius: 15px;
    border: 1px solid #2E51FF;
    .fontColor;
    .borderBtn;
  }
  .btn_stay{
    padding: 5px 24px;
    font-size: 28px;
    line-height: normal;
    color: #999999;
    background: transparent;
    border-radius: 15px;
    border: 0.01rem solid #999999;
  }
</style>
