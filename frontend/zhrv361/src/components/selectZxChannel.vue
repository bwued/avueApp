<template>
<!-- 自选通道 -->
  <div class="select-channel-page">
    <div class="title-text">
      请选择通道
    </div>
    <ul class="list">
      <li v-for="(item,index) in list" :key="index" :class="{'item':true,'on':activeId===index}" @click="selectedChannel(item,index)">
        <img :src="item.logo_image&&item.logo_image.url">
        <div class="text">
          <div class="name">
            {{ item.name }}
          </div>
          <div class="clear">
            <span class="lt dec-text">费率：{{ (item.rate * 100).toFixed(2) }}% , {{ (item.big_money_user_rate * 100).toFixed(2) }}% </span>
            <span class="rt dec-text">交易时间：{{ item.start_time }}-{{ item.end_time }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'SelectChannel',
  data() {
    return {
      showDetail: false,
      list: [],
      selectedChannelItem: {},
      showDetailItem: {},
      activeId: 0
    }
  },
  created() {
    this.repayChannelListFun()
  },
  methods: {
    repayChannelListFun() {
      this.$api.plan.repayChannelList().then(res => {
        console.log(res)
        this.list = res.data.data
        if (this.list.length > 0) {
          this.selectedChannelItem = this.list[0]
//		  this.showDetailFun(this.selectedChannelItem)
        }
      })
    },
    selectedChannel(item, index) {
      // console.log(item)
      this.selectedChannelItem = item
      this.activeId = index
	    this.showDetailFun(item)
    },
    showDetailFun(item) {
      // event.preventDefault() || event.stopPropagation()
      this.showDetailItem = item
      this.showDetail = true
    }
  }
}
</script>
<style lang="less" scoped>
@import '../assets/less/common.less';
.select-channel-page{
  height: 100%;
  overflow: hidden;
  padding: 24px;
  box-sizing: border-box;
  .title-text{
    font-size: 28px;
    color: @lightGrey;
    margin: 24px 0;
  }
  .list{
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 180px;
    box-sizing: border-box;
    .item{
      width:100%;
      height:250px;
      background:#fff;
      border:2px solid #bf9761;
      border-radius:10px;
      padding: 24px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 24px;
      &.on{
        background: #D2AB76;
        .text{
          .name,.dec-text,.tip{
            color: #fff;
          }
        }
        .detail-btn,.iconfont{
          color: #fff !important;
        }
      }
      img{
        width: 66px;
        height: 66px;
        margin-right: 24px;
        flex-shrink: 0;
        border-radius: 50%;
      }
      .text{
        width: 565px;
        .name{
          font-size: 34px;
          font-weight: bold;
        }
        .tip{
          font-size: 20px;
          color: @lightGrey;
          width: 100%;
        }
        .dec-text{
          font-size: 20px;
          color: @lightGrey;
          margin: 24px 0;
        }
      }
      .detail-btn{
        font-size: 24px;
        color: @lightGrey;
        position: absolute;
        top: 24px;
        right: 24px;
        .iconfont{
          font-size: 10px;
          color: @lightGrey;
        }
      }
    }
  }
  .add-btn{
    width:100%;
    height:100px;
    background:#BF9761;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    line-height: 100px;
    color: #FFFFFF;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:active {
      opacity: .6;
    }
  }
  .detail{
    border-radius: 20px;
    padding: 36px 54px;
    box-sizing: border-box;
    text-align: center;
    width: 90%;
    max-height: 90%;
    height: auto;
    .img{
      width: 100px;
      height: 100px;
    }
    .name{
      font-size: 36px;
      margin: 6px 0 40px;
    }
    .dec-text{
      margin-bottom: 24px;
      font-size: 24px;
      text-align: left;
    }
    .tip{
      color: @lightGrey;
      font-size: 24px;
      margin-bottom: 130px;
      text-align: left;
      /deep/ p{
        display: inline-block;
        font-size: 20px;
        color: @lightGrey;
      }
    }
  }
}
</style>

