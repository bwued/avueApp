<template>
  <div v-if="!isWechat" class="header">
    <div class="header_body">
      <!-- <span class="goBack" @click="goBack">
        <van-icon name="arrow-left" />
      </span> -->
      <div class="flex-vertical-centering">
        <p class="textEllipsis" @click="showLog">
          {{ headerName }}
        </p>
      </div>
      <span v-if="shareShow" class="shareSheet" @click="shareSheet">分享</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopMsg',
  // 接受父组件的值
  props: {
    headerName: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: true
    },
    shareShow: {
      type: Boolean,
      default: false
    }
  },
  /* data必须是函数*/
  data: function() {
    return {
      clickNum: 0,
    }
  },
  computed: {
    isWechat() {
      return this.$store.state.isWechat
    }
  },
  watch: {
    $route() {
      this.clickNum = 0;
    }
  },
  created() {

  },
  methods: {
    goBack() {
      var that = this
      that.$router.go(-1); // TODO 返回上一页


      // api.historyBack({
      //   frameName: ''
      // }, function(ret, err) {
      //    console.log('historyBack ret: ', ret)
      //    console.log('historyBack err: ', err)
      //   if (!ret.status) {
      //     // api.closeWin()
      //     that.$router.go(-1)
      //   }
      // })
    },
    shareSheet() {
      this.$emit('shareSheet')
    },
    showLog() {
      // if (this.headerName !== '设置') {
      //   return
      // }
      this.clickNum++;
      if (this.clickNum === 5) {
        this.clickNum = 0
        let vcswitch = document.getElementsByClassName('vc-switch')[0]
        let display = window.getComputedStyle(vcswitch, null).getPropertyValue('display')
        if (display === 'block') {
          VCONSOLE.hide()
        } else {
          VCONSOLE.show()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-icon{
  font-size: 2rem;
  margin-top: .5rem;
}
  .goBack{
    position: absolute;
    width: 100px;
    padding-right: 30px;
    text-align: center;
    &:active {
      background-color: #eeeeee;
    }
  }
  .shareSheet{
    position: absolute;
    top: 0;
    right: 24px;
  }
  .header_body{
    div{
      width: 100%;
      text-align: center;
      p{
        width: 33vw;
        overflow: hidden;
      }
    }
  }
</style>
