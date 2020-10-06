<template>
  <div ref="cover" class="rotation-cover">
    <!-- {{ $props.index }} -->
     <img :src="coverImage" :alt="$props.data.cover.alt" class="rotation-cover__image"/>
     {{ $props.data.cover.path }}
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    coverImage () {
      return `/media/covers/${this.$props.data.cover.path}`
    }
  },

  data () {
    return {
      timelines: {
        setCurrent: gsap.timeline({ paused: true }),
        isDragging: gsap.timeline({ paused: true }),
        stopDragging: gsap.timeline({ paused: true })
      }
    }
  },

  mounted () {
    this._setUpTimelines()
  },

  methods: {
    // Public
    playCurrentAnimation () {
      this.timelines.setCurrent.play(0)
    },

    playDraggingStartAnimation () {
      this.timelines.isDragging.play(0)
    },

    playDraggingEndAnimation () {
      if (this.$store.state.rotate.currentIndex === this.$props.index) return

      this.timelines.stopDragging.play(0)
    },

    // Private
    _setUpTimelines () {
      const tlCurrent = this.timelines.setCurrent
      tlCurrent.to(this.$refs.cover, { duration: 0.5, scale: 1.5 })

      const tlStartDragging = this.timelines.isDragging
      tlStartDragging.to(this.$refs.cover, { duration: 1.0, scale: 0.8 })

      const tlEndDragging = this.timelines.stopDragging
      tlEndDragging.to(this.$refs.cover, { duration: 0.3, scale: 1.0, delay: 0.1 })
    }
  }
}
</script>

<style lang="scss" scoped>
.rotation-cover {
  position: absolute;
  top: 50%;
  right: 0;

  height: 200px;
  width: 330px;

  background: blue;
  transform: translateY(-50%);
}

.rotation-cover__image {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
}
</style>
