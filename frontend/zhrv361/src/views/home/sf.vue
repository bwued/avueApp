<template>
  <div class="sfell">
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/home')">
      <div class="text">
        {{ text }}
      </div>
    </div>
    <div class="z_sfimg">
      <!-- <img src="../../../static/img/sf.png" class="img"> -->
      <img :src="sf_img" class="img">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: '',
      sf_img: ''
    }
  },
  created() {
    this.getforwardgraphList()
  },
  methods: {
    getforwardgraphList() {
      this.$api.recommend.forwardgraphList().then(res => {
        this.text = res.data.data[0].content
        this.sf_img = res.data.data[0].graphs[1].url
      })
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
    color: #666;
    font-size: 1.3rem;
    margin-top: 0.6rem;
    margin-left: 8rem;
  }
}
.z_sfimg{
    img{
         margin-top: 90px;
        width: 100%;
    }
}
</style>
