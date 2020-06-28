// 播放页面
<template>
<div style="height: 100%">
  <div class="blur-container" :style="{ 'background-image': `url(${playingSong.blurPicUrl})` }">
  </div>
  <div class="play-container">
    <goBack :showGoBack='showGoBack'/>
    <div class="cd" v-show="show" @click="show = !show">
      <img :src="playingSong.blurPicUrl" width="60%">
    </div>
    <div class="lyrics" v-show="!show" @click="show = !show"></div>

    <!-- 下方控件 -->
    <div class="bottom">
      <div class="bottom-line1">
        <div class="like"><i class="fa fa-heart-o"></i></div>
        <div class="download"><i class="fa fa-download"></i></div>
        <div class="comment"><i class="fa fa-commenting-o"></i></div>
      </div>
      <div class="bottom-progress">
        <div class="curTime">03:33</div>
        <div class="progress"></div>
        <div class="allTime">04:14</div>
      </div>
      <div class="bottom-controls"></div>
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
        title: '',
        show: 1,
        path: 'discover/recommend',
        style: { padding: '5% 0 0 5%', color: '#fff' }
      },
      playingSong: {}, // 正在播放的歌曲信息
      show: true // 控制cd和lyrics的显示 默认显示cd
    }
  },
  computed: {

  },
  created () {
    this.playingSong = JSON.parse(localStorage.playingSong)
    this.showGoBack.title = `${this.playingSong.name} - ${this.playingSong.singer}`
  },
  mounted () {

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
  border-bottom: 1px solid #000;
  img{
    border-radius: 50%;
  }
}
.lyrics{
  height: 60%;
  background-color: blue;
}
.bottom{
  height: 30%;
  border-top: 1px solid #000;
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
      height: 1px;
      background-color: #fff;
      width: 70%;
    }
  }
}
</style>
