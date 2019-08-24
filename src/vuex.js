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

    // getters
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
    // mutations
    let mutations = options.mutations
    _forEach(mutations, (mutationName, mutationFn) => {
      this.mutations[mutationName] = () => {
        mutationFn.call(this, state)
      }
    })
    // action
    let actions = options.actions
    _forEach(actions, (actionName, actionFn) => {
      this.actions[actionName] = () => {
        actionFn.call(this, this) // 这里的this是store，dispatch会调用store中的commit
      }
    })
    let { commit, dispatch } = this // 保存实例上的commit dispatch
    this.commit = (type) => {
      commit.call(this, type)
    }
    this.dispatch = (type) => {
      dispatch.call(this, type)
    }
  }
  get state () { // 类似 Object.defineProperty get
    return this._vm.state
  }
  // 防止解构时候this == undefined(let store = new Store(); let {commit, disoatch} = store;) 在上面定义两个方法并call设置this
  commit (type) {
    console.log(1)
    this.mutations[type]()
  }
  dispatch (type) {
    this.actions[type]()
  }
}

function _forEach (getters, callback) {
  Object.keys(getters).forEach(item => callback(item, getters[item]))
}

let install = (_Vue) => { // vue.use()会默认调用install方法 vue核心方法，并且会吧vue实例返回
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
