<template>
  <div class="">
    <!--<div class="header">
      <div class="header_body">
        <p>更换银行卡</p>
      </div>
    </div>-->
    <top-msg header-name="更换银行卡" />
    <div class="con_body">
      <div class="cards_list">
        <div class="cards_head">
          <span v-if="type == 'cashCard'" class="size28 color999">共 {{ cardMsg.length }} 张储蓄卡</span>
          <span v-else class="size28 color999">共 {{ cardMsg.length }} 张信用卡</span>
        </div>
        <div class="list_items">
          <div v-for="(item,index) in cardMsg" :key="index" :class="type == 'cashCard' ? 'list_item2 flex flex_alCen' : 'list_item flex flex_alCen'" @click="selectThisCard(item.id)">
            <i v-if="currentCard === item.id" class="icon_select" />
            <div class="card_logo w25">
              <img v-if="item.bank_info.bank_logo_image" :src="item.bank_info.bank_logo_image.url">
            </div>
            <div class="flex1 lineheight70">
              <h5 class="colorfff size30">
                {{ item.bank_info.name }}
              </h5>
              <p class="colorfff size36 textEllipsis">
                {{ '**** **** *** ' + item.card_info.card_no.substr(item.card_info.card_no.length-4) }}
              </p>
              <div v-if="type == 'creditCard'" class="z_check">
              <p>账单日：{{item.card_info.bill_date}}号</p>
              <p>到期日：{{item.card_info.repayment_date}}号</p>
              </div>
            </div>
          </div>
          <div v-if="type == 'cashCard'" class="card_add">
            <router-link :to="{path:'/addCard',query:{status: 'add'}}" class="btn2 flex-vertical-centering">
              <div class="flex-row-center">
                <i class="iconfont icon-tianjiajihua" />
                <span>添加储蓄卡</span>
              </div>
            </router-link>
          </div>
          <div v-else class="card_add">
            <router-link :to="{path:'/addCreditCard',query:{status: 'add'}}" class="btn2 flex-vertical-centering">
              <div class="flex-row-center">
                <i class="iconfont icon-tianjiajihua" />
                <span>添加信用卡</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'ChangeCard',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      currentCard: this.$util.getQueryVariable('id') ? this.$util.getQueryVariable('id') : '', // 当前选择的银行卡
      type: this.$util.getQueryVariable('type'), // cashCard 储蓄卡(DEBIT) creditCard 信用卡(CREDIT)
      cardMsg: ''
    }
  },
  computed: {
    cardType() {
      return this.type === 'cashCard' ? 'DEBIT' : 'CREDIT'
    }
  },
  created() {
    this.thisTitle()
    this.getCardListFun()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '更换银行卡'
    },
    /* 点击信用卡 去编辑*/
    gotoEditCreditCard() {
      this.$router.push({ path: '/addCreditCard', query: { status: 'edit' }})
    },
    /* 点击储蓄卡 去编辑*/
    gotoEditCard() {
      this.$router.push({ path: '/addCard', query: { status: 'edit' }})
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
      const cardType = that.type === 'cashCard' ? 'DEBIT' : 'CREDIT'
      that.$api.card.getCardList(cardType).then(res => {
        console.log(res)
        that.cardMsg = res.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    /* 选择该银行卡*/
    selectThisCard(cardId) {
      console.log('选择该银行卡')
      console.log(cardId)
      this.currentCard = cardId
      const isLoading = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '请稍候...'
      })
      this.$api.card.getCard(this.cardType, cardId).then(res => {
        console.log('选择该银行卡')
        console.log(res)
        const card = { id: res.data.data.id, card_info: { ...res.data.data }, bank_info: res.data.data.bank_info }
        // console.log(card)
        if (this.type === 'cashCard') {
          this.$store.commit('SET_CURRENT_DEBIT_CARD', card)
        } else if (this.type === 'creditCard') {
          this.$store.commit('SET_CURRENT_CREDIT_CARD', card)
        }
        this.$router.go(-1)
      }).then(() => {
        isLoading.clear()
      }, () => {
        isLoading.clear()
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
    width: 60px;
    margin-left: -30px;
    color: @mainColorB;
    border-bottom: 4px solid @mainColorB;
    content: "";
  }

  .cards_head{
    padding-left: 23px;
    line-height: 68px;
  }
  .list_item{
    position: relative;
    width: 702px;
    height: 200px;
    margin: 0 auto 20px;
    background:@mainColorB;
    background-image: url("../../../static/img/wodebg.png");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 15px;
  }
  .list_item2{
    position: relative;
    width: 702px;
    height: 200px;
    margin: 0 auto 20px;
    background-image: url("../../../static/img/wodebg.png"),linear-gradient(270deg,#8A6333  0%,#D4B988 100%);;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 15px;
  }
  .card_logo{
    text-align: center;
  }
  .card_logo >img{
    width: 88px;
    height: 88px;
    border-radius: 50%;
  }
  .lineheight70{
    line-height: 70px;
  }
  .card_path{
    margin-right: 34px;
  }
  .btn_warp{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    background: #ffffff;
  }
  .btn_add{
    width: 400px;
    height: 74px;
    margin: 13px 0;
  }

  .icon_select{
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    background: url("../../../static/img/choose.png") no-repeat ;
    background-size: 50px;
  }
  .card_add {
    padding: 0 23px;
    box-sizing: border-box;
    font-size: 60px;
    text-align: center;
    color: @mainColorB;
    opacity: 0.8;
  }
  .btn2 {
    width: 100%;
    height: 200px;
    background: rgba(255, 255, 255, 1);
    border:3px solid @mainColorB;
    border-radius: 15px;
    line-height: 200px;
    font-size: 36px;
    span{
      .fontColor;
    }
  }

  .add_img {
    width: 36px;
    height: 36px;
    margin-right: 6px;
  }
  .iconfont{
    color: @mainColorB;
    font-size: 60px;
  }
   .z_check{
     position:absolute;
    left: 16.6rem;
    top: 2.5rem;
    p{
      font-size:1rem;
      color: white;
      height: 1.3rem;
      line-height: 1.3rem;
    }
  }
</style>
