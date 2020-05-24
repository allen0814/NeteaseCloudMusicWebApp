<template>
  <div class="sideBar-container" ref="sideBar" @click="closeSideBar($event)">
    <div class="main-container">
      用户信息
    </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {

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
