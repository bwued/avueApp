<template>
  <div class="recommend-page">
    <top-msg :header-name="headername" />
    <div class="con_body">
      <div class="box">
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
              class="item flex-row-between"
              @click="goto(currentNav,type,item.date)"
            >
              <span>{{ item.date | timeToFormatDay }}</span>
              <div class="right flex-row-center">
                <span class="bold">{{ item.amount | parseAmount }}</span>
                <i class="iconfont icon-Path" />
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
  </div>
</template>

<script>
import { timeToFormatDay } from '@/utils/date'
import { parseAmount } from '@/utils/amount'
import topMsg from '@/components/topMsg'
export default {
  name: 'DailyEarnings',
  filters: {
    timeToFormatDay,
    parseAmount
  },
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      headername: '每日收益',
      msg: true, //

      list: [], // 用户数据
      listLoading: false, // loading
      listFinished: false, // 列表的finished
      listError: false, // 列表的error
      listPage: 1, // 列表的页数

      haveContent: false, // 是否有内容

      currentNav: '', // 账单顶部nav分类
      type: '', // 检索类型
      getApi: '' // 接口
    }
  },
  created() {
    this.currentNav = this.$store.state.billMsg.currentNav
    this.type = this.$store.state.billMsg.type
    if (this.type === 'MANAGER') {
      this.headername = '每月收益'
    }
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '每日收益'
    },
    getApiFun() {
      switch (this.currentNav) {
        case 1:
          this.getApi = 'getProfitsDailyList'
          break
        case 2:
          this.getApi = 'getWithdrawalDailyList'
          break
        case 3:
          this.getApi = 'getBonusDailyList'
          break
        case 4:
          this.getApi = 'getPointsDailyList'
          break
        case 5:
          this.getApi = 'getUpgradeDailyList'
          break
      }
    },
    async getListFun() {
      await this.getApiFun()
      if (this.currentNav === 3 && this.type.indexOf(',') > 1) {
        this.type = this.type.split(',')
      }
      this.$api.center[this.getApi]({
        page: this.listPage,
        pageSize: 10,
        type: this.type
      })
        .then(res => {
          // console.log(res)
          if (res.data.data.has_content) {
            // 有内容
            this.list = this.list.concat(res.data.data.content)
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
    },
    goto(currentNav, type, time) {
      this.$router.push({ path: '/bill', query: { current: currentNav, type: type, time: time }})
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-page{
  .con_body{
    padding: 24px;
    box-sizing: border-box;
    .box{
      width: 100%;
      padding: 40px 24px 1px 24px;
      box-sizing: border-box;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 20px rgba(14,66,128,0.08);
      border-radius:10px;
      .item{
        margin-bottom: 40px;
        span{
          font-size: 28px;
        }
        i{
          margin-left: 24px;
          font-size: 22px;
          color: #cccccc;
        }
      }
    }
  }
}

</style>
