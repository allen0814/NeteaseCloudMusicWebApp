// 我喜欢的音乐
<template>
  <div class="myLike-container">
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
        path: '/mine',
        title: '我喜欢的音乐'
      }
    }
  },
  computed: {
    likeList () {
      return this.$store.state.likeList
    }
  },
  created () {
    this.setSongPlayList()
  },
  mounted () {
    const options = {
      click: true,
      taps: true
    }
    this.scroll = new BScroll(this.$refs.roll, options)
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
  },
  watch: {

  },
  methods: {
    setSongPlayList () {
      const songListId = []
      const songPlayList = [] // 当前播放歌曲列表  存到vuex
      this.likeList.forEach(ele => {
        songListId.push(ele)
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
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  components: {
    goBack,
    songList
  },
  beforeRouteLeave (to, from, next) {
    localStorage.setItem('routeBeforePlay', JSON.stringify(from.path))
    next()
  }
}
</script>

<style scoped lang="scss">
.myLike-container{
  padding: 5%;
  height: 100%;
}
</style>
