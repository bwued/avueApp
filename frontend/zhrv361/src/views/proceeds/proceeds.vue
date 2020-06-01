<template>
  <div>
    <!-- <top-msg header-name="收银台" /> -->
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/home')">
      <div class="text">
        {{ text }}
      </div>
    </div>
    <div class="con_body">
      <div class="proceeds_header bgfff">
        <div class="box">
          <img src="../../../static/img/img_background_shouyintai.png">
        </div>
        <div class="header_warp">
          <div class="proceeds_msg flex flex_align">
            <!-- <i class="inline_block icon_login icon_time" /> -->
            <!-- <i class="iconfont icon-jisuanji ic_shoukuan colorcd" /> -->
            <img src="../../../static/img/union@2x.png" class="union" alt="">
            <p class="money-label">
              请输入收款金额
            </p>
          </div>
          <div class="proceeds_input">
            <span class="money-sign">¥</span>
            <div ref="proceedsInput" class="proceedsInput_number" @click="moneyFocus">
              <span class="real-money">{{ money }}</span>
              <span v-show="!isEdit" class="proceedsInput_placeholder">0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="proceeds_keyboard flex">
      <div class="keyboard_left w75">
        <div class="keyboard_level1 flex">
          <div class="keyboard_item" @click="addNumber(7)">
            7
          </div>
          <div class="keyboard_item" @click="addNumber(8)">
            8
          </div>
          <div class="keyboard_item" @click="addNumber(9)">
            9
          </div>
        </div>
        <div class="keyboard_level2 flex">
          <div class="keyboard_item" @click="addNumber(4)">
            4
          </div>
          <div class="keyboard_item" @click="addNumber(5)">
            5
          </div>
          <div class="keyboard_item" @click="addNumber(6)">
            6
          </div>
        </div>
        <div class="keyboard_level3 flex">
          <div class="keyboard_item" @click="addNumber(1)">
            1
          </div>
          <div class="keyboard_item" @click="addNumber(2)">
            2
          </div>
          <div class="keyboard_item" @click="addNumber(3)">
            3
          </div>
        </div>
        <div class="keyboard_level4 flex">
          <div class="keyboard_item" @click="addNumber('00')">
            00
          </div>
          <div class="keyboard_item" @click="addNumber(0)">
            0
          </div>
          <div class="keyboard_item" @click="addPoint">
            .
          </div>
        </div>
      </div>
      <div class="keyboard_right w25">
        <div :class=" money ? 'keyboard_delect' : 'keyboard_delect keyboard_delect2'" @click="deleteNumber">
          <i class="iconfont icon-delete" />
        </div>
        <div class="keyboard_confrim" @click="confirmProceeds">
          <span>确认<br>收款</span>
        </div>
      </div>
    </div>
    <tabbar :home-page="msg" />
  </div>
</template>
<script>
import tabbar from '@/components/tabbar'
import topMsg from '@/components/topMsg'

