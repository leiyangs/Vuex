<template>
  <div id="app">
    {{$store.state.count}}
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
