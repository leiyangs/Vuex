let Vue
class Store {

}

let install = (_Vue) => {
  Vue = _Vue // 保留vue构造函数
  Vue.mixins({
    beforeCreate () {
      console.log('beforeCreate')
    }
  })
}

export default {
  Store,
  install
}
