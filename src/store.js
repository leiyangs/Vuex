import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from './vuex.js'

Vue.use(Vuex) // 会调用install方法

export default new Vuex.Store({
  state: {
    count: 100
  },
  getters: { // computed
    newCount (state) {
      return state.count + 100
    }
  },
  mutations: { // methods 同步跟新状态
    change (state) {
      state.count += 10
    }
  },
  actions: { // 异步跟新状态
    change ({ commit }) {
      setTimeout(() => {
        commit('change')
      }, 1000)
    }
  }
})
