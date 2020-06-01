<template>
  <div class="bgfff">
    <div>
      <div class="search_title">
        <h5 class="size36 color333">
          选择银行
        </h5>
      </div>
      <div class="search_warp">
        <i class="icon_search" />
        <input v-model="searchValue" class="search_input" type="text" placeholder="请输入银行名称关键词">
      </div>
    </div>
    <div class="search_content">
      <mt-index-list :height="312">
        <mt-index-section v-if="!searchValue" :index="''">
          <li>
            <p class="line mint-indexsection-index">
              热门银行
            </p>
            <div class="hot_list">
              <div v-for="(value,key) in bankHotListArr" :key="key" :index="key" class="box">
                <div class="search_item" @click="clickCard(value)">
                  <div class="text">
                    {{ value.name }}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </mt-index-section>
        <mt-index-section v-for="(value,key) in bankListArr" :key="key" :index="key">
          <li v-for="(item, index) in value" :key="index" class="search_item" @click="clickCard(item)">
            {{ item.name }}
          </li>
        </mt-index-section>
      </mt-index-list>
    </div>
  </div>
</template>

<script>
import { IndexList, IndexSection } from 'mint-ui'
import 'mint-ui/lib/index-list/style.css'
import 'mint-ui/lib/index-section/style.css'
export default {
  name: 'SelectCard',
  components: {
    [IndexList.name]: IndexList,
    [IndexSection.name]: IndexSection
  },
  /* data必须是函数*/
  data: function() {
    return {
      bankListArr: {}, // 银行卡列表
      bankHotListArr: {}, // 银行卡热门列表
      searchValue: '', // 搜索内容
      resultsList: ''
    }
  },
  computed: {
    bankList() {
      return this.$store.state.bankList
    }
  },
  watch: {
    searchValue(value, oldValue) {
      const searchKeyword = String(value).toUpperCase()
      const regularSearchResults = []
      this.resultsList.forEach(item => {
        if (String(item.name).indexOf(searchKeyword) !== -1 || String(item.first_pinyin_letter).indexOf(searchKeyword) !== -1) {
          regularSearchResults.push(item)
        }
      })
      /* 处理数据，按照首字母进行排序 */
      this.bankListArr = regularSearchResults.reduce((a, x) => {
        if (!a[x.first_pinyin_letter[0]]) a[x.first_pinyin_letter[0]] = [] // 判断是否包含元素的第一个字母，如果没有就创建
        a[x.first_pinyin_letter[0]].push(x) // 将开头一致的字符串放在同一个数组中
        return a
      }, {})
      this.bankListArr = this.objKeySort(this.bankListArr)
    }
  },
  created() {
    this.getBankListFun()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '选择银行卡'
    },
    /* 获取银行列表*/
    getBankListFun() {
      const that = this
      that.$api.card.getBankList()
        .then(res => {
          that.resultsList = res.data.data.bank_list
          that.bankHotListArr = res.data.data.hot_bank_list
          /* 处理数据，按照首字母进行排序 */
          console.log(that.resultsList)
          that.bankListArr = that.resultsList.reduce((a, x) => {
            console.log(a)
            console.log(x)
            if (!a[x.first_pinyin_letter[0]]) a[x.first_pinyin_letter[0]] = [] // 判断是否包含元素的第一个字母，如果没有就创建
            a[x.first_pinyin_letter[0]].push(x) // 将开头一致的字符串放在同一个数组中
            return a
          }, {})
          that.bankListArr = that.objKeySort(that.bankListArr)
        })
    },
    /* 对象排序 */
    objKeySort(obj) { // 排序的函数
      console.log(obj)
      var newkey = Object.keys(obj).sort()
      console.log(newkey)
      // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
      var newObj = {}// 创建一个新的对象，用于存放排好序的键值对
      for (var i = 0; i < newkey.length; i++) { // 遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]]// 向新创建的对象中按照排好的顺序依次增加键值对
      }
      return newObj// 返回排好序的新对象
    },
    /* 点击城市 */
    clickCard(value) {
      this.$emit('selectCard', value)
    }
  }
}
</script>

<style lang="less" scoped>
.mint-indexlist .mint-indexlist-content{
  height: unset !important;
}
.search_title {
  line-height: 78px;
  text-align: center;
}

.search_warp {
  position: relative;
  padding: 0 20px;
  margin: 13px auto;
  line-height: 62px;
}

.search_input {
  width: 622px;
  padding: 0 30px 0 58px;
  font-size: 28px;
  color: #999999;
  border: 0.01rem solid rgba(204, 204, 204, 1);
  background: transparent;
  border-radius: 31px;
}

.icon_search {
  display: inline-block;
  position: absolute;
  left: 5%;
  top: 50%;
  margin-top: -13px;
  width: 24px;
  height: 26px;
  background: url("../../static/img/ic_search.png") no-repeat;
  background-size: 24px 26px;
}

.search_content {
  height: 624px;
  margin-bottom: 20px;
  overflow-y: scroll;
}
.line{
  background: #EEEEEE;
  /*height: 40px;*/
  padding: 0.02rem 0.1rem;
}
.search_item {
  padding: 0 50px;
  font-size: 28px;
  line-height: 86px;
  color: #333333;
}

.hot_list{
  /* display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 20px; */
}

.hot_list .search_item {
  /* width: 164px;
  height: 164px;
  background: rgba(255, 255, 255, 1);
  border: 2px solid rgba(238, 238, 238, 1);
  text-align: center;
  padding: 0; */
}

.hot_list .search_item .img {
  /* margin: 22px 0 8px;
  width: 90px;
  height: 90px; */
}

.hot_list .box:last-child .search_item .text{
  border-bottom: none;
}
.hot_list .search_item .text{
  /* line-height: 24px;
  font-size: 24px;
  color: #666666; */
  height: 86px;
  line-height: 86px;
  border-bottom: 0.01rem solid #EEEEEE;
}

.search_item:after {
  display: block;
  width: 100%;
  border-bottom: 0.01rem solid #e5e5e5;
  content: '';
}

.search_content .search_item:last-child:after {
  display: none;
}

/* listIndex start */

.listIndex_nav {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: 0;
  text-align: center;
  max-height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.listIndex_navList {
  padding: 0;
  margin: 0;
  list-style: none;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

/* listIndex end */
</style>
