<template>
  <div class="recommend-page">
       <div class="box">
         <img :src="share_bg">
         <router-link to="/selectImg">
         <span class="z_logo">
           <img  src="../../../static/img/share2.png">
         </span>
         </router-link>
         </div>
    <tabbar :recommend-index="msg" />
  </div>
</template>

<script>
import Qrcode from '@chenfengyuan/vue-qrcode/dist/vue-qrcode'
import html2canvas from 'html2canvas'
import tabbar from '@/components/tabbar'
// import topMsg from '@/components/topMsg'
export default {
  name: 'share',
  components: { tabbar, Qrcode },
  /* data必须是函数*/
  data: function() {
    return {
     msg: true, //
	 share_bg: require('../../../static/img/share1.png'),
    }
  },

 
  created() {
	  this.$api.login.getclientTextShowConfig({name:'APP分享背景图'}).then(res=>{
	  	if(res.data.data && res.data.data['APP分享背景图']){
	  		this.share_bg = res.data.data['APP分享背景图']
	  	}
	  }).catch(err=>{
	  	console.log(err)
	  })
   
  },
  mounted() {
 
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.box{
  position: relative;
 img{
   width: 100%;
 }
 .z_logo{
   img{
     position: absolute;
     /*top: 33rem;*/
    /*left: 5.5rem;*/
     left:50%;
     margin-left: -7rem;
     bottom: 15%;
     width: 14rem;
     height: 3rem;
   }
 }
}

</style>
