<template>
  <div>
    <top-msg header-name="补充认证" />
    <div class="con_body">
      <div class="box">
        <div class="line flex-row-center">
          <span class="line_left">手机号码</span>
          <span>{{ phone }}</span>
        </div>
        <div class="line flex-row-center">
          <span class="line_left">姓名</span>
          <span>{{ name }}</span>
        </div>
        <div class="line flex-row-center">
          <span class="line_left">身份证</span>
          <span>{{ id_card_no }}</span>
        </div>
        <div class="line">
          <div class="form_cell_upload flex_sa">
            <div class="upload_item flex_column flex_alCen">
              <template v-if="!cardImgFront.url">
                <div class="cell_uploadImg">
                  <van-uploader :after-read="onCardImgFront">
                    <span class="upload_add">+</span>
                  </van-uploader>
                </div>
              </template>
              <template v-else>
                <div class="cell_uploadImg">
                  <img v-if="cardImgFront.fileData" :src="cardImgFront.url">
                  <template v-else>
                    <img :src="cardImgFront.url">
                    <van-loading />
                  </template>
                  <span class="upload_close" @click="deleteImg('cardImgFront')" />
                </div>
              </template>
              <p class="color333 size24">
                身份证正面照
              </p>
            </div>
            <div class="upload_item flex_column flex_alCen">
              <template v-if="!cardImgAfter.url">
                <div class="cell_uploadImg">
                  <van-uploader :after-read="onCardImgAfter">
                    <span class="upload_add">+</span>
                  </van-uploader>
                </div>
              </template>
              <template v-else>
                <div class="cell_uploadImg">
                  <img v-if="cardImgAfter.fileData" :src="cardImgAfter.url">
                  <template v-else>
                    <img :src="cardImgAfter.url">
                    <van-loading />
                  </template>
                  <span class="upload_close" @click="deleteImg('cardImgAfter')" />
                </div>
              </template>
              <p class="color333 size24">
                身份证反面照
              </p>
            </div>
            <div class="upload_item flex_column flex_alCen">
              <template v-if="!cardImgHold.url">
                <div class="cell_uploadImg">
                  <van-uploader :after-read="onCardImgHold">
                    <span class="upload_add">+</span>
                  </van-uploader>
                </div>
              </template>
              <template v-else>
                <div class="cell_uploadImg">
                  <img v-if="cardImgHold.fileData" :src="cardImgHold.url">
                  <template v-else>
                    <img :src="cardImgHold.url">
                    <van-loading />
                  </template>
                  <span class="upload_close" @click="deleteImg('cardImgHold')" />
                </div>
              </template>
              <p class="color333 size24">
                手持证件照
              </p>
            </div>
          </div>
        </div>
        <div class="tip">
          说明：请提交身份证图片资质信息
        </div>
      </div>
    </div>
    <div class="btn_footer">
      <div class="flex-vertical-centering">
        <div class="btn btn_submit" @click="supplementaryFun">
          确认提交
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import { compressFile } from '@/utils/upload'
export default {
  name: 'SupplementaryCertification',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      name: '', // 姓名
      id_card_no: '', // 身份证号
      phone: '', // 手机号
      postMsg: {},
      cardImgFront: {
        url: '',
        file: '',
        fileData: '',
        imgType: ''
      }, // 身份证正面照
      cardImgAfter: {
        url: '',
        file: '',
        fileData: '',
        imgType: ''
      }, // 身份证反面照
      cardImgHold: {
        url: '',
        file: '',
        fileData: '',
        imgType: ''
      } // 手持身份证照
    }
  },
  computed: {
    token() {
      return this.$store.state.token
    }
  },
  created() {
    this.thisTitle()
    this.getAuthenticationFun()
    this.postMsg = this.$store.state.orderData
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '补充认证'
    },
    /* 补充认证 */
    supplementaryFun() {
      const that = this
      const tip = msg => {
        return that.$dialog({
          title: msg,
          showCancelButton: false,
          confirmButtonText: '确定',
          className: 'dialog',
          closeOnClickOverlay: true
        })
      }
      if (!that.cardImgFront.url) {
        tip('请上传身份证正面照')
      } else if (!that.cardImgAfter.url) {
        tip('请上传身份证反面照')
      } else if (!that.cardImgHold.url) {
        tip('请上传手持证件照')
      } else if (!that.cardImgFront.fileData || !that.cardImgAfter.fileData || !that.cardImgHold.fileData) {
        tip('图片正在上传，请上传完毕之后再点击提交')
      } else {
        const orderData = {
          channel_code: that.postMsg.channel_code,
          credit_card_id: that.postMsg.deposit_bank_id,
          debit_card_id: that.postMsg.payback_bank_id,
          id_card_front_image: that.cardImgFront.fileData,
          id_card_in_hand_image: that.cardImgAfter.fileData,
          id_card_opposite_image: that.cardImgHold.fileData
        }

        that.$dialog({
          title: '确认补充认证',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          className: 'dialog',
          closeOnClickOverlay: true
        }).then(() => {
          that.isLoading = this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: '请稍候...'
          })
          that.$api.card.registrationChannels(orderData).then(res => {
            // that.isLoading.clear()
            res = res.data
            if (res.code === '200000') {
              // 再次发起支付
              that.payment()
              // that.$api.proceeds.tradePay(that.postMsg).then(res => {
              //   that.isLoading.clear()
              //   res = res.data
              //   if (res.code === '200000') {
              //     that.isSubmit = true
              //     that.$dialog({
              //       title: '请留意信用卡扣款是否成功及储蓄卡是否到账',
              //       showCancelButton: false,
              //       confirmButtonText: '确定',
              //       className: 'dialog',
              //       closeOnClickOverlay: true
              //     }).then(() => {
              //       that.$router.push('/proceeds')
              //     })
              //   }
              // }).catch(error => {
              //   that.isLoading.clear()
              //   const res = error.data

              //   // 未绑卡
              //   if (res.code === '921006' || res.code === '921010') {
              //     that.$router.push({
              //       path: '/bindCard',
              //       query: {
              //         cardId: orderData.deposit_bank_id,
              //         channelCode: orderData.channel_code
              //       }
              //     })
              //     return
              //   }

              //   // 绑卡中
              //   if (res.code === '921008') {
              //     that.$toast({
              //       message: res.msg,
              //       duration: 2500,
              //       forbidClick: true
              //     })
              //     return
              //   }

              //   // 绑卡失败
              //   if (res.code === '921009') {
              //     that.$toast({
              //       message: res.msg + '...请重新编辑',
              //       duration: 2500,
              //       forbidClick: true
              //     })
              //     that.$router.push({
              //       path: '/bindCard',
              //       query: {
              //         cardId: orderData.deposit_bank_id,
              //         channelCode: orderData.channel_code
              //       }
              //     })
              //     return
              //   }

              //   that.$toast({
              //     message: res.msg,
              //     duration: 3000,
              //     forbidClick: true
              //   })
              //   return
              // })
            }
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    /* 获取用户实名认证的信息 getAuthentication*/
    getAuthenticationFun() {
      const that = this
      that.$api.center
        .getAuthentication()
        .then(res => {
          that.name = res.data.data.id_card_name
          that.id_card_no = res.data.data.id_card_no
          that.phone = res.data.data.bank_card_phone_num
        })
    },
    /* 身份证正面照 获取图片信息*/
    onCardImgFront(file) {
      this.cardImgFront.url = file.content
      compressFile(file).then(file => {
        this.cardImgFront.file = file.file
        console.log(this.cardImgFront.file)
        this.uploadCardImgFun(this.cardImgFront.file, 'ID_CARD_FRONT_IMAGE')
      })
    },
    /* 身份证反面照 获取图片信息*/
    onCardImgAfter(file) {
      this.cardImgAfter.url = file.content
      compressFile(file).then(file => {
        this.cardImgAfter.file = file.file
        this.uploadCardImgFun(this.cardImgAfter.file, 'ID_CARD_OPPOSITE_IMAGE')
      })
    },
    /* 手持证件照 获取图片信息*/
    onCardImgHold(file) {
      this.cardImgHold.url = file.content
      compressFile(file).then(file => {
        this.cardImgHold.file = file.file
        this.uploadCardImgFun(this.cardImgHold.file, 'ID_CARD_IN_HAND_IMAGE')
      })
    },
    /*
      *  上传图片
      *  ID_CARD_FRONT_IMAGE 身份证正面
      *  ID_CARD_OPPOSITE_IMAGE 身份证反面
      *  ID_CARD_IN_HAND_IMAGE 手持证件照
     	*/
    uploadCardImgFun(data, status) {
      const that = this
      // 提交到服务器
      var fd = new FormData()
      fd.append('file', data)
      var xhr = new XMLHttpRequest()
      xhr.open('post', process.env.VUE_APP_BASE_API + '/image/upload?target=' + status, true)
      const token = 'Bearer ' + that.token.replace(/[\"]/g, '')
      xhr.setRequestHeader('Authorization', token)
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          const res = JSON.parse(xhr.response)
          if (xhr.status === 200) {
            if (status === 'ID_CARD_FRONT_IMAGE') {
              // 储蓄卡正面照
              that.cardImgFront.fileData = res.data.file_name
            } else if (status === 'ID_CARD_OPPOSITE_IMAGE') {
              // 储蓄卡背面照
              that.cardImgAfter.fileData = res.data.file_name
            } else if (status === 'ID_CARD_IN_HAND_IMAGE') {
              // 手持证件照
              that.cardImgHold.fileData = res.data.file_name
            }
          } else {
            that.$dialog({
              title: '提交失败，请重新提交',
              showCancelButton: false,
              confirmButtonText: '确定',
              className: 'dialog',
              closeOnClickOverlay: true
            })
          }
        }
      }
      // 开始发送
      xhr.send(fd)
    },
    /* 删除图片*/
    deleteImg(type) {
      if (type === 'cardImgFront') {
        this.cardImgFront.url = ''
        this.cardImgFront.file = ''
        this.cardImgFront.fileData = ''
      } else if (type === 'cardImgAfter') {
        this.cardImgAfter.url = ''
        this.cardImgAfter.file = ''
        this.cardImgAfter.fileData = ''
      } else if (type === 'cardImgHold') {
        this.cardImgHold.url = ''
        this.cardImgHold.file = ''
        this.cardImgHold.fileData = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .con_body{
    padding: 0 24px;
    box-sizing: border-box;
  }
  .box{
    margin-top: 24px;
    padding: 1px 24px 40px 24px;
    box-sizing: border-box;
    width:702px;
    background:rgba(255,255,255,1);
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
    border-radius:10px;
    .line{
      margin-top: 40px;
      .line_left{
        width: 220px;
      }
    }
    .tip{
      margin-top: 40px;
      background:rgba(238,238,238,1);
      padding: 20px 24px;
      box-sizing: border-box;
    }
  }
  .btn_footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: #ffffff;
    border-top: 0.01rem solid #eeeeee;
  }
  .btn_footer>div{
    width: 100%;
    height: 100px;
    text-align: center;
    .btn_submit{
      line-height: 74px;
    }
  }
</style>
