<template>
	<view class="con_body login-wrap">
		<view class="cells_title">
			<image src="../../static/login/logobeji.png"></image>
			<view><image class="z_logo2" src="../../static/login/108.png"></image></view>
		</view>
		<view class="z_text">登录</view>
		<view class="login-main">
			<view class="form_cells">
				<view class="form_cell">
					<p class="z_zh"><image src="../../static/login/icon_phone@3x.png"></image></p>
					<input v-model.trim="tel" type="tel" class="form_input" placeholder="请输入手机号" maxlength="11" />
					<view v-if="!!tel" class="input-btn clear-tel" @click="clearAccount" />
				</view>
				<view class="form_cell">
					<p class="z_zh"><image src="../../static/login/icon_password@3x.png"></image></p>
					<input v-model.trim="password" :type="type" maxlength="18" class="form_input" placeholder="请输入密码" />
					<view v-if="type === 'text'" class="input-btn-mm open-eyes" @click="changeType" />
					<view v-else class="input-btn-mm close-eyes" @click="changeType" />
				</view>
				<button type="button" class="btn btn_submit" @click="submit">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
import helper from '../../common/Api_com.js';
export default {
	data() {
		return {
			tel: '',
			password: '',
			type: 'password'
		};
	},
	methods: {
		login(){
			let req={
				username:this.tel,
				password:this.password
			}
			this.$http.login(req)
			.then(data=>{
				console.log(data)
			})
		},
		submit() {
			const that = this;
			if (!that.tel) {
				uni.showToast({
					title: '请输入您的手机号码',
					icon: 'none'
				});
				return;
			}
			if (!/^1[3|4|5|6|7|8|9][0-9]\d{8,11}$/.test(that.tel)) {
				uni.showToast({
					title: '*手机号格式有误',
					icon: 'none'
				});
				return;
			}
			if (that.password == '') {
				uni.showToast({
					title: '请输入您的密码',
					icon: 'none'
				});
				return;
			}
			uni.request({
				url: helper.ZuceUrl + '/anonymous/login',
				method: 'POST',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				data: JSON.stringify({
					username: that.tel,
					password: that.password
				}),
				success:function(res){
					if(res.statusCode===200){
						console.log(res.header.authorization)
						uni.setStorage({
						    key: 'token',
						    data: res.header.authorization,
						    success: function () {
						        console.log('success');
								// alert(res.header.authorization)
						    }
						});
						uni.navigateTo({
							url:'../plan/addPlan'
						})
					}
					if(res.data.code==='401001'){
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
			});
		},
		clearAccount() {
			this.tel = '';
		},
		changeType() {
			this.type = this.type === 'text' ? 'password' : 'text';
		}
	}
};
</script>

<style lang="less">
.login-wrap {
	height: 100%;
	background-color: #ffffff;
}
.con_body {
	.cells_title {
		position: relative;
		height: 320upx;
		image {
			position: absolute;
			top: 0;
			width: 100%;
			height: 270upx;
		}
		.z_logo2 {
			position: absolute;
			left: 50%;
			top: 170upx;
			margin-left: -90upx;
			display: inline-block;
			width: 180upx;
			height: 180upx;
			border-radius: 50%;
			background: white;
			border: 0.5upx solid #fff;
		}
	}
	.z_text {
		text-align: center;
		margin-top: 40upx;
		font-size: 40upx;
	}
	//账号与密码框
	.login-main .form_cells {
		position: relative;
		margin-top: 150upx;
		padding: 0 36upx;
		.form_cell {
			margin-top: 50upx;
			.z_zh {
				position: absolute;
				image {
					width: 45upx;
					height: 45upx;
				}
			}
			.form_input {
				width: 90%;
				border-bottom: 1upx solid #cccccc;
				margin-bottom: 20upx;
				font-size: 30upx;
				padding-bottom: 25upx;
				padding-left: 60upx;
			}
			.clear-tel {
				background: url(../../static/login/close.png) no-repeat;
				background-size: cover;
			}
			.open-eyes {
				background: url(../../static/login/openeyes.png) no-repeat;
				background-size: cover;
			}
			.close-eyes {
				background: url(../../static/login/closeeyes.png) no-repeat;
				background-size: cover;
			}
			.input-btn {
				position: absolute;
				top: -5upx;
				right: 50upx;
				width: 30upx;
				height: 30upx;
				padding: 20upx 10upx;
				background-origin: content-box;
			}
			.input-btn-mm {
				position: absolute;
				top: 120upx;
				right: 50upx;
				width: 30upx;
				height: 30upx;
				padding: 20upx 10upx;
				background-origin: content-box;
			}
		}
	}
	.btn_submit {
		margin-top: 70upx;
		height: 90upx;
		color: #fff;
		border: none;
		background: #bf9761;
	}
}
</style>
