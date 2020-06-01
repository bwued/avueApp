<template>
  <div class="mgb110 recommend-page">
    <!-- <top-msg header-name="微课" /> -->
    <div class="con_body position_re">
      <div v-for="(item,index) in list" :key="index" class="item" @click="$openLinks(item.url,item.name)">
        <img :src="item.image && item.image.url" alt="">
      </div>
    </div>
    <tabbar :home-index="msg" />
  </div>
</template>

<script>
import tabbar from '@/components/tabbar'
// import topMsg from '@/components/topMsg'
export default {
  name: 'Weike',
  components: { tabbar },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true, //
      list: []
    }
  },
  created() {
    // this.thisTitle()
    this.getListInfo()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '微课'
    },
    getListInfo() {
      this.$api.recommend.listLessonList()
        .then(res => {
          console.log(res)
          this.list = res.data.data
        })
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-page{
  margin-bottom: 130px;
  .con_body{
    overflow: hidden;
    padding: 24px 24px 0 24px;
    box-sizing: border-box;
    .item{
      position: relative;
      .text{
        position: absolute;
        top: 56px;
        left: 44px;
        p:first-child{
          font-size: 36px;
          color: white;
        }
        p:last-child{
          margin-top: 20px;
          font-size: 24px;
          color: white;
        }
      }
    }
    img{
      width: 100%;
      margin-bottom: 24px;
      box-shadow:0px 10px 20px rgba(0,0,0,0.2);
      border-radius:10px;
    }
  }
}

</style>
