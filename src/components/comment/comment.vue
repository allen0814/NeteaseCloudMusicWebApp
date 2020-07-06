// 评论
<template>
  <transition name="slide-down">
    <div class="comment-container" v-show="showCommentPanel.show">
      <div class="title"><p>评论（{{showCommentPanel.total}}）</p> <span @click="showCommentPanel.show = false"><i class="fa fa-angle-down"></i></span></div>
      <p style="font-weight:bold;margin:20px 0 10px 0">评论区</p>
      <div class="roll" ref="roll">
        <div class="comment-panel" v-for="comment in showCommentPanel.comments" :key="comment.time">
          <div class="avatar"><img :src="comment.user.avatarUrl" alt="" width="40"></div>
          <div class="content">
          <div class="content-top">
            <div class="userInfo">
              <div class="name">{{comment.user.nickname}} <span v-if="comment.user.vipType !== 0">VIP</span></div>
              <div class="like">{{comment.likedCount}}
                <i class="fa fa-thumbs-o-up" v-if="!comment.liked"></i> <!-- 没赞过 -->
                <i class="fa fa-thumbs-up" v-else></i> <!-- 赞过 -->
                </div>
            </div>
            <div class="time">{{formatTime(comment.time)}}</div>
            </div>
              <p class="comment-words">{{comment.content}}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    showCommentPanel: Object
  },
  data () {
    return {
      total: 0,
      comments: []
    }
  },
  computed: {

  },
  created () {
    // this.$axios.get('/comment/music?id=1351219081&limit=1').then(res => {
    //   this.total = res.total
    //   this.comments = res.hotComments
    // })
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.roll)
  },
  watch: {

  },
  methods: {
    formatTime (time) {
      var date = new Date(time)
      var YY = date.getFullYear() + '年'
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
      var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日'
      // var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      // var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      // var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return YY + MM + DD
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.comment-container{
  padding: 5%;
  height: 80%;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #fff;
  border-radius: 25px 25px 0 0;
  overflow: auto;
}
.comment-panel{
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding-top: 10px;
}
.avatar img{
  border-radius: 50%;
}
.title{
  display: flex;
  align-items: center;
  justify-content: space-between;
  span{
    display: inline-block;
    color: #a39f9f;
  }
}
.roll{
  overflow: hidden;
}
.content{
  width: calc(100% - 50px);
  box-sizing: border-box;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #ddd;
  &-top{
    height: 42px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .userInfo{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #a39f9f;
      span{
        color: #fff;
        background-color: #000;
        font-size: 12px;
        display: inline-block;
        padding: 2px;
        border-radius: 4px;
      }
      .like{
        font-size: 12px;
      }
    }
    .time{
      font-size: 12px;
      color: #ccc;
    }
  }
  .comment-words{
    line-height: 22px;
  }
}
.slide-down-leave-active {
  transform: translateY(100%);
  transition: all .5s ease-in-out;
}
</style>
