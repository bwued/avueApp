<template>
  <div class="content">
    <top-msg header-name="确认通道" />
    <div class="top">
      系统推荐通道：
    </div>
    <div class="addchannl">
      <img class="tuijian" :src="tj_logo">
      <div><img class="z_logo" :src="list_item && list_item.logo_image && list_item.logo_image.url"></div>
      <div class="z_idcard">
        <div class="name">
          {{ list_item.name }}
        </div>
        <div class="text">
          通道费率：{{ (list_item.rate * 100).toFixed(2) }}%，{{ (list_item.big_money_user_rate * 100).toFixed(2) }}%
        </div>
        <div class="z_check">
          交易时间：{{ list_item.start_time }}-{{ list_item.end_time }}
        </div>
      </div>
      <span class="repayment size26">{{ list_item.is_sign == true ? '已签约' : '未签约' }}</span>
    </div>
    <div class="self" @click="getCode()">
      自选通道
    </div>

    <van-popup v-model="showSelectChannel" position="bottom" class="select-channel">
      <!-- 自选通道 -->
      <div class="select-channel-page">
        <div class="title-text">
          请选择通道
        </div>
        <ul class="list">
          <li v-for="(item,index) in channelList" :key="index" :class="{'item':true,'on':activeId===index}" @click="selectedChannel(item,index)">
            <img :src="item.logo_image&&item.logo_image.url">
            <div class="text">
              <div class="name">
                {{ item.name }}
              </div>
              <div class="clear">
                <span class="lt dec-text">费率：{{ (item.rate * 100).toFixed(2) }}% , {{ (item.big_money_user_rate * 100).toFixed(2) }}% </span>
              </div>
              <div class="clear">
                <span class="lt dec-text">交易时间：{{ item.start_time }}-{{ item.end_time }}</span>
              </div>
              <span class="signTest size26">{{ item.is_sign == true ? '已签约' : '未签约' }}</span>
            </div>
          </li>
          <div class="add-btn" @click="selectChannel()">
            确定
          </div>
        </ul>
      </div>
    </van-popup>

    <div class="plan">
      <!-- <div type="message" class="item intelligence" @click="Intell">
        <img src="../../../static/img/addcard.png">
        <span style="color:#bf9761;">添加懒鬼计划</span>
      </div>
      <div class="item custom" @click="Intell_Lazy">
        <img src="../../../static/img/addlangui.png">
        <span style="color:#fff;">添加懒人计划</span>
      </div> -->

      <div type="message" class="item intelligence" @click="Intell" style="margin: 0 auto; text-align:center; width:60%;">
        <img src="../../../static/img/addcard.png">
        <span style="color:#bf9761;">添加懒人计划</span>
      </div>  
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
// import bindCard from '@/views/proceeds/bindCard'
// import bindCardh from '@/views/proceeds/bindCardHT' // 汇卡通道 12月 lhwsoft
export default {
  name: 'MyCard',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      cardId: this.$util.getQueryVariable('cardId'), // 当前信用卡id
      isbindCard: false,
      showSelectChannel: false,
      isbindCardhk: false,
      item_code: {}, // 默认通道
      creditCardId: '', // 信用卡ID
      channel_code: '', // 渠道代码
      tj_logo: require('../../../static/img/tuijian.png'),
      list_item: {}, // 推荐通道
      todo_item: {}, // 选择
      list: [],
      channelList: [], // 自选通道列表
      showDetail: false,
      selectedChannelItem: {},
      showDetailItem: {},
      activeId: 0
    }
  }, watch: {
    cardMsg: {
      handler(newVal, oldVal) {
      },
      deep: true
    }
  },
  mounted() {
    this.getChannel(this.$util.getQueryVariable('cardId'))
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '我的银行卡'
    },
    /* 获取推荐通道*/
    getChannel(cardId) {
      const that = this
      that.$api.card.getChannel(cardId).then(res => {
        that.list_item = res.data.data
        that.channel_code = res.data.data.code
        console.log(that.channel_code)
      }).catch(error => {
        console.log(error)
      })
    },
    getZxChannel(cardId) {
      const that = this
      that.channelList = []
      this.$api.card.getZxChannel(cardId).then(res => {
        that.channelList = res.data.data
        console.log('获取推荐通道...')
        console.log(that.channelList)
      })
    },
    selectedChannel(item, index) {
      // console.log(item)
      this.selectedChannelItem = item
      this.activeId = index
      this.list_item = item
      this.channel_code = item.code
	    // this.showDetailFun(item)
	    // this.selectChannel(item)
    },
    showDetailFun(item) {
      // event.preventDefault() || event.stopPropagation()
      this.showDetailItem = item
      this.showDetail = true
    },
    getCode() {
      this.showSelectChannel = true
      this.getZxChannel(this.$util.getQueryVariable('cardId'))
    },
    selectChannel(item) {
      this.showSelectChannel = false
    },
    // 信用卡绑卡签约函数 20200604
    binkcard() {
      const that = this
      that.$dialog({
        title: '提示',
        message: '该通道还没签约，确定进行签约?',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        className: 'dialog',
        closeOnClickOverlay: true
      }).then(res => {
        if (res === 'confirm') {
          // that.$router.replace('/login')
          // this.$router.push({ path: '/v3bindCard', query: { cardId: this.cardId, code: this.channel_code }})
          // sign_type：信用卡签约方式,绑卡类型: 0.无需绑卡 1.接口绑卡 2.H5绑卡 3.接口,HTML绑卡,4.接口绑卡、前端控制的套现发送验证码
          // signature：2 信用卡已签约，1 信用卡未签约
          // is_sign 字段说明：
          // * 签约状态
          // * true:已签约（储蓄卡已注册，信用卡已签约）
          // * false:未签约（储蓄卡未注册，或者信用卡未签约）
          // state：4 储蓄卡已注册，3 储蓄卡未注册
          if (that.list_item.sign_type === 1 || that.list_item.sign_type === 4) {
            that.$router.push({ path: '/v3bindCard', query: { cardId: this.cardId, code: this.channel_code, sign_type: that.list_item.sign_type }})
          } else if (that.list_item.sign_type === 2) {
            that.$router.push({ path: '/v3bindCardHT', query: { cardId: this.cardId, code: this.channel_code, sign_type: that.list_item.sign_type }})
          } else {
            that.$router.push({ path: '/v3bindCardTX', query: { cardId: this.cardId, code: this.channel_code, sign_type: that.list_item.sign_type }})
          }
        }
      })
    },
    Intell() {
      if (this.list_item.is_sign != true) {
        this.binkcard()
      } else {
        this.$router.push({ path: '/zxChannel', query: { cardId: this.cardId, code: this.channel_code }}) // 自选通道
      }
    },
    Intell_Lazy() {
      if (this.list_item.is_sign != true) {
        this.binkcard()
      } else {
        this.$router.push({ path: '/lrChannel', query: { cardId: this.cardId, code: this.channel_code }}) // 懒人计划
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
@col: #bf9761;
.add-page {
	position: fixed;
	top: 30px;
	left: 50%;
	transform: translate(-50%, 0);
	width: 100%;
	height: 100%;
	background: rgba(245, 245, 245, 1);
}
.content {
	background: rgba(245, 245, 245, 1);
}
.content {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 99;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	.top {
    padding-top:20px;
		color: #999;
		font-size: 28px;
		margin-left: 35px;
	}
	.addchannl {
		background: url(../../../static/img/bjcard.png);
		background-size: cover;
		width: 90%;
		border-radius: 20px;
		height: 200px;
		margin-left: 5%;
		margin-top: 30px;
		display: flex;
		flex-direction: row;
		.tuijian {
			width: 60px;
			height: 34px;
			margin-bottom: 10px;
		}
		.z_logo {
			width: 72px;
			height: 72px;
			border-radius: 50%;
			margin-top: 64px;
			margin-left: -30px;
		}
		.z_idcard {
			margin-left: 25px;
			div {
				color: white;
			}
			.name {
				font-size: 32px;
				margin-top: 32px;
			}
			.text {
				font-size: 22px;
				margin-top: 18px;
			}
			.z_check {
				font-size: 22px;
				margin-top: 14px;
			}
		}
		.repayment {
			width: 90px;
			height: 40px;
			line-height: 40px;
			text-align: center;
			border: 1px solid white;
			border-radius: 10px;
			color: white;
			margin-top: 30px;
			margin-left: 67px;
		}
	}
	.self {
		width: 140px;
		height: 54px;
		line-height: 54px;
		text-align: center;
		font-size: 24px;
		color: #bf9761;
		border: 1px solid #bf9761;
		border-radius: 100px;
		position: relative;
		left: 570px;
		top: 30px;
	}
	.plan {
		display: flex;
		flex-direction: row;
		margin-top: 200px;
		.item {
			width: 300px;
			height: 90px;
			line-height: 90px;
			font-size: 30px;
			border-radius: 10px;
			margin-left: 50px;
			text-align: center;
			img {
				width: 36px;
				height: 36px;
				vertical-align: middle;
			}
			span {
				position: relative;
				top: 3px;
				left: 5px;
			}
		}
		.intelligence {
			background: white;
			border: 2px solid rgba(191, 151, 97, 1);
			color: #bf9761;
		}
		.custom {
			background: #bf9761;
			color: white!important;
		}
	}
	.uni-mesg {
		//提示没签约 取消/确定
		width: 80%;
		height: 250px;
		background-color: #fff;
		margin: 50% auto;
		border-radius: 10px;
		.text-mesg {
			color: #666;
			font-size: 32px;
			height: 150px;
			line-height: 150px;
			text-align: center;
		}
		.confirm {
			border-top: 1px solid #f5f5f5;
			text {
				display: inline-block;
				width: 50%;
				font-size: 32px;
				height: 100px;
				line-height: 100px;
				text-align: center;
				color: #1989fa;
			}
			.text_left {
				// background: red;
			}
		}
	}
	/* 提示窗口 */
	.uni-tip {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 1078px;
		background-color: #fff;
		.z_text {
			color: #757a85;
			font-size: 28px;
			margin: 35px 0 0 35px;
		}
		.list {
			.list-item {
				position: relative;
				width: 90%;
				height: 200px;
				margin-left: 5%;
				margin-top: 35px;
				border: 2px solid #b19160;
				border-radius: 10px;
				display: flex;
				flex-direction: row;
				&.on {
					background: #d2ab76;
					.z_idcard {
						.name,
						.text,
						.z_check {
							color: #fff;
						}
					}
					.repayment {
						color: #fff;
						border: 1px solid #fff;
					}
				}
				.z_logo {
					width: 72px;
					height: 72px;
					border-radius: 50%;
					margin: 64px 32px;
				}
				.z_idcard {
					.name {
						color: #333;
						font-size: 32px;
						margin-top: 32px;
						height: 45px;
					}
					.text {
						color: #999;
						font-size: 22px;
						margin-top: 18px;
					}
					.z_check {
						color: #999;
						font-size: 22px;
						margin-top: 14px;
					}
				}
				.repayment {
					width: 90px;
					height: 40px;
					line-height: 40px;
					text-align: center;
					border: 1px solid #bf9761;
					border-radius: 10px;
					color: #bf9761;
					font-size: 20px;
					position: absolute;
					right: 30px;
					top: 36px;
				}
			}
		}
	}
	.add-btn {
		background: @col;
		height: 100px;
		line-height: 100px;
		text-align: center;
		color: white;
  }
  .select-channel{
    height: 85%;
    width: 100%;
    overflow: hidden;
  }
}

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
        .signTest{ position: absolute; top: 80px; right: 20px;
          width: 90px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #fff;
          border-radius: 10px;
          color: #fff;
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
      .signTest{ position: absolute; top: 80px; right: 20px;
          width: 90px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #bf9761;
          border-radius: 10px;
          color: #bf9761;
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
