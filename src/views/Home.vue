<template>
<div class="home-container">
  <div class="home">
    <div class="top">
      <div><span @click="showSideBar"><i class="fa fa-bars"></i></span></div>
      <ul class="navBar" @click="navClick($event)" ref="navBar">
        <li><router-link :to="{name: 'mine'}">我的</router-link></li>
        <li class="active"><router-link :to="{name: 'discover'}">发现</router-link></li>
      </ul>
      <div><router-link :to="{name: 'search'}"><i class="fa fa-search"></i></router-link></div>
    </div>
    <router-view/>
  </div>

  <!-- sideBar组件 -->
  <sideBar ref="bar"/>
  </div>
</template>

<script>
// @ is an alias to /src
import sideBar from '@components/sideBar/sideBar'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  methods: {
    showSideBar () { // sideBar组件的显示
      this.$refs.bar.showSideBar()
    },
    navClick (e) {
      const evn = e || window.event
      const target = evn.target
      console.log(target)
      if (target.nodeName === 'A') {
        target.parentNode.classList.add('active')
      }
    }
  },
  mounted () {

  },
  components: {
    sideBar
  }
}
</script>

<style lang="scss" scoped>
.home-container{
  width: 100%;
  height: 100%;
}
.home{
  width: 100%;
  height: 100%;
  padding: 5% 5% 0 5%;
  box-sizing: border-box;
}
.top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.navBar{
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  li.active a{
    color: rgb(51, 49, 49);
    font-weight: 600;
    font-size: 16px;
  }

  a:link,
  a:visited{
    text-decoration: none;
    color: #a39f9f;
  }
  a:hover,
  a:active{
    color: #a39f9f;
  }
}
</style>
