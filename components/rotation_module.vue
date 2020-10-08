<template>
  <section class="rotation">
    <div ref="disc" class="rotation__disc">
      <div ref="disc_inner" class="rotation__disc-inner" />

      <ul ref="list_container" class="rotation__list">
        <li v-for="(item, index) in data.content" :key="index" ref="item" class="rotation__list-item">
          <div class="rotation__item-container" @click="() => _containerClickHandler(index)">
            <div class="rotation__item-cover">
              <RotationCover ref="rotation_cover" :index="index" :data="item" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { gsap } from 'gsap'
import { Draggable } from 'gsap/dist/Draggable.js'
import { InertiaPlugin } from '../plugins/InertiaPlugin'
import modulo from '../helpers/modulo'

import RotationCover from '~/components/partials/rotation_cover.vue'

import data from '~/static/data/content.json'

if (process.client) gsap.registerPlugin(Draggable, InertiaPlugin)

export default {
  components: {
    RotationCover
  },

  data () {
    return {
      data,
      itemCount: 0,
      stepDegrees: 0,
      timelines: {
        intro: gsap.timeline({ paused: true })
      }
    }
  },

  watch: {
    '$store.state.rotate.currentIndex': {
      handler (newValue, oldValue) {
        console.log(`new ${newValue} -  old ${oldValue}`)
        this._clickNextAnimation()
        this._rotateToIndex(this.$store.state.rotate.currentIndex, newValue, oldValue)
      }
    },

    '$store.state.rotate.dragging': {
      handler (draggingBoolean) {
        console.log(draggingBoolean)
      }
    },

    '$store.state.preloader.loaded': {
      handler () {
        this.timelines.intro.play()
      }
    }
  },

  mounted () {
    this._setUpTimelines()
    this._createDragInstance()
    this._placeCirclesCirculair()
  },

  methods: {
    _setUpTimelines () {
      const tlIntro = this.timelines.intro
      const currentIndex = this.$store.state.rotate.currentIndex

      tlIntro.to(this.$refs.list_container, { rotate: 90, duration: 1.5 }, 1.3)
      tlIntro.to(this.$refs.disc, { opacity: 1.0, duration: 0.5 }, 1.7)
      tlIntro.to(this.$refs.disc_inner, { opacity: 0.3, duration: 3 }, 2.0)
      tlIntro.add(this._callCoverFirstTimelines, 2.0)
      tlIntro.add(this.$refs.rotation_cover[currentIndex].playCurrentAnimation, 2.0)
    },

    _callCoverFirstTimelines () {
      for (let i = 0; i < this.$refs.rotation_cover.length; i++) if (i !== this.$store.state.rotate.currentIndex) this.$refs.rotation_cover[i].playIntroAnimation()
    },

    _createDragInstance () {
      Draggable.create(this.$refs.disc, {
        type: 'rotation',
        inertia: true,
        trigger: this.$refs.item,
        onDragStart: this._draggableDragStartHandler,
        onThrowComplete: this._draggableThrowCompleteHandler,
        snap: this._draggableSnapHandler
      })
    },

    _placeCirclesCirculair () {
      // https://stackoverflow.com/questions/10152390/dynamically-arrange-some-elements-around-a-circle

      this.itemCount = this.data.content.length
      this.stepDegrees = 360 / this.itemCount

      const stepRadius = (2 * Math.PI) / this.itemCount
      const discRadius = this.$refs.disc.getBoundingClientRect().width / 2
      const itemBounding = this.$refs.item[0].getBoundingClientRect()
      let angle = Math.PI / 2

      // Rotate container a bit back to align it left
      gsap.set(this.$refs.disc, { yPercent: -50 })

      for (let i = 0; i < this.itemCount; i++) {
        const x = Math.round(discRadius + discRadius * Math.cos(angle) - itemBounding.width / 2)
        const y = Math.round(discRadius + discRadius * Math.sin(angle) - itemBounding.height / 2)

        gsap.set(this.$refs.item[i], { rotate: i * this.stepDegrees + -90, x, y })

        angle += stepRadius
      }
    },

    _rotateToIndex (index, newValue, oldValue) {
      const disc = this.$refs.disc
      const oldAngle = oldValue * this.stepDegrees * -1
      let currentAngle = index * this.stepDegrees * -1

      // Some checks to make the ferris wheel rotate the good direction
      if (newValue === this.itemCount - 1 && oldValue === 0) currentAngle = 360 - (currentAngle * -1)
      if (currentAngle === 0 && oldValue === this.itemCount - 1) currentAngle = `-=${this.stepDegrees}`
      if (currentAngle === 0 && oldValue > 0) currentAngle = `+=${this.stepDegrees}`

      gsap.fromTo(disc, { rotate: oldAngle }, { duration: 0.5, rotate: currentAngle })
    },

    _snapFromDrag (endValue) {
      const currentDegrees = Math.floor(endValue / this.stepDegrees) * this.stepDegrees

      // Flip numbers to work for the module
      const currentNumber = currentDegrees / this.stepDegrees
      const currentIndex = currentNumber - (currentNumber) * 2
      this.$store.commit('rotate/setIndex', modulo(currentIndex, this.itemCount))

      return currentDegrees
    },

    _isDraggingAnimation (draggingBoolean) {
      // for (let i = 0; i < this.$refs.rotation_cover.length; i++) this.$refs.rotation_cover[i].playDraggingStartAnimation()
    },

    _isDraggingStopAnimation () {
      for (let i = 0; i < this.$refs.rotation_cover.length; i++) this.$refs.rotation_cover[i].playDraggingEndAnimation()
    },

    _isDraggingCurrentAnimation () {
      this.$refs.rotation_cover[this.$store.state.rotate.currentIndex].playCurrentAnimation()
    },

    _clickNextAnimation () {
      if (this.$store.state.rotate.dragging) return

      for (let i = 0; i < this.$refs.rotation_cover.length; i++) i !== this.$store.state.rotate.currentIndex ? this.$refs.rotation_cover[i].playNextAnimation() : this.$refs.rotation_cover[i].playCurrentAnimation()
    },

    // Handlers
    _containerClickHandler (index) {
      this.$store.commit('rotate/setIndex', index)
    },

    _draggableDragStartHandler () {
      this.$store.commit('rotate/setDrag', true)
      for (let i = 0; i < this.$refs.rotation_cover.length; i++) if (i === this.$store.state.rotate.currentIndex) this.$refs.rotation_cover[i].playDraggingStartAnimation()
    },

    _draggableThrowCompleteHandler () {
      this.$store.commit('rotate/setDrag', false)
      this.$refs.rotation_cover[this.$store.state.rotate.currentIndex].playCurrentAnimation()
    },

    _draggableSnapHandler (endValue) {
      return this._snapFromDrag(endValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.rotation {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;

  height: 100vh;
  width: 50vw;
}

.rotation__disc {
  position: absolute;
  top: 50%;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 150vh;
  width: 150vh;

  border-radius: 150vh;

  // background: linear-gradient(0deg, rgba(131,58,180, 0.2) 0%, rgba(253,29,29,0.2) 50%, rgba(252,176,69, 0.2) 100%);
  opacity: 0;
  cursor: pointer;
}

.rotation__disc-inner {
  position: absolute;

  height: 119vh;
  width: 119vh;

  border-radius: 130vh;
  border-left: rem(3px) solid $color-secondary;
  border-right: rem(3px) solid $color-secondary;

  opacity: 0.0;
}

.rotation__list {
  height: 100%;
  width: 100%;
}

.rotation__list-item {
  position: absolute;
}

.rotation__item-container {
  position: relative;

  height: 8vh;
  width: 8vh;
}
</style>
