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
            <span class="form_input">{{ name }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">身份证</label>
          </div>
          <div class="form_cellBd">
            <span class="form_input">{{ identify.substr(0,12) + '****' + identify.substr(16) }}</span>
          </div>
        </div>
      </div>
      <div class="form_cells form_cells_form bgfff">
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">储蓄卡号</label>
          </div>
          <div class="form_cellBd">
            <span class="form_input">{{ cardId }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">所属银行</label>
          </div>
          <div class="form_cellBd">
            <span class="form_input">{{ bankSelect.bankNo }}</span>
          </div>
        </div>
        <div class="form_cell">
          <div class="form_cellHd">
            <label class="form_label">预留手机号</label>
          </div>
          <div class="form_cellBd">
            <span class="form_input">{{ cardTel }}</span>
          </div>
        </div>
      </div>
      <div v-if="authStatus == 'AUTHORIZING'" class="btn_warp">
        <button class="btn btn_check">
          认证审核中
        </button>
      </div>
      <div v-if="authStatus == 'DENIED'" class="btn_warp">
        <button class="btn btn_warn" @click="gotoAuthentication">
          认证失败，请重新认证
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'AuthenticationStatus',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      tel: '13323332333', // 手机号码
      name: '', // 姓名
      identify: '', // 身份证
      identifyBefore: '', // 身份证正面
      identifyAfter: '', // 身份证反面
      identifyHandle: '', // 身份证手持照
      cardId: '', // 储蓄卡号
      cardTel: '', // 储蓄卡预留的手机号
      cardImgFront: '', // 储蓄卡正面照
      cardImgAfter: '', // 储蓄卡反面照
      authStatus: '', // 认证状态 [ UNAUTHORIZED, AUTHORIZING, DENIED, AUTHORIZED ] 分别是未认证，认证中，认证失败，已认证
      bankSelect: {}, // 选择的储蓄卡
      bankListArr: []// 储蓄卡列表
    }
  },
  computed: {
    bankList() {
      return this.$store.state.bankList
    }
  },
  created() {
    this.thisTitle()
    this.getAuthenticationFun()
  },
  destroyed() {
    this.$notify.clear()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '个人实名认证'
    },
    /* 去重新认证*/
    gotoAuthentication() {
      const items = {
        name: this.name,
        identify: this.identify,
        cardId: this.cardId.replace(/\s/g, ''),
        bankSelect: this.bankSelect,
        cardTel: this.cardTel
      }
      this.$router.push({ path: '/authentication', query: { items: items }})
    },
    /* 获取用户实名认证的信息 getAuthentication*/
    getAuthenticationFun() {
      const that = this
      that.$api.center
        .getAuthentication()
        .then(res => {
          if (res.data.code === '200000') {
            console.log(res.data.data)
            that.authStatus = res.data.data.auth_state
            this.authMsg = res.data.data.auth_msg
            that.name = res.data.data.id_card_name
            that.identify = res.data.data.id_card_no
            // that.identifyBefore = res.data.data.id_card.id_card_front_image
            //   ? res.data.data.id_card.id_card_front_image.url
            //   : ''
            // that.identifyAfter = res.data.data.id_card.id_card_opposite_image
            //   ? res.data.data.id_card.id_card_opposite_image.url
            //   : ''
            // that.identifyHandle = res.data.data.id_card.id_card_in_hand_image
            //   ? res.data.data.id_card.id_card_in_hand_image.url
            //   : ''
            that.cardId = res.data.data.bank_card_no.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
            that.cardTel = res.data.data.bank_card_phone_num
            // that.cardImgFront = res.data.data.card_info.card_front_image
            //   ? res.data.data.card_info.card_front_image.url
            //   : ''
            // that.cardImgAfter = res.data.data.card_info.card_opposite_image
            //   ? res.data.data.card_info.card_opposite_image.url
            //   : ''
            that.$set(that.bankSelect, 'bankNo', res.data.data.bank_name)
            that.$set(that.bankSelect, 'text', that.bankList[that.bankSelect.bankNo])
            console.log(that.bankList)
            if (this.authStatus === 'DENIED') {
              this.$notify({
                message: this.authMsg,
                duration: 0,
                background: '#ff0000'
              })
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.form_cell .form_cellBd .form_input {
  color: #666666;
}
.form_cells {
  border-top: 0.01rem solid #eeeeee;
}
.form_cell .form_cellHd {
  width: 223px;
}

.btn_check {
  width: 400px;
  height: 74px;
  font-size: 28px;
  line-height: normal;
  color: #ffffff;
  background: #cccccc;
  border-radius: 15px;
  border: 0.01rem solid #cccccc;
}
.btn_warn {
  width: 400px;
  height: 74px;
  font-size: 28px;
  line-height: normal;
  color: #ffffff;
  background: #f12c20;
  border-radius: 15px;
  border: 0.01rem solid #f12c20;
}
.reAuthentication_warp {
  position: fixed;
  bottom: 55px;
  left: 50%;
  margin-left: -60px;
  font-size: 30px;
  color: #2e51ff;
}
.btn_reAuthentication {
}

.form_cell_upload {
  padding: 32px 0 20px;
}
.upload_add {
  display: inline-block;
  width: 114px;
  height: 114px;
  line-height: 110px;
  font-weight: 100;
  font-size: 112px;
  text-align: center;
  color: #cccccc;
  border: 0.01rem solid #cccccc;
}
.upload_item > p {
  line-height: 36px;
}

.cell_uploadImg {
  position: relative;
  margin-bottom: 11px;
}
.cell_uploadImg img {
  width: 116px;
  height: 116px;
}
</style>

