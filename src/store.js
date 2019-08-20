import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from './vuex.js'

Vue.use(Vuex) // 会调用install方法

export default new Vuex.Store({
  state: {
    count: 100
  },
  mutations: {

  },
  actions: {

  }
})
