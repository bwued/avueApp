<template>
  <div>
    <!-- 客服弹框 start -->
    <van-dialog
      v-model="showVanDialog"
      :show-confirm-button="showFalse"
      class-name="server_warp"
      close-on-click-overlay
    >
      <div class="server_channel">
        <div class="server_content">
          <div class="server_title cen">
            <h3 class="size36 color333">
              {{ STATIC_INFO.appName }}，为您服务
            </h3>
          </div>
          <div>
            <div class="cen server_item">
              <p>客服热线：4000550575</p>
              <button type="button" class="btn2 server_btn" @click="showServerTel">
                去拨打
              </button>
            </div>
            <div class="cen server_item">
              <p>客服微信：shanjieshenghuo02</p>
              <button type="button" class="btn2 server_btn" @click="gotoAddServer">
                去添加
              </button>
            </div>
          </div>
        </div>
      </div>
    </van-dialog>
    <!-- 客服弹框 end -->

    <!-- 客服微信 start -->
    <van-dialog
      v-model="serverWeChatDialog"
      :show-confirm-button="showFalse"
      class-name="server_warp"
      close-on-click-overlay
    >
      <div class="server_channel1">
        <div class="happy">
          {{ STATIC_INFO.appName }}，很高兴为您服务
        </div>
        <div class="happy-tip">
          长按二维码添加客服微信
        </div>
        <img src="../../static/img/ic_serverCode.jpg">
        <div @click="serverWeChatDialog = false" class="know">知道了</div>
      </div>
    </van-dialog>
    <!-- 客服微信 end -->
  </div>
</template>

<script>
export default {
  name: 'ServerDialog',
  props: {
    showDialog: {
      default: false,
      type: Boolean
    }
  },
  data: function() {
    return {
      showFalse: false, // 是否显示弹框的确认按钮，false
      serverWeChatDialog: false, // 客服微信弹框
      showVanDialog: this.showDialog
    }
  },
  watch: {
    showDialog(val) {
      console.log(val)
      this.showVanDialog = val
    }
  },
  methods: {
    change() {
      this.showVanDialog = !this.showVanDialog
    },
    /* 在线客服 点击去拨打弹框*/
    showServerTel() {
      window.location.href = 'tel://4000550575'
    },
    /* 在线客服 去添加客服 */
    gotoAddServer() {
      this.serverWeChatDialog = true
      setTimeout(() => {
        this.serverDialog = false
      }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
/* server dialog start */
.server_warp {
  width: 75%;
}
.server_channel {
  padding: 50px 28px 70px;
}
.server_title {
  margin-bottom: 60px;
}
.server_item {
  margin-top: 40px;
}
.server_btn {
  margin-top: 20px;
  font-size: 36px;
  color: #2e51ff;
}
.server_codeImg {
  width: 321px;
  height: 321px;
  margin: 0 auto;
}
.server_codeImg > img {
  width: 100%;
}
.server_channel1 {
  padding: 46px 0 40px 0;
  text-align: center;
  img {
    width: 328px;
    height: 328px;
    margin-bottom: 44px;
  }
  .know {
    width: 460px;
    margin: 0 auto;
    height: 74px;
    line-height: 74px;
    font-size: 30px;
    color: #FFFFFF;
    background: #BF9761;
  }
}
.happy {
  height: 50px;
  color: #000000;
  font-size: 36px;
  line-height: 50px;
  text-align: center;
}
.happy-tip {
  color: #666666;
  font-size: 26px;
  margin: 9px 0 28px 0;
  height: 37px;
  line-height: 37px;
  text-align: center;
}
/* server dialog end */
</style>

