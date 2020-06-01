<template>
	<view>
		<uni-calendar 
		ref="calendar" 
		:selected="info.selected"
		:insert="info.insert"
		:lunar="info.lunar" 
		:start-date="'2020-5-06'" 
		:end-date="'2020-5-20'"
		:range="info.range"
		@change="change" />
		<view class="example-body"><button class="calendar-button" type="button" @click="open">打开日历</button></view>
	</view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
export default {
	components: {
		uniCalendar
	},
	data() {
		return {
			info: {
				lunar: false,
				range: true,
				insert: false,
				selected: []
			}
		};
	},
	methods: {
		open() {
			this.$refs.calendar.open();
		},
		change(e) {
			console.log(e);
		}
	}
};
</script>

<style lang="less">
.uni-mesg {
	width: 80%;
	height: 250upx;
	background-color: #fff;
	margin: 50% auto;
	border-radius: 10upx;
}
.example-body {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	padding: 0;
	font-size: 14px;
	background-color: #ffffff;
}
</style>
