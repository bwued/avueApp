<template>
	<view id="page_app">
		<view class="box">
			<!-- 	头部 -->
			<view class="top">
				<view class="z_left">
					<image src="../../static/z_index.png"></image>
					<p class="z_pp z_6">注册{{z_title.agentName}}</p>
				</view>
				<view class="z_right"><image src="../../static/z_bg.png"></image></view>
			</view>
			<!-- 表单 -->
			<view class="z_from">
				<view class="z_flex" style="color: #666"><input placeholder-style="color:#b7b8be" placeholder="请输入注册手机号" v-model="telnum" maxlength="11" /></view>
				<view class="z_flex zz" style="color: #666">
					<input placeholder-style="color:#b7b8be" type="tel" class="zbh_input " placeholder="手机验证码" v-model="valicode" maxlength="6" />
					<view class="z_btn z_b" v-text="timeText" @click="sendMessage">获取验证码</view>
				</view>
				<view class="z_flex" style="color: #666"><input placeholder-style="color:#b7b8be" type="password" placeholder="6~12位登录密码" v-model="password" maxlength="12" /></view>
				<view class="z_flex" style="color: #666"><input placeholder-style="color:#b7b8be" type="password" placeholder="再次确认密码" v-model="repassword" maxlength="12" /></view>
			<!-- 	<view class="z_flex" style="color: #666"><input placeholder-style="color:#b7b8be" disabled="true" type="tel"  placeholder="推荐人" v-model="referrer"  /></view> -->
				<text class="tip_text" v-text="tipText"></text>
				<view class="z_zc  z_b" @click="goDownload">注册账号</view>
			</view>
		</view>
		<view class="z_xiazai z_c">
			已有账号
			<text @click="verify">直接下载【{{z_title.agentName}}】APP</text>
		<!-- 	<text class="z_text" @click="verify">直接下载</text> -->
		</view>
	</view>
</template>

<script>
import helper from '../../common/Api_com.js'; 
export default {
	data: function() {
		return {
			z_title: '', //名称
			// api: 'http://app.bwtemall.cn/api',
			telnum: '', // 手机号码
			valicode: '', // 验证码
			codeToken: '', // 验证码token
			tipText: '', // 提示
			password: '', //密码
			repassword: '', // 确认密码
			timeText: '获取验证码', // 倒数文本
			referrer: '', // 推荐人手机号码
			timerDisabled: false, // 是否可以开始计时
			agentId:'20000'
		};
	},
	onLoad(option) {
		// console.log(option)
		this.referrer=option.referrer
		this.agentId=option.agentId || this.agentId
		console.log(this.agentId)
		   this.z_hello();
	},
	methods: {
		//倒数计时
		getSecond: function getSecond(wait) {
			var _this = this; // 存放上下文
			var _wait = wait; // 存放总秒数

			if (wait == 0) {
				this.timerDisabled = false;
				this.timeText = '重新获取';
				wait = _wait; // 恢复总秒数
			} else {
				this.timerDisabled = true;
				this.timeText = '(' + wait + 's)';
				wait--;
				setTimeout(function() {
					_this.getSecond(wait);
				}, 1000);
			}
		},
		//获取验证码
		sendMessage() {
			var that = this;
			if (this.timerDisabled) return;
			if (this.telnum == '') {
				this.tipText = '*手机号不能为空';
				return;
			}
			if (!/^1[3|4|5|6|7|8|9][0-9]\d{8,11}$/.test(this.telnum)) {
				this.tipText = '*手机号格式有误';
				return;
			}
			this.tipText = '';
			uni.request({
				url: helper.ZuceUrl + '/anonymous/sms/code',  //获取验证码接口
				method: 'POST',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				data: JSON.stringify({
					phone: this.telnum
				}),
				success: function(data) {
					// console.log(data);

					if (data.data.code === '200000') {
						that.getSecond(60);
						this.tipText = '';
						uni.showToast({
							title: '短信发送成功',
							icon: 'none'
						});
						that.codeToken = data.data.data.token;
						// console.log(that.codeToken);
					} else {
						uni.showToast({
							title: data.data.msg,
							icon: 'none'
						});
					}
				},
				error: function error() {
					uni.showToast({
						title: '连接服务器失败，请重试',
						icon: 'none'
					});
				}
			});
		},
		// 立即注册
		goDownload() {
			var that=this
			// console.log('123');
			// console.log(this.codeToken);
			if (this.telnum == '') {
				this.tipText = '*手机号不能为空';
				return;
			}
			if (!/^1[3|4|5|6|7|8|9][0-9]\d{8,11}$/.test(this.telnum)) {
				this.tipText = '*手机号格式有误';
				return;
			}
			if (this.valicode == '') {
				this.tipText = '*验证码不能为空';
				return;
			}
			if (!/^[0-9]{6}$/.test(this.valicode)) {
				this.tipText = '*验证码格式有误';
				return;
			}
			if (this.password == '') {
				this.tipText = '*请输入您的密码';
				return;
			}
			if (!/^[a-zA-Z0-9_]{6,12}$/.test(this.password)) {
				this.tipText = '请输入6-12位密码(数字或字母)';
				return;
			}
			if (this.password !== this.repassword) {
				this.tipText = '两次输入的密码不一致';
				return;
			}
			this.tipText = '';
			if (!this.referrer) {
				uni.showToast({
					title: '缺少推荐人手机号码',
					icon: 'none'
				});
				return;
			}
			if (this.codeToken == '') {
				uni.showToast({
					title: '请重新获取验证码！',
					icon: 'none'
				});
				return;
			}

			uni.request({
				url: helper.ZuceUrl + '/anonymous/register',  //注册接口
				method: 'POST',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				data: JSON.stringify({
					code_input: this.valicode,
					code_token: this.codeToken,
					username: this.telnum,
					password: this.password,
					reference_username: this.referrer
				}),
				success: function(data) {
					if (data.data.code === '200000') {
						uni.showToast({
							title: '注册成功',
							duration: 2000
						});
						setTimeout(function(){
							uni.navigateTo({
							    url: '/pages/download/download' + '?agentId='+that.agentId
							});
							
						},1000)
					} else {
						uni.showToast({
							title: data.data.msg,
							duration: 2000,
							icon: 'none'
						});
					}
				}
			});
		},
		//获取下载安装接口
		z_hello() {
			uni.request({
				url: helper.baiwangapi + '/version/get',  //百网APP升级版本信息
				method: 'POST',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				data: JSON.stringify({
					agentId: 1000,// APP 智慧人原生下载 更新接口
					terminalType: 1
				}),
				success: data => {
					this.z_title = data.data.data;
				}
			});
				
		},
		verify(){ // 跳转页面传参
			console.log(this.agentId)
			uni.navigateTo({
			    url: '/pages/download/download' + '?agentId='+this.agentId
			});
		}
	}
};
</script>

