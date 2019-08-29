/* eslint-disable new-cap */
let Vue
class moduleCollection {
  constructor (options) {
    this.register([], options)
  }
  register (path, rawModule) { // [], {state,getters...}
    let newModule = {
      _raw: rawModule, // 当前对象
      _children: {},
      state: rawModule.state
    }
    if (path.length === 0) {
      this.root = newModule
    } else {
      let parent = path.slice(0, -1).reduce((root, current) => { // [a] [a,b]
        return root._children[current]
      }, this.root)
      parent._children[path[path.length - 1]] = newModule
    }
    if (rawModule.modules) {
      _forEach(rawModule.modules, (childName, module) => {
        this.register(path.concat(childName), module) // 如果有modules,循环递归放入children 第一次[a] 第二次[a,b]
      })
    }
  }
}

function installModule (store, rootState, path, rootModule) {
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((root, current) => {
      return root[current]
    }, rootState)
    Vue.set(parent, path[path.length - 1], rootModule.state)
  }
  if (rootModule._raw.getters) {
    _forEach(rootModule._raw.getters, (getterName, getterFn) => {
      Object.defineProperty(store.getters, getterName, {
        get: () => {
          return getterFn(rootModule.state)
        }
      })
    })
  }
  if (rootModule._raw.actions) {
    _forEach(rootModule._raw.actions, (actionName, actionFn) => {
      let entry = store.actions[actionName] || (store.actions[actionName] = [])
      entry.push(() => {
        actionFn.call(store, store)
      })
    })
  }
  if (rootModule._raw.mutations) {
    _forEach(rootModule._raw.mutations, (mutationName, mutationFn) => {
      let entry = store.mutations[mutationName] || (store.mutations[mutationName] = [])
      entry.push(() => {
        mutationFn.call(store, rootModule.state)
      })
    })
  }
  _forEach(rootModule._children, (childName, module) => {
    installModule(store, rootState, path.concat(childName), module)
  })
}

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
    this.modules = new moduleCollection(options) // 收集模块
    console.log(this.modules)
    installModule(this, state, [], this.modules.root)

    // getters
    // if (options.getters) {
    //   let getters = options.getters // {newCount: fn}
    //   _forEach(getters, (getterName, getterFn) => {
    //     Object.defineProperty(this.getters, getterName, {
    //       get: () => {
    //         return getterFn(state)
    //       }
    //     })
    //   })
    // }
    // mutations
    // let mutations = options.mutations
    // _forEach(mutations, (mutationName, mutationFn) => {
    //   this.mutations[mutationName] = () => {
    //     mutationFn.call(this, state)
    //   }
    // })
    // // action
    // let actions = options.actions
    // _forEach(actions, (actionName, actionFn) => {
    //   this.actions[actionName] = () => {
    //     actionFn.call(this, this) // 这里的this是store，dispatch会调用store中的commit
    //   }
    // })
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
    this.mutations[type].forEach(fn => fn())
  }
  dispatch (type) {
    this.actions[type].forEach(fn => fn())
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
