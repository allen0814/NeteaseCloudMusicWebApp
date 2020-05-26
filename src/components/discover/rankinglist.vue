// 排行榜
<template>
<keep-alive>
  <div class="rankinglist">
    <goBack :showGoBack='showGoBack'/>

    <!-- 官方榜 -->
    <h2>官方榜</h2>
    <div class="official">
      <div class="list-single" v-for="(item) in officiallist" :key="item.playCount" :data-name='item.name' @click.stop="toDetails($event)" ref="single">
        <div class="list-single-left">
          <img :src="item.coverImgUrl" :alt="item.name">
          <span>{{item.updateFrequency}}</span>
        </div>
        <div class="list-single-right">
          <div v-for="(track, index) in item.tracks" :key="index">{{index+1}}. {{track.first}} - {{track.second}}</div>
        </div>
      </div>
    </div>

    <!-- 其他榜单 -->
    <h2>其他榜单</h2>
    <div class="other">
      <div class="list-single" v-for="(item) in otherList" :key="item.playCount" :data-name='item.name' @click.stop="toDetails($event)" ref="single">
        <div class="list-single-left">
          <img :src="item.coverImgUrl" :alt="item.name">
          <span>{{item.updateFrequency}}</span>
        </div>
      </div>
    </div>
  </div>
</keep-alive>
</template>

<script>
import goBack from '@components/public/goBack.vue'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        title: '排行榜',
        show: 1,
        path: 'discover'
      },
      officiallist: [], // 官方榜
      otherList: []
    }
  },
  computed: {

  },
  created () {
    this.$axios.get('/toplist/detail').then(res => {
      if (res.code === 200) {
        res.list.forEach(item => {
          if (item.tracks.length !== 0) {
            this.officiallist.push(item)
          } else {
            this.otherList.push(item)
          }
        })
      }
    })
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    toDetails (e) {
      const evn = e || window.event
      const target = evn.target
      console.log(target.nodeName)
      if (target.nodeName === 'IMG' || target.nodeName === 'DIV') {
        this.$router.push({ name: 'rankinglist_details' })
      }
    }
  },
  components: {
    goBack
  }
}
</script>

<style scoped lang="scss">
.rankinglist{
  height: 100%;
  padding: 5%;
  h2{
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
  }
}
.official{
  height: auto;
}
.other{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.list-single{
  margin: 0 0 5% 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  &-left{
    width: 100px;
    position: relative;
    height: 100%;
    box-shadow: 2px 10px 10px rgba(0, 0, 0, .3) inset;
    img{
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    span{
      position: absolute;
      color: #fff;
      font-size: 12px;
      bottom: 10px;
      left: 10px;
    }
  }

  &-right{
    width: calc(100% - 120px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    div{
      height: 33%;
      color: #7c7979;
      font-size: 13px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
