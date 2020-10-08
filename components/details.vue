<template>
  <section v-if="renderComponent" class="details__container">
    <template v-for="(item, index) in [firstData, secondData]">
      <section ref="details" class="details" :class="`details-${index}`" :key="index">
        <h2 class="heading heading details__title">
          {{ item.title }}
        </h2>
        <div class="details__sub-text">
          <span class="heading details__duration">{{ item.duration }}</span>
          <span class="subheading details__director">{{ item.director }}</span>
        </div>

        <p class="paragraph details__summary-short">
          {{ item.short_summary }}
        </p>
        <ul class="details__action">
          <IconButton v-for="(iconItem, index) in icons" :key="index" :data="iconItem"/>
        </ul>
      </section>
    </template>
  </section>
</template>

<script>
import { gsap } from 'gsap'
import data from '~/static/data/content.json'
import IconButton from '~/components/buttons/icon.vue'

export default {
  components: {
    IconButton
  },

  data () {
    return {
      data,
      currentItem: 0,
      firstData: {},
      secondData: {},
      renderComponent: true,
      timelines: {
        intro: gsap.timeline({ paused: true, delay: 1.3 }),
        click: gsap.timeline({ paused: true }),
        startDragging: gsap.timeline({ paused: true }),
        endDragging: gsap.timeline({ paused: true })
      },
      icons: [
        {
          icon: 'play',
          action: 'play'
        },
        {
          icon: 'plus',
          action: 'play'
        },
        {
          icon: 'heart',
          action: 'play'
        }
      ]
    }
  },

  watch: {
    '$store.state.rotate.currentIndex': {
      handler (newValue) {
        this._contentChangeHandler(newValue)
      }
    },

    '$store.state.rotate.dragging': {
      handler (draggingBoolean) {
        this._isDraggingHandler(draggingBoolean)
      }
    },

    '$store.state.preloader.loaded': {
      handler () {
        this.timelines.intro.play()
      }
    }
  },

  mounted () {
    this._setup()
    this.$nextTick(() => this._setUpTimelines())
  },

  methods: {
    _setup () {
      const currentIndex = this.$store.state.rotate.currentIndex
      this.firstData = data.content[currentIndex]
      this.secondData = data.content[currentIndex]
    },

    _playClickAnimation () {
      if (this.$store.state.rotate.dragging) return

      this.timelines.click.play(0.0)
    },

    _setUpTimelines () {
      const startDegrees = 25
      const tlIntro = this.timelines.intro
      const firstItem = this.$refs.details[0]
      const secondItem = this.$refs.details[1]

      // Timeline when page loads
      gsap.set([firstItem, secondItem], { rotate: startDegrees, opacity: 0.0 })
      tlIntro.to(firstItem, { rotate: 0.0, opacity: 1.0, duration: 1.5 }, 0.0)
      tlIntro.to(firstItem, { rotate: 0.0, opacity: 1.0, duration: 1.5 }, 0.0)

      // Timeline when user clicks on arrow or cover
      const tlClick = this.timelines.click
      tlClick.to(firstItem, { rotate: -startDegrees, opacity: 0.0, duration: 0.5 }, 0.0)
      tlClick.to(secondItem, { rotate: 0.0, opacity: 1.0, duration: 0.7 }, 0.0)
      tlClick.set(firstItem, { rotate: startDegrees, opacity: 0.0 }, 0.6)

      // Timeline when dragging starts
      const tlStartDragging = this.timelines.startDragging
      tlStartDragging.set(secondItem, { opacity: 0.0 }, 0.0)
      tlStartDragging.to(firstItem, { opacity: 0.0, duration: 0.7 }, 0.0)

      // Timeline when dragging ends
      const tlEndDragging = this.timelines.endDragging
      tlEndDragging.set(firstItem, { rotate: startDegrees }, 0.0)
      tlEndDragging.to(secondItem, { rotate: 0.0, opacity: 1.0, duration: 0.5 }, 0.0)
    },

    _changeItemData (index) {
      this.firstData = this.secondData
      this.secondData = this.data.content[index]
    },

    // Handlers
    _contentChangeHandler (index) {
      this._changeItemData(index)
      this._playClickAnimation()
    },

    _isDraggingHandler (draggingBoolean) {
      draggingBoolean ? this.timelines.startDragging.play(0) : this.timelines.endDragging.play(0)
    },

    _forceRerender () {
      this.renderComponent = false

      this.$nextTick(() => {
        this.renderComponent = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.details__container {
  z-index: 3;
}

.details {
  position: absolute;
  top: 50%;
  right: 0;

  width: calc(5vw + #{rem(300px)});

  padding-right: 5vw;

  color: $color-white;

  z-index: 2;
  transform: translateY(-50%);
  transform-origin: right center;

  &-1 {
    opacity: 0.0;
  }
}
.details__title {
  font-size: rem(35px);

  padding-bottom: rem(25px);
}

.details__sub-text {
  display: flex;
}

.details__duration {
  padding-right: rem(15px);
}

.details__duration, .details__director {
  font-size: rem(16px);

  padding-bottom: rem(15px);
}

.details__summary-short {
  padding-bottom: rem(15px);
}

.details__action {
  display: flex;
}

@include mq-wide {
  .details {
    width: calc(10vw + #{rem(400px)});
  }
}
</style>
