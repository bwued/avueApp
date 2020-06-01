<template>
  <div>
    <top-msg header-name="免责声明" />
    <div class="con_body">
      <div class="statement_items">
        <div class="statement_item">
          <p>1、任何人因使用本公众号而可能遭致的意外及其造成的损失，我们对此概不负责，亦不承担任何法律责任。</p>
        </div>
        <div class="statement_item2">
          <p>2、本公众号禁止制作、复制、发布、传播等具有反动、色情、暴力、淫秽等内容的信息，一经发现，立即删除。若您因此触犯法律，我们对此不承担任何法律责任。</p>
        </div>
        <div class="statement_item">
          <p>3、本公众号会员自行上传或通过网络收集的资源，我们仅提供一个展示、交流的平台，不对其内容的准确性、真实性、正当性、合法性负责，也不承担任何法律责任。</p>
        </div>
        <div class="statement_item2">
          <p>4、任何单位或个人认为通过本公众号的页面内容可能涉嫌侵犯其著作权，应该及时向我们提出书面权利通知，并提供身份证明、权属证明及详细侵权情况证明。我们收到上述法律文件后，将会依法尽快处理。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'Statement',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {}
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '免责声明'
    }
  }
}
</script>

<style lang="less" scoped>
  .statement_item{
    padding: 15px 20px;
    font-size: 24px;
    color: #999999;
  }
  .statement_item2{
    background: #ffffff;
    padding: 15px 20px;
    font-size: 24px;
    color: #999999;
  }
</style>
