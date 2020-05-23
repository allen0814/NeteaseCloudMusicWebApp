import axios from 'axios'
import { Message } from 'element-ui'

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '//www.xzw999.com:9527' : '//localhost:3000'

axios.defaults.timeout = 5000

axios.interceptors.request.use(config => {
  // add cookie

  return config
}, err => {
  console.log(err)
  Message.error(err.message)
  return Promise.reject(err)
})

axios.interceptors.response.use(res => {
  return res.data
}, err => {
  Message.error(err.message)
  return Promise.reject(err)
})

export default axios
