<template>
  <van-popup v-model="isShowSelectCard" :class="{'select-card-page':true,'show-height':showAddCard}" position="bottom">
    <div class="title">
      {{ currentNav===0?'请选择储蓄卡':'请选择信用卡' }}
    </div>
    <ul class="card-list">
      <li v-if="cardList.length===0" class="item add-card" @click="showAddCard=true">
        <img src="../../static/img/dark-add-btn.png">
        {{ currentNav===0?'添加储蓄卡':'添加信用卡' }}
      </li>
      <template v-else>
        <li v-for="(item,index) in cardList" :key="index" :class="['item',index%2!==0?'odd':'even']" @click="selectedCard(item)">
          <img class="img lt" :src="item.bank_info && item.bank_info.bank_logo_image && item.bank_info.bank_logo_image.url">
          <div class="lt">
            <div class="name">
              {{ item.bank_info.name }}
            </div>
            <div class="text">
              {{ item.card_info.card_no }}
            </div>
          </div>
           <div class="z_check" >
              <p>账单日：{{item.card_info.bill_date}}号</p>
              <p>到期日：{{item.card_info.repayment_date}}号</p>
              </div>

        </li>
      </template>
    </ul>
    <div v-if="!showAddCard" class="add-btn">
      <span :class="{'btn':true,'has-data':cardList.length>0}" @click="showAddCard=true">
        <i v-if="cardList.length>0" class="iconfont icon-jia img" />
        {{ cardList.length>0?currentNav===0?'添加储蓄卡':'添加信用卡':'确定' }}
      </span>
    </div>
    <div v-if="showAddCard" class="add-page">
      <add-credit-card v-if="currentNav===1" :from-select-card-page="true" :hide-add-card="hideAddCardFun" @toReflesh="toRefleshFun" />
      <add-card v-if="currentNav===0" :from-select-card-page="true" :hide-add-card="hideAddCardFun" @toReflesh="toRefleshFun" />
    </div>
  </van-popup>
</template>
<script>
import addCreditCard from '@/views/center/addCreditCard'
import addCard from '@/views/center/addCard'
export default {
  name: 'SelectCard',
  components: { addCreditCard, addCard },
  props: ['showSelectCard', 'hideSelectCard', 'showAddCardFlag', 'currentNav'],
  data() {
    return {
      cardList: [],
      showAddCard: false,
      isShowSelectCard: false
    }
  },
  watch: {
    // 检测showSelectCard，isShowSelectCard状态
    showSelectCard() {
      this.isShowSelectCard = this.showSelectCard
      if (this.showSelectCard) {
        this.getCardListFun()
      }
    },
    isShowSelectCard(newValue, oldValue) {
      if (!newValue) {
        this.showAddCard = false
        this.hideSelectCard()
      }
    },
    showAddCard(newValue, oldValue) {
      this.$emit('showAddCard', newValue)
    },
    showAddCardFlag(newValue, oldValue) {
      this.showAddCard = newValue
    }
  },
  created() {
    this.getCardListFun()
  },
  methods: {
    hideAddCardFun() {
      this.showAddCard = false
    },
    /* 获取银行卡信息*/
    getCardListFun() {
      const that = this
      /* currentNav 0 储蓄卡   1 信用卡*/
      const cardType = that.currentNav === 0 ? 'DEBIT' : 'CREDIT'
      that.$api.card.getCardList(cardType).then(res => {
        this.cardList = res.data.data
      })
    },
    selectedCard(item) {
      // console.log(item)
      this.$emit('selectedCard', item)
      this.hideSelectCard()
    },
    toRefleshFun() {
      this.getCardListFun()
    }
  }
}
</script>
<style lang="less" scoped>
@import '../assets/less/common.less';
.select-card-page{
  padding: 33px 48px;
  height: 700px;
  box-sizing: border-box;
  &.show-height{
    height: 100%;
  }
  .title{
    font-size: 28px;
  }
  .card-list{
    height: 530px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .item{
      margin-top: 24px;
      width: 100%;
      height: 200px;
      border-radius:10px;
      overflow: hidden;
      padding: 44px 40px;
      box-sizing: border-box;
      .name{
        font-size: 34px;
        font-weight: bold;
        margin-bottom: 22px;
        color: #fff;
      }
      .text{
        font-size: 30px;
        color: #fff;
      }
      .img{
        width: 88px;
        height: 88px;
        margin-right: 23px;
      }
      &.odd{
        background:linear-gradient(270deg,rgba(222,170,89,1) 0%,rgba(246,197,126,1) 100%);
      }
      &.even{
        .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
      }
      &.add-card{
        padding: 0;
        text-align: center;
        line-height: 200px;
        font-size: 30px;
        color: @btnBlue;
        border:3px solid @btnBlue;
        img{
          width: 36px;
          height: 36px;
          vertical-align: text-bottom;
        }
      }
    }
  }
  .add-btn{
    width:750px;
    height:100px;
    position: fixed;
    bottom: 0;
    text-align: center;
    line-height: 100px;
    left: 50%;
    transform: translate(-50%,0);
    .btn{
      display: inline-block;
      width:460px;
      height:74px;
      .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
      border-radius:10px;
      color: #fff;
      font-size: 30px;
      line-height: 74px;
      &.has-data{
        background: none;
        border:3px solid @btnBlue;
        .borderBtn;
        .fontColor;
      }
      .img{
        font-size: 36px;
        margin-right: 8px;
        .fontColor;
      }
    }
  }
  .add-page{
    position: fixed;
    top: 0;
    left: 50%;
    transform: translate(-50%,0);
    width: 100%;
    height: 100%;
    background: @bg;
  }
}
 .z_check{
     position: relative;
    left: 2rem;
    top: 1rem;
    p{
      font-size:.8rem;
      color: white;
      height: 1.3rem;
      line-height: 1.3rem;
    }
  }
</style>

