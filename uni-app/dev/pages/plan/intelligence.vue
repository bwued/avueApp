<template>
	<view class="content">
		<view class="page-top">
			<image :src="cardList.bank_logo_image"/>
			<text class="name lt">{{cardList.name}}</text>
			<text class="text lt">{{cardList.card_no}}</text>
			<text class="type">信用卡</text>
		</view>
		<view class="bill">
			<view class="clear item">
				<text class="lt text">账单总金额</text>
				<text class="rt"><input class="input-box" type="number" /></text>
			</view>
			<view class="clear item">
				<text class="lt text">消费类型</text>
				<text class="rt">
					<text class="input-box" type="text">
						<picker @change="bindPickerChange" :value="index" :range="columns">
							<view class="uni-input">{{ columns[index] }}</view>
						</picker>
						<uni-icons class="uni-icons" type="forward" size="23" color="#999"></uni-icons>
					</text>
					<!-- 	<text class="input-box" type="text">{{ repay_type }}</text> -->
				</text>
			</view>
			<view class="clear item">
				<text class="lt text">选择账单日期</text>
				<text class="rt">
					<text class="input-box" type="text" @click="calendar">
						<text class="rili">111</text>
						<uni-icons class="uni-icons" type="forward" size="23" color="#999"></uni-icons>
					</text>
				</text>
			</view>
			<view class="clear item">
				<text class="lt text">每天还款笔数</text>
				<text class="rt" style="position: relative;left: 95upx;">
					<uni-icons @click="value > 1 ? value-- : (value = 1)" type="minus" size="21" color="#999"></uni-icons>
					<text class="text">{{ value }}</text>
					<uni-icons @click="value < repay_type_list.length ? value++ : (value = repay_type_list.length)" type="plus" size="21" color="#999"></uni-icons>
				</text>
			</view>
			<view class="clear item">
				<text class="lt text">选择省市</text>
				<text class="rt">
					<text class="input-box" type="text">
						<view class="value" style="margin-right: 25upx;"><BiaofunRegion class="region" @change="changeRegion"></BiaofunRegion></view>
						<uni-icons class="uni-icons" type="forward" size="23" color="#999"></uni-icons>
					</text>
				</text>
			</view>
		</view>
		<view class="flex_enact" @click="addBill">
			<image src="../../static/plan/addcard.png"></image>
			<text>制定账单</text>
		</view>
		<!-- 日历组件 start-->
		  <view class="masking_layer" v-if="isFlag" >
		<!--  	<view @click="cancleMasking" style="-webkit-flex: 1;flex: 1;"></view> -->
		  	<!-- 日历组件 -->
		  <view class="" style="justify-content: flex-end;">
		  	<view class="top_date">请选择日期</view>
		  	<calendar 
		  	:startDate="startDate" 
		  	:endDate="endDate" 
		  	:limitFlag="limitFlag" 
		  	:selectedDate="selectedDate" 
		  	:showMonth="false" 
		  	:selected="selected" 
		  	@change="calendarChange" />
			<view class="price_foot">
				<button @click="getDate">确定</button>
			</view>
		  </view>
		  <!-- <view class="price_foot">
		  	<button @click="getDate">确定</button> -->
		  <!-- 	<text v-for="(item,index) in selectedDate" :key="index">{{item.substr(8,10)}},</text> -->
		  <!-- </view> -->
		  </view>
		<!-- 日历组件 end-->
		<!-- 账单信息 -->
		<view v-if="billing" class="msg-box">
			<view class="situation">
				<view class="reset-btn">
					<view>账单</view>
					<view>重置</view>
				</view>
				<view class="itemright">
					<view class="item clear">
						<text class="lt text">定制时间：2020-05-12</text>
						<text class="rt text">共4笔</text>
					</view>
					<view class="item dec">
						<text class="lt text">账单总金额：1864.55元</text>
						<text class="rt text">手续费：15.52元</text>
					</view>
					<view class="item dec">
						<text class="lt text">费率：0.42%，0.42%</text>
						<text class="rt text">智慧金：2.15元</text>
					</view>
					<view class="item remaining">
						<text class="lt text">提醒：本次计划信用卡余额不少于：</text>
						<text class="price">1500元</text>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="list_item">
					<view class="title">
						<text class="lt text">
							<image src="../../static/plan/zhangdan.png"></image>
							账单 ¥161.00
						</text>
						<text class="rt date">2020-05-15</text>
					</view>
					<view class="item-list">
						<view class="item_lb">
							<text>消费(¥155.61)</text>
							<text>智慧金(¥155.61)</text>
							<text>06:54:50</text>
							<text class="bj">编辑</text>
						</view>
					</view>
					<view class="item-list">
						<view class="item_lb">
							<text>消费(¥155.61)</text>
							<text>智慧金(¥155.61)</text>
							<text>06:54:50</text>
							<text class="bj">编辑</text>
						</view>
					</view>
					<view class="item-list">
						<view class="item_lb">
							<text>消费(¥155.61)</text>
							<text>智慧金(¥155.61)</text>
							<text>06:54:50</text>
							<text class="bj">编辑</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom-add-btn" @click="submit"><text>提交账单</text></view>
		</view>
		
		<!-- 确认账单 -->
		<uni-popup ref="popup" type="center">
			<view class="uni-tip">
				<view class="title">智能账单</view>
				<view class="list_con">
					<view class="item clear">
						<text class="lt text">计划时间段</text>
						<text class="rt text">2020/05/15-2019/05/16</text>
					</view>
					<view class="item clear">
						<text class="lt text">订单总金额</text>
						<text class="rt text price">1864.00元</text>
					</view>
					<view class="item clear">
						<text class="lt text">账单总金额</text>
						<text class="rt text price">1852.00元</text>
					</view>
					<view class="item clear">
						<text class="lt text">订单手续费</text>
						<text class="rt text price">9.85元</text>
					</view>
					<view class="item clear">
						<text class="lt text">智慧金</text>
						<text class="rt text price">2.15元</text>
					</view>
					<view class="item clear">
						<text class="lt text">消费笔数：8笔</text>
						<text class="rt text">通道费率：0.42%</text>
					</view>
					<view class="item clear">
						<text class="lt text">账单笔数：4笔</text>
						<text class="rt text">单笔费用：1.00元</text>
					</view>
					<view class="dec">
						提醒：本次计划信用卡余额不少于：<text>998.15元</text>
					</view>
					<view class="act-btn">
						 <text class="lt btn-box cancel" @click="cancel">取消账单</text>
						 <text class="rt btn-box confirm">确认账单</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import request from '../../common/request.js';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import BiaofunRegion from '../components/biaofun-region/biaofun-region.vue'; //省市联动
