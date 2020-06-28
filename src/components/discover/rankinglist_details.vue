// 排行榜点击进来详情
<template>
  <div class="rankinglist-detail">
    <goBack :showGoBack='showGoBack'/>
    <div style="height: 36px"></div>
    <!-- <div class="describe">
      <img :src="playlist.coverImgUrl" alt="" width="100%" height="300px">
      <p class="description">{{playlist.description}}</p>
    </div> -->
    <div class="songlist">
      <div class="single" v-for='(item, i) in tracks' :key="item.id" :data-songId='item.id'>
        <!-- <img :src="item.al.picUrl" alt="" width="40px" height="40px"> -->
        <div :style="{color: i <= 2 ? 'red' : '#a39f9f'}">{{i + 1}}</div>
        <div class="info">
          <div class="name">{{item.name}}</div>
          <div class="singer" v-if="item.ar.length === 1"><span>{{item.ar[0].name}}</span> - {{item.al.name}}</div>
          <div class="singer" v-else><span v-for="singer in item.ar" :key="singer.id">{{singer.name}} </span> - {{item.al.name}}</div>
        </div>
        <div class="play"><i class="fa fa-play-circle-o"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
import goBack from '@components/public/goBack.vue'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        show: 1,
        path: 'discover/rankinglist',
        style: { position: 'fixed', padding: '0 5%' }
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
    const _this = this
    window.onscroll = function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 40) {
        _this.showGoBack.style = {
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
        _this.showGoBack.style = {
          position: 'fixed',
          padding: '0 5%'
        }
      }
    }
  },
  watch: {

  },
  methods: {
    getPlayList () {
      this.showGoBack.title = sessionStorage.getItem('rankingType')
      const selectedIndex = sessionStorage.getItem('rankingListIndex')
      this.$axios.get(`/top/list?idx=${selectedIndex}`).then(res => {
        if (res.code === 200) {
          this.playlist = res.playlist
          this.tracks = res.playlist.tracks
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
.rankinglist-detail{
  padding: 5% 0 0 0;
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
.songlist{
  padding: 0 5%;
  .single{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    box-shadow: 3px 5px 7px rgba(0,0,0,.2);
    padding: 10px;
    box-sizing: border-box;
    background-color: #E6E6FA;
    border-radius: 4px;
    color: rgb(12, 12, 12);
    .info{
      width: 80%;
      .name{
        font-weight: 600;
        font-size: 14px;
      }
      .singer{
        font-size: 11px;
        margin-top: 8px;
        color: #a39f9f;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .play{
      width: 4%;
    }
  }
}
</style>
