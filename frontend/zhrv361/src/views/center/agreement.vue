<template>
  <div>
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="backHistory">
      <div class="text">
        {{ text }}
      </div>
    </div>
    <div class="con_body">
      <div style="color: #000000ff;" v-html="msg" />
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'Agreement',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      text: '用户协议及服务条款',
      msg: '',
      html: "<b style='color:red'>v-html</b>"
    }
  },
  created() {
    this.thisTitle()
    this.$api.richText
      .getText({
        type: 'agreement'
      })
      .then(res => {
        console.log(res)
        this.msg = res.data.data.content
      })
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '用户协议及服务条款'
    },
    backHistory() {
      this.$router.go(-1) // 返回上一层
    }
  }
}
</script>

<style lang="less" scoped>
.z_app {
  background: #f5f5f5ff;
  height: 100%;
}
.top {
  display: flex;
  flex-flow: row;
  background: white;
  padding-bottom: 0.8rem;
  position: fixed;
  width: 100%;
  img {
    width: 0.8rem;
    height: 1.1rem;
    margin-top: 0.8rem;
    margin-left: 1rem;
  }
  .text {
    color: #000000ff;
    font-size: 1rem;
    margin-top: 0.6rem;
    margin-left: 7rem;
  }
}

.con_body {
  padding: 24px;
  box-sizing: border-box;
}
.agreement_title {
  padding: 18px 20px;
  font-size: 20px;
  color: #999999;
}
.agreement_items {
  margin-bottom: 27px;
}
.agreement_item .item_title {
  padding: 15px 0 15px 20px;
  font-size: 24px;
  background: #ffffff;
  color: #999999;
}
.agreement_item .item_content {
  padding: 10px 20px 15px 20px;
  font-size: 24px;
  color: #999999;
}
</style>
