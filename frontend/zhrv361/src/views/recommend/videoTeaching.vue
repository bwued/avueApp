<template>
  <div class="recommend-page">
    <top-msg header-name="视频教学" />
    <share-box>
      <template>
        <img slot="topImg" src="../../../static/img/banner2@2x.png" alt="">
      </template>
      <template>
        <div slot="shareBox" class="box">
          <div v-for="(item,index) in list" :key="index" class="item flex-row-between" @click="$openLinks(item.url,item.name)">
            <div class="main flex-column">
              <span class="title">{{ item.name }}</span>
            </div>
            <i class="iconfont icon-Path" />
          </div>
        </div>
      </template>
    </share-box>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import shareBox from '@/components/shareBox'
export default {
  name: 'VideoTeaching',
  components: { topMsg, shareBox },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true, //
      list: []
    }
  },
  created() {
    this.thisTitle()
    this.getListInfo()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '视频教学'
    },
    getListInfo() {
      this.$api.recommend.listVideo()
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
}

</style>
