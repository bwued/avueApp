<template>
	<view class="content">
		<view class="top">系统推荐通道：</view>
		<view class="addchannl">
			<!-- 	<image class="tuijian" src="../../static/plan/tuijian.png"></image> -->
			<image class="tuijian" :src="tj_logo"></image>
			<view><image class="z_logo" :src="list_item && list_item.logo_image && list_item.logo_image.url"></image></view>
			<view class="z_idcard">
				<view class="name">{{ list_item.name }}</view>
				<view class="text">通道费率：{{ (list_item.rate * 100).toFixed(2) }}%，{{ (list_item.big_money_user_rate * 100).toFixed(2) }}%</view>
				<view class="z_check">交易时间：{{ list_item.start_time }}-{{ list_item.end_time }}</view>
			</view>
			<text class="repayment">{{ list_item.is_sign == true ? '已签约' : '未签约' }}</text>
		</view>
		<view class="self" @click="GetListCode">自选通道</view>
		<view class="plan">
			<view type="message" class="item intelligence" @click="Intell">
				<image src="../../static/plan/addcard.png"></image>
				<text>添加自选计划</text>
			</view>
			<view class="item custom" @click="Intell_Lazy">
				<image src="../../static/plan/addlangui.png"></image>
				<text>添加懒鬼计划</text>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="uni-tip">
				<text class="z_text">请选择通道</text>
				<view class="list">
					<view class="list-item" v-for="(item, index) in list" :key="index" :class="{ item: true, on: activeId === index }" @click="selectedChannel(item, index)">
						<view><image class="z_logo" :src="item && item.logo_image && item.logo_image.url"></image></view>
						<view class="z_idcard">
							<view class="name">{{ item.name }}</view>
							<view class="text">通道费率：{{ (item.rate * 100).toFixed(2) }}%，{{ (item.big_money_user_rate * 100).toFixed(2) }}%</view>
							<view class="z_check">交易时间：{{ item.start_time }}-{{ item.end_time }}</view>
						</view>
						<text class="repayment">{{ item.is_sign == true ? '已签约' : '未签约' }}</text>
					</view>
				</view>
			</view>
			<view class="add-btn" @click="subcom(item_code)">确定</view>
		</uni-popup>
		<!-- 弹窗提示 start -->

		<uni-popup ref="popupge" :duration="10000" type="message">
			<view class="uni-mesg">
				<view class="text-mesg">该通道还没签约，确定进行签约?</view>
				<view class="confirm">
					<text class="text_left" @click="call()">取消</text>
					<text class="text-right" @click="succ()">确定</text>
				</view>
			</view>
		</uni-popup>
		<!-- 弹窗提示 end -->
		<!-- 签约页面 start -->
		<view v-if="isbindCard" class="add-page"><bind-card :hide-bind-card="hideBindCardFun" :c-id="creditCardId" :c-code="channel_code" /></view>
		<!-- 签约页面 end -->
	</view>
</template>

<script>
import request from '../../common/request.js';
import uniSection from '@/components/uni-section/uni-section.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import bindCard from '@/pages/plan/bindCard.vue';
export default {
	components: { uniSection, uniPopup, bindCard },
	data() {
		return {
			valPar: '父组件传递过来的值',
			isbindCard: false,
			isbindCardhk: false,
			item_code: {}, //默认通道
			activeId: 0,
			creditCardId: '', //信用卡ID
			channel_code: '', // 渠道代码
			tj_logo: require('../../static/plan/tuijian.png'),
			list_item: {}, //推荐通道
			list: [] //自选通道列表
		};
	},
	onLoad(option) {
		this.creditCardId = option.CardId;
		console.log(this.creditCardId);
	},
	created() {
		this.GetCode();
	},
	methods: {
		GetCode() {
			// 获取推荐通道
			request({
				url: '/repayment/recommend/channel/' + this.creditCardId,
				method: 'GET',
				data: {},
				success: res => {
					this.list_item = res.data.data;
					this.channel_code = res.data.data.code;
					console.log(this.channel_code);
				}
			});
		},
		GetListCode() {
			//自选通道列表
			this.$refs.popup.open(); //打开弹窗
			request({
				url: '/repayment/recommend/channelList/' + this.creditCardId,
				method: 'GET',
				data: {},
				success: res => {
					this.list = res.data.data;
					console.log(this.list);
				}
			});
		},

		Intell() {
			//自选通道
			var that = this;
			if (that.list_item.is_sign != true) {
				//判断如果没签约  打开弹窗提示
				this.$refs.popupge.open(); //打开弹窗
			} else {
				uni.navigateTo({
					url: '../plan/intelligence' + '?CardId=' + this.creditCardId
				});
			}

			// if (that.list_item.sign != 1) {
			// 	uni.navigateTo({
			// 		url: '../plan/intelligence'
			// 	});
			// } else {
			// 	this.isbindCard=true
			// }
		},
		call() {
			//取消关闭弹窗
			this.$refs.popupge.close();
		},
		succ() {
			this.$refs.popupge.close(); //确定关闭弹窗
			this.isbindCard = true;
		},
		Intell_Lazy() {
			uni.navigateTo({
				url: '../plan/intelligence_lazy'
			});
		},
		// open() {  //打开弹窗
		// 	this.$refs.popup.open();
		// },
		subcom(item) {
			//确定选择通道关闭popup
			this.$refs.popup.close();
			console.log(item);
			this.list_item.logo_image.url = item.logo_image.url;
			this.list_item.name = item.name;
			this.list_item.rate = item.rate;
			this.list_item.big_money_user_rate = item.big_money_user_rate;
			this.list_item.start_time = item.start_time;
			this.list_item.end_time = item.end_time;
			this.list_item.is_sign = item.is_sign;
			this.tj_logo = '';
			this.channel_code = item.code;
		},
		selectedChannel(item, index) {
			//弹窗popup  class样式切换绑定
			// console.log(item)
			this.item_code = item; //选中通道赋值给确定按钮

			this.selectedChannelItem = item;
			this.activeId = index;
		},
		hideBindCardFun() { //关闭银行卡签约页面
		  this.isbindCard = false;
		}
	}
};
</script>

