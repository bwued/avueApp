<template>
  <div>
    <top-msg header-name="排行活动" />
    <div class="con_body">
      <div class="top">
        <div class="w100 flex-row-between top_tab maincolor">
          <div :class="tabType==0?'tab_selected':''" @click="changeType(0)">
            上期活动回顾
          </div>
          <div :class="tabType==1?'tab_selected':''" @click="changeType(1)">
            近期活动进展
          </div>
        </div>
      </div>
      <div class="w100 flex-column-center">
        <div class="w100 cen colorfff size44 bold">
          {{ name }}
        </div>
        <div class="w100 cen colorccc size24 mt5">
          {{ start_time|timeToFormatDay }}至{{ end_time|timeToFormatDay }}
        </div>
      </div>
      <router-link to="/awardRecord" class="reward size24">
        <div>奖励</div>
        <div>记录</div>
      </router-link>
      <div class="rankingList_warp flex-column-center">
        <div class="rankingList_items w100">
          <div v-for="(item,index) in rankingList" :key="index" class="rankingList_item flex-row-between">
            <div v-if="index==0" class="item_img">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yi" />
              </svg>
            </div>
            <div v-if="index==1" class="item_img">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-er" />
              </svg>
            </div>
            <div v-if="index==2" class="item_img">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-san" />
              </svg>
            </div>
            <div v-if="index>2" class="item_img">
              <i class="item_imgs size24">{{ index }}</i>
            </div>
            <div class="flex1">
              <div class="flex-row-between size30 bold">
                <span class="color333">{{ item.id_card_name }}</span>
                <span class="colorED02">{{ item.income_amount }}</span>
              </div>
              <div class="flex-row-between mt5 size24 color999">
                <span>成功推荐{{ item.team_effective_member_count }}人</span>
                <span>累计收入(元)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tip color333 size24 jiangpin">
        <div class="tip_title">
          <img src="../../../static/img/jiangpinshuoming.png">
        </div>
        <div v-html="prize_description" />
      </div>
      <div class="tip color333 size24 huodong">
        <div class="tip_title">
          <img src="../../../static/img/huodongshuoming.png">
        </div>
        <div v-html="activity_description" />
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import { timeToFormatDay } from '@/utils/date'
export default {
  name: 'RankingActivities',
  components: { topMsg },
  filters: {
    timeToFormatDay
  },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true, //
      rankingList: '', // 用户数据
      tabType: 1, // 类型切换
      campaignId: '', // 活动id
      activity_description: '', // 活动说明
      end_time: '', // 结束时间
      limit_number: null, // 上榜人数
      name: '', // 活动名称
      prize_description: '', // 奖品说明
      start_time: '', // 开始时间
      status: ''// 活动状态
    }
  },
  created() {
    this.thisTitle()
    if (this.tabType === 1) {
      this.getLatelyProgressingFun()
    } else {
      this.getLatelyEndedFun()
    }
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '排行活动'
    },
    /* 获取最近已结束的活动详情 */
    getLatelyEndedFun() {
      const that = this
      that.$api.recommend.getLatelyEnded().then(res => {
        // console.log(res)
        if (res.data.data) {
          that.campaignId = res.data.data.id
          that.activity_description = res.data.data.activity_description
          that.end_time = res.data.data.end_time
          that.name = res.data.data.name
          that.prize_description = res.data.data.prize_description
          that.start_time = res.data.data.start_time
        } else {
          that.$toast({
            message: '无近期活动',
            position: 'middle'
          })
          return Promise.reject({
            notRealPromiseException: true
          })
        }
      }).then(() => {
        that.getRankingFun()
      }).catch(ex => {
        console.log('ex: ', ex)
        if (ex.notRealPromiseException) {
          // 一切正常，只是通过 catch 方法来中止 promise chain
          // 也就是中止 promise p2 的执行
          return true
        }
        // 真正发生异常
        return false
      })
    },
    /* 获取最近进行中的活动详情 */
    getLatelyProgressingFun() {
      const that = this
      that.$api.recommend.getLatelyProgressing().then(res => {
        // console.log(res)
        if (res.data.data) {
          that.campaignId = res.data.data.id
          that.activity_description = res.data.data.activity_description
          that.end_time = res.data.data.end_time
          that.name = res.data.data.name
          that.prize_description = res.data.data.prize_description
          that.start_time = res.data.data.start_time
        } else {
          that.$toast({
            message: '无进行中活动',
            position: 'middle'
          })
          return Promise.reject({
            notRealPromiseException: true
          })
        }
      }).then(() => {
        that.getRankingFun()
      }).catch(ex => {
        console.log('ex: ', ex)
        if (ex.notRealPromiseException) {
          // 一切正常，只是通过 catch 方法来中止 promise chain
          // 也就是中止 promise p2 的执行
          return true
        }
        // 真正发生异常
        return false
      })
    },
    /* 获取活动的榜单 */
    getRankingFun() {
      const that = this
      that.$api.recommend.getRanking({
        campaignId: that.campaignId
      }).then(res => {
        console.log(res)
        this.rankingList = res.data.data.sort(this.compareUp(res.data.data, 'rank'))
      })
    },
    compareUp(arr, propertyName) { // 升序排序
      if ((typeof arr[0][propertyName]) !== 'number') { // 属性值为非数字
        return function(object1, object2) {
          var value1 = object1[propertyName]
          var value2 = object2[propertyName]
          return value1.localeCompare(value2)
        }
      } else {
        return function(object1, object2) { // 属性值为数字
          var value1 = object1[propertyName]
          var value2 = object2[propertyName]
          return value1 - value2
        }
      }
    },
    changeType(tabType) {
      this.tabType = tabType
      if (this.tabType === 1) {
        this.getLatelyProgressingFun()
      } else {
        this.getLatelyEndedFun()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .con_body{
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 3415px;
    background-image: url("../../../static/img/paihangbangbg.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .rankingList_warp{
    margin: 40px 24px 0 24px;
    padding: 154px 80px 60px 48px;
    box-sizing: border-box;
    width: 702px;
    height: 1264px;
    background-image: url("../../../static/img/paihangbang.png");
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow:0px 5px 30px rgba(3,43,90,0.5);
  }
  .rankingList_item{
    padding-top: 30px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    border-bottom: 0.01 solid #eeeeee;
  }
  .rankingList_item:last-child{
    border-bottom: 0;
  }
  .item_img>svg{
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
  .item_imgs{
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-left: 5px;
    margin-right: 10px;
    color: #ffffff;
    background-color: #CCCCCC;
    border-radius: 20px;
    overflow: hidden;
  }
  .top{
    margin: 24px 54px 48px 54px;
  }
  .top_tab{
    border:4px solid rgba(0,134,242,1);
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
    opacity:1;
    border-radius:100px;
    div{
      color: #fff;
    }
  }
  .top_tab>div{
    width: 50%;
    line-height: 70px;
    text-align: center;
    font-size: 28px;
    font-weight: bold;
  }
  .flex-column-center{
    div{
      color: #fff;
    }
  }
  .tab_selected{
    background:rgba(0,134,242,1);
    border:3px solid rgba(0,134,242,1);
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
    opacity:1;
    border-radius:100px;
    color: #ffffff;
  }
  .reward{
    position: absolute;
    top: 154px;
    right: 0;
    border-radius:56px 0px 0px 56px;
    padding: 14px 20px 14px 40px;
    background-color: @mainColorD;
    z-index: 10;
    div{
      color: #ffffff;
    }
  }
  .tip{
    position: relative;
    width: 702px;
    margin: 148px 24px 0 24px;
    padding: 88px 40px 60px 40px;
    box-sizing: border-box;
    background:rgba(255,255,255,1);
    box-shadow:0px 5px 30px rgba(3,43,90,0.5);
    opacity:1;
    border-radius:15px;
    font-family:PingFang SC;
    font-weight:500;
    line-height:38px;
    letter-spacing:2px;
  }
  .jiangpin{
    min-height: 986px;
  }
  .huodong{
    min-height: 486px;
  }
  .tip_title{
    position: absolute;
    top:-47px;
    left: 211px;
    width:280px;
    height:94px;
    background:rgba(255,255,255,1);
    border:10px solid rgba(0,134,242,1);
    opacity:1;
    border-radius:100px;
  }
  .tip_title>img{
    width: 184px;
    height: 50px;
    margin: 24px 48px;
  }
</style>
