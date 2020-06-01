<template>
  <div class="Z_hello">
    <div class="Z_xibao">
      <img src="../../../static/img/xibao.png">
    </div>
    <div class="box" id='homeListBox'>
      <!-- <div class="li_box" v-html="listSum[0].content" /></div> -->
	  <div class="container">
	  <div class="li-box">
	  <ul>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lent: '',
      listSum: []
    }
  },
  created() {
    this.xibaoHotel()
  },
  methods: {
    xibaoHotel() {
      this.type = this.typecom
      this.$api.home.SheratonHotel().then(res => {
        this.listSum = res.data.data
      })
    }
  }
}
</script>
<style lang="less" scoped>
ul,li{ margin:0; padding:0; }
li{ list-style:none; }
.container{ display:inline-block; background:#efefef; padding:10px; border:1px solid #ccc; font-family:"Microsoft YaHei"; }
.container .li-box{ height:28px; overflow:hidden; }
.container ul{ position:relative; animation: moveUp 8s 0.6s infinite; -webkit-animation: moveUp 8s 0.6s infinite; }
@keyframes moveUp
{
0% {top:0px;}
18% {top:0px;}
20% {top:-28px;}
38% {top:-28px;}
40% {top:-56px;}
58% {top:-56px;}
60% {top:-84px;}
78% {top:-84px;}
80% {top:-112px;}
98% {top:-112px;}
}</p> <p> @-webkit-keyframes moveUp /*Safari and Chrome*/
{
0% {top:0px;}
18% {top:0px;}
20% {top:-28px;}
38% {top:-28px;}
40% {top:-56px;}
58% {top:-56px;}
60% {top:-84px;}
78% {top:-84px;}
80% {top:-112px;}
98% {top:-112px;}
}
.container li{ line-height:1.8; color:#666; }	
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
.li_box {
  animation: li_move 25s linear 1s infinite;
    // animation: revolving 4s 0s infinite;
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
