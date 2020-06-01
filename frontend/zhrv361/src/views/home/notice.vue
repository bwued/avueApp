<template>
  <!-- 首页弹窗广告 -->
  <div v-if="!read">
    <div class="van-overlay" style="z-index: 20001;" />
    <div id="home_notice" style="z-index: 20002; ">
      <div class="h_notice_box">
        <h2 class="title">
          {{ ptitle }}
        </h2>
        <div class="h_content" v-html="phtml" />
        <div class="h_button">
          <div class="btn" @click="gotoNotice">
            立即前往
          </div>
          <div class="close" @click="closeNotice">
            忽略
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      read: true,
      id: 3,
      phtml: '',
      ptitle: ''
    }
  },
  created() {
    this.getPoster()
  },

  methods: {
    gotoNotice() {
      this.closeNotice()
      this.$router.push('/noticeDetail?id=' + this.id)
    },
    closeNotice() {
      const that = this
      that.read = true
      this.$api.home.closePoster({ announcementId: that.id }).then(res => {
        that.read = res.data.data.read
      })
    },
    getPoster() {
      const that = this
      this.$api.home.getPoster().then(res => {
        that.phtml = res.data.data.content
        that.ptitle = res.data.data.title
        that.id = res.data.data.id
        that.read = res.data.data.read
      })
    }
  }
}
</script>
<style lang="less" scoped>
#home_notice {
	z-index: 99999;
	height: 450px;
	position: fixed;
	width: 80%;
	height: 900px;
	overflow: hidden;
	left: 50%;
	top: 50%;
	margin-left: -40%;
	margin-top: -450px;
	background: center center no-repeat url('../../../static/img/notice_bg.jpg');
	background-size: contain;
	.h_notice_box {
		position: relative;
		width: 90%;
		margin: 320px auto;
		height: 580px;
		.title {
			margin: 20px auto 10px;
			text-align: center;
			color: #000;
			font-size: 42px;
			height: 60px;
			line-height: 60px;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}

	}

	.h_content {
		height: 360px;
		// background: yellow;
		position: relative;
		width: 90%;
		margin: 10px auto;
		overflow: auto;
	}

	.h_button {
		position:absolute; left: 0; bottom: 0;
		margin: 10px auto;
		width: 100%;
		height: 120px;
		text-align: center;
		font-size: 30px;
		.btn {
			background: #ff1d33; width: 80%; height: 70px; margin: 0 auto; text-align: center; line-height: 70px; font-size: 30px; border-radius: 50px;
		}
		.close {
			color: #ff1d33;  line-height:60px;
		}
	}
}
</style>
