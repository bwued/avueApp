<template>
  <div>
    <top-msg header-name="升级中心" />
    <div class="con_body mgb110">
      <div class="bg_msg">
        <template v-if="userInfo">
          <h5
            v-if="userInfo.id_card_name"
            class="user-name textEllipsis"
          >{{ userInfo.id_card_name}}</h5>
         <h5 v-else class="user-name textEllipsis">{{ userInfo.username.substring(0,3) + '****' +userInfo.username.substring(7,11) }}</h5>
        </template>
        <!-- <div class="all-rate" @click.stop="gotoFeeDetail(userFeeMsg)">所有费率</div> -->
      </div>
      <div class="member_head">
        <div class="flex-row-center" v-if="userInfo">
          <img
            class="rank_img"
            v-if="userInfo.rank_name === '普通用户' || userInfo.rank_name === '免费用户'"
            src="../../../static/img/pt.png"
          />
          <img
            class="rank_img"
            v-else-if="userInfo.rank_name === 'VIP'"
            src="../../../static/img/VIP.png"
          />
          <img
            class="rank_img"
            v-else-if="userInfo.rank_name === '银商'"
            src="../../../static/img/ys.png"
          />
          <img
            class="rank_img"
            v-else-if="userInfo.rank_name === '金商'"
            src="../../../static/img/js.png"
          />
          <img
            class="rank_img"
            v-else-if="userInfo.rank_name === '钻商'"
            src="../../../static/img/zs.png"
          />
          <span class="rank-name">{{userInfo.rank_name}}</span>
        </div>
        <div class="rate-info">
          <div class="rate-info-item">
            <div class="rate-info-num">
              <span class="rate-val">&nbsp;</span>
              <span class="rate-sign">&nbsp;</span>
            </div>
            <div class="rate-name">&nbsp;</div>
          </div>
          <div class="rate-info-item">
            <div class="rate-info-num">
              <span class="rate-val">&nbsp;</span>
              <span class="rate-sign">&nbsp;</span>
            </div>
            <div class="rate-name">&nbsp;</div>
          </div>
        </div>

        <div class="z_percentage" v-if="userInfo.rank_name === '普通用户'">
          <div class="div1">
            <p id="p1">低至：0.72%+1</p>
            <p id="p2">费率</p>
          </div>
          <div class="div2">
            <p id="p2">推广比例:</p>
            <p id="p1">0</p>
          </div>
        </div>
        <div class="z_percentage" v-if="userInfo.rank_name === 'VIP'">
          <div class="div1">
            <p id="p1">低至：0.52%+1</p>
            <p id="p2">费率</p>
          </div>
          <div class="div2">
            <p id="p2">推广比例:</p>
             <p id="p1">20%</p>
          </div>
        </div>
        <div class="z_percentage" v-if="userInfo.rank_name === '银商'">
          <div class="div1">
            <p id="p1">低至：0.50%+1</p>
            <p id="p2">费率</p>
          </div>
          <div class="div2">         
            <p id="p2">推广比例:</p>
              <p id="p1">30%</p>
          </div>
        </div>
        <div class="z_percentage" v-if="userInfo.rank_name === '金商'">
          <div class="div1">
            <p id="p1">低至：0.45%+1</p>
            <p id="p2">费率</p>
          </div>
          <div class="div2">         
            <p id="p2">推广比例:</p>
            <p id="p1">40%</p>
          </div>
        </div>
        <div class="z_percentage" v-if="userInfo.rank_name === '钻商'">
          <div class="div1">
            <p id="p1">低至：0.42%+1</p>
            <p id="p2">费 率</p>
          </div>
          <div class="div2">           
            <p id="p2">推广比例:</p>
             <p id="p1">50%</p>
          </div>
        </div>
          <div class="z_percentage" v-if="userInfo.rank_name === '大区服务商'">
          <div class="div1">
            <p id="p1">低至：0.40%+1</p>
            <p id="p2">费 率</p>
          </div>
          <div class="div2">   
            <p id="p2">推广比例:</p>
            <p id="p1">50%</p>
          </div>
        </div>
          <div class="z_percentage" v-if="userInfo.rank_name === '全国服务商'">
          <div class="div1">
            <p id="p1">低至：0.38%+1</p>
            <p id="p2">费 率</p>
          </div>
          <div class="div2">
            <p id="p2">推广比例:</p>
             <p id="p1">50%</p>
          </div>
        </div>
         <div class="z_percentage" v-if="userInfo.rank_name === '股东'">
          <div class="div1">
            <p id="p1">低至：0.36%+1</p>
            <p id="p2">费 率</p>
          </div>
          <div class="div2">
            <p id="p2">推广比例:</p>
             <p id="p1">50%</p>
          </div>
        </div>

        <!-- <div class="notice" v-if="userFeeMsg" style="display: none;">
          <img src="../../../static/img/icon_gantanhao.png" alt class="notice-img" />
          <div v-if="userFeeMsg" class="notice-info">
            <template
              v-if="userFeeMsg.nextFee != ''"
            >距离{{ userFeeMsg.nextFee.rank.rank_name }}还差：{{ userFeeMsg.nextFee.rank.critical_reference_count - userInfo.reference_count }}个VIP</template>
            <template v-else>您已达到最高级别，无需再升级。</template>
          </div>
        </div> -->
      </div>
      <div class="explain_warp flex bgfff flex_align">
        <div class="explain_head">
          <i class="icon_memberMsg" />
        </div>
        <div class="explain_main">
          <h5 class="explain_main-text1">升级更划算</h5>
          <p class="explain_main-text2">费率更低 收益更高 永久有效</p>
        </div>
        <div class="explain_foot">
          <i class="iconfont icon-xiangqing icon_question" @click="explainDialog = true" />
        </div>
      </div>
      <div class="meal_warp bgf8f8f8">
        <div class="meal_title flex-row-between">
          <span class="update-package">选择升级套餐</span>
          <span class="size24 maincolor" style="  display: none;">升级记录</span>
        </div>
        <div class="meal_items">
          <div v-for="(item,index) in feeUpgradeEnableFeeList" :key="item.rank.id" @click="toggle(index)" class="meal-item"  :class="{
              updated: item.rank.rank_order <= userInfo.rank_order,
              selected: item.rank.rank_order > userInfo.rank_order && currentSelect === index
            }"
          >
            <div class="rank-updated" v-if="item.rank.rank_order <= userInfo.rank_order">已升级</div>
            <div
              class="rank-name"
              :class="{
              updated: item.rank.rank_order <= userInfo.rank_order
            }"
            >{{ item.rank.rank_name }}</div>
            <!-- <div v-if="item.rank.rank_order <= userInfo.rank_order">已升级</div> -->
            <div
              class="rank-money"
              :class="{
              updated: item.rank.rank_order <= userInfo.rank_order
            }"
            >¥&nbsp;{{ (item.rank.upgrade_fee / 100).toFixed(0) }}</div>
            <div
              class="rank-update"
              :class="{
              updated: item.rank.rank_order <= userInfo.rank_order
            }"
            >立即升级</div>
          </div>
        </div>
        <div class="money">
          需要支付:
          <span>{{update_fee}}元</span>
        </div>
        <div class="update-pay-methods">
          <div class="update-pay-method" @click="selectedPayMethod = '1'">
            <img src="../../../static/img/icon_wechat.png" alt class="wx" />
            <div class="pay-method-name">微信支付</div>
            <img
              class="selected"
              v-if="selectedPayMethod === '1'"
              src="../../../static/img/selected.png"
              alt
            />
            <!-- <span v-else class="unselect"></span> -->
            <img class="selected" v-else src="../../../static/img/img_uncheck.png" alt />
          </div>
          <!-- <div class="update-pay-method" @click="selectedPayMethod = '2'">
            <img src="../../../static/img/icon_zhifubao.png" alt class="zfb" />
            <div class="pay-method-name">支付宝</div>
            <img
              class="selected"
              v-if="selectedPayMethod === '2'"
              src="../../../static/img/selected.png"
              alt
            />
            <img class="selected" v-else src="../../../static/img/img_uncheck.png" alt />
          </div>
          <div class="update-pay-method" @click="selectedPayMethod = '3'">
            <img src="../../../static/img/icon_unionpay.png" alt class="yl" />
            <div class="pay-method-name">银联</div>
            <img
              class="selected"
              v-if="selectedPayMethod === '3'"
              src="../../../static/img/selected.png"
              alt
            />
            <img class="selected" v-else src="../../../static/img/img_uncheck.png" alt />
          </div> -->
        </div>
      </div>
    </div>
    <div class="btn_warp">
      <button v-if="userFeeMsg.nextFee != ''" type="button" @click="openTypeSelect">确定升级</button>
      <button v-else type="button" class="btn_unUpgrate">确定升级</button>
    </div>

    <fee-list v-if="rateDialog" :fee-detail-msg="feeDetailMsg" @valueClose="valueClose" />
    <!--会员等级说明 start-->
    <van-dialog v-model="explainDialog" :show-confirm-button="showFalse" close-on-click-overlay>
      <div>
        <div class="explain_title">
          <h5>升级说明</h5>
        </div>
        <div class="explain_content">
          <p>升级制度是平台让利的一种推广方式，用户升级后可享受更低的费率和更高的利润空间，级别越高，费率越低，利润越高；了解更多可联系客服。</p>
        </div>
        <div class="cen mb40">
          <button type="button" class="btn btn_confirm" @click="explainDialog = false">知道了</button>
        </div>
      </div>
    </van-dialog>
    <!--会员等级说明 end-->

    <van-dialog v-model="codeDialog" :show-confirm-button="false" close-on-click-overlay>
      <div style="display: flex; justify-content: center; align-items: center">
        <qrcode
          id="qrcodeImg"
          :value="codeValue"
          :src="codeValue"
          :options="{width: 144}"
          tag="img"
        />
      </div>
      <div style="display: flex; justify-content: center; align-items: center">
        <span class="size36 bold">选使用微信扫码付费</span>
      </div>
    </van-dialog>
    <!-- 选择支付方式 1是微信 2是快捷 -->
    <van-actionsheet
      v-model="showTypeSelect"
      :actions="actions"
      cancel-text="取消"
      @select="onTypeSelect"
      @cancel="onTypeCancel"
    ></van-actionsheet>
  </div>