<style lang="less">
@col: #bf9761;
.add-page {
	position: fixed;
	top: 0;
	left: 50%;
	transform: translate(-50%, 0);
	width: 100%;
	height: 100%;
	background: rgba(245, 245, 245, 1);
}
page,
.content {
	background: rgba(245, 245, 245, 1);
}
.content {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 99;
	top: 35upx;
	left: 0;
	bottom: 0;
	right: 0;
	.top {
		color: #999;
		font-size: 28upx;
		margin-left: 35upx;
	}
	.addchannl {
		background: url(../../static/plan/bjcard.png);
		background-size: cover;
		width: 90%;
		border-radius: 20upx;
		height: 200upx;
		margin-left: 5%;
		margin-top: 30upx;
		display: flex;
		flex-direction: row;
		.tuijian {
			width: 60upx;
			height: 34upx;
			margin-bottom: 10upx;
		}
		.z_logo {
			width: 72upx;
			height: 72upx;
			border-radius: 50%;
			margin-top: 64upx;
			margin-left: -30upx;
		}
		.z_idcard {
			margin-left: 25upx;
			view {
				color: white;
			}
			.name {
				font-size: 32upx;
				margin-top: 32upx;
			}
			.text {
				font-size: 22upx;
				margin-top: 18upx;
			}
			.z_check {
				font-size: 22upx;
				margin-top: 14upx;
			}
		}
		.repayment {
			width: 90upx;
			height: 40upx;
			line-height: 40upx;
			text-align: center;
			border: 1upx solid white;
			border-radius: 10upx;
			color: white;
			font-size: 20upx;
			margin-top: 30upx;
			margin-left: 67upx;
		}
	}
	.self {
		width: 140upx;
		height: 54upx;
		line-height: 54upx;
		text-align: center;
		font-size: 24upx;
		color: #bf9761;
		border: 1upx solid #bf9761;
		border-radius: 100upx;
		position: relative;
		left: 570upx;
		top: 30upx;
	}
	.plan {
		display: flex;
		flex-direction: row;
		margin-top: 200upx;
		.item {
			width: 300upx;
			height: 90upx;
			line-height: 90upx;
			font-size: 30upx;
			border-radius: 10upx;
			margin-left: 50upx;
			text-align: center;
			image {
				width: 36upx;
				height: 36upx;
				vertical-align: middle;
			}
			text {
				position: relative;
				top: 3upx;
				left: 5upx;
			}
		}
		.intelligence {
			background: white;
			border: 2upx solid rgba(191, 151, 97, 1);
			color: #bf9761;
		}
		.custom {
			background: #bf9761;
			color: white;
		}
	}
	.uni-mesg {
		//提示没签约 取消/确定
		width: 80%;
		height: 250upx;
		background-color: #fff;
		margin: 50% auto;
		border-radius: 10upx;
		.text-mesg {
			color: #666;
			font-size: 32upx;
			height: 150upx;
			line-height: 150upx;
			text-align: center;
		}
		.confirm {
			border-top: 1upx solid #f5f5f5;
			text {
				display: inline-block;
				width: 50%;
				font-size: 32upx;
				height: 100upx;
				line-height: 100upx;
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
		height: 1078upx;
		background-color: #fff;
		.z_text {
			color: #757a85;
			font-size: 28upx;
			margin: 35upx 0 0 35upx;
		}
		.list {
			.list-item {
				position: relative;
				width: 90%;
				height: 200upx;
				margin-left: 5%;
				margin-top: 35upx;
				border: 2upx solid #b19160;
				border-radius: 10upx;
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
						border: 1upx solid #fff;
					}
				}
				.z_logo {
					width: 72upx;
					height: 72upx;
					border-radius: 50%;
					margin: 64upx 32upx;
				}
				.z_idcard {
					.name {
						color: #333;
						font-size: 32upx;
						margin-top: 32upx;
						height: 45upx;
					}
					.text {
						color: #999;
						font-size: 22upx;
						margin-top: 18upx;
					}
					.z_check {
						color: #999;
						font-size: 22upx;
						margin-top: 14upx;
					}
				}
				.repayment {
					width: 90upx;
					height: 40upx;
					line-height: 40upx;
					text-align: center;
					border: 1upx solid #bf9761;
					border-radius: 10upx;
					color: #bf9761;
					font-size: 20upx;
					position: absolute;
					right: 30upx;
					top: 36upx;
				}
			}
		}
	}
	.add-btn {
		background: @col;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		color: white;
	}
}
</style>