import calendar from '@/components/heqifang-calendar/calendar.vue';   //日历
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import confirmBill from './confirmBill'; // todo 智能账单 弹窗
export default {
	components: { uniIcons, BiaofunRegion, confirmBill, uniPopup,calendar },
	data() {
		return {
			repay_type: '1消1还', // todo 代还类型
			// columns: ['中国', '美国', '巴西', '日本'],
			columns: ['1消1还', '2消1还', '3消1还'],
			index: 0,
			value: 1,
			repay_type_list: [1, 2, 3], // 还款笔数数据
			billing: false,
			showConfirmBill: false,
			creditCardId: '', //信用卡ID
			cardList: {  //信用卡信息
			    bank_logo_image:'',
				name:'',
				card_no:'',
			},   
			isFlag: false,    //日历
			startDate : '2020-05-05', // limitFlag == true 有效
			endDate : '2020-06-25',// limitFlag == true 有效
			/* 已选日期 */
			selectedDate: [],
			// 限定可选日期
			limitFlag: false,
			/* 可选日期 */
			selected : [
				{date: '2020-04-08', info: '出行', data: { custom: '自定义信息', name: '自定义消息头'}},
				{date: '2020-04-10', info: '充足', data: { custom: '自定义信息', name: '自定义消息头'}},
			]
		};
	},
	onLoad(option) {
		this.creditCardId = option.CardId;
		console.log(this.creditCardId);
	},
	created(){
	   this.getcard()	
	},
	methods: {
		calendar(){  //日历
		this.isFlag = true;
			// uni.navigateTo({
			// 	url: '../plan/calendar'
			// });
		},
		cancleMasking() {
					this.isFlag = false;
				},
				getDate(){
					this.isFlag = false;
					console.log(this.selected)
					console.log(this.selectedDate)
				},
				calendarChange(e){ //点击日期触发
				console.log(e)
				// 当前选择时间
				let _date = e.fulldate;
				// 判断这个时间是否已选中
				let _index = this.selectedDate.indexOf(_date);
				if(_index < 0){
					this.selectedDate.push(_date);
				}else{
					this.selectedDate.splice(_index,1);
				}
				console.log(_date)
				var date = new Date(_date)
				var time = date.getTime();
				console.log(time)				   
				},
		getcard(){
			// 根据银行卡id 获取银行卡信息
			request({
				url: '/trade/cards/CREDIT/' + this.creditCardId,
				method: 'GET',
				data: {},
				success: res => {
				this.cardList.bank_logo_image=res.data.data.bank_info.bank_logo_image.url
				this.cardList.name=res.data.data.bank_info.name
				this.cardList.card_no=res.data.data.card_no
				}
			});
		},
		bindPickerChange(e) {
			this.index = e.target.value;
		},
		changeRegion(region) {
			console.log('选择的省市区数据：', region);
		},
		addBill() {
			this.billing = !this.billing;
		},
		submit() {
			//提交账单
			this.$refs.popup.open();
			// this.showConfirmBill=true
		},
		cancel(){  //取消选择通道关闭popup
			this.$refs.popup.close();
		}
	}
};
</script>

