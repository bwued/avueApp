<template>
	<view class="BOX">
		<!-- <view class="bj"></view> -->
		<view v-if="z_hide==true" class="bj">
			<image src="../../static/XZBJ.png"></image>
		</view>
		<view class="z_img">
			<!-- <image class="z_Bg" src="../../static/zhihuirenBg.png"></image> -->
			<image v-if="!J_udge && z_show==true" class="z_Bg" src="../../static/zhihuirenBg.png"></image>
			<image v-else class="z_Bg" :src="J_udge"></image>
		</view>
		<view><image @click="go_click()" class="z_botton" src="../../static/btn_link2.png"></image></view>
		<view style="margin-top: 20upx;"><image @click="go_register()" class="z_botton" src="../../static/btn_link3.png"></image></view>
	</view>
</template>

<script>
import helper from '../../common/Api_com.js';
export default {
	data: function() {
		return {
			z_hide:false, //弹窗
			z_show:false,
			J_udge: '', //获取数字字典图片
			referrer: '', // 推荐人手机号码
			agentId: '20000'
		};
	},
	onLoad(option) {
		this.z_open()
		this.go_imges()
		this.referrer = option.referrer || this.referrer;
		this.agentId = option.agentId || this.agentId;
		console.log(this.referrer);
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
		go_imges() {
			uni.request({
				url: helper.ZuceUrl + '/market/clientTextShowConfig/get' + '?name=H5注册背景图',
				method: 'get',
				header: {
					'Content-Type': 'application/json;charset=utf8'
				},
				success: res => {
					if (res.data.data && res.data.data['H5注册背景图']) {
						this.J_udge = res.data.data['H5注册背景图'];
					}
					this.z_show=true
				},
			});
		},
		go_click() {
			uni.navigateTo({
				url: '/pages/register/register' + '?referrer=' + this.referrer + '&agentId=' + this.agentId
			});
		},
		go_register() {
			uni.navigateTo({
				url: '/pages/download/download' + '?agentId=' + this.agentId
			});
		}
	}
};
</script>

<style lang="less">
.BOX {
	.bj{
		 background: rgba(0, 0, 0, 0.25);
		 width: 100%;
		 height: 100%;
		 position: fixed;
		 z-index: 999999;
		 top: 0;
		 left: 0;
		 bottom: 0;
		 right: 0;
		 // opacity: 0.2;
	}
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
	text-align: center;
	.z_img {
		.z_Bg {
			width: 100%;
			height: 1300upx;
			position: absolute;
			top: 0;
			left: 0;
		}
	}
	.z_botton {
		position: relative;
		top: 1060upx;
		height: 84upx;
		width: 50%;
	}
}
</style>
