<template>
  <section v-if="!$store.state.preloader.loaded" class="preloader">
    <a ref="button" href="#" class="button subheading preloader__button" @click="_goButtonHandler">Continue to the slider</a>
  </section>
</template>

<script>
import { gsap } from 'gsap'

export default {
  mounted () {
    gsap.fromTo(this.$refs.button, { opacity: 0.0, y: 10 }, { opacity: 0.8, y: 0, duration: 1.0, delay: 0.2 })
    setTimeout(() => this._finishLoadingHandler, 10000)
  },

  methods: {
    _goButtonHandler (e) {
      e.preventDefault()
      gsap.to(this.$refs.button, { opacity: 0.0, y: 10, duration: 0.5, onComplete: this._finishLoadingHandler })
    },

    _finishLoadingHandler () {
      this.$store.commit('preloader/toggleLoaded', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.preloader {
  position: fixed;
  left: 0;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  background: $color-background;

  z-index: 4;
}

.preloader__button {
  font-size: rem(18px);

  padding-bottom: rem(5px);

  color: $color-primary;
  opacity: 0.0;

  &:before {
    height: 1px;
  }
}
</style>
