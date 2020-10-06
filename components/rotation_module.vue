<template>
  <section class="rotation">
    <div ref="disc" class="rotation__disc">

      <div class="rotation__disc-inner" />

      <ul ref="list_container" class="rotation__list">
        <li v-for="(item, index) in data.content" :key="index" ref="item" class="rotation__list-item">
          <div @click="() => _containerClickHandler(index)" class="rotation__item-container">
            <div class="rotation__item-cover">
            <RotationCover :index="index" :data="item" ref="rotation_cover" />
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
        this._rotateToIndex(this.$store.state.rotate.currentIndex, newValue, oldValue)
      }
    },

    '$store.state.rotate.dragging': {
      handler (newValue) {
        this._isDraggingAnimation(newValue)
      }
    }
  },

  mounted () {
    gsap.set(this.$refs.disc, { opacity: 0 })
    this._setUpTimelines()
    this._createDragInstance()
    this._placeCirclesCirculair()

    setTimeout(() => {
      this.timelines.intro.play()
    }, 500)
  },

  methods: {
    _setUpTimelines () {
      const tlIntro = this.timelines.intro

      tlIntro.to(this.$refs.disc, { duration: 0.5, opacity: 1 })
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
      this.$refs.list_container.style.transform = `rotate(${90}deg)`

      for (let i = 0; i < this.itemCount; i++) {
        const x = Math.round(discRadius + discRadius * Math.cos(angle) - itemBounding.width / 2)
        const y = Math.round(discRadius + discRadius * Math.sin(angle) - itemBounding.height / 2)

        gsap.set(this.$refs.item[i], { rotate: i * this.stepDegrees + -90, x, y })

        angle += stepRadius
      }
    },

    _rotateToIndex (index, newValue, oldValue) {
      if (this.$store.state.rotate.dragging) return

      const currentAngle = index * this.stepDegrees * -1

      if (newValue === this.itemCount - 1) gsap.to(this.$refs.disc, { duration: 0.5, rotate: this.stepDegrees })
      else if (newValue === 0 && newValue > 0) gsap.from(this.$refs.disc, { duration: 0.5, rotate: 0 })
      else gsap.to(this.$refs.disc, { duration: 0.5, rotate: currentAngle })
    },

    _snapFromDrag (endValue) {
      const currentDegrees = Math.floor(endValue / this.stepDegrees) * this.stepDegrees

      // Flip numbers to work for the module
      const currentNumber = currentDegrees / this.stepDegrees
      const currentIndex = currentNumber - (currentNumber) * 2
      this.$store.commit('rotate/setIndex', modulo(currentIndex, this.itemCount))

      return currentDegrees
    },

    _isDraggingAnimation (dragging) {
      for (let i = 0; i < this.$refs.rotation_cover.length; i++) dragging ? this.$refs.rotation_cover[i].playDraggingStartAnimation() : this.$refs.rotation_cover[i].playDraggingEndAnimation()
    },

    _isDraggingCurrentAnimation () {
      this.$refs.rotation_cover[this.$store.state.rotate.currentIndex].playCurrentAnimation()
    },

    // Handlers
    _containerClickHandler (index) {
      this.$store.commit('rotate/setIndex', index)
    },

    _draggableDragStartHandler () {
      this.$store.commit('rotate/setDrag', true)
    },

    _draggableThrowCompleteHandler () {
      this.$store.commit('rotate/setDrag', false)
      this._isDraggingCurrentAnimation()
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
  cursor: pointer;
}

.rotation__disc-inner {
  position: absolute;

  height: 119vh;
  width: 119vh;

  border-radius: 130vh;
  border: rem(3px) solid $color-secondary;

  opacity: 0.3;
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
