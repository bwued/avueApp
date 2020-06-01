<template>
  <div class="center-page">
    <div class="con_body">
      <div class="page-title">
        我的
      </div>
      <div v-if="userInfo" class="user-info clear">
        <span
          v-if="userInfo.id_card_name || userInfo.username"
          class="user-name"
        >{{ userInfo.id_card_name||userInfo.username.substring(0,3) + '****' +userInfo.username.substring(7,11) }}</span>
        <span
          v-else
          class="user-name"
        >{{ userInfo.username }}</span>
        <rank :text="userInfo.rank_name" class="user-rank" />
        <div v-if="userInfo.auth_state == 'AUTHORIZED'" class="userInfo_status">
          <i class="iconfont icon-renzheng icon_authentication colorcd" />
          <span class="colorf56 size24">已认证</span>
        </div>
        <div v-else-if="userInfo.auth_state == 'UNAUTHORIZED'" class="userInfo_status">
          <i class="iconfont icon-weirenzheng icon_authentication colorcd" />
          <span class="colorf56 size24" @click="gotoAuthentication('add')">未认证</span>
        </div>
        <div v-else-if="userInfo.auth_state == 'AUTHORIZING'" class="userInfo_status">
          <i class="iconfont icon-weirenzheng icon_authentication colorcd" />
          <span class="colorf56 size24" @click="gotoAuthentication('edit')">认证中</span>
        </div>
        <div v-else-if="userInfo.auth_state == 'DENIED'" class="userInfo_status">
          <i class="iconfont icon-weirenzheng icon_authentication colorcd" />
          <span class="colorf56 size24" @click="gotoAuthentication('edit')">认证失败</span>
        </div>
        <div class="user-set" @click="toSet" />
      </div>
      <div class="userInfo_container position_re bgfff">
        <div class="userInfo_warp">
          <div v-if="userInfo" class="flex_sb mt20">
            <div class="flex_column w65">
              <span class="point-balance">余额(元）</span>
              <p class="blance colorfff textEllipsis">
                <!-- <span class="size48">¥</span>
                {{ userInfo ? userInfo.earnings : '0.00' }}-->
                {{ userInfo ? userInfo.balance : '0.00' }}
              </p>
              <div class="shouyi">
                今日收益
                <span> {{ userInfo ? userInfo.today_earnings : '0.00' }}</span>
                累计收益
                <span class>{{ earnings }}</span>
              </div>
            </div>
          </div>
          <div class="userInfo_withdraw" @click="gotoWithdraw">
            提现
          </div>
        </div>
      </div>
      <div class="form_cells form_cells_form bgfff">
        <router-link to="/bill" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_wodeyongjin.png">
            <span class="link-name">我的佣金</span>
            <!-- 我的钱包 -->
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link to="/receipt" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_shoukuanjilu.png">
            <span class="link-name">收款记录</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link to="/team" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_wodetuandui.png">
            <span class="link-name">我的团队</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link v-if="show2" to="/member" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_shengjizhongxin.png">
            <span class="link-name">服务商中心</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link v-if="show1" to="/vmall" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/lb.png">
            <span class="link-name">我的礼包</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link v-if="show3" to="/integral" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/jifen.png">
            <span class="link-name">平台积分</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link to="/myCard" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_yinhangkaguabli.png">
            <span class="link-name">银行卡管理</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link to="/repayment" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_huankuanjin.png">
            <span class="link-name">智能账单金额</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link to="/zhihuijin" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_zhihuijin.png">
            <span class="link-name">智慧金返还</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <router-link v-if="user_enable==1" to="/limit" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_shoukuanjilu.png">
            <span class="link-name">每日小结</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <div class="list_line flex-row-between" @click="serverDialog = true">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_kefuxiaohui.png">
            <span class="link-name">客服小慧</span>
          </div>
          <i class="iconfont icon-Path" />
        </div>
        <router-link to="/faq" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_huankuanjin.png">
            <span class="link-name">常见问题</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <!-- <router-link to="/agreement" class="list_line flex-row-between"> -->
        <router-link to="/agreement" class="list_line flex-row-between">
          <div class="flex-row-center">
            <img src="../../../static/img/icon_yonghuxieyi.png">
            <span class="link-name">用户协议及服务条款</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>
        <!-- <router-link to="/set" class="list_line flex-row-between">
          <div class="flex-row-center">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shezhi" />
            </svg>
            <span class="link-name">设置</span>
          </div>
          <i class="iconfont icon-Path" />
        </router-link>-->
      </div>
    </div>

    <!-- 我的二维码 弹框 start-->
    <van-dialog
      v-model="codeDialog"
      :show-confirm-button="showFalse"
      :before-close="beforeCodeDialog"
      close-on-click-overlay
    >
      <div class="dialog_channel">
        <div class="textalign_right">
          <i class="icon_close" @click="closeDialog" />
        </div>
        <div class="dialog_content">
          <div class="dialog_title cen">
            <h3 class="size48 color2e5">
              {{ STATIC_INFO.appName }}
            </h3>
            <p class="size24 color666">
              {{ STATIC_INFO.appName }} 无需用卡
            </p>
          </div>
          <div class>
            <div class="dialog_code">
              <qrcode :value="codeValue" :src="codeValue" :options="{width: 144}" tag="img" />
            </div>
            <p class="size24 color999 cen">
              扫二维码注册{{ STATIC_INFO.appName }}
            </p>
          </div>
        </div>
      </div>
    </van-dialog>
    <!-- 我的二维码 弹框 end-->

    <!-- 客服弹框 start -->
    <van-dialog
      v-model="serverDialog"
      :show-confirm-button="showFalse"
      class-name="server_warp"
      close-on-click-overlay
    >
      <div>
        <div class="server_content">
          <div class="service-title">
            {{ STATIC_INFO.appName }}, 为您服务
          </div>
          <div>
            <div class="cen server_item size26">
              <p class="server-hot">
                客服热线：{{ STATIC_INFO.servicePhoneNumber }}
              </p>
              <button type="button" class="btn2 server_btn1" @click="showServerTel">
                去拨打
              </button>
            </div>
            <div class="cen server_item">
              <p class="server-hot">
                微信公众号：{{ STATIC_INFO.serviceWechatNo }}
              </p>
              <button type="button" class="btn2 server_btn1 last" @click="gotoAddServer">
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
          截图保存微信扫码添加关注
        </div>
        <img src="../../../static/img/ic_serverCode.jpg">
        <div class="know" @click="serverWeChatDialog = false">
          知道了
        </div>
      </div>
    </van-dialog>
    <!-- 客服微信 end -->
    <!-- 关注公众号 弹框 start-->
    <van-dialog
      v-model="PublicDialog"
      :show-confirm-button="showFalse"
      :before-close="beforePublicDialog"
      close-on-click-overlay
    >
      <div class="paddingtb40 flex-vertical-centering">
        <div class="color000 size36 bold mt40">
          关注公众号
        </div>
        <div class="color666 size26 mt10">
          长按二维码关注公众号
        </div>
        <img class="gzhewm" :src="Qrcode">
        <div class="btn_warp mb40">
          <button type="button" class="btn btn_submit" @click="closePublicDialog">
            知道了
          </button>
        </div>
      </div>
    </van-dialog>
    <!-- 关注公众号 弹框 end-->

    <tabbar :center-index="msg" />
  </div>
</template>

<script>
import { parseAmount } from '@/utils/amount'
import tabbar from '@/components/tabbar'
import rank from '@/components/rank'
import Qrcode from '@chenfengyuan/vue-qrcode/dist/vue-qrcode'
// import topMsg from '@/components/topMsg'
export default {
  name: 'Center',
  components: { Qrcode, tabbar, rank },
  filters: {
    parseAmount
  },
  /* data必须是函数*/
  data: function() {
    return {
      user_enable: '', // 标识是否显示柱状图路由
      show1: false, //
      show2: false, //
      show3: false, //
      msg: true, //
      codeDialog: false, // 二维码弹框
      showFalse: false, // 是否显示弹框的确认按钮，false
      serverDialog: false, // 客服弹框
      serverWeChatDialog: false, // 客服微信弹框
      codeValue: '', // 二维码地址链接
      PublicDialog: false, // 公众号弹框
      Qrcode: '', // 关注公众号二维码
      earnings: 0// 累计收益
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  watch: {
    '$route': 'getqrcode1'
  },
  activated() {
    api.setStatusBarStyle({
      color: '#484b6d',
      style: 'light',
      animated: false
    })
  },
  created() {
    // this.thisTitle()
    this.$store.dispatch('GetUserInfo')
    this.getqrcode()
    this.getqrcode1()
    this.Qrcode = this.STATIC_INFO.officialQrCodePath
    this.getshow1()
    this.getshow2()
    this.getshow3()
    this.getjudge()
  },
  mounted() {
    api.setStatusBarStyle({
      color: '#484b6d',
      style: 'light',
      animated: false
    })
  },
  methods: {
    getjudge() { // 判断是否显示柱状图菜单
      this.$api.center.getEcharts().then(res => {
        
        this.user_enable = res.data.data.user_enable
        // alert(this.user_enable)
        // console.log(' 判断是否显示柱状图菜单')
        // console.log(res.data.data.user_enable)
      })
    },
    getshow1() {
      const that = this
      this.$api.plan.getFunction({ groupName: '我的', functionName: '我的礼包' }).then(res => {
        if (res.data.data[0].enable === 'on') {
          that.show1 = true
        } else {
          that.show1 = false
        }
      })
    },
    getshow2(name) {
      const that = this
      this.$api.plan.getFunction({ groupName: '我的', functionName: '服务商中心' }).then(res => {
        if (res.data.data[0].enable === 'on') {
          that.show2 = true
        } else {
          that.show2 = false
        }
      })
    },
    getshow3(name) {
      const that = this
      this.$api.plan.getFunction({ groupName: '我的', functionName: '平台积分' }).then(res => {
        if (res.data.data[0].enable === 'on') {
          that.show3 = true
        } else {
          that.show3 = false
        }
      })
    },
    /* 设置标题*/
    thisTitle: function() {
      document.title = '我的'
    },
    /* 获取代理二维码 */
    getqrcode() {
      this.$api.center.getqrcode().then(res => {
        console.log(res)
        if (res.data.data.agent_qr_code_image) {
          this.Qrcode = res.data.data.agent_qr_code_image.url
        }
      })
    },
    /* 获取用户信息*/
    getqrcode1() {
      this.$api.center.getUserInfo().then(res => {
        this.$store.commit('SET_USER_INFO', res.data.data)
        console.log(res.data.data.rank_name)
        this.earnings = res.data.data.earnings || '0'
      })
    },
    /* 点击关注公众号，显示弹框*/
    showPublicAddress() {
      this.$dialog({
        title: '提示',
        message: '此功能待开放',
        confirmButtonText: '确定'
      })
      // this.PublicDialog = true
    },
    /* 点击我的二维码，显示弹框*/
    showMyCode() {
      const that = this
      this.codeValue =
                    process.env.BASE_ADDRESS +
                    '/#/register?referrer=' +
                    that.userInfo.username
      this.codeDialog = true
    },
    /* 二维码弹框关闭前*/
    beforeCodeDialog(action, done) {
      done()
    },
    /* 公众号弹框关闭前*/
    beforePublicDialog(action, done) {
      done()
    },
    /* 点击关闭*/
    closeDialog() {
      this.codeDialog = false
    },
    /* 点击关闭*/
    closePublicDialog() {
      this.PublicDialog = false
    },
    /* 点击去提现*/
    gotoWithdraw() {
      this.$router.push('/withdraw')
    },
    /* 去认证*/
    gotoAuthentication(status) {
      // this.auth();
      this.$router.push({
        path: '/authentication'
      })
    },
    /* 在线客服 点击去拨打弹框*/
    showServerTel() {
      window.location.href = 'tel://' + this.STATIC_INFO.servicePhoneNumber
    },
    /* 在线客服 去添加客服 */
    gotoAddServer() {
      this.serverWeChatDialog = true
      setTimeout(() => {
        this.serverDialog = false
      }, 100)
    },
    toSet() {
      this.$router.push({
        path: '/set'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/common.less";
  .shouyi {
    width: 21.5rem;
    color: #fff5f6ff;
    font-size: 0.85rem;
    span {
      margin-left: 0.5rem;
      margin-right: 1.5rem;
      color: #fff5f6ff;
    }
  }
  .page-title {
    height: 88px;
    line-height: 88px;
    text-align: center;
    color: #000000;
    font-size: 36px;
    background-color: #ffffff;
  }
  .user-info {
    margin: 0 30px;
    line-height: 80px;
  }
  .user-name {
    font-size: 36px;
    font-weight: 500;
    margin: 0 16px 0 0;
    color: #333333;
  }
  .user-rank {
    position: relative;
    top: 8px;
    margin-right: 17px;
  }
  .user-set {
    float: right;
    margin: 25px 0 0 0;
    width: 36px;
    height: 36px;
    background: url(../../../static/img/set.png) no-repeat;
    background-size: 100% 100%;
    &:active {
      background-color: #eeeeee;
    }
  }
  .center-page {
    box-sizing: border-box;
    min-height: 100%;
    overflow: auto;
    padding-bottom: 110px;
    background-color: #ffffff;
  }
  // .form_cells {
  //   border-top: 0.01rem solid #eeeeee;
  // }
  .form_cells .form_cell .form_cellHd {
    width: 51px;
  }
  .icon_authentication {
    font-size: 30px;
    margin-right: 11px;
  }
  .icon_uncertified {
    display: inline-block;
    width: 25px;
    height: 31px;
    margin-right: 13px;
    background: url("../../../static/img/ic_weirenzheng.png");
    background-size: 25px 31px;
  }
  .userInfo_container {
    height: 345px;
    padding: 0 30px;
    background-image: url("../../../static/img/img_background_wode.png");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 15px;
  }

  .userInfo_warp {
    position: relative;
    box-sizing: border-box;
    padding: 62px 31px 30px 31px;
    margin: 0 auto 0 auto;
    background-blend-mode: normal, normal;
    border-radius: 15px;
    p,
    span,
    h5,
    .icon_authentication {
      color: #fff5f6;
    }
  }

  .userInfo_status {
    display: inline-block;
    margin: 0 6px 0 0;
    line-height: 28px;
    i {
      font-size: 28px;
    }
    span {
      color: #999999;
      font-size: 20px;
    }
  }

  .userInfo_withdraw {
    box-sizing: border-box;
    padding: 10px 10px 10px 28px;
    position: absolute;
    top: 62px;
    right: 0;
    // width: 86px;
    line-height: 34px;
    height: 54px;
    text-align: center;
    background-color: #ffffff;
    box-shadow: 0px 10px 20px rgba(14, 66, 128, 0.08);
    border-radius: 27px 0 0 27px;
    font-size: 24px;
    color: #bf9761;
  }

  .userInfo_status .icon_path {
    margin-left: 15px;
    transform: translateY(4px);
  }
  .icon_code {
    display: inline-block;
    width: 70px;
    height: 70px;
    background: url("../../../static/img/ic_erweima1.png") no-repeat;
    background-size: 70px;
  }
  .user_function {
    padding: 67px 0 49px;
  }
  .function_title {
    margin-top: 10px;
  }

  .icon_jifen {
    display: inline-block;
    width: 24px;
    height: 26px;
    background: url("../../../static/img/ic_jifen.png") no-repeat center;
    background-size: 33px;
    transform: translateY(4px);
  }

  /*dialog start*/
  .dialog_channel {
    height: 620px;
    padding: 30px 28px;
  }
  .dialog_title {
    margin-bottom: 36px;
  }
  .dialog_title > p {
    margin-top: 15px;
    opacity: 0.8;
  }
  .dialog_code {
    width: 1.54rem;
    height: 1.54rem;
    margin: 0 auto 20px;
  }
  .dialog_code > img {
    width: 100%;
  }
  /*dialog end*/

  .colorf56O8 {
    color: #fff5f6;
    opacity: 0.8;
  }
  .btn_member {
    /* display: inline-block; */
    text-align: center;
    width: 66px;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.8);
    border: 0.01rem solid rgba(255, 255, 255, 1);
    border-radius: 15px;
    /* display:flex; */
  }

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
  .server_btn1 {
    padding: 16px 61px;
    box-sizing: border-box;
    border-radius: 10px;
    font-size: 30px;
    color: #bf9764;
    border: 2px solid #bf9764;
    &.last {
      margin-bottom: 40px;
    }
  }
  .server_codeImg {
    width: 321px;
    height: 321px;
    margin: 0 auto;
  }
  .server_codeImg > img {
    width: 100%;
  }
  /* server dialog end */
  /*新ui*/
  .form_cells_form .form_cell {
    padding: 0 48px;
  }
  .form_cell .form_cellBd {
    border: none;
  }
  .user_nav {
    padding: 0 24px;
    box-sizing: border-box;
  }
  .user_nav_item {
    margin-top: 40px;
    padding: 26px 0;
    box-sizing: border-box;
  }
  .mt15 {
    margin-top: 15px;
  }
  .mb22 {
    margin-bottom: 22px;
  }
  .mr20 {
    margin-right: 20px;
  }
  .van-dialog {
    height: auto;
  }
  .gzhewm {
    width: 320px;
    margin-top: 28px;
  }
  .list_line {
    padding: 0 30px;
    box-sizing: border-box;
    &:active {
      opacity: 0.6;
    }
  }
  .list_line .iconfont {
    font-size: 24px;
    color: #cccccc;
  }
  .list_line > div > svg,
  .list_line > div > img {
    width: 56px;
    height: 56px;
    margin-right: 16px;
  }
  .user_nav {
    svg {
      width: 70px;
      height: 70px;
      .svgColor;
    }
  }
  .paddingtb40 {
    padding: 40px 0;
    box-sizing: border-box;
  }
  .blance {
    font-size: 70px;
    padding: 20px 0 0 0;
    line-height: 1.5;
  }
  .service-title {
    color: #10141d;
    font-size: 36px;
    margin: 46px 0 40px 0;
    text-align: center;
  }
  .server-hot {
    color: #999999;
    font-size: 26px;
    margin-bottom: 24px;
  }
  .point-balance {
    color: #ffffff;
    font-size: 27px;
  }
  .link-name {
    line-height: 37px;
    font-size: 26px;
    color: #333333;
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
      color: #ffffff;
      background: #bf9761;
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
</style>
