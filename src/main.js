import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui'
import { Button, Message, Form, FormItem, Input } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import http from '@/config/http'

import './assets/style.scss'

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Message)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$axios = http

console.log(`现在处于 ${process.env.NODE_ENV} 环境`)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
