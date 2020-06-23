<template>
  <div class="sideBar-container" ref="sideBar" @click="closeSideBar($event)"
    @touchstart='touchstart'
    @touchmove='touchmove'>
    <div class="main-container">
      用户信息
      <div class="login-out">
        <button @click="loginOut">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    showSideBar () {
      this.$refs.sideBar.classList.add('show')
    },
    hideSideBar () {
      this.$refs.sideBar.classList.remove('show')
    },
    closeSideBar (e) {
      if (e.target.className === 'sideBar-container show') {
        this.hideSideBar()
      }
    },
    loginOut () {
      this.$axios.get('/logout').then(res => {
        if (res.code === 200) {
          localStorage.removeItem('uid')
          localStorage.removeItem('NetEaseCookie')
          this.$message.success('已退出')
          this.hideSideBar()
        }
      })
    },
    touchstart (e) {
      // e.preventDefault()
      console.log(`start: ${e.touches[0].clientX}, ${e.touches[0].clientY}`)
      this.startX = e.touches[0].clientX
      this.startY = e.touches[0].clientY
    },
    touchmove (e) {
      // e.preventDefault()
      this.moveX = e.touches[0].clientX
      this.moveY = e.touches[0].clientY
      this.startX - this.moveX <= 0 ? console.log('你在往右滑') : console.log('你在往左滑')
      if ((this.startX - this.moveX) >= 100) this.hideSideBar()
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.sideBar-container{
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0, .5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  transition: all .3s;
  transform: translateX(-100%);
}
.sideBar-container.show{
  transform: translateX(0);
}
.main-container{
  width: 80%;
  height: 100%;
  background-color: #f9f9f9;
}
</style>
