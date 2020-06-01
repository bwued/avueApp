<template>
  <div>
    <top-msg :header-name="title" />
    <iframe id="bdIframe" ref="iframe" scrolling="yse" frameborder="no" :src="url" />
  </div>
</template>
<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'Iframe',
  components: { topMsg },
  data: function() {
    return {
      src: 'https://baidu.com',
      title: '',
      url: ''
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
      console.log(this.url)
      console.log(this.title)
    }
  }
}
</script>
<style lang="less" scoped>
#bdIframe{
     width: 100%;
     height: 100%;
}
</style>
