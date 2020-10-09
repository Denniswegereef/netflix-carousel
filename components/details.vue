<template>
  <section v-if="renderComponent" class="details__container">
    <template v-for="(item, index) in [firstData, secondData]">
      <section ref="details" :key="index" class="details" :class="`details-${index}`">
        <h2 ref="title" class="heading heading details__title">
          {{ item.title }}
        </h2>
        <div class="details__sub-text">
          <span ref="duration" class="heading details__duration">{{ item.duration }}</span>
          <span ref="director" class="subheading details__director">{{ item.director }}</span>
        </div>

        <p ref="summary" class="paragraph details__summary-short">
          {{ item.short_summary }}
        </p>
        <ul class="details__action">
          <IconButton v-for="(iconItem, i) in icons" :key="i" ref="button" :data="iconItem" />
        </ul>
      </section>
    </template>
  </section>
</template>

<script>
import { gsap } from 'gsap'
import { SplitText } from '../plugins/SplitText'
import data from '~/static/data/content.json'
import IconButton from '~/components/buttons/icon.vue'

if (process.client) gsap.registerPlugin(SplitText)

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
        intro: gsap.timeline({ paused: true, delay: 2.6 }),
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
      // const startDegrees = 0
      const tlIntro = this.timelines.intro

      const arr = []
      const halfButtons = Math.ceil(this.$refs.button.length / 2)
      const firstButtons = this.$refs.button.splice(0, halfButtons)
      const secondButtons = this.$refs.button.splice(-halfButtons)

      /* eslint-disable */
      for (let i = 0; i < this.$refs.details.length; i++) {
        arr.push({
          item: this.$refs.details[i],
          title: this.$refs.title[i],
          duration: this.$refs.duration[i],
          director: this.$refs.director[i],
          summary: this.$refs.summary[i],
          buttons: i === 0 ? firstButtons.map(item => item.$el) : secondButtons.map(item => item.$el)
        })
      }
      /* eslint-enable */

      const first = arr[0]
      const second = arr[1]

      const firstSplitted = new SplitText(first.summary, { type: 'lines' })
      const secondSplitted = new SplitText(second.summary, { type: 'lines' })

      // Timeline when page loads
      tlIntro.from(first.title, { opacity: 0.0, y: 15.0, ease: 'power2.out', duration: 0.8 }, 0.3)
      tlIntro.from([first.duration, first.director], { opacity: 0.0, y: -10, ease: 'power2.out', stagger: 0.1 }, 0.6)
      tlIntro.from(firstSplitted.lines, { opacity: 0.0, x: 5.0, ease: 'power2.out', stagger: 0.2 }, 1.0)
      tlIntro.from(first.buttons, { opacity: 0.0, y: -10, stagger: 0.2 }, 1.5)

      // Timeline when user clicks on arrow or cover
      const tlClick = this.timelines.click
      tlClick.set(second.item, { opacity: 1.0 }, 0.0)
      tlClick.to(first.item, { opacity: 0.0, y: 20.0, ease: 'power2.out', duration: 0.3 }, 0.0)
      tlClick.from(second.title, { opacity: 0.0, y: 15.0, ease: 'power2.out', duration: 0.8 }, 0.3)
      tlClick.from([second.duration, second.director], { opacity: 0.0, y: -10, ease: 'power2.out', stagger: 0.1 }, 0.6)
      tlClick.from(secondSplitted.lines, { opacity: 0.0, x: 5.0, ease: 'power2.out', stagger: 0.15 }, 1.0)
      tlClick.from(second.buttons, { opacity: 0.0, y: -10, stagger: 0.2 }, 1.5)

      // Timeline when dragging starts
      const tlStartDragging = this.timelines.startDragging
      tlStartDragging.set(second.item, { opacity: 0.0 }, 0.0)
      tlStartDragging.to(first.item, { opacity: 0.0, y: 20.0, ease: 'power2.out', duration: 0.3 }, 0.0)

      // Timeline when dragging ends
      const tlEndDragging = this.timelines.endDragging
      tlEndDragging.set(second.item, { opacity: 1.0 }, 0.0)
      tlEndDragging.fromTo(second.title, { opacity: 0.0, y: 15.0 }, { opacity: 1.0, y: 0.0, ease: 'power2.out', duration: 0.8 }, 0.3)
      tlEndDragging.fromTo([second.duration, second.director], { opacity: 0.0, y: -10 }, { opacity: 1.0, y: 10.0, ease: 'power2.out', stagger: 0.1 }, 0.6)
      tlEndDragging.fromTo(secondSplitted.lines, { opacity: 0.0, x: 5.0 }, { opacity: 1.0, x: 0.0, ease: 'power2.out', stagger: 0.15 }, 1.0)
      tlEndDragging.fromTo(second.buttons, { opacity: 0.0, y: -10 }, { opacity: 1.0, y: 0.0, stagger: 0.2 }, 1.5)
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
      draggingBoolean ? this.timelines.startDragging.play(0) : this.timelines.endDragging.restart()
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

  width: rem(300px);

  margin-right: 5vw;

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
  line-height: rem(45px);

  padding-bottom: rem(15px);
}

.details__sub-text {
  display: flex;
}

.details__duration {
  padding-right: rem(15px);
}

.details__duration, .details__director {
  font-size: rem(16px);

  padding-bottom: rem(25px);
}

.details__summary-short {
  padding-bottom: rem(30px);
}

.details__action {
  display: flex;
}

@include mq-wide {
  .details {
    width: rem(400px);
  }
}
</style>
