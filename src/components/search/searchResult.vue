// 搜索结果
<template>
  <div class="res-container">
    <goBack :showGoBack='showGoBack'/>
    <div style="height: 36px"></div>
    <div class="recommend-list">
      <div class="recommend-list-single" v-for="item in resultList" :key="item.id" :data-songId='item.id'>
        <div class="img">
          <img :src="'//www.gravatar.com/avatar/76e86f82f88aab2c19971828bc25d4d3?s=200&r=pg&d=mm'" alt="" width="50" height="50">
        </div>
        <div class="song-detail">
          <div class="name">{{item.name}}</div>
          <div class="singer" v-if="item.artists.length === 1">{{item.artists[0].name}} - {{ item.album.name}}</div>
          <div class="singer" v-else><span v-for="singer in item.artists" :key="singer.id">{{singer.name}} </span> - {{ item.album.name}}</div>
        </div>
        <div class="play"><i class="fa fa-play-circle-o"></i></div>
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
        path: 'search',
        show: 1,
        style: { position: 'fixed', padding: '0 5%' }
      },
      resultList: []
    }
  },
  computed: {

  },
  created () {
    this.showGoBack.title = `来自搜索：${sessionStorage.searchKeyword}`
    this.resultList = sessionStorage.searchResult ? JSON.parse(sessionStorage.searchResult) : this.$store.getters.searchResArr
  },
  mounted () {
    window.onscroll = () => {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 40) {
        this.showGoBack.style = {
          position: 'fixed',
          top: 0,
          color: '#fff',
          height: '36px',
          'line-height': '36px',
          'background-color': '#dd001b',
          transition: 'all 1s',
          padding: '0 5%'
        }
      } else {
        this.showGoBack.style = {
          position: 'fixed',
          padding: '0 5%'
        }
      }
    }
  },
  watch: {

  },
  methods: {

  },
  components: {
    goBack
  }
}
</script>

<style scoped lang="scss">
.res-container{
  padding: 5% 0 0 0;
  height: 100%;
}
.recommend-list{
  padding: 0 5%;
}
</style>
