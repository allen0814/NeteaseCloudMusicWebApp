// 导入自己需要的组件
import { Message, Form } from 'element-ui'
const Element = {
  install: function (Vue) {
    Vue.use(Message)
    Vue.use(Form)
  }
}
export default Element