<style lang="less">
@col3: #333;
@col6: #666;
@col9: #999;
@white: white;
@bg: #bf9761;
.lt {
	float: left;
}
.rt {
	float: right;
}
/* 提示窗口 */
.uni-tip {
	display: flex;
	flex-direction: column;
	width: 630upx;
	height:880upx;
	background-color: #fff;
	.title {
		font-size: 36upx;
		text-align: center;
		height: 90upx;
		line-height: 90upx;
		font-weight: bold;
	}
	.list_con{
		.item{
			width: 86%;
			margin-left: 7%;
			height: 80upx;
			line-height: 80upx;
			border-bottom: 1upx solid #EBEBEB;
			.text{
				font-size: 28upx;
			}
			.lt{
				color: @col3;
			}
			.price{
				color: #FA4559;
			}
		}
		.dec{
			width: 86%;
			margin-left: 7%;
			color: @col3;
			font-size: 24upx;
			height: 80upx;
			line-height: 80upx;
			text{
				color: #FA4559;
			}
		}
		.act-btn{
			width: 86%;
			margin-left: 7%;
			margin-top: 20upx;
			.btn-box{
				width: 220upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				font-size: 28upx;
			}
			.cancel{
				border: 2upx solid #DBDBDB;
			}
			.confirm{
				background: @bg;
				color: #FFFFFF;
			}
		}
	}
}
page,
.content {
	background: rgba(245, 245, 245, 1);
}
.content {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 9;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	.page-top {
		border-top: 1upx solid #f5f5f5;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 110upx;
		line-height: 110upx;
		background: white;
		image {
			width: 60upx;
			height: 60upx;
			margin: 25upx 0 0 35upx;
		}
		.lt {
			color: @col3;
			font-size: 28upx;
			margin-left: 25upx;
		}
		.type {
			color: @col9;
			font-size: 28upx;
			margin-left: 25upx;
		}
	}
	.bill {
		width: 90%;
		height: 450upx;
		background: @white;
		margin: 40upx 0 0 5%;
		.item {
			position: relative;
			height: 90upx;
			line-height: 90upx;
			border-bottom: 1upx solid #ebebeb;
			.text {
				color: @col3;
				font-size: 28upx;
				margin-left: 35upx;
			}
			input {
				padding-top: 25upx;
			}
			.rt {
				padding-right: 25upx;
				.text {
					margin-left: 10upx;
					margin-right: 10upx;
					vertical-align: 4upx;
				}
			}
			.input-box {
				text-align: right;
				font-size: 28upx;
				color: @col9;
				.rili{
					margin-right: 25upx;
				}
				.uni-input {
					margin-right: 26upx;
				}
				.uni-icons {
					position: absolute;
					top: 2upx;
					right: 8upx;
				}
			}
		}
	}
	.flex_enact {
		width: 460upx;
		height: 75upx;
		line-height: 75upx;
		text-align: center;
		line-height: 75upx;
		border: 3upx solid @bg;
		border-radius: 10upx;
		margin: 60upx 145upx 0 145upx;
		image {
			width: 36upx;
			height: 36upx;
		}
		text {
			color: @bg;
			font-size: 30upx;
			margin-left: 10upx;
			vertical-align: 8upx;
		}
	}
	//账单信息
	.msg-box {
		.situation {
			margin: 60upx 5% 0 5%;
			width: 90%;
			height: 225upx;
			display: flex;
			flex-direction: row;
			.reset-btn {
				color: @white;
				width: 110upx;
				height: 225upx;
				line-height: 100upx;
				text-align: center;
				background: @bg;
				font-size: 28upx;
				border-radius: 10upx 0 0 10upx;
				view:nth-child(1) {
					margin-top: 20upx;
				}
			}

			.itemright {
				background: @white;
				width: 570upx;
				height: 225upx;
				border-radius: 0 10upx 10upx 0;
				.item {
					margin-left: 20upx;
					margin-right: 20upx;
				}
				.clear {
					margin-top: 20upx;
					height: 40upx;
					line-height: 40upx;
					color: @col3;
					font-size: 28upx;
				}
				.dec {
					margin-top: 20upx;
					height: 30upx;
					color: @col9;
					font-size: 22upx;
				}
				.remaining {
					margin-top: 20upx;
					color: @col9;
					font-size: 22upx;
					.price {
						color: #ed0202;
					}
				}
			}
		}
		.list {
			margin-top: 60upx;
			margin-bottom: 50upx;
			.list_item {
				margin: 30upx 5% 0 5%;
				width: 90%;
				// height: 225upx;
				.title {
					background: #e0e8f2;
					height: 100upx;
					line-height: 100upx;
					text {
						color: @col3;
						font-size: 28upx;
					}
					image {
						width: 26upx;
						height: 30upx;
						margin-left: 30upx;
						vertical-align: -5upx;
						margin-right: 30upx;
					}
					.date {
						margin-right: 30upx;
					}
				}
				.item-list {
					.item_lb {
						position: relative;
						background: @white;
						height: 100upx;
						line-height: 100upx;
						border-bottom: 1upx solid #f5f5f5;
						text {
							color: @col9;
							font-size: 28upx;
							margin-left: 20upx;
						}
						.bj {
							position: absolute;
							left: 86%;
						}
					}
				}
			}
		}
	}
	.bottom-add-btn {
		background: @bg;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		color: @white;
		position: relative;
		z-index: 10;
		bottom: 0;
	}
}
// 日历 sta
.page_content{
	}
	.masking_layer{
		background-color: rgba(0,0,0,.6);
	    width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
	}
	.uni-calendar{
		position: fixed;
		bottom: 80upx;
		width: 100%;
	}
	.top_date{
		position: relative;
		top: 150upx;
		left: 15upx;
		color: #999;
		font-size: 30upx;
	}
	.price_foot{
		width: 100%;
		position: fixed;
		bottom: 0;
		button{
			background-color: #BE9760;
			color: white;
		}
	}
	
// 日历 end
</style>
