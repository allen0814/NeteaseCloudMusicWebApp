<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted () {
    // 让vuex的数据在刷新之后不消失
    window.addEventListener('unload', this.saveSearchList)
  },
  methods: {
    saveSearchList () {
      // sessionStorage.setItem('searchResult', JSON.stringify(this.$store.getters.searchResArr))
      // this.$store.dispatch('setSearchResult', this.$store.getters.searchResArr)
    }
  }
}
</script>

<style lang="scss">
$color-primary: #dd001b;

html body{
  width: 100%;
  height: 100vh;
}
#app{
  width: 100%;
  height: 100%;
}
</style>
