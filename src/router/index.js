import Vue from 'vue'
import VueRouter from 'vue-router'

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/discover',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '/mine',
        name: 'mine',
        component: () => import('@components/mine/mine.vue')
      },
      {
        path: '/discover',
        name: 'discover',
        component: () => import('@components/discover/discover.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/Register.vue')
  },
  {
    path: '/search', // 搜索
    name: 'search',
    component: () => import('@components/search/search.vue')
  },
  {
    path: '/search/result', // 搜索 - 结果
    name: 'result',
    component: () => import('@/components/search/searchResult.vue')
  },
  {
    path: '/discover/rankinglist', // 发现 - 排行榜
    name: 'rankinglist',
    component: () => import('@components/discover/rankinglist.vue')
  },
  {
    path: '/discover/rankinglist/details', // 发现 - 排行榜 - 详情
    name: 'rankinglist_details',
    component: () => import('@components/discover/rankinglist_details.vue')
  },
  {
    path: '/discover/recommend', // 发现 - 每日推荐
    name: 'recommend',
    component: () => import('@components/recommend/recommend.vue')
  },
  {
    path: '/play', // 播放页面
    name: 'play',
    component: () => import('@components/play/play.vue')
  },
  {
    path: '/mine/like', // 我的 - 我喜欢的音乐
    name: 'like',
    component: () => import('@components/mine/likeList.vue')
  },
  {
    path: '/mine/personal_fm', // 我的 - 私人FM
    name: 'personal_fm',
    component: () => import('@components/mine/personal_fm.vue')
  }
]

const router = new VueRouter({
  routes,
  base: '/music/',
  linkExactActiveClass: 'nav-active'
})

export default router
