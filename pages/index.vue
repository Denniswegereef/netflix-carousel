<template>
  <div class="home">
    <div class="home__container">
      <GenresPicker />
      <Arrows />
      <Details />
    </div>
    <RotationModule />
  </div>
</template>

<script>
import GenresPicker from '~/components/genres_picker.vue'
import Details from '~/components/details.vue'
import Arrows from '~/components/buttons/arrows.vue'
import RotationModule from '~/components/rotation_module.vue'

export default {
  components: {
    GenresPicker,
    Arrows,
    Details,
    RotationModule
  },

  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.home__container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 100vh;
  width: 100%;
}
</style>
