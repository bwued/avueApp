<template>
  <div>
    <top-msg header-name="常见问题" />
    <div class="con_body">
      <div v-html="msg" />
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'

export default {
  name: 'Faq',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      msg: ''
    }
  },
  created() {
    this.thisTitle()
    this.$api.richText
      .getText({
        type: 'faq'
      })
      .then(res => {
        console.log(res)
        this.msg = res.data.data.content
        console.log(res.data.data.content)
      })
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '常见问题'
    }
  }
}
</script>

<style lang="less" scoped>

  .con_body{
    // font-size: 1.3rem;
    padding: 24px;
    box-sizing: border-box;
  }
  .question_title{
    padding: 15px 20px;
    font-size: 24px;
    color: #999999;
  }
  .question_content{
    padding: 15px 20px;
    font-size: 24px;
    background: #ffffff;
    color: #999999;
  }
  // h2 strong{
  //   height: 10rem;
  //   line-height: 2rem;
  // }
</style>
