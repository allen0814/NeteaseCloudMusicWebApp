// 播放页面
<template>
<div style="height: 100%">
  <div class="blur-container" :style="{ 'background-image': `url(${playingSong.blurPicUrl})` }">
  </div>
  <div class="play-container">
    <goBack :showGoBack='showGoBack'/>
    <div class="cd" v-show="show" @click="show = !show" ref="cd">
      <img :src="playingSong.blurPicUrl" width="60%">
    </div>
    <div class="lyrics" v-show="!show" @click="show = !show">
      <div class="volume">
        <i class="fa fa-volume-up"></i>
        <div class="volumeRange"><input type="range" min="0" max="100" value="100" step="1"></div>
      </div>
      <div class="lyrics-container">
        <ul ref="lyricUL">
          <li v-for="(item, i) in lyricsObjArr" :style="{color: lyricIndex === i ? 'skyblue' : '#ded9d9'}" :key="item.uid" :data-index='i' ref="lyric">{{item.lyric}}</li>
        </ul>
      </div>
    </div>

    <!-- 下方控件 -->
    <div class="bottom">
      <div class="bottom-line1">
        <div class="like" @click="toggleLikeMusic" v-show="!like"><i class="fa fa-heart-o"></i></div>
        <div class="like like-yes" @click="toggleLikeMusic(false)" v-show="like"><i class="fa fa-heart"></i></div>
        <div class="download" @click="download"><i class="fa fa-download"></i></div>
        <div class="comment" @click="showComment"><i class="fa fa-commenting-o"></i></div>
      </div>
      <div class="bottom-progress">
        <div class="curTime">{{curTime}}</div>
        <div class="progress" @click="clickProgress($event)" ref="progress">
          <div class="line" :style="{width: `${precent}`}"></div>
          <div class="dot" :style="{left: `${precent}`}" @touchstart='dotStart' @touchmove='dotMove' @touchend='dotEnd'></div>
        </div>
        <div class="allTime">{{allTime}}</div>
      </div>
      <div class="bottom-controls">
        <div class="prev" @click="prevSong"><i class="fa fa-step-backward"></i></div>
        <div class="pause" v-show="isPlaying" @click="pauseSong"><i class="fa fa-pause"></i></div>
        <div class="play" v-show="!isPlaying" @click="playSong"><i class="fa fa-play"></i></div>
        <div class="next" @click="nextSong"><i class="fa fa-step-forward"></i></div>
      </div>
    </div>

    <!-- autio标签 -->
    <audio @timeupdate="updateTime" @canplay="getDuration" @ended="ended" :src="musicUrl" id="audio" ref="audio"></audio>
    <comment :showCommentPanel='showCommentPanel'/>
  </div>
</div>
</template>

