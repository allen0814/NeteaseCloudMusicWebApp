<template>
  <div class="search-container">
    <goBack :showGoBack='showGoBack'/>
    <div class="search-panel">
      <input type="text" v-model="text"  :placeholder="showKeyword" @keyup.enter="search">
      <span @click="search"><i class="fa fa-search"></i></span>
    </div>
    <!-- 搜索历史记录 -->
    <div class="history">
      <div class="history-top">
        <div>历史记录</div>
        <div @click="clearHistory"><i class="fa fa-trash-o"></i></div>
      </div>
      <div class="history-bottom">
        <span class="tag" v-for="(item, i) in searchHistory" :key="i">{{item}}</span>
      </div>
    </div>
    <!-- 热搜榜 -->
    <div style="font-size: 12px; font-weight: 700; margin: 10px 0 0 0">热搜榜</div>
    <div class="search-hot">
      <div class="search-hot-single"
      v-for="(item, i) in hotList" :key="item.score"
      :data-searchWord='item.searchWord'
      @click="quickSearch($event)">
        <div class="order" :style="{ color: (i + 1) <= 3 ? 'red' : '#a39f9f'}">{{i + 1}}</div>
        <div class="content">
          <div class="name">{{item.searchWord}} <span><img :src="item.iconUrl" width="26px"></span></div>
          <div class="des">{{item.content}}</div>
        </div>
        <div class="score">{{item.score}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import goBack from '@components/public/goBack'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        path: 'discover',
        show: 0
      },
      searchHistory: [], // 搜索历史记录
      text: '',
      showKeyword: '', // 输入框默认显示内容
      realkeyword: '', // 实际搜索的内容
      hotList: []
    }
  },
  computed: {

  },
  created () {
    sessionStorage.searchHotList ? this.hotList = JSON.parse(sessionStorage.searchHotList) : this.getHotList()
    this.getSearchDefault()
    localStorage.searchHistory ? this.searchHistory = JSON.parse(localStorage.searchHistory) : this.searchHistory = []
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    getHotList () {
      this.$axios.get('/search/hot/detail').then(res => {
        this.hotList = res.data
        sessionStorage.setItem('searchHotList', JSON.stringify(this.hotList))
      })
    },
    getSearchDefault () {
      this.$axios.get('/search/default').then(res => {
        if (res.code === 200) {
          this.showKeyword = res.data.showKeyword
          this.realkeyword = res.data.realkeyword
        }
      })
    },
    quickSearch (event) { // 热搜榜点击可以快捷搜索
      const e = event || window.event
      const target = e.currentTarget
      console.log(target.getAttribute('data-searchWord'))
    },
    search () {
      if (this.text === '') {
        this.text = this.realkeyword
      }
      // 调用搜索接口
      this.searchHistory.push(this.text)
      this.searchHistory = Array.from(new Set(this.searchHistory))
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
    },
    clearHistory () {
      localStorage.removeItem('searchHistory')
      document.querySelector('.history-bottom').innerHTML = ''
      this.text = ''
    }
  },
  components: {
    goBack
  }
}
</script>

<style scoped lang="scss">
.search-container{
  padding: 5%;
}
.search-panel{
  width: 80%;
  padding: 0 5% 0 0;
  position: absolute;
  top: 3%;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.history{
  width: 100%;
  &-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    i{
      color: #dedede;
      font-size: 14px;
    }
  }
  &-bottom{
    padding: 20px 0 0 0;
    display: flex;
    flex-wrap: wrap;
    .tag{
      padding: 6px 12px;
      border-radius: 14px;
      background-color: #d5d5d5;
      font-size: 12px;
      margin: 0 5px 5px 0;
    }
  }
}
.search-hot{
  margin-top: 10px;
  &-single{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 15px;
    .content{
      width: 60%;
    }
    .name{
      font-weight: 700;
      img{
        max-height: 14px;
      }
    }
    .des{
      margin-top: 10px;
      font-size: 11px;
      color: #a39f9f
    }
    .score{
      color: #a39f9f;
    }
  }
}
</style>
