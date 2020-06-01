<template>
	<view class="content">
		<view class="z_content"></view>
		<view class="BOX">
			<view class="z_logo"><image src="../../static/z_logo.png"></image></view>
			<view class="z_title">{{ z_title.agentName }}</view>
			<view class="z_hr"></view>
			<view class="z_upgrade">
				<p>{{ z_title.version }} (Build 1) - 16.68 MB</p>
				<p>更新于: {{ z_title.createTime }}</p>
			</view>
			<view class="z_xzaz">
				<span @click="GoIphone"><image src="../../static/iphone.png"></image></span>
				<span @click="GoAndroid"><image src="../../static/Android.png"></image></span>
			</view>
			<view class="z_bg"><!-- <image src='../../static/bg2.png'></image> --></view>
		
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			z_api: 'http://120.79.74.34:6062/upgrade/version/get', //接口
			z_An: '', //安卓链接
			z_Ip: '', //苹果链接
			z_title: '' //名称
		};
	},
	onLoad() {
		this.z_hello();
	},
	methods: {
		z_hello() {
			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
			uni.request({
				url: this.z_api,
				method: 'POST',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				data: JSON.stringify({
					agentId: 1000,
					terminalType: isAndroid ? 1 : 2
				}),
				success: data => {
					this.z_title = data.data.data;
					console.log(this.z_title.agentName);
				}
			});
		},
		GoAndroid() {
			uni.request({
				url: this.z_api,
				method: 'POST',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				data: JSON.stringify({
					agentId: 1000,
					terminalType: 1
				}),
				success: function(data) {
					this.z_An = data.data.data.url;
					console.log(this.z_An);
					window.location.href = this.z_An;
				}
			});
		},
		GoIphone() {
			uni.request({
				url: this.z_api,
				method: 'POST',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				data: JSON.stringify({
					agentId: 1000,
					terminalType: 2
				}),
				success: function(data) {
					this.z_Ip = data.data.data.url;
					console.log(this.z_Ip);
					window.location.href = this.z_Ip;
				}
			});
		}
	}
};
</script>

<style lang="less">
.content {
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
				margin-top: 120upx;
				border-radius: 40upx;
			}
		}
		.z_title {
			text-align: center;
			margin-top: 35upx;
			font-size: 44upx;
			// font-family:PingFang SC;
		}
		.z_hr {
			margin: 0 auto;
			margin-top: 65upx;
			width: 450upx;
			height: 1upx;
			background: #dbdbdb;
		}
		.z_upgrade {
			text-align: center;
			margin-top: 60upx;
			p {
				color: #999;
				font-size: 24upx;
				margin-top: 15upx;
			}
		}
		.z_xzaz {
			text-align: center;
			margin-top: 130upx;
			image {
				width: 300upx;
				height: 100upx;
				margin-right: 25upx;
				margin-left: 25upx;
			}
		}
		.z_sub {
			margin-top: 40upx;
			margin-left: 100upx;
			text {
				font-size: 40upx;
				color: #666;
			}
			pre {
				margin-top: 10upx;
				text-align: left;
				white-space: pre-line;
				word-wrap: break-word;
				word-break: break-all;
				line-height: 22px;
				font-size: 30upx;
				color: #999;
			}
		}
		.z_bg {
			// background: url(../../static/bg3.png);
			// background-size: cover;
			// width: 100%;
			// height: 468upx;
			// position: relative;
			// // top: 150upx;
			// bottom: 0;
			// left: 0;
		}
	}
}
</style>