</template>

<script>
import Qrcode from "@chenfengyuan/vue-qrcode/src";
import topMsg from "@/components/topMsg";
import feeList from "@/components/feeList";
export default {
  name: "Member",
  components: { topMsg, feeList, Qrcode },
  /* data必须是函数*/
  data: function() {
    return {
      currentSelect: 0, // 当前选择的套餐
      rateDialog: false, // 会员费率表
      explainDialog: false, // 会员等级说明
      showFalse: false, // 是否显示弹框的确认按钮，false
      showServerDialog: false, // 联系客服弹窗
      feeList: [], // 费率列表
      feeDetailMsg: "", // 传给子组件，费率详细信息
      userFeeMsg: "", // 用户费用信息
      isLoading: "", // loading
      codeDialog: false,
      codeValue: "",
      showTypeSelect: false,
      actions: [
        {
          name: "微信支付",
          id: "1"
        }
        // {
        //   name: '快捷支付',
        //   id: '2'
        // }
      ],
      selectedPayMethod: "1",
      update_fee: "0"
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    rankOrder() {
      return this.$store.state.userInfo.rank_order;
    },
    feeUpgradeEnableFeeList() {
      const ret = this.feeList.filter(
        item => item.rank && item.rank.enable_fee_upgrade
      );
      try {
        for (let i = 0, len = ret.length; i < len; i++) {
          const item = ret[i];
          if (item.rank.rank_order > this.userInfo.rank_order) {
            this.currentSelect = i;
            this.update_fee = (item.rank.upgrade_fee / 100).toFixed(0);
            break;
          }
        }
      } catch (e) {
        console.log("feeUpgradeEnableFeeList catch: ", e);
      }
      return ret;
    }
  },
  created() {
    this.$store.commit("SET_KEEP_ALIVE", this.$options.name);
    this.isLoading = this.$toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: "spinner",
      message: "加载中..."
    });
    this.thisTitle();
    if (!this.userInfo) {
      this.$store.dispatch("GetUserInfo");
    }
    this.getMemberFeeMsgFun();
    console.log(this.userInfo);
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = "会员中心";
    },
    /* 会员等级切换*/
    toggle(i) {
      console.log
      if (
        this.feeUpgradeEnableFeeList[i].rank.rank_order >
        this.userInfo.rank_order
      ) {
        this.currentSelect = i;
        this.update_fee = (
          this.feeUpgradeEnableFeeList[i].rank.upgrade_fee / 100
        ).toFixed(0);
        console.log("enter: ", this.currentSelect);
        console.log("enter: ", typeof this.currentSelect);
      }
    },
    /* 获取会员费用信息*/
     getMemberFeeMsgFun() {
      const that = this;
      that.$api.member
        .getMemberFeeMsg()
        .then(res => {
          //  console.log("00000000000000000000000000");
          console.log(res);
          // console.log("11111111111111111111111111");
          res = res.data;
          that.feeList = res.data;
          that.feeList.forEach((value, index, arr) => {
            if (value.rank.rank_order === that.rankOrder) {
              value.index = index;
              value.nextFee = arr[index + 1] || "";
              that.userFeeMsg = value;
              console.log(that.userFeeMsg)
            }
          });
          that.isLoading.clear();
        })
        .catch(error => {
          that.isLoading.clear();
          console.log("获取会员费用信息 error: ", error);
        });
    },
    /* 子组件dialog 传递关闭dialog过来*/
    valueClose(value) {
      this.rateDialog = value;
    },
    /* 点击所有费率，查看费率详情*/
    gotoFeeDetail(feeItem) {
      this.feeDetailMsg = feeItem;
      this.rateDialog = true;
    },
    /* 计算rate*/
    computeRate(item) {
      return item ? (item * 100).toFixed(2) : 99;
    },
    /* 计算fee*/
    computeFee(item) {
      return item ? (item / 100).toFixed(2) : 99;
    },
    /* 点击升级*/
 upgradeMember(type) {
      const that = this
      const msg = that.feeUpgradeEnableFeeList[that.currentSelect]
      const data = {
        target_rank_order: msg.rank.rank_order,
        // type: type
      }
      console.log('upgradeMember data: ', data)
      console.log('upgradeMember msg: ', msg)
      console.log('upgradeMember that.feeUpgradeEnableFeeList: ', that.feeUpgradeEnableFeeList)
      if (type === '1') {
        that.$api.member.upgradeOrder(data).then(res => {
          res = res.data
          console.log(res)
          if (res.data.url) {
            console.log('res.data.url: ', res.data.url)
            this.$store.commit('CLEAR_KEEP_ALIVE', this.$options.name)
//            this.$openThirdLinks('',res.data.url,'支付')
//              window.location.href = res.data.url
//              this.$router.push({ path: '/iframe', query: { title: '支付',url:res.data.url }})
            // this.codeValue = res.data.url
            // this.codeDialog = true

              var u = navigator.userAgent;
              var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
              var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
              var _url = '支付###'+res.data.url+'###http://www.zhsc198.com/';
              console.log('--start 调用微信支付--')
              console.log(_url)
              if(isAndroid){
                  baiwangxinxi.OpenWechat(_url); // 安卓微信支付
              }
              if(isiOS) {
                  var message ={
                      title: '支付',
                      url:res.data.url,
                      referer:'http://www.zhsc198.com/',
                  }
                  window.webkit.messageHandlers.OpenWechat.postMessage(message); // TODO ios 微信支付
              }


          } else {
            that.$toast('升级失败！')
          }
        }).catch((err) => {
          console.log('下单 微信 err: ', err)
        })
      } else if (type === '2') { // 快捷支付升级
        that.$api.member.x_upgradeOrder(data).then(res => {
          res = res.data
          console.log('快捷 res: ', res)
          if (res.data.url) {
            console.log('res.data.url: ', res.data.url)
            this.$store.commit('CLEAR_KEEP_ALIVE', this.$options.name)
            this.$openThirdLinks('',res.data.url,'支付', '2')
            // this.codeValue = res.data.url
            // this.codeDialog = true
          } else {
            that.$toast('升级失败！')
          }
        }).catch((err) => {
          console.log('下单 快捷 err: ', err)
        })
      }
    },
    /* 判断会员等级选择样式 */
    judgeRankClass(i) {
      if (
        this.feeUpgradeEnableFeeList[i].rank.rank_order <=
        this.userInfo.rank_order
      ) {
        return 'meal_item-upgrade'
      } else {
        if (this.currentSelect === i) {
          return 'meal_item-active'
        } else {
          return ''
        }
      }
    },
    /* 打开支付方式 */
    openTypeSelect() {
      this.showTypeSelect = true
    },
    /* 选择支付方式 */
    onTypeSelect(item) {
      this.showTypeSelect = false
      // console.log('onTypeSelect:' , item)
      this.upgradeMember(item.id)
    },
    /* 取消支付方式选择 */
    onTypeCancel() {
      this.showTypeSelect = false
      // console.log('取消支付方式选择');
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-dialog {
  padding-bottom: 24px;
}
.con_body {
  margin-bottom: 40px;
  position: relative;
}
.icon_memberMsg {
  display: block;
  width: 87px;
  height: 87px;
  margin: 0 auto;
  background: url("../../../static/img/ic_shengji.png") no-repeat;
  background-size: 87px;
}
.icon_question {
  display: block;
  font-size: 40px;
  color: #e9b76b;
}

.explain_warp {
  padding: 47px 30px;
  margin-bottom: 24px;
}
.explain_head {
  display: inline-block;
}
.explain_main {
  flex: 1;
  margin-left: 24px;
}
.explain_foot {
  display: inline-block;
}
.meal_title {
  padding: 0 30px 33px 30px;
}
.meal_item {
  margin: 0 auto 20px;
  color: #666666;
  overflow: hidden;
}
.meal_item .item_btn {
  display: block;
  width: 140px;
  line-height: 44px;
  font-size: 24px;
  background-color: #ffffff;
  color: @mainColorD;
  border-radius: 22px;
  margin-top: 7px;
}
/* 已升级 start */
.meal_item-upgrade {
  color: #999999;
}
.meal_item-upgrade .meal_tip {
  margin-left: 10px;
  font-size: 24px;
}
.meal_item-upgrade .item_btn {
  background-color: #ffffff;
  color: #cccccc;
}
.meal_item-upgrade .item_right {
  background: linear-gradient(
    270deg,
    rgba(204, 204, 204, 1) 0%,
    rgba(238, 238, 238, 1) 100%
  );
}
.meal_item-upgrade .rank_title {
  color: #999999;
}
/* 已升级 end */
/* 选择 start */
.meal_item-active {
  border: 3px solid #f5c47d !important;
  border-radius: 15px;
}
/* 选择 end */

.meal_item .item_top {
  display: flex;
  align-items: center;
  margin: 40px 65px 20px 53px;
}
.meal_item .item_name {
  align-items: flex-end;
}
.meal_item .item_bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 65px 0 53px;
}
.meal_item .item_top h5 {
  margin-right: 18px;
}
.member_tip {
  margin: 16px 0 0 50px;
}
.lineHeight72 {
  line-height: 72px;
}
.btn_warp {
  background: #ffffff;
  position: relative;
  bottom: 0;
  left: 50%;
  width: 100%;
  margin-left: -50%;
  margin-top: 0;
}
.btn_warp > button {
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 30px;
  background: #bf9761;
  color: #ffffff;
  text-align: center;
  letter-spacing: 2px;
  border: none;
  background-blend-mode: normal, normal;
  &:active {
    opacity: 0.7;
  }
}
.btn_warp > .btn_unUpgrate {
  background: linear-gradient(
    -90deg,
    rgba(219, 219, 219, 0.8),
    rgba(197, 197, 197, 0.8)
  );
  color: #ffffff;
}

