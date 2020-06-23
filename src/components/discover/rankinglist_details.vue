// 排行榜点击进来详情
<template>
  <div class="rankinglist-detail">
    <goBack :showGoBack='showGoBack'/>
    <div class="songlist">
      <div class="single" v-for='item in tracks' :key="item.id" :data-id='item.id'>
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
    box-shadow: 3px 5px 7px rgba(0,0,0,.2);
    padding: 10px;
    box-sizing: border-box;
    background-color: #E6E6FA;
    border-radius: 4px;
    color: rgb(12, 12, 12);
    .info{
      width: 90%;
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
