import Vue from 'vue'
import VueRouter from 'vue-router'

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
  }
]

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'nav-active'
})

export default router
