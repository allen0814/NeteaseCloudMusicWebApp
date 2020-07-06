// 排行榜点击进来详情
<template>
  <div class="rankinglist-detail">
    <goBack :showGoBack='showGoBack'/>
    <div class="xzw" style="height: calc(95% - 36px); overflow: hidden" ref="roll">
      <songList :songListData='$store.state.songPlayList'/>
    </div>
  </div>
</template>

<script>
import goBack from '@components/public/goBack.vue'
import songList from '@components/public/songList.vue'
import BScroll from 'better-scroll'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        show: 1,
        path: '/discover/rankinglist'
      },
      tracks: [],
      playlist: {} // 当前榜单所有数据
    }
  },
  computed: {

  },
  created () {
    this.getPlayList()
  },
  mounted () {
    // window.onscroll = () => {
    //   var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    //   if (scrollTop > 40) {
    //     this.showGoBack.style = {
    //       position: 'fixed',
    //       top: 0,
    //       color: '#fff',
    //       height: '36px',
    //       'line-height': '36px',
    //       'background-color': '#dd001b',
    //       transition: 'all 1s',
    //       padding: '0 5%'
    //     }
    //   } else {
    //     this.showGoBack.style = {
    //       position: 'fixed',
    //       padding: '0 5%'
    //     }
    //   }
    // }
    this.scroll = new BScroll(this.$refs.roll)
  },
  watch: {

  },
  methods: {
    getPlayList () {
      const id = this.$route.query.id
      this.showGoBack.title = this.$route.query.name
      this.$axios.get(`/top/list?id=${id}`).then(res => {
        if (res.code === 200) {
          this.playlist = res.playlist
          this.tracks = res.playlist.tracks

          const songListId = []
          const songPlayList = [] // 当前播放歌曲列表  存到vuex
          this.tracks.forEach(ele => {
            songListId.push(ele.id)
          })
          this.$axios.get(`/song/detail?ids=${songListId.join(',')}`).then(res => {
            if (res.code === 200) {
              for (let i = 0; i < res.songs.length; i++) {
                const obj = {}
                let names = ''
                obj.id = res.songs[i].id
                obj.alName = res.songs[i].al.name
                if (res.songs[i].ar.length === 1) {
                  obj.singerName = res.songs[i].ar[0].name
                } else {
                  res.songs[i].ar.forEach(ele => { names += `${ele.name}/` })
                  obj.singerName = names.slice(0, names.length - 1)
                }
                obj.songName = res.songs[i].name
                obj.blurPicUrl = res.songs[i].al.picUrl
                songPlayList.push(obj)
              }
              this.$store.dispatch('setSongPlayList', songPlayList)
            }
          })
        }
      })
    },
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

            const index = target.getAttribute('data-index')
            localStorage.setItem('curSongPlayIndex', index)
          }
        })
      } else {
        this.$message.error(`${useable.message}`)
      }
    }
  },
  components: {
    goBack,
    songList
  },
  beforeRouteLeave (to, from, next) {
    localStorage.setItem('routeBeforePlay', JSON.stringify(`${from.path}?id=${from.query.id}&name=${from.query.name}`))
    next()
  }
}
</script>

<style scoped lang="scss">
.rankinglist-detail{
  padding: 5%;
  height: 100%;
}
.describe{
  width: 100%;
  height: 300px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  .description{
    position: absolute;
    bottom: 70px;
    left: 5%;
    color: #fff;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
