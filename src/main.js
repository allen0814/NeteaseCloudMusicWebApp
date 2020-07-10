import Vue from 'vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { Button, Message, Form, FormItem, Input } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

import http from '@/config/http'

import './assets/style.scss'

Message({ duration: 1500 })

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.component(Message.name, Message)

Vue.prototype.$axios = http
Vue.prototype.$message = Message

console.log(`现在处于 ${process.env.NODE_ENV} 环境`)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
