<template>
	<view class="content">
		<view class="add_card">
			<!-- 添加银行卡 -->
			<view class="z_img">
				<image src="../../static/plan/addcard.png"></image>
				<text @click="gotoMyCard()">添加信用卡</text>
			</view>
		</view>
		<view class="select_card">
			<text class="xz_text" v-if="cardList.length">选择还款银行</text>
			<view class="item-list">
				
				<view class="list-item" v-for="(item,index) in cardList" :key="index">
					<view>
					  <image class="z_logo" :src="item.bank_info && item.bank_info.bank_logo_image && item.bank_info.bank_logo_image.url"/>
					</view>
					<view class="z_idcard">
						<view class="name">{{ item.bank_info.name }}</view>
						<view class="text">{{item.card_info.card_no}}</view>
						<view class="z_check">
							<text>账单日：{{item.card_info.bill_date}}号</text>
							<text>到期日：{{item.card_info.repayment_date}}号</text>
						</view>
					</view>
					<view class="repayment" @click="godue(item.id)">立即还款</view>
				</view>
				
			</view>
		</view>
	</view>
</template>
<script>
import request from '../../common/request.js';
export default {
	data() {
		return {
			cardList: [],
			CardId:''  //信用卡ID
		};
	},
	onLoad() {},
	onShow: function() {
		this.getList()
	},
	methods: {
		getList() {
			const cardType = 'CREDIT'; //信用卡类型
			request({
				url: '/trade/cards/' + cardType,
				method: 'GET',
				data: {},
				success: res=> {
					this.cardList=res.data.data
					console.log(res.data.data)
				}
			});
		},
		gotoMyCard() {
			uni.navigateTo({
				url: '../center/myCard'
			});
		},
		godue(id) {
			this.CardId=id
			console.log(this.CardId)
			uni.navigateTo({
				url: '../plan/addChannel'+ '?CardId=' + this.CardId
			});
		}
	}
};
</script>

<style lang="less">
page,
.content {
	background: rgba(245, 245, 245, 1);
}
.content {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 9;
	top: 40upx;
	left: 0;
	bottom: 0;
	right: 0;
	.add_card {
		width: 90%;
		height: 120upx;
		background: white;
		margin: 0 5% 40upx 5%;
		border-radius: 10upx;
		.z_img {
			line-height: 120upx;
			image {
				margin-left: 242upx;
				width: 36upx;
				height: 36upx;
				vertical-align: middle;
			}
			text {
				margin-left: 10upx;
				font-size: 30upx;
				color: rgba(191, 151, 97, 1);
			}
		}
	}
	// 选择还款银行ui
	.select_card {
		.xz_text {
			margin-left: 35upx;
			color: #333333;
			font-size: 28upx;
		}
		.item-list {
			margin-bottom: 50upx;
			.list-item {
				background: url(../../static/plan/bjcard.png);
				background-size: cover;
				width: 90%;
				border-radius: 20upx;
				height: 200upx;
				margin-left: 5%;
				margin-top: 30upx;
				display: flex;
				flex-direction: row;
				.z_logo {
					width: 72upx;
					height: 72upx;
					border-radius: 50%;
					margin: 35upx;
				}
				.z_idcard {
					view {
						color: white;
					}
					.name {
						font-size: 32upx;
						margin-top: 30upx;
					}
					.text {
						font-size: 28upx;
						margin-top: 10upx;
					}
					.z_check {
						font-size: 24upx;
						margin-top: 20upx;
					}
					.z_check text:nth-of-type(2) {
						margin-left: 40upx;
					}
				}
				.repayment {
					width: 160upx;
					height: 60upx;
					line-height: 60upx;
					font-size: 24upx;
					color: white;
					margin-top: 70upx;
					margin-left: 30upx;
					border: 1upx solid white;
					border-radius: 100upx;
					text-align: center;
				}
			}
		}
	}
}
</style>
