<template>
  <div>
    <GenresPicker />
    <RotationModule />
  </div>
</template>

<script>
import GenresPicker from '~/components/genres_picker.vue'
import RotationModule from '~/components/rotation_module.vue'

export default {
  components: {
    GenresPicker,
    RotationModule
  },

  mounted () {
  }
}
</script>

<style lang="scss" scoped>
h1 {
  span {
    color: red;
  }
}
</style>
