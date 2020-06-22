// 排行榜点击进来详情
<template>
  <div class="rankinglist-detail">
    <goBack :showGoBack='showGoBack'/>
    <div class="songlist">
      <div class="single" v-for='item in tracks' :key="item.id">
        <div class="info">
          <div class="name">{{item.name}}</div>
          <div class="singer"><span v-for="singer in item.ar" :key="singer.id">{{singer.name}}</span> - {{item.al.name}}</div>
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
        path: 'discover/rankinglist'
      },
      tracks: []
    }
  },
  computed: {

  },
  created () {
    this.getPlayList()
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    getPlayList () {
      this.showGoBack.title = sessionStorage.getItem('rankingType')
      const selectedIndex = sessionStorage.getItem('rankingListIndex')
      this.$axios.get(`/top/list?idx=${selectedIndex}`).then(res => {
        if (res.code === 200) {
          this.tracks = res.playlist.tracks
          console.log(this.tracks)
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
  padding: 5%;
  height: 100%;
}
.songlist{
  .single{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    box-shadow: 10px 10px 10px rgba(0,0,0,.3);
    padding: 10px;
    box-sizing: border-box;
    background-color: #BA5370;
    border-radius: 4px;
    .info{
      width: 50%;
      color: #fff;
      .name{
        font-weight: 600;
      }
      .singer{
        font-size: 12px;
        margin-top: 5px;
      }
    }
    .play{
      width: 4%;
      color: #d3d3d3;
    }
  }
}
</style>
