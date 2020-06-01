<template>
	<view>
		智能账单
		<!-- <uni-popup ref="popup" type="bottom">
			<view class="uni-tip">
			智能账单888
			</view>
		</uni-popup> -->
		
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default{
	components:{uniPopup},
		data(){
		return{
			
		}
		},
		created(){
			this.open()
		},
		methods:{
			open() {
				this.$refs.popup.open();
			},
		}
	}
</script>

<style lang="less">
	/* 提示窗口 */
	.uni-tip {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 1078upx;
		background-color: #fff;
		}
</style>
