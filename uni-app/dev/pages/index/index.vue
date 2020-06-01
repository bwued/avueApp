<template>
	<view class="content">
		<view v-if="z_hide==true" class="bj">
			<image src="../../static/XZBJ.png"></image>
		</view>
		<view class="z_content"></view>
		<view class="BOX">
			<view class="z_logo"><image src="../../static/z_logo.png"></image></view>
			<view class="z_title">{{ z_title.agentName }}</view>
			<view class="z_hr"></view>
			<view class="z_upgrade">
				<p>{{ z_title.version }} (Build 1)</p>
				<p>更新于: {{ gx_time }}</p>
			</view>
			<view class="z_xzaz">
				<view class="view1" v-if="tertype=='ios'" @click="GoIphone">
					<image src="../../static/iphone.png" />
					<span>iPhone 下载</span>
				</view>
				<view class="view2" v-if="tertype=='android'" @click="GoAndroid">
					<image src="../../static/Android.png" />
					<span>Android 下载</span>
				</view>
			</view>
			<view class="z_nr"><span>更新内容：</span></view>
			<pre class="pre">
			{{ z_title.remark }}
			</pre
			>
		</view>
	</view>
</template>

<script>
import helper from '../../common/Api_com.js';
export default {
	data() {
		return {
			z_hide:false,
			// z_api: 'http://120.79.74.34:6062/upgrade/version/get', //接口
			z_title: '', //名称
			tertype: '',
			agentId: '20000',
			gx_time: '',
			andriodUrl: '',
			iosUrl: ''
		};
	},
	onLoad(option) {
		this.z_open()
		// console.log(option)
		this.agentId = option.agentId || this.agentId; //获取url 参数或定义参数agentId:'1000'
		this.z_hello();
		this.portal_download();
		
	},
	methods: {
		z_open(){ //判断手机打开方式：微信或浏览器
		 var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
		 if (ua.match(/MicroMessenger/i) == "micromessenger") {
		       //在微信中打开
			   this.z_hide=true
		     }
			 else{
				 this.z_hide=false
			 }
		},
		portal_download() {
			uni.request({
				url: helper.baiwangapi + '/config/reg/get',  // 分发平台下载
				method: 'POST',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				data: JSON.stringify({
					agentId: this.agentId
				}),
				success: data => {
					this.andriodUrl = data.data.data.andriodUrl;
					this.iosUrl = data.data.data.iosUrl;
				}
			});
		},
		z_hello() {
			// this.tertype=uni.getSystemInfoSync().platform
				if (uni.getSystemInfoSync().platform === 'android') {
					this.tertype='android'
					uni.request({
						url: helper.baiwangapi + '/version/get', //百网APP升级版本信息
						method: 'POST',
						header: {
							'Content-Type': 'application/json;charset=utf8'
						},
						data: JSON.stringify({
							agentId: 1000, // APP 智慧人原生下载 更新接口
							terminalType: 1
						}),
						success: data => {
							this.z_title = data.data.data;
							this.gx_time=this.z_title.createTime.slice(0,10)  //获取更新时间
						}
					});
				} else if (uni.getSystemInfoSync().platform == 'ios') {
					console.log('88888888ios')
					this.tertype='ios'
					uni.request({
						url: helper.baiwangapi + '/version/get', //百网APP升级版本信息
						method: 'POST',
						header: {
							'Content-Type': 'application/json;charset=utf8'
						},
						data: JSON.stringify({
							agentId: 1000, // APP 智慧人原生下载 更新接口
							terminalType: 2
						}),
						success: data => {
							this.z_title = data.data.data;
							this.gx_time=this.z_title.createTime.slice(0,10)  //获取更新时间
						}
					});
				}
			},
			GoAndroid() {
				window.location.href = this.andriodUrl;
			},
			GoIphone() {
				window.location.href = this.iosUrl;
			}
		}
	}
</script>

<style lang="less">
.content {
	.bj image{
			display: block;	
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 999999;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}
	
	.z_content {
		background: url(../../static/bg.png) 100% 100%;
		background-size: cover;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
	}
	.BOX {
		position: relative;
		z-index: 9999;
		.z_logo {
			image {
				width: 200upx;
				height: 200upx;
				position: relative;
				left: 50%;
				margin-left: -100upx;
				margin-top: 80upx;
				border-radius: 40upx;
			}
		}
		.z_title {
			text-align: center;
			margin-top: 35upx;
			font-size: 44upx;
		}
		.z_hr {
			margin: 0 auto;
			margin-top: 50upx;
			width: 60%;
			height: 1upx;
			background: #dbdbdb;
		}
		.z_upgrade {
			text-align: center;
			margin-top: 50upx;
			p {
				color: #999;
				font-size: 24upx;
				margin-top: 15upx;
			}
		}
		.z_xzaz {
			.view1 {
				background: #6399ff;
			}
			.view2 {
				background: #3eafb9;
			}
			view {
				margin-left: 175upx;
				width: 400upx;
				height: 90upx;
				border-radius: 45upx;
				image {
					width: 40upx;
					height: 48upx;
					display: inline-block;
					margin-top: 21upx;
					margin-left: -36upx;
				}
			}
			span {
				color: #ffffff;
				font-size: 28upx;
				position: relative;
				top: -14upx;
				left: 24upx;
			}
			text-align: center;
			margin-top: 50upx;
			image {
				width: 360upx;
				height: 90upx;
				border-radius: 45upx;
			}
		}
		.z_nr {
			width: 80%;
			margin-left: 10%;
			margin-top: 48upx;
			font-size: 32upx;
			span {
				margin-top: 35upx;
				display: inline-block;
			}
		}
		.pre {
			width: 90%;
			font-size: 24upx;
			color: #999;
			line-height: 38upx;
			margin-left: 10%;
			font-family: '微软雅黑';
			margin-top: 35upx;
		}
	}
}
</style>
