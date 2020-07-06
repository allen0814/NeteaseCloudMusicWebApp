<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created () {
    sessionStorage.likeListID ? this.$store.dispatch('setLikeList', JSON.parse(sessionStorage.likeListID)) : this.getLikeList()
    if (!localStorage.uid) {
      this.$router.push('login')
    }
  },
  mounted () {
  },
  methods: {
    getLikeList () {
      this.$axios.get(`/likelist?uid=${JSON.parse(localStorage.uid)}`).then(res => {
        if (res.code === 200) {
          sessionStorage.setItem('likeListID', JSON.stringify(res.ids))
          this.$store.dispatch('setLikeList', res.ids)
        }
      })
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
