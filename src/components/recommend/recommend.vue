// 每日推荐歌曲
<template>
  <div class="recommend">
    <goBack :showGoBack='showGoBack'/>
    <div class="recommend-list">
      <div class="recommend-list-single" v-for="(item, i) in recommendList" :key="item.id" :data-songId='item.id' :data-index='i' @click="play($event)">
        <div class="img">
          <img :src="item.al.picUrl" alt="" width="50" height="50">
        </div>
        <div class="song-detail">
          <div class="name">{{item.name}}</div>
          <div class="singer" v-if="item.ar.length === 1">{{item.ar[0].name}} - {{ item.al.name}}</div>
          <div class="singer" v-else><span v-for="singer in item.ar" :key="singer.id">{{singer.name}} </span> - {{ item.al.name}}</div>
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
        this.recommendList = res.data.dailySongs
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
            if (this.recommendList[index].ar.length === 1) {
              playingSongInfo.singer = this.recommendList[index].ar[0].name
            } else {
              this.recommendList[index].ar.forEach(ele => { names += `${ele.name} ` })
              playingSongInfo.singer = names
            }
            playingSongInfo.id = this.recommendList[index].id
            playingSongInfo.blurPicUrl = this.recommendList[index].al.picUrl
            playingSongInfo.name = this.recommendList[index].name
            playingSongInfo.url = res.data[0].url

            if (res.data[0].url === null) {
              this.$message.error('无法获取当前歌曲的地址,页面将在3s后跳转！')
              setTimeout(() => {
                this.$router.push('/discover/recommend')
              }, 3000)
            }

            localStorage.setItem('playingSong', JSON.stringify(playingSongInfo))
          }
        })
      } else {
        this.$message.error(`${useable.message}`)
      }

      // 请求歌词
      this.$axios.get(`/lyric?id=${id}`).then(res => {
        if (res.code === 200) {
          const lyrics = {}
          lyrics.lyric = res.lrc.lyric
          lyrics.tlyric = res.tlyric.lyric
          localStorage.setItem('lyrics', JSON.stringify(lyrics))
        }
      })
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
