<template>
  <section class="details">
    <h2 class="details__title">{{ currentData.title }}</h2>
    <div class="details__sub-text">
      <span class="details__duration">{{ currentData.duration }}</span>
      <span class="details__director">{{ currentData.director }}</span>
    </div>

    <p class="details__summary-short">
      {{ currentData.short_summary }}
    </p>
    <div class="details__action">
      -- play
      -- add
      -- like
    </div>
  </section>
</template>

<script>
import data from '~/static/data/content.json'

export default {
  watch: {
    '$store.state.rotate.currentIndex': {
      handler () {
        this._contentChangeHandler()
      }
    }
  },

  data () {
    return {
      data,
      currentItem: 0,
      currentData: ''
    }
  },

  mounted () {
    this._changeItemData(this.currentItem)
  },

  methods: {
    _changeItemData (index) {
      this.currentData = data.content[index]
    },

    // Handlers

    _contentChangeHandler () {
      this._changeItemData(this.$store.state.rotate.currentIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  width: rem(500px);
  height: rem(100px);

  margin-right: 5vw;

  z-index: 2;

  color: $color-white;
}
</style>
