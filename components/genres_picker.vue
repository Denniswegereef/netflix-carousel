<template>
  <section class="genres-picker">
    <ul>
      <li v-for="(item, index) in data.genres" :key="index" ref="item" class="genres-picker__item">
        {{ item.name }}
      </li>
    </ul>
  </section>
</template>

<script>
import data from '~/static/data/genres.json'

export default {
  data () {
    return {
      data
    }
  },

  mounted () {
    console.log('')
  }
}
</script>

<style lang="scss" scoped>
li {
  color: $color-white;
}
</style>
