<template>
  <main class="layout">
    <Preloader />
    <Header />
    <nuxt />
    <SoundButton />
    <Noise />
  </main>
</template>

<script>
import Header from '~/components/header.vue'
import Preloader from '~/components/preloader.vue'
import SoundButton from '~/components/buttons/sound.vue'
import Noise from '~/components/noise.vue'

export default {
  components: {
    Header,
    Preloader,
    Noise,
    SoundButton
  }
}
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
}
</style>
