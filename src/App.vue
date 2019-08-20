<template>
  <div id="app">
    {{$store.state.count}}
    {{$store.getters.newCount}}
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  mounted() {
    console.log(this.$store)
  }
}
</script>

<style>

</style>
