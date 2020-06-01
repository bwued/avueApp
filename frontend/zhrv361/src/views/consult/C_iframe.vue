<template>
  <div>
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/consult')">
      <div class="text">
        {{ title }}
      </div>
      <div class="fenxiang" @click="Z_Sharer()">
        分享
      </div>
    </div>
    <iframe id="bdIframe" ref="iframe" scrolling="yse" frameborder="no" :src="url" />
    <van-actionsheet
      v-model="isShareSheet"
      :actions="shareActions"
      @select="onShareSelect"
    />
  </div>
</template>
<script>
export default {
  name: 'Iframe',
  data: function() {
    return {
      src: 'https://baidu.com',
      title: '',
      url: '',
      isShareSheet: false, // 分享
      shareActions: [
        { key: 'session', name: '朋友' },
        { key: 'timeline', name: '朋友圈' }
      ]
    }
  },
  created() {
  },
  mounted() {
    this.init()
    /**
             * iframe-宽高自适应显示
             */
    const oIframe = document.getElementById('bdIframe')
    const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    // oIframe.style.width = (Number(deviceWidth)-220) + 'px'; //数字是页面布局宽度差值
    oIframe.style.height = Number(deviceHeight) + 'px' // 数字是页面布局高度差
  },
  methods: {
    init() {
      this.title = this.$route.query.title
      this.url = this.$route.query.url
    },
    Z_Sharer(item) {
      this.isShareSheet = true
    },
    onShareSelect(item) {
      console.log(item)
      const that = this
      const wx = api.require('wx')
      wx.shareVideo({
        apiKey: 'wx02df33802d384b32',
        scene: item.key,
        title: that.title,
        description: '分享内容的描述',
        // thumb : 'widget://res/iconfont-touxiang.png',
        contentUrl: that.url
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
    }
  }
}
</script>
<style lang="less" scoped>
//头部返回
.top {
  display: flex;
  flex-flow: row;
  background: white;
  padding-bottom: 0.8rem;
  position: fixed;
  width: 100%;
  img {
    width: 1rem;
    height: 1.5rem;
    margin-top: 0.8rem;
    margin-left: 1rem;
  }
  .text {
    color: #000000ff;
    font-size: 1.3rem;
    margin-top: 0.8rem;
    margin-left: 4.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    width: 50%;
  }
}
.fenxiang{
   color: #000000ff;
    font-size: 1.3rem;
    text-align: center;
    width: 18%;
   position: relative;
   top: .7rem;
   left: 1.2rem;
}
#bdIframe{
     width: 100%;
     height: 90%;
     margin-top: 3rem;
}
</style>
