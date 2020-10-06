<template>
  <section class="arrows">
    <div @click="_arrowUpHandler" class="arrows__single arrows__up" />
    <div @click="_arrowDownHandler" class="arrows__single arrows__down" />
  </section>
</template>

<script>
import data from '~/static/data/content.json'
import modulo from '~/helpers/modulo'

export default {
  data () {
    return {
      data
    }
  },

  methods: {
    _arrowUpHandler () {
      this.$store.commit('rotate/setIndex', modulo(this.$store.state.rotate.currentIndex + 1, this.data.content.length))
    },

    _arrowDownHandler () {
      this.$store.commit('rotate/setIndex', modulo(this.$store.state.rotate.currentIndex - 1, this.data.content.length))
    }
  }
}
</script>

<style lang="scss" scoped>
.arrows {
  position: absolute;
  top: 50%;
  left: 200px;
}

.arrows__single {
  width: 0;
  height: 0;
  border-left: rem(15px) solid transparent;
  border-right: rem(15px) solid transparent;

  border-bottom: rem(20px) solid $color-primary;

  transition: border-bottom-color .3s;

  cursor: pointer;

  &:hover {
    border-bottom-color: blue;
  }
}

.arrows__up {
  margin-bottom: rem(25px);
}

.arrows__down {
  transform: rotate(180deg);
}
</style>
