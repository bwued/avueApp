<template>
  <div class="recommend-page">
    <!-- <top-msg header-name="分享" /> -->
    <div ref="shareBox">
      <div class="con_body position_re">
        <div class="title">分享
          <img class="share-btn" src="../../../static/img/shareqrcode.png" alt="" @click="share">
        </div>
        <img src="../../../static/img/img_share_background.png" alt="">
      </div>
      <div class="qrcode">
        <div class="qrcode-main">
          <qrcode
            id="qrcodeImg"
            :value="codeValue"
            :src="codeValue"
            :options="{ margin: 0 }"
            tag="img"
            class="qrcode-img"
          />
          <div class="qrcode-tip">
            长按识别二维码 注册下载
          </div>
        </div>
      </div>
      <div class="partner">
        <div class="partner-img">
          <img src="../../../static/img/icon_wechat.png" class="wx-img" alt="">
          <p>微信</p>
        </div>
        <div class="partner-img">
          <img src="../../../static/img/icon_unionpay.png" class="yl-img" alt="">
          <p>银联</p>
        </div>
        <div class="partner-img">
          <img src="../../../static/img/icon_zhifubao.png" class="zfb-img" alt="">
          <p>支付宝</p>
        </div>
      </div>
    </div>
    <van-actionsheet
      v-model="isShareSheet"
      :actions="shareActions"
      @select="onShareSelect"
    />
    <tabbar :recommend-index="msg" />
  </div>
</template>

<script>
import Qrcode from '@chenfengyuan/vue-qrcode/dist/vue-qrcode'
import html2canvas from 'html2canvas'
import tabbar from '@/components/tabbar'
// import topMsg from '@/components/topMsg'
export default {
  name: 'share',
  components: { tabbar, Qrcode },
  /* data必须是函数*/
  data: function() {
    return {
      imgName: '',
      isShareSheet: false, // 分享
      shareActions: [
        { key: 'session', name: '朋友' },
        { key: 'timeline', name: '朋友圈' }
      ],
      codeValue: '',
      isLoading: null,
      msg: true //
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  activated() {
    api.setStatusBarStyle({
      color: '#3b3d5b',
      style: 'light',
      animated: false
    })
  },
  created() {
    // this.thisTitle()
    this.codeValue = this.STATIC_INFO.baseAddress + '/#/register?referrer=' + this.userInfo.username
  },
  mounted() {
    // api.setStatusBarStyle({
    //   color: '#3b3d5b',
    //   style: 'light',
    //   animated: false
    // })
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '分享'
    },
    goto(path) {
      this.$router.push(path)
    },
    share() {
      this.isLoading = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '图片正在生成中,请稍等...'
      })
      this.printQrcodePoster()
    },
    printQrcodePoster() {
      const that = this
      // 防止由于渲染过慢导致图片移位，nextTick无效
      setTimeout(() => {
        // 合成分享图, usrCORS不为true时无法加载不同源图片
        html2canvas(that.$refs.shareBox, {
          scale: 2,
          useCORS: true
        }).then(function(canvas) {
          const shareURL = canvas.toDataURL('image/png')
          that.shareURL = shareURL
          // eslint-disable-next-line no-undef
          that.imgName = `shareCode_${new Date().getTime()}.png`
          const trans = api.require('trans')
          trans.saveImage({
            base64Str: shareURL.replace('data:image/png;base64,', ''),
            album: true,
            imgPath: 'fs://img/zhihuiren',
            imgName: that.imgName
          }, function(ret, err) {
            that.isLoading.clear()
            if (ret.status) {
              that.isShareSheet = true
            } else {
              that.$toast({
                message: `图片保存失败：${err.msg}`,
                position: 'middle',
                duration: 2000
              })
            }
          })
        })
      }, 1000)
    },
    onShareSelect(item) {
      const that = this
      const wx = api.require('wx')
      wx.shareImage({
        apiKey: 'wx02df33802d384b32',
        scene: item.key,
        contentUrl: 'fs://img/zhihuiren/' + that.imgName
      }, function(ret, err) {
        if (ret.status) {
          that.$toast({
            message: '分享成功',
            position: 'middle',
            duration: 2000
          })
        } else {
          that.$toast({
            message: err.code,
            position: 'middle',
            duration: 2000
          })
        }
      })
      this.isShareSheet = false
    },
  }
}
</script>

<style lang="less" scoped>
.recommend-page{
  margin-bottom: 130px;
  .con_body{
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .title {
      width: 100%;
      position: absolute;
      top: 0;
      font-size: 36px;
      line-height: 2;
      text-align: center;
      letter-spacing: 5px;
      color: #ffffff;
      font-weight: 500;
    }
    .share-btn {
      position: absolute;
      top: 15px;
      right: 20px;
      width: 36px;
      height: 36px;
    }
    img{
      width: 4rem;
      height: 2rem;
    }
  }
  .qrcode {
    position: relative;
    height: 480px;
  }
  .qrcode-main {
    position: absolute;
    display: inline-block;
    border: 1px solid #CAA77B;
    width: 551px;
    height: 551px;
    top: -275px;
    left: 50%;
    margin: 0 auto;
    transform: translateX(-50%);
    padding: 26px 26px 26px 26px;
    background: #ffffff;
    box-sizing: border-box;
    .qrcode-img {
      width: 100%;
      height: 100%;
    }
  }
  .qrcode-tip {
    color: #999999;
    font-size: 36px;
    text-align: center;
    margin: 60px 0 0 0;
    font-weight:500;
    line-height:50px;
  }
  .partner {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin: 80px 80px 0 80px;
    padding: 50px 0 0 0;
    border-top: 1px solid #CCCCCC;
    &::before {
      content: '合作伙伴';
      position: absolute;
      z-index: 1;
      padding: 0 20px;
      top: -20px;
      font-size: 24px;
      background: #f8f8f8;
      left: 50%;
      transform: translateX(-50%);
      color: #999999;
      font-weight: 500;
    }
    .partner-img {
      display: inline-block;
      text-align: center;
    }
    .wx-img,
    .zfb-img {
      width: 90px;
      height: 90px;
    }
    .yl-img {
      margin: 14px 0 0 0;
      width: 119px;
      height: 76px;
    }
    p {
      margin: 20px 0 0 0;
      color: #757A85;
      font-size: 24px;
      line-height: 33px;
    }
  }
}

</style>
