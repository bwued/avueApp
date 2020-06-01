<template>
  <div>
   <div class="top">
      <!--<img @click="$router.push('/proceeds')" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2489612560,2670712058&fm=26&gp=0.jpg">-->
      <img @click="$router.push('/proceeds')" src="../../static/img/xiangqing@2x.png">
      <div class="text">
        支付
      </div>
    </div>
    <iframe id="bwIframe" ref="iframe" style="width: 100%; height: 100%;" scrolling="yse" frameborder="no" :src="url" />
  </div>
</template>
<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'Iframe',
  components: { topMsg },
  data: function() {
    return {
      title: '',
      url: ''
    }
  },
  created() {
  },
  mounted() {
    this.init()
    //       this.refer();
    /**
             * iframe-宽高自适应显示
             */
    const oIframe = document.getElementById('bwIframe')
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
    },
    refer() {
      var xhr = new XMLHttpRequest()
      var url = this.$route.query.url
      xhr.open('GET', url, true)
      xhr.onload = function(evt) {
        if (this.status == 200) {
          var txt = this.responseText
          var wapFrame = document.getElementById('bwIframe')
          txt = txt.replace(/<head>/i, '<head><base href="' + url + '" target="_self"/>')
          wapFrame.contentWindow.document.write(txt)
        }
      }
      xhr.setRequestHeader('Referer', 'http://www.zhsc198.com/')
      xhr.send(null)
    }

  }
}
</script>
<style lang="less" scoped>
  //头部返回
  .top {
    display: flex;
    flex-flow: row;
    background: #fff;
    padding-bottom: 0.8rem;
    // position: fixed;
    width: 100%;
    img {
      width: 1.2rem;
      height: 1.4rem;
      margin-top: 0.8rem;
      margin-left: 1rem;
    }
    .text {
      color: #000000ff;
      font-size: 1.3rem;
      margin-top: 0.6rem;
      margin-left: 8rem;
    }
  }
</style>
