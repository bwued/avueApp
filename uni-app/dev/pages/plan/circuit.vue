<template>
	<view style="height: 100%;">
		<view class="masking_layer" v-if="isFlag" >
			<view @click="cancleMasking" style="-webkit-flex: 1;flex: 1;"></view>
			<!-- 日历组件 -->
			<view style="justify-content: flex-end;">
				<calendar :startDate="startDate" :endDate="endDate" :limitFlag="limitFlag" :selectedDate="selectedDate" :showMonth="false" :selected="selected" @change="calendarChange" />
			</view>
			<!-- <view class="price_total" style="display: flex;height: 10%;">
				<view style="flex: 1;text-align: center;font-size: 32rpx;">共 <text style="font-weight: 600;padding-left: 15rpx;"> {{selectedDate.length}} 张</text></view>
				<view style="flex: 1;text-align: center;font-size: 32rpx;">总价: <text style="font-weight: 600;padding-left: 15rpx"> ¥ {{totalAmount}}</text></view>
				<view style="display:flex;flex: 1;justify-content: center;align-items: center;">
					<button style="width: 100px;height: 40px;line-height: 40px;font-size: 16px;" type="primary" size="mini" @click="confirmSelect">确定</button>
				</view>
			</view> -->
		</view>
		<view class="page_content"  @click="opCalendar" style="" v-if="!isFlag">
				点击打开日历组件
		</view>
	</view>
</template>

<script>
	import calendar from '@/components/heqifang-calendar/calendar.vue'
	export default {
		components: {
			calendar
		},
		data() {
			return {
				showMonth: false, // 以月份为背景
				money: 6.00,
				isFlag: true,
				totalAmount: 0.00,
				startDate : '2020-04-05', // limitFlag == true 有效
				endDate : '2020-04-25',// limitFlag == true 有效
				/* 已选日期 */
				selectedDate: [],
				// 限定可选日期
				limitFlag: false, 
				/* 可选日期 */
				selected : [
					{date: '2020-04-08', info: '出行', data: { custom: '自定义信息', name: '自定义消息头'}},
					{date: '2020-04-10', info: '充足', data: { custom: '自定义信息', name: '自定义消息头'}},
				]
			}
		},
		methods: {
			opCalendar() {
				this.isFlag = true;
			},
			cancleMasking() {
				console.log('8888')
				this.isFlag = false;
			},
			calendarChange(e) {
				console.log(e);
				// 当前选择时间
				let _date = e.fulldate;
				// 判断这个时间是否已选中
				let _index = this.selectedDate.indexOf(_date);
				if(_index < 0){
					this.selectedDate.push(_date);
				}else{
					this.selectedDate.splice(_index,1);
				}
				// 计算总金额
				let _totalAmount = this.selectedDate.length * this.money;
				// 设置总金额
				this.totalAmount = _totalAmount.toFixed(2);
			}
		}
	}
</script>

<style>
	.page_content{
		background-color: #a5b4c4;
		display: flex;
		height: calc(100vh);
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: 600;
		font-size: 22px;
	}
	.masking_layer{
		background-color: #a5b4c4;
		display: flex;
		height: calc(100vh);
		flex-direction: column;
		justify-content: flex-end;
	}
	.price_total{
		flex-direction: row;
		align-items: Center;
		background-color: #ffffff;
		box-shadow: 5px 0px 15px #aaaa7f;
	}
</style>