<style lang="less">
	#page_app{
		margin-bottom: 50upx;
	}
	// #page_app{
	// 	width: 100%;
	// 	height: 100%;
	// 	position: absolute;
	// 	 top: 0;
	// 	 left: 0;
	// 	background: #4c507c;
	// }
.box {
	width: 86%;
	margin-left: 7%;
	height: 27rem;
	position: relative;
	top: 60upx;
	border-radius: 20upx;
	background: white;
	.top {
		height: 340upx;
		.z_left {
			width: 40%;
			float: left;
			image {
				width: 116upx;
				height: 116upx;
				margin: 22upx 0 0 30upx;
			}
			.z_pp {
				font-size: 32upx;
				// color: #8386a5;
				margin: 30upx 0 0 20upx;
			}
		}
		.z_right {
			float: left;
			width: 60%;
			margin-left: 0%;
			image {
				width: 300upx;
				height: 300upx;
				position: relative;
				top: -14upx;
				left: 65upx;
			}
		}
	}
	//表单
	.z_from {
		margin-top: 5upx;
		// background: #007AFF;
		.z_flex {
			width: 92%;
			margin-left: 2%;
			input {
				font-size: 30upx;
				padding-left: 30upx;
				width: 100%;
				height: 85upx;
				margin-bottom: 40upx;
				background: #f3f8fe;
				border: none;
				outline: none;
				border-radius: 5px;
			}
			.zbh_input {
				width: 50%;
				float: left;
			}
			.z_btn {
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				width: 37%;
				margin-left: 5%;
				color: white;
				float: left;
				// background: #8386a5;
				font-size: 28upx;
				border-radius: 10upx;
			}
		}
		.zz {
			width: 100%;
		}
		// 提示信息
		.tip_text {
			display: block;
			color: #ff2125;
			text-align: left;
			font-size: 28upx;
			max-height: 50upx;
			margin-left: 25upx;
			margin-top: -18upx;
			overflow: hidden;
			height: 50upx;
		}
		/* 注册 */
		.z_zc {
			width: 85%;
			margin-left: 7.5%;
			margin-top: 1%;
			height: 90upx;
			line-height: 90upx;
			text-align: center;
			// background: #8386a5;
			color: white;
			font-size: 38upx;
			letter-spacing: 15upx;
			border-radius: 50upx;
		}
	}
}
.z_xiazai {
	// color: #d5d9ff;
	text-align: center;
	font-size: 30upx;
	margin-top: 11%;
	margin-bottom: 20upx;
	letter-spacing: 5upx;
	margin-left: 10upx;
	padding-bottom: 30upx;
	text { 
		margin-left: 8upx;
		display: inline-block;
		color: #ff2125;
		text-decoration: none;
		letter-spacing: 1upx;
		// border-bottom: 2px solid whitesmoke;
	}
}
// .z_text{
// 	    height: 35upx;
// 	    line-height: 35upx;
// 	    background: #c6b183;
// 	    padding: 16upx 30upx;
// 	    border-radius: 39upx;
// 	    color: #fff;
// 	    margin-left: 60upx;
// }
</style>
