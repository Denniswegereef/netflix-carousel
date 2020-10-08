<template>
  <div ref="cover" class="rotation-cover">
    <div ref="loading" class="rotation-cover__loading" />
    <div v-if="coverImage && coverVideo" class="rotation-cover__media-container">
      <video
        ref="video"
        class="rotation-cover__video"
        :src="coverVideo"
        type="video/mp4"
        muted
        paused />
      <img ref="image" :src="coverImage" :alt="$props.data.cover.alt" class="rotation-cover__image">
    </div>
    <div ref="watched_bar" class="rotation-cover__watched">
      <span ref="watched_amount" class="rotation-cover__watched-amount" :style="setWidth"/>
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
        // setCurrent: gsap.timeline({ paused: true }),
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

  mounted () {
    this._setUpTimelines()
  },

  methods: {
    // Public

    playIntroAnimation () {
      this.timelines.intro.play()
    },

    playCurrentAnimation () {
      // console.log(this)
      this._createCurrentTimeline()
      this.isInRestState = false
    },

    playNextAnimation () {
      if (this.isInRestState) return

      console.log(this.$props.index)
      this.timelines.next.restart()
      this.isInRestState = true
    },

    playDraggingStartAnimation () {
      this.timelines.startDragging.play()
    },

    playDraggingEndAnimation () {
      // if (this.$store.state.rotate.currentIndex === this.$props.index) return

      // this.timelines.stopDragging.play()
    },

    // Private
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

      tlIntro.to(image, { opacity: 1.0, duration: 0.3 }, 0.4)
      tlIntro.to(cover, { scale: 0.8, duration: 0.5 }, 0.5)
      tlIntro.to(loading, { opacity: 0.0, duration: 0.8 }, 0.8)
      if (this.$props.data.watched_duration > 0) tlIntro.to(watchedBar, { opacity: 1.0, scaleX: 1.0, duration: 1.0 }, 1.3)
      tlIntro.to(watchedAmount, { opacity: 1.0, scaleX: 1.0, duration: 0.5 }, 2.3)

      // Play next timeline
      const tlNext = this.timelines.next
      tlNext.add(this._pauseVideo, 0.0)
      tlNext.to(cover, { scale: 0.8, duration: 1.0 }, 0.1)
      tlNext.to(video, { opacity: 0.0, duration: 0.2 }, 0.1)
      tlNext.to(image, { opacity: 1.0, duration: 0.5 }, 0.3)

      // When user starts dragging timeline
      const tlStartDragging = this.timelines.startDragging
      // tlStartDragging.eventCallback('onComplete', this._onCompleteTimelineHandler, [tlStartDragging])
      tlStartDragging.add(this._pauseVideo, 0.0)
      tlStartDragging.to(image, { opacity: 1.0, duration: 0.3 }, 0.2)
      tlStartDragging.to(cover, { duration: 0.5, scale: 0.8 }, 0.2)
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
      tlCurrent.to(cover, { duration: 0.5, scale: 1.2 }, 0.5)
      tlCurrent.set(video, { opacity: 1.0 }, 0.6)
      tlCurrent.to(loading, { opacity: 0.0 }, 0.8)
      tlCurrent.add(this._playVideo, 1.0)
      tlCurrent.to(image, { opacity: 0 }, 1.2)

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

    // width: 40%;
    height: 5px;

    background: $color-primary;

    transform-origin: left;
  }
}
</style>
