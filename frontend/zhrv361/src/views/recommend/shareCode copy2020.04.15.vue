<template>
  <div>
    <top-msg v-if="J_udge==='APICloud'" header-name="分享二维码" share-show="true" @shareSheet="shareSheet()" />
    <top-msg v-if="J_udge==='APIyun'" header-name="分享二维码" share-show="true" @shareSheet="onShareSelectLx()" />
    <div class="con_body">
      <!-- <div class="share_codeImg" @click="closeToast">
        <img ref="qrcodePoster" :src="shareURL" alt="分享图">
      </div> -->
      <div ref="shareBox" class="share_codeImg">
        <qrcode
          id="qrcodeImg"
          :value="codeValue"
          :src="codeValue"
          :options="{width: 144}"
          :class="isWechat ? 'share_code' : 'share_code share_code2'"
          tag="img"
        />
        <img id="backgroundImg" ref="posterImg" :src="posterURL" crossOrigin="anonymous">
      </div>
    </div>
    <van-actionsheet
      v-if="J_udge==='APICloud'"
      v-model="isShareSheet"
      :actions="shareActions"
      @select="onShareSelect"
    />
    <van-actionsheet
      v-if="J_udge==='APIyun'"
      v-model="isShareSheet"
      :actions="shareActions"
      @select="onShareSelectLx"
    />
  </div>
</template>

