let Vue
class Store {
  constructor (options) {
    let state = options.state
    this.getters = {}
    this.mutations = {}
    this.actions = {}
    // 实现双向绑定，借用Vue实例 数据变化刷新视图
    this._vm = new Vue({
      data: {
        state
      }
    })

    if (options.getters) {
      let getters = options.getters // {newCount: fn}
      _forEach(getters, (getterName, getterFn) => {
        Object.defineProperty(this.getters, getterName, {
          get: () => {
            return getterFn(state)
          }
        })
      })
    }
  }
  get state () { // 类似 Object.defineProperty get
    return this._vm.state
  }
}

function _forEach (getters, callback) {
  Object.keys(getters).forEach(item => callback(item, getters[item]))
}

let install = (_Vue) => {
  Vue = _Vue // 保留vue构造函数
  Vue.mixin({
    beforeCreate () { // 所有组件加载前增加$store
      // 判断是否为根组件
      if (this.$options && this.$options.store) { // 根组件
        this.$store = this.$options.store
      } else { // 子组件 深度优先，层层加载 parent -> sun
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

export default {
  Store,
  install
}
