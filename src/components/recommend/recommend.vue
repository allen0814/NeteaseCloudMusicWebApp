// 每日推荐歌曲
<template>
  <div class="recommend">
    <goBack :showGoBack='showGoBack'/>
    <div class="recommend-list">
      <div class="recommend-list-single" v-for="item in recommendList" :key="item.id" :data-songId='item.privilege.id' @click="play($event)">
        <div class="img">
          <img :src="item.album.blurPicUrl" alt="" width="50" height="50">
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
        title: '每日推荐',
        show: 1,
        path: 'discover'
      },
      recommendList: []
    }
  },
  computed: {

  },
  created () {
    this.$axios.get('/recommend/songs').then(res => {
      if (res.code === 200) {
        this.recommendList = res.recommend
      }
    })
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    play (event) {
      const e = event || window.event
      const target = e.currentTarget
      console.log(target.getAttribute('data-songId'))
    }
  },
  components: {
    goBack
  }
}
</script>

<style scoped lang="scss">
.recommend{
  padding: 5%;
}
</style>
