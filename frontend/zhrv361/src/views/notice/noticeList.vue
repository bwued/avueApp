<template>
  <div>
    <top-msg header-name="公告" />
    <div class="notice-list-page">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多数据了"
        @load="announcementListFun"
      >
        <ul class="list">
          <li v-for="(item,index) in noticeList" :key="index" class="item" @click="$router.push('/noticeDetail?id='+item.id)">
            <div class="title textEllipsis">
              <span v-if="index===0" class="icon">最新</span>
              {{ item.title }}
            </div>
            <div class="dec textEllipsis2" v-html="item.content">
              <!-- {{ item.content }} -->
            </div>
            <div class="msg clear">
              <span class="text lt">{{ item.publisher }}  {{ item.publish_time | timeToFormatDate }}</span>
              <span :class="['rt text',item.read?'on':'']">
                <i :class="{'iconfont icon-weidu':true,'on':item.read}" />
                {{ item.reading_number }}阅读
              </span>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
  </div>
</template>
<script>
import { timeToFormatDate } from '@/utils/date'
import topMsg from '@/components/topMsg'
export default {
  name: 'NoticeList',
  components: { topMsg },
  filters: {
    timeToFormatDate
  },
  data() {
    return {
      isread: false,
      noticeList: [],
      loading: false,
      finished: false,
      currPage: 0
    }
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '公告'
    },
    announcementListFun() {
      this.loading = true
      this.$api.home.announcementList({ size: 10, page: this.currPage }).then(res => {
        // console.log(res.data.data)
        this.loading = false
        for (const i of res.data.data) {
          this.noticeList.push(i)
        }
        if (res.data.data.length === 0) {
          this.finished = true
        } else {
          this.currPage++
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.notice-list-page{
  padding: 12px 24px;
  box-sizing: border-box;
  .list{
    .item{
      background: #fff;
      border-radius: 15px;
      padding: 20px 24px;
      box-sizing: border-box;
      margin: 24px 0;
      box-shadow:0px 10px 20px rgba(14,66,128,0.05);
      .title{
        font-size: 30px;
        font-weight: bold;
        .icon{
          padding: 4px 11px;
          box-sizing: border-box;
          background:#D2AB76;
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          border-radius: 3px;
          margin-right: 8px;
          vertical-align: text-top;
        }
      }
      .dec{
        margin: 11px 0;
        font-size: 24px;
      }
      .msg{
        .text{
          font-size: 24px;
          color: @lightGrey;
          &.on{
            color: #D2AB76;
          }
          .iconfont{
            font-size: 28px;
            margin-right: 4px;
            &.on{
              color:#D2AB76;
            }
          }
        }
      }
    }
  }
}
.icon{
  color: #BF9761;
}
</style>

