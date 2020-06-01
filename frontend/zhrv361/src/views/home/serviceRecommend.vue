<template>
  <div class="service-recommend">
    <div class="title">
      服务推荐
    </div>
    <div class="recommends">
      <div class="recommends-left">
        <img v-if="left_img" :src="left_img.image_item.url" class="recommends-img1" alt="" @click="open(left_img.id,left_img.url,left_img.sub_name,left_img.jump_mode)">
      </div>
      <div class="recommends-right">
        <img v-if="right_img_1" :src="right_img_1.image_item.url" class="recommends-img2" alt="" @click="openTips(right_img_1.id,right_img_1.url,right_img_1.sub_name,right_img_1.jump_mode)">
        <img v-if="right_img_2" :src="right_img_2.image_item.url" class="recommends-img3" alt="" @click="open(right_img_2.id,right_img_2.url,right_img_2.sub_name,right_img_2.jump_mode)">
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'

export default {
  name: 'ServiceRecommend',
  data() {
    return {
      left_img: null,
      right_img_1: null,
      right_img_2: null,
      url: '',
      title: ''
    }
  },
  created() {
    this.getThirdPartyContentFun()
  },
  methods: {
    /* 获取第三方功能 */
    getThirdPartyContentFun() {
      this.$api.recommend.getThirdPartyContent().then(res => {
        console.log(res)
        const data = res.data.data || []
        data.filter((item) => item.name.indexOf('2_') === 0).forEach((item) => {
          const len = item.name.length
          const last = len - 2
          if (item.name.indexOf('_1') === last) {
            // item.name = item.name.replace(/(\d_)|(_\d)/g, '')
            this.left_img = item
          } else if (item.name.indexOf('_2') === last) {
            this.right_img_1 = item
          } else if (item.name.indexOf('_3') === last) {
            this.right_img_2 = item
          }
        })
      })
    },
    openF(id, url, name) {
      const that = this
      that.url = url
      that.title = name
      if (url === '#') {
        Dialog({
          title: '提示',
          message: '即将上线，敬请期待！',
          confirmButtonText: '确定'
        })
      } else {
        that.$router.push({ path: '/hiframe', query: { title: that.title, refer: '/home', url: that.url }})
      }
    },
    openWebView(url, title) {
	    if (url === '#') {
        Dialog({
          title: '提示',
          message: '即将上线，敬请期待！',
          confirmButtonText: '确定'
        })
      } else {
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        if (isAndroid) {
          var _url = title + '###' + url + '###http://www.zhsc198.com/'
          baiwangxinxi.OpenWechat(_url) // 安卓微信支付
        }
        if (isiOS) {
          var message = {
            title: title,
            url: url,
            referer: 'http://www.zhsc198.com/'
          }
          window.webkit.messageHandlers.OpenWechat.postMessage(message) // TODO
        }
      }
    },
    openAPI(url, name) {
      if (api) {
        api.openFrame({ // api 参考文档 http://www.apicloud.com/vipservice/price
          name: 'externalUrlFrame',
          url: url,
          bgColor: '#fff',
          historyGestureEnabled: true,
          rect: {
            x: 0,
            y: 42,
            w: api.winWidth,
            h: api.winHeight - 42
          },
          animation: {
            type: 'none'
          }
        })
      }
    },
    openTips(id, url, name, jump_mode) {
      console.log('信用卡跳转提示')
      const that = this
      that.$dialog({
        title: '温馨提示',
        message: '尊敬的用户，申请信用卡时，为提高申卡成功率，填写申请资料时的预留号码，请您使用智慧人注册账户号码和银行预留号码保持一致。',
        confirmButtonText: '确定'
      }).then(res => {
        that.open(id, url, name, jump_mode)
      })
    },
    // openTips(id, url, name, jump_mode) {
    //   const that = this
    //   that.$dialog({
    //     title: '温馨提示',
    //     message: '尊敬的用户，申请信用卡时，为提高申卡成功率，填写申请资料时的预留号码，请您使用智慧人注册账户号码和银行预留号码保持一致。',
    //     showCancelButton: true,
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     className: 'dialog',
    //     closeOnClickOverlay: true
    //   }).then(res => {
    //     if (res === 'confirm') {
    //       that.open(id, url, name, jump_mode)
    //     }
    //   })
    // },
    open(id, url, name, jump_mode) {
      if (url === '#') {
        Dialog({
          title: '提示',
          message: '即将上线，敬请期待！',
          confirmButtonText: '确定'
        })
      } else {
        if (jump_mode == 'iframe') {
          this.$router.push({ path: '/hiframe', query: { title: name, url: url, refer: '/home' }})
        } else if (jump_mode == 'webview') {
          this.openWebView(url, name)
        } else if (jump_mode == 'location') {
          window.location.href = url
        } else if (jump_mode == 'NJS') {
          this.openAPI(url, name)
        } else {
          // this.$openThirdLinks(id, url, name)
          this.openWebView(url, name) // 兼容iPhone手机， 默认值
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .service-recommend {
    padding: 30px 30px;
    .title {
      font-size: 30px;
      height: 42px;
      line-height: 42px;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 30px;
      color: #322E26;
    }
  }

  .recommends {
    overflow: hidden;
    .recommends-left {
      float: left;
      width: 260px;
      height: 260px;
      margin-right: 20px;
      .recommends-img1 {
        width: 100%;
        height: 100%;
      }
    }
    .recommends-last{
      overflow: hidden;
      clear: both;
       .recommends-img{
         width: 100%;
         height: 120px;
         margin-top: 20px;
         margin-bottom: 20px;
       }
    }
    .recommends-right {
      float: left;
      width: 410px;
      .recommends-img2 {
        width: 100%;
        height: 120px;
        margin-bottom: 20px;
      }
      .recommends-img3 {
        width: 100%;
        height: 120px;
      }
    }
  }
</style>
