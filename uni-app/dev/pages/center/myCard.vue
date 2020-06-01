<template>
	<view id="myCard">
		<view class="vbox">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#bf9761"></uni-segmented-control>
			<view class="content">
				<view class="fs12" style="text-align: center; padding-top: 25rpx;" v-if="cardMsg.length == 0">还没{{ items[current] }}哦~</view>
				<!-- 添加银行卡 -->
				<view class="add_card">
					<view class="z_img">
						<image src="../../static/plan/addcard.png"></image>
						<text @click="gotoMyCard()">添加{{ items[current] }}</text>
					</view>
				</view>
				<view v-show="current === 0">
					<text class="fs12" v-if="cardMsg.length > 0">共 {{ cardMsg.length }} 张储蓄卡</text>
					<view class="item-list" v-for="(item,index) in cardMsg">
						<view class="list-item">
							<view><image class="z_logo" :src="item.bank_info && item.bank_info.bank_logo_image.url"></image></view>
							<view class="z_idcard">
								<view class="name">{{item.bank_info.name}}</view>
								<view class="text"> {{ '**** **** *** ' + item.card_info.card_no.substr(item.card_info.card_no.length-4) }}</view>
							</view>
							<view class="icon_trashe">
								<uni-icons type="trash" style="color: #fff; margin-top: 12upx;" size="20" @click="deleteCardFun(item.id)"></uni-icons>
							</view>
						</view>
					</view>
					
				</view>
				<!-- 信用卡 start -->
				<view v-show="current === 1">
					<text class="fs12">共 {{ cardMsg.length }} 张信用卡</text>
					<view>
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
							<view class="item-list" v-for="(item,index) in cardMsg">
								<view class="list-item">
									<!-- <view><image class="z_logo" src="http://admin.zhr168.com/static/image/open/persistence/e33080fab8fe1c6e32b822533c485d1e.png"></image></view> -->
									<view><image class="z_logo" :src="item.bank_info && item.bank_info.bank_logo_image.url"></image></view>
									<view class="z_idcard">
										<view class="name">{{item.bank_info.name}}</view>
										<view class="text"> {{ '**** **** *** ' + item.card_info.card_no.substr(item.card_info.card_no.length-4) }}</view>
										<view class="z_check">
											<text>账单日：{{ item.card_info.bill_date }}号</text>
											<text>到期日：{{ item.card_info.repayment_date }}号</text>
										</view>
									</view>
									<view class="icon_trashe">
										<uni-icons type="trash" style="color: #fff; margin-top: 12upx;" size="20" @click="deleteCardFun(item.id)"></uni-icons>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<!-- 信用卡 end -->
			</view>
		</view>
		
		
		<!-- dialog start -->
		<view id="dialogBg" v-show="dialog">
		    <view  class="dialogBox">
				<h3 class="dialogTitle">确定删除银行卡？</h3>
				<text class="subTip">删除的银行卡无法恢复</text>
				<view class="dialogBtn">
					<view class="btn close"  @click="close()">再想想</view>
					<view class="btn confirm"  @click="confirm()">删除</view>
				</view>
			</view>
		</view>
		<!-- dialog end -->
		
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue'
import request from '../../common/request.js';
export default {
	components: { 
		uniIcons,
		uniPopup,
		uniSegmentedControl
		},
	data() {
		return {
			items: ['储蓄卡', '信用卡'],
			scrollTop: 0,
			cardMsg: [1,2],
			current: 0,
			dialog: false // 显示dialog
		};
	},
	onLoad() {},
	onShow: function() {
		this.getList()
	},
	methods: {
		deleteCardFun(id){
			 this.dialog = true;
			 this.id = id;
		  },
		/**
		 * 点击取消按钮触发
		 * @param {Object} done
		 */
		close(){
			this.dialog = false;
		    this.id = '';
		},
		/**
		 * 点击确认按钮触发
		 * @param {Object} done
		 * @param {Object} value
		 */
		confirm(){
			const that = this;
			const id = that.id;
			if(!id) return;
			const cardType = that.current === 1 ? 'CREDIT': 'DEBIT'
			request({
				url: '/trade/cards/'+id + '/' + cardType,
				method: 'DELETE',
				data: {},
				success: function(res) {
					if(res.data.code == 403000){ // token 超时
						uni.showToast({
						     icon: 'none',
						     title: '登录已失效'
						 });
						 uni.navigateTo({
						 	url:'/pages/login/login'
						 })
					}else{
						that.close();
						console.log(res.data);
						uni.showToast({
							 icon: 'none',
							 title: '删除银行卡成功'
						 });
						that.getList()
					}
					
				}
			});
			
		},
		getList(){
			  /* current 0 储蓄卡   1 信用卡*/
			const that = this  
			const cardType = this.current === 0 ? 'DEBIT' : 'CREDIT'
			request({
				url: '/trade/cards/'+cardType,
				method: 'GET',
				data: {},
				success: function(res) {
					console.log('111112');
					if(res.data.code == 403000){ // token 超时
						uni.showToast({
						     icon: 'none',
						     title: '登录已失效'
						 });
						 uni.navigateTo({
						 	url:'/pages/login/login'
						 })
					}else{
						console.log(res.data);
						that.cardMsg = res.data.data
					}
					
				}
			});
		},
		upper: function(e) {
			console.log(e);
		},
		lower: function(e) {
			console.log(e);
		},
		onClickItem(e) {
			if (this.current !== e.currentIndex) {
				this.current = e.currentIndex;
			}
			this.getList()
			// alert(this.current)
		},

		gotoMyCard() {
			uni.navigateTo({
				url: '/pages/center/addCard'
			});
		}
	}
};
</script>

