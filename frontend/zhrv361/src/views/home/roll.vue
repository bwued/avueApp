<template>
  <div class="Z_hello">
    <div class="Z_xibao">
      <img src="../../../static/img/xibao.png">
    </div>
    <div class="box" id='homeListBox'>
      <div class="li_box li_box_10" v-html="listSum[0].content"  v-if="type === 'A' "></div>
      <div class="li_box li_box_30" v-html="listSum[0].content"  v-if="type === 'B' "></div>
      <div class="li_box li_box_50" v-html="listSum[0].content"  v-if="type === 'C' "></div>
      <div class="li_box li_box_70" v-html="listSum[0].content"  v-else-if="type === 'D'"></div>
      <div class="li_box li_box_100" v-html="listSum[0].content"  v-else-if="type === 'E'"></div>
      <div class="li_box li_box_150" v-html="listSum[0].content" v-else-if="type === 'F'"></div>
      <div class="li_box li_box_200" v-html="listSum[0].content" v-else></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lent: '',
	  type:'D',
	  plent:100,
      listSum: []
    }
  },
  created() {
    this.xibaoHotel()
  },
  
  methods: {
	scroll(speed){
		var speed = speed || 80;  // 可自行设置文字滚动的速度 
		var wrapper = document.getElementById('wrapper');
		var demo1 = document.getElementById('demo1');
		var demo2 = document.getElementById('demo2');
	 
		demo2.innerHTML=demo1.innerHTML   //克隆demo1为demo2  
		function Marquee(){  
			if(demo2.offsetHeight-wrapper.scrollTop<=0)  //当滚动至demo1与demo2交界时  
				wrapper.scrollTop-=demo1.offsetHeight    //demo跳到最顶端  
			else{  
				wrapper.scrollTop++   //如果是横向的 将 所有的 height top 改成 width left  
			}  
		}  
		
		var MyMar=setInterval(Marquee,speed)  //设置定时器  
		wrapper.οnmοuseοver=function() {clearInterval(MyMar)}   //鼠标移上时清除定时器达到滚动停止的目的  
		wrapper.οnmοuseοut=function() {MyMar=setInterval(Marquee,speed)}  //鼠标移开时重设定时器  
		

	},  
	leave(score){
	    if(score < 0 || score > 200){
	        return '无效....';
	    }
	    if(score >= 0 && score < 10){
	        return 'A';
	    }
	    if(score >= 10 && score < 30){
	        return 'B';
	    }
		if(score >= 30 && score < 50){
		    return 'C';
		}
		if(score >= 50 && score < 70){
		    return 'D';
		}
	    if(score >= 70 && score < 100){
	        return 'E';
	    }
	    if(score >= 100 && score < 150){
	        return 'F';
	    }
	    if(score >= 150 && score < 200){
	        return 'G';
	    }
	    return 'B'; 
	},

    xibaoHotel() {
	  const that = this
      this.$api.home.SheratonHotel().then(res => {
        that.listSum = res.data.data
		that.plent = that.listSum[0].content.split('</p>').length || 50
		that.type = that.leave(that.plent)
		// alert(that.type+':'+that.plent)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.Z_hello {
  overflow: hidden;
  display: flex;
  flex: row;
  margin-top: 10px;
  color: aqua;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #f5f5f5;
  .Z_xibao {
    width: 18%;
    img {
      width: 2rem;
      height: 2rem;
      margin: 0.2rem 1.2rem;
    }
  }
}
.box {
  width: 80%;
  height: 70px;
  position: relative;
}
.box .li {
  width: 100%;
  height: 70px;
  // overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 2rem;
  color: #666;
  line-height: 70px;
}
.li_box {
  line-height: 55px;
}
.li_box_10 {
  animation: li_move 10s linear 1s infinite;
}
.li_box_30 {
  animation: li_move 30s linear 1s infinite;
}
.li_box_50 {
  animation: li_move 50s linear 1s infinite;
}
.li_box_70 {
  animation: li_move 70s linear 1s infinite;
}
.li_box_100 {
  animation: li_move 100s linear 1s infinite;
}
.li_box_150 {
  animation: li_move 150s linear 1s infinite;
}
.li_box_200 {
  animation: li_move 200s linear 1s infinite;
}
@keyframes li_move {
  0% {
    transform: translateY(0%);
  }

  100% {
    /* 此处70px 与上面设置的高度相对应 */
    transform: translateY(calc((100% - 70px) * -1));
  }
}
</style>
