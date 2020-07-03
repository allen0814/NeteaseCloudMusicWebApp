<template>
  <div class="mine-container">
    <div class="myMusic">
      <div class="likeMusic" @click="$router.push('/mine/like')">
        <div class="icon-like"><i class="fa fa-heart fa-2x"></i></div>
        <div class="like">我喜欢的音乐</div>
      </div>
      <div class="fmMusic">
        <div class="icon-fm"><i class="fa fa-chrome fa-2x"></i></div>
        <div class="fm">私人FM</div>
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

  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.myMusic{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.icon-like,
.icon-fm{
  text-align: center;
  margin-bottom: 10px;
  color: #C20C0C;
}
</style>
