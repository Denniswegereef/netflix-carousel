<template>
  <header class="header">
    <div ref="logo" class="header__logo" v-html="rawNetflixLogo" />
  </header>
</template>

<script>
import { gsap } from 'gsap'
import rawNetflixLogo from '~/assets/netflix_logo.svg?raw'

export default {
  data () {
    return {
      rawNetflixLogo
    }
  },

  watch: {
    '$store.state.preloader.loaded': {
      handler () {
        this._startIntroAnimate()
      }
    }
  },

  methods: {
    _startIntroAnimate () {
      gsap.set(this.$refs.logo, { filter: 'grayscale(100%)', opacity: 0.0 })
      gsap.to(this.$refs.logo, { filter: 'grayscale(0%)', opacity: 1.0, duration: 1.3 })
    }
  }
}
</script>

<style lang="scss">
.header {
  position: absolute;
  left: 5vw;
  top: 5vw;

  z-index: 3;
}

.header svg {
  height: rem(90px);
}
</style>
