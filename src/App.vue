<template>
  <div id="app">
    {{$store.state.count}}
    {{$store.getters.newCount}}
    <button @click="change">点击</button>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  mounted() {
    console.log(this.$store.state)
  },
  methods: {
    change() {
      // this.$store.commit('change');  // 同步修改状态
      this.$store.dispatch('change') // 异步修改状态
    }
  },
}
</script>

<style>

</style>
