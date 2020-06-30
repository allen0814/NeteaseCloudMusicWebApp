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
          <div class="dot" :style="{left: `${precent}`}"></div>
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
        path: 'discover/recommend',
        style: { padding: '5% 0 0 5%', color: '#fff' }
      },
      playingSong: {}, // 正在播放的歌曲信息
      show: true, // 控制cd和lyrics的显示 默认显示cd
      isPlaying: false, // 播放和暂停状态
      musicUrl: '', // 音乐地址
      curTime: '00:00', // 当前播放时间，格式化之后的
      allTime: '00:00', // 当前音频总时长，格式化之后的
      duration: 0, // 音频总时长，单位秒
      currentTime: 0, // 音频当前播放时间， 单位秒
      precent: '0%' // 当前播放进度百分比
    }
  },
  computed: {

  },
  created () {
    this.playingSong = JSON.parse(localStorage.playingSong)
    this.showGoBack.title = `${this.playingSong.name} - ${this.playingSong.singer}`
    this.musicUrl = this.playingSong.url
  },
  mounted () {

  },
  watch: {

  },
  methods: {
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
      this.updateProgress(currentTime, this.duration)
    },
    formatTime (time) {
      const mins = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60)
      const sec = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60)
      return `${mins}:${sec}`
    },
    ended () {
      this.$refs.cd.classList.remove('rotate')
      console.log('播放完毕')
    },
    updateProgress (currentTime, duration) { // 更新进度条
      const precent = `${((currentTime / duration) * 100).toFixed(0)}%`
      this.precent = precent
    },
    clickProgress (event) { // 点击进度条时 更新音频时间和进度条
      const e = event || window.event
      const position = e.clientX - e.currentTarget.offsetLeft// 当前点击的位置
      const progressWidth = this.$refs.progress.offsetWidth
      this.updateProgress(((position / progressWidth) * this.duration), this.duration)
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
  height: 60%;
  // background-color: skyblue;
  .volume{
    color: #fff;
    padding: 0 5%;
    display: flex;
    align-items: center;
    i{
      margin-right: 20px;
    }
    .volumeRange{
      width: 100%;
    }
  }
}
.bottom{
  height: 30%;
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
    padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 30px;
  }
}
</style>
