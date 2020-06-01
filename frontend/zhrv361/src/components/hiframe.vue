<template>
  <div>
   <div class="top">
      <img @click="goback" src="../../static/img/xiangqing@2x.png" style="position: absolute; left: 0rem; top: 0; ">
      <img @click="close" src="../../static/img/h_close.png" style="position: absolute; right: 1rem; top: 0; ">
      <div class="text">
        {{title}}
      </div>
      
    </div>
    <iframe id="bwIframe" ref="iframe" style="width: 100%; height: 100%;" scrolling="yes" frameborder="no" :src="url" />
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
      url: '',
      refer:'',
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
      this.refer = this.$route.query.refer
      console.log(this.url)
      console.log(this.title)
      console.log(this.refer)
    },
    goback() {
      this.$router.go(-1); // TODO 返回上一页
    },
    close() {
      this.$router.push(this.refer)
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
      text-align: center;
      width: 100%;
      display: inline-block;
      margin-top: 0.6rem;
    }
  }
</style>
