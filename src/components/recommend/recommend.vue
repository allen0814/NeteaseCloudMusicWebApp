// 每日推荐歌曲
<template>
  <div class="recommend">
    <goBack :showGoBack='showGoBack'/>
    <div class="recommend-list">
      <div class="recommend-list-single" v-for="(item, i) in recommendList" :key="item.id" :data-songId='item.privilege.id' :data-index='i' @click="play($event)">
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
    async play (event) {
      const e = event || window.event
      const target = e.currentTarget
      const id = target.getAttribute('data-songId')
      const useable = await this.$axios.get(`/check/music?id=${id}`)
      if (useable.success) {
        this.$axios.get(`/song/url?id=${id}`).then(res => {
          if (res.code === 200) {
            console.log(res.data[0].url)
            this.$router.push({ path: '/play', query: { id } })

            // 获取到当前播放歌曲的详细信息 存储到vuex里面
            const index = target.getAttribute('data-index')
            const playingSongInfo = {}
            let names = ''
            if (this.recommendList[index].artists.length === 1) {
              playingSongInfo.singer = this.recommendList[index].artists[0].name
            } else {
              this.recommendList[index].artists.forEach(ele => { names += `${ele.name} ` })
              playingSongInfo.singer = names
            }
            playingSongInfo.id = this.recommendList[index].id
            playingSongInfo.blurPicUrl = this.recommendList[index].album.blurPicUrl
            playingSongInfo.name = this.recommendList[index].name

            localStorage.setItem('playingSong', JSON.stringify(playingSongInfo))
          }
        })
      } else {
        this.$message.error(`${useable.message}`)
      }
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