<script>
import goBack from '@components/public/goBack'
import comment from '@/components/comment/comment'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        title: '',
        show: 1,
        path: '',
        style: { padding: '5% 0 0 5%', color: '#fff' }
      },
      showCommentPanel: {
        show: false
      },
      playingSong: {}, // 正在播放的歌曲信息
      show: true, // 控制cd和lyrics的显示 默认显示cd
      isPlaying: false, // 播放和暂停状态
      musicUrl: '', // 音乐地址
      curTime: '00:00', // 当前播放时间，格式化之后的
      allTime: '00:00', // 当前音频总时长，格式化之后的
      duration: 0, // 音频总时长，单位秒
      currentTime: 0, // 音频当前播放时间， 单位秒
      precent: '0%', // 当前播放进度百分比
      touchInfo: {}, // 原点滑动时的位置信息
      lyrics: {}, // 歌词 中英文
      lyricsObjArr: [], // 处理之后的歌词 包含时间和歌词
      curMsTime: '', // 当前音频播放的时分毫秒
      like: false, // 是否喜欢当前歌曲 默认为不喜欢
      lyricIndex: '0' // 当前显示的歌词
    }
  },
  computed: {
    likeList () {
      return this.$store.state.likeList
    }
  },
  created () {
    this.playingSong = this.$store.state.songPlayList[JSON.parse(localStorage.curSongPlayIndex)]
    this.showGoBack.path = JSON.parse(localStorage.routeBeforePlay)
    this.loadMusic()
  },
  mounted () {
    this.autoPlaySong()
  },
  watch: {

  },
  methods: {
    getLyrics () { // 显示歌词
      // 请求歌词
      this.$axios.get(`/lyric?id=${this.playingSong.id}`).then(res => {
        if (res.code === 200) {
          if (res.nolyric) { // 当前歌曲没有歌词
            this.lyricsObjArr = ['[00:00.00] 当前歌曲没有歌词哦！']
          } else {
            const lyrics = {}
            lyrics.lyric = res.lrc.lyric
            lyrics.tlyric = res.tlyric.lyric
            this.lyrics = lyrics
            // 解析歌词
            this.analysisLyrics(this.lyrics)
          }
        }
      })
    },
    getMusicUrl () { // 获取音乐url
      this.$axios.get(`/song/url?id=${this.playingSong.id}`).then(res => {
        if (res.code === 200) {
          if (res.data[0].url === null) {
            this.$message.warning('没有当前歌曲资源，3s后将自动播放下一首歌曲')
            setTimeout(() => {
              this.nextSong()
            }, 3000)
            return
          }
          this.musicUrl = res.data[0].url
        }
      })
    },
    getLikeStatus () { // 获取当前歌曲的喜欢状态
      this.likeList.indexOf(this.playingSong.id) !== -1 ? this.like = true : this.like = false
    },
    getMusicComment (limit = 20) {
      this.$axios.get(`/comment/music?id=${this.playingSong.id}&limit=${limit}`).then(res => {
        if (res.code === 200) {
          this.showCommentPanel.total = res.total
          this.showCommentPanel.comments = res.hotComments.concat(res.comments)
          // this.showCommentPanel.comments.push()
        }
      })
    },
    loadMusic () { // 加载歌曲 - 名称 图片 播放地址
      this.showGoBack.title = `${this.playingSong.songName} - ${this.playingSong.singerName}`
      this.getMusicUrl()
      this.getLyrics()
      this.getLikeStatus()
      this.getMusicComment()
    },
    playSong () { // 手动点击播放歌曲
      const audio = this.$refs.audio
      this.isPlaying = !this.isPlaying
      audio.play()
      this.$refs.cd.classList.add('rotate')
      if (this.$refs.cd.classList.contains('rotatePause')) this.$refs.cd.classList.remove('rotatePause')
    },
    autoPlaySong () { // 自动播放歌曲
      const audio = this.$refs.audio
      audio.autoplay = true
      this.isPlaying = true
      this.$refs.cd.classList.add('rotate')
      if (this.$refs.cd.classList.contains('rotatePause')) this.$refs.cd.classList.remove('rotatePause')
      this.getLikeStatus()
      this.$refs.lyricUL.style.transform = 'translateY(0px)'
    },
    nextSong () { // 播放下一首歌曲
      localStorage.curSongPlayIndex++
      if (localStorage.curSongPlayIndex > this.$store.state.songPlayList.length) localStorage.curSongPlayIndex = 0
      this.playingSong = this.$store.state.songPlayList[JSON.parse(localStorage.curSongPlayIndex)]
      this.loadMusic()
      this.autoPlaySong()
      this.$refs.lyricUL.style.transform = 'translateY(0px)'
    },
    prevSong () { // 播放上一首歌曲
      localStorage.curSongPlayIndex--
      if (localStorage.curSongPlayIndex < 0) localStorage.curSongPlayIndex = this.$store.state.songPlayList.length - 1
      this.playingSong = this.$store.state.songPlayList[JSON.parse(localStorage.curSongPlayIndex)]
      this.loadMusic()
      this.autoPlaySong()
      this.$refs.lyricUL.style.transform = 'translateY(0px)'
    },
    pauseSong () { // 暂停歌曲
      this.isPlaying = !this.isPlaying
      this.$refs.audio.pause()
      this.$refs.cd.classList.add('rotatePause')
    },
    getDuration () { // canplay时获取音频总时长
      this.duration = this.$refs.audio.duration
      this.allTime = this.formatTime(this.$refs.audio.duration)
    },
    updateTime (e) { // timeupdate时获取当前播放时间
      const { currentTime } = e.target
      this.currentTime = currentTime
      this.curTime = this.formatTime(currentTime)
      this.curMsTime = (this.formatTime(currentTime, true))
      this.updateProgress(currentTime, this.duration)

      // 匹配歌词
      for (let i = 0; i < this.lyricsObjArr.length; i++) {
        if (this.currentTime > (parseInt(this.lyricsObjArr[i].time))) {
          const index = this.$refs.lyric[i].dataset.index
          if (i === parseInt(index)) {
            this.lyricIndex = i
            // this.$refs.lyric[i].style.color = 'skyblue'
            this.$refs.lyricUL.style.transform = `translateY(${170 - (30 * (i + 1))}px)`
          }
        }
      }
    },
    formatTime (time, toMS = false) {
      if (time === 0) {
        this.curTime = '00:00'
        return
      }
      const mins = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60)
      const sec = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60)
      const ms = time.toString().split('.')[1].slice(0, 2)
      return !toMS ? `${mins}:${sec}` : `${mins}:${sec}.${ms}`
    },
    ended () {
      this.$refs.cd.classList.remove('rotate')
      this.$refs.audio.currentTime = 0
      this.isPlaying = false
      if ((JSON.parse(localStorage.curSongPlayIndex) >= this.$store.state.songPlayList.length - 1) || this.$route.query.from === 'fm') {
        this.$router.push('/mine/personal_fm')
        return
      }
      this.nextSong()
      console.log('播放完毕')
    },
    updateProgress (currentTime, duration) { // 更新进度条
      const precent = `${((currentTime / duration) * 100).toFixed(5)}%`
      this.precent = precent
    },
    clickProgress (event) { // 点击进度条时 更新音频时间和进度条
      const e = event || window.event
      const position = e.clientX - e.currentTarget.offsetLeft // 当前点击的位置
      const progressWidth = this.$refs.progress.offsetWidth // 进度条总宽度
      this.$refs.audio.currentTime = ((position / progressWidth) * this.duration)
      this.updateProgress(((position / progressWidth) * this.duration), this.duration)
    },
    dotStart (e) {
      // 点击的初始位置
      this.touchInfo.startX = e.touches[0].pageX - 83
    },
    dotMove (e) {
      // 移动的距离
      let moveX = e.touches[0].pageX - 83
      // 进度条的宽度
      const progressWidth = this.$refs.progress.offsetWidth
      if (moveX >= progressWidth) moveX = progressWidth

      this.$refs.audio.currentTime = ((moveX / progressWidth) * this.duration)
      this.updateProgress(((moveX / progressWidth) * this.duration), this.duration)
    },
    dotEnd (e) {
      this.playSong()
      this.isPlaying = true
    },
    analysisLyrics (lyrics) { // 解析歌词
      const olyrics = lyrics.lyric
      this.lyricsObjArr = this.lyric2ObjArr(olyrics)
      // console.log(this.lyricsObjArr)
    },
    lyric2ObjArr (lyric) {
      const regNewLine = /\n/
      // const regTime = /\[.*\]/
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
      const lineArr = lyric.split(regNewLine) // 每行歌词的数组
      const lyricsObjArr = [] // 歌词对象数组 [{time: '', lyric: ''}]
      lineArr.forEach(item => {
        if (item === '') return
        const obj = {}
        const time = item.match(regTime)

        obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
        obj.time = time ? this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
        obj.uid = Math.random().toString().slice(-6)
        if (obj.lyric === '') {
          console.log('这一行没有歌词')
        } else {
          lyricsObjArr.push(obj)
        }
      })
      return lyricsObjArr
    },
    formatLyricTime (time) { // 格式化歌词的时间 转换成 sss:ms
      const regMin = /.*:/
      const regSec = /:.*\./
      const regMs = /\./

      const min = parseInt(time.match(regMin)[0].slice(0, 2))
      let sec = parseInt(time.match(regSec)[0].slice(1, 3))
      const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
      if (min !== 0) {
        sec += min * 60
      }
      return Number(sec + '.' + ms)
    },
    toggleLikeMusic (like = true) { // like为true表示默认点击喜欢音乐 传入false表示取消喜欢
      like ? this.like = true : this.like = false
      this.$axios.get(`/like?id=${this.playingSong.id}&like=${like}`).then(res => {
        if (res.code === 200) {
          like
            ? this.$message.success('已成功添加到喜欢的音乐')
            : this.$message.success('你抛弃了她！')
        } else {
          this.showLikeErrorMsg(like)
        }
      })
    },
    showLikeErrorMsg (likeStatus) {
      if (likeStatus) {
        this.like = false
        this.$message.error('不好意思，歌曲不喜欢你！')
      } else {
        this.like = true
        this.$message.error('不好意思，她舍不得离开你！')
      }
    },
    showComment () { // 显示评论组件
      this.showCommentPanel.show = !this.showCommentPanel.show
    },
    download () {
      const a = document.createElement('a')
      a.href = this.musicUrl
      a.download = `${this.playingSong.songName} - ${this.playingSong.singerName}`
      a.click()
    }
  },
  components: {
    goBack,
    comment
  },
  beforeRouteEnter (to, from, next) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    next()
  }
}
</script>

