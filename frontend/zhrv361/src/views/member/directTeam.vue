<template>
  <div class="direct-team-page">
    <top-msg :header-name="isAllDirect?'我的直推用户':$route.query.rank_name" />
    <div v-if="!isAllDirect" class="clear sub-title">
      <span class="lt text">我的直推用户</span>
      <span class="rt text">共{{ teamCount }}人</span>
    </div>
    <ul class="list">
      <li v-for="( item,index ) in list" :key="index" class="item">
        <div :class="['top', 'clear',isAllDirect?'border':'']">
          <!-- <span class="img-box lt">
            <img v-if="item.rank_name === '普通用户' || item.rank_name === '免费用户'" src="../../../static/img/pt.png">
            <img v-else-if="item.rank_name === 'VIP'" src="../../../static/img/VIP.png">
            <img v-else-if="item.rank_name === '银商'" src="../../../static/img/ys.png">
            <img v-else-if="item.rank_name === '金商'" src="../../../static/img/js.png">
            <img v-else-if="item.rank_name === '钻商'" src="../../../static/img/zs.png">
          </span> -->
          <span class="img-box lt">
            <img :src="item.rank_logo?item.rank_logo.url:''">
          </span>
          <span class="user lt">
            <p class="name">
              <span v-if="item.id_card_real_name">{{ formatName(item.id_card_real_name) }}</span>
              <span @click="toCall(item.user_phone_num)">{{ item.user_phone_num }}</span>
              <!-- <span v-if="item.user_id_card_name || item.user_phone_num" @click="toCall(item.user_phone_num)">{{ item.user_id_card_name||item.user_phone_num.substring(0,3) + '****' + item.user_phone_num.substring(7,11)}}</span> -->
              <!-- <span v-if="item.id_card_real_name" >{{ item.id_card_real_name.replace(/(?<=.)./g, '*')}}</span> -->
              <!-- <span v-if="item.id_card_real_name" >{{ formatName(item.id_card_real_name)}}</span>
               <span v-else @click="toCall(item.user_phone_num)">{{ item.user_phone_num}}</span> -->
              <span v-if="item.id_card_real_name" class="z_renzheng">已认证</span>
              <span v-else class="z_renzheng">未认证</span>
            </p>
            <p class="type flex-row-center">
              <span>{{ item.rank_name }}</span>
              <!-- <span v-if="item.enable_points_upgrade" class="upgrade" @click.stop="upgradeFun(item)">积分升级</span> -->
            </p>
          </span>
          <span
            :class="['rt', 'num',isAllDirect?'no-margin':'']"
          >
            <!-- <span v-if="isAllDirect" class="icon-box">
              详情
              <i class="iconfont icon-gengduo" />
            </span> -->
            <p class="text">直推{{ item.first_level_count }}人 间推{{ item.other_level_count }}人</p>
            <!-- <p v-if="!item.user_id_card_name" class="text no-data">资料未完善</p> -->
          </span>
        </div>
        <div :class="['bottom', 'clear',isAllDirect?'border':'']">
          <span class="text lt">注册时间：{{ item.gmt_create }}</span>
          <span class="text gold rt">
            累计消费金额：
            <span class="price">{{ (item.trade_amount_sum / 100).toFixed(2) }}元</span>
          </span>
        </div>
      </li>
    </ul>
    <!-- 积分升级 弹框 start-->
    <van-dialog
      v-model="upgradeDialog"
      :show-confirm-button="false"
      :before-close="beforeUpgradeDialog"
      close-on-click-overlay
    >
      <div class="upgrade flex-column-center">
        <span class="title">确认支付升级？</span>
        <div class="content">
          支付<span class="integral">{{ upgradeMsg.upgrade_points }}积分</span>为以下用户升级为{{ upgradeMsg.next_rank_name }}会员
        </div>
        <span class="msg">{{ upgradeMsg.user_id_card_name }} {{ upgradeMsg.user_phone_num }}</span>
        <div class="upgradeBtn flex-row-between">
          <div class="return" @click="closeUpgradeDialog">
            返回
          </div>
          <div class="pay" @click="upgradeUser(upgradeMsg.user_id)">
            支付
          </div>
        </div>
      </div>
    </van-dialog>
    <!-- 积分升级 弹框 end-->
    <!-- 升级成功 弹框 start-->
    <van-dialog
      v-model="successDialog"
      :show-confirm-button="false"
      :before-close="beforeSuccessDialog"
      close-on-click-overlay
    >
      <div class="successDialog flex-column-center">
        <i class="iconfont icon-gou" />
        <span class="title">支付成功</span>
        <span class="integral">{{ upgradeMsg.upgrade_points }}积分</span>
        <span class="userMsg">{{ upgradeMsg.user_id_card_name }} {{ upgradeMsg.user_phone_num }}</span>
        <span class="tip">升级为{{ upgradeMsg.next_rank_name }}会员</span>
        <div class="successBtn" @click="successBtnFun">
          确定
        </div>
      </div>
    </van-dialog>
    <!-- 升级成功 弹框 end-->
    <!-- 升级失败 弹框 start-->
    <van-dialog
      v-model="failDialog"
      :show-confirm-button="false"
      :before-close="beforeFailDialog"
      close-on-click-overlay
    >
      <div class="failDialog flex-column-center">
        <i class="iconfont icon-x" />
        <span class="title">支付失败</span>
        <span class="tip">积分余额不足</span>
        <div class="failBtn" @click="failBtnFun">
          确定
        </div>
      </div>
    </van-dialog>
    <!-- 升级失败 弹框 end-->
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'DirectTeam',
  components: { topMsg },
  data: function() {
    return {
      teamCount: 0,
      typeName: '钻石',
      list: [],
      isAllDirect: false,
      userName: '',
      userRank: '',
      userTotal: '',

      upgradeDialog: false, // 积分升级-弹框
      upgradeMsg: '',
      successDialog: false, // 积分升级-成功-弹框
      failDialog: false // 积分升级-失败-弹框
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.fetchData()
  },
  beforeDestroy() {
    this.sendMsg()
  },
  methods: {
    // 中文姓名中间加*号
    formatName(name) {
      let newStr
      if (name.length === 2) {
        newStr = name.substr(0, 1) + '*'
      } else if (name.length > 2) {
        let char = ''
        for (let i = 0, len = name.length - 2; i < len; i++) {
          char += '*'
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1)
      } else {
        newStr = name
      }

      return newStr
    },
    // 拨打电话号码
    toCall(tel) {
      event.preventDefault() || event.stopPropagation()
      window.location.href = 'tel://' + tel
    },
    // 积分升级团队成员
    upgradeUser(userId) {
      this.$api.member.upgradeUser({ target_user_id: userId }).then(res => {
        console.log(res)
        this.successDialog = true
      }).catch(error => {
        console.log(error)
        this.failDialog = true
      })
    },
    // 积分升级
    upgradeFun(item) {
      this.upgradeMsg = item
      this.upgradeMsg.upgrade_points = (this.upgradeMsg.upgrade_points / 100).toFixed(2)
      this.upgradeDialog = true
    },
    /* 积分升级弹框关闭前*/
    beforeUpgradeDialog(action, done) {
      done()
    },
    beforeSuccessDialog(action, done) {
      done()
    },
    beforeFailDialog(action, done) {
      done()
    },
    closeUpgradeDialog() {
      this.upgradeDialog = false
    },
    successBtnFun() {
      this.successDialog = false
      this.$router.push({ path: '/bill', query: { current: '3' }})
    },
    failBtnFun() {
      this.failDialog = false
    },
    sendMsg() {
      this.bus.$emit('userMsg', {
        userName: this.userName,
        userRank: this.userRank,
        userTotal: this.userTotal
      })
    },
    // toNext(item) {
    //   this.userName = item.user_id_card_name
    //   this.userRank = item.rank_order
    //   this.userTotal = item.trade_amount_sum
    //   this.$router.push('/secondTeam?userId=' + item.user_id)
    // },
    fetchData() {
      const rankOrder = parseInt(this.$route.query.rankOrder)
      let data = ''
      this.isAllDirect = true
      if (!isNaN(rankOrder)) {
        data = { rankOrder }
        this.isAllDirect = false
      }

      this.$api.member.getRankListMsg().then(res => {
        const rankList = res.data.data
        console.log(rankList)
        this.$api.member.listMyDirectTeam(data).then(res => {
          console.log('0000000000')
          console.log(res)
          res.data.data.forEach((item) => {
            rankList.forEach((element, index, arr) => {
              if (item.rank_order === element.rank_order) {
                item.enable_points_upgrade = arr[index + 1].enable_points_upgrade
                item.upgrade_points = arr[index + 1].upgrade_points
                item.next_rank_name = arr[index + 1].rank_name
              }
            })
          })
          this.list = res.data.data
          this.teamCount = this.list.length
          if (this.list.length > 0) {
            this.typeName = this.list[0].rank_name
          }
          console.log(this.list)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.direct-team-page{
  .sub-title {
    margin: 24px 36px 24px 36px;
    .text {
      font-size: 28px;
      color: @lightGrey;
    }
  }
  .list {
    margin-bottom: 88px;
    .item {
      height: 193px;
      margin-bottom: 25px;
      background: url("../../../static/img/kuang.png") no-repeat;
      background-size: 100% 100%;
      .top {
        background: #fff;
        width: 100%;
        box-sizing: border-box;
        border-radius: 15px;
        border-bottom: 2px dashed #ddd;
        padding: 18px 36px;
        overflow: unset;
        .img-box {
          margin-right: 24px;
          width: 71px;
          height: 81px;
          img {
            width: 100%;
            height: 100%;
            vertical-align: -webkit-baseline-middle;
          }
        }
        .user{
          .name {
            color: @mainTextColor;
            font-size: 30px;
            height: 42px;
            line-height: 42px;
            font-weight: bold;
          }
          .type {
            color: #666666;
            font-size: 26px;
            margin-top: 5px;
            line-height: 37px;
            height: 37px;
            span {
              color: #666666;
            }
            .upgrade{
              color: @mainColorE;
              margin-left: 12px;
              padding: 4px 16px;
              box-sizing: border-box;
              border:1px solid rgba(237,2,2,1);
              border-radius:100px;
            }
          }
        }
        .num {
          text-align: right;
          margin-top: 48px;
          color: @lightGrey;
          &.no-margin {
            margin-top: 1.5rem;
          }
          .text{
            color: @lightGrey;
            font-size: 24px;
            &.no-data{
              color: @mainColorB;
            }
          }
          .icon-box{
            width:110px;
            height:54px;
            background:@mainColorB;
            box-shadow:0px 3px 6px rgba(0,0,0,0.12);
            border-radius:100px 0px 0px 100px;
            padding: 10px 20px;
            box-sizing: border-box;
            font-size: 24px;
            color: #fff;
            margin: 8px -54px 8px 0;
            display: inline-block;
            white-space: nowrap;
            .icon-gengduo{
              font-size: 10px;
              color: #fff;
            }
          }
        }
      }
      .bottom {
        background: #fff;
        width: 100%;
        box-sizing: border-box;
        padding: 19px 33px;
        border-radius: 15px;
        .text {
          font-size: 22px;
          color: #999999;
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
}
.upgrade{
  padding: 46px 36px 40px 36px;
  box-sizing: border-box;
  border-radius:10px;
  .title{
    font-size: 36px;
    color: black;
    margin-bottom: 8px;
  }
  .content{
    font-size: 26px;
    color: @grey;
    .integral{
      color: @mainColorE;
    }
  }
  .msg{
    margin-top: 8px;
    font-size: 26px;
    color: @orange;
  }
  .upgradeBtn{
    width: 488px;
    line-height: 40px;
    font-size: 28px;
    margin-top: 32px;
    div{
      padding: 16px 76px;
      box-sizing: border-box;
    }
    .return{
      color: @subTextColor;
      border:2px solid @subTextColor;
      border-radius:10px;
    }
    .pay{
      color: white;
      background:linear-gradient(45deg,rgba(72,60,36,1) 0%,rgba(26,26,26,1) 100%);
      border-radius:10px;
    }
  }
}
.successDialog{
    padding: 54px 50px 40px 50px;
    box-sizing: border-box;
    background:rgba(255,255,255,1);
    border-radius:10px;
    i{
      font-size: 200px;
      margin-bottom: 16px;
      color: @orange;
    }
    .title{
      color: black;
      font-size: 34px;
      margin-bottom: 16px;
    }
    .integral{
      color: @mainColorE;
      font-size: 48px;
      margin-bottom: 24px;
    }
    .userMsg{
      color: @grey;
      font-size: 26px;
      margin-bottom: 8px;
    }
    .tip{
      color: @grey;
      font-size: 26px;
      margin-bottom: 36px;
    }
    .successBtn{
      width:460px;
      line-height: 70px;
      text-align: center;
      background:linear-gradient(45deg,rgba(72,60,36,1) 0%,rgba(26,26,26,1) 100%);
      border-radius:10px;
      font-size: 30px;
      color: white;
    }
  }
  .failDialog{
    padding: 54px 50px 40px 50px;
    box-sizing: border-box;
    background:rgba(255,255,255,1);
    border-radius:10px;
    i{
      font-size: 200px;
      margin-bottom: 24px;
      color: #cccccc;
    }
    .title{
      color: black;
      font-size: 34px;
      margin-bottom: 24px;
    }
    .tip{
      color: @grey;
      font-size: 26px;
      margin-bottom: 36px;
    }
    .failBtn{
      width:460px;
      line-height: 70px;
      text-align: center;
      background-color:#cccccc;
      border-radius:10px;
      font-size: 30px;
      color: white;
    }
  }
  .z_renzheng{
    position: absolute;
    right: 2rem;
  }
</style>
