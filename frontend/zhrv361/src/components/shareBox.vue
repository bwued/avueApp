<template>
  <div class="con_body position_re">
    <slot name="topImg" />
    <slot name="shareBox" />
  </div>
</template>

<script>
export default {
  name: 'ShareBox',
  // 接受父组件的值
  props: {

  },
  /* data必须是函数*/
  data: function() {
    return {

    }
  },
  computed: {

  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  .con_body{
    overflow: hidden;
    padding: 24px 24px 0 24px;
    box-sizing: border-box;
    img{
      width: 100%;
      margin-bottom: 24px;
      box-shadow:0px 10px 20px rgba(0,0,0,0.2);
      border-radius:10px;
    }
    .box{
      padding: 40px 40px 4px 24px;
      box-sizing: border-box;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 20px rgba(14,66,128,0.08);
      border-radius:10px;
      .item{
        margin-bottom: 36px;
        .main{
          width: 600px;
          .title{
            font-size: 28px;
            color: #333333;
          }
          .content{
            font-size: 24px;
            color: @tipTextColor;
          }
        }
        i{
          font-size: 24px;
          color:#cccccc;
        }
      }
    }
  }
</style>
