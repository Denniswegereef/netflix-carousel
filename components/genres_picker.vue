<template>
  <div>
    <h1 class="heading">
      Genres picker
    </h1>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { Draggable } from 'gsap/dist/Draggable.js'
import { InertiaPlugin } from '../plugins/InertiaPlugin'

if (process.client) gsap.registerPlugin(Draggable, InertiaPlugin)

export default {
  mounted () {
    console.log('hello from genre')
  }
}
</script>

<style>

</style>
