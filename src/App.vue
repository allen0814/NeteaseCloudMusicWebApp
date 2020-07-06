<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created () {
    this.getLikeList()
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
