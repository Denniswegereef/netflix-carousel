<template>
  <section v-if="!$store.state.preloader.loaded" class="preloader">
    <div>logo</div>
  </section>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$store.commit('preloader/toggleLoaded', true)
    }, 1000)
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