<script>
import Qrcode from '@chenfengyuan/vue-qrcode/dist/vue-qrcode'
import topMsg from '@/components/topMsg'
import html2canvas from 'html2canvas'
// import { ImagePreview } from 'vant'
import 'vant/lib/image-preview/style'
export default {
  name: 'ShareCode',
  components: { topMsg, Qrcode },
  /* data必须是函数*/
  data: function() {
    return {
      J_udge: 'APICloud',
      // J_udge: 'APIyun',
      // 划动轮播图
      z_img: {
        fenxiang1: require('../../../static/img/fenxiang1.png'),
        fenxiang2: require('../../../static/img/fenxiang2.png'),
        fenxiang3: require('../../../static/img/fenxiang3.png'),
        fenxiang4: require('../../../static/img/fenxiang4.png'),
        fenxiang5: require('../../../static/img/fenxiang5.png'),
        fenxiang6: require('../../../static/img/fenxiang6.png')
      },
      loading: true,
      codeValue: '', // 二维码地址链接
      shareURL: '',
      posterURL: '',
      isLoading: '', // 加载loading
      isTime: '',
      imgPreview: '', // 预览图片
      imgName: '',
      isShareSheet: false, // 分享
      shareActions: [
        { key: 'session', name: '微信朋友' },
        { key: 'timeline', name: '微信朋友圈' }
      ]
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    canvasRenderWidth() {
      return this.canvasWidth * this.rate
    },
    canvasRenderHeight() {
      return this.canvasHeight * this.rate
    },
    isWechat() {
      return this.$store.state.isWechat
    }
  },
  watch: {
    shareURL(val, oldval) {
      // 监听到shareURL有变化以后 说明新图片已经生成 隐藏DOM
      // this.$refs.shareBox.style.display = 'none'
      // this.$refs.qrcodePoster.style.display = 'block'
    }
  },
  created() {
    console.log('shareCode')
    this.thisTitle()
    //    this.codeValue = 'http://120.79.74.34:8080/h5/zhihuiren.html?referrer=' + this.userInfo.username
    // this.codeValue = 'https://www.pgyer.com/oTCf'
    this.codeValue = this.STATIC_INFO.sharecodeUrl + '?referrer=' + this.userInfo.username
    console.log('分享图片 二维码:this.STATIC_INFO.sharecodeUrl ', this.codeValue)
    console.log('分享图片: ', this.$route.query.src)
    //    this.posterURL = this.$route.params.poster + '?random=' + Math.round(new Date() / 1000)
    this.posterURL = this.$route.query.src + '?random=' + Math.round(new Date() / 1000)

    var fxImg = this.$route.query.src
    var parrar = fxImg.split('/')
    var pname = parrar[parrar.length - 1]
    var pi = pname.split('.')[0]
    this.posterURL = this.z_img[pi]
    this.isLoading = this.$toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '图片正在生成中,请稍等...'
    })
  },
  mounted() {
    // 分享图
    this.printQrcodePosterT()
  },
  destroyed() {
    clearTimeout(this.isTime)
    this.$toast.clear()
  },
  methods: {
    /* 分享*/
    shareSheet() {
      this.isShareSheet = true
    },
    /* 原生分享图片合成 */
    onShareSelectLx() {
    // 使用说明若需要调用带链接分享例子 1，为带链接 ,99代表不需要传值，用99占位
    // baiwangxinxi.showShare("我是标题###我是分享内容###我是地址url###1###99###99");
    // 合成二维码的分享调用方法 2为合成二维码，99代表不需要传值，用99占位
      //        var fxImg = this.$route.params.poster
      var fxImg = this.$route.query.src
      var parrar = fxImg.split('/')
      var pname = parrar[parrar.length - 1]
      //        alert(pname)
      //        var base64Str =  this.shareURL.replace('data:image/png;base64,', '')
      console.log('...分享背景图...:' + pname)
      console.log('...二维码地址...:')
      console.log(this.codeValue)
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        console.log('智慧人###分享二维码###99###2###h5/static/img/' + pname + '###' + this.codeValue)
        baiwangxinxi.showShare('智慧人###分享二维码###99###2###h5/static/img/' + pname + '###' + this.codeValue)
      }
      if (isiOS) {
        var message = {
          method: 'post',
          params: {
            title: '智慧人',
            content: '分享二维码',
            url: '',
            imgurl: 'h5/static/img/' + pname,
            type: 2, // 1 就是 普通分析  2 就是 合成二维码 分享
            imgName: pname,
            QRUrl: this.codeValue
          },
          callback: 'http://h5.baiwang168.com.cn/index.html'
        }
        window.webkit.messageHandlers.showShare.postMessage(message)
      }
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
    // onShareSelect(item) {
    //   alert(22)
    //   console.log(item.key)
    //   const that = this
    //   const wx = api.require('wx')
    //   wx.shareImage({
    //     apiKey: 'wx02df33802d384b32',
    //     scene: item.key,
    //     contentUrl: 'fs://img/zhihuiren/' + that.imgName
    //   }, function(ret, err) {
    //     if (ret.status) {
    //       that.$toast({
    //         message: '分享成功',
    //         position: 'middle',
    //         duration: 2000
    //       })
    //     } else {
    //       that.$toast({
    //         message: err.code,
    //         position: 'middle',
    //         duration: 2000
    //       })
    //     }
    //   })
    //   this.isShareSheet = false
    // },
    /* 设置标题*/
    thisTitle: function() {
      document.title = '推荐码'
    },
    printQrcodePosterT() { // TODO
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
          // that.isLoading.clear()
          //                that.isShareSheet = true
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
      }, 1000)
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
      }, 1000)
    }
    /* 点击关闭toast*/
    // closeToast() {
    //   const that = this
    //   this.isLoading.clear()
    //   this.$toast.clear()
    //   that.imgPreview = ImagePreview({
    //     images: [this.shareURL],
    //     onClose() {
    //       that.$router.go(-1)
    //     },
    //     asyncClose: true
    //   })
    // }
  },
  beforeRouteLeave(to, from, next) {
    if (this.imgPreview) this.imgPreview.close()
    clearTimeout(this.isTime)
    next()
  }
}
</script>

<style lang="less" scoped>
#backgroundImg{
   height: 100%;
}
.share_code {
  position: absolute;
  right: 290px;
  bottom: 2rem;
}
// .share_code2 {
//   top: 700px;
// }
.share_codeImg {
  position: relative;
  width: 100%;
}
.share_codeImg > img {
  width: 100%;
}
.share_codeImg .share_code {
  width: 173px;
  height: 173px;
}
</style>
