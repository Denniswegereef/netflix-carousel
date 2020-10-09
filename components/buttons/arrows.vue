<template>
  <section class="arrows">
    <div ref="arrow_up" class="arrows__single arrows__up" @click="_arrowUpHandler" />
    <div ref="arrow_down" class="arrows__single arrows__down" @click="_arrowDownHandler" />
  </section>
</template>

<script>
import { gsap } from 'gsap'

import data from '~/static/data/content.json'
import modulo from '~/helpers/modulo'

export default {
  data () {
    return {
      data,
      color: {
        grey: '#5a5a5a',
        red: '#b9090b'
      },
      timelines: {
        keyPress: [],
        intro: gsap.timeline({ paused: true, delay: 3.5 })
      }
    }
  },

  watch: {
    '$store.state.preloader.loaded': {
      handler () {
        this.timelines.intro.play()
      }
    }
  },

  mounted () {
    this._setupEventListeners()
    this._setUpTimelines()
  },

  methods: {
    _setupEventListeners () {
      this._keyPressHandler()
    },

    _setUpTimelines () {
      const items = [this.$refs.arrow_up, this.$refs.arrow_down]

      // Intro timeline
      const tlIntro = this.timelines.intro

      tlIntro.fromTo(items, { x: -10, opacity: 0 }, { x: 0, opacity: 0.4 }, 0.0)

      // Keypress timeline
      items.forEach((element, index) => {
        this.timelines.keyPress.push(gsap.timeline({ paused: true }))

        const tl = this.timelines.keyPress[index]
        const item = index === 0 ? this.$refs.arrow_up : this.$refs.arrow_down

        tl.to(item, { borderBottomColor: this.color.red, duration: 0.1 }, 0.0)
        tl.to(item, { scale: 1.1, opacity: 1.0, duration: 0.2 }, 0.05)
        tl.to(item, { borderBottomColor: this.color.grey, duration: 0.1 }, 0.2)
        tl.to(item, { scale: 1.0, opacity: 0.4, duration: 0.2 }, 0.25)
      })
    },

    _arrowUpHandler () {
      this.$store.commit('rotate/setIndex', modulo(this.$store.state.rotate.currentIndex + 1, this.data.content.length))
      this.timelines.keyPress[0].play(0)
    },

    _arrowDownHandler () {
      this.$store.commit('rotate/setIndex', modulo(this.$store.state.rotate.currentIndex - 1, this.data.content.length))
      this.timelines.keyPress[1].play(0)
    },

    // Handlers
    _keyPressHandler () {
      window.addEventListener('keydown', (e) => {
        if (e.keyCode === 38) this._arrowUpHandler()
        if (e.keyCode === 40) this._arrowDownHandler()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.arrows {
  position: absolute;
  left: 25vw;

  z-index: 3;
}

.arrows__single {
  width: 0;
  height: 0;

  border-left: rem(10px) solid transparent;
  border-right: rem(10px) solid transparent;

  border-bottom: rem(15px) solid $color-secondary;

  transition: border-bottom-color .3s;

  cursor: pointer;

  &:hover {
    border-bottom-color: $color-primary;
  }
}

.arrows__up {
  margin-bottom: rem(25px);
}

.arrows__down {
  transform: rotate(180deg);
}
</style>
