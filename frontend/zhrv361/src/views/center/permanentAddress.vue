<template>
  <div>
    <top-msg header-name="常住地址" />
    <div class="con_body">
      <van-radio-group v-model="radio">
        <div v-for="(item,index) in addressList" :key="index" class="address_item" @click="recordId?addressSelected(item):''">
          <!-- <div class="address_user flex-row-between size28 color333 bold">
            <div class="flex-row-center">
              <span v-if="radio==index" class="default">默认</span>
              <span>收货人：{{ item.address_info.name }}</span>
            </div>
            <span>{{ item.address_info.phone }}</span>
          </div> -->
          <div class="address_msg flex-row">
            <i class="iconfont icon-dingwei" />
            <span class="size24 color666">{{ item.address_info.area + item.address_info.address }}</span>
          </div>
          <div class="item_footer flex-row-between">
            <van-radio :name="index" class="size24 color666" @click="setDefault(item.id)">
              设为默认
            </van-radio>
            <div class="item_footer_i flex-row-center">
              <i class="iconfont icon-bianji" @click.stop="bianji(item)" />
              <i class="iconfont icon-shanchu" @click.stop="shanchu(item.id)" />
            </div>
          </div>
        </div>
      </van-radio-group>
    </div>
    <div class="btn_footer">
      <div class="flex-vertical-centering">
        <router-link to="/newAddress" class="out_btn flex-vertical-centering">
          <div class="flex-row-center">
            <i class="iconfont icon-jia" />
            <span class="color0F5 size30">添加地址</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'ReceivingAddress',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      radio: '0',
      addressList: [],
      recordId: ''// 奖品记录Id
    }
  },
  created() {
    this.thisTitle()
    this.getAddressList()
    if (this.$route.query.id) {
      this.recordId = this.$route.query.id
    }
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '常住地址'
    },
    getAddressList() {
      const that = this
      that.$api.center.getUserAddress().then(res => {
        console.log(res)
        that.addressList = res.data.data
        that.addressList.map((value, key, arr) => {
          if (value.use_default) {
            that.radio = key
          } else {
            return
          }
        })
      })
    },
    bianji(item) {
      console.log('编辑')
      this.$router.push({ path: '/newAddress', query: { items: item, type: 'bianji' }})
    },
    shanchu(id) {
      const that = this
      that.$dialog({
        title: '确定要删除该地址？',
        showCancelButton: true,
        confirmButtonText: '确定',
        className: 'dialog',
        closeOnClickOverlay: true
      })
        .then(res => {
          that.$api.center.delUserAddress(id).then(res => {
            // console.log(res)
            that.getAddressList()
          })
        })
    },
    addressSelected(item) {
      const that = this
      console.log(item)
      const data = {
        address: item.address_info.address,
        area: item.address_info.area,
        name: item.address_info.name,
        phone: item.address_info.phone
      }
      that.$api.recommend
        .setReocrd(that.recordId, data)
        .then(res => {
          console.log(res)
          this.$router.push({ path: '/awardRecord', query: { }})
        })
    },
    setDefault(id) {
      const that = this
      that.$api.center.setDefault(id).then(res => {
        // console.log(res)
        that.getAddressList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .con_body{
    padding: 0 24px 124px 24px;
    box-sizing: border-box;
  }
  .address_item{
    margin-top: 24px;
    padding: 0 24px;
    box-sizing: border-box;
    width:702px;
    /* height:234px; */
    background:rgba(255,255,255,1);
    opacity:1;
    border-radius:15px;
  }
  .address_user{
    padding: 20px 0 20px 48px;
    box-sizing: border-box;
  }
  .default{
    width:70px;
    height:28px;
    line-height: 28px;
    text-align: center;
    background:rgba(0,134,242,1);
    opacity:1;
    border-radius:100px;
    color: white;
    font-size: 19px;
    font-weight: 500;
    margin-right: 12px;
  }
  .address_msg>i{
    font-size: 40px;
    margin-top: -20px;
    margin-right: 16px;
  }
  .address_msg>span{
    line-height:33px;
  }
  .item_footer{
    margin-top: 20px;
    padding:24px 0;
    box-sizing: border-box;
    border-top:1px solid rgba(237,237,237,1);
  }
  .item_footer_i i{
    font-size: 36px;
    margin: 0 25px;
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
  }
  .out_btn{
    width:460px;
    height:74px;
    line-height: 74px;
    border:3px solid rgba(15,91,182,1);
    .borderBtn;
    opacity:1;
    border-radius:10px;
    text-align: center;
    span,.iconfont{
      .fontColor;
    }
  }
  .out_btn i{
    font-size: 40px;
    color: @mainColorA;
    margin-right: 6px;
  }
</style>
