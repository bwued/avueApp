<template>
  <div class="rank">
    <img class="star" src="../../static/img/icon_xingji.png" alt="star">
    <span class="rank-text">{{text}}</span>
    <img class="more" src="../../static/img/icon_more.png" alt="more">
  </div>
</template>

<script>
export default {
  name: 'rank',
  props: {
    text: {
      type: String,
      required: true
    }
  },
}
</script>

<style lang="less" scoped>
.rank {
  display: inline-flex;
  height: 34px;
  border-radius: 17px;
  background:linear-gradient(180deg,rgba(138,99,51,1) 0%,rgba(212,185,136,1) 100%);
}
.star {
  width: 34px;
  height: 34px;
}
.rank-text {
  display: inline-block;
  height: 34px;
  line-height: 40px;
  padding: 0 8px;
  color: #ffffff;
  font-size: 20px;
}
.more {
  width: auto;
  width: 7px;
  height: 13px;
  margin: 12px 7px 0 0;
}
</style>
