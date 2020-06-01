<template>
	<view style="height: 100%;">
		<view class="masking_layer" v-if="isFlag" >
			<view @click="cancleMasking" style="-webkit-flex: 1;flex: 1;"></view>
			<!-- 日历组件 -->
		<view style="justify-content: flex-end;">
			<view class="top_date">请选择日期</view>
			<calendar 
			:startDate="startDate" 
			:endDate="endDate" 
			:limitFlag="limitFlag" 
			:selectedDate="selectedDate" 
			:showMonth="false" 
			:selected="selected" 
			@change="calendarChange" />
		</view>
		 <view class="price_foot">
		<!-- 	<button @click="getDate">确定</button> -->
			<text v-for="(item,index) in selectedDate" :key="index">{{item.substr(8,10)}},</text>
		 </view>
		</view>
		
		<view class="page_content"  @click="opCalendar" style="" v-if="!isFlag">
				点击打开日历组件
		</view>
	</view>
</template>
<script>
import calendar from '@/components/heqifang-calendar/calendar.vue';
export default {
	components: {calendar},
	data(){
		return{
			isFlag: false,
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
		}
	},
	methods:{
		opCalendar(){
			this.isFlag = true;
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
		
       // console.log(this.selectedDate)	
			   
		}
	}
};
</script>
<style lang="less">
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
		height: 1240upx;
		flex-direction: column;
		justify-content: flex-end;
	}
	.top_date{
		position: relative;
		top: 70upx;
		left: 15upx;
		color: #999;
		font-size: 30upx;
	}
	.price_foot{
		button{
			background-color: #BE9760;
			// box-shadow: 5px 0px 15px #aaaa7f;
			color: white;
		}
	}
</style>
