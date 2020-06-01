<template>
  <div>
    <top-msg header-name="管理地址" />
    <div class="con_body">
      <div class="content size28 color666">
        <!-- <div class="content_line flex-row-center">
          <span class="color333">收货人</span>
          <input v-model="name" type="text" placeholder="请填写收货人姓名">
        </div>
        <div class="content_line flex-row-center">
          <span class="color333">手机号码</span>
          <input v-model="phone" type=tel maxlength="11" placeholder="请填写收货人电话">
        </div> -->
        <div class="content_line flex-row-center">
          <span class="color333">选择地区</span>
          <div class="color666" @click="showArea">
            {{ area || "请选择地区" }}
          </div>
          <i class="iconfont icon-Path" />
          <van-popup v-model="areashow" position="bottom">
            <van-area :area-list="areaList" :columns-num="2" @confirm="addArea" @cancel="cancel" />
          </van-popup>
        </div>
        <div class="content_line flex-row">
          <span class="color333">详细地址</span>
          <textarea v-model="address" rows="3" placeholder="请输入详细地址信息" />
        </div>
        <div v-if="type!='bianji'" class="default flex-row-center">
          <span class="color333">设为默认地址</span>
          <van-checkbox v-model="checked" />
        </div>
      </div>
    </div>
    <div class="btn_footer">
      <div class="flex-vertical-centering">
        <button v-if="type=='bianji'" type="button" class="btn btn_submit" @click="add">
          确认修改
        </button>
        <button v-else type="button" class="btn btn_submit" @click="add">
          确认添加
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Checkbox } from 'vant'
import 'vant/lib/checkbox/style'
import topMsg from '@/components/topMsg'
import areaList from '../../assets/area.js'
export default {
  name: 'NewAddress',
  components: { topMsg, [Checkbox.name]: Checkbox },
  /* data必须是函数*/
  data: function() {
    return {
      checked: false,
      type: '', // bianji 编辑地址
      items: [], // 地址数据
      address: '', // 详细地址
      area: '', // 地区
      name: '移动', // 收货人姓名
      phone: '10086', // 收货人手机号

      areashow: false,
      areaList: areaList // 省市数据
    }
  },
  created() {
    this.thisTitle()
    this.type = this.$route.query.type
    this.items = this.$route.query.items
    console.log(this.items)
    if (this.items) {
      this.address = this.items.address_info.address
      this.area = this.items.address_info.area
      this.name = this.items.address_info.name
      this.phone = this.items.address_info.phone
      this.checked = this.items.use_default
    }
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      console.log(this.type)
      if (this.type === 'bianji') {
        document.title = '编辑地址'
      } else {
        document.title = '添加地址'
      }
    },
    // 选择省市
    showArea() {
      this.areashow = true
    },
    // 省市确认
    addArea(val) {
      // console.log(val)
      this.area = val[0].name + '  ' + val[1].name
      this.all = val[0].name + '  ' + val[1].name
      this.province = val[0].name
      this.city = val[1].name
      this.region = val[1].code
      this.areashow = false
    },
    // 省市取消
    cancel() {
      this.areashow = false
    },
    /* 确认添加 */
    add() {
      const that = this
      // if (!that.name) {
      //   that.$toast({
      //     message: '请输入收货人姓名',
      //     position: 'middle'
      //   })
      // } else if (!that.phone) {
      //   that.$toast({
      //     message: '请输入收货人电话',
      //     position: 'middle'
      //   })
      // } else if (!that.$util.isPhone(that.phone)) {
      //   that.$toast({
      //     message: '请输入正确的手机号',
      //     position: 'middle'
      //   })
      // } else

      if (!that.area) {
        that.$toast({
          message: '请选择收货地区',
          position: 'middle'
        })
      } else if (!that.address) {
        that.$toast({
          message: '请输入详细地址',
          position: 'middle'
        })
      } else {
        const obj = {
          all: that.all,
          province: that.province,
          city: that.city,
          region: that.region
        }
        const data = {
          address_tag: JSON.stringify(obj),
          address: that.address,
          area: that.area,
          name: that.name,
          phone: that.phone,
          use_default: that.checked
        }
        if (this.type === 'bianji') {
          that.$api.center
            .editUserAddress(data, that.items.id)
            .then(res => {
              console.log(res)
              that.$router.go(-1)
            })
        } else {
          that.$api.center
            .addUserAddress(data)
            .then(res => {
              console.log(res)
              that.$router.go(-1)
            })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-picker__cancel{
  color: @mainColorB !important;
}
/deep/ .van-picker__confirm{
  color: @mainColorB !important;
}
  input,textarea{border: none; outline:none; background-color: rgba(255,255,255,0);}
	input,textarea:focus {outline: none;}
  .con_body{
    padding: 24px;
    box-sizing: border-box;
  }
  .content{
    width:702px;
    /* height:520px; */
    padding: 0 24px;
    box-sizing: border-box;
    background:rgba(255,255,255,1);
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
    opacity:1;
    border-radius:10px;
  }
  .content_line{
    padding-top: 40px;
    box-sizing: border-box;
  }
  .content_line>span{
    width: 223px;
  }
  .content_line>input{
    flex: 1;
  }
  .content_line>textarea{
    flex: 1;
  }
  .content_line>div{
    flex: 1;
  }
  .content_line>i{
    font-size: 24px;
    color: #cccccc;
  }
  .default{
    padding: 40px 0;
    box-sizing: border-box;
  }
  .default>span{
    margin-right: 56px;
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
  .btn{
    border-radius:10px;
  }
</style>
