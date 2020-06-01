<template>
  <div class="team-page">
    <top-msg :header-name="title" />
    <div class="team-header">
      <div class="team-statistic">
        <div class="content w100 flex-row-between" @click="$router.push('/directTeam')">
          <img src="../../../static/img/icon_wodetuangui.png" alt="" class="team-avatar">
          <div class="text flex-column flex1">
            <div class="title">
              我的团队
            </div>
            <div class="line1 flex-row-center">
              <p>直推： <span>{{ firstLevelCount }}</span>人</p>
              <p>实名认证： <span>{{ teamAuthCount }}</span>人</p>
            </div>
            <div class="line2 flex-row-center">
              <p>团队： <span>{{ teamCount }}</span>人</p>
              <!-- <p>VIP： <span>{{ vipRankCount }}</span>人</p> -->
            </div>
          </div>
          <i class="iconfont icon-Path" style="color: #ffffff;" />
        </div>
      </div>
    </div>
    <div class="team-rank">
      <div
        v-for="(item, index) in levelMemberList"
        :key="item.rankOrder"
        class="item"
      >
        <div
          class="team-rank-item"
          @click="$router.push({
            path: '/directTeam',
            query: {
              rankOrder: item.rank_order,
              rank_name: item.rank_name
            }
          })"
        >
          <!-- <div class="team-rank-item-info team-rank-item-icon">
            <img v-if="item.rank_name === '普通用户' || item.rank_name === '免费用户'" src="../../../static/img/pt.png">
            <img v-else-if="item.rank_name === 'VIP'" src="../../../static/img/VIP.png">
            <img v-else-if="item.rank_name === '银商'" src="../../../static/img/ys.png">
            <img v-else-if="item.rank_name === '金商'" src="../../../static/img/js.png">
            <img v-else-if="item.rank_name === '钻商'" src="../../../static/img/zs.png">
             <img v-else-if="item.rank_name === '大区服务商'" src="../../../static/img/daqu.png">
               <img v-else-if="item.rank_name === '全国运营中心'" src="../../../static/img/quguo.png">
                 <img v-else-if="item.rank_name === '股东'" src="../../../static/img/gd.jpeg">
                  <img v-else-if="item.rank_name === '总后台'" src="../../../static/img/zht.png">
          </div> -->
          <div class="team-rank-item-info team-rank-item-icon">
            <img :src="item.rank_logo ? item.rank_logo.url : ''" alt>
          </div>
          <div class="team-rank-item-info team-rank-item-summary">
            <span>{{ item.rank_name }}  (直推{{ item.first_level_count }}人)</span>
          </div>
          <div class="team-rank-item-info team-rank-item-statistic">
            <div class="text">
              团队{{ item.all_count }}人
            </div>
            <div class="text">
              间推{{ item.other_level_count }}人
            </div>
          </div>
          <van-icon name="arrow" />
        </div>
        <div v-if="levelMemberList.length !== index+1" class="team-rank-item-bottom" />
      </div>
    </div>
    <div class="tip">
      提示：由于涉及用户隐私问题，您只能看到您推广的直属用户
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'Team',
  components: { topMsg },
  data: function() {
    return {
      tradeAmountSum: 0,
      teamCount: 0,
      levelMemberList: [],
      teamAuthCount: 0,
      firstLevelCount: 0

    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    vipRankCount() {
      const hasVipRank = this.levelMemberList.length >= 2
      const vipIndex = this.levelMemberList.length - 2
      return hasVipRank
        ? this.levelMemberList[vipIndex].first_level_count + this.levelMemberList[vipIndex].other_level_count
        : 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const that = this
      this.$api.member.getUserTeam().then((res) => {
        // console.log(JSON.stringify(res))
        const data = res.data.data
        that.tradeAmountSum = data.trade_amount_sum
        that.teamCount = data.team_count
        that.teamAuthCount = data.team_auth_count
        that.firstLevelCount = data.first_level_count
        that.levelMemberList = data.level_member_list
        console.log('大区服务商')
        // console.log(res.data.data.level_member_list.rank_logo.url)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.team-page{
  background: #ffffff;
  height: 1px;
  min-height: 100%;
  .team-header {
    position: relative;
    overflow: hidden;
    padding-bottom: 1.1vh;
    .text{
      font-size: 24px;
    }
    .team-statistic-field{
      margin-top: 16px;
    }
  }
  .team-statistic {
    display: flex;
    justify-content: space-between;
    align-items: "center";
    position: relative;
    min-height: 236px;
    margin: 24px 24px 24px 24px;
    background-color: #ffffff;
    z-index: 99;
    background: linear-gradient(to right, #8a6333, #d4b988);
    box-shadow:0px 10px 20px rgba(153,153,153,0.3);
    border-radius:10px;
    padding: 54px 40px;
    box-sizing: border-box;
    .content{
      .team-avatar{
        width: 100px;
        height: 100px;
        margin-right: 40px;
        background: #ffffff;
      }
      i{
        font-size: 28px;
        color: #cccccc;
        margin-left: 16px;
      }
    }
    .text{
      font-size: 24px;
      .title{
        font-size: 30px;
        color: #ffffff;
      }
      .line1{
        margin: 12px 0;
        p {
          color: #ffffff;
        }
      }
      .line2 {
        p {
          color: #ffffff;
        }
      }
      span{
        color: #ffffff;
      }
      p{
        margin-right: 24px;
      }
    }
  }
  // .team-user-sum {
  //   flex-grow: 1;
  //   margin: 31px 36px;
  // }
  // .team-trade-sum {
  //   margin: 31px 120px;
  // }
  // .team-statistic-field {
  //   font-size: 24px;
  //   font-weight: 500;
  //   color: #333333;
  // }
  // .team-user-sum-data {
  //   font-size: 60px;
  //   font-weight: bold;
  //   color: @mainColorB;
  // }
  // .team-trade-sum-data {
  //   font-size: 40px;
  //   color: @mainColorB;
  // }
  .team-rank {
    // margin: 0 54px;
    padding: 0 2rem;
    border-radius: 15px;
    background-color: #ffffff;
    .item{
      &>.team-rank-item:last-child{
        border: none;
      }
    }
  }
  .team-rank-item {
    display: flex;
    align-items: center;
    padding: 34px 0 23px 0;
    height: 81px;
    border-bottom: 1px solid #DBDBDB;
    .text{
      color: @lightGrey;
    }
    .van-icon{
      color: @lightGrey;
      margin-left: 8px;
    }
  }
  .team-rank-item-bottom {
    margin: auto;
    max-width: 614px;
    border-bottom: 0.01rem solid #eeeeee;
  }
  .team-rank-item-info {
    display: inline-block;
  }
  .team-rank-item-icon {
    width: 71px;
    height: 81px;
    margin-right: 13px;
    overflow: hidden;
    img{
      width: 71px;
      height: 81px;
    }
  }
  .team-rank-item-summary {
    flex-grow: 1;
    font-size: 26px;
    font-weight: 500;
    color: #333333;
  }
  .team-rank-item-statistic {
    font-size: 20px;
    color: #999999;
    margin: 18px 0;
    &>.text:last-child{
      margin-top: 10px;
    }
  }
  .tip{
    text-align: center;
    color: #999999;
    font-size: 22px;
    line-height: 30px;
    height: 30px;
    background: white;
    padding-top: 5rem;
    padding-bottom: 1rem;
  }
}
</style>