<style lang="less">
#myCard{width: 100%; height: 100%; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: rgba(245, 245, 245, 1);
	.segmented-control{background: #fff!important;}
	.item-list:last-child{position: relative; padding-bottom: 40rpx;}
	.icon_trashe{position: absolute; top:30rpx; right: 30rpx; width:50rpx ;}
}	

.vbox {
	position: relative;
	width: 100%;
	height: 100%;
	.content {
		background: rgba(245, 245, 245, 1);
		padding-top: 10rpx;
	}
	.vbtn {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: #bf9761;
		color: #fff;
	}
	.fs12 {
		font-size: 24rpx;
		color: #999;
		padding-left: 20rpx;
	}
}

.add_card {
	width: 90%;
	height: 120upx;
	background: white;
	margin: 40upx 5%;
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

.item-list {
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
		position: relative;
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

.list_items {
	padding-bottom: 124px;
	box-sizing: border-box;
}
.list_item {
	width: 702px;
	height: 200px;
	margin: 0 auto 20px;
	border-radius: 15px;
}
.list_item2 {
	width: 702px;
	height: 200px;
	margin: 0 auto 20px;
	border-radius: 15px;
}
.card_logo {
	text-align: center;
}
.card_logo > img {
	width: 88px;
	height: 88px;
	border-radius: 50%;
}

/* dialog 弹窗 */ 
#dialogBg{
	position: fixed; height: 100%; width: 100%;
	left: 0; top: 0; bottom: 0; right: 0;
	// background: #000; 
	background: rgba(0, 0, 0, 0.8);
	z-index: 2;
	.dialogBox{
		position: fixed;
		width: 80%;
		height: 327rpx;
		left: 50%;
		top: 50%;
		margin-left: -40%;
		margin-top: -163.5rpx;
		background: #fff;
		opacity:1;
		border-radius: 10rpx;
		z-index: 9999;
		text-align: center;
	}
	.dialogTitle{ font-size: 36rpx;  padding-top:35rpx;}
	.subTip{ color:#757A85; font-size:28rpx; display: block; padding:30rpx 0 45rpx;} 
	.dialogBtn{ height: 250rpx; position:relative; text-align: center;
		.btn{ width: 40%; border-radius:10rpx; line-height: 90rpx; height:90rpx; font-size: 30rpx; }
		.close{margin-left:5%; float: left; 
		 border: 2rpx solid #ddd;
		}
		.confirm{margin-right: 5%; float: right; 
		border: 2rpx solid #bf9761;
		color: #fff;
		background:#bf9761;}
	}
}
</style>
