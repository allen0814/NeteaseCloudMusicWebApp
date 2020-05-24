<template>
<div class="home-container">
  <div class="home">
    <ul class="navBar" @click="navClick($event)" ref="navBar">
      <li><a href="javascript:;" @click="showSideBar"><i class="fa fa-bars"></i></a></li>
      <li><router-link :to="{name: 'mine'}">我的</router-link></li>
      <li class="active"><router-link :to="{name: 'discover'}">发现</router-link></li>
      <li><router-link :to="{name: 'home'}"><i class="fa fa-search"></i></router-link></li>
    </ul>
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
      console.log(this.$refs.navBar.children)
      this.$refs.navBar.children.forEach((item, i) => {
        item.addEventListener('click', () => {
          item.classList.add('active')
        })
      })
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
.navBar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

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
