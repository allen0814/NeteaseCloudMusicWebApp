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
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
