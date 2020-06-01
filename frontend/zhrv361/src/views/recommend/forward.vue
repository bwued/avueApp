<template>
  <div class="recommend-page">
    <top-msg header-name="转发图文" />
    <div class="con_body position_re">
      <van-list
        v-model="listLoading"
        :finished="listFinished"
        :error.sync="listError"
        finished-text="已加载完毕"
        error-text="请求失败，点击重新加载"
        @load="getListFun"
      >
        <template v-if="haveContent">
          <div
            v-for="item in list"
            :key="item.id"
            class="item"
          >
            <div class="item_time">
              <span>{{ item.publish_time | timeToFormatDay }}</span>
              <span>{{ item.publish_time | timeToFormatTime }}</span>
            </div>
            <div class="item_text">
              {{ item.content }}
            </div>
            <div class="item_img flex-row-warp">
              <img v-for="(item2,index2) in item.graphs" :key="index2" :src="item2.url" alt="">
            </div>
            <div class="item_btn flex-row-reverse">
              <div v-clipboard:copy="item.content" v-clipboard:success="onCopy" v-clipboard:error="onError" class="shareline">
                <p>复制文案</p>
              </div>
              <div @click="savePicture(item.graphs)">
                保存图片
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="unContent">
            <div class="unContent_img">
              <img src="../../../static/img/pic_nonelike.png">
            </div>
            <div>
              <span>没有相关记录</span>
            </div>
          </div>
        </template>
      </van-list>
    </div>
  </div>
</template>

<script>
import { timeToFormatDay, timeToFormatTime } from '@/utils/date'
import topMsg from '@/components/topMsg'
export default {
  name: 'Forward',
  components: { topMsg },
  filters: {
    timeToFormatDay,
    timeToFormatTime
  },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true, //

      list: [], // 用户数据
      listLoading: false, // loading
      listFinished: false, // 列表的finished
      listError: false, // 列表的error
      listPage: 0, // 列表的页数

      haveContent: false // 是否有内容
    }
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '转发图文'
    },
    onCopy() {
      this.$toast({
        message: '复制成功',
        position: 'middle'
      })
    },
    savePicture(obj) {
      const downloadPromises = []
      for (const i in obj) {
        downloadPromises.push(new Promise((resolve, reject) => {
          const timestamp = new Date().getTime()
          api.download({
            url: obj[i].url,
            savePath: 'fs://' + timestamp + '.jpeg',
            report: true,
            cache: true,
            allowResume: true
          }, function(ret, err) {
            if (ret) {
              console.log(ret)
              api.saveMediaToAlbum({
                path: 'fs://' + timestamp + '.jpeg'
              }, function(ret, err) {
                resolve()
              })
            } else {
              reject(err)
            }
          })
        }))
      }
      Promise.all(downloadPromises).then(() => {
        api.toast({
          msg: '图片已保存到本地'
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    onError() {
      this.$toast({
        message: '复制失败',
        position: 'middle'
      })
    },
    getListFun() {
      this.$api.recommend.forwardgraphList({
        page: this.listPage,
        size: 10
      })
        .then(res => {
          console.log(res)
          if (res.data.data) {
            // 有内容
            this.list = this.list.concat(res.data.data)
            this.haveContent = true
            if (res.data.data.has_next) {
              // 有下一页
              this.listPage++
              this.listLoading = false
            } else {
              // 无下一页
              this.listLoading = false
              this.listFinished = true
            }
          } else {
            // 无内容
            this.haveContent = false
            this.listLoading = false
            this.listFinished = true
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-page{
  .con_body{
    overflow: hidden;
    padding: 54px 24px 1px 64px;
    box-sizing: border-box;
    .item{
      width: 100%;
      padding: 48px 24px 24px 24px;
      box-sizing: border-box;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 20px rgba(14,66,128,0.08);
      border-radius:10px;
      position: relative;
      margin-bottom: 54px;
      .item_time{
        position: absolute;
        top:-30px;
        left: -30px;
        width:320px;
        height:60px;
        line-height: 60px;
        text-align: center;
        background:linear-gradient(45deg,@gradientA 0%,@gradientB 100%);
        border-radius:10px;
        span{
          color: @mainColorB
        }
        span:nth-child(1){
          font-size: 28px;
        }
        span:nth-child(2){
          margin-left: 12px;
          font-size: 24px;
        }
      }
      .item_text{
        color:@subTextColor;
        font-size: 24px;
      }
      .item_img{
        width: 100%;
        margin-bottom: 24px;
        img{
          width: 30%;
          margin-right: 3%;
          margin-top: 24px;
        }
      }
      .item_btn{
        width: 100%;
        div{
          color: @orange;
          font-size: 24px;
          padding: 10px 24px;
          box-sizing: border-box;
          border:2px solid rgba(221,143,61,1);
          border-radius:10px;
          margin-left: 24px;
          p{
            color: @orange;
          }
        }
      }
    }
  }
}

</style>
