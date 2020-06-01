<template>
  <div class="recommend-page">
    <top-msg header-name="分享赚钱" />
    <div class="share_codeImg" @click="closeToast">
      <img ref="qrcodePoster" :src="shareURL" alt="分享图" style="display: none">
    </div>
    <div ref="shareBox" class="con_body flex-column-center">
      <div class="qrCode_box flex-column-center">
        <div class="qrCode">
          <qrcode :value="codeValue" :src="codeValue" :options="{width: 144}" tag="img" />
        </div>
        <span class="qrCode_tip1 bold">点击保存二维码 注册下载</span>
        <span class="qrCode_tip2">分享好友即可获得利益</span>
        <button class="btn" @click="save">
          保存
        </button>
      </div>
      <div class="tip_text1 bold">
        日入<span>5000+</span>，月入<span>10万+</span>创业会员过万
      </div>
      <div class="tip_text2">
        绝无风险的创业政策
      </div>
      <div class="tip_text2">
        绝无仅有的躺赚模式
      </div>
      <div class="tip_text2">
        绝对引领的时代趋势
      </div>
      <div class="footer_text flex-row-between">
        <div />
        <span>合作伙伴</span>
        <div />
      </div>
      <div class="footer flex-row-between">
        <div class="flex-column-center">
          <img src="../../../static/img/wechat@2x.png" alt="">
          <span>微信</span>
        </div>
        <div class="flex-column-center">
          <img src="../../../static/img/union@2x.png" alt="">
          <span>银联</span>
        </div>
        <div class="flex-column-center">
          <img src="../../../static/img/ali@2x.png" alt="">
          <span>支付宝</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import Qrcode from '@chenfengyuan/vue-qrcode/src'
import html2canvas from 'html2canvas'
import { ImagePreview } from 'vant'
export default {
  name: 'Recommend',
  components: { topMsg, Qrcode },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true,
      isLoading: '',
      codeValue: '',
      shareURL: '',
      imgPreview: ''// 预览图片
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  watch: {
    shareURL(val, oldval) {
      // 监听到shareURL有变化以后 说明新图片已经生成 隐藏DOM
      this.$refs.shareBox.style.display = 'none'
      this.$refs.qrcodePoster.style.display = 'block'
    }
  },
  created() {
    this.thisTitle()
    this.codeValue =
    process.env.VUE_APP_BASE_ADDRESS +
    '/#/register?referrer=' +
    this.userInfo.username
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '分享赚钱'
    },
    save() {
      this.isLoading = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '图片正在生成中,请稍等...'
      })
      const that = this
      // 合成分享图, usrCORS不为true时无法加载不同源图片
      html2canvas(that.$refs.shareBox, {
        scale: 2,
        useCORS: true
      }).then(function(canvas) {
        const shareURL = canvas.toDataURL('image/png')
        that.shareURL = shareURL
        // eslint-disable-next-line no-undef
        const trans = api.require('trans')
        trans.saveImage({
          base64Str: shareURL.replace('data:image/png;base64,', ''),
          album: true,
          imgPath: 'fs://img/bidefu',
          imgName: `shareCode_${new Date().getTime()}.png`
        }, function(ret, err) {
          that.isLoading.clear()
          if (ret.status) {
            that.$toast({
              message: '图片已保存, 分享给你的好友吧',
              position: 'middle',
              duration: 2000
            })
          } else {
            that.$toast({
              message: `图片保存失败：${err.msg}`,
              position: 'middle',
              duration: 2000
            })
          }
        })
      })
    },
    /* 点击关闭toast*/
    closeToast() {
      const that = this
      this.isLoading.clear()
      this.$toast.clear()
      that.imgPreview = ImagePreview({
        images: [this.shareURL],
        onClose() {
          that.$router.go(-1)
        },
        asyncClose: true
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.imgPreview) this.imgPreview.close()
    next()
  }
}
</script>

<style lang="less" scoped>
.recommend-page{
  height: 100vh;
  background-color: black;
  .share_codeImg {
    width: 100%;
  }
  .share_codeImg > img {
    width: 100%;
  }
  .con_body{
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 1206px;
    background-image: url("../../../static/img/bg@2x.png");
    background-repeat: no-repeat;
    background-size: cover;
    padding: 60px 95px 0 95px;
    box-sizing: border-box;
    .qrCode_box{
      width: 100%;
      padding: 80px 0 36px 0;
      box-sizing: border-box;
      background:rgba(233,183,107,1);
      border-radius:10px;
      margin-bottom: 34px;
      .qrCode{
        width:300px;
        height:300px;
        background:rgba(255,255,255,1);
        margin-bottom: 34px;
        img{
          width: 100%;
        }
      }
      .qrCode_tip1{
        color: subTextColor;
        font-size: 28px;
        margin-bottom: 12px;
      }
      .qrCode_tip2{
        color: subTextColor;
        font-size: 24px;
      }
      .btn{
        padding: 12px 64px;
        margin-top: 12px;
      }
    }
    .tip_text1{
      color: white;
      font-size: 30px;
      margin-bottom: 28px;
      span{
        color: @mainColorE;
      }
    }
    .tip_text2{
      color: white;
      font-size: 30px;
      margin-bottom: 10px;
    }
    .footer_text{
      width: 100%;
      margin-top: 48px;
      margin-bottom: 34px;
      span{
        color: @tipTextColor;
        font-size: 24px;
      }
      div{
        width:201px;
        height:1px;
        background:rgba(121,118,113,1);
      }
    }
    .footer{
      width: 100%;
      div{
        img{
          width: 90px;
          height: 90px;
          margin-bottom: 20px;
        }
        span{
          color: #cccccc;
          font-size: 24px;
        }
      }
      div:nth-child(2){
        img{
          width: 119px;
          height: 76px;
          margin: 7px 0 27px 0;
        }
      }
    }
  }
}

</style>
