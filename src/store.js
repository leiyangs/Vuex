import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from './vuex.js'

Vue.use(Vuex) // 会调用install方法

export default new Vuex.Store({
  modules: { // 给状态划分模块
    a: {
      state: {
        count: 2000
      },
      modules: {
        b: {
          state: {
            count: 3000
          }
        }
      }
    }
  },
  state: {
    count: 100
  },
  getters: { // computed
    newCount (state) {
      return state.count + 100
    }
  },
  mutations: { // methods 同步更新状态
    change (state) {
      state.count += 10
    }
  },
  actions: { // 异步更新状态
    change ({ commit }) {
      setTimeout(() => {
        commit('change')
      }, 1000)
    }
  }
})

// class mtd { // ES7箭头函数
//   a = () => {
//     let a = 1
//     return a
//   }
// }
