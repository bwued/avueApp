<template>
	<view class="add-page2">
		<view class="tooMsp">
			<uni-icons @tap="goBack" class="uni-icons" type="arrowleft" size="25" color="#502E2E"></uni-icons>
			<text>银行卡验证</text>
		</view>
		<view class="con_body">
			<view class="form_cells">
				<view class="form_cell">
					<text class="form_label">银行卡号</text>
					<text class="form_cellBd">{{ creditCardId }}</text>
				</view>
				<view class="form_cell">
					<text class="form_label">所属银行</text>
					<text class="form_cellBd">{{ cardName }}</text>
				</view>
				<view class="form_cell">
					<text class="form_label">CVN2</text>
					<text class="form_cellBd">{{ CVN2 }}</text>
				</view>
				<view class="form_cell">
					<text class="form_label">有效期</text>
					<text class="form_cellBd">{{ validityMonth }} 月 / {{ validityYear }} 年</text>
				</view>
				<view class="form_cell">
					<text class="form_label">预留手机号</text>
					<text class="form_cellBd">{{ tel }}</text>
				</view>
				<view class="form_cell form_flex">
					<text class="form_label">验证码</text>
					<text class="form_cellBd"><input v-model="code" type="number" placeholder="请输入验证码" maxlength="6" /></text>
					<view class="form_cellFt">
						<button v-if="!isGetCode" class="btn_getCode" @click="getCodeFun">获取验证码</button>
						<button v-else class="btn_stay">{{ num }}s 后重发</button>
					</view>
				</view>
			</view>
			<view class="form_tip">验证码将发到预留手机号中</view>
			<view class="btn_warp" @click="confirmBindCard">保 存</view>
		</view>
	</view>
</template>

<script>
import request from '../../common/request.js';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
	components: { uniIcons },
	props: ['hideBindCard','cId', 'cCode'],
	data() {
		return {
			cardID: '', //银行卡ID
			channelCode: '', // 渠道代码
			creditCardId: '', // 银行卡号
			cardName: '', // 所属银行
			CVN2: '', // CVN2
			validity: '', // 有效期
			tel: '', // 预留手机号
			validityMonth: '', // 有效期月份
			validityYear: '', // 有效期年
			code: '', // 验证码
			isGetCode: false, // 是否有获取验证码 true 已获取
			num: 60, // 验证码num
			timer: '', // setInterval
			bizOrderNumber: '' // 渠道绑卡订单号
		};
	},
	created() {
		this.cardID = this.cId;
		this.channelCode = this.cCode;
		console.log(this.cId);
		console.log(this.channelCode);
		this.getCreditCardMsg();
	},
	methods: {
		/* 根据信用卡ID获取信用卡信息*/
		getCreditCardMsg() {
			request({
				url: '/trade/cards/CREDIT/' + this.cardID,
				method: 'GET',
				data: {},
				success: res => {
					this.creditCardId = res.data.data.card_no;
					this.cardName = res.data.data.bank_info.name;
					this.CVN2 = res.data.data.lass_three_cvn2;
					this.tel = res.data.data.card_phone_number;
					//获取有效期
					this.validityMonth = res.data.data.valid_date.substr(0, 2);
					this.validityYear = '20' + res.data.data.valid_date.substr(2);
					console.log(res.data.data);
				}
			});
		},
		goBack() {
			uni.navigateBack(1);
		},
		getCodeFun() {
			//获取验证码
			const that = this;
			if (!that.isGetCode) {
				that.isGetCode = true;
				that.timer = setInterval(() => {
					if (that.num !== 0) {
						that.num--;
					} else {
						that.isGetCode = false;
						that.num = 60;
						clearInterval(that.timer);
					}
				}, 1000);
			}
			request({
				//发送验证码接口
				url: '/trade/cards/binding/CREDIT/' + this.cardID + '/' + this.channelCode,
				method: 'Post',
				data: {},
				success: res => {
					const state = res.data.data.state;
					const errorMsg = res.data.data.errorMsg;
					this.bizOrderNumber = res.data.data.bizOrderNumber;
					if (state != '000') {
						// state 为000 为成功
						if (errorMsg === '系统异常') {
							uni.showToast({
								title: '银行卡信息不匹配',
								icon: 'none',
								duration: 2000
							});
							that.isGetCode = false;
							that.num = 60;
							clearInterval(that.timer);
						} else {
							uni.showToast({
								title: errorMsg,
								icon: 'none',
								duration: 2000
							});
							that.isGetCode = false;
							clearInterval(that.timer);
						}
					}
				},
				error: function error() {
					that.isGetCode = false;
					that.num = 60;
					clearInterval(that.timer);
				}
			});
		},
		confirmBindCard() {
			// 点击保存确认状态，确定绑卡，绑卡后成功后直接运行进行弹窗
			const that = this;
			if (!that.code) {
				uni.showToast({
					title: '请输入收到的验证码',
					icon: 'none',
					duration: 3000
				});
			} else {
				uni.showLoading({
					title: '请稍等...',
					mask: true // 禁用背景点击
				});
				setTimeout(function() { //2000秒关闭
					uni.hideLoading();
				}, 3000);

				// 保存确认 调用确定接口
				request({
					url: '/trade/cards/binding/CREDIT/' + that.cardID + '/' + that.channelCode + '/' + that.bizOrderNumber + '/confirm',
					method: 'post',
					data: JSON.stringify({
						captcha_code: that.code
					}),
					success: res => {
						const state = res.data.data.state;
						const errorMsg = res.data.data.errorMsg;
						if (state != '000') {
							uni.showToast({
								title: errorMsg,
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: errorMsg,
								icon: 'none'
							});
							that.hideBindCard();
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="less">
.tooMsp {
	//头部
	width: 100%;
	height: 86upx;
	line-height: 86upx;
	text-align: center;
	background: white;
	position: relative;
	.uni-icons {
		width: 70upx;
		position: absolute;
		left: 1upx;
	}
	.text {
		color: #000000;
		font-size: 30upx;
	}
}
.con_body {
	.form_cells {
		width: 100%;
		// height: 600upx;
		background: white;

		.form_cell {
			height: 100upx;
			line-height: 100upx;
			border-top: 1upx solid #f5f5f5;
			.form_label {
				width: 20%;
				display: inline-block;
				margin-left: 35upx;
				color: #333333;
				font-size: 28upx;
			}
			.form_cellBd {
				margin-left: 30upx;
				color: #333333;
				font-size: 28upx;
				font-weight: bold;
			}
		}
		.form_flex {
			display: flex;
			flex-direction: row;
			.form_cellBd {
				display: inline-block;
				width: 200upx;
				input {
					height: 100upx;
					line-height: 100upx;
					font-size: 28upx;
				}
			}
			.form_cellFt {
				background: white;
				margin-top: 15upx;
				margin-left: 110upx;

				.btn_getCode {
					background: white;
					color: #be9760;
					font-size: 25upx;
					width: 180upx;
					height: 70upx;
					border: 2upx solid #be9760;
				}
				.btn_stay {
					background: white;
					color: #be9760;
					font-size: 25upx;
					width: 180upx;
					height: 70upx;
					border: 2upx solid #be9760;
				}
			}
		}
	}
	.form_tip {
		color: #999999;
		font-size: 25upx;
		margin: 25upx 35upx;
	}
	.btn_warp {
		width: 90%;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		margin-left: 5%;
		margin-top: 60upx;
		color: #ffffff;
		background: #be9760;
	}
}
</style>
