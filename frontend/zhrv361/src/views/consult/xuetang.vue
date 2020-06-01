<template>
  <div>
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="backHistory">
      <div class="text">
        {{ z_name }}
      </div>
      <div class="fx" @click="share">
        分享
      </div>
    </div>
    <!-- <div class="text">{{z_name}}</div> -->
    <div class="box">
      {{ z_sub_name }}
    </div>
    <van-actionsheet v-model="isShareSheet" :actions="shareActions" @select="onShareSelect" />
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
// import topMsg from '@/components/topMsg'
export default {
  name: 'Xuetang',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true, //
      z_name: [],
      z_sub_name: [],
      isShareSheet: false, // 分享
      shareActions: [
        { key: 'session', name: '朋友' },
        { key: 'timeline', name: '朋友圈' }
      ]
    }
  },

  created() {},
  mounted() {
    (this.z_name = this.$route.query.z_name),
    (this.z_sub_name = this.$route.query.z_sub_name)
  },
  methods: {
    backHistory() {
      this.$router.go(-1) // 返回上一层
    },
    share() {
      const that = this
      that.isShareSheet = true
      this.onShareSelect()
    },
    onShareSelect(item) {
      var test = window.location.href
      // console.log(test);
      const that = this
      const wx = api.require('wx')
      wx.sharetext(
        {
          apiKey: 'wx02df33802d384b32',
          scene: item.key,
          contentUrl: test
        },
        function(ret, err) {
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
        }
      )
      that.isShareSheet = false
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  display: flex;
  flex-flow: row;
  background: white;
  padding-bottom: 0.8rem;
  width: 100%;
  img {
    width: 0.6rem;
    height: 0.9rem;
    margin-top: 0.8rem;
    margin-left: 1.2rem;
  }
  .text {
    color: #000000ff;
    font-size: 1.2rem;
    margin-top: 0.6rem;
    margin-left: 7rem;
  }
}
// .text {
//   text-align: center;
//   color: #bf9761;
//   margin-top: 1rem;
//   font-size: 1.2rem;
// }
.box {
  font-size: 1rem;
  text-indent: 2em;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  line-height: 2rem;
  //   background: white;
}
.fx {
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  height: 36px;
  font-size: 1rem;
}
</style>
