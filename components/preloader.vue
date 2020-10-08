<template>
  <section v-if="!$store.state.preloader.loaded" class="preloader" />
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$store.commit('preloader/toggleLoaded', true)
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.preloader {
  position: fixed;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  background: $color-background;

  z-index: 4;
}
</style>
