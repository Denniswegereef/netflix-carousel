<template>
  <main class="layout">
    <Preloader />
    <Header />
    <nuxt />
    <SoundButton />
  </main>
</template>

<script>
import Header from '~/components/header.vue'
import Preloader from '~/components/preloader.vue'
import SoundButton from '~/components/buttons/sound.vue'

export default {
  components: {
    Header,
    Preloader,
    SoundButton
  }
}
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  background: $color-background;
}
</style>
