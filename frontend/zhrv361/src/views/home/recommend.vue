/* eslint-disable no-mixed-spaces-and-tabs */
<template>
  <!-- ETC 积分兑换  -->
  <div class="recommend-page">
    <ul class="list">
      <li v-for="(item,index) in recommendList" :key="index" class="item flex-column-center" @click="openLink(item.id,item.url,item.name,item.jump_mode)">
        <div class="img-main">
          <img :src="item.image_item && item.image_item.url">
        </div>
        <div class="msg">
          <div class="subtitle">
            {{ item.name }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Recommend',
  data() {
    return {
      recommendList: []
    }
  },
  created() {
    this.getThirdPartyContentFun()
  },
  methods: {
    openLink(id, url, name, jump_mode) {
      if (jump_mode == 'iframe') {
        this.$router.push({ path: '/hiframe', query: { title: name, url: url, refer: '/home' }})
      } else if (jump_mode == 'webview') {
		    this.openWebView(url, name)
      } else if (jump_mode == 'location') {
        window.location.href = url
      } else {
          this.$openThirdLinks(id, url, name)
        }
    },
    /* 获取第三方功能 */
    getThirdPartyContentFun() {
      const that = this
      that.$api.recommend.getThirdPartyContent().then(res => {
        console.log(res)
        this.recommendList = res.data.data || []
        this.recommendList = this.recommendList.filter((item) => item.name.indexOf('2_') !== 0)
      })
    },
    openWebView(url, title) {
      if (url === '#') {
        this.$dialog({
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
    /* 兼容其他 ios webview */
    open(id, url, name) {
      const that = this
      that.url = url
      that.title = name
      if (url === '#') {
        this.$dialog({
          title: '提示',
          message: '即将上线，敬请期待！',
          confirmButtonText: '确定'
        })
      } else {
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        if (isiOS) {
          var message = {
            title: that.title,
            url: url,
            referer: 'http://www.zhsc198.com/'
          }
          window.webkit.messageHandlers.OpenWechat.postMessage(message) // TODO
        } else {
          that.$router.push({ path: '/iframe', query: { url: that.url, title: that.title }})
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.recommend-page{
  background: #fff;
  padding: 0 61px;
  box-sizing: border-box;
  // box-shadow:0px 10px 20px rgba(14,66,128,0.08);
  // border-radius:10px;
  .title{
    font-size: 30px;
    font-weight: bold;
    margin-right: 8px;
    i{
      font-size: 33px;
      color:@mainColorB;
    }
  }
  .list{
    display: flex;
    justify-content: space-between;
    padding: 30px 0 30px 0;
    box-sizing: border-box;
    flex-wrap: wrap;
    .item{
      display: inline-block;
      .img-main {
        text-align: center;
      }
      img{
        width: 83px;
        height: 83px;
        margin: 0 0 24px 0;
        border-radius: 50%;
      }
      .subtitle{
        height: 37px;
        line-height: 37px;
        font-size: 26px;
        font-weight: 500;
        text-align: center;
      }
    }
  }
}
</style>

