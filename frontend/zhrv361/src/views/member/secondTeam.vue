<template>
  <div>
    <top-msg :header-name="title" />
    <div class="msg">
      <div class="user">
        <div id="userName" class="name">
          {{ userName?userName :'' }}
        </div>
        <div id="userRank" class="type">
          {{ userRank?userRank:'' }}会员
        </div>
        <div class="text-box">
          累计消费金额：
          <span class="userTotal">{{ ((userTotal || 0) / 100).toFixed(2) }}元</span>
        </div>
      </div>
    </div>
    <div class="text">
      我的直推用户
    </div>
    <ul class="list">
      <li v-for="(item,index) in list" :key="index" class="item">
        <div class="top clear">
          <span class="img-box lt">
            <img :src="item.rank_logo?item.rank_logo.url:''" alt>
          </span>
          <span class="user lt">
            <p class="name">{{ item.user_id_card_name }} {{ item.user_phone_num.substring(0,3) + '****' + item.user_phone_num.substring(7,11) }}</p>
            <p class="type">{{ item.rank_name }}</p>
          </span>
          <span class="rt num">直推{{ item.first_level_count }}人 间推{{ item.other_level_count }}人</span>
        </div>
        <div class="bottom clear">
          <span class="text lt">注册时间：{{ item.gmt_create }}</span>
          <span class="text gold rt">
            累计消费金额：
            <span class="price">{{ (item.trade_amount_sum / 100).toFixed(2) }}元</span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'SecondTeam',
  components: { topMsg },
  data: function() {
    return {
      list: [],
      user: {},
      userName: null,
      userRank: null,
      userTotal: null
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.fetchData()
    const that = this
    this.bus.$on('userMsg', function(msg) {
      that.$nextTick(() => {
        that.userName = msg.userName
        that.userRank = msg.userRank
        that.userTotal = msg.userTotal
      })
    })
  },
  beforeDestroy() {
    this.bus.$off('userMsg')
  },
  methods: {
    fetchData() {
      this.$api.member
        .listUserDirectTeam({
          userId: this.$route.query.userId
        })
        .then(res => {
          this.list = res.data.data
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.msg {
  padding: 24px;
  box-sizing: border-box;
  background: url("../../../static/img/team-bg.png");
  background-size: cover;
  .user {
    width: 100%;
    height: 200px;
    text-align: center;
    padding: 12px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    .type {
      color: @lightGrey;
      font-size: 24px;
      font-weight: 500;
      display: inline-block;
      padding: 6px 20px;
      border-radius: 56px;
      box-sizing: border-box;
      background: @orange;
      color: #fff;
      margin: 14px 0;
    }
    .name {
      color: @mainTextColor;
      font-size: 48px;
      font-weight: bold;
    }
    .text-box{
      font-size: 24px;
      color: @subTextColor;
      .userTotal{
        color: @mainTextColor;
      }
    }
  }
}
.text {
  margin: 14px 24px 17px;
  color: @lightGrey;
  font-size: 28px;
  font-weight: 500;
}
.list {
  margin-bottom: 88px;
  .item {
    margin: 20px;
    box-shadow: 0rem 0.1rem 0.2rem 0rem rgba(51, 51, 51, 0.1);
    .top {
      border-radius: 15px;
      background: #fff;
      width: 100%;
      box-sizing: border-box;
      border-radius: 15px;
      border-bottom: 2px dashed #ddd;
      padding: 19px 33px;
      .img-box {
        margin-right: 24px;
        width: 68px;
        height: 68px;
        img {
          width: 100%;
          height: 100%;
          vertical-align: -webkit-baseline-middle;
        }
      }
      .user{
         .name {
          color: @mainTextColor;
          font-size: 28px;
         }
        .type {
          color: @mainColorB;
          font-size: 24px;
          margin-top: 14px;
        }
      }
      .num {
        margin-top: 42px;
        font-size: 24px;
        color: @lightGrey;
      }
    }
    .bottom {
      background: #fff;
      width: 100%;
      box-sizing: border-box;
      padding: 19px 33px;
      border-radius: 15px;
      .text {
        font-size: 20px;
        color: @lightGrey;
        margin: 0;
      }
      .gold {
        font-size: 24px;
        .price {
          color: @subTextColor;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
