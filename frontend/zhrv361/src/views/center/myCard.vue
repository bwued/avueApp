<template>
  <div class="">
    <top-msg header-name="我的银行卡" />
    <div class="con_body">
      <nav class="con_nav bgfff">
        <ul class="flex">
          <li :class="currentNav === 0 ? 'nav_item nav_item-on' : 'nav_item' " @click="toggle(0)">
            储蓄卡
          </li>
          <li :class="currentNav === 1 ? 'nav_item nav_item-on' : 'nav_item' " @click="toggle(1)">
            信用卡
          </li>
        </ul>
      </nav>
      <div class="cards_list">
        <div class="cards_head">
          <span v-if="currentNav === 0" class="size28 color999">共 {{ cardMsg.length }} 张储蓄卡</span>
          <span v-if="currentNav === 1" class="size28 color999">共 {{ cardMsg.length }} 张信用卡</span>
        </div>
        <div class="list_items">
          <div v-for="(item) in cardMsg" :key="item.id" :class="currentNav === 1 ? 'list_item flex flex_alCen' : 'list_item2 flex flex_alCen'" @click="gotoEditCard(item.id,item.card_info.auth)">
            <div class="card_logo w25">
              <img :src="item.bank_info && item.bank_info.bank_logo_image.url">
            </div>
            <div class="flex1 lineheight70 w70">
              <h5 class="colorfff size30">
                {{ item.bank_info ? item.bank_info.name : '' }}
              </h5>
              <p class="colorfff size36 textEllipsis">
                {{ '**** **** *** ' + item.card_info.card_no.substr(item.card_info.card_no.length-4) }}
              </p>
            </div>
            <div v-if="currentNav === 0" class="z_card_path">
              <i class="iconfont icon-guanbi" @click.stop="deleteCardFun(item.id)" />
            </div>
            <div v-if="currentNav === 1" class="card_path">
              <i class="iconfont icon-guanbi" @click.stop="deleteCardFun(item.id)" />
            </div>
            <div v-if="currentNav === 1" class="z_check">
              <p>账单日：{{ item.card_info.bill_date }}号</p>
              <p>到期日：{{ item.card_info.repayment_date }}号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn_warp">
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
  /* data必须是函数*/
  data: function() {
    return {
      currentNav: 0, // 当前nav
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
    this.thisTitle()
    this.getCardListFun()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '我的银行卡'
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
    width: 702px;
    height: 200px;
    margin: 0 auto 20px;
    .bgGradient(135deg,@gradientA ,@gradientB);
    background-blend-mode: normal, normal;
    border-radius: 15px;
  }
  .list_item2{
    width: 702px;
    height: 200px;
    margin: 0 auto 20px;
    background-image: linear-gradient(-90deg, #8A6333 0%, #D4B988 100%), linear-gradient(#ffffff, #ffffff);
    background-blend-mode: normal, normal;
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
    top: 1rem;
    p{
      font-size:1rem;
      color: white;
      height: 1.5rem;
      line-height: 1.5rem;
    }
  }
</style>
