<template>
  <section ref="sound_container" class="sound" @click="_mouseClickHandler" @mouseover="_mouseOverHandler" @mouseleave="_mouseLeaveHandler">
    <span v-for="index in waveAmount" :key="index" ref="wave" class="sound__bars" />
  </section>
</template>

<script>
import { gsap } from 'gsap'
import randomRange from '~/helpers/randomRange'

export default {
  data () {
    return {
      waveAmount: 5,
      paused: false,
      values: [],
      tl: gsap.timeline({ paused: true })
    }
  },

  watch: {
    '$store.state.preloader.loaded': {
      handler () {
        this._startWaveAnimation()
        gsap.from(this.$refs.sound_container, { y: 10, opacity: 0 })
      }
    }
  },

  mounted () {
    this._generateRandomValues()
  },

  methods: {
    _startWaveAnimation () {
      const tl = this.tl
      tl.eventCallback('onComplete', this._waveAnimationCompleteHandler, [tl])
      this.$refs.wave.forEach((element, index) => tl.to(element, { scaleY: this.values[index], duration: 0.35, repeat: 1, yoyo: true }, 0.0))

      tl.play(0)
    },

    _generateRandomValues () {
      this.values = Array(this.$refs.wave.length).fill().map((item, index) => randomRange(2, 4 + index))
      this.tl.kill()
      this._startWaveAnimation()
    },

    _togglePausedState () {
      this.$store.commit('sound/toggleSound', {})
      this.paused = !this.paused
      this.paused ? this.tl.pause() : this.tl.play(0)
    },

    _waveAnimationCompleteHandler () {
      this._generateRandomValues()
    },

    _mouseClickHandler () {
      this._togglePausedState()
    },

    _mouseOverHandler () {
      gsap.to(this.$refs.wave, { opacity: 0.5, duration: 0.3 })
    },

    _mouseLeaveHandler () {
      gsap.to(this.$refs.wave, { opacity: 1.0, duration: 0.3 })
    }
  }
}
</script>

<style lang="scss" scoped>
.sound {
  position: absolute;
  left: 5vw;
  bottom: 5vw;

  display: flex;
  align-items: center;
  justify-content: space-around;

  height: rem(30px);
  width: rem(30px);

  z-index: 3;

  cursor: pointer;
}

.sound__bars {
  height: 2px;
  width: 5%;

  background: $color-primary;

  transform: scaleY(1);
}
</style>