export default {
  name: 'Proceeds',
  components: { tabbar, topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true,
      currentType: 0, // 当前收款所选类型
      money: '', // 收款钱数
      isEdit: false, // 是否focus money
      text: '收银台'
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  watch: {
    money(newValue, oldValue) {
      if (this.money.length !== 0) {
        this.isEdit = true
      } else {
        this.isEdit = false
      }
      if (/^0/.test(newValue)) {
        // 0开头
        if (/^0\./.test(newValue)) {
          // 0.开头
          if (!/^0\.\d{1,2}$/.test(newValue)) {
            this.money = newValue.substr(0, 4)
          } else {
            // 两位小数内
            this.money = newValue
            if (/^0\.00{1}$/.test(newValue)) {
              this.money = '0.01'
            }
          }
        } else {
          // 只能一个0开头
          this.money = (Math.floor(parseFloat(newValue) * 100) / 100).toString()
        }
      } else {
        // 非0开头
        if (/^\d+\./.test(newValue)) {
          // 匹配有小数
          if (!/^\d+\.\d{1,2}$/.test(newValue)) {
            // 非匹配到两位小数点
            if (/^\d+\.$/.test(newValue)) {
              this.money = newValue
            } else {
              this.money = (Math.floor(parseFloat(newValue) * 100) / 100).toString()
            }
          } else {
            this.money = newValue
            if (/^\d+\.00{1}$/.test(newValue)) {
              this.money = (Math.floor(parseFloat(newValue) * 100) / 100).toString() + '.01'
            }
          }
        }
      }
    }
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '收银台'
    },
    /* input moneyFocus*/
    moneyFocus() {
    },
    /* 点击键盘*/
    addNumber(num) {
      if (this.money.length < 13) {
        this.money = this.money + num
      }
    },
    /* 点击 添加 .*/
    addPoint() {
      const i = this.money.indexOf('.')
      if (i === -1) {
        this.money = this.money + '.'
      }
    },
    /* 删除键盘*/
    deleteNumber() {
      this.money = this.money.slice(0, this.money.length - 1)
    },
    /* 点击 确认收款*/
    confirmProceeds() {
      const that = this
      if (!that.money) {
        that.$toast({
          message: '请输入需要收款的金额',
          position: 'middle'
        })
      } else {
        if (that.judgeUserAuth()) {
          that.$router.push({ path: '/creditChannel', query: {
            proceedsAmount: that.money
          }})
        }
      }
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
  .con_body{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 720px;
  }
  .box{
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%,0);
    .bgGradient(135deg,@gradientA,@gradientB);
    width: 160%;
    height: 120%;
    border-radius: 50%;
    z-index: 1;
    img{
      width: 100%;
      height: 200%;
      border-radius: 50%;
      position: absolute;
      top: -104%;
      left: 8%;
    }
  }
  .proceeds_header{
    position: relative;
    overflow: hidden;
    padding-bottom: 1.1vh;
  }
  .header_warp{
    position: relative;
    width: 702px;
    margin: 4vh auto 0 ;
    // background-color: #ffffff;
    // box-shadow: 0px 10px 20px 0px rgba(51, 51, 51, 0.1);
    // border-radius: 15px;
    z-index: 99;
  }
  .proceeds_msg{
    padding: 0 0 8vh 0;
  }
  .proceeds_msg p{
    margin-left: 5px;
  }

  .proceeds_input{
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    border-bottom: 1px solid #ffffff;
    margin: 0 20px 40px 40px;
  }
  .proceeds_input >span{
    margin-right: 20px;
    font-size: 48px;
    color: #ffffff;
  }
  .proceeds_input >input{
    width: 180px;
    height: 94px;
    max-width: 83%;
    border: none;
    padding: 0 10px;
    font-size: 72px;
    color: #333333;
    background: transparent;
  }
  .proceeds_input >.proceedsInput_number{
    /* height: 7.1vh; */
    max-width: 83%;
    min-width: 180px;
    border: none;
    padding: 0 10px;
    font-size: 85px;
    color: #ffffff;
    background: transparent;
  }
  .real-money {
    color: #ffffff;
  }
  .proceeds_input .proceedsInput_placeholder{
    display: inline-block;
    font-size: 85px;
    color: #ffffff;
    transform: translateX(-20px);
    content: '0.00';
  }
  .type_items{
    padding: 2vh 0rem 2.3vh;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .type_item{
    width: 12vh;
    height: 12vh;
    margin-bottom: 20px;
    justify-content: center;
    text-align: center;
    border-radius: 10px;
    border: 0.01rem solid #eeeeee;
  }
  .type_item-on{
    border: 0.01rem solid @mainColorB;
  }
  .type_item-disable{
    opacity: .5;
  }
  .type_icon{
    width: 120px;
    height: 100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
  .type_item .type_icon >img{
    width: 70%;
    margin: 0 auto;
  }

  .proceeds_keyboard{
    position: fixed;
    margin-top: 11px;
    width: 100%;
    background: #ffffff;
    bottom: 100px;
  }
  .keyboard_item{
    width: 33.33%;
    height: 152px;
    line-height: 152px;
    font-size: 60px;
    text-align: center;
    color: #666666;
    border: 0.01rem solid #eeeeee;
  }
  .keyboard_delect{
    width: 100%;
    height: 156px;
    text-align: center;
    background-color: @mainColorB;
    opacity:0.6;
    display: flex;flex-direction: column;align-items: center;justify-content: center;
  }
  .keyboard_delect2{
    background-color: @mainColorB;
    opacity:0.3;
  }
  .keyboard_delect>i{
    font-size: 80px;
    color: white;

  }
  .keyboard_confrim{
    height: 468px;
    text-align: center;
    background: linear-gradient(225deg,@gradientA 0%,@gradientB 100%);
    background-blend-mode: normal, normal;
  }
  .keyboard_confrim >span{
    display: inline-block;
    margin-top: 176px;
    font-size: 40px;
    color: #ffffff;
  }
  /* 新UI调整 */
  .money-label {
    font-size: 40px;
    color: #ffffff;
  }
  .money-sign {
    padding-bottom: 5px;
    color: #f7cbcb;
  }
  .union {
    width: auto;
    height: 40px;
  }
  .tip{
    padding: 40px 28px;
    box-sizing: border-box;
  }
  .xian{
    display: inline-block;
    color: @mainColorB;
    font-size: 16px;
  }
  .quan{
    width: 12px;
    height: 12px;
    background-color: #666666;
    border-radius: 6px;
  }
  .text_tip{
    width: 384px;
    margin: 0 20px 0 15px;
  }
</style>