/* 会员等级说明 start*/
.btn_confirm {
  width: 510px;
  height: 70px;
  /* margin-bottom: 60px; */
  background: linear-gradient(
    90deg,
    rgba(246, 197, 126, 1),
    rgba(222, 170, 89, 1)
  );
  border-radius: 15px;
}
.explain_title {
  padding: 52px 0 42px;
  font-size: 36px;
  text-align: center;
  color: #333333;
}
.explain_content {
  padding: 0 54px 0 79px;
  margin-bottom: 60px;
  font-size: 26px;
  color: #999999;
}
/* 会员等级说明 end*/
/* ui修改 */
.member_head_bg {
  width: 100%;
  height: 270px;
}
.bg_msg {
  position: relative;
  margin: 20px 30px 17px;
}
.button_fee {
  width: 160px;
  height: 54px;
  line-height: 54px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10px 20px rgba(51, 51, 51, 0.1);
  opacity: 0.5;
  border-radius: 56px;
  text-align: center;
}
.member_head {
  margin: 0 30px 30px 30px;
  background: linear-gradient(to right, #8a6333, #d4b988);
  box-shadow: 0px 10px 20px rgba(153, 153, 153, 0.3);
  border-radius: 10px;
  padding: 11px 21px 15px 21px;
  box-sizing: border-box;
}
.rank_img {
  width: 71px;
  height: 81px;
  margin-right: 18px;
}
.rank-name {
  font-size: 36px;
  color: #ffffff;
}
.member_content {
  margin: 20px 144px 44px 144px;
}
.colorFFA726 {
  color: @mainColorD;
}
.rank_tip .iconfont {
  font-size: 24px;
  margin-right: 5px;
  color: @mainColorB;
}
.meal_item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 3px solid #f8f8f8;
}
.item_left {
  width: 482px;
  height: 200px;
  // padding: 42px 0 0 57px;
  margin-left: -60px;
  box-sizing: border-box;
  border-radius: 10px;
}
.item_right {
  width: 220px;
  height: 200px;
  // padding: 17px 40px 0 40px;
  box-sizing: border-box;
  border-radius: 10px;
}
.item_right {
  /* 未升级 */
  background: linear-gradient(
    270deg,
    rgba(222, 170, 89, 1) 0%,
    rgba(246, 197, 126, 1) 100%
  );
}
.originalCost {
  margin: 10px 0;
}
.item_btn {
  background-image: none;
}
.rank_title {
  color: #333333;
}
.user-name {
  color: #333333;
  font-size: 48px;
}
.all-rate {
  position: absolute;
  top: 13px;
  right: 0;
  height: 20px;
  padding: 6px 19px;
  background: #cccccc;
  color: #ffffff;
  font-size: 20px;
  box-shadow: 0px 10px 20px rgba(51, 51, 51, 0.1);
  border-radius: 20px;
  line-height: 20px;
  box-sizing: content-box;
}
.rate-info {
  display: flex;
  justify-content: space-around;
  // margin-bottom: 48px;
  .rate-info-num {
    margin-bottom: 24px;
    text-align: center;
  }
  .rate-val {
    color: #f6c77c;
    font-size: 48px;
  }
  .rate-sign {
    color: #f6c77c;
    font-size: 24px;
  }
  .rate-name {
    color: #ffffff;
    font-size: 24px;
    text-align: center;
  }
}
.notice {
  display: flex;
  .notice-img {
    width: 24px;
    height: 24px;
    margin: 3px 10px 0 0;
  }
  .notice-info {
    font-size: 24px;
    color: #ffffff;
  }
}
.explain_main-text1 {
  font-size: 36px;
  color: #bf9761;
  line-height: 72px;
}
.explain_main-text2 {
  color: #999999;
  font-size: 24px;
}
.update-package {
  font-size: 30px;
  font-weight: 500;
  color: #333333;
}
.meal_items {
  position: relative;
  display: flex;
  margin: 0 30px;
  .meal-item {
    border-radius: 4px;
    width: 158px;
    padding: 13px 0 30px 0;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    // border: 1px solid #BF9761;
    position: relative;
    &.updated {
      background: linear-gradient(
        2deg,
        rgba(138, 99, 51, 1) 0%,
        rgba(140, 101, 53, 1) 10%,
        rgba(212, 185, 136, 1) 100%
      );
    }
    &.selected {
      // border-color: rgba(237,96,2,1);
      background: linear-gradient(
        2deg,
        rgba(138, 99, 51, 1) 0%,
        rgba(140, 101, 53, 1) 10%,
        rgba(212, 185, 136, 1) 100%
      );
    }
    &.selected .rank-money {
      color: white;
    }
  }
  .rank-updated {
    display: inline-block;
    height: 27px;
    position: absolute;
    top: -14px;
    right: 0;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 6px;
    background: linear-gradient(
      109deg,
      rgba(237, 96, 2, 1) 0%,
      rgba(237, 82, 2, 1) 0%,
      rgba(237, 2, 2, 1) 100%
    );
    color: #ffffff;
    font-size: 16px;
    line-height: 27px;
    padding: 2px 4px;
  }
  .rank-name {
    font-size: 48px;
    height: 67px;
    line-height: 67px;
    text-align: center;
    color: #333333;
    &.updated {
      color: #ffffff;
    }
  }
  .rank-money {
    color: #ffcf81;
    font-size: 36px;
    line-height: 50px;
    height: 50px;
    margin-bottom: 19px;
    text-align: center;
  }
  .rank-update {
    width: 120px;
    margin: 0 auto;
    color: #ffffff;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    text-align: center;
    border-radius: 20px;
    background: linear-gradient(
      96deg,
      rgba(241, 46, 53, 1) 0%,
      rgba(249, 195, 113, 1) 100%
    );
    &.updated {
      background: #8a6333;
    }
  }
}
.meal-item + .meal-item {
  margin-left: 20px;
}
.money {
  margin: 33px 30px 23px 30px;
  font-size: 30px;
  color: #333333;
  span {
    color: #fa4559;
  }
}
.update-pay-method {
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 27px 30px;
  &:active {
    background: #eeeeee;
  }
  .wx,
  .zfb {
    width: 36px;
    height: 36px;
  }
  .yl {
    width: 40px;
    height: 24px;
  }
  .selected {
    width: 28px;
    height: 28px;
  }
  .unselect {
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #757a85;
  }
  .update-pay-method + .update-pay-method {
    border-top: 1px solid #eeeeee;
  }
  .pay-method-name {
    flex: 1;
    color: #333333;
    font-size: 26px;
    height: 37px;
    line-height: 37px;
    padding: 0 33px 0 23px;
  }
}
.z_percentage {
  display: flex;
  justify-content: space-between;
  position: relative;
  top: -1.5rem;
  #p1 {
    color: #ffcf81ff;
    font-size: 1.2rem;
    text-align: center;
    margin-left: -1.5rem;
  }
  #p2 {
    color: #ffffffff;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    width: 4.2rem;
  }
  .div1 {
    text-align: center;
    margin-left: 4.5rem;
  }
  .div2 {
    margin-right: 5rem;
    position: absolute;
    top: 1.6rem;
    left: 15rem;
    display: flex;
    flex-wrap: row;
    #p1{
      position: relative;
      top: -1.3rem;
      left: -2rem;
    }
  }
}
</style>
