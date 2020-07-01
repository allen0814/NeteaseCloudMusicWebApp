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
        <ul>
          <li v-for="item in lyricsObjArr" :key="item.uid">{{item.lyric}}</li>
        </ul>
      </div>
    </div>

    <!-- 下方控件 -->
    <div class="bottom">
      <div class="bottom-line1">
        <div class="like"><i class="fa fa-heart-o"></i></div>
        <div class="download"><i class="fa fa-download"></i></div>
        <div class="comment"><i class="fa fa-commenting-o"></i></div>
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
        <div class="prev"><i class="fa fa-step-backward"></i></div>
        <div class="pause" v-show="isPlaying" @click="pauseSong"><i class="fa fa-pause"></i></div>
        <div class="play" v-show="!isPlaying" @click="playSong"><i class="fa fa-play"></i></div>
        <div class="next"><i class="fa fa-step-forward"></i></div>
      </div>
    </div>

    <!-- autio标签 -->
    <audio @timeupdate="updateTime" @canplay="getDuration" @ended="ended" :src="musicUrl" id="audio" ref="audio"></audio>
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
        title: '',
        show: 1,
        path: '',
        style: { padding: '5% 0 0 5%', color: '#fff' }
      },
      playingSong: {}, // 正在播放的歌曲信息
      show: false, // 控制cd和lyrics的显示 默认显示cd
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
      curMsTime: '' // 当前音频播放的时分毫秒
    }
  },
  computed: {

  },
  created () {
    this.playingSong = JSON.parse(localStorage.playingSong)
    this.showGoBack.title = `${this.playingSong.name} - ${this.playingSong.singer}`
    this.showGoBack.path = JSON.parse(localStorage.routeBeforePlay)
    this.musicUrl = this.playingSong.url
    this.getLyrics()
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    getLyrics () { // 获取歌词
      this.lyrics = JSON.parse(localStorage.lyrics)
      // console.log(this.lyrics)
      this.analysisLyrics(this.lyrics)
    },
    playSong () { // 播放歌曲
      const audio = this.$refs.audio
      this.isPlaying = !this.isPlaying
      audio.play()
      this.$refs.cd.classList.add('rotate')
      if (this.$refs.cd.classList.contains('rotatePause')) this.$refs.cd.classList.remove('rotatePause')
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
    },
    formatTime (time, toMS = false) {
      if (time === 0) return
      const mins = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60)
      const sec = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60)
      const ms = time.toString().split('.')[1].slice(0, 2)
      return !toMS ? `${mins}:${sec}` : `${mins}:${sec}.${ms}`
    },
    ended () {
      this.$refs.cd.classList.remove('rotate')
      this.$refs.audio.currentTime = 0
      this.isPlaying = false
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
      const regTime = /\[.*\]/
      const lineArr = lyric.split(regNewLine) // 每行歌词的数组
      const lyricObjArr = [] // 歌词对象数组 [{time: '', lyric: ''}]
      lineArr.forEach(item => {
        if (item === '') return
        const obj = {}
        obj.time = item.match(regTime)[0].slice(1, item.match(regTime)[0].length - 1)
        obj.lyric = item.split(']')[1].trim()
        obj.uid = Math.random().toString().slice(-6)
        lyricObjArr.push(obj)
      })
      return lyricObjArr
    }
  },
  components: {
    goBack
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
  animation: rotateIMG 5s linear infinite;
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
