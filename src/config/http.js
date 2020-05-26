import axios from 'axios'
import { Message, Loading } from 'element-ui'

let loading

function startLoading () {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, .7)'
  })
}

function endLoading () {
  loading.close()
}

let needLoadingRequestCount = 0
export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '//www.xzw999.com:9527' : '//localhost:3000'

axios.defaults.timeout = 5000

axios.interceptors.request.use(config => {
  // add cookie

  showFullScreenLoading()
  return config
}, err => {
  console.log(err)
  Message.error(err.message)
  return Promise.reject(err)
})

axios.interceptors.response.use(res => {
  tryHideFullScreenLoading()
  return res.data
}, err => {
  Message.error(err.message)
  return Promise.reject(err)
})

export default axios
