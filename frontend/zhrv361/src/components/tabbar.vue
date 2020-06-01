<template>
  <div class="tabBar">
    <ul class="list">
      <li class="item" @click="gotoAddress({path:'/home'})">
        <img v-show="homePage" src="../../static/img/shouye-on.png" alt="">
        <img v-show="!homePage" src="../../static/img/shouye-off.png" alt="">
        <div :class="['text',homePage?'on':'']">
          首页
        </div>
      </li>
      <!-- <li class="item" @click="gotoAddress({path:'/weike'})">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="homeIndex?'#icon-weikes':'#icon-weike'" />
        </svg>
        <div :class="['text',homeIndex?'on':'']">
          微课
        </div>
      </li> -->
      <li class="item" @click="gotoAddress({path:'/share'})">
        <img v-show="recommendIndex" src="../../static/img/share-on.png" alt="">
        <img v-show="!recommendIndex" src="../../static/img/share-off.png" alt="">
        <div :class="['text',recommendIndex?'on':'']">
          分享
        </div>
      </li>
      <li class="item" @click="gotoAddress({path:'/consult'})">
        <!-- <svg class="icon" aria-hidden="true">
          <use :xlink:href="shoppingMall?'#icon-zixuns':'#icon-zixun'" />
        </svg> -->
        <img v-show="shoppingMall" src="../../static/img/shangxueyuan-on.png" alt="">
        <img v-show="!shoppingMall" src="../../static/img/shangxueyuan-off.png" alt="">
        <div :class="['text',shoppingMall?'on':'']">
          商学院
        </div>
      </li>
      <li class="item" @click="gotoAddress({path:'/center'})">
        <img v-show="centerIndex" src="../../static/img/me-on.png" alt="">
        <img v-show="!centerIndex" src="../../static/img/me-off.png" alt="">
        <div :class="['text',centerIndex?'on':'']">
          我的
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    homeIndex: {
      type: Boolean,
      default: false
    },
    recommendIndex: {
      type: Boolean,
      default: false
    },
    centerIndex: {
      type: Boolean,
      default: false
    },
    homePage: {
      type: Boolean,
      default: false
    },
    shoppingMall: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {

    }
  },
  watch: {

  },
  created: function() {

  },
  methods: {
    gotoAddress(path) {
      this.$router.push(path)
    },
    toMall() {
      this.$dialog({
        title: '提示',
        message: '此功能待开放',
        confirmButtonText: '确定'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tabBar{
  width:100%;
  max-width: 750px;
  height:98px;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 6px rgba(0,0,0,0.12);
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%,0);
  padding-top: 5px;
  box-sizing: border-box;
  z-index: 999;
  .list{
    display: flex;
    // justify-content: space-around;
    .item{
      flex: 1;
      text-align: center;
      i{
        font-size: 54px;
      }
      .active-index {
        color: @mainColorB
      }
      .colorccc{
        color: #cccccc;
      }
      img{
        width: 54px;
        height: 54px;
      }
      .text{
        font-size: 20px;
        color: rgba(204, 204, 204, 1);
        &.on{
          color: @subTextColor;
        }
      }
      svg{
        width: 54px;
        height: 54px;
      }
    }
  }
}
</style>
