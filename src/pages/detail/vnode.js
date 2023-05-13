//import { h } from 'vue'
//h函数本质上是 createElement() 的简写，它的作用是根据配置创建对应的虚拟节点。
//在 Vue 2 的渲染函数中，render 函数会自动接收 h 函数作为参数,因此不需要另外import
export default {
  data() {
    return {
      msg: 'CSS函数attr()创建的纯CSS提示工具'
    }
  },
  render(h) {
    return h('h3', this.msg)
  }
}

