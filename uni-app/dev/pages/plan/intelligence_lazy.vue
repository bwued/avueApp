<template>
	<view class="content">
		<view class="page-top">
			<image src="http://admin.zhr168.com/static/image/open/persistence/e33080fab8fe1c6e32b822533c485d1e.png"></image>
			<text class="name lt">招商银行</text>
			<text class="text lt">623155******1597</text>
			<text class="type">信用卡</text>
		</view>
		<view class="bill">
			<view class="clear item">
				<text class="lt text">账单总金额</text>
				<text class="rt"><input class="input-box" type="number" /></text>
			</view>
			<view class="clear item">
				<text class="lt text">信用卡预留金额</text>
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
				<text class="lt text">选择省市</text>
				<text class="rt">
				<text class="input-box" type="text" >
					<view class="value" style="margin-right: 25upx;"><BiaofunRegion class="region" @change="changeRegion"></BiaofunRegion></view>
					<uni-icons class="uni-icons" type="forward" size="23" color="#999"></uni-icons>
				</text>
				</text>
			</view>
		</view>
		<view class="flex_enact"><image src="../../static/plan/addcard.png"></image><text>制定账单</text></view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import BiaofunRegion from '../components/biaofun-region/biaofun-region.vue';  //省市联动
export default {
	components: { uniIcons,BiaofunRegion },
	data() {
		return {
			repay_type: '1消1还', // todo 代还类型
			// columns: ['中国', '美国', '巴西', '日本'],
			columns: ['1消1还', '2消1还', '3消1还'],
			index: 0
		};
	},
	methods: {
		bindPickerChange(e) {
			this.index = e.target.value;
		},
		changeRegion(region) {
			console.log('选择的省市区数据：', region);
		}
	}
};
</script>

<style lang="less">
@col3: #333;
@col6: #666;
@col9: #999;
@white: white;
@hs:#BF9761;
.lt {
	float: left;
}
.rt {
	float: right;
}
.content {
	background: rgba(245, 245, 245, 1);
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: 9;
	top: 90upx;
	left: 0;
	bottom: 0;
	right: 0;
	.page-top {
		margin-top: 1upx;
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
		height: 360upx;
		background: @white;
		margin: 40upx 0 0 5%;
		.item {
			position: relative;
			height: 90upx;
			line-height: 90upx;
			border-bottom: 1upx solid #ebebeb;
			// display: flex;
			// flex-direction: row;
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
			.text{
				margin-left: 10upx;
				margin-right: 10upx;
				vertical-align: 4upx;
			}
			}
			.input-box {
				text-align: right;
				font-size: 28upx;
				color: @col9;
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
	.flex_enact{
		width: 460upx;
		height: 75upx;
		line-height: 75upx;
		text-align: center;
		line-height: 75upx;
		border:3upx solid @hs;
		border-radius:10upx;
		margin: 60upx 145upx 0 145upx;
		image{
			width: 36upx;
			height: 36upx;
		}
		text{
			color: @hs;
			font-size: 30upx;
			margin-left: 10upx;
			vertical-align: 8upx;
		}
	}
}
</style>
