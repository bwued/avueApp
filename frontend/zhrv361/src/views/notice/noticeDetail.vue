<template>
  <div>
    <top-msg header-name="公告详情" />
    <div class="notice-detail-page">
      <div class="title">
        {{ details.title }}
      </div>
      <div class="text clear">
        <span class="lt">{{ details.publisher }} {{ details.publish_time | timeToFormatDate }}</span>
        <span class="rt">{{ details.reading_number }}阅读</span>
      </div>
      <div class="dec" v-html="details.content" />
    </div>
  </div>
</template>
<script>
import { timeToFormatDate } from '@/utils/date'
import topMsg from '@/components/topMsg'
export default {
  name: 'NoticeDetail',
  components: { topMsg },
  filters: {
    timeToFormatDate
  },
  data() {
    return {
      id: this.$route.query.id,
      details: {}
    }
  },
  created() {
    this.thisTitle()
    this.announcementDetailFun()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '公告详情'
    },
    announcementDetailFun() {
      this.$api.home.announcementDetail({ announcementId: this.id }).then(res => {
        this.details = res.data.data
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.notice-detail-page{
  padding: 24px;
  box-sizing: border-box;
  .title{
    font-size: 32px;
    font-weight: bold;
  }
  .text{
    margin: 11px 0 30px;
    span{
      font-size: 24px;
      color: @lightGrey;
    }
  }
  .dec{
    font-size: 24px;
    line-height: 36px;
  }
}
</style>

