<template>
  <div class="">
    <div class="top">
      <!-- <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/planList')"> -->
      <div class="text">
        选择信用卡
      </div>
    </div>
    <!-- <top-msg header-name="选择信用卡" /> -->
    <div class="con_body">
      <!-- disnone css class类  = display::none -->
      <nav class="con_nav bgfff disnone">
        <ul class="flex">
          <!-- <li :class="currentNav === 0 ? 'nav_item nav_item-on' : 'nav_item' " @click="toggle(0)">
            储蓄卡
          </li> -->
          <li :class="currentNav === 1 ? 'nav_item nav_item-on' : 'nav_item' " @click="toggle(1)">
            信用卡
          </li>
        </ul>
      </nav>

      <!--  -->
      <div class="add_card">
        <!-- 添加银行卡 -->
        <div class="z_img" @click="gotoAddCard()">
          <img src="../../../static/img/addcard.png">
          <span class="size28">添加信用卡</span>
        </div>
      </div>

      <div class="cards_list">
        <div class="cards_head">
          <span v-if="currentNav === 0" class="size28 color999">共 {{ cardMsg.length }} 张储蓄卡</span>
          <span v-if="currentNav === 1" class="size28 color999">共 {{ cardMsg.length }} 张信用卡</span>
        </div>
        <div class="list_items">
          <div v-for="(item) in cardMsg" :key="item.id" :class="currentNav === 1 ? 'list_item flex flex_alCen' : 'list_item2 flex flex_alCen'">
            <div class="card_logo">
              <img :src="item.bank_info && item.bank_info.bank_logo_image.url">
            </div>
            <div class="flex1 w70">
              <h5 class="colorfff size30" style="height:30px; line-height:30px; border-bottom:1px solid #eee;">
                <span style="color:#fff; opacity: 0.9;">{{ item.bank_info ? item.bank_info.name : '' }}{{ item.card_info.card_no.substr(item.card_info.card_no.length-4) }} </span>
                <span style="color:#fff; float:right; padding-right:15px;" @click="gotoPlist(item)">还款记录<van-icon name="arrow" class="rt" /></span>
              </h5>
              <div class="z_check wdfs">
                <p><span class="cf9">卡额度：</span>{{ item.card_info.credit_amount == 0 ? '--' : item.card_info.credit_amount }}</p>
                <p><span class="cf9">账单日：</span>{{ item.card_info.bill_date }}号 &nbsp;&nbsp;<span class="cf9">还款日：</span>{{ item.card_info.repayment_date }}号</p>
                <p><span class="cf9">剩余还款时间：</span>{{ item.remain_repay_day }}天</p>
              </div>
            </div>
            <div v-if="currentNav === 1" class="z_check pay_btn">
              <button class="btn btn_add size26" @click="gotoChanel(item.id,item.repay_state)">
                {{ item.repay_state | stateFilter }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- disnone css class类  = display::none -->
    <div class="btn_warp disnone">
      <button class="btn btn_add bottom-btn" @click="gotoAddCard">
        + 添加{{ currentNav === 0 ? '储蓄卡' : '信用卡' }}
      </button>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'MyCard',
  components: { topMsg },
  filters: {
    stateFilter(status) {
      return { '1': '未出账单', '2': '立即还款', '3': '还款中' }[status]
    }
  },
  /* data必须是函数*/
  data: function() {
    return {
      currentNav: 1, // 当前nav
      cardMsg: ''// 信用卡信息
    }
  }, watch: {
    cardMsg: {
      handler(newVal, oldVal) {
      },
      deep: true
    }
  },
  created() {
    // this.thisTitle()
    // this.getCardListFun()
    const token = this.$util.getQueryVariable('token')
    if (token) {
      this.$store.dispatch('SetToken', token)
      // window.location.reload(true)
    } else {
      // window.location.reload(true)
    }
    // alert(window.location.href.substr(window.location.href.indexOf('?') + 1))
    // alert(token)
  },
  mounted() {
    this.getCardListFun()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '我的银行卡'
    },
    gotoPlist(item) {
      this.$router.push({ path: '/v3planList', query: { cardId: item.id }})
    },
    /* 切换toggle*/
    toggle(i) {
      this.currentNav = i
      this.cardMsg = ''
      this.getCardListFun()
    },
    /* 点击银行卡卡 去编辑 currentNav 1信用卡 0储蓄卡 */
    gotoEditCard(id, auth) {
      if (this.currentNav === 1) {
        this.$router.push({ path: '/addCreditCard', query: { status: 'edit', cardId: id, auth: auth }})
      } else {
        // if (!auth) {
        //   this.$router.push({ path: '/addCard', query: { status: 'edit', cardId: id }})
        // }
      }
    },
    /* 点击添加银行卡*/
    gotoAddCard() {
      if (this.currentNav === 0) {
        this.$router.push({ path: '/addCard', query: { status: 'add' }})
      } else if (this.currentNav === 1) {
        this.$router.push({ path: '/addCreditCard', query: { status: 'add' }})
      }
    },
    /* 获取银行卡列表*/
    getCardListFun() {
      const that = this
      /* currentNav 0 储蓄卡   1 信用卡*/
      const cardType = that.currentNav === 0 ? 'DEBIT' : 'CREDIT'
      that.$api.card.getCardList(cardType).then(res => {
        console.log(res)
        that.cardMsg = res.data.data

        console.log(that.cardMsg)
      }).catch(error => {
        console.log(error)
      })
    },
    gotoChanel(id, state) {
      this.$router.push({ path: '/addChannel', query: { cardId: id }})
      // if (state !== 3) {
      //   // return { '1': '未出账单', '2': '立即还款', '3': '还款中' }[state]
      //   this.$router.push({ path: '/addChannel', query: { cardId: id }})
      // } else {
      //   this.$router.push({ path: '/v3planList', query: { cardId: id }})
      // }

    },
    /* 点击解绑银行卡 currentNav 1信用卡 0储蓄卡*/
    deleteCardFun(id) {
      const that = this
      that.$dialog({
        title: '确认删除银行卡？',
        message: '删除的银行卡无法恢复',
        showCancelButton: true,
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
        className: 'dialog dialog2',
        closeOnClickOverlay: true
      }).then(msg => {
        if (msg === 'confirm') {
          const type = that.currentNav === 1 ? 'CREDIT' : 'DEBIT'
          that.$api.card.deleteCard(id, type).then(res => {
            console.log(res)
            that.$toast({
              message: '删除银行卡成功',
              position: 'middle'
            })
            that.getCardListFun()
            if (type === 'DEBIT') {
              this.$store.commit('SET_CURRENT_DEBIT_CARD', '')
            }
            if (type === 'CREDIT') {
              this.$store.commit('SET_CURRENT_CREDIT_CARD', '')
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
  //头部返回
  .top {
    display: flex;
    flex-flow: row;
    background: white;
    padding-bottom: 0.8rem;
    // position: fixed;
    width: 100%;
    img {
      width: 1rem;
      height: 1.5rem;
      margin-top: 0.8rem;
      margin-left: 1rem;
    }
    .text {
      color: #000000ff;
      font-size: 1.3rem;
      margin-top: 0.6rem;
      margin-left: 8rem;
    }
  }
  .nav_item{
    position: relative;
    width: 50%;
    padding: 34px 0 14px;
    text-align: center;
    font-size: 30px;
    color: #999999;
  }
  .nav_item-on::after{
    position: absolute;
    display: inline-block;
    left: 50%;
    bottom: 0;
    width: 50%;
    margin-left: -5px;
    transform: translate(-50%,0);
    color: @mainColorB;
    border-bottom: 4px solid @mainColorB;
    content: "";
  }

  .cards_head{
    padding-left: 23px;
    line-height: 68px;
  }
  .list_items{
    padding-bottom: 124px;
    box-sizing: border-box;
    // position: relative;
  }
  .list_item{
    position: relative;
    width: 702px;
    height: 200px;
    margin: 0 auto 20px;
    .bgGradient(135deg,@gradientA ,@gradientB);
    background-blend-mode: normal, normal;
    border-radius: 15px;
    background-image: url("../../../static/img/bjcard.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .list_item2{
    width: 702px;
    height: 200px;
    margin: 0 auto 20px;
    // background-image: linear-gradient(-90deg, #8A6333 0%, #D4B988 100%), linear-gradient(#ffffff, #ffffff);

    // background-blend-mode: normal, normal;
    background-image: url("../../../static/img/bjcard.png");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 15px;
  }
  .card_logo{
    text-align: center;
    width: 15%;
  }
  .card_logo >img{
    width: 68px;
    height: 68px;
    border-radius: 50%;
  }
  .cf9{color: #f5f5f5; opacity: 0.9; font-size: 24px;}
  .rt{ color: #fff; margin-top: 14px;}
  .pay_btn.z_check{position: absolute!important; top: 45%; left: 75%;}
  .lineheight70{
    line-height: 70px;
  }
  .card_path{
    position: relative;
    align-self: flex-start;
    margin-right: -4rem;
    margin-top: 25px;
  }
  .z_card_path{
    position: relative;
    align-self: flex-start;
    margin-right: 1rem;
    margin-top: 25px;
  }
  .upload_close{
    position: absolute;
    top: -10px;
    right: -10px;
    width: 32px;
    height: 32px;
    background: transparent;
    border-radius: 50%;
  }
  .upload_close:before{
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    width: 25px;
    height: 0.01rem;
    margin-left: -10px;
    background: #ffffff;
    transform: rotate(45deg);
    opacity: .3;
    content: "";
  }
  .upload_close:after{
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    width: 25px;
    height: 0.01rem;
    margin-left: -10px;
    background: #ffffff;
    transform: rotate(-45deg);
    opacity: .3;
    content: "";
  }

  .btn_warp{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    background: #ffffff;
  }
  .btn_add{
    // width: 400px;
    // height: 74px;
    margin: 13px 0;
    border-radius: 0px;
  }

  .icon-guanbi {
    color: #fff
  }
  .z_check{
     position: relative;
    left: -1rem;
    top: -0.3rem;
    p{
      font-size:1rem;
      color: white;
      height: 1.5rem;
      line-height: 1.5rem;
    }
    .btn.btn_add{
    width: 150px;
    height: 56px;
    line-height: 56px;
    color: #ffffff;
    border: 1px solid white;
    -webkit-border-radius: 48px;
    border-radius: 48px;
    text-align: center;
    background: none;
    }
  }
  .z_check.wdfs{left:0%; top:0;}
  .colorfff.size36.textEllipsis{padding-top:0.5rem;}
  .wdfs{font-size:13px;}
  .add_card {
		width: 90%;
		height: 120px;
		background: white;
		margin: 5% auto;
    border-radius: 10px;
    text-align: center;
		.z_img {
			line-height: 120px;
			img {
				width: 35px;
				height: 35px;
				vertical-align: middle;
			}
			span {
				margin-left: 10px;
				color: rgba(191, 151, 97, 1);
			}
		}
	}
</style>
