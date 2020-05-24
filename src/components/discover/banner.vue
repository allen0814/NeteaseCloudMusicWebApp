<template>
  <div class="banner-container">
    <Swiper ref="mySwiper" :options='swiperOption' class="swiper-container">
       <!-- slides -->
      <swiper-slide class="swiper-item" v-for='banner in banners' :key='banner.bannerId'>
        <!-- <router-link> -->
          <img class='swiper-img' :src='banner.pic'/>
        <!-- </router-link> -->
      </swiper-slide>
      <!-- 分页器 -->
      <div class="swiper-pagination" slot="pagination"></div>
    </Swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  props: {

  },
  data () {
    return {
      banners: {},
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets'
        },
        loop: true,
        autoplay: {
          delay: 3000
        },
        speed: 1000,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true // 修改swiper的父元素时，自动初始化swiper
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  created () {

  },
  mounted () {
    sessionStorage.banner ? this.banners = JSON.parse(sessionStorage.banner) : this.getBanner()
    this.swiper.slideTo(1, 2000, false)
  },
  watch: {

  },
  methods: {
    getBanner () {
      this.$axios.get('/banner?type=1').then(res => {
        if (res.code === 200) {
          sessionStorage.banner = JSON.stringify(res.banners)
        }
      })
    }
  },
  components: {
    Swiper,
    SwiperSlide
  }
}
</script>

<style scoped lang="scss">
.swiper-container,
.swiper-img{
  width: 100%;
  height: 150px;
}
</style>

<style lang="scss">
.swiper-container{
  --swiper-theme-color: #ff6600;
}
</style>