<style scoped lang="scss">
.blur-container{
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  z-index: 1;
  filter: blur(50px);
}
.play-container{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(0, 0, 0, .2);
}
.cd{
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    border-radius: 50%;
  }
}
.cd.rotate img{
  animation: rotateIMG 15s linear infinite;
}
.cd.rotatePause img{
 animation-play-state:paused;
  -webkit-animation-play-state:paused; /* Safari 和 Chrome */
}
.lyrics{
  height: 70%;
  box-sizing: border-box;
  padding: 0 5% 20% 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  .volume{
    display: flex;
    align-items: center;
    i{
      margin-right: 20px;
    }
    .volumeRange{
      width: 100%;
    }
  }
  &-container{
    height: 75%;
    font-size: 16px;
    overflow: hidden;
    ul{
      text-align: center;
      li{
        color: #ded9d9;
        line-height: 30px;
      }
      li.active{
        color: skyblue;
      }
    }
  }
}
.bottom{
  height: 20%;
  color: #fff;
  &-line1{
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .like-yes{
      i{
        color: #C20C0C;
      }
    }
  }
  &-progress{
    padding: 0 5%;
    margin: 5% 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .progress{
      height: 2px;
      background-color: #fff;
      width: 70%;
      position: relative;
      .line{
        position: absolute;
        left: 0;
        top: 0;
        height: 2px;
        background-color: skyblue;
        transition: width .1s;
      }
      .dot{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        position: absolute;
        top: -6px;
        background-color: #ccc;
        transition: left .1s;
      }
    }
  }
  &-controls{
    // padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 30px;
  }
}
</style>
