<template>
  <div ref="cover" class="rotation-cover" @mouseover="_coverMouseOverHandler" @mouseleave="_coverMouseLeaveHandler">
    <div ref="loading" class="rotation-cover__loading" />
    <div v-if="coverImage && coverVideo" class="rotation-cover__media-container">
      <video
        ref="video"
        class="rotation-cover__video"
        :src="coverVideo"
        type="video/mp4"
        paused />
      <img ref="image" :src="coverImage" :alt="$props.data.cover.alt" class="rotation-cover__image">
    </div>
    <div ref="watched_bar" class="rotation-cover__watched">
      <span ref="watched_amount" class="rotation-cover__watched-amount" :style="setWidth" />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    index: {
      type: Number,
      default: 0,
      coverImage: ''
    },
    data: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      timelines: {
        intro: gsap.timeline({ paused: true }),
        startDragging: gsap.timeline({ paused: true }),
        stopDragging: gsap.timeline({ paused: true }),
        next: gsap.timeline({ paused: true })
      },
      isInRestState: true
    }
  },

  computed: {
    coverImage () {
      return `/media/covers/${this.$props.data.cover.path}`
    },

    coverVideo () {
      return `/media/trailers/${this.$props.data.trailer.path}`
    },

    setWidth () {
      return `width: ${this.$props.data.watched_duration}%`
    }
  },

  watch: {
    '$store.state.sound.muted': {
      handler (muted) {
        this._muteVideoToggler(muted)
      }
    }
  },

  mounted () {
    this._setUpTimelines()
  },

  methods: {
    // Public
    playIntroAnimation () {
      this.timelines.intro.play()
    },

    playCurrentAnimation () {
      this._createCurrentTimeline()
      this.isInRestState = false
    },

    playNextAnimation () {
      if (this.isInRestState) return

      this.timelines.next.restart()
      this.isInRestState = true
    },

    playDraggingStartAnimation () {
      this.timelines.startDragging.play()
    },

    _setUpTimelines () {
      const cover = this.$refs.cover
      const image = this.$refs.image
      const video = this.$refs.video
      const loading = this.$refs.loading
      const watchedBar = this.$refs.watched_bar
      const watchedAmount = this.$refs.watched_amount

      // Intro timeline
      const tlIntro = this.timelines.intro
      tlIntro.eventCallback('onComplete', this._onCompleteTimelineHandler, [tlIntro])
      gsap.set(cover, { scale: 0.8 })
      gsap.set([watchedBar, watchedAmount], { scaleX: 0.0, opacity: 0 })
      gsap.set([image, video], { opacity: 0 })

      tlIntro.to(image, { opacity: 1.0, duration: 0.7 }, 0.6)
      tlIntro.to(cover, { scale: 0.8, opacity: 0.2, duration: 0.5 }, 0.3)
      tlIntro.to(loading, { opacity: 0.0, duration: 0.4 }, 0.6)
      if (this.$props.data.watched_duration > 0) tlIntro.to(watchedBar, { opacity: 1.0, scaleX: 1.0, duration: 1.0 }, 1.3)
      tlIntro.to(watchedAmount, { opacity: 1.0, scaleX: 1.0, duration: 0.5 }, 2.3)

      // Play next timeline
      const tlNext = this.timelines.next
      tlNext.add(this._pauseVideo, 0.0)
      tlNext.to(cover, { scale: 0.8, opacity: 0.2, duration: 1.0 }, 0.1)
      tlNext.to(video, { opacity: 0.0, duration: 0.2 }, 0.1)
      tlNext.to(image, { opacity: 1.0, duration: 0.5 }, 0.3)

      // When user starts dragging timeline
      const tlStartDragging = this.timelines.startDragging
      tlStartDragging.add(this._pauseVideo, 0.0)
      tlStartDragging.to(image, { opacity: 1.0, duration: 0.3 }, 0.2)
      tlStartDragging.to(cover, { duration: 0.5, x: 0.0, opacity: 0.2, scale: 0.8 }, 0.2)
      tlStartDragging.to(video, { opacity: 0.0, duration: 0.3 }, 0.3)

      // When user ends dragging timeline
      const tlEndDragging = this.timelines.stopDragging
      tlEndDragging.to(cover, { duration: 0.3, scale: 0.8, delay: 0.4 })
    },

    _createCurrentTimeline () {
      const cover = this.$refs.cover
      const image = this.$refs.image
      const video = this.$refs.video
      const loading = this.$refs.loading

      // Play current active timeline
      const tlCurrent = gsap.timeline({ paused: true })
      tlCurrent.eventCallback('onComplete', this._onCompleteTimelineHandler, [tlCurrent])
      tlCurrent.to(image, { opacity: 1.0, duration: 0.4 }, 0.0)
      tlCurrent.to(cover, { ease: 'power3.out', opacity: 1.0, duration: 2.5 }, 0.1)
      tlCurrent.to(loading, { opacity: 0.0 }, 0.2)
      tlCurrent.to(cover, { scale: 1.2, ease: 'power1.inOut', duration: 0.8 }, 0.2)
      tlCurrent.to(image, { opacity: 0.0, duration: 0.6 }, 1.4)
      tlCurrent.add(this._playVideo, 1.8)
      tlCurrent.set(video, { opacity: 1.0 }, 1.4)

      tlCurrent.play()
    },

    _playVideo () {
      this.$refs.video.play()
    },

    _pauseVideo () {
      this.$refs.video.pause()
      this.$refs.video.currentTime = 0
    },

    _onCompleteTimelineHandler (timeline) {
      timeline.kill()
    },

    // Handlers
    _coverMouseOverHandler () {
      if (this.$store.state.rotate.dragging || this.$props.index === this.$store.state.rotate.currentIndex) return

      gsap.to(this.$refs.cover, { opacity: 0.8, duration: 0.2 })
    },

    _muteVideoToggler (muted) {
      muted ? this.$refs.video.muted = true : this.$refs.video.muted = false
    },

    _coverMouseLeaveHandler () {
      if (this.$props.index === this.$store.state.rotate.currentIndex) return

      gsap.to(this.$refs.cover, { opacity: 0.2, duration: 0.3 })
    }
  }
}
</script>

<style lang="scss" scoped>
.rotation-cover {
  position: absolute;
  top: 50%;
  right: 0;

  height: rem(200px);
  width: rem(356px);

  transform: translateY(-50%);
}

.rotation-cover__media-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;

  border-radius: rem(10px);

  overflow: hidden;
}

.rotation-cover__loading {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: $color-dark;

  z-index: 3;
}

.rotation-cover__image {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
}

.rotation-cover__watched {
  position: absolute;
  bottom: rem(-10px);
  left: 5%;

  width: 90%;
  height: 3px;

  background: $color-grey;

  &-amount {
    position: absolute;
    top: -1px;
    left: 0;

    height: 5px;

    background: $color-primary;

    transform-origin: left;
  }
}
</style>
