<template>
	<view class="vbox">
		<view class="form_cell">
			<label  class="name">储蓄卡号</label>
			<input class="ninput" maxlength="25" type="number" placeholder="请输入您的储蓄卡号" />
		</view>
		<view class="form_cell">
			<label  class="name">所属银行</label>
			<input class="ninput" maxlength="25" type="text" placeholder="请选择所属银行" />
		</view>
		<view class="form_cell">
			<label  class="name">预留手机号</label>
			<input class="ninput" maxlength="11" type="number" placeholder="请输入预留手机号码" />
		</view>
		<view class="form_cell">
			<label  class="name">省/市</label>
			<input class="ninput" maxlength="25" type="text" placeholder="请选择省/市" />
		</view>
		<view class="form_cell">
			<label  class="name">支行名</label>
			<input class="ninput" maxlength="25" type="text" placeholder="请输入支行名" />
		</view>
		<view class="add_btn" @click="addCardFun">保存</view>
	</view>
</template>

<script>
	import request from '../../common/request.js'
		export default{
			data(){
				return{
					
				}
			},
			onLoad(){
				
			},
			onShow:function(){
				request({
	                url:'/anonymous/text/rich',
	                method:'GET',
					data:{type: 'agreement'},
	                success: function (res) {
	//                     console.log(res.data);
	                }
	            })    
		
			},
			methods:{
				addCardFun(){
					uni.navigateTo({
					    url:'../center/myCard'
					});
				},
				godue(){
					uni.navigateTo({
						url:'../plan/addChannel'
					});
				}
			}
		}
</script>

<style lang="less">
	 @col: #BF9761;
	.vbox{position: relative; width: 100%; height: 100%; background: #fff; font-size: 28upx;}
	.form_cell{ position: relative; display: flex; width: 90%; margin: 20upx auto; height: 70upx;
		.name{width: 200upx; font-size: 28upx; color: #333;}
		.ninput{font-size: 28upx; margin-left: 50upx; border-bottom: 1upx solid #ddd; flex: 1;}
	}
	.add_btn{
		background: @col;
		height: 90upx;
		width: 90%;
		margin:20upx auto;
		line-height: 90upx;
		text-align: center;
		color: white;
		border-radius: 10upx;
	}
</style>
