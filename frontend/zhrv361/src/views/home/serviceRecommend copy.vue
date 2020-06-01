<template>
  <div class="service-recommend">
    <div class="title">
      服务推荐
    </div>
    <div class="recommends">
      <div class="recommends-left">
        <img v-if="left_img" :src="left_img.image_item.url" class="recommends-img1" alt="" @click="open(left_img.id,left_img.url,left_img.sub_name)">
      </div>
      <div class="recommends-right">
        <img v-if="right_img_1" :src="right_img_1.image_item.url" class="recommends-img2" alt="" @click="open(right_img_1.id,right_img_1.url,right_img_1.sub_name)">
        <img v-if="right_img_2" :src="right_img_2.image_item.url" class="recommends-img3" alt="" @click="openF(right_img_2.id,right_img_2.url,right_img_2.sub_name)">
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
      this.$router.push({ path: '/s_iframe', query: {
        url: 'http://forex.baiwang168.com.cn/h5/index.html#/?Authorization=' + localStorage.getItem('Client-Token') + '&returnUrl=' + url + '&a=' + Math.random(),
        title: name }})
    },
    open(id, url, name) {
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
        var u = navigator.userAgent
        // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        if (isiOS) {
          var message = {
            title: that.title,
            url: url,
            referer: 'http://www.zhsc198.com/'
          }
          window.webkit.messageHandlers.OpenWechat.postMessage(message) // TODO ios 微信支付
        } else {
          that.$router.push({ path: '/iframe', query: { url: that.url, title: that.title }})
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
