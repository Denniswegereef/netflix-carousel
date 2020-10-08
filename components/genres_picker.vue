<template>
  <section class="genres-picker">
    <ul>
      <li v-for="(item, index) in data.genres" :key="index" ref="item" class="genres-picker__item">
        <span class="subheading genres-picker__name" @hover="_nameHoverHandler">
          {{ item.name }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { gsap } from 'gsap'

import data from '~/static/data/genres.json'

export default {
  data () {
    return {
      data,
      timelines: {
        intro: gsap.timeline({ paused: true, delay: 0.3 })
      }
    }
  },

  mounted () {
    this._setUpTimelines()

    this.timelines.intro.play()
  },

  methods: {
    _setUpTimelines () {
      const tlIntro = this.timelines.intro
      const arrayShifted = this.$refs.item.slice(1)

      tlIntro.fromTo(this.$refs.item, { opacity: 0.0, x: -30 }, { opacity: 1.0, stagger: 0.15, x: 0 }, 0.5)
      tlIntro.to(this.$refs.item[0], { x: 15, duration: 0.8 }, 2.1)
      tlIntro.to(arrayShifted, { opacity: 0.4, duration: 0.4 }, 2.3)
    },

    _nameHoverHandler (el) {
      console.log(el)
    }
  }
}
</script>

<style lang="scss" scoped>
.genres-picker {
  margin-left: 5vw;

  overflow: hidden;
}

.genres-picker__item {
  padding-bottom: rem(15px);
  padding-right: rem(25px);

  &:last-of-type {
    padding-bottom: 0;
  }
}

.genres-picker__name {
  position: relative;

  font-size: rem(16px);

  cursor: pointer;

  &:before {
    position: absolute;
    top: calc(50% - #{rem(1px)});
    left: rem(-25px);

    width: rem(20px);
    height: rem(2px);

    background: $color-primary;

    content: '';
  }
}
</style>
